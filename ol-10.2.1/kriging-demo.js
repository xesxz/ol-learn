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
import { train, grid as gridaa,plot } from '@sakitam-gis/kriging';
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
    zoom: 2,
    projection: "EPSG:4326"
  }),
});



let params={
  mapCenter:[116,34],
  maxValue:100,
  krigingModel:'exponential', // 'exponential':指数  'gaussian':高斯,'spherical':球体
  krigingSigma2:0,
  krigingAlpha:100,
  canvasAlpha:1, //canvas图层透明度
  colors:[
      "#006837",
      "#1a9850",
      "#66bd63",
      "#a6d96a",
      "#d9ef8b",
      "#ffffbf",
      "#fee08b",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026"],
};

//绘制kriging插值图
let canvasLayer=null;
const drawKriging=()=>{
    let values=[23,54,11,34,32,67],
        lngs=[116.32,116.30943,116.2224,116.32432,116.633432,116.12342],
        lats=[34.32,34.544,34.0023,34.5445,34.768,34.005];
    if (values.length>3){
        let variogram=train(values,lngs,lats,params.krigingModel,params.krigingSigma2,params.krigingAlpha);
        let polygons=[[[116,34],[116,35],[117,35],[117,34]]];
        let grid=gridaa(polygons,variogram,(117-116)/200);
        //移除已有图层
        if (canvasLayer !== null){
            map.removeLayer(canvasLayer);
        }
        //创建新图层
        canvasLayer=new ImageLayer({
            source: new ImageCanvas({
                canvasFunction:(extent, resolution, pixelRatio, size, projection) =>{
                    let canvas = document.createElement('canvas');
                    canvas.width = size[0];
                    canvas.height = size[1];
                    canvas.style.display='block';
                    //设置canvas透明度
                    canvas.getContext('2d').globalAlpha=params.canvasAlpha;
                    //使用分层设色渲染
                    plot(canvas,grid,[extent[0],extent[2]],[extent[1],extent[3]],params.colors);
                    return canvas;
                },
                projection: 'EPSG:4326'
            })
        })
        //向map添加图层
        map.addLayer(canvasLayer);
    }else {
        alert("有效样点个数不足，无法插值");
    }
}
        drawKriging();
