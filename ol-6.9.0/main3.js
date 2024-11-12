import './style.css';
import {Map, View} from 'ol';
import {fromLonLat} from 'ol/proj';
import {applyStyle} from "ol-mapbox-style";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";

const map = new Map({
    target: 'map', layers: [], view: new View({
        center: fromLonLat([120.18274,30.289513]),
        zoom: 10
    })
});

const  tileLayer = new VectorTileLayer({ declutter: true });
applyStyle(tileLayer, 'http://localhost:8080/杭州矢量地图930/styles/style.json').then(res => {
    const source =  new VectorTileSource({
        format: new MVT(),
        url:"http://localhost:8080/杭州矢量地图930/tiles/{z}/{x}/{y}.mvt"
    })
    tileLayer.setSource(source)
    map.addLayer(tileLayer)



})




