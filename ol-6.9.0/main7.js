import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import {fromLonLat} from 'ol/proj';
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import {Circle, Fill, Stroke, Style, Icon} from 'ol/style';

const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        center: [103.22, 34.23], zoom: 10,projection:"EPSG:4326"
    })
});


// Features can be styled individually with setStyle; otherwise they use the style of their vector layer.
const feature = new Feature({
    geometry: new LineString([[104,30],[105.6,30]]), // labelPoint: new Point(fromLonLat([103.22, 34.23])),
});

//参数可以是数组 也可以是style
feature.setStyle(new Style({
    image: new Icon({
        // anchor: [1, 1],// 显示位置
        // size: [1110, 300],// 尺寸
        src: '/images/icon/jm.png',
        scale:4
    }),
    stroke:new Stroke({
        color: 'rgba(0, 255,198,0.75)',
        lineCap: 'square',
        width: 13
    })
}))

// console.log(feature.getStyle())


// 如果需要给要素附加一些自定义数据
// feature.set('data', data)

const layer = new VectorLayer({
    source: new VectorSource({
        features: [feature],

    })
})


map.addLayer(layer)








