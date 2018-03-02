import unittest

from server.flask_app import db
from server.flask_app.models import Work, User
from server.flask_app.work import views as work
from server.tests.base import BaseTestCase
import json


class TestWorkView(BaseTestCase):
    def test_add_work(self):
        data = {}
        data["title"] = "A Tale of Two Poor Students"
        data["is_complete"] = "true"
        data["word_count"] = "4000"
        data["work_summary"] = "some stuff happens"
        data["work_tags"] = []
        data["chapters"] = []

        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()

        new_id = work.add_work(data)   
        self.assertTrue(new_id==1)

if __name__ == '__main__':
    unittest.main()