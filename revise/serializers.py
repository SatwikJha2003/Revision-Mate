from rest_framework import serializers
from .models import Users, Flashcard, Deck

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('username', 'password1', 'password2')

class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ('deck_name', 'owner')

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = ('question', 'answer')

class FileUploadSerializer(serializers.Serializer):
    uploaded_file = serializers.FileField()
    class Meta:
        fields = ('uploaded_file')