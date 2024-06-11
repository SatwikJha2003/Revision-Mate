from django.shortcuts import render
from rest_framework import parsers, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import FlashcardSerializer, FileUploadSerializer
from .models import Flashcards
from . import utils

# Create your views here.
class FlashcardsView(viewsets.ModelViewSet):
    serializer_class = FlashcardSerializer
    queryset = Flashcards.objects.all()

class FileUploadView(viewsets.ViewSet):
    serializer_class = FileUploadSerializer

    def list(self, request):
        print("hello")
        return Response("Get API")

    def create(self, request):
        print(request.FILES)
        uploaded_file = request.FILES.get("uploaded_file")
        with open("extract.jpg", "wb") as new_file:
            for chunk in uploaded_file.chunks():
                new_file.write(chunk)
        extracted_text = utils.get_text_from_image()
        return Response(extracted_text)