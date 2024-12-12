import { useEffect,useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
// import XYZ from 'ol/source/XYZ';
import { OSM } from 'ol/source';
// /const tk = 'dc2c764abf8425baf4ac249b66fdeee3'; // Replace with your TianDiTu token

export default function useMap() {
  const mapRef = useRef(null);
  useEffect(() => {
    const vecLayer = new TileLayer({
      source: new OSM(),
    });
    mapRef.current = new Map({
      target: 'map',
      layers: [vecLayer],
      view: new View({ center: [104, 31], zoom: 6, projection: 'EPSG:4326' }),
    });
  }, []);
  return mapRef;
}
