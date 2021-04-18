from django.shortcuts import render

from .forms import (
    MinPriceRangeForm,
    MaxPriceRangeForm,
    OperationHoursForm,
    ProprietorshipForm,
    WorkDistanceForm,
)

# Create your views here.
def homepage_view(request):
    template_name = 'parking_app/homepage.html'

    min_price_form = MinPriceRangeForm(request.GET or None)
    max_price_form = MaxPriceRangeForm(request.GET or None)
    operation_hours_form = OperationHoursForm(request.GET or None)
    proprietor_form = ProprietorshipForm(request.GET or None)
    work_distance_form = WorkDistanceForm(request.GET or None)

    context = {
        'page_name': 'Homepage',
        'min_price_form': min_price_form,
        'max_price_form': max_price_form,
        'operation_hours_form': operation_hours_form,
        'proprietor_form': proprietor_form,
        'work_distance_form': work_distance_form,
    }

    return render(request, template_name, context)