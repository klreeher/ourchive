from ebooklib import epub
import requests
import urllib
from io import BytesIO
import ebooklib
import pathlib
import re
from zipfile import ZipFile
from PIL import Image
from pydub import AudioSegment
import shutil
from celery_app import app

def get_filename(chapter_number, chapter_title, extension):
	if chapter_title is None or chapter_title == "":
		chapter_title = 'Chapter ' + str(chapter_number)
	return 'Chapter '+str(chapter_number)+'/'+chapter_title+extension

def get_temp_directory(work_uid):
	return app.config.get('TMP_ROOT') + '/' + str(work_uid) + '/'

def get_chapter_concat(work_uid, chapter_number, chapter_title, extension):
	return get_temp_directory(work_uid) + get_filename(chapter_number, chapter_title, extension)

def get_temp_zip(work):
	return get_temp_directory(work.uid)+work.title+'.zip'

def get_temp_epub(work):
	return get_temp_directory(work.uid)+work.title+'.epub'

def get_file_url(url):
	if url == '':
		return ''
	if app.config.get('UPLOAD_TYPE') == 'file':
		url_root = app.config.get('UPLOAD_ROOT')
		identifier = url.rsplit('/', 1)[-1]
		return url_root + identifier + app.config.get('UPLOAD_SUFFIX')
	elif app.config.get('UPLOAD_TYPE') == 'aws':
		identifier = url.rsplit('/', 1)[-1]
		match = re.match(r'(.)*\+',identifier)
		sliced = match.group()[:-1]
		return app.config.get('BUCKET_URL')+sliced

def create_work_zip(work, creator_name):
	with ZipFile(get_temp_zip(work), 'w') as test:
		for chapter in work.chapters:
			with open(get_chapter_concat(work.uid, chapter.number, chapter.title, '.html'), 'w') as text:
				text.write('<h2>'+chapter.title+'</h2> <h3>by '+creator_name+'</h3>')
				text.write('<br/><br/>')
				text.write(chapter.summary)
				text.write('<br/><br/><hr><br/></br>')
				text.write(chapter.text)
			test.write(get_chapter_concat(work.uid, chapter.number, chapter.title, '.html'), get_filename(chapter.number, chapter.title, '.html'))
			if chapter.image_url is not None:
				test.write(get_chapter_concat(work.uid, chapter.number, chapter.title, '.'+chapter.image_format),  get_filename(chapter.number, chapter.title, '.'+chapter.image_format))
			if chapter.audio_url is not None:
				test.write(get_chapter_concat(work.uid, chapter.number, chapter.title,".mp3"), get_filename(chapter.number, chapter.title, '.mp3'))


def create_epub(work):

	book = epub.EpubBook()

	# set metadata
	book.set_identifier(str(work.id))
	book.set_title(work.title)
	book.set_language('en')
	book.add_metadata('DC', 'description', work.work_summary)

	book.add_author(work.user.username)

	book.add_item(epub.EpubNcx())
	book.add_item(epub.EpubNav())


	title_page = epub.EpubHtml(title=work.title, file_name='title_page.xhtml', lang='en')
	content_string = '<center><h1>'+work.work_summary+'</h1><br/><h2>'+work.user.username+'</h2>'+'<br/>Word Count: '+str(work.word_count)+'</center>'
	title_page.content=content_string.encode('utf8')
	book.add_item(title_page)
	book.toc.append(epub.Link('title_page.xhtml', 'Title Page', ''))

	for chapter in work.chapters:
		new_chapter = epub.EpubHtml(title=chapter.title, file_name=chapter.title+'.xhtml', lang='en')
		if (chapter.image_url is not None and chapter.image_url != ""):
			image = open(get_chapter_concat(work.uid, chapter.number, chapter.title, '.'+chapter.image_format), 'rb').read()
			image_string = "chapter_"+str(chapter.number)+"."+ chapter.image_format
			image_item = epub.EpubItem(uid="img_1",
	                        file_name=image_string,
	                        media_type="image/"+chapter.image_format,
	                        content=image)
			book.add_item(image_item)
			if image is not None:
				new_chapter.add_item(image_item)
				if chapter.number ==1:
					book.set_cover(image_string, image)
			new_chapter.content="<img src='"+image_string+"'/>"
			new_chapter.content += "<br/><br/><br/>"
		new_chapter.content += chapter.text
		book.add_item(new_chapter)
		book.toc.append(epub.Link(chapter.title+'.xhtml', chapter.title, chapter.summary))

	

	# define CSS style
	style = 'BODY {color: white;}'
	nav_css = epub.EpubItem(uid="style_nav", file_name="style/nav.css", media_type="text/css", content=style)

	# add CSS file
	book.add_item(nav_css)

	# basic spine
	#book.spine = ['nav', c1]

	# write to the file
	epub.write_epub(get_temp_epub(work), book, {})