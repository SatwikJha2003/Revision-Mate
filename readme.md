Revision Mate

# Proof of concept
- Login
- Register
- Simple chatbot interaction
- Simple OCR
- This was designed for Windows OS

# Requirements
- Install PostgreSQL. Password is 12345. You can change settings in revision_mate\settings.py under DATABASES
- pip install django
- pip install psycopg2
- pip install openai
- pip install opencv-python
- pip install pytesseract
- Install tesseract from https://github.com/UB-Mannheim/tesseract/wiki. Save it in the path C:\Users\<username>\AppData\Local\Programs\Tesseract-OCR\tesseract.exe if Windows. Else, change the path in revision_mate\views.py line:
```pytesseract.pytesseract.tesseract_cmd = r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(username)```
- Change API key in revision_mate\views.py
```client = openai.OpenAI(api_key="<Your key here>")```

# Run
- Run in a virtual environment (optional but recommended)
- In the file revision_mate\views.py, change the filepath
- python manage.py runserver
