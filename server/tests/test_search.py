import unittest
from server.tests.base import BaseTestCase
from server.flask_app.search import logic as searcher
import json
from server.flask_app import db
from server.flask_app.models import User


class TestSearch(BaseTestCase):

	def test_search_work_on_term(self):
		results = searcher.search_text_on_term("ta")
		self.assertTrue(len(results['work_results']) >= 13)

	def test_search_work_chapter(self):
		results = searcher.search_text_on_term("nothing nothing nothing")
		self.assertEqual(len(results['work_results']), 0)

	def test_search_work_phrase(self):
		results = searcher.search_text_on_term("i")
		self.assertTrue(len(results['work_results']) >= 13)

	def test_generic_work_search(self):
		results = searcher.search_text_on_term("horse")
		self.assertEqual(len(results['work_results']), 3)

	def test_search_work_by_complete(self):
		self.add_user()
		results = searcher.search_by_complete(False)
		self.assertEqual(len(results), 10)

	def test_search_bookmark_by_title(self):
		results = searcher.search_bookmark_by_term("A Fic I Read")
		self.assertEqual(len(results['bookmarks']), 3)

	def test_search_bookmark_by_title_no_results(self):
		results = searcher.search_bookmark_by_term("helloksjdf")
		self.assertEqual(len(results['bookmarks']), 0)

	def test_search_tag(self):
		results = searcher.search_tag("four")
		self.assertEqual(len(results), 1)

	def add_user(self):
		user = User(
			email='test@test.com',
			password='test',
			username='elenaimp'
		)
		db.session.add(user)
		db.session.commit()