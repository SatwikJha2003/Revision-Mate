from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Database for users
class Users(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	first_name = models.CharField(max_length=100, default="")
	last_name = models.CharField(max_length=100, default="")

# Database for flashcards
class Flashcards(models.Model):
	question = models.TextField()
	answer = models.TextField()
