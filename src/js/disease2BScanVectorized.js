import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import sync from "ol-hashed";
import ZoomSlider from "ol/control/ZoomSlider";

import { geo_webMercator, roundoff } from "./parameters";

const disease2BScan_map = document.getElementById("disease2BScan_map");
const overlay_popup = document.getElementById("popup");
const overlay_content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

// disease2BScanVectorized visual style
const cellsSpatialFeatureStyle = (feature) => {
  return new Style({
    fill: new Fill({
      color: "rgb(255, 255, 255)",
    }),
    stroke: new Stroke({
      color: "rgb(153, 255, 221)",
      width: 2,
    }),
    // text: cellRegionsTextStyle(feature),
  });
};

// disease2BScanVectorized vector
const disease2BScanVector = new VectorSource({
  features: new GeoJSON().readFeatures(disease2BScanVectorized_geojson, {
    extractGeometryName: true,
  }),
});


// disease2BScanVectorized layer
const disease2BScanLayer = new VectorLayer({
  source: disease2BScanVector,
  style: cellsSpatialFeatureStyle,
});

// disease2BScanVectorized Overlay
const theOverlay = new Overlay({
  element: overlay_popup,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = () => {
  theOverlay.setPosition(undefined);
  closer.blur();
  return false;
};

const disease2bscanMap = new Map({
	target: disease2BScan_map,
	layers: [disease2BScanLayer],
	overlays: [theOverlay],
	view: new View({
		center: [disease2BmapLon, disease2BmapLat],
		zoom: parseFloat(disease2BmapZoom),
	}),
})

disease2bscanMap.addControl(new ZoomSlider());

// If region is selected get feature info, don't otherwise
const bringLayerPopupInfo = (theFeature) => {
  let layerAttributes = theFeature.getFeatures().array_[0];

  if (layerAttributes) {
    overlay_content.innerHTML = `
    <p class='text-center'>Name: <span class='text-primary lead'>${layerAttributes.values_.name}</span></p>
    <a class="btn btn-outline-info my-0" href='/edit-disease2bscan-vector/${layerAttributes.values_.pk}'>Edit</a>
    <a class="btn btn-outline-danger my-0" href='/delete-disease2bscan-vector/${layerAttributes.values_.pk}'>Delete</a>
    `
  }
};

// sampleAnnotations selection option
const singleMapClick = new Select({
  layers: [disease2BScanLayer],
}); //By default, this is module:ol/events/condition~singleClick. Other defaults are exactly what I need

disease2bscanMap.addInteraction(singleMapClick);

singleMapClick.on("select", (elem) => {
  bringLayerPopupInfo(elem.target);
});

disease2bscanMap.on("singleclick", (evt) => {
  let click_coords = evt.coordinate;
  theOverlay.setPosition(click_coords);
  let lon = click_coords[0];
  let lat = click_coords[1];
  let coords_webmercator = geo_webMercator(lon, lat);
  let x_coords = coords_webmercator[0] / 1000; // I had georeferenced the image by expanding extents by 1000
  let y_coords = coords_webmercator[1] / 1000;
  overlay_content.innerHTML = `<p>${roundoff(x_coords, 2)}, ${roundoff(y_coords, 2)}</p>`;
});

sync(disease2bscanMap);
