from flask import Flask, render_template, send_file, send_from_directory, request
import json
from flask_tus import tus_manager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os
import redis

app = Flask(__name__)
CORS(app)

upload_folder = '/home/imp/projects/ourchive/server/flask_app/uploads'
tm = tus_manager(app, upload_url='/uploads', upload_folder=upload_folder)

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
redis_db = redis.StrictRedis(host="localhost", port=6379, db=0)

app_settings = os.getenv(
    'APP_SETTINGS',
    'server.config.DevelopmentConfig'
)
app.config.from_object(app_settings)

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

@tm.upload_file_handler
@app.route('/uploads', methods=['POST'])
def upload_file_hander( upload_file_path, filename ):
    app.logger.info( "doing something cool with {}, {}".format( upload_file_path, filename))
    return filename

@app.route('/uploads/<path:filename>', methods=['GET'])
def download(filename):
  uploads = os.path.join(app.root_path, tm.upload_folder)
  return send_from_directory(directory=uploads, filename=filename)


@app.route('/api/search/term/<string:searchTerm>')
def get_results(searchTerm):
  results = json.dumps(
    {
      "works" : [
        {
          "key": 1,
          "title": "a series of unfortunate dev choices",
          "name": "anastasia",
          "creator_id": 2,
          "chapter_count": 3,
          "is_complete": "false",
          "word_count": 100500,
          "work_summary": "some stuff happens"
        },
        {
          "key": 2,
          "title": "a series of unfortunate dev choices part 2",
          "name": "dimitri",
          "creator_id": 3,
          "chapter_count": 100,
          "is_complete": "false",
          "word_count": 500683,
          "work_summary": "M U R D E R ON THE FRONT"
        }
      ],
      "bookmarks" : [
        {
          "id": 5,
          "curator": {
            "curator_name": "sally",
            "curator_id": 2
          },
          "work": {
            "title": "sixteen guns in brixton",
            "creator": "e l dragons",
            "summary": "someBODY once told me the world is gonna roll me",
            "word_count": 550000,
            "is_complete": True,
            "chapter_count": 15
          },
          "curator_title": "a bookmark i loved",
          "rating": 4,
          "description": "this touched my heart and also I'm at war with the author now",
          "tags": [
            {"fandom": ["buffy", "xena"]},
            {"primary pairing": ["buffy/faith"]}
          ]
        }
      ]
    }
  )
  return results

@app.route('/api/logout/', methods=['POST'])
def logout():
  if not request.json:
    abort(400)
  return request.json["jwt"]

@app.route('/api/login/', methods=['POST'])
def login():
  if not request.json:
    abort(400)
  if request.json["userName"] is None:
    abort(400)
  if request.json["password"] is None:
    abort(400)
  return request.json["userName"] + request.json["password"]


@app.route('/audio/<string:audio_file>')
def audio(audio_file):
  return send_from_directory(filename=audio_file, directory='audio')

@app.route('/api/user/<int:userId>')
def get_user(userId):
  user = json.dumps(
      {
        "userName": "elena",
        "aboutMe": "HUNDRED YARD HATER",
        "lastLogin": "2017-07-04",
        "works_count": 25,
        "bookmarks_count": 30,
        "userId": 1,
        "works": [
        {
          "key": "1",
          "title": "a series of unfortunate dev choices",
          "name": "anastasia",
          "creator_id": 2,
          "chapter_count": 3,
          "is_complete": "false",
          "word_count": 100500,
          "work_summary": "some stuff happens"
        }],
        "bookmarks": []
      })
  return user

if __name__ == '__main__':
  app.run(debug=True)

