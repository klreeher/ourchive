import unittest

from database import db
from models import User, Comment, Bookmark, Work, Chapter
from comment import logic as comment
from work import views as work
from tests import BaseTestCase as TestCase
import json


class TestComment(TestCase):

    def test_add_reply(self):
        self.add_user()
        self.add_bookmark()
        data = self.build_data(False, True, False)
        comment.add_comment_to_bookmark(data)
        data = self.build_data(True, True, False)
        new_id = comment.add_comment_to_bookmark(data)
        new_comment = Comment.query.filter_by(id=1).first()
        self.assertTrue(new_comment.comments[0].text == "This is a reply...")

    def test_add_to_bookmark(self):
        self.add_user()
        self.add_bookmark()
        data = self.build_data(False, True, False)
        new_id = comment.add_comment_to_bookmark(data)
        new_comment = Comment.query.filter_by(id=1).first()
        new_bookmark = Bookmark.query.filter_by(id=new_comment.bookmark_id).first()
        self.assertTrue(new_bookmark.comments[0].text == "Testing 1234. Comment one here we go. a comment was made")

    def test_add_to_chapter(self):
        self.add_user()
        self.add_chapter()
        data = self.build_data(False, False, True)
        new_id = comment.add_comment_to_chapter(data)
        new_comment = Comment.query.filter_by(id=1).first()
        new_chapter = Chapter.query.filter_by(id=new_comment.chapter_id).first()
        self.assertTrue(new_chapter.comments[0].text == "Testing 1234. Comment one here we go. a comment was made")

    def test_delete_comment(self):
        self.add_user()
        self.add_bookmark()
        data = self.build_data(False, True, False)
        new_id = comment.add_comment_to_bookmark(data)
        comment.delete_comment(new_id, 1)
        self.assertTrue(len( Comment.query.all()) == 0)

    def build_data(self, build_parent, build_bookmark, build_chapter):
        built = {}
        built["work_id"] = 1
        if build_parent:
        	built["parent_id"] = 1
        	built["text"] = "This is a reply..."
        else:
        	built["text"] = "Testing 1234. Comment one here we go. a comment was made"
        built["user_id"] = 1
        if build_bookmark:
        	built["bookmark_id"] = 1
        if build_chapter:
        	built["chapter_id"] = 1

        built["comments"] = []
        return built

    def add_user(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        userTwo = User(
            email='test2@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.add(userTwo)
        db.session.commit()

    def add_bookmark(self):
        bookmark = Bookmark(curator_title="a test")
        bookmark.anon_comments_permitted = True
        bookmark.comments_permitted = True
        db.session.add(bookmark)
        db.session.commit()

    def add_chapter(self):
        work = Work(title="test")
        work.anon_comments_permitted = True
        work.comments_permitted = True
        db.session.add(work)
        work.chapters.append(Chapter(title="test chap"))
        db.session.commit()

if __name__ == '__main__':
    unittest.main()
