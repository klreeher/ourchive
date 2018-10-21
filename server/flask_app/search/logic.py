from datetime import datetime
from elasticsearch_dsl.query import MultiMatch, Match, Nested, Q, Query
from models import User
from work.search_wrapper import WorkSearch
from bookmark.search_wrapper import BookmarkSearch
from tag.search_wrapper import TagSearch
from flask import current_app as app

def do_advanced_search(include_terms, exclude_terms, 
	curator_usernames, creator_usernames, search_works, search_bookmarks, page_number, types=None):
	if not app.config.get('USE_ES'):
		return {}
	results = {}
	final_query = None
	if search_works:
		if include_terms != "":
			final_query = include_work_terms(include_terms.split())
		if exclude_terms != "":
			if final_query is not None:
				final_query = final_query & exclude_work_terms(exclude_terms.split())
			else:
				final_query = exclude_work_terms(exclude_terms.split())
		if creator_usernames != "":
			if final_query is not None:
				final_query = final_query & search_by_creators_query(creator_usernames.split())
			else:
				final_query = search_by_creators_query(creator_usernames.split())
		if types is not None:
			type_query = None
			for work_type in types:
				if type_query is not None:
					type_query = type_query | search_by_type_query(str(work_type['id']))
				else:
					type_query = search_by_type_query(str(work_type['id']))
			final_query = final_query & type_query
		print(final_query)
		work_results = search_works_on_query(final_query, page_number)
		results["works"] = work_results['works']
		results['work_pages'] = work_results['pages']
	final_query = None
	if search_bookmarks:
		if include_terms != "":
			final_query = include_bookmark_terms(include_terms.split())
		if exclude_terms != "":
			if final_query is not None:
				final_query = final_query & exclude_bookmark_terms(exclude_terms.split())
			else:
				final_query = exclude_bookmark_terms(exclude_terms.split())
		if creator_usernames != "":
			if final_query is not None:
				final_query = final_query & search_by_curators_query(curator_usernames.split())
			else:
				final_query = search_by_curators_query(curator_usernames.split())
		bookmark_results = search_bookmarks_on_query(final_query, page_number)
		results["bookmarks"] = bookmark_results['bookmarks']
		results['bookmark_pages'] = bookmark_results['pages']
	return results

def search_works_on_query(query, page_number):
	if not app.config.get('USE_ES'):
		return {}
	WorkSearch.init()
	search = WorkSearch.search()
	search = search.query(query)
	search = search[(page_number-1) * 25:page_number*25]
	results = search.execute()
	work_results = {}
	work_results['pages'] = results['hits']['total']/25
	results_json = []
	for item in results:
		results_json.append(build_work_search_results(item))
	work_results['works'] = results_json
	return work_results

def search_bookmarks_on_query(query, page_number):
	if not app.config.get('USE_ES'):
		return {}
	BookmarkSearch.init()
	search = BookmarkSearch.search()
	search = search.query(query)
	search = search[(page_number-1) * 25:page_number*25]
	results = search.execute()
	bookmark_results = {}
	bookmark_results['pages'] = results['hits']['total']/25
	results_json = []
	for item in results:
		results_json.append(build_bookmark_search_results(item))
	bookmark_results['bookmarks'] = results_json
	return bookmark_results

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


def search_on_term(term, search_works, search_bookmarks, page_number):
	results = {}
	if search_works:
		search_results = search_text_on_term(term, page_number)
		results["works"] = search_results["work_results"]
		results["work_pages"] = search_results["count"]
	if search_bookmarks:
		search_results = search_bookmark_by_term(term, page_number)
		results["bookmarks"] = search_results['bookmarks']
		results["bookmark_pages"] = search_results['count']
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

def search_text_on_term(term, page_number=1):
	if not app.config.get('USE_ES'):
		return {}
	WorkSearch.init()
	search = WorkSearch.search()
	query = get_work_query(term)
	chapter_query = get_chapter_query(term)	
	combined = chapter_query | query
	search = search[(page_number-1) * 25:page_number*25]
	search = search.query(combined)
	results = search.execute()
	results_json = {}
	work_results = []
	for item in results:
		work_results.append(build_work_search_results(item))
	results_json['work_results'] = work_results
	results_json['count'] = results['hits']['total']/25
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
	if not app.config.get('USE_ES'):
		return {}
	search = WorkSearch.search()
	query = Match(is_complete=complete)
	search = search.query(query)		
	results = search.execute()
	return results

def search_by_type_query(type):
	query = Match(work_type_id=type)
	return query

def search_bookmark_by_term(term, page_number=1):
	if not app.config.get('USE_ES'):
		return {}
	BookmarkSearch.init()
	search = BookmarkSearch.search()
	query = get_bookmark_query(term)
	search = search[(page_number-1) * 25:page_number*25]
	search = search.query(query)
	results = search.execute()
	return_json = {}
	results_json = []
	for bookmark in results:
		results_json.append(build_bookmark_search_results(bookmark))
	return_json['count'] = results['hits']['total']/25
	return_json['bookmarks'] = results_json
	return return_json

def build_bookmark_search_results(item):
	bookmark = {}
	bookmark['curator_title'] = item.curator_title
	bookmark['rating'] = item.rating
	bookmark['description'] = item.description
	bookmark['id'] = item.meta.id
	bookmark['work'] = {}
	bookmark['curator'] = {}
	user = User.query.filter_by(id=item.user_id).first()
	if user is not None:
		bookmark['curator']['curator_name'] = user.username
		bookmark['curator']['curator_id'] = user.id
	bookmark['tags'] = []
	if len(item.work) == 1:
		bookmark['work']['title'] = item.work[0].title
		bookmark['work']['username'] = item.work[0].username
		bookmark['work']['user_id'] = item.work[0].user_id
	return bookmark

def search_tag(tag):
	if not app.config.get('USE_ES'):
		return {}
	search = TagSearch.search()
	query = Match(text=tag)
	search = search.query(query)
	results = search.execute()
	return results