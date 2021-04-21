from django.contrib import admin

from .models import (
    SpecialAddress,
    Carpark,
)

# Register your models here.
admin.site.register(SpecialAddress)
admin.site.register(Carpark)