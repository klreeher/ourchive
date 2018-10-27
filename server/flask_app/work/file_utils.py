import magic

def file_is_audio(file):
	try:
		file_type = magic.from_file(file)
		return('Audio file' in file_type)
	except FileNotFoundError:
		return False
	

def file_is_image(file):
	try:
		file_type = magic.from_file(file)
		return ('image data' in file_type)
	except FileNotFoundError:
		return False
	