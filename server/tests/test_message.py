import unittest

from server.flask_app import db
from server.flask_app.models import User, Message
from server.flask_app.message import logic as message
from server.flask_app.user import logic as user_logic
from server.flask_app.auth import logic as auth
from server.tests.base import BaseTestCase
import json


class TestMessage(BaseTestCase):
    def test_add_message(self):
        data = self.build_data()
        new_id = message.add_message(data)
        new_message = Message.query.filter_by(id=new_id).first()
        self.assertTrue(new_message.message_subject == "test")

    def test_delete_message(self):
        data = self.build_data()
        new_id = message.add_message(data)
        message.delete_message(new_id, 1)
        self.assertTrue(len( Message.query.all()) == 0)

    def test_mark_read_message(self):
        data = self.build_data()
        new_id = message.add_message(data)    
        second_id = message.add_message(data)    
        message.update_read_status(new_id, True, 1)
        new_message = Message.query.filter_by(id=new_id).first()
        second_message = Message.query.filter_by(id=second_id).first()
        self.assertTrue(new_message.message_read == True)
        self.assertTrue(second_message.message_read == False)

    def test_mark_all_read_message(self):
        data = self.build_data()
        new_id = message.add_message(data)    
        second_id = message.add_message(data)    
        message.mark_all_read(1)
        new_message = Message.query.filter_by(id=new_id).first()
        second_message = Message.query.filter_by(id=second_id).first()
        self.assertTrue(new_message.message_read == True)
        self.assertTrue(second_message.message_read == True)

    def test_add_message_reply(self):
        data = self.build_data()
        new_id = message.add_message(data)   
        data["parent_id"] = new_id 
        second_id = message.add_message(data)    
        new_message = Message.query.filter_by(id=new_id).first()
        self.assertTrue(new_message.replies[0].id == second_id)

    def test_send_to_user_who_blocked_me(self):
        data = self.build_data()
        user_logic.add_blocklist(2, 1)
        resp_login = auth.login(dict(email='test2@test.com',password='test',username='test2'))
        response = self.client.post(
            '/api/message/',
            headers={'Authorization':'Bearer ' + 
                resp_login.json['auth_token'], 'CSRF-Token':'2018-10-14 18:54:25.991752.DqUiYQ.dNTEDv7Ay6xxz9JMCmUUvBPYpf0'},
            content_type='application/json',
            data=json.dumps(data)
        )
        self.assertTrue(response.status_code == 403)
        self.assertTrue(response.json['message'] == 'Cannot message user who has you blocked.')


    def build_data(self):
        built = {}
        built["to_user"] = 1
        built["from_user"] = 2
        built["message_subject"] = "test"
        built["message_content"] = "this is just a test message, calm down"
        built["replies"] = []

        self.add_user()

        return built
        
    def add_user(self):
        user = User(
            email='test@test.com',
            password='test'
        )
        user.username='test'
        userTwo = User(
            email='test2@test.com',
            password='test'
        )
        userTwo.username='test2'
        db.session.add(user)
        db.session.add(userTwo)
        db.session.commit()

if __name__ == '__main__':
    unittest.main()