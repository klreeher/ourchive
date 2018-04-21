from datetime import datetime
from elasticsearch_dsl.query import MultiMatch, Match
from ..models import User
from ..work.search_wrapper import WorkSearch
from ..bookmark.search_wrapper import BookmarkSearch
from ..tag.search_wrapper import TagSearch

def search_on_term(term, search_works, search_bookmarks):
	results = {}
	if search_works:
		results["works"] = search_text_on_term(term)
	if search_bookmarks:
		results["bookmarks"] = search_bookmark_by_term(term)
	return results

def search_text_on_term(term):
	WorkSearch.init()
	search = WorkSearch.search()
	query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 
		'user_id', 'chapters.summary', 'chapters.text', 'chapters.image_alt_text', 'chapters.title'], 
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
	user = User.query.filter_by(id=item.user_id).first()
	if user is not None: 
		work['username'] = user.username
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
	BookmarkSearch.init()
	search = BookmarkSearch.search()
	query = MultiMatch(query=term, fields=['curator_title', 'rating', 'description'], 
		fuzziness=2)
	search = search.query(query)
	results = search.execute()
	results_json = []
	for bookmark in results:
		results_json.append(build_bookmark_search_results(bookmark))
	return results_json

def build_bookmark_search_results(item):
	bookmark = {}
	bookmark['curator_title'] = item.curator_title
	bookmark['rating'] = item.rating
	bookmark['description'] = item.description
	bookmark['work'] = {}
	bookmark['curator'] = {}
	user = User.query.filter_by(id=item.user_id).first()
	if user is not None:
		bookmark['curator']['curator_name'] = user.username
	bookmark['tags'] = []
	if len(item.work) == 1:
		bookmark['work']['title'] = item.work[0].title
		bookmark['work']['username'] = item.work[0].username
		bookmark['work']['user_id'] = item.work[0].user_id
	return bookmark

def search_tag(tag):
	search = TagSearch.search()
	query = Match(text=tag)
	search = search.query(query)
	results = search.execute()
	return results