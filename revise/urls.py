from django.urls import path, include, re_path
from django.conf import settings
from . import views
from django.conf.urls.static import static
from rest_framework import routers

router = routers.DefaultRouter()
router.register('authenticate', views.CheckAuthView, basename="authenticate")
router.register('login', views.LoginView, basename="login")
router.register('logout', views.LogoutView, basename="logout")
router.register('register', views.RegisterView, basename="register")
router.register('decks', views.DecksView, basename="decks")
router.register('flashcards', views.FlashcardsView, basename="flashcards")
router.register('ocr', views.OCRView, basename="ocr")
router.register('delete', views.DeleteUserView, basename="delete")

urlpatterns = [
	path('', include(router.urls)),
	path('csrf', views.CSRFToken.as_view())
]
