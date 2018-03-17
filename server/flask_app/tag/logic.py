from flask import render_template
import re
import json
from .. import db
from .. import redis_db
from ..work import views
from ..models import Tag

def get_suggestions(term, type_id):
    redis_db.zrevrange("tag-suggestions:#"+str(type_id)+":#"+term.lower())