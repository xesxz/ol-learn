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

const map = new Map({
    target: 'map',
    layers: [


      new Tile({
        source: new XYZ({
          url:'http://10.1.64.154/DataServer?T=vec_w&x={x}&y={y}&l={z}',
          // projection:projection
        }),

      })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 3
    })
});









const tiffSource = new GeoTIFF({
  sources: [{
    // url: '/POSTGRES_ECMFC1D__TEM_1_0_20240526120000_00000_GLB_1_2.TIF',
    url:"/TEM_4326.tif"
  }],
});


function handlerColor(legend, scala, radio) {

  let color1 = ["case", ["!=", ["band", 2], 0]];
  let color = ["interpolate", ["linear"],
    ["band", 1]
  ];
  if (legend == null) {
    return null;
  }
  if (radio == 1) {


    for (let i = 0; i < legend.length; i++) {
      color = color.concat([legend[i][0] * scala, legend[i][1]]); // //console.log(legend[i]);
    }
    color1.push(color);
    color1.push(["color", 0, 0, 0, 0]);
    console.log("-----渐变-------------");
    // console.log(color);
    console.log(JSON.stringify(color1));
    //  color = color.concat([legend[i][0] * scala, legend[i][1]]); // //console.log(legend[i]);
  } else {

    const resultArray = [
      "case",
      ["==", ["band", 2], 0],
      ["color", 0, 0, 0, 0], // 定义范围之外的值的透明颜色
      ["<=", ["band", 1], legend[0][0] * scala],
      ["color", ...legend[0][1]],
    ];
    // for (let i = 0; i < legend.length; i++) {
    for (let i = 0; i < legend.length; i++) {
      const [value, color] = legend[i];
      const [value1, color1] =
      i >= legend.length - 1 ? legend[i] : legend[i + 1];
      resultArray.push(["between", ["band", 1], value * scala, value1 * scala]);
      // resultArray.push(["color", ...color1]);
      resultArray.push(["color", ...color]);
    }
    resultArray[resultArray.length] = [
      "color",
      ...legend[legend.length - 1][1],
    ];
    color1 = resultArray;
  }
  console.log("JSON.stringify(color1)");
  console.log(JSON.stringify(color1) );
  return color1;
}

const legend = [  [0, [0, 0, 0, 0]],
[0.1, [165, 242, 141]],
[10, [61, 189, 60]],
[25, [98, 184, 255]],
[50, [0, 2, 254]],
[100, [253, 0, 253]],
[250, [131, 0, 65]],

[260, [0, 2, 254]],
[270, [253, 0, 253]],
[290, [131, 0, 65]]]


console.log(handlerColor(legend,1,2));



const singleBand = {
  color: [
    'interpolate',
    ['linear'],
    // 直接使用单个波段的值
    ['band', 1],  // 或者 ['band', 0] 取决于您的数据索引是从0还是1开始
    // 颜色映射
    0, [0, 0, 0, 0],
    1, [15, 84, 10],
    2,  [163, 204, 89],
    3,  [128, 179, 71],
    4,  [97, 150, 54],
    5,  [15, 84, 10],     // 最大值，深绿色
    6,  [15, 84, 10],
  ],
};




const tiffLayer = new WebGLTileLayer({
  source: tiffSource,
  style:singleBand
});

map.addLayer(tiffLayer);



