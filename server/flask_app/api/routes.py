import json
from flask import render_template, request, make_response, abort, jsonify

from . import api
from server.flask_app.work import views as work
from server.flask_app.bookmark import logic as bookmark
from server.flask_app.message import logic as message
from server.flask_app.tag import logic as tag
from server.flask_app.comment import logic as comment
from server.flask_app.auth import logic as auth
from server.flask_app.user import logic as user_logic

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


@api.route('/api/user/logout/', methods=['POST'])
def logout():
  if not request.json:
    abort(400)
  result = auth.logout(request)
  return result

@api.route('/api/user/login/', methods=['POST'])
def login():
  if not request.json:
    abort(400)
  if request.json["username"] is None:
    abort(400)
  if request.json["password"] is None:
    abort(400)
  return auth.login(request.json)

@api.route('/api/user/authorize/', methods=['POST'])
def authorize():
  if not request.json:
    abort(400)
  return auth.authorize(request)

@api.route('/api/user/register/', methods=['POST'])
def register():
  if not request.json:
    abort(400)
  if request.json["email"] is None:
    abort(400)
  if request.json["password"] is None:
    abort(400)
  return auth.register(request.json)

@api.route('/api/user/<int:userId>/reset/<string:token>', methods=['POST'])
def reset(userId, token):
  if not request.json:
    abort(400)
  if request.json["email"] is None:
    abort(400)
  if request.json["password"] is None:
    abort(400)
  return auth.reset_password(request.json, userId, token)

@api.route('/api/user/<int:userId>/messages/inbox')
def get_inbox(userId):
  user_id = auth.auth_from_data(request)
  print(request.headers)
  if user_id > 0 and user_id == userId:
    result = message.get_inbox(user_id)
    if result is not None:
      return make_response(jsonify(result), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/user/<int:userId>/messages/outbox')
def get_outbox(userId):
  user_id = auth.auth_from_data(request)
  if user_id > 0 and user_id == userId:
    result = message.get_outbox(user_id)
    if result is not None:
      return make_response(jsonify(result), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/admin/works/types', methods=['POST'])
def add_work_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    user_logic.add_work_types(request.json['types'])
    responseObject = {
        'status': 'success',
        'message': 'Work types added.'
      }
    return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/notifications/types', methods=['POST'])
def add_notification_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    user_logic.add_notification_types(request.json['types'])
    responseObject = {
        'status': 'success',
        'message': 'Notification types added.'
      }
    return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/tags/types', methods=['POST'])
def add_tag_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    user_logic.add_tag_types(request.json['types'])
    responseObject = {
        'status': 'success',
        'message': 'Tag types added.'
      }
    return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/works/types', methods=['GET'])
def get_work_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    types = user_logic.get_work_types()
    return make_response(jsonify(types), 201)
  else:
    abort(400)

@api.route('/api/admin/notifications/types', methods=['GET'])
def get_notification_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    types = user_logic.get_notification_types(request.json['types'])
    return make_response(jsonify(types), 201)
  else:
    abort(400)

@api.route('/api/admin/tags/types', methods=['GET'])
def get_tag_types():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    types = user_logic.get_tag_types(request.json['types'])
    return make_response(jsonify(types), 201)
  else:
    abort(400)

@api.route('/api/admin/works/<int:workId>', methods=['DELETE'])
def delete_work_as_admin(workId):
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    result = work.delete_work(workId, user_id, True)
    if result is not None:
      responseObject = {
          'Deleted': workId
        }
      return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/bookmarks/<int:bookmarkId>', methods=['DELETE'])
def delete_bookmark_as_admin(bookmarkId):
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    result = bookmark.delete_bookmark(bookmarkId, user_id, True)
    if result is not None:
      responseObject = {
          'Deleted': bookmarkId
        }
      return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/comments/<int:commentId>', methods=['DELETE'])
def delete_comment_as_admin(commentId):
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    result = comment.delete_comment(commentId, user_id, True)
    if result is not None:
      responseObject = {
          'Deleted': commentId
        }
      return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/users/banned', methods=['POST'])
def ban_user(userId):
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    user_logic.ban_user(request.json['banned_user'])
    responseObject = {
        'Banned:': userId
      }
    return make_response(jsonify(responseObject), 201)
  else:
    abort(400)

@api.route('/api/admin/users/banned', methods=['GET'])
def get_banned_users():
  user_id = auth.auth_as_admin(request)
  if user_id > 0:
    response = user_logic.get_banned_users()
    return make_response(jsonify(response), 201)
  else:
    abort(400)

@api.route('/api/message/<int:messageId>', methods=['GET'])
def get_message(messageId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = message.get_message(messageId, user_id)
    if result is not None:
      return make_response(result, 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/message/<int:messageId>', methods=['DELETE'])
def delete_message(messageId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = message.delete_message(messageId, user_id)
    if result is not None:
      responseObject = {
          'status': 'success',
          'message': 'Message deleted.'
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/user/<int:userId>/messages/delete', methods=['DELETE'])
def delete_all(userId):
  user_id = auth.auth_from_data(request)
  if user_id > 0 and user_id == userId:
    result = message.delete_all_messages(user_id)
    if result is not None:
      responseObject = {
          'status': 'success',
          'message': 'Messages deleted.'
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/user/<int:userId>/messages/read', methods=['POST'])
def mark_all_read(userId):
  user_id = auth.auth_from_data(request)
  if user_id > 0 and user_id == userId:
    result = message.mark_all_read(user_id)
    if result is not None:
      responseObject = {
          'status': 'success',
          'message': 'Messages marked as read.'
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/message/', methods=['POST'])
def add_message():
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    if user_logic.in_blocklist(user_id, request.json['to_user']):
      responseObject = {
          'status': 'failure',
          'message': 'Cannot message user who has you blocked.'
        }
      return make_response(jsonify(responseObject), 403)
    request.json['from_user'] = user_id
    return json.dumps(message.add_message(request.json))
  else:
    abort(400)

@api.route('/api/message/<int:messageId>/read', methods=['POST'])
def mark_message_read(messageId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = message.update_read_status(messageId, True, user_id)
    if result is not None:
      responseObject = {
          'status': 'success',
          'message': 'Message marked as read.'
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/message/<int:messageId>/unread', methods=['POST'])
def mark_message_unread(messageId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = message.update_read_status(messageId, False, user_id)
    if result is not None:
      responseObject = {
          'status': 'success',
          'message': 'Message marked as unread.'
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/work/', methods=['POST'])
def post_work():
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    work_id = work.add_work(request.json, user_id)
    return json.dumps({"work_id": work_id})
  else:
    abort(400)

@api.route('/api/work/<int:workId>', methods=['POST'])
def update_work(workId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = work.update_work(request.json)
    if result is not None:
      responseObject = {
          'work_id': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/work/<int:workId>', methods=['DELETE'])
def delete_work(workId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    result = work.delete_work(workId, user_id)
    if result is not None:
      responseObject = {
          'Deleted': workId
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)


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
  user_id = auth.auth_from_data(request)
  print(user_id)
  if user_id > 0:
    request.json['user_id'] = user_id
    result = bookmark.add_bookmark(request.json, user_id)
    if result is not None:
      responseObject = {
          'bookmark_id': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/bookmark/<int:bookmarkId>', methods=['GET'])
def get_bookmark(bookmarkId):
  return json.dumps(bookmark.get_bookmark(bookmarkId))

@api.route('/api/bookmark/<int:bookmarkId>', methods=['DELETE'])
def delete_bookmark(bookmarkId):
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    request.json['user_id'] = user_id
    result = bookmark.delete_bookmark(bookmarkId, user_id)
    if result is not None:
      responseObject = {
          'Deleted': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

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
@api.route('/api/bookmark/curator/<int:curatorId>/<int:page>')
def get_bookmarks(curatorId, page=1):
  return json.dumps(bookmark.get_bookmarks_by_curator(curatorId, page))

@api.route('/api/work/creator/<int:creatorId>')
@api.route('/api/work/creator/<int:creatorId>/<int:page>')
def get_works_by_creator(creatorId, page=1):
  return work.get_by_user(creatorId, page)

@api.route('/api/tag/<int:type_id>/suggestions/<string:term>')
def get_tag_suggestions(term, type_id):
  return json.dumps(tag.get_suggestions(term, type_id))

@api.route('/api/chapter/comment/', methods=['POST'])
def add_chapter_comment():
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    request.json['user_id'] = user_id
    result = comment.add_comment_to_chapter(request.json)
    if result is not None:
      responseObject = {
          'id': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/bookmark/comment/', methods=['POST'])
def add_bookmark_comment():
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    request.json['user_id'] = user_id
    result = comment.add_comment_to_bookmark(request.json)
    if result is not None:
      responseObject = {
          'id': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/comment/reply/', methods=['POST'])
def add_comment_reply():
  user_id = auth.auth_from_data(request)
  if user_id > 0:
    request.json['user_id'] = user_id
    result = comment.add_reply(request.json)
    if result is not None:
      responseObject = {
          'id': result
        }
      return make_response(jsonify(responseObject), 201)
    else:
      abort(400)
  else:
    abort(400)

@api.route('/api/tag/<int:tag_id>/<path:tag_text>', methods=['GET'])
def get_tagged_data(tag_id, tag_text):
  return json.dumps(tag.get_tagged_data(tag_id, tag_text))

@api.route('/api/tag/work/<int:tag_id>/<path:tag_text>/<int:page>', methods=['GET'])
def get_tagged_works(tag_id, tag_text, page):
  return json.dumps(tag.get_tagged_works(tag_id, tag_text, page))

@api.route('/api/tag/bookmark/<int:tag_id>/<path:tag_text>/<int:page>', methods=['GET'])
def get_tagged_bookmarks(tag_id, tag_text, page):
  return json.dumps(tag.get_tagged_bookmarks(tag_id, tag_text, page))

