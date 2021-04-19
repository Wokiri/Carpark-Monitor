from django.contrib.gis import forms
from django.contrib.auth.models import User


class UserSignupModelForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password']



