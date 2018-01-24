from flask import Flask, render_template, send_file, send_from_directory, request
import json
from flask.ext.tus import tus_manager

app = Flask(__name__)
tm = tus_manager(app, upload_url='/file-upload')

@tm.upload_file_handler
def upload_file_hander( upload_file_path, filename ):
    app.logger.info( "doing something cool with {}, {}".format( upload_file_path, filename))
    return filename

# serve the uploaded files
@app.route('/uploads/<path:filename>', methods=['GET'])
def download(filename):
  uploads = os.path.join(app.root_path, tm.upload_folder)
  return send_from_directory(directory=uploads, filename=filename)

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

@app.route('/')
def hello_world():
  return render_template('index.html')

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
        "message_subject": "Your writing",
        "message_content": "it's so good but have you thought about including more entymology. bugs are good i like them. beetles especially."
      },
      {
        "id": 5,
        "to_user": 2,
        "from_user": {
          "username": "joy",
          "userId": 4
        },
        "message_subject": "Please let me archive this",
        "message_content": "i'd like to put this on my webring, called Stuck in 2006, please let me know what you think. it's a good webring, we are obsessed with dolphins there, it's our favorite topic."
      }  
  ])
  return messages

@app.route('/api/work/<int:workId>')
def get_work(workId):
  work = json.dumps(
    [
	{
  	"key": "1",
    "creator_id": 2,
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "true",
  "word_count": "4000",
  "work_summary": "some stuff happens",
  "chapters": [{
    "id": "1",
    "number": "1",
    "title": "bob goes to school",
    "text": "weh weh weh weh",
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
          "name": "impertinence",
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
    {"bookmarks": [
      {
          "key": "1",
          "id": 5,
          "chapter_image": "butts.png",
          "title": "bleh bleh bleh",
          "creator": "impertinence",
          "summary": "someBODY once told me the world is gonna roll me",
          "rating": "*****",
          "curator": "sally",
          "description": "this touched my heart and also I'm at war with the author now",
          "links": [1, 2],
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
          "name": "impertinence",
          "creator_id": 2,
          "chapter_count": 3,
          "is_complete": "false",
          "word_count": 100500,
          "work_summary": "some stuff happens"
        }]
    })
  return works

@app.route('/<path:path>')
def default(path):
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

