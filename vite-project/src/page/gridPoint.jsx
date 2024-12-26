
import { GeoTIFF as GeoTIFF1 } from 'ol/source';
import { useEffect } from 'react';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import * as GeoTIFF from 'geotiff';
export default function GridPoint() {
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
    layers: [vecLayer],
    view: new View({ center: [104, 31], zoom: 6, projection: 'EPSG:4326' }),
  });

  // getTiffData();
  geotiff1();

}



function geotiff1(){
  const tiffSource = new GeoTIFF1({
    normalize:false,
    sources: [
      {
        url: '/NAFP_NWFP_SPCC__ER03_1_0_20241115080000_24_0_24H.tif'
      }
    ]
  });

  console.log(tiffSource);

}

async function getTiffData(){
  const tiff = await GeoTIFF.fromUrl('/NAFP_NWFP_SPCC__ER03_1_0_20241115080000_24_0_24H.tif');
  const image = await tiff.getImage();
  // const data = await image.readRasters();

  //

  const data = image.getData();
  console.log(data);
}




  return <div id="map">


  </div>;
}
