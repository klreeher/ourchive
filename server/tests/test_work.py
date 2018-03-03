import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter
from server.flask_app.work import views as work
from server.tests.base import BaseTestCase
import json


class TestWorkView(BaseTestCase):
    def test_add_work(self):
        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "False"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_tags"] = []
        data["chapters"] = []
        data["work_notes"] = "a note here"

        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()

        new_id = work.add_work(data, 1)   
        selected_work = Work.query.filter_by(id=1).first()
        self.assertTrue(new_id==1)
        self.assertTrue(selected_work.is_complete == 0)

    def test_add_chapters(self):

        chapter = {}
        chapter['title'] = "Chapter One Title"
        chapter['number'] = 1
        chapter['text'] = "Plot plot plot plot plot"
        chapter['audio_url'] = ""
        chapter['image_url'] = ""

        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "true"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_notes"] = "a note here"
        data["work_tags"] = []
        data["chapters"] = [chapter
        ]

        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()

        work.add_chapters(1, data["chapters"])   
        new_id = Chapter.query.filter_by(work_id=1)
        self.assertTrue(new_id.first().title == "Chapter One Title")
        self.assertTrue(new_id.count() == 1)

    def test_add_tags(self):

        chapter = {}
        chapter['title'] = "Chapter One Title"
        chapter['number'] = 1
        chapter['text'] = "Plot plot plot plot plot"
        chapter['audio_url'] = ""
        chapter['image_url'] = ""

        tag_one = {}
        tag_one['text'] = "blah"
        tag_one['id'] = 1


        tag_two = {}
        tag_two['text'] = "bleh"
        tag_two['id'] = 1

        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "true"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_tags"] = [tag_one, tag_two]
        data["work_notes"] = "a note here"
        data["chapters"] = [chapter
        ]

        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()

        tagType = TagType()
        db.session.add(tagType)
        db.session.commit()

        new_id = work.add_tags(workObj, data["work_tags"])   
        self.assertTrue(new_id[0].text == "blah")
        self.assertTrue(len(new_id) == 2)

    def test_count_words(self):

        count = work.count_words("this is a chapter. blah blah blah. horses - and- dogs")  
        self.assertTrue(count == 10)

if __name__ == '__main__':
    unittest.main()