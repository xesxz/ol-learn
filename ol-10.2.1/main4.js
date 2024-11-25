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

// canvas 图层
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
// const transformedPoint = fromLonLat([104.065735,30.659462]);
const transformedPoint = [
  11584281.947892305,
  3588651.295296001
]
// const canvasLayer = new ImageLayer({
//   source: new ImageCanvas({
//     canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
//       const canvas = document.createElement('canvas');
//       canvas.width = size[0];
//       canvas.height = size[1];
//       const ctx = canvas.getContext('2d');

//       // 计算点在当前视图中的位置
//       const [x, y] = [
//         ((transformedPoint[0] - extent[0]) / resolution) * pixelRatio,
//         ((extent[3] - transformedPoint[1]) / resolution) * pixelRatio
//       ];

//       // 绘制点
//       ctx.beginPath();
//       ctx.arc(x, y, 5, 0, 2 * Math.PI);
//       ctx.fillStyle = 'red';
//       ctx.fill();

//       return canvas;
//     },
//     ratio: 1
//   }),
// });

// 添加动画相关变量
let animationFrame;
let radius = 5;
const maxRadius = 30;
const animationSpeed = 0.5;

const canvasLayer = new ImageLayer({
  source: new ImageCanvas({
    canvasFunction: function (extent, resolution, pixelRatio, size, projection) {
      const canvas = document.createElement('canvas');
      canvas.width = size[0];
      canvas.height = size[1];
      const ctx = canvas.getContext('2d');

      // 计算点在当前视图中的位置
      const [x, y] = [
        ((transformedPoint[0] - extent[0]) / resolution) * pixelRatio,
        ((extent[3] - transformedPoint[1]) / resolution) * pixelRatio
      ];

      // 绘制扩散动画效果
      // 外圈扩散圆
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.stroke();

      // 第二个扩散圆
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.7, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fill();

      // 中心实心点
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();

      // 更新半径
      radius += animationSpeed;
      if (radius > maxRadius) {
        radius = 5;
      }

      // 请求重绘
      animationFrame = requestAnimationFrame(() => {
        canvasLayer.getSource().refresh();
      });

      return canvas;
    },
    ratio: 1
  }),
});
map.addLayer(canvasLayer);

map.on('click',(moment) => {
  console.log(moment);

})


map.getAllLayers().forEach(layer => {
  console.log(layer);
})
