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
  // style: createStyle,
  style: new Style({
    renderer(coordinate, state) {
      const ctx = state.context;
      const arr = coordinate[0][0];

      // 开始新的路径
      ctx.beginPath();

      // 绘制多边形路径
      arr.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });

      // 闭合路径
      ctx.closePath();

      // 设置内阴影
      ctx.shadowColor = 'rgba(0, 255, 0, 1)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // 设置填充颜色
      ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
      ctx.fill();

      // 设置边框
      ctx.strokeStyle = 'rgba(0, 0, 255, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();
    },
  })
});

// 将矢量图层添加到地图
map.addLayer(vectorLayer);
