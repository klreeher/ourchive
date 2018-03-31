import re
import json
from .. import redis_db
from ..models import User

def add_blocklist(blocked_user, blocking_user):
	results = redis_db.sadd("blocklist:#"+str(blocking_user), str(blocked_user))
	return results

def in_blocklist(blocked_user, blocking_user):
	blocklist = redis_db.smembers("blocklist:#"+str(blocking_user))
	return str(blocked_user).encode("utf8") in blocklist