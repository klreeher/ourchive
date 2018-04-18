from datetime import datetime
from elasticsearch_dsl.query import MultiMatch, Match
from ..models import User
from ..work.search_wrapper import WorkSearch

def search_text_on_term(term):
	search = WorkSearch.search()
	query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 
		'user_id', 'chapter.summary', 'chapter.text', 'chapter.image_alt_text', 'chapter.title'], 
		fuzziness=2)
	search = search.query(query)		
	results = search.execute()
	return results

def search_by_creator(creator_name):
	user = User.query.filter_by(id=1).first()
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