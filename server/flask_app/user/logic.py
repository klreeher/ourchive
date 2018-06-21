import re
import json
from .. import redis_db
from ..models import User, WorkType, TagType, NotificationType
from itsdangerous import TimestampSigner
from server.flask_app import app, bcrypt, db
from server.flask_app.work import views as work_logic
from server.flask_app.bookmark import logic as bookmark_logic

def add_blocklist(blocked_user, blocking_user):
	results = redis_db.sadd("blocklist:#"+str(blocking_user), str(blocked_user))
	return results

def in_blocklist(blocked_user, blocking_user):
	blocklist = redis_db.smembers("blocklist:#"+str(blocking_user))
	return str(blocked_user).encode("utf8") in blocklist

def add_reset(reset_user):
	s = TimestampSigner('secret-key')
	token = s.sign(str(reset_user.id)+'password-reset')
	redis_db.set("password-reset:#"+str(reset_user.id), token)
	return token

def validate_reset_token(reset_user, token):
	s = TimestampSigner('secret-key')
	try:
		new_token = s.unsign(token, max_age=43200)
		redis_val = redis_db.get("password-reset:#"+str(reset_user))
		if (token == redis_val.decode("utf8")):
			return True
		else:
			return False
	except Exception as e:
		return False

def encrypt_password(password):
	password_bytes = bytes(password, 'utf-8')
	new_password = bcrypt.hashpw(
		password_bytes, bcrypt.gensalt()
		).decode()
	return new_password

def add_work_type(work_type):
	new_type = WorkType(work_type['type_name'])
	db.session.add(new_type)
	db.session.commit()

def add_tag_type(tag_type):
	new_type = TagType(tag_type['label'])
	db.session.add(new_type)
	db.session.commit()

def add_notification_types(types):
	for notification_type in types:
		new_type = NotificationType(notification_type['type_label'], notification_type['send_email'])
		db.session.add(new_type)
	db.session.commit()

def get_work_types():
	types = WorkType.query.all()
	types_json = []
	for work_type in types:
		work_type_json = {}
		work_type_json['id'] = work_type.id
		work_type_json['type_name'] = work_type.type_name
		types_json.append(work_type_json)
	return types_json

def get_tag_types():
	types = TagType.query.all()
	types_json = []
	for tag_type in types:
		tag_type_json = {}
		tag_type_json['id'] = tag_type.id
		tag_type_json['label'] = tag_type.label
		types_json.append(tag_type_json)
	return types_json

def get_notification_types():
	types = NotificationType.query.all()
	types_json = []
	for notification_type in types:
		notification_type_json = {}
		notification_type_json['id'] = notification_type.id
		notification_type_json['type_label'] = notification_type.type_label
		notification_type_json['send_email'] = notification_type.send_email
		types_json.append(notification_type_json)
	return types_json

def get_banned_users():
	banned_users = User.query.filter_by(banned=True).all()
	banned_list = []
	for user in banned_users:
		banned_list.append(build_user(user))
	return banned_list

def ban_user(user_id):
	user = User.query.filter_by(id=user_id).first()
	user.banned = True
	db.session.commit()

def unban_user(user_id):
	user = User.query.filter_by(id=user_id).first()
	user.banned = False
	db.session.commit()

def ban_users(users):
	for user_obj in users:
		user = User.query.filter_by(id=user_obj['id']).first()
		user.banned = True
		db.session.add(user)
	db.session.commit()

def get_by_username(username):
	user = User.query.filter_by(username=username).first()
	return build_user(user)

def get_user_summary_with_email(user_id):
	return get_user_summary(user_id, True)

def get_user_summary(user_id, include_email=False):
	user_data = {}
	user = User.query.filter_by(id=user_id).first()
	user_data['user'] = build_user(user, include_email)
	return user_data

def modify_user(user_id, user_data):
	user = User.query.filter_by(id=user_id).first()
	user.email = user_data['email']
	user.username = user_data['username']
	user.bio = user_data['bio']
	db.session.add(user)
	db.session.commit()

def build_user(user_obj, include_email=True):
	user = {}
	if include_email:
		user['email'] = user_obj.email
	user['username'] = user_obj.username
	user['registered_on'] = user_obj.registered_on
	user['id'] = user_obj.id
	if user_obj.bio is not None:
		user['bio'] = user_obj.bio
	else:
		user['bio'] = ""
	user['works_count'] = len(user_obj.works.all())
	user['bookmarks_count'] = len(user_obj.bookmarks.all())
	return user
