import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import datas from './data.js';
import { Contour, smoothLines, isolines, isobands } from 'wcontour-js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Style, Stroke } from 'ol/style.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { fromLonLat } from 'ol/proj.js';
import Feature from 'ol/Feature.js';
import LineString from 'ol/geom/LineString.js';
const tk = 'dc2c764abf8425baf4ac249b66fdeee3'; // Replace with your TianDiTu token
const vecLayer = new TileLayer({
  source: new XYZ({
    url: `http://t{0-7}.tianditu.gov.cn/vec_w/wmts?layer=vec&style=default&tilematrixset=w&Service=WMTS&Request=GetTile&Version=1.0.0&Format=tiles&TileMatrix={z}&TileCol={x}&TileRow={y}&tk=${tk}`,
  }),
});

// const map = new Map({
//   target: 'map',
//   layers: [
//     vecLayer
//   ],
//   view: new View({
//     center: [104, 31],
//     zoom: 5,
//     projection: "EPSG:4326"
//   })
// });

import temperatureGridData from './temperatureGrid.js';

class ContourMap {
  constructor() {
    this.initMap();
    this.initLayers();
    this.initInteractions();
    this.bindEvents();
  }

  initMap() {
    // 初始化地图
    this.map = new Map({
      target: 'map',
      layers: [vecLayer],
      view: new View({
        center: fromLonLat([116, 40]), // 北京附近
        zoom: 8,
      }),
    });
  }

  initLayers() {
    // 初始化等值线图层
    this.contourSource = new VectorSource();
    this.contourLayer = new VectorLayer({
      source: this.contourSource,
      style: (feature) => {
        return new Style({
          stroke: new Stroke({
            color: this.getColorForValue(feature.get('value')),
            width: 2,
          }),
        });
      },
    });
    this.map.addLayer(this.contourLayer);
  }

  initInteractions() {
    // 添加鼠标悬停交互
    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature,
      );

      const infoElement = document.getElementById('hover-info');
      if (feature) {
        const value = feature.get('value');
        infoElement.innerHTML = `温度: ${value.toFixed(1)}°C`;
      } else {
        infoElement.innerHTML = '';
      }
    });
  }

  bindEvents() {
    // 绑定更新按钮事件
    document.getElementById('updateContours').addEventListener('click', () => {
      this.updateContours();
    });
  }

  getColorForValue(value) {
    // 根据温度值返回颜色
    const colors = [
      { temp: 20, color: '#0000ff' },
      { temp: 22, color: '#00ff00' },
      { temp: 24, color: '#ff0000' },
    ];

    for (let i = 0; i < colors.length - 1; i++) {
      if (value <= colors[i + 1].temp) {
        return colors[i].color;
      }
    }
    return colors[colors.length - 1].color;
  }

  generateContours() {
    // 准备数据
    const data = temperatureGridData.data.flat();
    const cols = temperatureGridData.cols;
    const rows = temperatureGridData.rows;
    const xmin = temperatureGridData.bounds[0];
    const xmax = temperatureGridData.bounds[2];
    const ymin = temperatureGridData.bounds[1];
    const ymax = temperatureGridData.bounds[3];

    // 使用 wcontour-js 生成等值线
    const interval = 1;
    const minTemp = Math.min(...data);
    const maxTemp = Math.max(...data);
    const values = [];
    for (let v = Math.ceil(minTemp); v <= maxTemp; v += interval) {
      values.push(v);
    }

    // 生成等值线
    const result = isolines(
      data,
      rows,
      cols,
      xmin,
      xmax,
      ymin,
      ymax,
      values,
      true  // 是否平滑
    );

    // 转换为 OpenLayers features
    const contours = [];
    result.forEach(line => {
      const coords = line.coordinates.map(coord => fromLonLat([coord[0], coord[1]]));
      const feature = new Feature({
        geometry: new LineString(coords),
        value: line.value
      });
      contours.push(feature);
    });

    return contours;
  }

  updateContours() {
    this.contourSource.clear();
    const contours = this.generateContours();
    this.contourSource.addFeatures(contours);
  }
}

// 创建应用实例
const app = new ContourMap();
app.updateContours();
