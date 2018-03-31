import unittest

from server.flask_app import db
from server.flask_app.models import User
from server.tests.base import BaseTestCase
from server.flask_app.user import logic as user_logic
from server.flask_app import redis_db


class TestUserModel(BaseTestCase):

    def test_encode_auth_token(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
    def test_decode_auth_token(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(User.decode_auth_token(auth_token.decode("utf-8") ) == 1)

    def test_add_to_blocklist(self):
        blocked_id = 1
        blocker_id = 2
        result = user_logic.add_blocklist(1, 2)
        self.assertTrue(1, result)

    def test_check_in_blocklist(self):
        blocked_id = 1
        blocker_id = 2
        user_logic.add_blocklist(1, 2)
        blocked = user_logic.in_blocklist(1, 2)
        self.assertTrue(blocked)

if __name__ == '__main__':
    unittest.main()