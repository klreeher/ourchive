import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment, Bookmark, Message
from server.flask_app.bookmark import logic as bookmark
from server.flask_app.work import views as work
from server.tests.base import BaseTestCase
import json


class TestMessage(BaseTestCase):
    def test_add_message(self):
        data = self.build_data(True, False, True)
        
        self.assertTrue(True)


    def build_data(self, build_tags, build_comments, build_links):
        data = {}

        data["work_id"] = 1
        
        if build_tags == False:
            data["tags"] = []
        else:

            tagType = TagType(label='one')
            db.session.add(tagType)

            tagType = TagType(label='two')
            db.session.add(tagType)
            tag_one = {}
            tag_one['label'] = "blah"
            tag_one['id'] = 1
            tag_one['tags'] = ['one', 'two', 'three']


            tag_two = {}
            tag_two['label'] = "bleh"
            tag_two['id'] = 2
            tag_two['tags'] = ['one', 'two', 'four']
            data["tags"] = [tag_one, tag_two]
        data["curator_title"] = "A Fic I Read"
        data["description"] = "This was fine I guess..."
        data["rating"] = 3
        if build_links == False:
            data["links"] = []
        else:
            link_one = {}
            link_one["link"] = "google.com",
            link_one["text"] = "Goog"

            link_two = {}
            link_two["link"] = "uber.com",
            link_two["text"] = "Eat The Rich"

            data["links"] = [link_one, link_two]

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