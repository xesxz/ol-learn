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
import GeoJSON from 'ol/format/GeoJSON'

const map = new Map({
    target: 'map',
    layers: [new TileLayer({
        source: new OSM()
    })],
    view: new View({
        center: fromLonLat([103.22, 34.23]),
        zoom: 10
    })
});

function createRoute(vSource) {
  const features = vSource.getFeatures()
  features.forEach((feature, index) => {
    const styles = [createLineStyle()]
    feature.setStyle(styles)

    feature.getGeometry().forEachSegment((start, end) => {
      const dx = end[0] - start[0]
      const dy = end[1] - start[1]
      const rotation = Math.atan2(dy, dx)
      styles.push(new Style({
        geometry: new Point(end),
        image: new Icon({
          src: '/images/icon/arrow1.png',
          anchor: [0.75, 0.5],
          rotateWithView: true,
          rotation: -rotation,
          scale: 1.5
        })
      }))
    })

    feature.setStyle(styles)
  })

  const vLayer = new VectorLayer({
    source: vSource
  })
  map.addLayer(vLayer)
  map.getView().fit(vSource.getExtent(), {
    size: map.getSize(),
    padding: [30, 30, 30, 30]
  })
}

function createLineStyle() {
  return new Style({
    stroke: new Stroke({
      color: '#2E8B57',
      width: 10
    })
  })
}

fetch('/data/geojson/cj.geojson')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const vSource = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      })
    })
    createRoute(vSource)
  })
