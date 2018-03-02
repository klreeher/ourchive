from flask import Blueprint

work = Blueprint('work', __name__)

from . import views

