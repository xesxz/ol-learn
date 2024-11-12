import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
// import VectorSource from 'ol/source/Vector'
// import VectorLayer from 'ol/layer/Vector'
import {Circle, Fill, Stroke, Style, Icon} from 'ol/style';

import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import MVT from 'ol/format/MVT.js';
// import {applyStyle} from "ol-mapbox-style";
const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        center: fromLonLat([-123.804, 45.523]), zoom: 5
    })
});



// var esriLayer = new VectorTileLayer({
//   source: new VectorTileSource({
//     format: new MVT(),
//     url: 'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/tile/{z}/{y}/{x}.pbf'
//   })
// });

var geoserverLayer = new VectorTileLayer({
  source: new VectorTileSource({
    format: new MVT(),
    url: 'http://192.168.31.16:8080/geoserver/gwc/service/tms/1.0.0/topp:states@EPSG:900913@pbf/{z}/{x}/{-y}.pbf'


  }),
});





map.addLayer(geoserverLayer)




