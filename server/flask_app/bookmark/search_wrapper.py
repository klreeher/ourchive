from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match
from flask import current_app as app
from ..models import User

class BookmarkWorkSearch(InnerDoc):
	title = Text()
	username = Text()
	user_id = Text()

	def create_from_json(self, work_json):
		self.title=work_json['title']
		self.username=work_json['username']
		self.user_id=work_json['user_id']

	def save_from_json(self, work_json):
		BookmarkWorkSearch.init()
		bookmark_work = self.create_from_json(work_json)
		bookmark_work.save()

class BookmarkSearch(DocType):
	curator_title = Text()
	created_at = Date()
	updated_on = Date()
	rating = Text()
	description = Text()
	user_id = Text()

	work = Nested(BookmarkWorkSearch)

	class Meta:
		index = 'bookmark'

	class Index:
		name = 'bookmark'

	def save(self, ** kwargs):
		self.created_at = datetime.now()
		return super().save(** kwargs)


	def create_from_json(self, bookmark_json):
		BookmarkSearch.init()
		self.curator_title=bookmark_json['curator_title']
		if "description" in bookmark_json:
			self.description=bookmark_json['description']
		if "rating" in bookmark_json:
			self.rating=bookmark_json['rating']
		self.user_id=bookmark_json['user_id']
		self.meta.id = bookmark_json['id']
		bookmark_work_search = BookmarkWorkSearch()
		bookmark_work_search.create_from_json(bookmark_json['work'])
		self.work.append(
			bookmark_work_search)
		self.save()
