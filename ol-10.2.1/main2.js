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
        source: new OSM()

      })
    ],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 3
    })
});






// const tiffSource = new GeoTIFF({
//   sources: [
//     {
//       url: '/NAFP_GRID_ANA_REALTIME_HOR_CHN__2TEM_103_2_20241112090000_0_0.tif',
//       // overviews: ['https://openlayers.org/data/raster/no-overviews.tif.ovr'],
//     },
//   ],
// });


const singleBand = {
  color: [
    'interpolate',
    ['linear'],
    ['band', 1],
    0, [0, 0, 0, 0],
    1, [15, 84, 10],
    2,  [163, 204, 89],
    3,  [128, 179, 71],
    4,  [97, 150, 54],
    5,  [15, 84, 10],
    6,  [15, 84, 10],
  ],
};


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
const tiffSource = new GeoTIFF({
  normalize: false,

  // convertToRGB: true, // 将多波段数据转换为 RGB
  // bands: [1], // 选择波段
  sources: [{
    // url: '/POSTGRES_ECMFC1D__TEM_1_0_20240526120000_00000_GLB_1_2.TIF',
    // url:"/GDFS_NMC_AMEL_OEFS_TMP01_ACHN_LNO_G005_20241112080007201_103_2_1.tif",
    url:"/NAFP_GRID_ANA_REALTIME_HOR_CHN__2TEM_103_2_20241112090000_0_0.tif",
    // allowFullFile: true  // 允许加载完整文件而不是范围请求
    // url:"/TEM_4326.tif"
  }],
  style:{
    color:getColor(tmpLegend)
  },
});




console.log(getColor(tmpLegend));



// console.log(getColor(tmpLegend));








function getColor(config) {
  // 初始化插值数组
  const interpolateArray = ['interpolate', ['linear'],  ['band', 1]];

  // 遍历配置数组,将每组值展开添加到插值数组中
  config.forEach(([value, color]) => {
    interpolateArray.push(value);
    interpolateArray.push(color);
  });

  return interpolateArray;
}




const tiffLayer = new WebGLTileLayer({
  source: tiffSource,

});

map.addLayer(tiffLayer);



//  const view =  tiffSource.getView()
//  map.setView(view);


