import './style.css';
import GeoJSON from 'ol/format/GeoJSON.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import Vector from 'ol/source/Vector.js';
import View from 'ol/View.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import ImageLayer from 'ol/layer/Image.js';
import ImageCanvas from 'ol/source/ImageCanvas.js';
import { fromLonLat } from 'ol/proj';  // 添
import HeatmapLayer from 'ol/layer/Heatmap.js';
import { Vector as VectorSource } from 'ol/source';
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import hotSpotData from './hotSpotData.json'
// canvas 图层
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [104, 31],
    zoom: 5,
    projection: "EPSG:4326"
  }),
});

console.log(hotSpotData.data);


const rawData = hotSpotData.data



const heatmapLayer = new HeatmapLayer({
  source: new VectorSource({
    features: getfeatures(rawData),  // 使用转换后的特征
  }),
  blur: 35,  // 设置模糊度
  radius: 5,  // 设置半径
});

// 将热力图图层添加到地图
map.addLayer(heatmapLayer);

function getfeatures(rawData){
return  rawData.map(item  => {
    return new Feature({
      geometry: new Point(item)
    });
  })

}

