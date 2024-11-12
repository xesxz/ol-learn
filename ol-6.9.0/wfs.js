import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style, Icon } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'

import { Select } from 'ol/interaction'
import { pointerMove } from 'ol/events/condition'
import { singleClick } from 'ol/events/condition'

import BASEMAP_LAYERS from  "./basemap"









const map = new Map({
  target: 'map',
  // layers: [
  //   new TileLayer({
  //     source: new OSM(),
  //   }),
  // ],
  layers:BASEMAP_LAYERS,
  view: new View({
    center: [104.22, 30.23],
    zoom: 10,
    projection: 'EPSG:4326',
  }),
})

addWfsLayers()
registerEvent()
layerControl()

function getStyle(name, feature, scale = 0.7) {
  const properties = feature.getProperties()
  let src = null
  //浓度报警
  if (name === 'ndbj') {
    switch (properties.firstLevel) {
      case 'YJBJ':
        src = `/images/gas/alarm_check_1.png`
        break
      case 'EJBJ':
        src = `/images/gas/alarm_check_2.png`
        break
      case 'SJBJ':
        src = `/images/gas/alarm_check_3.png`
        break
      default:
        console.log('def')
    }
  }
  let style = new Style({
    image: new Icon({
      src,
      scale: scale,
    }),
  })

  return style
}

function addWfsLayers() {
  // const source = new VectorSource({
  //   url: 'http://10.1.47.189:18091/geoserver/gas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gas:manhole&maxFeatures=100000&outputFormat=application/json',
  //   format: new GeoJSON(),
  // })

  const source = new VectorSource({
    url: 'http://localhost:8080/geoserver/gas/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gas:concentrationAlarm&maxFeatures=100000&outputFormat=application/json',
    format: new GeoJSON(),
  })

  source.on('featuresloadend', () => {
    let extent = wfsLayer.getSource().getExtent()
    map.getView().fit(extent, {
      padding: [100, 100, 100, 100],
    })
  })
  const wfsLayer = new VectorLayer({
    source: source,
    style: function (feature) {
      feature.setStyle(getStyle('ndbj', feature))
    },
  })
  wfsLayer.set('name','ndbj')


  map.addLayer(wfsLayer)
}

function registerEvent() {
  pointerMoveEvent()
  clickEvent()
}

function pointerMoveEvent() {
  const select = new Select({
    condition: pointerMove,
  })
  map.addInteraction(select)
  select.on('select', function (e) {
    const features = e.target.getFeatures().getArray()
    if (features.length > 0) {
      let feature = e.selected[0]
      feature.setStyle(getStyle('ndbj', feature, 1))
    }
  })
}

function clickEvent() {
  map.on('click', function (evt) {
    var coordinate = evt.coordinate
    var feature = map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layerVetor) {
        return feature
      }
    )
    if (feature) {
      console.log(feature.getProperties()) //其中lei是定义的属性
      // console.log(
      //   "获取到点击的要素" + "jingdu:" + coordinate[0] + feature.get("lei")
      // ); //其中lei是定义的属性
    }
  })
}


/** 
* @description:添加图层控制btn
* @param{void}
* @return {void}
*/
function layerControl(){
  const btn = document.createElement('button')
  btn.style.position = "absolute"
  btn.style.right = "0px"
  btn.style.cursor = "pointer"
  btn.innerText = "图层显示隐藏"

  btn.onclick = function(){
    map.getAllLayers().forEach(layer => {
      if(layer instanceof  VectorLayer){
        layer.setVisible(!layer.getVisible())       
      }
   
    })

  }
  document.body.append(btn)
}


