import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import datas from './data.js';
import { Contour, smoothLines, isolines, isobands } from 'wcontour-js'
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Style, Stroke } from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
const tk = 'dc2c764abf8425baf4ac249b66fdeee3'; // Replace with your TianDiTu token
const vecLayer = new TileLayer({
  source: new XYZ({
    url: `http://t{0-7}.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tk}`,
  }),
});


const map = new Map({
  target: 'map',
  layers: [
    vecLayer
  ],
  view: new View({
    center: [104, 31],
    zoom: 5,
    projection: "EPSG:4326"
  })
});



// const gridOptions = {
//   xStart: 70,
//   xEnd: 140,
//   xDelta: 0.5,
//   yStart: 15,
//   yEnd: 55,
//   yDelta: 0.5,
//   xSize: 141,
//   ySize: 81,
// }
const gridOptions = {
  xStart: 70,
  xEnd: 140,
  xDelta: 0.5,
  yStart: 15,
  yEnd: 55,
  yDelta: 0.5,
  xSize: 141,
  ySize: 81,
}
const xs = []
const ys = []
for (let i = 0; i < gridOptions.xSize; i++) {
  xs.push(gridOptions.xStart + i * gridOptions.xDelta)
}
for (let i = 0; i < gridOptions.ySize; i++) {
  ys.push(gridOptions.yStart + i * gridOptions.yDelta)
}

  // 获取数据
  const data = datas.data

  const sichuan = {
    xStart: 97,    // Western boundary of Sichuan
    xEnd: 109,     // Eastern boundary of Sichuan
    yStart: 26,    // Southern boundary of Sichuan
    yEnd: 34,      // Northern boundary of Sichuan
  }

  // 计算对应的数组索引
  const startXIndex = Math.floor((sichuan.xStart - gridOptions.xStart) / gridOptions.xDelta)
  const endXIndex = Math.ceil((sichuan.xEnd - gridOptions.xStart) / gridOptions.xDelta)
  const startYIndex = Math.floor((sichuan.yStart - gridOptions.yStart) / gridOptions.yDelta)
  const endYIndex = Math.ceil((sichuan.yEnd - gridOptions.yStart) / gridOptions.yDelta)

  // 过滤数据，四川区域外的设为undefined
  const filteredData = data.map((row, y) =>
    row.map((value, x) => {
      if (x >= startXIndex && x <= endXIndex && y >= startYIndex && y <= endYIndex) {
        return value
      }
      return undefined
    })
  )



  // 创建等值线对象
  const contour = new Contour(filteredData, xs, ys, 999999)

    // 定义等值线的值
  const breaks = [263.15, 268.15, 273.15, 278.15, 283.15, 288.15, 293.15, 298.15, 303.15, 308.15, 313.15]

  // 生成等值线
  const contours = contour.tracingContourLines(breaks)
  smoothLines(contours)
  const lineFC = isolines(contours)

  console.log(lineFC);


  const lineLayer = new VectorLayer({
    source: new VectorSource({
      features: new GeoJSON().readFeatures(lineFC)
    }),
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255, 0, 0, 0.5)',
        width: 2
      })
    })
  })
  map.addLayer(lineLayer)
