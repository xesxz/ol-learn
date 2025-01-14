import './style.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Vector from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';
import View from 'ol/View.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import ImageLayer from 'ol/layer/Image.js';
import ImageCanvas from 'ol/source/ImageCanvas.js';
import { fromLonLat } from 'ol/proj';  // 添
import { getCenter } from 'ol/extent';
import { Fill, Stroke, Style } from 'ol/style';
import Crop from 'ol-ext/filter/Crop';
// canvas 图层
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});




const addRegion3DLayer = (geojsonData) => {
  const format = new GeoJSON();
  const features = format.readFeatures(geojsonData, {
    featureProjection: 'EPSG:3857'
  });

const canvasLayer = new VectorLayer({
  source: new Vector({
    features: features
  }),

});

var mask = new Crop({
  feature: canvasLayer.getSource().getFeatures()[0],
  fill: new Fill({
    // color: [0, 0, 0, 0.5],
    color: [255, 255, 255, 1],
  }),
  shadowWidth:3,
  shadowColor:'#3388ff',
});



  map.addLayer(canvasLayer);
  canvasLayer.addFilter(mask);
  map.getView().fit(features[0].getGeometry().getExtent(), {
    padding: [100, 100, 100, 100]
  });
};



// addRegion3DLayer(data)


const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              104.00121353288426,
              30.788621070025272
            ],
            [
              104.00121353288426,
              30.54131916435705
            ],
            [
              104.45197344510746,
              30.54131916435705
            ],
            [
              104.45197344510746,
              30.788621070025272
            ],
            [
              104.00121353288426,
              30.788621070025272
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}


addRegion3DLayer(geojsonData)
