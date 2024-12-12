import useMap from '../hooks/map';
import { useEffect } from 'react';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';

import { Vector } from 'ol/source';
import { GeoJSON } from 'ol/format';

export default function WebGLPoints() {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const vectorSource = new Vector({
        url: 'https://openlayers.org/en/latest/examples/data/geojson/world-cities.geojson',
        format: new GeoJSON(),
        wrapX: true,
      });

      const pointsLayer = new WebGLPointsLayer({
        source: vectorSource,
        // style: {
        //   symbol: {
        //     symbolType: 'circle',
        //     size: 8,
        //     color: 'rgb(255, 0, 0)',
        //     opacity: 0.2,
        // },

        // },
        style: {
          'icon-src': 'https://openlayers.org/en/latest/examples/data/icon.png',
          'icon-width': 18,
          'icon-height': 28,
          'icon-color': 'lightyellow',
          'icon-rotate-with-view': false,
          'icon-displacement': [0, 9],
        },
      });

      map.current.addLayer(pointsLayer);
    }
  }, [map]);

  return <div id="map"></div>;
}
