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

const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        center: fromLonLat([103.22, 34.23]), zoom: 10
    })
});


// Features can be styled individually with setStyle; otherwise they use the style of their vector layer.
const feature = new Feature({
    geometry: new Point(fromLonLat([103.22, 34.23])), // labelPoint: new Point(fromLonLat([103.22, 34.23])),
});

//参数可以是数组 也可以是style
feature.setStyle(new Style({
    image: new Icon({
        // anchor: [1, 1],// 显示位置
        // size: [1110, 300],// 尺寸
        src: '/images/icon/jm.png',
        scale:4
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


map.on('click', function (evt) {
    var coordinate = evt.coordinate;
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layerVetor) {
        return feature;
    });
    if (feature) {
//为什么要双击
//         feature.getStyle().getImage().setScale(3.8);
        feature.setStyle([
            new Style({
                image: new Icon({
                    // anchor: [1, 1],// 显示位置
                    size: [28, 28],// 尺寸
                    src: '/images/icon/LNGCNG.png',
                    scale: 3
                })
            })
        ])
    }
})







