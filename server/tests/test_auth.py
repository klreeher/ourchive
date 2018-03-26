import unittest

from server.flask_app import db
from server.flask_app.models import User, BlacklistToken
from server.flask_app.auth import logic as auth
from server.tests.base import BaseTestCase
import json
import time


class TestAuthBlueprint(BaseTestCase):
	def test_registration(self):
		response = auth.register(json.dumps(dict(email='joe@gmail.com', password='123456')))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully registered.')
		self.assertTrue(data['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 200)

	def test_registered_with_already_registered_user(self):
		user = User(
			email='joe@gmail.com',
			password='test'
		)
		db.session.add(user)
		db.session.commit()
		response = auth.register(json.dumps(dict(email='joe@gmail.com', password='123456')))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'User already exists. Please log in.')
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 200)

	def test_registered_user_login(self):
		response = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_register = response.json
		self.assertTrue(data_register['status'] == 'success')
		self.assertTrue(data_register['message'] == 'Successfully registered.')
		self.assertTrue(data_register['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 200)
		response = auth.login(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully logged in.')
		self.assertTrue(data['auth_token'])
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(response.status_code, 200)

	def test_non_registered_user_login(self):
		response = auth.login(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'User does not exist.')
		self.assertTrue(response.content_type == 'application/json')
		self.assertEqual(data['status_int'], 404)


	def test_user_status(self):
		response = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		response = auth.authorize(json.dumps(dict(
		Authorization='Bearer ' + response.json['auth_token'])))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['data'] is not None)
		self.assertTrue(data['data']['email'] == 'joe@gmail.com')
		self.assertTrue(data['data']['admin'] is 'true' or 'false')
		self.assertEqual(response.status_code, 200)

	def test_valid_logout(self):
		resp_register = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_register = resp_register.json
		self.assertTrue(data_register['status'] == 'success')
		self.assertTrue(data_register['message'] == 'Successfully registered.')
		self.assertTrue(data_register['auth_token'])
		self.assertTrue(resp_register.content_type == 'application/json')
		self.assertEqual(resp_register.status_code, 200)
		resp_login = auth.login(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_login = resp_login.json
		self.assertTrue(data_login['status'] == 'success')
		self.assertTrue(data_login['message'] == 'Successfully logged in.')
		self.assertTrue(data_login['auth_token'])
		self.assertTrue(resp_login.content_type == 'application/json')
		self.assertEqual(resp_login.status_code, 200)

		response = auth.logout(dict(Authorization='Bearer ' + 
			data_login['auth_token']))
		data = response.json
		self.assertTrue(data['status'] == 'success')
		self.assertTrue(data['message'] == 'Successfully logged out.')
		self.assertEqual(response.status_code, 200)

	def test_invalid_logout(self):
		resp_register = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_register = resp_register.json
		self.assertTrue(data_register['status'] == 'success')
		self.assertTrue(data_register['message'] == 'Successfully registered.')
		self.assertTrue(data_register['auth_token'])
		self.assertTrue(resp_register.content_type == 'application/json')
		self.assertEqual(resp_register.status_code, 200)
		resp_login = auth.login(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_login = resp_login.json
		self.assertTrue(data_login['status'] == 'success')
		self.assertTrue(data_login['message'] == 'Successfully logged in.')
		self.assertTrue(data_login['auth_token'])
		self.assertTrue(resp_login.content_type == 'application/json')
		self.assertEqual(resp_login.status_code, 200)
	
		time.sleep(6)
		response = auth.logout(dict(Authorization='Bearer ' + 
				resp_login.json['auth_token']))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(
		data['message'] == 'Signature expired. Please log in again.')
		self.assertEqual(data['status_int'], 401)

	def test_valid_blacklisted_token_logout(self):
		resp_register = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_register = resp_register.json
		self.assertTrue(data_register['status'] == 'success')
		self.assertTrue(data_register['message'] == 'Successfully registered.')
		self.assertTrue(data_register['auth_token'])
		self.assertTrue(resp_register.content_type == 'application/json')
		self.assertEqual(resp_register.status_code, 200)
		resp_login = auth.login(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_login = resp_login.json
		self.assertTrue(data_login['status'] == 'success')
		self.assertTrue(data_login['message'] == 'Successfully logged in.')
		self.assertTrue(data_login['auth_token'])
		self.assertTrue(resp_login.content_type == 'application/json')
		self.assertEqual(resp_login.status_code, 200)

		blacklist_token = BlacklistToken(token=data_login['auth_token'])
		db.session.add(blacklist_token)
		db.session.commit()
		# blacklisted valid token logout
		response = auth.logout(dict(Authorization='Bearer ' + data_login['auth_token']))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'Token blacklisted. Please log in again.')
		self.assertEqual(data['status_int'], 401)


	def test_valid_blacklisted_token_user(self):
		resp_register = auth.register(json.dumps(dict(email='joe@gmail.com',password='123456')))
		data_register = resp_register.json
		self.assertTrue(data_register['status'] == 'success')
		self.assertTrue(data_register['message'] == 'Successfully registered.')
		self.assertTrue(data_register['auth_token'])
		self.assertTrue(resp_register.content_type == 'application/json')
		self.assertEqual(resp_register.status_code, 200)
		# blacklist a valid token
		blacklist_token = BlacklistToken(token=data_register['auth_token'])
		db.session.add(blacklist_token)
		db.session.commit()
		response = auth.authorize(json.dumps(dict(Authorization='Bearer ' + data_register['auth_token'])))
		data = response.json
		self.assertTrue(data['status'] == 'fail')
		self.assertTrue(data['message'] == 'Token blacklisted. Please log in again.')
		self.assertEqual(data['status_int'], 401)

if __name__ == '__main__':
    unittest.main()