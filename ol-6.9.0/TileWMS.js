import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import TileWMS from 'ol/source/TileWMS'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import axios from 'axios'


import * as dd from 'ol'


console.log(dd)


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [104.22, 30.23],
    zoom: 12,
    projection: 'EPSG:4326',
  }),
})
/*=======tile-wms========*/
class WmsLayer {
  constructor(url, params, map) {
    this.url = url
    this.params = params
    this.map = map
    this.wmsLayers = {}
    this.addWmsService()
  }
  createWmsService() {
    const wmsSoure = new TileWMS({
      url: this.url,
      params: this.params,
      serverType: 'geoserver',
    })
    return new TileLayer({
      source: wmsSoure,
    })
  }
  addWmsService() {
    const wmsLayer = this.createWmsService()
    this.map.addLayer(wmsLayer)
    this.wmsLayers[this.params.LAYERS] = wmsLayer
  }
}

const layers = new WmsLayer(
  'http://localhost:8080/geoserver/gas/wms',
  {
    LAYERS: 'gas:Risk_ZH',
  },
  map
)

map.on('singleclick', (evt) => {
  var view = map.getView()
  var viewResolution = view.getResolution()
  var source = layers.wmsLayers['gas:Risk_ZH'].getSource()
  var url = source.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    view.getProjection(),
    // {'INFO_FORMAT': 'text/html', 'FEATURE_COUNT': 50});
    { INFO_FORMAT: 'application/json' }
  )
  if (url) {
    axios.get(url).then((res) => {
      console.log(res)
    })
  }
})
