import os
from django.contrib.gis.utils import LayerMapping

from .models import Carpark


carpark_path = os.path.join(
    os.getcwd(), 'spatial_data', 'car_parks.shp'
)

# Auto-generated `LayerMapping` dictionary for Carpark model
carpark_mapping = {
    'name': 'name',
    'geom': 'POLYGON',
}


def run(verbose=True):
    layermap = LayerMapping(
        Carpark,
        carpark_path,
        carpark_mapping,
        transform=False #the shapeﬁle is already in WGS84 (SRID=4326)
    )
    layermap.save(strict=True,verbose=verbose)