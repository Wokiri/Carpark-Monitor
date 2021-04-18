import "ol/ol.css";
import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Style, Fill, Text, Stroke } from "ol/style";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import Select from "ol/interaction/Select";
import sync from "ol-hashed";

const locationdemo_map = document.querySelector("#locationdemo_map");
const mapcontent = document.getElementById("mapcontent");

// This json files were used for testing during dev mode. The actual app fetches these from a database
const nairobiConstituenciesjson = require("./NairobiConstituencies.json");
const storeCustomersjson = require("./RetailStoreCustomers.json");


const nairobiConstituenciesVector = new VectorSource({
  features: new GeoJSON().readFeatures(nairobiConstituenciesjson, {
    // dataProjection: 'EPSG:4326',
    // featureProjection: 'EPSG:3857',
    extractGeometryName: true,
  }),
});

const storeCustomersVector = new VectorSource({
  features: new GeoJSON().readFeatures(storeCustomersjson, {
    // dataProjection: 'EPSG:4326',
    // featureProjection: 'EPSG:3857',
    extractGeometryName: true,
  }),
});

const constituenciesTextLabel = (feature) => `${feature.get("name")}`;

const constituenciesTextStyle = (feature) =>
  new Text({
    textAlign: "center",
    textBaseline: "middle",
    font: `light 16px "Trebuchet MS", Helvetica, sans-serif`,
    text: constituenciesTextLabel(feature),
    placement: "polygon",
    fill: new Fill({
      color: "rgb(0, 0, 0)",
    }),
  });

const constituenciesPolygonStyle = (feature) => {
  return new Style({
    fill: new Fill({
      color: "rgb(230, 230, 230)",
    }),
    stroke: new Stroke({
      color: "rgb(255, 255, 255)",
      width: 1,
    }),
    text: constituenciesTextStyle(feature),
  });
};

// constituencies layer
const constituenciesLayer = new VectorLayer({
    source: nairobiConstituenciesVector,
    style: constituenciesPolygonStyle,
});

const customersPointStyle = (feature) => {
  return new Style({
    image: new CircleStyle({
      radius: 2,
      fill: new Fill({ color: "rgb(102, 0, 102)" }),
    }),
  });
};

// Customer layer
const customerLayer = new VectorLayer({
  source: storeCustomersVector,
  style: customersPointStyle,
});

const locationDemoMap = new Map({
  target: locationdemo_map,
  layers: [constituenciesLayer, customerLayer],
  view: new View({
    center: [36.8166667, -1.2833333],
    zoom: 27.85,
  }),
});

// Constituencies selection option
const singleMapClick = new Select({
  layers: [constituenciesLayer],
}); //By default, this is module:ol/events/condition~singleClick. Other defaults are exactly what I need

// If region is selected get feature info, don't otherwise
const bringLayerPopupInfo = theFeature => {

    mapcontent.innerHTML = "";

    let layerAttributes = theFeature.getFeatures().array_[0];

    if (layerAttributes){
        let constituencyName = layerAttributes.values_.name;
        let constituencyPK = layerAttributes.values_.pk;
        mapcontent.innerHTML = `
        <h4 class="text-center my-2 pt-2">${constituencyName} Constituency</h4>
        <ul class="nav justify-content-center m-0 pb-3">
          <li class="nav-item">
            <button type="button" class="btn btn-outline-primary p-0"><a class="nav-link" href="../constituency/${constituencyPK}">Customers in Constituency</a></button>
          </li>
        </ul>
        `;

    } else{
        mapcontent.innerHTML = `<h5 class='display-5 text-center text-warning my-2 pt-5 pb-4'>Selection attempted outside demo scope</h5>`;
    }
};

locationDemoMap.addInteraction(singleMapClick);
singleMapClick.on("select", elem => {
  bringLayerPopupInfo(elem.target);
})

sync(locationDemoMap);