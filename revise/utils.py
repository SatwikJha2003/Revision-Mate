import cv2
import pytesseract
from PIL import Image
import os
from pathlib import Path
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

# Password strength checker
def check_password_strength(password):
	has_alpha = False
	has_num = False
	has_special = False
	# From OWASP https://owasp.org/www-community/password-special-characters
	special_chars = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
	# Length of password
	if len(password) < 8:
		return (False,"Length of password is too short!")
	# Complexity of password
	for c in password:
		if c.isalpha():
			has_alpha = True
		elif c.isnumeric():
			has_num = True
		elif c in special_chars:
			has_special = True
	if has_alpha and has_num and has_special:
		return (True,"Success")
	else:
		return (False,"Password should have at least 1 alphabet, 1 digit and 1 special character!")

# Check if file is image file
def check_if_image(file):
	try:
		with Image.open(file) as image:
			image.verify()
			return True
	except:
		return False

# Function to save image files
def save_file(user, file):

	if not file:
		return None

	is_image = check_if_image(file)
	if not is_image:
		return None

	filepath = "static/" + str(user)

	# Make directory if it does not exist
	Path(filepath).mkdir(parents=True, exist_ok=True)

	# Save image
	filepath += "/" + file.name
	with open(filepath, "wb") as new_file:
		for chunk in file.chunks():
			new_file.write(chunk)
	return filepath

# OCR function
def get_text_from_image():
	pytesseract.pytesseract.tesseract_cmd = r'C:\Users\chngw\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'
	# Get image path
	image_path = Path(".")
	image_path = image_path.parent.absolute()
	image_path = os.path.join(image_path, "extract.jpg")
	try:
		# Standard code for Pytesseract
		# Reference: https://pyimagesearch.com/2017/07/10/using-tesseract-ocr-python/
		image = cv2.imread(image_path)
		grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
		# Apply thresholding
		cv2.threshold(grayscale, 0,255,cv2.THRESH_BINARY| cv2.THRESH_OTSU)[1]
		# Remove noise
		cv2.medianBlur(grayscale, 3)
		temp = "temp.jpg"
		cv2.imwrite(temp, grayscale)
		extracted_text = pytesseract.image_to_string(Image.open(temp))
		os.remove(temp)
		os.remove(image_path)
		return extracted_text
	except:
		print("error")

# Summarize text content
# Algorithm based on word frequency
def summarize(text):
	# Obtain stop words such as is, the
	stop_words = set(stopwords.words("english"))
	impt_words = []
	response = ""

	for word in word_tokenize(text):
		if word.lower() not in stop_words:
			impt_words.append(word)

	# For each word, allocate a score for frequency
	word_frequencies = nltk.FreqDist(impt_words)

	sentences = sent_tokenize(text)
	sentence_values = dict()

	total_value = 0

	# Calculate score of each sentence
	for sentence in sentences:
		sentence_value = 0
		for word in sentence:
			if word in word_frequencies:
				sentence_value += word_frequencies[word]
		sentence_values[sentence] = sentence_value
		total_value += sentence_value

	# Calculate threshold by dividing the total score by the number of sentences
	threshold = int(total_value/len(sentence_values))
	for sentence in sentence_values:
		# Return sentences that meet the threshold
		if sentence_values[sentence] >= threshold:
			response += sentence
	return response