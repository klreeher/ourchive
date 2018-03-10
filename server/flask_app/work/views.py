from flask import render_template
import re
import json
from . import work
from .. import db
from ..models import Work, Chapter, Tag, User, TagType

@work.route('/')
def homepage():
  return render_template('index.html')

def get_tag_categories():
	tags = []
	for tag_type in TagType.query.all():
		tag = {}
		tag['id'] = tag_type.id
		tag['label'] = tag_type.label
		tag['tags'] = []
		tags.append(tag)
	return tags

def get_work(work_id):
	work = Work.query.filter_by(id=work_id).first()
	if work is not None:
		return json.dumps(build_work(work))
	else:
		return None

def get_by_user(user_id):
	works = Work.query.filter_by(user_id=user_id)
	if works is not None:
		return_json = []
		for work in works:
			return_json.append(build_work(work))
		return json.dumps(return_json)
	else:
		return None

def delete_work(work_id):
	try:
		Work.query.filter_by(id=work_id).delete()
		db.session.commit()
	except:
		#todo log
		return
def update_work(json):
	work = Work.query.filter_by(id = json['work_id']).first()
	work.title = json['title']
	work.work_summary = json['work_summary']
	work.work_notes = json['work_notes']
	work_tags = json['work_tags']
	chapters = json['chapters']
	if json['is_complete'] == True:
		work.is_complete = 1
	else:
		work.is_complete = 0
	db.session.add(work)
	word_count = update_chapters(work, chapters)
	work.word_count = word_count		
	add_tags(work, work_tags)
	db.session.commit()
	return work.id
def add_work(json, user_id):
	title = json['title']
	work_summary = json['work_summary']
	work_notes = json['work_notes']
	work_tags = json['work_tags']
	chapters = json['chapters']
	if json['is_complete'] == True:
		is_complete = 1
	else:
		is_complete = 0
	#todo we are committing too many times here!
	work = Work(title=title,work_summary=work_summary,is_complete=is_complete,word_count=0,user_id=user_id,work_notes=work_notes)
	db.session.add(work)
	word_count = add_chapters(work, chapters)
	work.word_count = word_count		
	add_tags(work, work_tags)
	db.session.commit()
	return work.id

def add_chapters(work, chapters):
	count = 0
	for chapter_item in chapters:
		chapter = Chapter(title=chapter_item['title'], number=chapter_item['number'], text=chapter_item['text'], audio_url=chapter_item['audio_url'],image_url=chapter_item['image_url'])
		work.chapters.append(chapter)
		count = count + count_words(chapter_item['text'])
	return count

def update_chapters(work, chapters):
	count = 0
	for chapter_item in chapters:		
		if 'id' not in chapter_item:
			chapter = Chapter(title=chapter_item['title'], number=chapter_item['number'], text=chapter_item['text'], audio_url=chapter_item['audio_url'],image_url=chapter_item['image_url'])
			work.chapters.append(chapter)
		else:
			chapter = Chapter.query.filter_by(id=chapter_item['id']).first()
			chapter.title = chapter_item['title']
			chapter.number = chapter_item['number']
			chapter.text = chapter_item['text']
			chapter.audio_url = chapter_item['audio_url']
			chapter.image_url = chapter_item['image_url']
			db.session.add(chapter)
		count = count + count_words(chapter_item['text'])
	return count

def add_tags(work, tags):
	for tag_item in tags:
		for tag in tag_item['tags']:
			existing = Tag.query.filter_by(text=tag, tag_type_id=tag_item['id']).first()
			if existing:
				if existing not in work.tags:
					work.tags.append(existing)			
			else:
				work.tags.append(Tag(text=tag, tag_type_id=tag_item['id']))
	return work.tags

def count_words(text):
	return len(re.findall(r'\w+', text))

def build_work(work):
	creator = User.query.filter_by(id=work.user_id).first()
	work_json = {}
	work_json['id'] = work.id
	work_json['creator_id'] = work.user_id
	work_json['name'] = creator.username
	work_json['title'] = work.title
	if work.is_complete == 1:
		work_json['is_complete'] = 'True'
	else:
		work_json['is_complete'] = 'False'
	work_json['word_count'] = work.word_count
	work_json['work_summary'] = work.work_summary
	work_json['work_notes'] = work.work_notes
	#todo i am sure there is a more elegant way to do all this de/serialization
	work_json['chapters'] = list(build_work_chapters(work))
	work_json['tags'] = build_work_tags(work)
	return work_json

def build_work_stub(work):
	creator = User.query.filter_by(id=work.user_id).first()
	work_json = {}
	work_json['id'] = work.id
	work_json['creator_id'] = work.user_id
	work_json['name'] = creator.username
	work_json['title'] = work.title
	if work.is_complete == 1:
		work_json['is_complete'] = 'True'
	else:
		work_json['is_complete'] = 'False'
	work_json['word_count'] = work.word_count
	work_json['work_summary'] = work.work_summary
	return work_json

def build_work_chapters(work):
	chapters = []
	for chapter in work.chapters:
		chapter_json = {}
		chapter_json['id'] = chapter.id
		chapter_json['number'] = chapter.number
		chapter_json['title'] = chapter.title
		chapter_json['text'] = chapter.text
		chapter_json['audio_url'] = chapter.audio_url
		chapter_json['image_url'] = chapter.image_url
		chapter_json['comments'] = build_chapter_comments(chapter.comments)
		chapters.append(chapter_json)
	return chapters

def build_chapter_comments(comments):
	comments = []
	for comment in comments:
		comment_json = {}
		comment_json['id'] = comment.id
		comment_json['userName'] = comment.user.username
		comment_json['userId'] = comment.user.id
		comment_json['text'] = comment.text
		comment_json['chapterId'] = comment.chapter_id
		comment_json['comments'] = build_chapter_comments(comment.comments)
		comments.append(comment_json)
	return comments

def build_work_tags(work):
	tags = []
	for tag_type in TagType.query.all():
		tag = {}
		tag['id'] = tag_type.id
		tag['label'] = tag_type.label
		tag['tags'] = list([x.text for x in work.tags if x.tag_type_id == tag_type.id])
		tags.append(tag)
	return tags