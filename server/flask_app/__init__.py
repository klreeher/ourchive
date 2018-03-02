from flask import Flask, render_template, send_file, send_from_directory, request
import json
from flask.ext.tus import tus_manager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)
tm = tus_manager(app, upload_url='/file-upload')

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

app_settings = os.getenv(
    'APP_SETTINGS',
    'server.config.DevelopmentConfig'
)
app.config.from_object(app_settings)

from .work import work as work_blueprint
app.register_blueprint(work_blueprint)

@tm.upload_file_handler
def upload_file_hander( upload_file_path, filename ):
    app.logger.info( "doing something cool with {}, {}".format( upload_file_path, filename))
    return filename

# serve the uploaded files
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

@app.route('/api/message/to/<int:userId>')
def get_inbox(userId):
  messages = json.dumps(
    [
      {
        "id": 1,
        "to_user": 2,
        "from_user": {
          "username": "molly",
          "userId": 3
        },
        "parent_id": 5,
        "read": False,
        "message_subject": "Your writing",
        "message_content": "it's so good but have you thought about including more entymology. bugs are good i like them. beetles especially."
      },
      {
        "id": 5,
        "to_user": 2,
        "read": True,
        "from_user": {
          "username": "joy",
          "userId": 4
        },
        "message_subject": "Please let me archive this",
        "message_content": "i'd like to put this on my webring, called Stuck in 2006, please let me know what you think. it's a good webring, we are obsessed with dolphins there, it's our favorite topic."
      }  
  ])
  return messages

@app.route('/api/message/from/<int:userId>')
def get_outbox(userId):
  messages = json.dumps(
    [
      {
        "id": 2,
        "from_user": {
          "username": "elena",
          "userId": 2
        },
        "read": True,
        "to_user": {
          "username": "molly",
          "userId": 3
        },
        "parent_id": 5,
        "message_subject": "re: Your writing",
        "message_content": "bugs are gross; no thanks."
      },
      {
        "id": 7,
        "from_user": {
          "username": "elena",
          "userId": 2
        },
        "read": True,
        "to_user": {
          "username": "joy",
          "userId": 4
        },
        "message_subject": "re: Please let me archive this",
        "message_content": "Hi, thank you so much! go ahead! I'd appreciate a link back to my profile once it's done. Let me know if you have any issues!"
      }  
  ])
  return messages

@app.route('/api/work/<int:workId>')
def get_work(workId):
  work = json.dumps(
    [
	{
  	"id": 1,
    "creator_id": 2,
  "name": "lacey",
  "title": "A Tale of Two Poor Students",
  "is_complete": "true",
  "word_count": "4000",
  "work_summary": "some stuff happens",
  "chapters": [{
    "id": "1",
    "number": "1",
    "title": "bob goes to school",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sollicitudin a ante eu euismod. Etiam aliquam erat eget laoreet tristique. Aenean eget nisl id tortor dapibus elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In malesuada nulla purus, a fringilla velit ultricies ac. Praesent semper ornare sapien, ut tempus diam ultrices eu. Duis sed porttitor eros.",
    "audio_url": "../audio/01 Family Problems.mp3",
    "image_url": "url",
    "comments": [
      {
        "id": 256,
        "userName": "jane",
        "userId": 2,
        "text": "this was bad actually",
        "comments": [],
        "chapterId": "1"
      }
    ]
  },
    {"id": "2",
    "number": "2",
    "title": "bob fails at school",
    "text": "bloop",
    "audio_url": "url",
    "image_url": "url",
    "comments": [
    {
      "id": 257,
        "userName": "elektra",
        "userId": 2,
        "text": "thanks i hate it",
        "chapterId": "1",
        "comments": [
          {
            "id": 258,
            "userName": "bortles",
            "userId": 3,
            "text": "fight me in 20 minutes outside the back lot, you coward",
            "comments": [],
            "chapterId": "1"
          }
        ]
      }
    ]
    }
  ],
  "tags": [{
    "fandom": ["buffy", "xena"]},
    {"primary pairing": ["buffy/faith"]}]}])
  return work

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

@app.route('/api/bookmark/curator/<int:curatorId>')
def get_bookmarks(curatorId):
  bookmarks = json.dumps(
    {

    "curator": {
      "curator_name": "sally",
      "curator_id": 2
    },

    "bookmarks": [
      {
          "id": 5,
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
          "links": [
          {
            "link": "https://www.thekitchn.com/le-creuset-disney-mickey-mouse-collection-2018-255122", 
            "text": "Capitalism"
          },
          {
            "link": "http://google.com",
            "text": "Our Best Friend Google"
          }],
          "tags": [
            {"fandom": ["buffy", "xena"]},
            {"primary pairing": ["buffy/faith"]}
          ],
          "comments": [
            {
              "id": 296,
              "userName": "weirdusernamewithcharacter",
              "userId": 4,
              "text": "pls i want more help me find stories about dolphins!!",
              "comments": [],
              "bookmarkId": 5
            }
          ]
        },
        {
          "id": 6,
          "work": {
            "title": "1000 bonfires in new york",
            "creator": "margaret_iii",
            "summary": "My apocalypse novel in its final form. Read at your own risk!",
            "word_count": 95000000,
            "is_complete": True,
            "chapter_count": 300
          },
          "curator_title": "The story I'd take to a desert island",
          "rating": 5,
          "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          "links": [
          ],
          "tags": [
            {"fandom": ["apocalypse"]},
            {"additional tags": ["new york", "disaffected artists", "new yorkers who are actually from missouri"]}
          ],
          "comments": [
            {
              "id": 297,
              "userName": "how_dare_you",
              "userId": 6,
              "text": "YOU KNOW NOTHING ABOUT NEW YORKERS, JON SNOW",
              "comments": [],
              "bookmarkId": 6
            }
          ]
        }
    ]})
  return bookmarks

@app.route('/api/work/creator/<int:creatorId>')
def get_works_by_creator(creatorId):
  works = json.dumps(
    {"works": [
        {
          "key": "1",
          "title": "a series of unfortunate dev choices",
          "name": "ianastasia",
          "creator_id": 2,
          "chapter_count": 3,
          "is_complete": "false",
          "word_count": 100500,
          "work_summary": "some stuff happens"
        }]
    })
  return works

if __name__ == '__main__':
  app.run(debug=True)

