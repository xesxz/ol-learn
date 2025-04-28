
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Style, Stroke,Text, Fill} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { XYZ } from 'ol/source';

const view = new View({
  center: [104.06, 30.67],
  zoom: 7,
  projection: 'EPSG:4326'
})

const map = new Map({
  target: 'map',
  layers: [

  ],
  view
});

const map1 = new Map({
  target: 'map1',
  layers: [

  ],
  view
});




const tk = 'b1298a7b61cc7d9dd7d9ca6635705581'
const TDTImgPreload = new TileLayer({
  title: "天地图影像图层",
 preload: Infinity,
source: new XYZ({
 url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + tk,
attibutions: "天地图影像描述",
 crossOrigin: "anoymous",
 wrapX: false
 })
  })
  const TDTImg = new TileLayer({
    title: "天地图影像图层",
  source: new XYZ({
   url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=" + tk,
  attibutions: "天地图影像描述",
   crossOrigin: "anoymous",
   wrapX: false
   })
    })

  map.addLayer(TDTImgPreload);
  map1.addLayer(TDTImg);
