"""my_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from dashboard.views import (
    dashboard,
    send_decks,
    render_decks,
    add_cards,
    send_cards,
    quiz
)

app_name = 'dashboard'

urlpatterns = [
    path('api/send-decks/', send_decks, name='send_decks'),
    path('api/render-decks/', render_decks, name='render_decks'),
    path('add-cards/api/send-cards/', send_cards, name='send_cards'),
    path('', dashboard, name='dashboard'),
    path('add-cards/<int:deck_number>/', add_cards),
    path('quiz-start/<int:deck_number>/', quiz)
] 