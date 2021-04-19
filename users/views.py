from django.shortcuts import render, redirect
from django.contrib.auth.models import AnonymousUser, User
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.contrib  import messages

from .forms import (
    UserSignupModelForm,
    
)




def user_signup_view(request):
    template_name = 'users/signup.html'
    signup_form = UserSignupModelForm(request.POST or None)
    if signup_form.is_valid() and 'username' in request.POST and 'password' in request.POST:
        new_user = User.objects.create_user(**signup_form.cleaned_data)
        if new_user:
            messages.success(request, f"Account for {new_user} successfully created")
            return redirect('user:login_page')
        
    

    context = {
        'page_name': 'Signup',
        'signup_form': signup_form,
    }

    return render(request, template_name, context)




@login_required
def user_logout_view(request):
    logout(request)
    messages.success(request, f"You have logged out!")
    return redirect('parking_app:homepage_page')
