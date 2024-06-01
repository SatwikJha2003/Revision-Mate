from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import openai
import cv2
import pytesseract
import os
from PIL import Image
import shutil

client = openai.OpenAI(api_key="<Your key here>")

@login_required(login_url="accounts/login")
def chatbot(request):
    messages = [{"role": "system", "content": "You are a student revision assistant"}]
    chat_response = None
    user_request = None
    if request.method == "POST":
        user_request = request.POST.get("user_request")
        messages.append({"role": "user", "content": user_request})
        response = client.chat.completions.create(
            model = "gpt-3.5-turbo",
            messages = messages
    )
        chat_response = response.choices[0].message.content
    chatbot_response = {'user_request':user_request,'chatbot_response':chat_response}
    return render(request, 'home.html', chatbot_response)

@login_required(login_url="accounts/login")
def ocr(request):
    username = os.environ.get('USERNAME')
    text_from_image = None
    filepath = None
    if request.method == "POST":
        try:
            filepath = request.POST.get("filepath")
            images = cv2.imread(filepath)
            gray=cv2.cvtColor(images, cv2.COLOR_BGR2GRAY)
            cv2.threshold(gray, 0,255,cv2.THRESH_BINARY| cv2.THRESH_OTSU)[1]
            temp_file = "{}.jpg".format(os.getpid())
            cv2.imwrite(temp_file, gray)
            pytesseract.pytesseract.tesseract_cmd = r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(username)
            text_from_image = pytesseract.image_to_string(Image.open(temp_file))
            os.remove(temp_file)
            shutil.copyfile(filepath, "static\\images\\ocr.jpg")
        except:
            text_from_image = "Oops! Looks like the file does not exist! Your last successful image is show above."
    texts = {"text_from_image":text_from_image}
    return render(request, 'ocr.html', texts)