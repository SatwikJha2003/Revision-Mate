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
router.register('users', views.UsersView, basename="user")
router.register('decks', views.DecksView, basename="decks")
router.register('flashcards', views.FlashcardsView, basename="flashcards")
router.register('summary', views.SummaryView, basename="summary")
router.register('deckMaking', views.DeckMakingView, basename="deckMaking")
router.register('history', views.HistoryView, basename="history")
router.register('recall', views.RecallView, basename="recall")
router.register('confidence', views.ConfidenceView, basename="confidence")
router.register('ratings', views.RatingsView, basename="ratings")
router.register('comments', views.CommentsView, basename="comments")
router.register('friends', views.FriendsView, basename="friends")
router.register('requests', views.RequestsView, basename="requests")

urlpatterns = [
	path('', include(router.urls)),
	path('csrf', views.CSRFToken.as_view())
]
