import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment
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

    def test_delete_work(self):

        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()

        work.delete_work(1)
        works = Work.query.all()
        self.assertTrue(len(works) == 0)

    def test_build_work_tags(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)

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

        tags = work.build_work_tags(workObj)
        self.assertTrue(len(tags) == 2)
        self.assertTrue(tags[0]['tags'][0].text == 'one')

    def test_add_comments(self):
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
        
        comment = Comment(user_id=1, text='hello world', chapter_id=1)
        db.session.add(comment)
        db.session.commit()
        commentTwo = Comment(user_id=1, text='goodbye world', chapter_id=1)
        comment.comments.append(commentTwo)
        db.session.add(comment)
        db.session.commit()

        self.assertTrue(Comment.query.filter_by(id=1).first().comments[0].text=='goodbye world')


if __name__ == '__main__':
    unittest.main()