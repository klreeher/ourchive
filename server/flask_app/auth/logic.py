from flask import render_template, make_response, jsonify
import bcrypt
import re
import json
from .. import db
from flask import current_app as app
from ..models import User, BlacklistToken
from server.flask_app.user import logic as user_logic
from itsdangerous import TimestampSigner
import datetime

def generate_csrf():
	s = TimestampSigner(app.config.get('SECRET_KEY'))
	token = s.sign(str(datetime.datetime.now()))
	return token


def register(post_data):
	user = User.query.filter_by(email=post_data.get('email')).first()
	if not user:
		user = User.query.filter_by(username=post_data.get('username').lower()).first()
	if not user:
		try:
			user = user_logic.create_user(post_data.get('username'), post_data.get('password'), post_data.get('email'), False)
			auth_token = user.encode_auth_token(user.id)
			responseObject = {
				'status': 'success',
				'message': 'Successfully registered.',
				'auth_token': auth_token.decode(),
				'username': user.username
			}
			return make_response(jsonify(responseObject), 201)
		except Exception as e:
			responseObject = {
				'status': 'fail',
				'message': str(e),
				'status_int': 500
			}
			return make_response(jsonify(responseObject), 500)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'User already exists. Please log in.',
		}
		return make_response(jsonify(responseObject), 401)

def login(post_data):
	#try:
	user = User.query.filter_by(
	username=post_data.get('username').lower()
	).first()
	if user is not None and user.banned == True:
		responseObject = {
			'status': 'fail',
			'message': 'User is banned.'
		}
		return make_response(jsonify(responseObject), 403)
	elif user is not None:
		if bcrypt.checkpw(post_data.get('password').encode('utf8'), user.password.encode('utf8')):
			auth_token = user.encode_auth_token(user.id)
			if auth_token:
				responseObject = {
					'status': 'success',
					'message': 'Successfully logged in.',
					'auth_token': auth_token.decode(),
					'admin': user.admin,
					'username': user.username,
					'email': user.email
				}
			return make_response(jsonify(responseObject), 201)
		else:
			responseObject = {
			'status': 'fail',
			'message': 'Unauthorized user.',
			'status_int': 404
		}
		return make_response(jsonify(responseObject), 404)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'User does not exist.',
			'status_int': 404
		}
		return make_response(jsonify(responseObject), 404)
	#except Exception as e:
	#	responseObject = {
	#		'status': 'fail',
	#		'message': 'Try again',
	#		'status_int': 500
	#	}
	#	return make_response(jsonify(responseObject), 500)


def authorize(request):
	auth_header = request.headers.get('Authorization')
	if auth_header:
		try:
			auth_token = auth_header.split(" ")[1]
		except IndexError:
			responseObject = {
				'status': 'fail',
				'message': 'Bearer token malformed.',
				'status_int': 401
			}
			return make_response(jsonify(responseObject), 401)
	else:
		auth_token = ''
	if auth_token:
		resp = User.decode_auth_token(auth_token)
		if not isinstance(resp, str):
			s = TimestampSigner(app.config.get('SECRET_KEY'))
			try:
				csrf_token = s.unsign(request.headers.get('CSRF-Token'))
			except Exception as e:
				responseObject = {
					'status': 'fail',
					'message': 'Invalid data.',
					'status_int': 401
				}
				return make_response(jsonify(responseObject), 401)
			user = User.query.filter_by(id=resp).first()
			responseObject = {
				'status': 'success',
				'data': {
				'user_id': user.id,
				'email': user.email,
				'admin': user.admin,
				'registered_on': user.registered_on
				}
			}
			return make_response(jsonify(responseObject), 201)
		responseObject = {
			'status': 'fail',
			'message': resp,
			'status_int': 401
		}
		return make_response(jsonify(responseObject), 401)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'Provide a valid auth token.',
			'status_int': 401
		}
		return make_response(jsonify(responseObject), 401)

def reset_password(request, username, token):
	user = User.query.filter_by(username=username).first()
	token_valid = user_logic.validate_reset_token(user.id, token)
	if token_valid is not True:
		responseObject = {
			'status': 'failure',
			'message': 'Token invalid. Please try again.'
		}
		return make_response(jsonify(responseObject), 401)
	password = user_logic.encrypt_password(request.get('password'))
	user.password = password
	db.session.add(user)
	db.session.commit()
	responseObject = {
		'status': 'success',
		'message': 'Password Updated.'
	}
	return make_response(jsonify(responseObject), 201)

def logout(request):
	auth_header = request.headers.get('Authorization')
	if auth_header:
		auth_token = auth_header.split(" ")[1]
	else:
		auth_token = ''
	if auth_token != '':
		resp = User.decode_auth_token(auth_token)
		if not isinstance(resp, str):
			blacklist_token = BlacklistToken(token=auth_token)
			try:
				db.session.add(blacklist_token)
				db.session.commit()
				responseObject = {
					'status': 'success',
					'message': 'Successfully logged out.'
				}
				return make_response(jsonify(responseObject), 201)
			except Exception as e:
				responseObject = {
					'status': 'fail',
					'message': e,
					'status_int': 401
				}
				return make_response(jsonify(responseObject), 401)
		else:
			responseObject = {
				'status': 'fail',
				'message': resp,
				'status_int': 401
			}
			return make_response(jsonify(responseObject), 401)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'Provide a valid auth token.',
			'status_int': 401
		}
		return make_response(jsonify(responseObject), 401)

def auth_from_data(request):
  status = authorize(request)
  if status.status_code == 201:
    return json.loads(status.data.decode())['data']['user_id']
  else:
    return -1

def auth_as_admin(request):
  status = authorize(request)
  if status.status_code == 201 and json.loads(status.data.decode())['data']['admin']:
    return json.loads(status.data.decode())['data']['user_id']
  else:
    return -1
