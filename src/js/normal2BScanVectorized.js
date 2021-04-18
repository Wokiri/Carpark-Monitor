import 'ol/ol.css'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import { Style, Fill, Stroke } from 'ol/style'
import VectorLayer from 'ol/layer/Vector'
import { Map, View } from 'ol'
import Select from 'ol/interaction/Select'
import Overlay from 'ol/Overlay'
import sync from 'ol-hashed'
import ZoomSlider from 'ol/control/ZoomSlider'

import { geo_webMercator, roundoff } from './parameters'

const normal2BScan_map = document.getElementById('normal2BScan_map')
const normal2Bpopup = document.getElementById('normal2Bpopup')
const normal2BPopupContent = document.getElementById('normal2BPopupContent')
const normal2Bpopupcloser = document.getElementById('normal2Bpopupcloser')


const normal2BScanVector = new VectorSource({
	features: new GeoJSON().readFeatures(normal2BScanVectorized_geojson, {
		extractGeometryName: true,
	}),
})

// normal2BScanVectorized visual style
const normal2BScanFeatureStyle = feature => {
	return new Style({
		fill: new Fill({
			color: 'rgb(255, 255, 255)',
		}),
		stroke: new Stroke({
			color: 'rgb(153, 255, 221)',
			width: 2,
		}),
		// text: cellRegionsTextStyle(feature),
	})
}

// normal2BScanVectorized layer
const normal2BScanLayer = new VectorLayer({
	source: normal2BScanVector,
	style: normal2BScanFeatureStyle,
})

// normal2BScanVectorized Overlay
const theOverlay = new Overlay({
	element: normal2Bpopup,
	autoPan: true,
	autoPanAnimation: {
		duration: 250,
	},
})

normal2Bpopupcloser.onclick = () => {
	theOverlay.setPosition(undefined)
	normal2Bpopupcloser.blur()
	return false
}

const normal2BscanMap = new Map({
	target: normal2BScan_map,
	layers: [normal2BScanLayer],
	overlays: [theOverlay],
	view: new View({
		center: [normal2BmapLon, normal2BmapLat],
		zoom: parseFloat(normal2BmapZoom),
	}),
})

normal2BscanMap.addControl(new ZoomSlider())

// If region is selected get feature info, don't otherwise
const bringLayerPopupInfo = theFeature => {
	let layerAttributes = theFeature.getFeatures().array_[0]

	if (layerAttributes) {
		normal2BPopupContent.innerHTML = `
    <p class='text-center'>Name: <span class='text-primary lead'>${layerAttributes.values_.name}</span></p>
    <a class="btn btn-outline-info my-0" href='/edit-normal2Bscan-vector/${layerAttributes.values_.pk}'>Edit</a>
    <a class="btn btn-outline-danger my-0" href='/delete-normal2Bscan-vector/${layerAttributes.values_.pk}'>Delete</a>
    `
	}
}

// sampleAnnotations selection option
const singleMapClick = new Select({
	layers: [normal2BScanLayer],
}) //By default, this is module:ol/events/condition~singleClick. Other defaults are exactly what I need

normal2BscanMap.addInteraction(singleMapClick)

singleMapClick.on('select', elem => {
	bringLayerPopupInfo(elem.target)
})

normal2BscanMap.on('singleclick', evt => {
	let click_coords = evt.coordinate
	theOverlay.setPosition(click_coords)
	let lon = click_coords[0]
	let lat = click_coords[1]
	let coords_webmercator = geo_webMercator(lon, lat)
	let x_coords = coords_webmercator[0] / 1000 // I had georeferenced the image by expanding extents by 1000
	let y_coords = coords_webmercator[1] / 1000
	normal2BPopupContent.innerHTML = `<p>${roundoff(x_coords, 2)}, ${roundoff(y_coords, 2)}</p>`
})

sync(normal2BscanMap)
