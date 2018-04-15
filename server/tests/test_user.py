import unittest

from server.flask_app import db
from server.flask_app.models import User, WorkType, TagType, NotificationType
from server.tests.base import BaseTestCase
from server.flask_app.user import logic as user_logic
from server.flask_app.auth import logic as auth
from server.flask_app import redis_db
import json


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

    def test_ban_user(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        db.session.add(user)
        db.session.commit()
        user.banned = True 
        db.session.commit()
        banned_users = user_logic.get_banned_users()
        self.assertTrue(banned_users[0]['email'] == 'test@test.com')

    def test_add_tag_types(self):
        user_logic.add_tag_types([{'id': -1, 'label': 'one'}])
        user_logic.add_tag_types([{'id': 1, 'label': 'one'}, {'id': -2, 'label': 'two'}, {'id': -3, 'label': 'three'}])
        types = TagType.query.all()
        self.assertEqual(3, len(types))
        self.assertEqual('one', types[0].label)

    def test_add_work_types(self):
        user_logic.add_work_types([{'id': -1, 'type_name': 'fiction'}, {'id': -2, 'type_name': 'audio'}])
        types = WorkType.query.all()
        self.assertEqual(2, len(types))
        self.assertEqual('fiction', types[0].type_name)

    def test_add_notification_types(self):
        type_one = {}
        type_one['type_label'] = 'System'
        type_one['send_email'] = True
        type_two = {}
        type_two['type_label'] = 'Comment'
        type_two['send_email'] = False
        user_logic.add_notification_types([type_one, type_two])
        types = NotificationType.query.all()
        self.assertEqual(False, types[1].send_email)
        self.assertEqual('System', types[0].type_label)

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

    def test_get_work_types(self):        
        response = auth.register(dict(email='elena@gmail.com', password='123456789'))
        user = User.query.first()
        user.admin = True 
        db.session.commit()
        user_logic.add_work_types([{'id': -1, 'type_name': 'Fiction'}, {'id': -2, 'type_name': 'Criticism'}])
        response = self.client.get(
            '/api/admin/works/types',
            headers=dict(Authorization='Bearer ' + 
                response.json['auth_token']),
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
        self.assertEqual(response.json[0]['type_name'], 'Fiction')
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()