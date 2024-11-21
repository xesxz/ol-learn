import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Style, Stroke,Text, Fill} from 'ol/style';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
;
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});




const createStyle = (feature) => {
  return new Style({
      stroke: new Stroke({
          color: '#0000ff',
          width: 2
      }),
      fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
      }),
      text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({
              color: '#000'
          }),
          stroke: new Stroke({
              color: '#fff',
              width: 3
          }),
          text: feature.get('name') // 显示名称属性
      })
  });
};

// 加载GeoJSON数据
const vectorSource = new VectorSource({
  url: 'https://geo.datav.aliyun.com/areas_v3/bound/510000_full.json', // 替换为您的GeoJSON文件路径
  format: new GeoJSON()
});

// 创建矢量图层
const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: createStyle
});

// 将矢量图层添加到地图
map.addLayer(vectorLayer);
