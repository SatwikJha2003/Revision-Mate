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
        print(request.query_params["deck_name"])
        deck_name = request.query_params["deck_name"]
        if deck_name:
            deck = Deck.objects.get(deck_name=deck_name, owner=request.user.id)
            flashcards = deck.flashcard_set.all()
            flashcards = FlashcardSerializer(flashcards, many=True)
            return Response(flashcards.data)

        flashcards = Flashcard.objects.all().filter(owner=request.user.id)
        flashcards = FlashcardSerializer(flashcards, many=True)
        return Response(flashcards.data)

    def create(self, request):
        deck_name = request.data["deck_name"]
        question = request.data["question"]
        answer = request.data["answer"]
        deck = Deck.objects.get(deck_name=deck_name, owner=request.user.id)
        flashcard = Flashcard(question=question,answer=answer,owner=request.user)
        flashcard.save()
        flashcard.deck.add(deck)
        return Response("Success!")

@method_decorator(csrf_protect, name='dispatch')
class DecksView(viewsets.ModelViewSet):
    serializer_class = DeckSerializer

    def list(self, request):
        decks = Deck.objects.all().filter(owner=request.user.id)
        decks = DeckSerializer(decks, many=True)
        return Response(decks.data)

    def create(self, request):
        try:
            deck_name = request.data["deck_name"]
            if deck_name == "":
                return Response("Deck name cannot be empty!")

            if "share" in request.data.keys() and request.data["share"] == "protected":
                deck = Deck(deck_name=deck_name, owner=request.user, share="protected")
            else:
                deck = Deck(deck_name=deck_name, owner=request.user)
            deck.save()
            return Response("Success!")
        except IntegrityError:
            return Response("You already have a deck of this name!")

    def delete(self, request):
        deck_name = request.data["deck_name"]
        deck_id = Deck.objects.filter(deck_name=deck_name, owner_id=request.user.id).delete()
        return Response("Success!")

    def patch(self, request):
        deck_name = request.data["deck_name"]
        share = request.data["share"]
        deck = Deck.objects.filter(deck_name=deck_name, owner_id=request.user.id).update(share=share)
        return Response("Success!")
        

class ShareView(viewsets.ModelViewSet):
    serializer_class = DeckSerializer
    queryset = Deck.objects.all()

    def list(self, request):
        decks = Deck.objects.all().filter(share="public").exclude(owner=request.user.id)
        decks = DeckSerializer(decks, many=True)
        return Response(decks.data)

    def create(self, request):
        # Get the deck to be copied
        deck_id = request.data["deck_id"]
        deck = Deck.objects.get(id=deck_id)
        flashcards = deck.flashcard_set.all()
        flashcards = FlashcardSerializer(flashcards, many=True)

        # Make request modifiable to reuse code
        request.POST._mutable = True
        request.POST["share"] = "protected"

        # Make the deck
        response = DecksView.create(self, request)

        # Update request with each question and answer
        # and create the flashcard
        if response.data == "Success!":
            for flashcard in flashcards.data:
                request.POST["question"] = flashcard["question"]
                request.POST["answer"] = flashcard["answer"]
                FlashcardsView.create(self, request)
        return Response("Success!")

class SummaryView(viewsets.ViewSet):
    serializer_class = FileUploadSerializer

    def create(self, request):
        uploaded_file = request.FILES.get("file_name")
        is_image = utils.check_if_image(uploaded_file)
        file_text = ""

        if is_image:
            with open("extract.jpg", "wb") as new_file:
                for chunk in uploaded_file.chunks():
                    new_file.write(chunk)
            file_text = utils.get_text_from_image()
        else:
            data = b""
            for chunk in uploaded_file.chunks():
                data += chunk
            file_text = data.decode()
        summary = utils.summarize(file_text)
        return Response((file_text,summary))

class DeleteUserView(viewsets.ViewSet):

    def list(self, request):
        return Response("")

    def delete(self, request):
        user = self.request.user
        user = User.objects.filter(id=user.id).delete()
        return Response("Success!")