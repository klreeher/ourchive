import json
from flask import render_template, request

from . import api
from server.flask_app.work import views as work
from server.flask_app.bookmark import logic as bookmark

@api.route('/<path:path>')
def unknown_path(path):
  return render_template('index.html')


@api.route('/api/search/term/<string:searchTerm>')
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


@api.route('/api/logout/', methods=['POST'])
def logout():
  if not request.json:
    abort(400)
  return request.json["jwt"]

@api.route('/api/login/', methods=['POST'])
def login():
  if not request.json:
    abort(400)
  if request.json["userName"] is None:
    abort(400)
  if request.json["password"] is None:
    abort(400)
  return request.json["userName"] + request.json["password"]


@api.route('/api/message/to/<int:userId>')
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

@api.route('/api/message/from/<int:userId>')
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

@api.route('/api/work/', methods=['POST'])
def post_work():
  #todo login route
  work_id = work.add_work(request.json, 1)
  return json.dumps({"work_id": work_id})

@api.route('/api/work/<int:workId>', methods=['POST'])
def update_work(workId):
    work_id = work.update_work(request.json)
    return json.dumps({"work_id": work_id})

@api.route('/api/work/<int:workId>', methods=['DELETE'])
def delete_work(workId):
  #todo login route
  work.delete_work(workId)
  return 'Deleted: ' + str(workId)

@api.route('/api/tag/categories', methods=['GET'])
def get_tag_categories():
  return json.dumps(work.get_tag_categories())

@api.route('/api/work/<int:workId>', methods=['GET'])
def get_work(workId):
  #todo error handling
  val = work.get_work(workId)
  if val is not None:
    return val
  else:
    return '404 Not Found'

@api.route('/api/bookmark/', methods=['POST'])
def post_bookmark():
  #todo login route
  bookmark_id = bookmark.add_bookmark(request.json, 1)
  return json.dumps({"bookmark_id": bookmark_id})

@api.route('/api/bookmark/<int:bookmarkId>', methods=['GET'])
def get_bookmark(bookmarkId):
  return json.dumps(bookmark.get_bookmark(bookmarkId))

@api.route('/api/bookmark/<int:bookmarkId>', methods=['DELETE'])
def delete_bookmark(bookmarkId):
  #todo login route
  bookmark.delete_bookmark(bookmarkId)
  return 'Deleted: ' + str(bookmarkId)

@api.route('/api/bookmark/<int:bookmarkId>', methods=['POST'])
def update_bookmark(bookmarkId):
    bookmark_id = bookmark.update_bookmark(request.json)
    return json.dumps({"bookmark_id": bookmark_id})

@api.route('/api/user/<int:userId>')
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

@api.route('/api/bookmark/curator/<int:curatorId>')
def get_bookmarks(curatorId):
  return json.dumps(bookmark.get_bookmarks_by_curator(curatorId))

@api.route('/api/work/creator/<int:creatorId>')
def get_works_by_creator(creatorId):
  return work.get_by_user(creatorId)
