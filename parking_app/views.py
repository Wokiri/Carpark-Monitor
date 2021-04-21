from django.shortcuts import render, redirect, get_object_or_404
from django.contrib  import messages

from django.contrib.gis.db.models import Q
from django.contrib.gis.geos import Point
from django.contrib.gis.gdal import OGRGeometry
from django.contrib.gis.db.models.functions import Distance
from django.core.serializers import serialize

from json import loads

from .models import (
    SpecialAddress,
    Carpark,
)

from .forms import (
    MinPriceRangeForm,
    MaxPriceRangeForm,
    OperationHoursForm,
    ProprietorshipForm,
    WorkDistanceForm,
    SpecialAddressForm,
    CarparkUpdateForm,
)

# Create your views here.
def homepage_view(request):
    template_name = 'parking_app/homepage.html'

    allCarParks = Carpark.objects.all()
    carparks_count = allCarParks.count()

    if allCarParks:
        for carpark in allCarParks:
            carpark_centroid_OGRGeometry = OGRGeometry(carpark.geom.wkt).centroid
            carpark_centroid_lon = loads(carpark_centroid_OGRGeometry.geojson)['coordinates'][0]
            carpark_centroid_lat = loads(carpark_centroid_OGRGeometry.geojson)['coordinates'][1]
            carpark.carpark_centroid = Point(carpark_centroid_lon, carpark_centroid_lat)
            carpark.save()



    min_price_form = MinPriceRangeForm(request.GET or None)
    if min_price_form.is_valid() and 'min_price' in request.GET:
        min_price = min_price_form.cleaned_data['min_price']
        allCarParks = allCarParks.filter(price__gte=min_price)
        if allCarParks:
            carparks_count = allCarParks.count()
        else:
            carparks_count = 0


    max_price_form = MaxPriceRangeForm(request.GET or None)
    if max_price_form.is_valid() and 'max_price' in request.GET:
        max_price = max_price_form.cleaned_data['max_price']
        allCarParks = allCarParks.filter(price__lte=max_price)
        if allCarParks:
            carparks_count = allCarParks.count()
        else:
            carparks_count = 0
            
    

    operation_hours_form = OperationHoursForm(request.GET or None)
    if operation_hours_form.is_valid() and 'operation_hours' in request.GET:
        user_operation_hours = operation_hours_form.cleaned_data['operation_hours']
        allCarParks = allCarParks.filter(operation_hours=user_operation_hours)
        if allCarParks:
            carparks_count = allCarParks.count()
        else:
            carparks_count = 0

    
    proprietor_form = ProprietorshipForm(request.GET or None)
    if proprietor_form.is_valid() and 'proprietor' in request.GET:
        proprietor = proprietor_form.cleaned_data['proprietor']
        if proprietor == None:
            allCarParks = allCarParks
        else:
            allCarParks = allCarParks.filter(proprietor=proprietor)
        if allCarParks:
            carparks_count = allCarParks.count()
        else:
            carparks_count = 0
    

    work_distance_form = ''
    work_address_geojson = ''
    if SpecialAddress.objects.get(name='work_address'):
        work_address_geometry = SpecialAddress.objects.get(name='work_address').address
        work_address_geojson = serialize(
            'geojson', SpecialAddress.objects.filter(name='work_address')
        )
        parks_fitting_work_dist = []
        work_distance_form = WorkDistanceForm(request.GET or None)
        if work_distance_form.is_valid() and 'work_distance' in request.GET:
            work_distance = work_distance_form.cleaned_data['work_distance']
            for carpark in allCarParks.annotate(distance=Distance('carpark_centroid', work_address_geometry)):
                if carpark.distance.km*1000 <= work_distance:
                    parks_fitting_work_dist.append(carpark)
            allCarParks = parks_fitting_work_dist
            if allCarParks:
                carparks_count = len(allCarParks)
            else:
                carparks_count = 0
            
        
    carparks_geojson = serialize(
        'geojson', allCarParks
    )
    
    is_there_carpark_data = True

    context = {
        'page_name': 'Homepage',
        'min_price_form': min_price_form,
        'max_price_form': max_price_form,
        'operation_hours_form': operation_hours_form,
        'proprietor_form': proprietor_form,
        'work_distance_form': work_distance_form,
        'carparks_geojson': carparks_geojson,
        'work_address_geojson': work_address_geojson,
        'is_there_carpark_data': is_there_carpark_data,
        'carparks_count': carparks_count,
        }
    

    return render(request, template_name, context)


def carpark_detail_view(request, park_id):
    template_name = 'parking_app/carpark_detail.html'

    carpark = get_object_or_404(Carpark, id=park_id)
    carpark_update_form = CarparkUpdateForm(request.POST or None, instance=carpark)
    if carpark_update_form.is_valid():
        carpark_update_form.save()
        messages.success(request, f"Details for {carpark.name} updated successfully")

    context = {
        'page_name': 'Carpark Detail',
        'carpark': carpark,
        'carpark_update_form': carpark_update_form,
    }

    return render(request, template_name, context)


def create_update_special_address_view(request):
    template_name = 'parking_app/special_address.html'
    special_address_form = SpecialAddressForm(request.POST or None)
    if special_address_form.is_valid() and 'address' in request.POST: #and 'user' in request.POST 
        work_address_data = special_address_form.cleaned_data
        address, created = SpecialAddress.objects.update_or_create(
            name = 'work_address',
            defaults = work_address_data
        )
        if created:
            messages.success(request, f"A new Work Address {special_address_form.cleaned_data['address']} successfully specified")
            return redirect('parking_app:homepage_page')
        else:
            messages.success(request, f"Work Address {special_address_form.cleaned_data['address']} successfully updated")
            return redirect('parking_app:homepage_page')
    

    context = {
        'page_name': 'Special Address',
        'special_address_form': special_address_form,
    }

    return render(request, template_name, context)


def book_slot_view(request, park_id):
    template_name = 'parking_app/book_slot.html'

    carpark = get_object_or_404(Carpark, id=park_id)
    booking_message = f'<h3 class="text-center mt-5 text-info lead">You are about to book a slot in <span class="font-weight-bold">{carpark.name}</span></h3>'
    
    
    if 'book' in request.POST:
        if carpark.available_slots >= 1:
            carpark.available_slots -= 1
            carpark.save()
            messages.success(request, f"{carpark.name} successfully booked!")
            return redirect('parking_app:homepage_page')
        else:
            messages.error(request, f"{carpark.name} isn't available for booking at the moment!")
            return redirect('parking_app:homepage_page')

    context = {
        'page_name': 'Book Slot',
        'booking_message': booking_message,
    }

    return render(request, template_name, context)