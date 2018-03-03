from flask import render_template
import re

from . import work
from .. import db
from ..models import Work, Chapter, Tag

@work.route('/')
def homepage():
  return render_template('index.html')

def add_work(json, user_id):
	try:
		title = json['title']
		work_summary = json['work_summary']
		is_complete = json['is_complete']
		work_notes = json['work_notes']
		work_tags = json['work_tags']
		chapters = json['chapters']
		#todo implement complete
		#todo we are committing too many times here!
		work = Work(title=title,work_summary=work_summary,is_complete=0,word_count=0,user_id=user_id,work_notes=work_notes)
		db.session.add(work)
		db.session.commit()
		word_count = add_chapters(work.id, chapters)
		work.word_count = word_count
		db.session.add(work)
		db.session.commit()
		add_tags(work, work_tags)
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
