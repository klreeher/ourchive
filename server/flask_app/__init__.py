from flask import Flask, render_template, send_file, send_from_directory, request
import json
from flask_tus import tus_manager
from flask_cors import CORS
import bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
import redis
from file_storage import FileStorage
from s3_storage import S3Storage
from elasticsearch import Elasticsearch
from elasticsearch_dsl import connections
from pathlib import Path
import yaml

app = Flask(__name__)

app_settings = os.getenv(
    'APP_SETTINGS',
    'server.config.DevelopmentConfig'
)
app.config.from_object(app_settings)

if app.config.get('UPLOAD_TYPE') == 'file':
  storage = FileStorage(app.config.get('UPLOAD_FOLDER'))
elif app.config.get('UPLOAD_TYPE') == 'aws':
  storage = S3Storage(app.config.get('AWS_BUCKET'))

tm = tus_manager(app, upload_url='/uploads', upload_folder=app.config.get('UPLOAD_FOLDER'), overwrite=True,
  upload_finish_cb=None, storage=storage)

db = SQLAlchemy(app)
redis_db = redis.StrictRedis(host=app.config.get('REDIS_SERVERNAME'), port=6379, db=0, password=app.config.get('REDIS_PASSWORD'))
es_client = Elasticsearch()
connections.create_connection(hosts=[app.config.get('ELASTICSEARCH_SERVERNAME')])

from .work import work as work_blueprint
app.register_blueprint(work_blueprint)

from .bookmark import bookmark as bookmark_blueprint
app.register_blueprint(bookmark_blueprint)

from .message import message as message_blueprint
app.register_blueprint(message_blueprint)

from .api import api as api_blueprint
app.register_blueprint(api_blueprint)

from .tag import tag as tag_blueprint
app.register_blueprint(tag_blueprint)

@app.route('/<path:stuff>/uploads/<path:filename>', methods=['GET'])
def download(stuff, filename):
  uploads = os.path.join(app.root_path, tm.upload_folder)
  return send_from_directory(directory=uploads, filename=filename)

@app.route('/audio/<string:audio_file>')
def audio(audio_file):
  return send_from_directory(filename=audio_file, directory='audio')

@app.before_first_request
def do_init():
	path = os.path.dirname(os.path.abspath(__file__))+"/seed.yml"
	my_file = Path(path)
	develop = True
	if my_file.is_file():
		with open(path, 'r') as stream:
		    try:
		    	objects = yaml.safe_load(stream)
		    	admin = user.logic.get_by_username('admin')
	    		if admin is None:
	    			user.logic.create_user('admin', objects['admin_pw'], objects['admin_email'], True)
		    	if objects['develop'] == False:
		    		develop = False
		    except yaml.YAMLError as exc:
		        print(exc)
		if develop is False:
			os.remove(path)

if __name__ == '__main__':
  app.run(debug=True)
