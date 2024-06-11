from django.db import models

# Create your models here.

# Database for flashcards
class Flashcards(models.Model):
	question = models.TextField()
	answer = models.TextField()
