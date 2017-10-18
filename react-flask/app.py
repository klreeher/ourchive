from flask import Flask, render_template
import json
app = Flask(__name__)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/api/work/<int:workId>')
def get_work(workId):
  work = json.dumps(
    [
	{
  	"key": "1",
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "true",
  "word_count": "4000",
  "work_summary": "some stuff happens",
  "chapters": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "python app.py"
  },
  "tags": [
    {
      	"id": "1",
  		"text": "buffy summers"
    },
    {
    	"id": "2",
      	"text": "faith lehane"
    }
  ]}])
  return work

@app.route('/<path:path>')
def default(path):
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

