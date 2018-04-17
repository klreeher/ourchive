from datetime import datetime
from elasticsearch_dsl import DocType, Date, Nested, Boolean, \
	analyzer, InnerDoc, Completion, Keyword, Text, Index, FacetedSearch, TermsFacet
from elasticsearch_dsl.query import MultiMatch, Match

class ChapterSearch(DocType):
	title = Text()
	text = Text()
	image_alt_text = Text()
	work_notes = Text()
	summary = Text()
	number = Text()

	#comments = Nested(Comment)

	class Meta:
		index = 'chapter'

	#def add_comment(self, author, content):
	#    self.comments.append(
	#      Comment(author=author, content=content, created_at=datetime.now()))

	def save(self, ** kwargs):
		self.created_at = datetime.now()
		return super().save(** kwargs)

	@staticmethod
	def create_from_json(chapter_json, identifier):
		chapter = ChapterSearch(number=chapter_json['number'],
		title=chapter_json['title'], text=chapter_json['text'],
		image_alt_text=chapter_json['image_alt_text'],
		summary=chapter_json['summary'])
		chapter.meta.id = identifier
		return chapter

	def save_from_json(self, chapter_json):
		ChapterSearch.init()
		chapter = self.create_from_json(chapter_json)
		chapter.save()

	def search_text_on_term(self, term):
		search = ChapterSearch.search()
		query = MultiMatch(query=term, fields=['title', 'summary', 'image_alt_text', 'number'], fuzziness=2)
		search = search.query(query)
		results = search.execute()
		return results

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

	chapters = Nested(ChapterSearch)

	class Meta:
		index = 'work'

	def add_chapters(self, chapter_json, work_id):
		chapter_count = 1
		for chapter in chapter_json:
			self.chapters.append(
				ChapterSearch.create_from_json(chapter, work_id + ": " + str(chapter_count)))
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
		self.word_count=work_json['word_count']
		self.user_id=work_json['user_id']
		self.meta.id = work_json['id']
		self.add_chapters(work_json['chapters'], str(self.meta.id))
		self.save()

	def search_text_on_term(self, term):
		search = WorkSearch.search()
		query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 'user_id'], 
			fuzziness=2)
		search = search.query(query)		
		results = search.execute()
		return results

