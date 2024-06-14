from rest_framework import serializers
from .models import Users, Flashcards

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('username', 'password1', 'password2')

class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcards
        fields = ('id', 'question', 'answer')

class FileUploadSerializer(serializers.Serializer):
    uploaded_file = serializers.FileField()
    class Meta:
        fields = ('uploaded_file')