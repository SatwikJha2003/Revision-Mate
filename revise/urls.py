from django.urls import path, include, re_path
from django.conf import settings
from . import views
from django.conf.urls.static import static
from rest_framework import routers

router = routers.DefaultRouter()
router.register('flashcards', views.FlashcardsView)
router.register('upload', views.FileUploadView, basename="upload")

urlpatterns = [
	path('', include(router.urls)),
]
