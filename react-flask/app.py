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
  "chapters": [{
    "id": "1",
    "title": "bob goes to school",
    "text": "weh weh weh weh",
    "audio_url": "url",
    "image_url": "url"
  },
    {"id": "2",
    "title": "bob fails at school",
    "text": "bob sux",
    "audio_url": "url",
    "image_url": "url"}],
  "tags": [{
    "fandom": ["buffy", "xena"]},
    {"primary pairing": ["buffy/faith"]}]}])
  return work

@app.route('/<path:path>')
def default(path):
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

