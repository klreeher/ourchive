from flask import render_template

from . import work

@work.route('/')
def homepage():
  return render_template('index.html')

def add_work(json):
    # add login checks

    print(json)