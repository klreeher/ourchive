import re
import json
from .. import redis_db
from ..models import User
from itsdangerous import TimestampSigner
from server.flask_app import app, bcrypt

def add_blocklist(blocked_user, blocking_user):
	results = redis_db.sadd("blocklist:#"+str(blocking_user), str(blocked_user))
	return results

def in_blocklist(blocked_user, blocking_user):
	blocklist = redis_db.smembers("blocklist:#"+str(blocking_user))
	return str(blocked_user).encode("utf8") in blocklist

def add_reset(reset_user):
	s = TimestampSigner('secret-key')
	token = s.sign(str(reset_user)+'password-reset')
	redis_db.set("password-reset:#"+str(reset_user), token)
	return token

def validate_reset_token(reset_user, token):
	s = TimestampSigner('secret-key')
	try:
		token = s.unsign(token, max_age=43200)
		return True
	except Exception as e:
		return False

def encrypt_password(password):
	new_password = bcrypt.generate_password_hash(
            password, app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()
	return new_password
	