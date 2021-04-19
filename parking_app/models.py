from django.contrib.gis.db import models
from django.conf import settings

class SpecialAddress(models.Model):
    ADDRESS = [
        ('home_address', 'HOME ADDRESS'),
        ('work_address', 'WORK ADDRESS'),
    ]
    name = models.CharField(max_length=20, choices=ADDRESS)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    address = models.PointField(srid=4326)


class Carpark(models.Model):
    capacity = models.PositiveIntegerField(blank=True, null=True,)
    price = models.PositiveIntegerField(blank=True, null=True,)
    available_slots = models.PositiveIntegerField(blank=True, null=True,)

    PROPRIETOR = [
        ('public', 'GOVERNMENT OWNED'),
        ('private', 'PRIVATE OWNED'),
    ]
    proprietor = models.CharField(max_length=10, blank=True, null=True, choices=PROPRIETOR)

    OPERATION_HOURS = [
        ('full_time', 'FULL TIME (24 HOURS)'),
        ('part_time_day', 'DAY HOURS'),
        ('part_time_night', 'NIGHT HOURS'),
    ]
    operation_hours = models.CharField(max_length=20, blank=True, null=True, choices=OPERATION_HOURS)

    name = models.CharField(max_length=50)
    geom = models.PolygonField(srid=4326)

    def __str__(self): return self.name