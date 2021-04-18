from django.contrib.auth import views as auth_views
from django.urls import path

from .views import (
    user_signup_view,
    user_logout_view,
)

app_name = 'user'

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(), name='login_page'),
    path('signup/', user_signup_view, name='signup_page'),
    path('logout/', user_logout_view, name='logout_page'),
]