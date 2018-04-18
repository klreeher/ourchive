from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match
from flask import current_app as app
from ..models import User


class BookmarkSearch(DocType):
	curator_title = Text()
	created_at = Date()
	updated_on = Date()
	rating = Text()
	description = Text()
	user_id = Text()

	class Meta:
		index = 'bookmark'

	def save(self, ** kwargs):
		self.created_at = datetime.now()
		return super().save(** kwargs)


	def create_from_json(self, bookmark_json):
		BookmarkSearch.init()
		self.curator_title=bookmark_json['curator_title']
		self.rating=bookmark_json['rating']
		self.description=bookmark_json['description']
		self.user_id=bookmark_json['user_id']
		self.meta.id = bookmark_json['id']
		self.save()