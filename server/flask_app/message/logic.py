from flask import render_template
import re
import json
from .. import db
from ..work import views
from ..models import Work, Chapter, Tag, User, TagType, Bookmark, BookmarkLink, Message

def add_message(json):
	message = Message(to_user_id = json["to_user"], from_user_id = json["from_user"]["user_id"],
		message_subject=json["message_subject"],message_content=json["message_content"])
	if "parent_id" in json:
		parent_message = Message.query.filter_by(id = json["parent_id"]).first()
		parent_message.replies.append(message)
		db.session.add(parent_message)
	db.session.add(message)
	db.session.commit()
	return message.id

def delete_message(message_id):
	message = Message.query.filter_by(id=message_id).first()
	if message is not None and message.parent_message != []:
		parent = message.parent_message
		message.parent_message[0].replies.remove(message)
	elif message is not None:
		message.replies = []
	Message.query.filter_by(id=message_id).delete()
	db.session.commit()

def delete_all_messages(user_id):
	inbox = User.query.filter_by(id=user_id).first().received_messages.all()
	outbox = User.query.filter_by(id=user_id).first().sent_messages.all()
	for message in inbox:
		delete_message(message.id)
	for message in outbox:
		delete_message(message.id)

def update_read_status(message_id, status):
	message = Message.query.filter_by(id=message_id).first()
	if message is not None:
		message.message_read = status
		db.session.add(message)
		db.session.commit()
		return "Success"
	else:
		return None

def mark_all_read(user_id):
	user = User.query.filter_by(id=user_id).first()
	for message in user.received_messages:
		update_read_status(message.id, True)

def get_message(message_id):
	message = Message.query.filter_by(id=message_id).first()
	if message is not None:
		return build_message(json, None)
	else:
		return None

def get_outbox(user_id):
	messages = Message.query.filter_by(from_user_id=user_id)
	if messages is not None:
		messages_json = []
		for message in messages:
			messages_json.append(build_message(message, None))
		return messages_json
	else:
		return None

def get_inbox(user_id):
	messages = Message.query.filter_by(to_user_id=user_id)
	if messages is not None:
		messages_json = []
		for message in messages:
			messages_json.append(build_message(message, None))
		return messages_json
	else:
		return None

def build_message(message, parent):
	from_user = User.query.filter_by(id=message.from_user_id).first()
	built = {}
	built["to_user"] = message.to_user_id
	built["from_user"] = {"user_id": message.from_user_id, "name": from_user.username}
	built["message_subject"] = message.message_subject
	built["message_content"] = message.message_content
	built["replies"] = build_replies(message.replies, message)
	if parent is not None:
		built["parent_id"] = parent.id
	built["read"] = message.message_read == True
	built["id"] = message.id
	return built

def build_replies(replies, message):
	json = []
	for reply in replies:
		built = build_message(reply, message)
		json.append(built)
	return json
