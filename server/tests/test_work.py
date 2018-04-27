import unittest

from server.flask_app import db, app
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment
from server.flask_app.work import views as work
from server.flask_app.work import file_utils as file_utils
from server.tests.base import BaseTestCase
import json


class TestWorkView(BaseTestCase):
    def test_add_work(self):
        data = self.build_data(False, False)
        data['user_id'] = 1
        new_id = work.add_work(data)
        selected_work = Work.query.filter_by(id=1).first()
        self.assertTrue(new_id==1)
        self.assertTrue(selected_work.is_complete == 0)

    def test_add_chapters(self):

        data = self.build_data(False, True)        
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()
        work.add_chapters(workObj, data["chapters"])   
        new_id = Chapter.query.filter_by(work_id=1)
        self.assertTrue(new_id.first().title == "Chapter One Title")
        self.assertTrue(new_id.count() == 1)

    def test_add_tags(self):
        data = self.build_data(True, True)
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()

        tagType = TagType()
        db.session.add(tagType)

        tagTypeTwo = TagType()
        db.session.add(tagTypeTwo)
        db.session.commit()

        new_id = work.add_tags(workObj, data["work_tags"])  
        expected_len = [x for x in new_id if x.tag_type_id == 1] 
        self.assertTrue(new_id[0].text == "one")
        self.assertTrue(len(expected_len) == 3)

    def test_count_words(self):

        count = work.count_words("this is a chapter. blah blah blah. horses - and- dogs")  
        self.assertTrue(count == 10)

    def test_delete_work(self):

        self.build_data(False, False)
        
        workObj = Work()
        workObj.user_id = 1
        db.session.add(workObj)
        db.session.commit()

        work.delete_work(1, 1)
        works = Work.query.all()
        self.assertTrue(len(works) == 0)

    def test_build_work_tags(self):
        self.add_user()

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
        self.assertTrue(tags[0]['tags'][0] == 'one')

    def test_add_comments(self):
        data = self.build_data(True, True)
        
        workObj = Work()
        db.session.add(workObj)
        db.session.commit()

        work.add_chapters(workObj, data["chapters"])   
        
        comment = Comment(user_id=1, text='hello world', chapter_id=1)
        db.session.add(comment)
        db.session.commit()
        commentTwo = Comment(user_id=1, text='goodbye world', chapter_id=1)
        comment.comments.append(commentTwo)
        db.session.add(comment)
        db.session.commit()

    def test_update_work(self):
        data = self.build_data(True, True)

        tagType = TagType(label='one')
        db.session.add(tagType)

        tagType = TagType(label='two')
        db.session.add(tagType)
        

        tag_one = Tag(tag_type_id=1, text='one')
        tag_two = Tag(tag_type_id=2, text='two')

        workObj = Work()
        workObj.title = "Beginning Title"
        workObj.user_id = 1
        db.session.add(workObj)
        

        work.add_chapters(workObj, data["chapters"])   
        db.session.commit()

        data['work_id'] = workObj.id
        data['chapters'][0]['id'] = workObj.chapters[0].id
        work.update_work(data)
        workObj = Work.query.filter_by(id=workObj.id).first()
        self.assertTrue(workObj.title == "A Tale of Two Poor Students")

    def test_get_work_by_user(self):
        data = self.build_data(True, True)

        tagType = TagType(label='one')
        db.session.add(tagType)

        tagType = TagType(label='two')
        db.session.add(tagType)

        db.session.commit()
        data['user_id'] = 1
        work.add_work(data)   
        selected_work = json.loads(work.get_by_user(1))
        self.assertTrue(selected_work['works'][0]['title'] == "A Tale of Two Poor Students")


    def build_data(self, build_tags, build_chapters):
        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "False"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_notes"] = "a note here"
        data['user_id'] = 1
        if build_tags == False:
            data["work_tags"] = []
        else:
            tag_one = {}
            tag_one['label'] = "blah"
            tag_one['id'] = 1
            tag_one['tags'] = ['one', 'two', 'three']


            tag_two = {}
            tag_two['label'] = "bleh"
            tag_two['id'] = 2
            tag_two['tags'] = ['one', 'two', 'four']
            data["work_tags"] = [tag_one, tag_two]
        if build_chapters == False:
            data["chapters"] = []
        else:
            chapter = {}
            chapter['title'] = "Chapter One Title"
            chapter['number'] = 1
            chapter['text'] = "Plot plot plot plot plot"
            chapter['audio_url'] = ""
            chapter['image_url'] = ""     
            chapter['summary'] = "sixteen tiny horses"  
            chapter['image_alt_text'] = ""     
            data["chapters"] = [chapter]

        self.add_user()

        return data

    def test_audio_utils(self):
        result = file_utils.file_is_audio(app.config['TEST_FILE_LOC']+'test_audio.mp3')
        self.assertTrue(result)

    def test_image_utils(self):
        result = file_utils.file_is_image(app.config['TEST_FILE_LOC']+'test_image.jpg')
        self.assertTrue(result)

    def test_audio_utils_false(self):
        result = file_utils.file_is_audio(app.config['TEST_FILE_LOC']+'test_fake.mp3')
        self.assertFalse(result)

    def add_user(self):
        user = User(
            email='test@test.com',
            password='test',
            username='elenaimp'
        )
        db.session.add(user)
        db.session.commit()

if __name__ == '__main__':
    unittest.main()