from celery_app import celery, app
from pydub import AudioSegment
from models import Work, User
import mutagen
from work import work_export, file_utils
from PIL import Image
import requests
from io import BytesIO
import shutil
import pathlib
import os

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
        work = do_export(work)
        if work is not None:
            work.process_status = 1
            db.session.commit()
            return True
        else:
            work.process_status = 2
            return False


def process_audio(chapter, work):
    audio_url = chapter.audio_url
    if audio_url is None:
        return chapter
    trimmed_url = audio_url.rsplit('/', 1)[-1]
    if 'http' in audio_url:
        audio = requests.get(audio_url).content
    else:
        audio = open(audio_url, 'rb').read()
    with open(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"), 'wb') as output:
        output.write(audio)
    if not (file_utils.file_is_audio(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"))):
        return -1
    else:
        audio = mutagen.File(work_export.get_temp_directory(work.uid) + work_export.get_filename(chapter.number, chapter.title, ".mp3"))
        chapter.audio_length = audio.info.length
        return chapter

def process_image(chapter, work):
    image_url = chapter.image_url
    if image_url is None:
        return chapter
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
    work_export.create_epub(work)
    epub_filename = send_epub(work)
    zip_filename = send_zip(work)
    work.epub_id = epub_filename
    work.zip_id = zip_filename
    shutil.rmtree(work_export.get_temp_directory(work.uid))
    return work

def send_zip(work):
    import tus
    with open(work_export.get_temp_zip(work), 'rb') as g:
        file_endpoint = tus.create(
            app.config.get('TUS_DOCKER'),
            work_export.get_temp_zip(work),
            os.path.getsize(work_export.get_temp_zip(work)))

        tus.resume(
            g,
            file_endpoint,
            chunk_size=5 * 1024 * 1024)
        url = work_export.get_file_url(file_endpoint)
        return url

def send_epub(work):
    import tus
    with open(work_export.get_temp_epub(work), 'rb') as f:
        file_endpoint = tus.create(
            app.config.get('TUS_DOCKER'),
            work_export.get_temp_epub(work),
            os.path.getsize(work_export.get_temp_epub(work)))

        tus.resume(
            f,
            file_endpoint,
            chunk_size=5 * 1024 * 1024)
        url = work_export.get_file_url(file_endpoint)
        return url
