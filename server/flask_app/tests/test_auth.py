from auth import logic as auth
from user import logic as user_logic
import json
import time
from tests import BaseTestCase as TestCase
from models import User, BlacklistToken
from database import db


class TestAuth(TestCase):
	
	def do_register(self, email, password, username='elena'):
		return auth.register(dict(email=email, password=password, username=username))

	def test_registration(self):
		response = self.do_register('elena@gmail.com', '123456789')
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully registered.')
		self.assertTrue(data['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 201)

	def test_registered_with_already_registered_user(self):
		user = User(
			email='elena@gmail.com',
			password='123456789'
		)
		db.session.add(user)
		db.session.commit()
		response = self.do_register('elena@gmail.com', '123456789')
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'User already exists. Please log in.')
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 409)

	def test_registered_user_login(self):
		response = self.do_register('elena@gmail.com', '123456789')
		data_register = response.json
		response = auth.login(dict(email='elena@gmail.com',password='123456789',username='elena'))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully logged in.')
		self.assertTrue(data['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 201)

	def test_banned_user_login(self):
		response = self.do_register('elena@gmail.com', '123456789')
		data_register = response.json
		user = User.query.filter_by(email='elena@gmail.com').first()
		user_logic.ban_user(user.id)
		response = auth.login(dict(email='elena@gmail.com',password='123456789',username='elena'))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'User is banned.')
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 403)

	def test_non_registered_user_login(self):
		response = auth.login(dict(email='joe@gmail.com',password='123456',username='elena'))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'User does not exist.')
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 404)

	def test_user_status(self):
		response = self.do_register('elena@gmail.com', '123456789')
		response = self.client.post(
            '/api/user/authorize/',
            headers={'Authorization':'Bearer ' + 
				response.json['auth_token'], 'CSRF-Token':'2018-10-14 18:54:25.991752.DqUiYQ.dNTEDv7Ay6xxz9JMCmUUvBPYpf0'},
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['data'] is not None)
		self.assertTrue(data['data']['email'] == 'elena@gmail.com')
		self.assertTrue(data['data']['admin'] is 'true' or 'false')
		self.assertEqual(response.status_code, 201)

	def test_user_admin(self):
		response = self.do_register('elena@gmail.com', '123456789')
		user = User.query.first()
		user.admin = True 
		db.session.commit()
		response = self.client.post(
            '/api/admin/works/types',
            headers={'Authorization':'Bearer ' + 
				response.json['auth_token'], 'CSRF-Token':'2018-10-14 18:54:25.991752.DqUiYQ.dNTEDv7Ay6xxz9JMCmUUvBPYpf0'},
            content_type='application/json',
            data=json.dumps(dict(
                types={'id': 1, 'type_name': 'one'}
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertEqual(response.status_code, 201)

	def test_valid_logout(self):
		resp_register = self.do_register('elena@gmail.com', '123456789')
		data_register = resp_register.json
		resp_login = auth.login(dict(email='elena@gmail.com',password='123456789',username='elena'))
		data_login = resp_login.json
		response = self.client.post(
            '/api/user/logout/',
            headers=dict(Authorization='Bearer ' + 
				data_login['auth_token']),
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully logged out.')
		self.assertEqual(response.status_code, 201)

	def test_invalid_logout(self):
		resp_register = auth.register(dict(email='joe@gmail.com',password='123456',username='elena'))
		data_register = resp_register.json
		resp_login = auth.login(dict(email='joe@gmail.com',password='123456',username='elena'))
		data_login = resp_login.json
		response = self.client.post(
            '/api/user/logout/',
            headers=dict(Authorization='Bearer ' + 
				'sdflksjdflds'),
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = json.loads(response.data.decode())
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(
		data['message'] == 'Invalid token. Please log in again.')
		self.assertEqual(response.status_code, 401)

	def test_valid_blacklisted_token_logout(self):
		resp_register = auth.register(dict(email='joe@gmail.com',password='123456',username='joe'))
		data_register = resp_register.json
		resp_login = auth.login(dict(email='joe@gmail.com',password='123456',username='joe'))
		data_login = resp_login.json

		blacklist_token = BlacklistToken(token=data_login['auth_token'])
		db.session.add(blacklist_token)
		db.session.commit()
		# blacklisted valid token logout
		response = self.client.post(
            '/api/user/logout/',
            headers=dict(Authorization='Bearer ' + 
				data_login['auth_token']),
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'Token blacklisted. Please log in again.')
		self.assertEqual(response.status_code, 401)


	def test_valid_blacklisted_token_user(self):
		resp_register = auth.register(dict(email='joe@gmail.com',password='123456', username='joe'))
		data_register = resp_register.json
		# blacklist a valid token
		blacklist_token = BlacklistToken(token=data_register['auth_token'])
		db.session.add(blacklist_token)
		db.session.commit()
		response = self.client.post(
            '/api/user/logout/',
            headers={'Authorization':'Bearer ' + 
				data_register['auth_token'], 'CSRF-Token':'2018-10-14 18:54:25.991752.DqUiYQ.dNTEDv7Ay6xxz9JMCmUUvBPYpf0'},
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'Token blacklisted. Please log in again.')
		self.assertEqual(response.status_code, 401)

	def test_user_status_malformed_bearer_token(self):
		response = self.do_register('elena@gmail.com', '123456789')
		response = self.client.post(
            '/api/user/authorize/',
            headers=dict(Authorization='Bearer' + 
				response.json['auth_token']),
            content_type='application/json',
            data=json.dumps(dict(
                empty='empty'
            ))
        )
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'Bearer token malformed.')
		self.assertEqual(response.status_code, 401)

	def test_password_reset(self):
		response = self.do_register('elena@gmail.com', '123456789')
		user = User.query.first()
		token = user_logic.add_reset(user)
		response = self.client.post(
            '/api/user/elena/reset/'+token.decode("utf-8"),
            content_type='application/json',
            data=json.dumps(dict(
                email='elena@gmail.com',password='1234567810'
            ))
        )
		self.assertEqual(response.status_code, 201)

	def test_invalid_password_reset(self):
		response = self.do_register('elena@gmail.com', '123456789')
		user = User.query.first()
		token = user_logic.add_reset(user)
		response = self.client.post(
            '/api/user/elena/reset/'+"badvalbadval",
            content_type='application/json',
            data=json.dumps(dict(
                email='elena@gmail.com',password='1234567810'
            ))
        )
		self.assertEqual(response.status_code, 401)

