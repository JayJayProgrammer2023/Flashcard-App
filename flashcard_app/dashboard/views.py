from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth import logout
from django.http import HttpResponseRedirect, HttpResponse
import json
from .models import Decks, Cards


# Create your views here.

@login_required(login_url='/signin/')
def dashboard(request):
    if request.method == "POST":
        logout(request)
        return HttpResponseRedirect("/signin")
    return render(request, "dashboard.html")

def render_decks(request):
    decks = Decks.objects.all()
    user_decks = []
    for deck in decks:
        if deck.user == request.user:
            user_decks.append(deck)    
    decks_data = [{"DeckID": deck.DeckID, "user": deck.user.id, "DeckName": deck.DeckName} for deck in user_decks]
    context = {
        "Decks": decks_data,
        'success': True
    }
    return JsonResponse(context)


def send_decks(request):
    if request.method == 'POST':
        try:
            # Parse the JSON data received in the request body
            json_data = json.loads(request.body)
            decks = Decks.objects.all()
            user_decks = []
            for deck in decks:
                if deck.user == request.user:
                    user_decks.append(deck)    
            decks_data = [{"DeckID": deck.DeckID, "user": deck.user.id, "DeckName": deck.DeckName} for deck in user_decks]
            for item in json_data:
                if item not in decks_data:
                    deck = Decks(
                        DeckName=item['DeckName'], 
                        user=request.user
                    )
                    deck.save()
            for item in decks_data:
                if item not in json_data:
                    Decks.objects.filter(DeckID=item["DeckID"]).delete()
            response_data = {
                'message': 'Data successfully received and processed on the server.',
                'success': True,
                # Add other data you want to send to the frontend
            }
            return JsonResponse(response_data)
        except json.JSONDecodeError:
            # Handle the case where JSON data is not valid
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

def send_cards(request):
    # Parse the JSON data received in the request body
    if request.method == 'POST':
        try:
            json_data = json.loads(request.body)
            print(json_data)
            decks = []
            cards = []
            if json_data[0]["NotEmpty"] == True:
                decks = Decks.objects.filter(DeckName=json_data[0]["DeckName"])
                cards = Cards.objects.filter(DeckID=decks[0].DeckID)
                card_name = [card.CardFront for card in cards]
                card_back = [card.CardBack for card in cards]
                json_name = [card["Front"] for card in json_data]
                for card in json_data:
                    if card["Front"] not in card_name:
                        if card["Back"] not in card_back:
                            deck = Cards(
                                DeckID=decks[0],
                                user=decks[0].user,
                                CardFront=card["Front"],
                                CardBack=card["Back"]
                            )
                            deck.save()
                for card in cards:
                    if card.CardFront not in json_name:
                        Cards.objects.filter(CardFront=card.CardFront).delete()
                response_data = {
                    'message': 'Data successfully received and processed on the server.',
                    'success': True,
                    # Add other data you want to send to the frontend
                }
                return JsonResponse(response_data)
            else:
                decks = Decks.objects.filter(DeckName=json_data[0]["DeckName"])
                cards = Cards.objects.filter(DeckID=decks[0].DeckID)
                for card in cards:
                    Cards.objects.filter(CardFront=card.CardFront).delete()
                response_data = {
                    'message': 'Data successfully received and processed on the server.',
                    'success': True,
                    # Add other data you want to send to the frontend
                }
                return JsonResponse(response_data)
        except json.JSONDecodeError:
            # Handle the case where JSON data is not valid
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
def add_cards(request, deck_number):
    deck_obj = Decks.objects.filter(DeckID=deck_number)[0]
    cards = Cards.objects.all()
    user_cards = []
    for card in cards:
        if card.DeckID.DeckID == deck_obj.DeckID:
            user_cards.append(card)  
    cards_done = [{"CardID": card.CardID, "user": card.user.id, "DeckID": card.DeckID.DeckID, "CardFront": card.CardFront, "CardBack": card.CardBack} for card in user_cards]
    context = {
        'cards_done': cards_done,
        'deck_obj': deck_obj,
    }
    return render(request, "add_cards.html", context)

def quiz(request, deck_number):
    deck_obj = Decks.objects.filter(DeckID=deck_number)[0]
    cards = Cards.objects.all()
    user_cards = []
    for card in cards:
        if card.DeckID.DeckID == deck_obj.DeckID:
            user_cards.append(card)  
    cards_done = [{"CardID": card.CardID, "user": card.user.id, "DeckID": card.DeckID.DeckID, "CardFront": card.CardFront, "CardBack": card.CardBack} for card in user_cards]
    return render(request, 'quiz.html', {"data": cards_done})



    




    