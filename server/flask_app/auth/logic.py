from flask import render_template, make_response, jsonify
import bcrypt
import re
import json
from .. import db
from flask import current_app as app
from ..models import User, BlacklistToken

def register(post_data):
	user = User.query.filter_by(email=post_data.get('email')).first()
	if not user:
		try:
			password_data = post_data.get('password')
			user = User(
				email=post_data.get('email'),
				password=password_data
			)

			db.session.add(user)
			db.session.commit()
			auth_token = user.encode_auth_token(user.id)
			responseObject = {
				'status': 'success',
				'message': 'Successfully registered.',
				'auth_token': auth_token.decode()
			}
			return jsonify(responseObject)
		except Exception as e:
			print(e)
			responseObject = {
				'status': 'fail',
				'message': 'Some error occurred. Please try again.',
				'status_int': 500
			}
			return jsonify(responseObject)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'User already exists. Please log in.',
		}
		return jsonify(responseObject)

def login(post_data):
	try:
		user = User.query.filter_by(
		email=post_data.get('email')
		).first()
		if user is not None and bcrypt.checkpw(post_data.get('password').encode('utf8'), user.password.encode('utf8')):
			auth_token = user.encode_auth_token(user.id)
			if auth_token:
				responseObject = {
					'status': 'success',
					'message': 'Successfully logged in.',
					'auth_token': auth_token.decode()
				}
			return jsonify(responseObject)
		else:
			responseObject = {
				'status': 'fail',
				'message': 'User does not exist.',
				'status_int': 404
			}
			return jsonify(responseObject)
	except Exception as e:
		print(e)
		responseObject = {
			'status': 'fail',
			'message': 'Try again',
			'status_int': 500
		}
		return jsonify(responseObject)


def authorize(request):
	auth_header = request.get('Authorization')
	if auth_header:
		try:
			auth_token = auth_header.split(" ")[1]
		except IndexError:
			responseObject = {
				'status': 'fail',
				'message': 'Bearer token malformed.',
				'status_int': 401
			}
			return jsonify(responseObject)
	else:
		auth_token = ''
	if auth_token:
		resp = User.decode_auth_token(auth_token)
		if not isinstance(resp, str):
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
			return jsonify(responseObject)
		responseObject = {
			'status': 'fail',
			'message': resp,
			'status_int': 401
		}
		return jsonify(responseObject)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'Provide a valid auth token.',
			'status_int': 401
		}
		return jsonify(responseObject)

def logout(request):
	auth_header = request.get('Authorization')
	if auth_header:
		auth_token = auth_header.split(" ")[1]
	else:
		auth_token = ''
	if auth_token:
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
				return jsonify(responseObject)
			except Exception as e:
				responseObject = {
					'status': 'fail',
					'message': e,
					'status_int': 401
				}
			return jsonify(responseObject)
		else:
			responseObject = {
				'status': 'fail',
				'message': resp,
				'status_int': 401
			}
			return jsonify(responseObject)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'Provide a valid auth token.',
			'status_int': 401
		}
	return jsonify(responseObject)