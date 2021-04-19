from django.urls import path

from .views import (
    homepage_view,
    carpark_detail_view,
    special_address_view,
)

app_name = 'parking_app'

urlpatterns = [
    path('', homepage_view, name='homepage_page'),
    path('carpark-detail/<int:park_id>/', carpark_detail_view, name='addresses_page'),
    path('addresses/', special_address_view, name='addresses_page'),
]