import unittest

from flask import current_app
from flask_testing import TestCase

from server.flask_app import app


class TestDevelopmentConfig(TestCase):
    def create_app(self):
        app.config.from_object('server.config.DevelopmentConfig')
        return app

    def test_app_is_development(self):
        self.assertTrue(app.config['SECRET_KEY'] is 'bad_policy')
        self.assertTrue(app.config['DEBUG'] is True)
        self.assertFalse(current_app is None)
        self.assertTrue(
            app.config['SQLALCHEMY_DATABASE_URI'] == 'postgresql://postgres:F4rG0==nd@localhost/ourchive'
        )


class TestTestingConfig(TestCase):
    def create_app(self):
        app.config.from_object('server.config.TestingConfig')
        return app

    def test_app_is_testing(self):
        self.assertTrue(app.config['SECRET_KEY'] is 'bad_policy')
        self.assertTrue(app.config['DEBUG'])
        self.assertTrue(
            app.config['SQLALCHEMY_DATABASE_URI'] == 'postgresql://postgres:F4rG0==nd@localhost/ourchive_test'
        )


class TestProductionConfig(TestCase):
    def create_app(self):
        app.config.from_object('server.config.ProductionConfig')
        return app

    def test_app_is_production(self):
        self.assertTrue(app.config['DEBUG'] is False)


if __name__ == '__main__':
    unittest.main()