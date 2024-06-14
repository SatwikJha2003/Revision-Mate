from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, FlashcardSerializer, FileUploadSerializer
from .models import Users, Flashcards
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

        username = user_info['username']
        email = user_info['email']
        password1 = user_info['password1']
        password2 = user_info['password2']

        if password1 == password2:
            new_user = User.objects.create_user(username,email,password1)
            new_user.save()
            new_user = User.objects.get(id=new_user.id)
            user = Users(user=new_user, first_name='', last_name='')
            user.save()
            return Response("Okay")
        else:
            return Response("Passwords are different")

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
            return Response("Login")
        else:
            return Response("Not login")

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

class DeleteUserView(viewsets.ViewSet):

    def list(self, request):
        return Response("")

    def delete(self, request):
        user = self.request.user
        user = User.objects.filter(id=user.id).delete()
        return Response("Deleted")