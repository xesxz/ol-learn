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
  layers:BASEMAP_LAYERS,
  view: new View({
    center: [104.22, 30.23],
    zoom: 10,
    projection: 'EPSG:4326',
  }),
})




