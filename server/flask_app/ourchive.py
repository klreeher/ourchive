from flask import Flask, render_template, send_file, send_from_directory, request
import json
from flask_tus import tus_manager
from flask_cors import CORS
import bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
from os import listdir
import redis
from file_storage import FileStorage
from s3_storage import S3Storage
from elasticsearch import Elasticsearch
from elasticsearch_dsl import connections
from pathlib import Path
import yaml
from flask_migrate import Migrate

class Ourchive(Flask):

    def configure(self, config):
        """
        Loads configuration class into flask app.
        If environment variable available, overwrites class config.

        """
        self.config.from_object(config)
        # could/should be available in server environment
        self.config.from_envvar("APP_CONFIG", silent=True)

    def configure_database(self):
        from database import db
        db.app = self
        db.init_app(self)
        self.migrate = Migrate(self, db)

    def setup(self):
        self.redis_db = redis.StrictRedis(host=self.config.get('REDIS_SERVERNAME'), port=6379, db=0, password=self.config.get('REDIS_PASSWORD'))
        self.es_client = Elasticsearch()
        connections.create_connection(hosts=[self.config.get('ELASTICSEARCH_SERVERNAME')])

        from work import work as work_blueprint
        self.register_blueprint(work_blueprint)

        from bookmark import bookmark as bookmark_blueprint
        self.register_blueprint(bookmark_blueprint)

        from message import message as message_blueprint
        self.register_blueprint(message_blueprint)

        from api import api as api_blueprint
        self.register_blueprint(api_blueprint)

        from tag import tag as tag_blueprint
        self.register_blueprint(tag_blueprint)
                
        @self.route('/<path:stuff>/data/<path:filename>', methods=['GET'])
        def download(stuff, filename):
          uploads = os.path.join(self.config.get('UPLOAD_FOLDER'))
          filename = filename #+ self.config.get('UPLOAD_SUFFIX')
          return send_from_directory(directory=uploads, filename=filename)

        @self.route('/')
        def homepage():
            from auth import logic as auth
            return render_template('index.html', csrf_token=auth.generate_csrf().decode())

        @self.route('/audio/<string:audio_file>')
        def audio(audio_file):
          return send_from_directory(filename=audio_file, directory='audio')

        @self.before_first_request
        def do_init():
            from user import logic as user_logic
            path = os.path.dirname(os.path.abspath(__file__))+"/seed.yml"
            my_file = Path(path)
            develop = True
            if my_file.is_file():
                with open(path, 'r') as stream:
                    try:
                        objects = yaml.safe_load(stream)
                        admin = user_logic.get_by_username('admin')
                        if admin is None:
                            user_logic.create_user('admin', objects['admin_pw'], objects['admin_email'], True)
                        if objects['develop'] == False:
                            develop = False
                    except yaml.YAMLError as exc:
                        print(exc)
                if develop is False:
                    os.remove(path)