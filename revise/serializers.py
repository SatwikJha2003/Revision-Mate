from rest_framework import serializers
from .models import Users, Flashcard, Deck, History, Comment, Confidence

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ("username", "password1", "password2")

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ("id", "deck_name", "owner", "share", "rating")

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ("id", "question", "answer", "owner")

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

class FileUploadSerializer(serializers.Serializer):
    uploaded_file = serializers.FileField()
    class Meta:
        fields = ("uploaded_file")