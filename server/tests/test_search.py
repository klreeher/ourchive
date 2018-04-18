import unittest
from server.tests.base import BaseTestCase
from server.flask_app.search import logic as searcher
import json
from server.flask_app import db
from server.flask_app.models import User


class TestSearch(BaseTestCase):

	def test_search_on_term(self):
		results = searcher.search_text_on_term("ta")
		self.assertEqual(len(results), 2)

	def test_search_chapter(self):
		results = searcher.search_text_on_term("nothing nothing nothing")
		self.assertEqual(len(results), 0)

	def test_search_phrase(self):
		results = searcher.search_text_on_term("i")
		self.assertEqual(len(results), 2)

	def test_generic_search(self):
		results = searcher.search_text_on_term("horse")
		self.assertEqual(len(results), 2)

	def test_search_by_creator(self):
		self.add_user()
		results = searcher.search_by_creator("elenaimp")
		self.assertEqual(len(results), 2)

	def test_search_by_complete(self):
		self.add_user()
		results = searcher.search_by_complete(False)
		self.assertEqual(len(results), 2)

	def add_user(self):
		user = User(
			email='test@test.com',
			password='test',
			username='elenaimp'
		)
		db.session.add(user)
		db.session.commit()