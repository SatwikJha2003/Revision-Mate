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
	deck_name = models.CharField(max_length=100, default="")
	owner = models.ForeignKey(User, on_delete=models.CASCADE)
	share = models.BooleanField()

# Location to save images in
def set_image_path(instance, filename):
	return "{}/{}".format(instance.owner.id, filename)

# Database for flashcards
class Flashcard(models.Model):
	question = models.TextField()
	question_image = models.ImageField(upload_to=set_image_path,null=True)
	answer = models.TextField()
	answer_image = models.ImageField(upload_to=set_image_path,null=True)
	deck = models.ForeignKey(Deck, on_delete=models.CASCADE, null=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

# Database for decks users used. This includes their ratings
class History(models.Model):
	user = models.IntegerField()
	deck = models.IntegerField()
	timestamp = models.DateTimeField()
	rating = models.IntegerField(default=0)

	class Meta:
		constraints = [
            models.UniqueConstraint(fields=['user', 'deck'], name='history pairing')
        ]

# Database for comments
class Comment(models.Model):
	user = models.IntegerField()
	deck = models.IntegerField()
	comment = models.TextField()

# Database for flashcard confidence
class Confidence(models.Model):
	user = models.IntegerField()
	flashcard = models.IntegerField()
	count = models.IntegerField()
	confidence = models.DecimalField(max_digits=3, decimal_places=2)

	class Meta:
		constraints = [
			models.UniqueConstraint(fields=['user', 'flashcard'], name='user confidence')
		]

# Database for friends
class Friends(models.Model):
	user_one = models.IntegerField()
	user_two = models.IntegerField()
	friends = models.BooleanField()

	class Meta:
		constraints = [
			models.UniqueConstraint(fields=['user_one', 'user_two'], name='friends')
		]