from ebooklib import epub

def create_image_zip(work):
	return

def create_audio_zip(work):
	return

def create_epub(work):

	book = epub.EpubBook()

	# set metadata
	book.set_identifier(str(work.id))
	book.set_title(work.title)
	book.set_language('en')

	book.add_author(work.user.username)

	for chapter in work.chapters:
		new_chapter = epub.EpubHtml(title=chapter.title, file_name=chapter.title+'.xhtml', lang='hr')
		new_chapter.content=chapter.text.encode('utf8')
		book.add_item(new_chapter)
		book.toc.append(epub.Link(chapter.title+'.xhtml', chapter.title, chapter.summary))

	book.add_item(epub.EpubNcx())
	book.add_item(epub.EpubNav())

	# define CSS style
	style = 'BODY {color: white;}'
	nav_css = epub.EpubItem(uid="style_nav", file_name="style/nav.css", media_type="text/css", content=style)

	# add CSS file
	book.add_item(nav_css)

	# basic spine
	#book.spine = ['nav', c1]

	# write to the file
	epub.write_epub('test.epub', book, {})