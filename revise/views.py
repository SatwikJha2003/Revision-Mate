from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, DeckSerializer, FlashcardSerializer, FileUploadSerializer
from .models import Users, Deck, Flashcard
from . import utils

# Create your views here.
@method_decorator(csrf_protect, name='dispatch')
class CheckAuthView(viewsets.ViewSet):

    def list(self, request):
        is_authenticated = request.user.is_authenticated
        if is_authenticated:
            return Response("Authenticated")
        else:
            return Response("Not authenticated")

@method_decorator(csrf_protect, name='dispatch')
class RegisterView(viewsets.ViewSet):
    serializer_class = UserSerializer
    permission = (permissions.AllowAny, )

    def create(self, request):
        user_info = request.data

        first_name = user_info['first_name']
        last_name = user_info['last_name']
        username = user_info['username']
        email = user_info['email']
        password1 = user_info['password_one']
        password2 = user_info['password_two']

        if password1 != password2:
            return Response("Passwords are different!")

        password_check = utils.check_password_strength(password1)
        if not password_check[0]:
            return Response(password_check[1])

        new_user = User.objects.create_user(username,email,password1)
        new_user.save()
        new_user = User.objects.get(id=new_user.id)
        user = Users(user=new_user, first_name=first_name, last_name=last_name)
        user.save()
        return Response(password_check[1])

@method_decorator(csrf_protect, name='dispatch')
class LoginView(viewsets.ViewSet):
    permission = (permissions.AllowAny, )

    def create(self, request):
        user_info = self.request.data

        username = user_info['username']
        password = user_info['password']

        user = authenticate(username=username,password=password)

        if user:
            login(request,user)
            return Response("Success")
        else:
            return Response("Credentials incorrect!")

class LogoutView(viewsets.ViewSet):

    def create(self, request):
        try:
            logout(request)
            return Response("Logout")
        except:
            return Response("Something happened logging out")

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CSRFToken(APIView):
    permission = (permissions.AllowAny, )

    def get(self, request):
        return Response("CSRF set")

class FlashcardsView(viewsets.ModelViewSet):
    permission = (permissions.AllowAny, )
    serializer_class = FlashcardSerializer
    queryset = Flashcard.objects.all()

    def list(self, request):
        flashcards = Flashcard.objects.all().filter(owner=request.user.id)
        flashcards = FlashcardSerializer(flashcards, many=True)
        return Response(flashcards.data)

    def create(self, request):
        question = request.data["question"]
        answer = request.data["answer"]
        flashcard = Flashcard(question=question,answer=answer,owner=request.user)
        flashcard.save()
        return Response("Success!")

@method_decorator(csrf_protect, name='dispatch')
class DecksView(viewsets.ModelViewSet):
    serializer_class = DeckSerializer

    def create(self, request):
        try:
            deck_name = request.data['deck_name']
            if deck_name == "":
                return Response("Deck name cannot be empty!")

            deck = Deck(deck_name=deck_name, owner=request.user)
            deck.save()
            return Response("Success!")
        except IntegrityError:
            return Response("You already have a deck of this name!")

class FileUploadView(viewsets.ViewSet):
    serializer_class = FileUploadSerializer

    def list(self, request):
        return Response("Get API")

    def create(self, request):
        print(request.FILES)
        uploaded_file = request.FILES.get("uploaded_file")
        with open("extract.jpg", "wb") as new_file:
            for chunk in uploaded_file.chunks():
                new_file.write(chunk)
        extracted_text = utils.get_text_from_image()
        return Response(extracted_text)

class DeleteUserView(viewsets.ViewSet):

    def list(self, request):
        return Response("")

    def delete(self, request):
        user = self.request.user
        user = User.objects.filter(id=user.id).delete()
        return Response("Deleted")