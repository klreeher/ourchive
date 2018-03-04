from flask import render_template
import re

from . import work
from .. import db
from ..models import Work, Chapter, Tag, User, TagType

@work.route('/')
def homepage():
  return render_template('index.html')

def get_work(work_id):
	try:
		return Work.query.filter_by(id=work_id).first()
	except:
		#todo log
		return

def delete_work(work_id):
	try:
		Work.query.filter_by(id=work_id).delete()
		db.session.commit()
	except:
		#todo log
		return

def add_work(json, user_id):
	try:
		title = json['title']
		work_summary = json['work_summary']
		is_complete = json['is_complete']
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
		db.session.commit()
		word_count = add_chapters(work.id, chapters)
		work.word_count = word_count
		db.session.add(work)
		db.session.commit()
		add_tags(work, work_tags)
		#todo add comments
		return work.id
	except KeyError:
		return -1

def add_chapters(work_id, chapters):
	count = 0
	for chapter_item in chapters:
		chapter = Chapter(title=chapter_item['title'], number=chapter_item['number'], text=chapter_item['text'], audio_url=chapter_item['audio_url'],image_url=chapter_item['image_url'],work_id=work_id)
		db.session.add(chapter)
		db.session.commit()
		count = count + count_words(chapter_item['text'])
	return count

def add_tags(work, tags):
	for tag_item in tags:
		existing = Tag.query.filter_by(text=tag_item['text']).first()
		if existing:
			work.tags.append(existing)			
		else:
			work.tags.append(Tag(text=tag_item['text'], tag_type_id=tag_item['id']))
	db.session.add(work)
	db.session.commit()
	work = Work.query.filter_by(id=work.id).first()
	return work.tags

def count_words(text):
	return len(re.findall(r'\w+', text))

def build_work(work):
	creator = User.query.filter_by(id=work.user_id)
	work = {}
	work['id'] = work.id
	work['creator_id'] = work.user_id
	work['name'] = creator.username
	work['title'] = work.title
	if work.is_complete == 1:
		work['is_complete'] = 'True'
	else:
		work['is_complete'] = 'False'
	work['word_count'] = work.word_count
	work['work_summary'] = work.work_summary
	work['work_notes'] = work.work_notes
	#todo i am sure there is a more elegant way to do all this de/serialization
	work['chapters'] = build_work_chapters(work)
	work['tags'] = build_work_tags(work)
	return work

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
		chapters.append(chapter)
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
		tag['tags'] = [x for x in work.tags if x.tag_type_id == tag_type.id]
		tags.append(tag)
	return tags