
// import { GeoTIFF } from 'ol/source';
import { useEffect } from 'react';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import {apply} from 'ol-mapbox-style';
import {fromLonLat} from 'ol/proj';

export default function Wms() {
  let map = null;

useEffect(()=>{
initMap()
},[])


function initMap(){

  map = new Map({
    target: 'map',
    layers: [new TileLayer({
      source: new OSM()
  })],
    view: new View({ center:fromLonLat([104, 31]) , zoom: 6,  }),
  });

  const mapboxStyle = {
    "version": 8,
    "sources": {
      "mvt-source": {
        "type": "vector",
        "tiles": ["http://localhost:8081/china/xyz/{z}/{x}/{y}.pbf"], // 请替换为您的瓦片 URL

        "minzoom": 0,
        "maxzoom": 15,
      },
      "mvt-source_p": {
        "type": "vector",
        "tiles": ["http://localhost:8081/china/tiles/{z}/{x}/{y}.pbf"], // 请替换为您的瓦片 URL

        "minzoom": 0,
        "maxzoom": 15,
      }
    },
    "layers": [

      {
        "id": "mvt-layer",
        "type": "fill",
        "source": "mvt-source",
        "source-layer": "province",
        "paint": {
          "fill-color": "#fff", // 非常浅的灰色背景
          "fill-opacity": 0.8,
          "fill-outline-color": "#BDBDBD", // 浅灰色边框
          "line-width": 1,
        },
        "minzoom": 0,
        "maxzoom": 8,
      },
      {
        "id": "mvt-layer_p",
        "type": "symbol",
        "source": "mvt-source_p",
        "source-layer": "province_point",
        "layout": {
          "text-field": ["get", "省"],
          "text-size": 16,
          "text-font": ["Roboto Bold", "sans-serif"],
        },
        "paint": {
          "text-color": "#333",
          "text-halo-color": "rgba(255,255,255,0.8)",
          "text-halo-width": 1.2,
        },
        "minzoom": 0,
        "maxzoom": 8,
      },
      {
        "id": "mvt-layer1",
        "type": "fill",
        "source": "mvt-source",
        "source-layer": "city",
        "paint": {
          "fill-color": "#fff", // 非常浅的灰色背景

          "fill-opacity": 0.8,
          "fill-outline-color": "#BDBDBD", // 浅灰色边框
          "line-width": 1,
        },
        "minzoom": 5,
        "maxzoom": 9,
      },
      {
        "id": "mvt-layer_p122",
        "type": "symbol",
        "source": "mvt-source_p",
        "source-layer": "city_point",
        "layout": {
          "text-field": ["get", "地名"],
          "text-size": 14,
          "text-font": ["Roboto Medium", "sans-serif"],
        },
        "paint": {
          "text-color": "#333",
          "text-halo-color": "rgba(255,255,255,0.8)",
          "text-halo-width": 1.2,
        },
        "minzoom": 5,
        "maxzoom": 9,
      },
      {
        "id": "mvt-layer2",
        "type": "fill",
        "source": "mvt-source",
        "source-layer": "country",
        "paint": {
          "fill-color": "#fff", // 非常浅的灰色背景

          "fill-opacity": 0.8,
          "fill-outline-color": "#BDBDBD", // 浅灰色边框
          "line-width": 1,
        },
        "minzoom": 8,
        "maxzoom": 15,
      },
      {
        "id": "mvt-layer_p1",
        "type": "symbol",
        "source": "mvt-source_p",
        "source-layer": "country_point",
        "layout": {
          "text-field": ["get", "地名"],
          "text-size": 12,
          "text-font": ["Roboto Regular", "sans-serif"],
        },
        "paint": {
          "text-color": "#333",
          "text-halo-color": "rgba(255,255,255,0.8)",
          "text-halo-width": 1,
        },
        "minzoom": 8,
        "maxzoom": 15,
      },
    ],
  }




  apply(map,mapboxStyle )







}





  return <div id="map">


  </div>;
}
