import unittest

from database import db
from models import User, Message, Work, TagType, Tag
from tag import logic as tag
from tests import BaseTestCase as TestCase
import json


class TestTag(TestCase):
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