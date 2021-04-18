from django.urls import path

from .views import (
    homepage_view,
)

app_name = 'parking_app'

urlpatterns = [
    path('', homepage_view, name='homepage_page'),
]