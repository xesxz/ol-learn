import './style.css';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import {applyStyle} from "ol-mapbox-style";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";

const map = new Map({
    target: 'map', layers: [], view: new View({
        center: fromLonLat([103.22, 34.23]), zoom: 10
    })
});

const  tileLayer = new VectorTileLayer({ declutter: true });
applyStyle(tileLayer, 'http://localhost:8080/成都市基础电子地图810/styles/style.json').then(res => {
    const source =  new VectorTileSource({
        format: new MVT(),
        url:"http://localhost:8080/成都市基础电子地图810/tiles/{z}/{x}/{y}.mvt"
    })
    tileLayer.setSource(source)
    map.addLayer(tileLayer)



})




