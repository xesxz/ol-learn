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





const wfsSource = new VectorSource({
    format: new GeoJSON(),
    url: '   http://gisserver.tianditu.gov.cn/TDTService/wfs?service=WFS&version=1.0.0&request=GetFeature&typename=LRRL&outputFormat=json'
});

const wfsLayer = new VectorLayer({
    source: wfsSource,
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(0, 0, 255, 1.0)',
            width: 2
        })
    })
});

map.addLayer(wfsLayer);





