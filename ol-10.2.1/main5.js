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




const addRegion3DLayer = (geojsonData) => {
  const format = new GeoJSON();
  const features = format.readFeatures(geojsonData, {
    featureProjection: 'EPSG:3857'
  });

  const canvasLayer = new ImageLayer({
    source: new ImageCanvas({
      canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
        const canvas = document.createElement('canvas');
        canvas.width = size[0];
        canvas.height = size[1];
        const ctx = canvas.getContext('2d');

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        features.forEach(feature => {
          const geometry = feature.getGeometry();
          const coordinates = geometry.getCoordinates()[0];

          // 转换坐标为像素坐标
          const pixels = coordinates.map(coord => [
            ((coord[0] - extent[0]) / resolution) * pixelRatio,
            ((extent[3] - coord[1]) / resolution) * pixelRatio
          ]);

          // 1. 首先绘制主要区域
          ctx.beginPath();
          ctx.moveTo(pixels[0][0], pixels[0][1]);
          for (let i = 1; i < pixels.length; i++) {
            ctx.lineTo(pixels[i][0], pixels[i][1]);
          }
          ctx.closePath();

          // 2. 设置渐变和填充
          const center = getCenter(geometry.getExtent());
          const centerPixel = [
            ((center[0] - extent[0]) / resolution) * pixelRatio,
            ((extent[3] - center[1]) / resolution) * pixelRatio
          ];

          const gradient = ctx.createRadialGradient(
            centerPixel[0], centerPixel[1], 0,
            centerPixel[0], centerPixel[1], 100
          );
          gradient.addColorStop(0, 'rgba(65, 105, 225, 0.8)');
          gradient.addColorStop(1, 'rgba(30, 144, 255, 0.6)');

          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 0, 0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        return canvas;
      },
      ratio: 1.5
    })
  });

  map.addLayer(canvasLayer);
  map.getView().fit(features[0].getGeometry().getExtent(), {});
};



// addRegion3DLayer(data)


const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              104.00121353288426,
              30.788621070025272
            ],
            [
              104.00121353288426,
              30.54131916435705
            ],
            [
              104.45197344510746,
              30.54131916435705
            ],
            [
              104.45197344510746,
              30.788621070025272
            ],
            [
              104.00121353288426,
              30.788621070025272
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}


addRegion3DLayer(geojsonData)
