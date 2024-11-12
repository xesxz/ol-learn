import './style.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Vector from 'ol/source/Vector.js';
import View from 'ol/View.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

console.log(123123);



const vectorSource = new Vector({
  url: 'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
  format: new GeoJSON(),
  wrapX: true,
});



const pointsLayer = new WebGLPointsLayer({
  source: vectorSource,
  // style: {
  //   symbol: {
  //     symbolType: 'circle',
  //     size: 8,
  //     color: 'rgb(255, 0, 0)',
  //     opacity: 0.2,
  // },

  // },
  style:{
    "icon-src": "https://openlayers.org/en/latest/examples/data/icon.png",
    "icon-width": 18,
    "icon-height": 28,
    "icon-color": "lightyellow",
    "icon-rotate-with-view": false,
    "icon-displacement": [
      0,
      9
    ]
  }
});


map.addLayer(pointsLayer)
