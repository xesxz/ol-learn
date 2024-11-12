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
import Select from 'ol/interaction/Select';
import {altKeyOnly, click, pointerMove} from 'ol/events/condition';
import GeoJSON from 'ol/format/GeoJSON';

const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        projection: "EPSG:4326",
        // center: fromLonLat([103.22, 34.23]),
        center: [103.22, 34.23],
        zoom: 6
    })
});


// Features can be styled individually with setStyle; otherwise they use the style of their vector layer.
// const feature = new Feature({
//     geometry: new Point(fromLonLat([103.22, 34.23])), // labelPoint: new Point(fromLonLat([103.22, 34.23])),
// });


const json = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    109.423828125,
                    40.04443758460856
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    107.40234375,
                    36.66841891894786
                ]
            }
        }
    ]
}


 const features  = new GeoJSON().readFeatures(json)

features.forEach(feature => {
    feature.setStyle(new Style({
        image: new Icon({
            // anchor: [1, 1],// 显示位置
            size: [28, 28],// 尺寸
            src: '/images/icon/LNGCNG.png'
        })
    }))
})




//参数可以是数组 也可以是style
// feature.setStyle(new Style({
//     image: new Icon({
//         // anchor: [1, 1],// 显示位置
//         size: [28, 28],// 尺寸
//         src: '/images/icon/LNGCNG.png'
//     })
// }))

// console.log(feature.getStyle())


// 如果需要给要素附加一些自定义数据
// feature.set('data', data)

const layer = new VectorLayer({
    source: new VectorSource({
        features,

    })
})


map.addLayer(layer)







// const selected = new Style({
//     fill: new Fill({
//         color: '#eeeeee',
//     }),
//     stroke: new Stroke({
//         color: 'rgba(255, 255, 255, 0.7)',
//         width: 2,
//     }),
// });
//
//
// function selectStyle(feature) {
//     console.log(feature,"feature")
// }


const selectClick = new Select({
    condition: click,
    filter: function (feature, layer) {
        console.log(layer)
       // return layer2;
    },
    style: new Style({
        image: new Circle({
            radius: 5,
            fill: new Fill({
                color: '#09f'
            }),
            stroke: new Stroke({
                color:'#fff',
                width: 2
            })
        })
    })

});


map.addInteraction(selectClick);
