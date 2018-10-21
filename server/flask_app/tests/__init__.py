from unittest import TestCase
from flask_sqlalchemy import SQLAlchemy

class BaseTestCase(TestCase):
    def setUp(self):
        import config
        from main import app_factory
        import database

        self.app = app_factory(config.Test, config.project_name)
        self.client = self.app.test_client()
        database.create_all()

    def tearDown(self):
        import database
        database.db.session.remove()
        database.db.drop_all()