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
import {getCenter} from 'ol/extent';

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



class MeasureTool {
  constructor(map) {
    this.map = map;
    this.source = new VectorSource();
    this.vector = new VectorLayer({
      source: this.source,
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
    this.map.addLayer(this.vector);
    this.onDrawEndListeners = [];

    this.draw = null;
    this.measureTooltipElement = null;
    this.measureTooltip = null;
    this.sketch = null;
    this.listener = null;

    this.createMeasureTooltip();
    this.addInteraction();
  }
  destroyDraw() {
    // console.log(this.draw);

    this.map.removeInteraction(this.draw);
    // this.draw = null;
    this.clearMeasurements()
    // if (this.draw) {
    //   this.map.removeInteraction(this.draw);
    //   this.draw = null;
    //   this.clearMeasurements()
    // }
  }
  addInteraction() {
    // Clear previous measurements
    // this.clearMeasurements();

    this.draw = new Draw({
      source: this.source,
      maxPoints: 2,
      type: 'LineString',
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
    this.map.addInteraction(this.draw);

    this.draw.on('drawstart', this.onDrawStart.bind(this));
    this.draw.on('drawend', this.onDrawEnd.bind(this));
  }

  clearMeasurements() {
    this.source.clear();
    if (this.measureTooltip) {
      this.map.removeOverlay(this.measureTooltip);
    }
    if (this.measureTooltipElement) {
      if (this.measureTooltipElement.parentNode) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
      }
    }
    this.createMeasureTooltip();
  }

  onDrawStart(evt) {
    this.clearMeasurements()
    // Add start point icon
    const startPoint = new Feature(new Point(evt.target.finishCoordinate_));
    startPoint.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '/images/定位.png',
        scale: "0.15"
      })
    }));
    this.source.addFeature(startPoint);

    // Set sketch
    this.sketch = evt.feature;

    let tooltipCoord = evt.coordinate;

    this.listener = this.sketch.getGeometry().on('change', (evt) => {
      const geom = evt.target;
      let output = this.formatLength(geom);
      tooltipCoord = geom.getLastCoordinate();
      this.measureTooltipElement.innerHTML = output;
      this.measureTooltip.setPosition(tooltipCoord);
    });
  }

  onDrawEnd(evt) {
    const endPoint = new Feature(new Point(evt.target.sketchCoords_[1]));
    endPoint.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: '/images/定位.png',
        scale: "0.15"
      })
    }));
    this.source.addFeature(endPoint);

    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
    this.measureTooltip.setOffset([0, -35]);

    // Set new style for the completed line
    evt.feature.setStyle(new Style({
      stroke: new Stroke({
        color: 'orange',
        width: 3
      })
    }));

    // Reset sketch
    this.sketch = null;
    this.onDrawEndListeners.forEach(listener => listener(evt));

    // Remove the draw interaction to prevent further drawing
    // this.map.removeInteraction(this.draw);
  }

  createMeasureTooltip() {
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }

  formatLength(line) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' km';
    } else {
      output = Math.round(length * 100) / 100 + ' m';
    }
    return output;
  }

  startMeasure() {
    this.addInteraction();
  }
    // New method to add onDrawEnd listeners
    addOnDrawEndListener(listener) {
      this.onDrawEndListeners.push(listener);
    }

    // New method to remove onDrawEnd listeners
    removeOnDrawEndListener(listener) {
      const index = this.onDrawEndListeners.indexOf(listener);
      if (index !== -1) {
        this.onDrawEndListeners.splice(index, 1);
      }
    }
}

let measureTool = null

document.getElementById('measure').addEventListener('click', () => {
   measureTool = new MeasureTool(map);
  measureTool.startMeasure();
  measureTool.addOnDrawEndListener((evt) => {
    console.log('Draw ended:', evt);

  });



});

document.getElementById('clear').addEventListener('click', () => {
  measureTool.destroyDraw()
});




// Initialize the MeasureTool


// measureTool.startMeasure();



