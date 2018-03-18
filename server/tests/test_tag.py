import unittest

from server.flask_app import db
from server.flask_app.models import User, Message, Work, TagType, Tag
from server.flask_app.tag import logic as tag
from server.tests.base import BaseTestCase
import json


class TestTag(BaseTestCase):
    def test_get_works(self):
        tagType = TagType(label='one')
        db.session.add(tagType)

        tagType = TagType(label='two')
        db.session.add(tagType)
        

        tag_one = Tag(tag_type_id=1, text='one')
        tag_two = Tag(tag_type_id=2, text='two')

        workObj = Work()
        workObj.tags.append(tag_one)
        workObj.tags.append(tag_two)
        db.session.add(workObj)

        db.session.commit()
        tag.get_tagged_data(1, 'one')

if __name__ == '__main__':
    unittest.main()