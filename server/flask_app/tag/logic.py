from flask import render_template
import re
import json
from flask import current_app as app
from work import views
from bookmark import logic as bookmark_logic
from models import Tag, Bookmark, Work, TagType

def get_suggestions(term, type_id):
	dirty = term.replace('_', '/')
	data = {}
	data['results'] = []
	results = app.redis_db.zrevrange("tag-suggestions:#"+str(type_id)+":#"+dirty.lower(), 0, 9)
	for item in results:
		data['results'].append(item.decode("utf-8"))
	print(data)
	return data

def add_tag(tag_text, type_id):
	for i in range(2,len(tag_text),1):
		prefix = tag_text[:i]
		app.redis_db.zadd("tag-suggestions:#"+str(type_id)+":#"+prefix.lower(), 1, tag_text.lower())

def get_tagged_data(tag_id, tag_text):
	tag = get_tag(tag_id, tag_text)
	if tag is None:
		return {}
	results = {}
	results = get_work_results(tag, results, 1)
	results = get_bookmark_results(tag, results, 1)
	return results

def get_tag(tag_id, tag_text):
	tag_text = tag_text.replace('%2F', '/')
	tag = Tag.query.filter_by(tag_type_id=tag_id, text=tag_text).first()
	return tag

def get_tagged_works(tag_id, tag_text, page):
	tag = get_tag(tag_id, tag_text)
	if tag is None:
		return {}
	results = {}
	return get_work_results(tag, results, page)

def get_work_results(tag, results, page):
	results['works'] = []
	works = tag.work_tags.paginate(page, 25).items
	for work in works:
		results['works'].append(views.build_work_stub(work))
	results['work_pages'] = tag.work_tags.paginate(page, 25).pages
	return results

def get_bookmark_results(tag, results, page):
	results['bookmarks'] = []
	bookmarks = tag.bookmark_tags.paginate(page, 25).items
	for bookmark in bookmarks:
		results['bookmarks'].append(bookmark_logic.build_bookmark(bookmark))
	results['bookmark_pages'] = tag.bookmark_tags.paginate(page, 25).pages
	return results

def get_tagged_bookmarks(tag_id, tag_text, page):
	tag = get_tag(tag_id, tag_text)
	if tag is None:
		return {}
	results = {}
	return get_bookmark_results(tag, results, page)

