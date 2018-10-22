from flask import render_template
import re
import json
from work import views
from flask import current_app as app
from database import db
from models import Work, Chapter, Tag, User, TagType, Bookmark, BookmarkLink
from .search_wrapper import BookmarkSearch

def get_work_from_bookmark(data):
	work = Work.query.filter_by(id=data['work_id']).first()
	data['work'] = {}
	data['work']['title'] = work.title
	data['work']['username'] = work.user.username
	data['work']['user_id'] = work.user_id
	data['work']['work_id'] = data['work_id']
	return data

def add_bookmark(data):
	bookmark = Bookmark(curator_title=data["curator_title"],work_id=data["work_id"])
	if "description" in data:
		bookmark.description = data["description"]
	if "rating" in data:
		bookmark.rating = data["rating"]
	if 'is_private' in data:
		bookmark.is_private = data['is_private'] == 'on'
	user = User.query.filter_by(id=data['user_id']).first()
	bookmark.user = user
	db.session.add(bookmark)
	add_tags(bookmark, data["tags"])
	add_links(bookmark, data['links'])
	db.session.commit()
	if app.config.get('USE_ES'):
		data['id'] = bookmark.id
		data = get_work_from_bookmark(data)
		search_obj = BookmarkSearch()
		search_obj.create_from_json(data)
	return bookmark.id

def update_bookmark(data):
	bookmark = Bookmark.query.filter_by(id=data['id']).first()
	bookmark.curator_title = data["curator_title"]
	bookmark.rating = data["rating"]
	bookmark.description = data["description"]
	if 'is_private' in data:
		bookmark.is_private = data['is_private'] == 'on'
	add_tags(bookmark, data["tags"])
	add_links(bookmark, data["links"])
	db.session.add(bookmark)
	add_tags(bookmark, data["tags"])
	remove_tags(bookmark, data['delete_tags_list'])
	db.session.commit()
	if app.config.get('USE_ES'):
		data['user_id'] = bookmark.user_id
		data['id'] = bookmark.id
		data = get_work_from_bookmark(data)
		search_obj = BookmarkSearch()
		search_obj.create_from_json(data)
	return bookmark.id

def get_bookmark(bookmark_id, user_id):
	bookmark = Bookmark.query.filter_by(id=bookmark_id).first()
	if bookmark is not None:
		return build_bookmark(bookmark, user_id)
	else:
		return None

def get_bookmarks_by_curator(curator_id, page=1):
	paginated = Bookmark.query.filter_by(user_id=curator_id).paginate(page, app.config['RESULT_PAGES'])
	bookmarks = paginated.items
	result = {}
	if bookmarks is not None:
		result['bookmarks'] = []
		for bookmark in bookmarks:
			result['bookmarks'].append(build_bookmark(bookmark))
		result['pages'] = paginated.pages
		return result
	else:
		return None

def delete_bookmark(bookmark_id, user_id, admin_override=False):
	try:
		bookmark = Bookmark.query.filter_by(id=bookmark_id).first()
		if bookmark is not None:
			if bookmark.user_id == user_id or admin_override:
				db.session.delete(bookmark)
				db.session.commit()
				if app.config.get('USE_ES'):
					doc = BookmarkSearch.get(id=bookmark_id)
					if doc is not None:
						doc.delete()
				return bookmark_id
		return None
	except:
		#todo log
		return None

def build_bookmark(bookmark, user_id=None):
	if bookmark.is_private:
		if user_id is not None and bookmark.user_id != user_id:
			return {}
		if user_id is None or user_id < 1:
			return {}
	user = User.query.filter_by(id=bookmark.user_id).first()
	curator = {}
	curator["curator_name"] = user.username
	curator["curator_id"] = user.id
	built = {}
	built["curator"] = curator
	built["id"] = bookmark.id
	built["curator_title"] = bookmark.curator_title
	built["rating"] = bookmark.rating
	built["description"] = bookmark.description
	built["work"] = views.build_work_stub(bookmark.work)
	built["comments"] = list(build_bookmark_comments(bookmark.comments))
	built["tags"] = list(build_bookmark_tags(bookmark.tags))
	built["links"] = list(build_bookmark_links(bookmark.links))
	built['is_private'] = bookmark.is_private
	return built

#todo horribly non DRY, need to clean up these little json building functions
def build_bookmark_comments(comments):
	comments_list = []
	for comment in comments:
		comment_json = {}
		comment_json['id'] = comment.id
		comment_json['userName'] = comment.user.username
		comment_json['userId'] = comment.user.id
		comment_json['text'] = comment.text
		comment_json['bookmarkId'] = comment.bookmark_id
		comment_json['comments'] = build_bookmark_comments(comment.comments)
		comments_list.append(comment_json)
	return comments_list

def build_bookmark_tags(bookmark_tags):
	tags = []
	for tag_type in TagType.query.all():
		tag = {}
		tag['id'] = tag_type.id
		tag['label'] = tag_type.label
		tag['tags'] = list([x.text for x in bookmark_tags if x.tag_type_id == tag_type.id])
		tags.append(tag)
	return tags

def build_bookmark_links(bookmark_links):
	links = []
	for link in bookmark_links:
		link = {}
		link['id'] = link.id
		link['link'] = link.link
		link['text'] = link.text
		links.append(link)
	return links

def add_tags(bookmark, tags):
	for tag_item in tags:
		for tag in tag_item['tags']:
			existing = Tag.query.filter_by(text=tag, tag_type_id=tag_item['id']).first()
			if existing:
				if existing not in bookmark.tags:
					bookmark.tags.append(existing)
			else:
				bookmark.tags.append(Tag(text=tag, tag_type_id=tag_item['id']))
	return bookmark.tags

def remove_tags(bookmark, tags_to_remove):
	for tag_item in tags_to_remove:
		existing = Tag.query.filter_by(text=tag_item['tag'], tag_type_id=tag_item['category_id']).first()
		if existing:
			if existing in bookmark.tags:
				bookmark.tags.remove(existing)
	return bookmark.tags

def add_links(bookmark, links):
	for link in links:
		existing = list([link['link'] for x in bookmark.links if x.link == link['link']])
		if len(existing) > 0:
			if existing[0]['text'] == link['text']:
				continue
			bookmark.links.remove(existing)
		bookmark.links.append(BookmarkLink(text=link['text'], link=link['link']))
	return bookmark.links
