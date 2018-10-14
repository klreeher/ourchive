from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match
from flask import current_app as app
from ..models import User


class TagSearch(DocType):
	text = Text()
	tag_type_id = Text()
	created_at = Date()

	class Meta:
		index = 'tag'

	class Index:
		name = 'tag'

	def save(self, ** kwargs):
		return super().save(** kwargs)


	def create_from_item(self, tag, tag_type_id):
		TagSearch.init()
		self.text=tag
		self.tag_type_id=tag_type_id
		self.meta.id = str(tag_type_id) + ": " + tag
		self.save()