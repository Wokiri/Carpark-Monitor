import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Style, Fill, Text, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import Select from "ol/interaction/Select";
import sync from "ol-hashed";

import ZoomSlider from "ol/control/ZoomSlider";

const sampleAnnotationsVectorGeoson = require('./annotation.json')
const sampleannotation_map = document.querySelector("#sampleannotation_map");
const mapcontent = document.getElementById("mapcontent");

const sampleAnnotationsVector = new VectorSource({
  features: new GeoJSON().readFeatures(sampleAnnotationsVectorGeoson, {
    extractGeometryName: true,
  }),
});

// sampleAnnotations visual style
const sampleAnnotationsPointStyle = (feature) => {
    return feature.values_.disease_status === "DKD"
      ? new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: "rgb(204, 0, 0)",
            }),
          }),
        })
      : new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: "rgb(0, 20, 26)",
            }),
          }),
        });
};

// sampleAnnotations layer
const sampleAnnotationsLayer = new VectorLayer({
  source: sampleAnnotationsVector,
  style: sampleAnnotationsPointStyle,
});

const sampleAnnotationsMap = new Map({
  target: sampleannotation_map,
  layers: [sampleAnnotationsLayer],
  view: new View({
    center: [0.25, -0.3],
    zoom: 30,
  }),
});

sampleAnnotationsMap.addControl(new ZoomSlider());

// sampleAnnotations selection option
const singleMapClick = new Select({
  layers: [sampleAnnotationsLayer],
}); //By default, this is module:ol/events/condition~singleClick. Other defaults are exactly what I need

// If region is selected get feature info, don't otherwise
const sampleAnnotationInfo = theFeature => {

    mapcontent.innerHTML = "";

    let layerAttributes = theFeature.getFeatures().array_[0];

    if (layerAttributes){
        let segmentDisplayName = layerAttributes.values_.segment_display_name;
        let textColor = layerAttributes.values_.disease_status === 'DKD' ? 'danger' : 'primary'
        let sampleStatus =
          layerAttributes.values_.disease_status === "DKD"
            ? "A sickly kidney"
            : "A healthy kidney";
        mapcontent.innerHTML = `
        <h4 class="text-center my-2 py-4"><small>Segment Display Name is: </small> ${segmentDisplayName}.</h4>
        <p class="text-${textColor} text-center lead font-weight-bold">${sampleStatus}</p>
        `;

    } else{
        mapcontent.innerHTML = `<h4 class="text-center text-warning my-2 py-4">Selection attempted outside sample annotation.</h4>`;
    }
};

sampleAnnotationsMap.addInteraction(singleMapClick);
singleMapClick.on("select", (elem) => {
  sampleAnnotationInfo(elem.target);
});

sync(sampleAnnotationsMap);