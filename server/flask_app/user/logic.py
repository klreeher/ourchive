import re
import json
from .. import redis_db
from ..models import User, WorkType, TagType, NotificationType
from itsdangerous import TimestampSigner
from server.flask_app import app, bcrypt, db

def add_blocklist(blocked_user, blocking_user):
	results = redis_db.sadd("blocklist:#"+str(blocking_user), str(blocked_user))
	return results

def in_blocklist(blocked_user, blocking_user):
	blocklist = redis_db.smembers("blocklist:#"+str(blocking_user))
	return str(blocked_user).encode("utf8") in blocklist

def add_reset(reset_user):
	s = TimestampSigner('secret-key')
	token = s.sign(str(reset_user)+'password-reset')
	redis_db.set("password-reset:#"+str(reset_user), token)
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
	new_password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()
	return new_password

def add_work_types(types):
	for work_type in types:
		new_type = WorkType(work_type)
		db.session.add(new_type)
	db.session.commit()

def add_tag_types(types):
	for tag_type in types:
		new_type = TagType(tag_type)
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

def build_user(user_obj):
	user = {}
	user['email'] = user_obj.email
	user['username'] = user_obj.username
	user['registered_on'] = user_obj.registered_on
	return user