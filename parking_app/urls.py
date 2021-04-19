from django.urls import path

from .views import (
    homepage_view,
    special_address_view,
)

app_name = 'parking_app'

urlpatterns = [
    path('', homepage_view, name='homepage_page'),
    path('addresses/', special_address_view, name='addresses_page'),
]