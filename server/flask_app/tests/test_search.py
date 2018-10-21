import unittest
from tests import BaseTestCase as TestCase
from search import logic as searcher
import json
from database import db
from models import User


class TestSearch(TestCase):

	def test_search_work_on_term(self):
		results = searcher.search_text_on_term("ta")
		self.assertTrue(len(results) == 0)

	def test_search_work_chapter(self):
		results = searcher.search_text_on_term("nothing nothing nothing")
		self.assertEqual(len(results), 0)

	def test_search_work_phrase(self):
		results = searcher.search_text_on_term("i")
		self.assertTrue(len(results) == 0)

	def test_generic_work_search(self):
		results = searcher.search_text_on_term("horse")
		self.assertEqual(len(results), 0)

	def test_search_work_by_complete(self):
		self.add_user()
		results = searcher.search_by_complete(False)
		self.assertEqual(len(results), 0)

	def test_search_bookmark_by_title(self):
		results = searcher.search_bookmark_by_term("A Fic I Read")
		self.assertEqual(len(results), 0)

	def test_search_bookmark_by_title_no_results(self):
		results = searcher.search_bookmark_by_term("helloksjdf")
		self.assertEqual(len(results), 0)

	def test_search_tag(self):
		results = searcher.search_tag("four")
		self.assertEqual(len(results), 0)

	def add_user(self):
		user = User(
			email='test@test.com',
			password='test',
			username='elenaimp'
		)
		db.session.add(user)
		db.session.commit()