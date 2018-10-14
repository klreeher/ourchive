from flask_testing import TestCase

from server.flask_app import app, db
import redis


class BaseTestCase(TestCase):
    """ Base Tests """

    def create_app(self):
        app.config.from_object('server.config.TestingConfig')
        app.redis_db = redis.StrictRedis(host=app.config.get('REDIS_SERVERNAME'), port=6379, db=0, password='devpassword')
        return app

    def setUp(self):
        db.create_all()
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()