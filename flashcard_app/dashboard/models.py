from django.db import models
from django.conf import settings

# Create your models here.

User = settings.AUTH_USER_MODEL

class Decks(models.Model):
    DeckID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    DeckName = models.CharField(max_length=254)

class Cards(models.Model):
    CardID = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, null=False, blank=False, on_delete=models.CASCADE)
    DeckID = models.ForeignKey(Decks, null=False, blank=False, on_delete=models.CASCADE)
    CardFront = models.TextField()
    CardBack = models.TextField()