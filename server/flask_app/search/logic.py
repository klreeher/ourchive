from datetime import datetime
from elasticsearch_dsl.query import MultiMatch, Match
from ..models import User
from ..work.search_wrapper import WorkSearch
from ..bookmark.search_wrapper import BookmarkSearch
from ..tag.search_wrapper import TagSearch

def search_text_on_term(term):
	search = WorkSearch.search()
	query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 
		'user_id', 'chapter.summary', 'chapter.text', 'chapter.image_alt_text', 'chapter.title'], 
		fuzziness=2)
	search = search.query(query)		
	results = search.execute()
	results_json = []
	for item in results:
		results_json.append(build_work_search_results(item))
	return results_json

def build_work_search_results(item):
	work = {}
	work['title'] = item.title
	work['work_summary'] = item.work_summary
	work['work_notes'] = item.work_notes
	work['word_count'] = item.word_count
	work['user_id'] = item.user_id
	work['username'] = User.query.filter_by(id=item.user_id).first().username
	work['chapter_count'] = len(item.chapters)
	work['id'] = item.meta.id
	return work

def search_by_creator(creator_name):
	user = User.query.filter_by(username=creator_name).first()
	search = WorkSearch.search()
	query = Match(user_id=str(user.id))
	search = search.query(query)		
	results = search.execute()
	return results

def search_by_complete(complete):
	search = WorkSearch.search()
	query = Match(is_complete=complete)
	search = search.query(query)		
	results = search.execute()
	return results

def search_bookmark_by_term(term):
	search = BookmarkSearch.search()
	query = MultiMatch(query=term, fields=['curator_title', 'rating', 'description'], 
		fuzziness=2)
	search = search.query(query)
	results = search.execute()
	return results

def search_tag(tag):
	search = TagSearch.search()
	query = Match(text=tag)
	search = search.query(query)
	results = search.execute()
	return results