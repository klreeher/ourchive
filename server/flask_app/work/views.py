from flask import render_template

from . import work

@work.route('/')
def homepage():
  return render_template('index.html')

@work.route('/<path:path>')
def unknown_path(path):
  return render_template('index.html')