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
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import rbush from 'rbush';
import { getVectorContext, toContext } from "ol/render.js";
import Draw from 'ol/interaction/Draw';
import {getLength} from 'ol/sphere';
import Overlay from 'ol/Overlay';
import {Observable} from 'ol';
const map = new Map({
    target: 'map',
    layers: [new TileLayer({
        source: new OSM()
    })],
    view: new View({
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 10
    })
});

const source = new VectorSource();
const vector = new VectorLayer({
  source: source,
  style: new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: '#ffcc33'
      })
    })
  })
});

map.addLayer(vector);

const measureTooltipElement = document.createElement('div');
measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
const measureTooltip = new Overlay({
  element: measureTooltipElement,
  offset: [0, -15],
  positioning: 'bottom-center'
});
map.addOverlay(measureTooltip);

let draw;
function addInteraction() {
  draw = new Draw({
    source: source,
    type: 'LineString',
    maxPoints: 2,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: 'orange',
        lineCap: 'round',
        lineDash: [0, 10],
        width: 5
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: 'orange'
        }),
        fill: new Fill({
          color: 'orange'
        })
      })
    })
  });
  map.addInteraction(draw);

  let listener;
  let sketch;
  draw.on('drawstart', function(evt) {
    // Set sketch
    sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    let tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on('change', function(evt) {
      const geom = evt.target;
      let output = formatLength(geom);
      tooltipCoord = geom.getLastCoordinate();
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on('drawend', function() {
    Observable.unByKey(listener);
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.setOffset([0, -7]);

    // 重置绘图交互，为下一次绘制做准备
    map.removeInteraction(draw);
    addInteraction();
    return
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
    ol.Observable.unByKey(listener);
  });
}

/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
}

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
function formatLength(line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
}

addInteraction();
