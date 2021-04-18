from django.contrib.gis import forms
from django.contrib.auth.models import User


class UserSignupModelForm(forms.ModelForm):

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
        model = User
        fields = ['username', 'password']

