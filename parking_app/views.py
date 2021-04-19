from django.shortcuts import render, redirect
from django.contrib  import messages

from django.contrib.gis.db.models import Q
from django.contrib.gis.geos import Point
from django.contrib.gis.gdal import OGRGeometry
from django.core.serializers import serialize

from .models import (
    Carpark
)

from .forms import (
    MinPriceRangeForm,
    MaxPriceRangeForm,
    OperationHoursForm,
    ProprietorshipForm,
    WorkDistanceForm,
    SpecialAddressForm,
)

# Create your views here.
def homepage_view(request):
    template_name = 'parking_app/homepage.html'

    min_price_form = MinPriceRangeForm(request.GET or None)
    max_price_form = MaxPriceRangeForm(request.GET or None)
    operation_hours_form = OperationHoursForm(request.GET or None)
    proprietor_form = ProprietorshipForm(request.GET or None)
    work_distance_form = WorkDistanceForm(request.GET or None)

    carparks_geojson = serialize(
        'geojson', Carpark.objects.all()
    )


    context = {
        'page_name': 'Homepage',
        'min_price_form': min_price_form,
        'max_price_form': max_price_form,
        'operation_hours_form': operation_hours_form,
        'proprietor_form': proprietor_form,
        'work_distance_form': work_distance_form,
        'carparks_geojson': carparks_geojson,
    }

    return render(request, template_name, context)




def special_address_view(request):
    template_name = 'parking_app/special_address.html'
    special_address_form = SpecialAddressForm(request.POST or None)
    if special_address_form.is_valid() and 'user' in request.POST and 'work_address' in request.POST:
        special_address_form.save()
        messages.success(request, f"Home Address for  successfully created")
        return redirect('parking_app:homepage_page')
    

    context = {
        'page_name': 'Special Address',
        'special_address_form': special_address_form,
    }

    return render(request, template_name, context)