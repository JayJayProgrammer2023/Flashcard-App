from django.shortcuts import render, redirect
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .forms import (
    SignupForm,
    SigninForm
    )
from .validators import validate_password_similarity
from django.utils.translation import gettext as _

def signin(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/dashboard")
        else:
            messages.error(request, "The information you entered is incorrect. Please try again.")
            return redirect(request.path)
    return render(request, "signin.html")

def register(request):
    if request.method == "POST":
        form = SignupForm(request.POST or None)
        print(form)
        if form.is_valid():
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            confirm = form.cleaned_data['confirm_password']
            if password == confirm:
                if password.lower() in username.lower():
                    messages.error(request, "Password must not be too similar to the username.")
                elif password.lower() in email.lower():
                    messages.error(request, "Password must not be too similar to the email.")
                elif email.lower() in username.lower():
                    messages.error(request, "Username and email should be different.")
                else:
                    obj = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password
                    )
                    print(obj.username, obj.email, obj.password)
                    return HttpResponseRedirect("/dashboard")
            else:
                messages.error(request, "Your passwords do not match.")
                return redirect(request.path)
        else:
            for field in form:
                for error in field.errors:
                    messages.error(request, "{}".format(error))
                    print(error)
            return redirect(request.path)      
    return render(request, "register.html")


