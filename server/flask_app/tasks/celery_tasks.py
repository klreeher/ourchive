from celery_app import celery, app
from pydub import AudioSegment
from models import Work, User
import mutagen
from work import work_export
from PIL import Image
import requests
from io import BytesIO
import shutil
import pathlib
from work import file_utils

@celery.task
def process_work(work_id):
    with app.app_context():
        from database import db
        work = Work.query.filter_by(id=work_id).first()
        pathlib.Path(work_export.get_temp_directory(work.uid)).mkdir(parents=True, exist_ok=True)
        for chapter in work.chapters:
            pathlib.Path(work_export.get_temp_directory(work.uid)+'/'+ 'Chapter ' + str(chapter.number)).mkdir(parents=True, exist_ok=True)
            valid = process_audio(chapter, work)
            if valid == -1:
                print('audio is not valid')
            else:
                db.session.add(valid)
            valid = process_image(chapter, work)
            if valid == -1:
                print('video is not valid')
            else:
                db.session.add(valid)
        success = do_export(work)
        success = True
        if success:
            # create notification that work is processed/failed
            # if success, toggle work flag to 'view'
            
            work.process_status = 1
            db.session.commit()
            return True
        return False
        

def process_audio(chapter, work):
    audio_url = chapter.audio_url
    trimmed_url = audio_url.rsplit('/', 1)[-1]
    if 'http' in audio_url:
        audio = requests.get(audio_url).content
    else:
        audio = open(audio_url, 'rb').read()
    audio_segment = AudioSegment.from_file(BytesIO(audio), format="mp3")
    audio_segment.export(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"))
    if not (file_utils.file_is_audio(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"))):
        return -1
    else:
        audio = mutagen.File(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"))
        chapter.audio_length = audio.info.length
        return chapter

def process_image(chapter, work):
    image_url = chapter.image_url
    trimmed_url = image_url.rsplit('/', 1)[-1]
    if 'http' in image_url:
       image = requests.get(image_url).content
    else:
       image = open(image_url, 'rb').read()
    pil_image = Image.open(BytesIO(image))
    pil_image.save(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, "."+pil_image.format))
    if not (file_utils.file_is_image(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, "."+pil_image.format))):
       return -1
    else:
        chapter.image_format = pil_image.format
        chapter.image_size = pil_image.size
        return chapter

def do_export(work):
    user = User.query.filter_by(id=work.user_id).first()
    work_export.create_work_zip(work, user.username)
    #work_export.create_epub(work)
    return True
