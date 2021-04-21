from django.contrib.gis import forms
from .models import (
    SpecialAddress,
    Carpark,
)

class MinPriceRangeForm(forms.Form):
    min_price = forms.IntegerField(
        label='Minimum Price',
        min_value=0,
        max_value =2000,
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
                'step': 100,
            }
        )
    )

class MaxPriceRangeForm(forms.Form):
    max_price = forms.IntegerField(
        label='Maximum Price',
        min_value=0,
        max_value =2000,
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
                'step': 100,
            }
        )
    )

class OperationHoursForm(forms.ModelForm):
    class Meta:
        model=Carpark
        fields=['operation_hours']


class ProprietorshipForm(forms.ModelForm):
    class Meta:
        model=Carpark
        fields=['proprietor']



class WorkDistanceForm(forms.Form):
    work_distance = forms.IntegerField(
        label='Distance in meters from Work Place Address',
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
                'step': 100,
            }
        )
    )


class SpecialAddressForm(forms.ModelForm):
    address = forms.PointField(
        widget= forms.OSMWidget(
        attrs={
            'map_width': 600,
            'map_height': 400,
            'default_lat': -1.2921,
            'default_lon': 36.8219,
            'default_zoom': 15
            }
        )
    )

    class Meta:
        model = SpecialAddress
        fields = '__all__'


class CarparkUpdateForm(forms.ModelForm):

    class Meta:
        model = Carpark
        fields = ['name', 'capacity', 'available_slots', 'price', 'proprietor', 'operation_hours']

