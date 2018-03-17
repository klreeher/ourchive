from flask import render_template
import re
import json
from .. import db
from .. import redis_db
from ..work import views
from ..models import Tag

def get_suggestions(term, type_id):
	data = {}
	data['results'] = []
	results = redis_db.zrevrange("tag-suggestions:#"+str(type_id)+":#"+term.lower(), 0, 9)
	for item in results:
		data['results'].append(item.decode("utf-8"))
	print(data)
	return data

def add_tag(tag_text, type_id):
	for i in range(2,len(tag_text),1):
		prefix = tag_text[:i]
		redis_db.zadd("tag-suggestions:#"+str(type_id)+":#"+prefix.lower(), 1, tag_text.lower())