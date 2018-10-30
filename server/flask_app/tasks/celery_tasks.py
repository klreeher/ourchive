from celery_app import celery, app
from pydub import AudioSegment
from models import Work

@celery.task
def sample_task(msg):
    with app.app_context():
        print(msg)

@celery.task
def process_work(work_id):
    with app.app_context():
        work = Work.query.filter_by(id=2).first()
        # for each chapter -> get & validate audio & image, copy export files & epub
        # create notification that work is processed/failed
        # if success, toggle work flag to 'view'

def process_audio(audio_url, chapter):
    trimmed_url = audio_url.rsplit('/', 1)[-1]
    if 'http' in audio_url:
        audio = requests.get(audio_url).content
    else:
        audio = open(audio_url, 'rb').read()
    audio_segment = AudioSegment.from_file(BytesIO(audio), format="mp3")
    audio_segment.export(trimmed_url, format="mp3")
    if not (file_utils.file_is_audio(trimmed_url)):
        return -1
    else:
        audio = mutagen.File(trimmed_url)
        chapter.audio_length = audio.info.length
