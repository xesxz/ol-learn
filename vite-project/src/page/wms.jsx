
// import { GeoTIFF } from 'ol/source';
import { useEffect } from 'react';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import TileWMS from 'ol/source/TileWMS';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
export default function Wms() {
  let map = null;

useEffect(()=>{
initMap()
},[])


function initMap(){
  const vecLayer = new TileLayer({
    source: new OSM(),
  });
  map = new Map({
    target: 'map',
    layers: [],
    view: new View({ center: [104, 31], zoom: 6, projection: 'EPSG:4326' }),
  });
  addWmsLayer();
  // addImageLayer();



}



function addWmsLayer(){
  const source = new TileWMS({
    url: 'http://172.24.2.59:8188/geoserver/GisServer/wms',
    params: {
      SERVICE:'WMS',
      REQUEST:'GetMap',
      VERSION:'1.1.1',
      // LAYERS:'gz_510000_polygon',
      LAYERS:'baseMapLayer2_dark',
      STYLES:'',
      FORMAT:'image/png',
      SRS:'EPSG:4326',
      WIDTH:256,
      HEIGHT:256,
    },
  });


  const wmsLayer = new TileLayer({
    source
  });
  map.addLayer(wmsLayer);
}



function addImageLayer(){
  const source = new ImageWMS({
    url: 'http://10.194.90.150:28032/geoserver/area/wms',
    params: {
      SERVICE:'WMS',
      REQUEST:'GetMap',
      VERSION:'1.1.1',
      LAYERS:'area:basin',
      STYLES:'',
      FORMAT:'image/png',
      SRS:'EPSG:4326',
      WIDTH:256,
      HEIGHT:256,
    },
  });
  const imageLayer = new ImageLayer({
    source
  });
  map.addLayer(imageLayer);
}



  return <div id="map">


  </div>;
}
