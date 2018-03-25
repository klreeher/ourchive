import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment, Bookmark
from server.flask_app.auth import logic as auth
from server.tests.base import BaseTestCase
import json


class TestAuthBlueprint(BaseTestCase):
	def test_registration(self):
		response = auth.register(json.dumps(dict(email='joe@gmail.com', password='123456')))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully registered.')
		self.assertTrue(data['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()