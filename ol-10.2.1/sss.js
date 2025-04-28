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
import { getCenter } from 'ol/extent';
import XYZ from 'ol/source/XYZ';

// canvas 图层
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [104, 30],
    zoom: 6,
    projection: 'EPSG:4326',

  }),
});






    var Layer = new TileLayer({

      source:

      new XYZ({
        tileUrlFunction: (tileCoord) => {
          const z = tileCoord[0];
          const x = tileCoord[1]; // 原始 X 坐标
          const y = tileCoord[2] - 1; // 适配 TMS 标准的 Y 翻转（若需要）
          const xBlock = Math.floor(x / 100); // 计算分块目录名
          return `http://10.194.16.58:10020/tile_map/${z}/${xBlock}/${xBlock}_${y}.PNG`;
        }
      })

    //   new XYZ({
    // url: 'http://10.194.16.58:10020/tile_map/dlLightMap/{z}/{y}/{y}_{x}.PNG',
    // tileSize:1024,





    //   })
  });
  map.addLayer(Layer);
