Revision Mate

# Proof of concept
- Login
- Register
- Simple chatbot interaction
- Simple OCR
- This was designed for Windows OS

# Requirements
- Install PostgreSQL. Set password and create a database. 
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
- Change settings for database in revision_mate\settings.py under DATABASES if needed
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'dbtest',  # Change to your database name
        'USER': 'postgres',  # Change to your PostgreSQL user
        'PASSWORD': '12345',  # Change to the password you set
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
    #'default': {
    #    'ENGINE': 'django.db.backends.sqlite3',
    #    'NAME': BASE_DIR / 'db.sqlite3',
    #}
}
```
- run ```python manage.py migrate```
- In the file revision_mate\views.py, change the filepath
- run ```python manage.py runserver```

# Video
https://drive.google.com/file/d/1MaOoBwDDRyzBzlxEY6yya-xqcrCuIpl6/view
