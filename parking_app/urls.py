from django.urls import path

from .views import (
    homepage_view,
    carpark_detail_view,
    book_slot_view,
    create_update_special_address_view,
)

app_name = 'parking_app'

urlpatterns = [
    path('', homepage_view, name='homepage_page'),
    path('carpark-detail/<int:park_id>/', carpark_detail_view, name='addresses_page'),
    path('book-slot/<int:park_id>/', book_slot_view, name='booking_page'),
    path('addresses/', create_update_special_address_view, name='addresses_page'),
]