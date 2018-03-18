import unittest

from server.flask_app import db
from server.flask_app.models import Work, User, TagType, Chapter, Tag, Comment, Bookmark
from server.flask_app.bookmark import logic as bookmark
from server.flask_app.work import views as work
from server.tests.base import BaseTestCase
import json


class TestBookmark(BaseTestCase):
    def test_add_bookmark(self):
        data = self.build_data(True, False, True)
        work_data = self.build_dummary_work_data(True, True)
        work_id = work.add_work(work_data, 1)
        bookmark.add_bookmark(data, 1)
        new_bookmark = Bookmark.query.filter_by(id=1).first()
        self.assertTrue(new_bookmark.description == "This was fine I guess...")

    def test_update_bookmark(self):
        data = self.build_data(True, False, True)
        work_data = self.build_dummary_work_data(True, True)
        work_id = work.add_work(work_data, 1)
        bookmark_id = bookmark.add_bookmark(data, 1)
        data["id"] = bookmark_id
        data["description"] = "This was bad actually!!!"
        bookmark.update_bookmark(data)
        updated_bookmark = Bookmark.query.filter_by(id=bookmark_id).first()
        self.assertTrue(updated_bookmark.description == "This was bad actually!!!")

    def test_delete_bookmark(self):
        bookmarkObj = Bookmark()
        db.session.add(bookmarkObj)
        db.session.commit()
        bookmark.delete_bookmark(1)
        bookmarks = Bookmark.query.all()
        self.assertTrue(len(bookmarks) == 0)
    
    def test_get_bookmark(self):  
        data = self.build_data(True, False, False)      
        work_data = self.build_dummary_work_data(True, True)
        work_id = work.add_work(work_data, 1)
        work_fetched = Work.query.filter_by(id=work_id).first()
        bookmark_id = bookmark.add_bookmark(data, 1)
        new_bookmark = bookmark.get_bookmark(1)
        self.assertTrue(new_bookmark["curator_title"] == "A Fic I Read")

    def test_get_bookmarks_by_curator(self):
        data = self.build_data(True, False, False)      
        work_data = self.build_dummary_work_data(True, True)
        work_id = work.add_work(work_data, 1)
        work_fetched = Work.query.filter_by(id=work_id).first()
        bookmark_id = bookmark.add_bookmark(data, 1)
        fetched_bookmark = bookmark.get_bookmarks_by_curator(1)
        self.assertTrue(fetched_bookmark[0]["rating"] == 3)


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

    def build_dummary_work_data(self, build_tags, build_chapters):
        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "False"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_notes"] = "a note here"
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
            chapter['summary'] = ""  
            chapter['image_alt_text'] = ""          
            data["chapters"] = [chapter]

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