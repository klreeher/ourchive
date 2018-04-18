from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match
from flask import current_app as app
from ..models import User

class ChapterSearch(InnerDoc):
	title = Text()
	text = Text()
	image_alt_text = Text()
	work_notes = Text()
	summary = Text()
	number = Text()

	#comments = Nested(Comment)

	def create_from_json(self, chapter_json, identifier):
		self.number=chapter_json['number']
		self.title=chapter_json['title']
		self.text=chapter_json['text']
		self.image_alt_text=chapter_json['image_alt_text']
		self.summary=chapter_json['summary']

	def save_from_json(self, chapter_json):
		ChapterSearch.init()
		chapter = self.create_from_json(chapter_json)
		chapter.save()


class WorkSearch(DocType):
	title = Text()
	title_suggest = Completion()
	created_at = Date()
	updated_on = Date()
	work_summary = Text()
	work_notes = Text()
	is_complete = Boolean()
	word_count = Text()
	user_id = Text()
	work_type_id = Text()

	chapters = Nested(ChapterSearch)

	class Meta:
		index = 'work'

	def add_chapters(self, chapter_json, work_id):
		chapter_count = 1
		for chapter in chapter_json:
			chapter_search = ChapterSearch()
			chapter_search.create_from_json(chapter, work_id + ": " + str(chapter_count))
			self.chapters.append(
				chapter_search)
			chapter_count += 1

	def save(self, ** kwargs):
		self.created_at = datetime.now()
		return super().save(** kwargs)


	def create_from_json(self, work_json):
		#todo add work type
		WorkSearch.init()
		complete = work_json['is_complete'] == "True"
		self.title=work_json['title']
		self.work_summary=work_json['work_summary']
		self.work_notes=work_json['work_notes']
		self.is_complete=complete 
		if 'word_count' in work_json:
			self.word_count=work_json['word_count']
		self.user_id=work_json['user_id']
		self.meta.id = work_json['id']
		self.add_chapters(work_json['chapters'], str(self.meta.id))
		self.save()