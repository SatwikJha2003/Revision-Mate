from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Users, Flashcard, Deck, History, Comment, Confidence, Friends

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ("username", "password1", "password2")

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")        

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ("id", "deck_name", "owner", "share")

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ("id", "question", "question_image", "answer", "answer_image", "owner")

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ("user", "deck", "timestamp", "rating")

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ("id", "user", "deck", "comment")

class ConfidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Confidence
        fields = ("user", "flashcard", "confidence")

class FriendsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friends
        fields = ("user_one", "user_two")

class FileUploadSerializer(serializers.Serializer):
    uploaded_file = serializers.FileField()
    class Meta:
        fields = ("uploaded_file")