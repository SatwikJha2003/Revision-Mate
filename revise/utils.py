import cv2
import pytesseract
from PIL import Image
import os
from pathlib import Path

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
		print("ocr")
		return extracted_text
	except:
		print("error")