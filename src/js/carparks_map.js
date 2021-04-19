import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Style, Fill, Text, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import Select from "ol/interaction/Select";
import Overlay from "ol/Overlay";
import sync from "ol-hashed";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { ZoomSlider } from "ol/control";

const carpark_div = document.getElementById("carpark_map");
const carpark_popup = document.getElementById("carpark_popup");
const carpark_PopupContent = document.getElementById("carpark_PopupContent");
const carpark_popupcloser = document.getElementById("carpark_popupcloser");

const CarparkVector = new VectorSource({
  features: new GeoJSON().readFeatures(carparks_geojson, {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
    extractGeometryName: true,
  }),
});

// carpark visual style
const carparkTextLabel = feature => `${feature.get("name")}`;
const carparkAvailableSlots = feature => feature.get("available_slots");

const carparkTextStyle = feature =>
  new Text({
    textAlign: "center",
    textBaseline: "middle",
    font: `light 16px "Trebuchet MS", Helvetica, sans-serif`,
    text: carparkTextLabel(feature),
    placement: "polygon",
    fill: new Fill({
      color: "rgb(0, 0, 0)",
    }),
  });

const carparkPolygonStyle = feature => {
  if (carparkAvailableSlots(feature) <= 10) {
    return new Style({
      fill: new Fill({
        color: "rgb(255, 0, 191)",
      }),
      stroke: new Stroke({
        color: "rgb(64, 51, 0)",
        width: 2,
      }),
      text: carparkTextStyle(feature),
      updateWhileAnimating: true, // optional, for instant visual feedback
      updateWhileInteracting: true, // optional, for instant visual feedback
    });
  } else {
    return new Style({
      fill: new Fill({
        color: "rgb(0, 230, 230)",
      }),
      stroke: new Stroke({
        color: "rgb(0, 77, 77)",

        width: 2,
      }),
      text: carparkTextStyle(feature),
      updateWhileAnimating: true, // optional, for instant visual feedback
      updateWhileInteracting: true, // optional, for instant visual feedback
    });
  }
};

const OpenStreetMapLayer = new TileLayer({
  title: "OpenStreetMap",
  type: "base",
  opacity: OpenStreetMap_Opacity,

  source: new XYZ({
    attributions: " ",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  }),
});

// carpark layer
const CarparkLayer = new VectorLayer({
  source: CarparkVector,
  style: carparkPolygonStyle,
});

const theOverlay = new Overlay({
  element: carpark_popup,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

carpark_popupcloser.onclick = () => {
  theOverlay.setPosition(undefined);
  carpark_popupcloser.blur();
  return false;
};

const carpark_map = new Map({
  target: carpark_div,
  layers: [OpenStreetMapLayer, CarparkLayer],
  overlays: [theOverlay],
  view: new View({
    maxZoom: 28,
    minZoom: 1,
  }),
});

const mapExtent = CarparkLayer.getSource().getExtent();
carpark_map.getView().fit(mapExtent, carpark_map.getSize());


carpark_map.addControl(new ZoomSlider());

// If region is selected get feature info, don't otherwise
const populate_PopupContent = theFeature => {
  carpark_PopupContent.innerHTML = `
    <p class='text-center'>Name: <span class='text-primary lead'>${theFeature.name}</span></p>
    <p class='text-center'>Available Slots: <span class='text-primary lead'>${theFeature.available_slots}</span></p>
    <a class="btn btn-outline-info my-0" href='/carpark-detail/${theFeature.pk}'>Park Details</a>
    `;
};

// sampleAnnotations selection option
const singleMapClick = new Select({
  layers: [CarparkLayer],
}); //By default, this is module:ol/events/condition~singleClick. Other defaults are exactly what I need

carpark_map.addInteraction(singleMapClick);

let selected = null;
carpark_map.on("singleclick", evt => {
  carpark_map.forEachFeatureAtPixel(evt.pixel, layer => {
    selected = layer;
  });

  if (selected) {
    let click_coords = evt.coordinate;
    theOverlay.setPosition(click_coords);
    console.log(selected.values_);
    populate_PopupContent(selected.values_);
    selected = null;
  } else {
    theOverlay.setPosition(undefined);
    carpark_popupcloser.blur();
  }
});

sync(carpark_map);
