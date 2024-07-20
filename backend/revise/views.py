from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models import Sum, Avg
from django.shortcuts import render
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UsersSerializer, DeckSerializer, FlashcardSerializer, FileUploadSerializer, CommentSerializer, HistorySerializer, FriendsSerializer
from .models import Users, Deck, Flashcard, History, Comment, Confidence, Friends
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
            return Response({"success":"Login successful!","id":user.id,"username":username})
        else:
            return Response({"error":"Credentials incorrect!"})

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

class UsersView(viewsets.ModelViewSet):

    def list(self, request):
        username = request.query_params["username"]
        user = User.objects.all().filter(username__contains=username)
        user = UsersSerializer(user, many=True)
        return Response({"success":"Users retrieved","users":user.data})

class FlashcardsView(viewsets.ModelViewSet):
    permission = (permissions.AllowAny, )
    serializer_class = FlashcardSerializer
    queryset = Flashcard.objects.all()

    def list(self, request):
        deckId = request.query_params["deckId"]
        if deckId:
            deck = Deck.objects.get(id=deckId)
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

    # Get decks. Include information such as creator, rating and number of views
    def list(self, request):
        decks = Deck.objects.all().filter(share=True)
        decks = DeckSerializer(decks, many=True)

        for deck in decks.data:
            history = History.objects.all().filter(deck=deck["id"])
            # Get creator
            creator = User.objects.all().filter(id=deck["owner"])
            deck["creator"] = creator[0].username

            # Get rating among users who rated
            average_rating = history.exclude(rating=0).aggregate(Avg("rating"))["rating__avg"]
            deck["rating"] = average_rating

            # Get number of views
            views = history.count()
            deck["views"] = views

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

class DeckMakingView(viewsets.ViewSet):
    serializer_class = FileUploadSerializer

    def create(self, request):
        deck_name = request.data["deckname"]
        question = request.POST.getlist("question")
        answer = request.POST.getlist("answer")
        files = request.FILES
        share = ""

        # Determine if deck is public or private
        if "share" in request.data:
            share = True
        else:
            share = False

        if not deck_name:
            return Response({"error":"Deck name required!"})

        # Create deck
        deck = Deck(deck_name=deck_name, owner=request.user, share=share)
        deck.save()

        # Create flashcards
        for i in range(len(question)):
            # Save files and get path
            question_image = files.get("question_image-" + str(i))
            answer_image = files.get("answer_image-" + str(i))

            flashcard = Flashcard(question=question[i],question_image=question_image,answer=answer[i],answer_image=answer_image,deck=deck,owner=request.user)
            flashcard.save()
        return Response({"success":"Deck created", "id":deck.id})

class HistoryView(viewsets.ViewSet):

    def list(self, request):
        user = request.query_params["user"]
        if user == "-1":
            user = request.user.id
        print(user)
        deckIds = []
        times = []
        decks = History.objects.all().filter(user=user).order_by("deck")

        for deck in decks:
            deckIds.append(deck.deck)
            times.append(deck.timestamp)

        userDecks = Deck.objects.all().filter(id__in=deckIds)
        userDecks = DeckSerializer(userDecks, many=True)

        for i in range(len(userDecks.data)):
            userDecks.data[i]["timestamp"] = times[i]

        return Response({"success":"Decks retrieved", "decks":userDecks.data})

    def create(self, request):
        try:
            deckId = request.data["deckId"]
            history = History.objects.all().filter(user=request.user.id, deck=deckId)

            if history:
                history.update(timestamp=timezone.localtime())
            else:
                history = History(user=request.user.id, deck=deckId, timestamp=timezone.localtime())
                history.save()
            return Response({"success":"History updated"})
        except IntegrityError:
            return Response({"error":"Record already exists"})

class RecallView(viewsets.ViewSet):

    def list(self, request):
        deckId = request.query_params["deckId"]
        questionIds = []
        test = []

        # Get flashcards from deck
        deck = Deck.objects.get(id=deckId)
        flashcards = deck.flashcard_set.all()
        flashcards = FlashcardSerializer(flashcards, many=True)

        for flashcard in flashcards.data:
            questionIds.append(flashcard["id"])

        # Get user's confidence of each question if any
        confidence = Confidence.objects.all().filter(user=request.user.id, flashcard__in=questionIds)

        # If no confidence, initialize all confidence to 0
        if not confidence:
            for questionId in questionIds:
                confidence = Confidence(user=request.user.id, flashcard=questionId, count=0, confidence=0)
                confidence.save()
            confidence = Confidence.objects.all().filter(user=request.user.id, flashcard__in=questionIds)

        score = confidence.aggregate(Sum("confidence"))
        count = confidence.aggregate(Sum("count"))
        flashcards_id_list = utils.select_flashcards(confidence, score, count)

        for i in range(10):
            question = deck.flashcard_set.filter(id=flashcards_id_list[i])
            question = FlashcardSerializer(question, many=True)
            test += question.data

        return Response({"success":"Flashcards retrieved", "flashcards":test})

class ConfidenceView(viewsets.ViewSet):

    def create(self, request):
        flashcard = request.data["id"]
        score = request.data["confidence"]
        confidence = Confidence.objects.all().filter(user=request.user.id, flashcard=flashcard)

        # If record exists, update count and score
        if confidence:
            total_score = float(confidence[0].count * confidence[0].confidence) + score
            count = confidence[0].count + 1
            score = total_score/count
            confidence.update(count=count,confidence=score)
        else:
            confidence = Confidence(user=request.user.id, flashcard=flashcard, count=1, confidence=score)
            confidence.save()

        return Response({"success":"Confidence updated"})

    # Reset confidence by deleting records
    def delete(self, request):
        # Get cards
        deckId = request.query_params["deckId"]
        deck = Deck.objects.get(id=deckId)
        flashcards = deck.flashcard_set.all()
        flashcards = FlashcardSerializer(flashcards, many=True)
        print(flashcards.data)

        for flashcard in flashcards.data:
            Confidence.objects.filter(user=request.user.id,flashcard=flashcard["id"]).delete()

        return Response({"success":"Confidence reset"})

class RatingsView(viewsets.ViewSet):

    def list(self, request):
        # Get individual rating
        deckId = request.query_params["deckId"]
        userRating = 0

        # Get individual rating
        history = History.objects.all().filter(user=request.user.id, deck=deckId)
        history = HistorySerializer(history, many=True)

        if history:
            userRating = history.data[0]["rating"]

        # Get average rating among users who rated
        history = History.objects.all().filter(deck=deckId).exclude(rating=0)
        average_rating = history.aggregate(Avg("rating"))["rating__avg"]

        return Response({"success":"Ratings retrieved", "user rating":userRating, "average rating":average_rating})

    def post(self, request):
        deckId = request.data["deckId"]
        userRating = int(request.data["userRating"]) + 1
        history = History.objects.all().filter(user=request.user.id, deck=deckId)
        if history:
            history.update(rating=userRating)
        else:
            history = History(user=request.user.id, rating=userRating)
            history.save()

        # Get new average rating
        average_rating = History.objects.all().filter(deck=deckId).aggregate(Avg("rating"))["rating__avg"]
        print(average_rating)
        return Response({"success":"Rating updated", "average rating":average_rating})

class CommentsView(viewsets.ViewSet):

    def list(self, request):
        deckId = request.query_params["deckId"]
        comments = Comment.objects.all().filter(deck=deckId)
        comments = CommentSerializer(comments, many=True)
        return Response({"success":"Comments retrieved", "comments":comments.data})

    def create(self, request):
        deckId = request.data["deckId"]
        comment = request.data["comment"]

        # Save comment
        comment = Comment(user=request.user.id, deck=deckId, comment=comment)
        comment.save()
        return Response({"success":"Comment added"})

class FriendsView(viewsets.ViewSet):

    def list(self, request):
        friendWith = Friends.objects.all().filter(user_one=request.user.id, friends=True)
        friendOf = Friends.objects.all().filter(user_two=request.user.id, friends=True)
        friendWith = FriendsSerializer(friendWith, many=True)
        friendOf = FriendsSerializer(friendOf, many=True)

        # Swap order of friendOf
        for friend in friendOf.data:
            temp = friend["user_one"]
            friend["user_one"] = friend["user_two"]
            friend["user_two"] = temp

        # Get name of friends
        for friend in friendWith.data:
            user = User.objects.all().filter(id=friend["user_two"])
            friend["username"] = user[0].username

        for friend in friendOf.data:
            user = User.objects.all().filter(id=friend["user_two"])
            friend["username"] = user[0].username

        return Response({"success":"Friends retrieved", "friends":friendWith.data + friendOf.data})

class RequestsView(viewsets.ViewSet):

    def list(self, request):
        sent = Friends.objects.all().filter(user_one=request.user.id, friends=False)
        sent = FriendsSerializer(sent, many=True)
        received = Friends.objects.all().filter(user_two=request.user.id, friends=False)
        received = FriendsSerializer(received, many=True)

        # Get names
        for request in sent.data:
            user = User.objects.all().filter(id=request["user_two"])
            request["username"] = user[0].username

        for request in received.data:
            user = User.objects.all().filter(id=request["user_one"])
            request["username"] = user[0].username

        return Response({"success":"Requests retrieved", "sent":sent.data, "received":received.data})


    def create(self, request):
        requested = request.data["requested"]
        try:
            friend = Friends.objects.filter(user_one=requested, user_two=request.user.id) | Friends.objects.filter(user_one=request.user.id, user_two=requested)
            if friend:
                friend.update(friends=True)
            else:
                friend = Friends(user_one=request.user.id, user_two=requested, friends=False)
                friend.save()
        except:
            pass
        return Response({"success":"Request sent"})

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