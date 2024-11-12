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
import axios from 'axios'
import Featureanimation from 'ol-ext/featureanimation/Shake';
import {easeOut} from "ol/easing"
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [104.22, 30.23],
    zoom: 10,
    projection: 'EPSG:4326',
  }),
})


const style = new Style({
  image: new Icon({
    src: '/images/gas/cz_bj_3.png',
    scale: 0.5,
  }),
})


function addPoint(data) {
  const layer = new VectorLayer({
    source: new VectorSource({
        features: [],

    })
})

layer.setStyle(style)

  map.addLayer(layer)


  data.forEach((item,i)  => {
    const feature = new Feature(new Point([item.longitude, item.latitude]))
    // feature.setStyle(style)
   
    // pulse(feature,layer)

    setTimeout(() => {
      pulse(feature,layer)
    },i )

  })
}

function pulse(f,layer){




  layer.animateFeature(f, [
    new Featureanimation({
    
    })
  ]);


  layer.getSource().addFeature(f);

}

axios.get('/data/GeoJSON/chemicalEnterprise.json').then((res) => {
  const data = res.data.data.entList
  addPoint(data)
})
