from flask import Flask, render_template, send_file, send_from_directory
import json
from flask.ext.tus import tus_manager

app = Flask(__name__)
tm = tus_manager(app, upload_url='/file-upload')

@tm.upload_file_handler
def upload_file_hander( upload_file_path, filename ):
    app.logger.info( "doing something cool with {}, {}".format( upload_file_path, filename))
    return filename

# serve the uploaded files
@app.route('/uploads/<path:filename>', methods=['GET'])
def download(filename):
  uploads = os.path.join(app.root_path, tm.upload_folder)
  return send_from_directory(directory=uploads, filename=filename)

@app.route('/')
def hello_world():
  return render_template('index.html')

@app.route('/audio/<string:audio_file>')
def audio(audio_file):
  return send_from_directory(filename=audio_file, directory='audio')

@app.route('/api/work/<int:workId>')
def get_work(workId):
  work = json.dumps(
    [
	{
  	"key": "1",
    "creator_id": 2,
  "name": "barb",
  "url": "butts",
  "title": "bleh bleh bleh",
  "main": "index.js",
  "is_complete": "true",
  "word_count": "4000",
  "work_summary": "some stuff happens",
  "chapters": [{
    "id": "1",
    "number": "1",
    "title": "bob goes to school",
    "text": "weh weh weh weh",
    "audio_url": "../audio/01 Family Problems.mp3",
    "image_url": "url"
  },
    {"id": "2",
    "number": "2",
    "title": "bob fails at school",
    "text": "bloop",
    "audio_url": "url",
    "image_url": "url"}],
  "tags": [{
    "fandom": ["buffy", "xena"]},
    {"primary pairing": ["buffy/faith"]}]}])
  return work


@app.route('/api/bookmark/curator/<int:curatorId>')
def get_bookmarks(curatorId):
  bookmarks = json.dumps(
    [ {"bookmarks": [
      {
          "key": "1",
          "chapter_image": "butts.png",
          "title": "bleh bleh bleh",
          "creator": "impertinence",
          "summary": "someBODY once told me the world is gonna roll me",
          "rating": "*****",
          "curator": "sally",
          "description": "this tingled my nether bits and also I'm at war with the author now"
        }
    ]}])
  return bookmarks

@app.route('/<path:path>')
def default(path):
  return render_template('index.html')

if __name__ == '__main__':
  app.run(debug=True)

