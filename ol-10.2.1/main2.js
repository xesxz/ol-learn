import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {Circle, Fill, Stroke, Style, Icon} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON'
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import rbush from 'rbush';
import { getVectorContext, toContext } from "ol/render.js";
import Draw from 'ol/interaction/Draw';
import {getLength} from 'ol/sphere';
import Overlay from 'ol/Overlay';
import {Observable} from 'ol';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import {
  XYZ,
} from "ol/source";
import {
  Tile
} from "ol/layer";
// ... existing imports ...
import {Text} from 'ol/style';


const map = new Map({
    target: 'map',
    layers: [

      new Tile({
        source: new OSM()

      })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 3
    })
});



const tmpLegend = [
  [-36, [128, 0, 124]],
  [-32, [0, 47, 134]],
  [-28, [26, 92, 166]],
  [-24, [32, 117, 210]],
  [-20, [60, 160, 240]],
  [-16, [117, 207, 255]],
  [-12, [151, 255, 244]],
  [-8, [189, 249, 255]],
  [-4, [242, 255, 255]],
  [0, [223, 255, 217]],
  [4, [196, 255, 183]],
  [8, [186, 254, 131]],
  [12, [252, 254, 156]],
  [16, [255, 243, 196]],
  [20, [255, 220, 168]],
  [24, [255, 175, 117]],
  [28, [253, 135, 132]],
  [32, [236, 91, 95]],
  [35, [255, 51, 51]],
  [37, [201, 1, 1]],
  [40, [153, 51, 1]],
  [100, [71, 14, 0]],
  [1000, [255, 255, 0]],
];

const tmpLegend1 = [
  [-36, [128, 0, 124,0.5]],
  [-32, [0, 47, 134,0.5]],
  [-28, [26, 92, 166,0.5]],
  [-24, [32, 117, 210,0.5]],
  [-20, [60, 160, 240,0.5]],
  [-16, [117, 207, 255,0.5]],
  [-12, [151, 255, 244,0.5]],
  [-8, [189, 249, 255,0.5]],
  [-4, [242, 255, 255,0.5]],
  [0, [223, 255, 217,0.5]],
  [4, [196, 255, 183,0.5]],
  [8, [186, 254, 131,0.5]],
  [12, [252, 254, 156,0.5]],
  [16, [255, 243, 196,0.5]],
  [20, [255, 220, 168,0.5]],
  [24, [255, 175, 117,0.5]],
  [28, [253, 135, 132,0.5]],
  [32, [236, 91, 95,0.5]],
  [35, [255, 51, 51,0.5]],
  [37, [201, 1, 1,0.5]],
  [40, [153, 51, 1,0.5]],
  [100, [71, 14, 0,0.5]],
  [1000, [255, 255, 0,0.5]],
];





const PRE  = [
  [0, [255, 255, 255, 0]],
  [0.1, [165, 242, 141]],
  [10, [61, 189, 60]],
  [25, [98, 184, 255]],
  [50, [0, 2, 254]],
  [100, [253, 0, 253]],
  [250, [131, 0, 65]],
]



const tiffSource = new GeoTIFF({
  normalize: false,
  sources: [{
    url:"/NAFP_NWFP_SPCC__ER03_1_0_20241115080000_24_0_24H.tif"
    // url:"/NAFP_GRID_ANA_REALTIME_HOR_CHN__2TEM_103_2_20241112090000_0_0.tif",
    // url:"/333.tif"
    //url:"http://10.194.90.150:9001/GEO_LAYER/NAFP/NWFD/SPCC/BCCD/2024/20241117/TEM/NAFP_NWFP_SPCC__TEM_103_2_20241117080000_3_0.tif"
  }],

});


function getColor(config) {
  const interpolateArray = ['interpolate', ['linear'], ['band', 1]];

  config.forEach(([value, color]) => {
    interpolateArray.push(value);
    interpolateArray.push(color);
  });
  return interpolateArray;
}


const tiffLayer = new WebGLTileLayer({
  source: tiffSource,
  style:{
    // color: getColor(tmpLegend1),
    color: getColor(PRE)
  },

});

map.addLayer(tiffLayer)








