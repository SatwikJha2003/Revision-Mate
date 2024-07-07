
# Revision Mate Prototype
- Login
- Register
- Summary
- Simple OCR
- Flashcard making
- Flashcard sharing
- This was designed for Windows OS

# Requirements
- Install PostgreSQL. Password is 12345. You can change settings in revision_mate\settings.py under DATABASES. Create a database (e.g. "revision_mate")
- Install python and ReactJS
- ```pip install -r requirements.txt```
- ```pip install django```
- ```pip install numpy```
- Enter the ```frontend``` folder and run ```npm install```
- Install tesseract from https://github.com/UB-Mannheim/tesseract/wiki. Save it in the path ```C:\Users\<username>\AppData\Local\Programs\Tesseract-OCR\tesseract.exe``` if Windows. Else, change the path in ```revise/utils.py``` line:
```pytesseract.pytesseract.tesseract_cmd = r'C:\Users\{}\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'.format(username)```

# Run
### Before running
- Run in a virtual environment (optional but recommended)
- In the file ```revise/utils.py```, change the filepath
### Django backend
- ```python manage.py makemigrations```
- ```python manage.py migrate```
- ```python manage.py runserver```
### React frontend
- In another command prompt, enter the ```frontend``` folder and run ```npm start```

Give the app some time to load
