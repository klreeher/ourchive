from flask import render_template
import re
import json
from work import views
from models import Comment, Work, Bookmark, Chapter
from flask import current_app as app
from database import db

def add_comment(json, comment):
	if 'user_id' in json:
		comment.user_id = json['user_id']
	if 'parent_id' in json:
		parent_comment = Comment.query.filter_by(id = json['parent_id']).first()
		parent_comment.comments.append(comment)
		db.session.add(parent_comment)
	db.session.add(comment)
	db.session.commit()
	return comment.id

def add_reply(json):
	comment = Comment(text=json['text'])
	comment_allowed = False
	if 'chapter_id' in json:
		chapter = Chapter.query.filter_by(id=json['chapter_id']).first()
		work = chapter.chapter_work
		comment_allowed = work.comments_permitted and (work.anon_comments_permitted or json['user_id'])
	elif 'bookmark_id' in json:
		bookmark = Bookmark.query.filter_by(id=json['bookmark_id']).first()
		comment_allowed = bookmark.comments_permitted and (bookmark.anon_comments_permitted or json['user_id'])
	if comment_allowed:
		return add_comment(json, comment)
	else:
		return -1

def add_comment_to_bookmark(json):
	bookmark = Bookmark.query.filter_by(id=json['bookmark_id']).first()
	comment_allowed = bookmark.comments_permitted and (bookmark.anon_comments_permitted or json['user_id'])
	if not comment_allowed:
		return -1
	comment = Comment(text=json['text'])
	comment.bookmark_id = json['bookmark_id']
	return add_comment(json, comment)

def add_comment_to_chapter(json):
	work = Work.query.filter_by(id=json['work_id']).first()
	comment_allowed = work.comments_permitted and (work.anon_comments_permitted or json['user_id'])
	if not comment_allowed:
		return -1
	comment = Comment(text=json['text'])
	comment.chapter_id = json['chapter_id']
	return add_comment(json, comment)

def delete_comment(comment_id, user_id, admin_override=False):
	comment = Comment.query.filter_by(id=comment_id).first()
	if comment.user_id != user_id and admin_override == False:
		return
	if comment is not None and comment.parent_comment != []:
		parent = comment.parent_comment
		comment.parent_comment[0].replies.remove(comment)
	elif comment is not None:
		comment.replies = []
	Comment.query.filter_by(id=comment_id).delete()
	db.session.commit()
