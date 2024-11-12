import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Cluster } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import AnimatedCluster from 'ol-ext/layer/AnimatedCluster'
import SelectCluster from 'ol-ext/interaction/SelectCluster'
import { Circle, Fill, Stroke, Style, Icon, Text } from 'ol/style'
import GeoJSON from 'ol/format/GeoJSON'

import { Select } from 'ol/interaction'
import { pointerMove } from 'ol/events/condition'
import { singleClick } from 'ol/events/condition'

import axios from 'axios'

import BASEMAP_LAYERS from './basemap'

const map = new Map({
  target: 'map',
  layers: BASEMAP_LAYERS,
  view: new View({
    center: [104.22, 30.23],
    zoom: 10,
    projection: 'EPSG:4326',
  }),
})

function addClusterLayer(data) {
  const features = data.map((item, i) => {
    // const feature = new Feature(new Point([item.longitude, item.latitude]))

    const feature = new Feature(new Point([item.longitude, item.latitude]))
    feature.set('id', i)
    //TODO
    feature.setProperties(item)
    return feature
  })
  const source = new VectorSource({
    features: features,
  })
  const clusterSource = new Cluster({
    distance: 40,
    source: source,
  })

  const clusters = new AnimatedCluster({
    name: 'Cluster',
    source: clusterSource,
    style: getStyle,
    animationDuration: 300,
  })




  map.addLayer(clusters)
}

axios.get('/data/GeoJSON/chemicalEnterprise.json').then((res) => {
  const data = res.data.data.entList
  addClusterLayer(data)
  registerEvent()
})




function registerEvent(){
  const featureStyle = new Style({
    image: new Icon({
      src: '/images/gas/cz_bj_1.png',
      scale: 0.5,
    }),
    stroke: new Stroke({
      color:"cyan", 
      width:1 
    }) 

  })

  var selectCluster = new SelectCluster({
    pointRadius:15,
    animate:true,
    featureStyle: function(){
      return [featureStyle]
    },
    style:function(feature){
return getStyle(feature)
    }
  });
  map.addInteraction(selectCluster);





}

var styleCache = {}
function getStyle(feature, resolution) {
  var size = feature.get('features').length
  var style = styleCache[size]
  if (!style) {
    if (size === 1) {
      style = styleCache[size] = new Style({
        image: new Icon({
          src: '/images/gas/cz_bj_1.png',
          scale: 0.5,
        }),
      })
    } else {
      var color = size > 25 ? '192,0,0' : size > 8 ? '255,128,0' : '0,128,0'
      var radius = Math.max(8, Math.min(size * 0.75, 20))
      var dash = (2 * Math.PI * radius) / 6
      var dash = [0, dash, dash, dash, dash, dash, dash]
      style = styleCache[size] = new Style({
        image: new Circle({
          radius: radius,
          stroke: new Stroke({
            color: 'rgba(' + color + ',0.5)',
            width: 15,
            lineDash: dash,
            lineCap: 'butt',
          }),
          fill: new Fill({
            color: 'rgba(' + color + ',1)',
          }),
        }),
        text: new Text({
          text: size.toString(),
          font: 'bold 12px comic sans ms',
          // textBaseline: 'top',
          fill: new Fill({
            color: '#fff',
          }),
        }),
      })
    }
  }
  return style
}