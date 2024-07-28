from django.contrib import admin
from .models import Users, Deck, Flashcard

# Register your models here.
admin.site.register(Users)
admin.site.register(Deck)
admin.site.register(Flashcard)


