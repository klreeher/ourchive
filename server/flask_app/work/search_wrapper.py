from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match


class WorkSearch(DocType):
	title = Text()
	title_suggest = Completion()
	created_at = Date()
	work_summary = Text()
	work_notes = Text()
	is_complete = Boolean()
	word_count = Text()
	user_id = Text()
	work_type_id = Text()

	#comments = Nested(Comment)

	class Meta:
		index = 'work'

	#def add_comment(self, author, content):
	#    self.comments.append(
	#      Comment(author=author, content=content, created_at=datetime.now()))

	def save(self, ** kwargs):
		self.created_at = datetime.now()
		return super().save(** kwargs)


	def create_from_json(self, work_json):
		#todo add work type
		WorkSearch.init()
		complete = work_json['is_complete'] == "True"
		work = WorkSearch(title=work_json['title'], work_summary=work_json['work_summary'], 
			work_notes=work_json['work_notes'], is_complete=complete, 
			word_count=work_json['word_count'],
			user_id=work_json['user_id'])
		work.meta.id = work_json['id']
		work.save()

	def search_text_on_term(self, term):
		search = WorkSearch.search()
		query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 'user_id'], fuzziness=2)
		search = search.query(query)
		results = search.execute()
		return results