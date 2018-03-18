import json
from flask import render_template, request

from . import api
from server.flask_app.work import views as work
from server.flask_app.bookmark import logic as bookmark
from server.flask_app.message import logic as message
from server.flask_app.tag import logic as tag
from server.flask_app.comment import logic as comment

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

@api.route('/api/user/<int:userId>/messages/inbox')
def get_inbox(userId):
  return json.dumps(message.get_inbox(userId))

@api.route('/api/user/<int:userId>/messages/outbox')
def get_outbox(userId):
  return json.dumps(message.get_outbox(userId))

@api.route('/api/message/<int:messageId>', methods=['GET'])
def get_message(messageId):
  return json.dumps(message.get_message(messageId))

@api.route('/api/message/<int:messageId>', methods=['DELETE'])
def delete_message(messageId):
  return json.dumps(message.delete_message(messageId))

@api.route('/api/user/<int:userId>/messages/delete', methods=['DELETE'])
def delete_all(userId):
  return json.dumps(message.delete_all_messages(userId))

@api.route('/api/user/<int:userId>/messages/read', methods=['POST'])
def mark_all_read(userId):
  return json.dumps(message.mark_all_read(userId))

@api.route('/api/message/', methods=['POST'])
def add_message():
  return json.dumps(message.add_message(request.json))

@api.route('/api/message/<int:messageId>/read', methods=['POST'])
def mark_message_read(messageId):
  return json.dumps(message.update_read_status(messageId, True))

@api.route('/api/message/<int:messageId>/unread', methods=['POST'])
def mark_message_unread(messageId):
  return json.dumps(message.update_read_status(messageId, False))

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
@api.route('/api/work/creator/<int:creatorId>/<int:page>')
def get_works_by_creator(creatorId, page=1):
  return work.get_by_user(creatorId, page)

@api.route('/api/tag/<int:type_id>/suggestions/<string:term>')
def get_tag_suggestions(term, type_id):
  return json.dumps(tag.get_suggestions(term, type_id))

@api.route('/api/chapter/comment/', methods=['POST'])
def add_chapter_comment():
  return json.dumps({"id": comment.add_comment_to_chapter(request.json)})

@api.route('/api/bookmark/comment/', methods=['POST'])
def add_bookmark_comment():
  return json.dumps({"id": comment.add_comment_to_bookmark(request.json)})

@api.route('/api/comment/reply/', methods=['POST'])
def add_comment_reply():
  return json.dumps({"id": comment.add_reply(request.json)})

@api.route('/api/tag/<int:tag_id>/<path:tag_text>', methods=['GET'])
def get_tagged_data(tag_id, tag_text):
  return json.dumps(tag.get_tagged_data(tag_id, tag_text))

@api.route('/api/tag/work/<int:tag_id>/<path:tag_text>/<int:page>', methods=['GET'])
def get_tagged_works(tag_id, tag_text, page):
  return json.dumps(tag.get_tagged_works(tag_id, tag_text, page))

@api.route('/api/tag/bookmark/<int:tag_id>/<path:tag_text>/<int:page>', methods=['GET'])
def get_tagged_bookmarks(tag_id, tag_text, page):
  return json.dumps(tag.get_tagged_bookmarks(tag_id, tag_text, page))
