import magic

def file_is_audio(file):
	try:
		file_type = magic.from_file(file)
		is_audio = 'Audio file' in file_type or '(.M4A) Audio' in file_type
		return is_audio
	except FileNotFoundError:
		return False
	

def file_is_image(file):
	try:
		file_type = magic.from_file(file)
		print(file_type)
		return ('image data' in file_type)
	except FileNotFoundError:
		return False
	