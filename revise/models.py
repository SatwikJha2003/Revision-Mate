from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# Database for users
class Users(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	first_name = models.CharField(max_length=100, default="")
	last_name = models.CharField(max_length=100, default="")

# Database for decks
class Deck(models.Model):
	deck_id = models.CharField(max_length=100, default="")
	deck_name = models.CharField(max_length=100, default="")
	owner = models.ForeignKey(User, on_delete=models.CASCADE)

# Database for flashcards
class Flashcard(models.Model):
	question = models.TextField()
	answer = models.TextField()
	deck_id = models.ForeignKey(Deck, on_delete=models.CASCADE)