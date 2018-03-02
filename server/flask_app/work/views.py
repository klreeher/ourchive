from flask import render_template

from . import work
from .. import db
from ..models import Work

@work.route('/')
def homepage():
  return render_template('index.html')

def add_work(json):
	try:
		title = json['title']
		work_summary = json['work_summary']
		is_complete = json['is_complete']
		# todo migrate, add column
		#work_notes = json['work_notes']
		work_tags = json['work_tags']
		chapters = json['chapters']
		work = Work(title=title,work_summary=work_summary,is_complete=0,word_count=0,user_id=1)
		db.session.add(work)
		db.session.commit()
		add_chapters(work.id, chapters)
		return work.id
	except KeyError:
		return -1

def add_chapters(work_id, chapters):
	for chapter in chapters:
		print(chapter)