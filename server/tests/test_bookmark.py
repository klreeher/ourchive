import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment, Bookmark
from server.flask_app.bookmark import logic as bookmark
from server.tests.base import BaseTestCase
import json


class TestBookmark(BaseTestCase):
    def test_add_bookmark(self):
        return True

    


    def build_data(self, build_tags, build_comments, build_links):
        data = {}
        

        self.add_user()

        return data

    def add_user(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()

if __name__ == '__main__':
    unittest.main()