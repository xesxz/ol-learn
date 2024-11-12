import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS'
import {fromLonLat} from 'ol/proj';
import ImageWMS from 'ol/source/ImageWMS';
import {Image as ImageLayer} from 'ol/layer';
const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        center: fromLonLat([103.22, 34.23]), zoom: 10
    })
});

/*=======img-wms========*/

class WmsLayer{
    constructor(url,params,map) {
        this.url = url
        this.params = params
        this.map = map
        this.addWmsService()
    }
    createWmsService() {
        const wmsSoure = new ImageWMS({
            url: this.url,
            params: this.params,
            serverType: 'geoserver'
        })
        // var max = params.max || 0
        // var min = params.min || 21
        return new ImageLayer({
            // name: type,
            // className: 'wms',
            // opacity: opacity,
            source: wmsSoure,
            // maxResolution: this.resolutions[max],
            // minResolution: this.resolutions[min],
            // zIndex: params.zIndex || 103
        })
    }
    addWmsService() {
        // this.removeWmsLayerByType(type)
        // var wmsLayer = this.createWmsService(type, opacity, url, params)
        // this.wmsLayers[type] = wmsLayer
        // console.log("创建图层1-1");
        // olMapConfig.map.addLayer(wmsLayer)
        const wmsLayer = this.createWmsService()
        // this.wmsLayers[type] = wmsLayer
        this.map.addLayer(wmsLayer)
    }
}


new WmsLayer("http://60.174.207.208:8090/geoserver/chengdu/wms",{
    LAYERS:"chengdu:yuanluo"
},map)


// map.on('singleclick', function(evt) {
//     var view = map.getView();
//     var viewResolution = view.getResolution();
//     var source = untiled.get('visible') ? untiled.getSource() : tiled.getSource();
//     var url = source.getGetFeatureInfoUrl(
//         evt.coordinate, viewResolution, view.getProjection(),
//         {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
//     if (url) {
//         document.getElementById('nodelist').innerHTML = '<iframe seamless src="' + url + '"></iframe>';
//     }
// });

// const olMap = {
//     wmsLayers: [],
//     resolutions:  [
//         1.4062500068012802,
//         0.7031250000000002,
//         0.3515625000000001,
//         0.17578125000000006,
//         0.08789062500000003,
//         0.043945312500000014,
//         0.021972656250000007,
//         0.010986328125000003,
//         0.005493164062500002,
//         0.002746582031250001,
//         0.0013732910156250004,
//         6.866455078125002E-4,
//         3.433227539062501E-4,
//         1.7166137695312505E-4,
//         8.583068847656253E-5,
//         4.2915344238281264E-5,
//         2.1457672119140632E-5,
//         1.0728836059570316E-5,
//         5.364418029785158E-6,
//         2.6822090148925785E-6,
//         1.3411045074462893E-6
//     ],
//     createWmsService(type, opacity, url, params) {
//         // debugger
//         var wmsSoure = new TileWMS({
//             url: url,
//             params: params,
//             serverType: 'geoserver'
//         })
//         var max = params.max || 0
//         var min = params.min || 21
//         return new TileLayer({
//             name: type,
//             className: 'wms',
//             opacity: opacity,
//             source: wmsSoure,
//             maxResolution: this.resolutions[max],
//             minResolution: this.resolutions[min],
//             zIndex: params.zIndex || 103
//         })
//     },
//     addWmsService(type, opacity, url, params) {
//         // this.removeWmsLayerByType(type)
//         // var wmsLayer = this.createWmsService(type, opacity, url, params)
//         // this.wmsLayers[type] = wmsLayer
//         // console.log("创建图层1-1");
//         // olMapConfig.map.addLayer(wmsLayer)
//         var wmsLayer = this.createWmsService(type, opacity, url, params)
//         this.wmsLayers[type] = wmsLayer
//         window.map.addLayer(wmsLayer)
//     },
//
// }



