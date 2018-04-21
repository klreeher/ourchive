from datetime import datetime
from elasticsearch_dsl.query import MultiMatch, Match, Nested, Q, Query
from ..models import User
from ..work.search_wrapper import WorkSearch
from ..bookmark.search_wrapper import BookmarkSearch
from ..tag.search_wrapper import TagSearch

def do_advanced_search(include_terms, exclude_terms, basic_term,
	curator_usernames, creator_usernames, search_works, search_bookmarks):
	results = {}
	if search_works:
		results["works"] = search_works_on_query(include_work_terms(include_terms) & 
			exclude_work_terms(exclude_terms) & search_by_creators_query(creator_usernames))
	if search_bookmarks:
		results["bookmarks"] = search_bookmarks_on_query(include_bookmark_terms(include_terms) &
			exclude_bookmark_terms(exclude_terms) &
			search_by_curators_query(curator_usernames))
	return results

def search_works_on_query(query):
	WorkSearch.init()
	search = WorkSearch.search()
	search = search.query(query)
	results = search.execute()
	results_json = []
	for item in results:
		results_json.append(build_work_search_results(item))
	return results_json

def search_bookmarks_on_query(query):
	BookmarkSearch.init()
	search = BookmarkSearch.search()
	search = search.query(query)
	results = search.execute()
	results_json = []
	for item in results:
		results_json.append(build_bookmark_search_results(item))
	return results_json

def search_by_creators_query(creator_usernames):
	query = None
	for username in creator_usernames:
		if query is None:
			query = search_by_creator_query(username)
		else:
			query = query | search_by_creator_query(username)
	return query

def search_by_curators_query(curator_usernames):
	query = None
	for username in curator_usernames:
		if query is None:
			query = search_by_curator_query(username)
		else:
			query = query | search_by_curator_query(username)
	return query


def exclude_work_terms(terms):
	exclude = None
	for term in terms:
		query = ~get_work_query(term)
		chapter_query = ~get_chapter_query(term)
		if exclude is None:
			exclude = query | chapter_query
		else:
			exclude = exclude | query | chapter_query
	return exclude

def include_work_terms(terms):
	include = None
	for term in terms:
		query = get_work_query(term)
		chapter_query = get_chapter_query(term)
		if include is None:
			include = query | chapter_query
		else:
			include = include | query | chapter_query
	return include

def exclude_bookmark_terms(terms):
	exclude = None
	for term in terms:
		query = ~get_bookmark_query(term)
		if exclude is None:
			exclude = query
		else:
			exclude = exclude | query
	return exclude

def include_bookmark_terms(terms):
	include = None
	for term in terms:
		query = get_bookmark_query(term)
		if include is None:
			include = query
		else:
			include = include | query
	return include


def search_on_term(term, search_works, search_bookmarks):
	results = {}
	if search_works:
		results["works"] = search_text_on_term(term)
	if search_bookmarks:
		results["bookmarks"] = search_bookmark_by_term(term)
	return results

def get_work_query(term):
	query = MultiMatch(query=term, fields=['title', 'work_summary', 'work_notes', 'word_count', 
		'user_id'], 
		fuzziness=2)
	return query

def get_chapter_query(term):
	chapter_query = Q({"nested": {
		"path" : "chapters",
            "query" : {
                "multi_match" : {
                    "query" : term,
                    "fields" : ["chapters.title", "chapters.text", "chapters.summary", "chapters.image_alt_text"]
                    
                }
            }
        }})
	return chapter_query

def get_bookmark_query(term):
	return MultiMatch(query=term, fields=['curator_title', 'rating', 'description'], 
		fuzziness=2)

def search_text_on_term(term):
	WorkSearch.init()
	search = WorkSearch.search()
	query = get_work_query(term)
	chapter_query = get_chapter_query(term)	
	combined = chapter_query | query
	search = search.query(combined)
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

def search_by_creator_query(creator_name):
	user = User.query.filter_by(username=creator_name).first()
	query = Match(user_id=str(user.id))
	return query

def search_by_curator_query(curator_name):
	user = User.query.filter_by(username=curator_name).first()
	query = Match(user_id=str(user.id))
	return query

def search_by_complete(complete):
	search = WorkSearch.search()
	query = Match(is_complete=complete)
	search = search.query(query)		
	results = search.execute()
	return results

def search_bookmark_by_term(term):
	BookmarkSearch.init()
	search = BookmarkSearch.search()
	query = get_bookmark_query(term)
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