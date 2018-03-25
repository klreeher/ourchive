from flask import render_template, make_response, jsonify
import re
import json
from .. import db
from flask import current_app as app
from ..models import User

def register(post_data):
	post_data = json.loads(post_data)
	# check if user already exists
	user = User.query.filter_by(email=post_data.get('email')).first()
	if not user:
		try:
			user = User(
				email=post_data.get('email'),
				password=post_data.get('password')
			)

			# insert the user
			db.session.add(user)
			db.session.commit()
			# generate the auth token
			auth_token = user.encode_auth_token(user.id)
			responseObject = {
				'status': 'success',
				'message': 'Successfully registered.',
				'auth_token': auth_token.decode()
			}
			return jsonify(responseObject)
		except Exception as e:
			responseObject = {
				'status': 'fail',
				'message': 'Some error occurred. Please try again.'
			}
			return jsonify(responseObject)
	else:
		responseObject = {
			'status': 'fail',
			'message': 'User already exists. Please log in.',
		}
		return jsonify(responseObject)