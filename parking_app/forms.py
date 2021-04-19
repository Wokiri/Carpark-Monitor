from django.contrib.gis import forms
from .models import (
    SpecialAddress
)

class MinPriceRangeForm(forms.Form):
    min_price = forms.IntegerField(
        label='Minimum Price',
        required = False,
        min_value=0,
        max_value =200,
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
                'step': 25,
                'initial': 0,
                'placeholder': 'Defaults to Ksh. 0'
            }
        )
    )

class MaxPriceRangeForm(forms.Form):
    max_price = forms.IntegerField(
        required = False,
        label='Maximum Price',
        min_value=200,
        max_value =2000,
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
                'step': 25,
                'initial': 2000,
                'placeholder': 'Defaults to Ksh. 2000',
            }
        )
    )

class OperationHoursForm(forms.Form):
    OPERATION_HOURS = [
        ('full_time', 'FULL TIME (24 HOURS)'),
        ('part_time_day', 'DAY HOURS'),
        ('part_time_night', 'NIGHT HOURS'),
    ]

    operation_hours = forms.ChoiceField(
        label='Operation Hours',
        required = False,
        choices=OPERATION_HOURS,
        widget=forms.Select(
            attrs={'class':'form-control mr-sm-1'}
            )
    
    )

class ProprietorshipForm(forms.Form):
    PROPRIETOR = [
        ('public', 'GOVERNMENT OWNED'),
        ('private', 'PRIVATE OWNED'),
    ]

    proprietor = forms.ChoiceField(
        choices=PROPRIETOR,
        required = False,
        widget=forms.Select(
            attrs={'class':'form-control mr-sm-1'}
            )
    
    )



class WorkDistanceForm(forms.Form):
    work_distance = forms.IntegerField(
        label='Distance (KM) from Work Place Address',
        required = False,
        widget=forms.NumberInput(
            attrs={
                'class':'form-control mr-sm-1',
            }
        )
    )


class SpecialAddressForm(forms.ModelForm):

    work_address = forms.PointField(
        required=False,
        widget= forms.OSMWidget(
        attrs={
            'map_width': 600,
            'map_height': 300,
            'default_lat': -1.2921,
            'default_lon': 36.8219,
            'default_zoom': 12
            }
        )
    )

    class Meta:
        model = SpecialAddress
        fields = '__all__'

