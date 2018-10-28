from ebooklib import epub
import requests
import urllib
from io import BytesIO
import ebooklib
import pathlib
from zipfile import ZipFile
from PIL import Image
from pydub import AudioSegment
import shutil

def create_work_zip(work, creator_name):
	with ZipFile('test.zip', 'w') as test:
		for chapter in work.chapters:
			pathlib.Path('Chapter ' + str(chapter.number)).mkdir(parents=True, exist_ok=True)
			with open('Chapter '+str(chapter.number)+'/'+chapter.title+'.html', 'w') as text:
				text.write('<h2>'+chapter.title+'</h2> <h3>by '+creator_name+'</h3>')
				text.write('<br/><br/>')
				text.write(chapter.summary)
				text.write('<br/><br/><hr><br/></br>')
				text.write(chapter.text)
			test.write('Chapter '+str(chapter.number)+'/'+chapter.title+'.html')
			if chapter.image_url is not None:
				if 'http' in chapter.image_url:
					image = requests.get(chapter.image_url).content
				else:
					image = open(chapter.image_url, 'rb').read()
				pil_image = Image.open(BytesIO(image))
				pil_image.save('Chapter '+str(chapter.number)+'/'+chapter.title+'.jpg')
				test.write('Chapter '+str(chapter.number)+'/'+chapter.title+'.jpg')
			if chapter.audio_url is not None:
				if 'http' in chapter.audio_url:
					audio = requests.get(chapter.audio_url).content
				else:
					audio = open(chapter.audio_url, 'rb').read()
				audio_segment = AudioSegment.from_file(BytesIO(audio), format="mp3")
				audio_segment.export('Chapter '+str(chapter.number)+'/'+chapter.title+'.mp3', format="mp3")
				test.write('Chapter '+str(chapter.number)+'/'+chapter.title+'.mp3')
			shutil.rmtree('Chapter ' + str(chapter.number))


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
			if 'http' in chapter.image_url:
				image = requests.get(chapter.image_url).content
			else:
				image = open(chapter.image_url, 'rb').read()
			image_string = "chapter_"+str(chapter.number)+".jpg"
			image_item = epub.EpubItem(uid="img_1",
	                        file_name=image_string,
	                        media_type="image/jpeg",
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
	epub.write_epub(work.title+'.epub', book, {})