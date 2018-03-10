from flask import render_template
import re
import json
from .. import db
from ..work import views
from ..models import Work, Chapter, Tag, User, TagType, Bookmark


def add_bookmark(data, user_id):
	bookmark = Bookmark(curator_title=data["curator_title"],rating=data["rating"],description=data["description"],work_id=data["work_id"])
	user = User.query.filter_by(id=user_id).first()
	bookmark.user = user
	db.session.add(bookmark)	
	add_tags(bookmark, data["tags"])
	db.session.commit()
	return bookmark.id

def update_bookmark(data):
	bookmark = Bookmark.query.filter_by(id=data['id']).first()
	bookmark.curator_title = data["curator_title"]
	bookmark.rating = data["rating"]
	bookmark.description = data["description"]
	add_tags(bookmark, data["tags"])
	add_links(bookmark, data["links"])
	db.session.add(bookmark)	
	add_tags(bookmark, data["tags"])
	db.session.commit()
	return bookmark.id

def get_bookmark(bookmark_id):
	bookmark = Bookmark.query.filter_by(id=bookmark_id).first()
	if bookmark is not None:
		return build_bookmark(bookmark)
	else:
		return None

def get_bookmarks_by_curator(curator_id):
	bookmarks = Bookmark.query.filter_by(user_id=curator_id)
	if bookmarks is not None:
		return_json = []
		for bookmark in bookmarks:
			return_json.append(build_bookmark(bookmark))
		return return_json
	else:
		return None

def delete_bookmark(bookmark_id):
	try:
		Bookmark.query.filter_by(id=bookmark_id).delete()
		db.session.commit()
	except:
		#todo log
		return

def build_bookmark(bookmark):
	built = {}
	built["curator_title"] = bookmark.curator_title
	built["rating"] = bookmark.rating
	built["description"] = bookmark.description
	built["work"] = json.dumps(views.build_work_stub(bookmark.work))
	built["comments"] = list(build_bookmark_comments(bookmark.comments))
	built["tags"] = list(build_bookmark_tags(bookmark.tags))
	built["links"] = list(build_bookmark_links(bookmark.links))
	return built

#todo horribly non DRY, need to clean up these little json building functions
def build_bookmark_comments(comments):
	comments = []
	for comment in comments:
		comment_json = {}
		comment_json['id'] = comment.id
		comment_json['userName'] = comment.user.username
		comment_json['userId'] = comment.user.id
		comment_json['text'] = comment.text
		comment_json['bookmarkId'] = comment.chapter_id
		comment_json['comments'] = build_bookmark_comments(comment.comments)
		comments.append(comment_json)
	return comments

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

def add_links(bookmark, links):
	for link in links:
		existing = list([link['link'] for x in bookmark.links if x.link == link['link']])
		if existing[0]['text'] == link['text']:
			continue
		bookmark.links.remove(existing)
		bookmark.links.append(BookmarkLink(text=link['text'], link=link['link']))
	return bookmark.links