# Revision Mate
- Login
- Register
- Summary
- Simple OCR
- Flashcard making
- Flashcard sharing
- Flashcard recall
- Friends
- This was designed for Windows OS and Google Chrome

# Requirements
- Install Python
- Install ReactJS
- Best run in a virtual environment
## Frontend
- Enter the ```frontend``` folder and run ```npm install```
## Backend
- ```pip install -r requirements.txt```
- If there are issues, - ```pip install django``` and ```pip install numpy==1.26.4```
- Install tesseract from https://github.com/UB-Mannheim/tesseract/wiki. Save it in the path ```C:\Users\<username>\AppData\Local\Programs\Tesseract-OCR\tesseract.exe``` if Windows. Else, change the path in ```backend/revise/utils.py``` line:
```pytesseract.pytesseract.tesseract_cmd = r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(username)```
## Database
- Install PostgreSQL. Password is 12345. 
- Open pgAdmin4 and create a database. (e.g. "revision_mate"). You can change settings in ```backend/revision_mate/settings.py``` under DATABASES.
- If you wish to use sqlite3, comment the first default and uncomment the second default.

```
DATABASES = {
    # Comment if you wish to use sqlite3
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'revision_mate',    # Change accordingly
        'USER': 'postgres',         # Change accordingly
        'PASSWORD': '12345',        # Change accordingly
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
    # Uncomment if you wish to use sqlite3
    #'default': {
    #    'ENGINE': 'django.db.backends.sqlite3',
    #    'NAME': BASE_DIR / 'db.sqlite3',
    #}
}
```

# Run
## Before running
- Run in a virtual environment (optional but recommended)
- In the file ```backend/revise/utils.py```, change the filepath for Tesseract
## Django backend
- In a command prompt, enter the backend folder
- ```python manage.py makemigrations```
- ```python manage.py migrate```
- ```python manage.py runserver```
## React frontend
- In another command prompt, enter the ```frontend``` folder and run ```npm start```

Video: https://drive.google.com/file/d/1Fllyh9HGw6KqcoRtUWa-uld31lPH1pQp/view?usp=sharing  
Give the app some time to load
