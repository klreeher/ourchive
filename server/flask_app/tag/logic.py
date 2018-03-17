from flask import render_template
import re
import json
from .. import db
from .. import redis_db
from ..work import views
from ..bookmark import logic as bookmark_logic
from ..models import Tag, Bookmark, Work, TagType

def get_suggestions(term, type_id):
	data = {}
	data['results'] = []
	results = redis_db.zrevrange("tag-suggestions:#"+str(type_id)+":#"+term.lower(), 0, 9)
	for item in results:
		data['results'].append(item.decode("utf-8"))
	print(data)
	return data

def add_tag(tag_text, type_id):
	for i in range(2,len(tag_text),1):
		prefix = tag_text[:i]
		redis_db.zadd("tag-suggestions:#"+str(type_id)+":#"+prefix.lower(), 1, tag_text.lower())

def get_tagged_data(tag_id, tag_text):
	tag_text = tag_text.replace('%2F', '/')
	tag = Tag.query.filter_by(tag_type_id=tag_id, text=tag_text).first()
	if tag is None:
		return {}
	results = {}
	results['works'] = []
	works = tag.work_tags
	for work in works:
		results['works'].append(views.build_work_stub(work))
	results['bookmarks'] = []
	bookmarks = tag.bookmark_tags
	for bookmark in bookmarks:
		results['bookmarks'].append(bookmark_logic.build_bookmark(bookmark))
	return results
