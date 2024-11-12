import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {Circle, Fill, Stroke, Style, Icon} from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON'
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import rbush from 'rbush';
import { getVectorContext, toContext } from "ol/render.js";


const map = new Map({
    target: 'map',
    layers: [new TileLayer({
        source: new OSM()
    })],
    view: new View({
        // center: fromLonLat([103.22, 34.23]),
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 10
    })
});


const layer = new VectorLayer({
    source: new VectorSource({
        features: new GeoJSON().readFeatures(
          {
            "type": "FeatureCollection",
            "features": [

              {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [103, 30.659462]
                },
                "properties": {
                  "category": "value3"
                }
              }
            ]
          }



        //   {
        //   type: 'FeatureCollection',
        //   features: [
        //     {
        //       type: 'Feature',
        //       geometry: {
        //         type: 'Point',
        //         coordinates: [104.065735, 30.659462]
        //       }
        //     }
        //   ]
        // }



      ),
    })
})


map.addLayer(layer)





