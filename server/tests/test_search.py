import unittest
from server.tests.base import BaseTestCase
from server.flask_app.work.search_wrapper import WorkSearch
import json


class TestSearch(BaseTestCase):
	def test_search_on_term(self):
		searcher = WorkSearch()
		results = searcher.search_text_on_term("ta")
		self.assertEqual(len(results), 1)

	def test_search_chapter(self):
		searcher = WorkSearch()
		results = searcher.search_text_on_term("nothing nothing nothing")
		self.assertEqual(len(results), 0)

	def test_search_phrase(self):
		searcher = WorkSearch()
		results = searcher.search_text_on_term("Chapter One")
		self.assertEqual(len(results), 1)

	def test_generic_search(self):
		searcher = WorkSearch()
		results = searcher.search_text_on_term("plot plot")
		self.assertEqual(len(results), 1)