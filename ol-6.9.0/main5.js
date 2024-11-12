import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS'
import WMSCapabilities from 'ol/format/WMSCapabilities';
import  axios from "axios"
const map = new Map({
    target: 'map', layers: [new TileLayer({
        source: new OSM()
    })], view: new View({
        center: [103.22, 34.23], zoom: 10,   projection: "EPSG:4326",
    })
});
/*=======tile-wms========*/
class WmsLayer{
    constructor(url,params,map) {
        this.url = url
        this.params = params
        this.map = map
        this.wmsLayers = {}
        this.addWmsService()
        this.addEvent()
    }
    createWmsService() {
        const wmsSoure = new TileWMS({
            url: this.url,
            params: this.params,
            serverType: 'geoserver'
        })
        // var max = params.max || 0
        // var min = params.min || 21
        return new TileLayer({
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
        this.map.addLayer(wmsLayer)
        this.wmsLayers[this.params.LAYERS] = wmsLayer
        this.getLayerExtent(this.params.LAYERS)

    }
    getLayerExtent(id) {
        const that = this
        const url =
        "http://60.174.207.208:8090/geoserver/wms?request=GetCapabilities&service=WMS&version=1.3.0"
        const parser = new WMSCapabilities();
        axios
            .get(url)
            .then(function (response) {
                return response.data;
            })
            .then(function (text) {
                const result = parser.read(text);
                const Layers = result.Capability.Layer.Layer;
                let extent;
                for (let i = 0, len = Layers.length; i < len; i++) {
                    const layerobj = Layers[i];
                    if (layerobj.Name == id) {
                        extent = layerobj.EX_GeographicBoundingBox;
                        that.map.getView().fit(extent, {
                            duration: 1000,
                        });
                    }
                }
            });
    }

    addEvent(){
        this.map.on('singleclick', (evt) => {
            var viewResolution =  this.map.getView().getResolution()
            console.log(this.wmsLayers[this.params.LAYERS].getSource().getGetFeatureInfo,"sss")
            var url =   this.wmsLayers[this.params.LAYERS].getSource().getGetFeatureInfoUrl(
                evt.coordinate, viewResolution, 'EPSG:4326', { 'INFO_FORMAT': 'application/json'
                })
            console.log(url)
            if (url) {
                axios.get(url).then(res => res.data).then(data => {
                    if (data.features.length > 0) {
                        console.log(123)
                        // 处理features     data.features[0]
                        // 处理features属性  data.features[0].properties
                    }
                })
            }
        })
    }
}


new WmsLayer("http://60.174.207.208:8090/geoserver/chengdu/wms",{
    LAYERS:"chengdu:yuanluo"
},map)


