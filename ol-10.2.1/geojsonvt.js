import './style.css';
import geojsonvt from 'geojson-vt';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { Projection,fromLonLat } from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { Style, Stroke, Text, Fill } from 'ol/style.js';

fetch('https://geo.datav.aliyun.com/areas_v3/bound/510000_full.json') // Replace with your GeoJSON URL or path
  .then(response => response.json())
  .then(json => {
    const tileIndex = geojsonvt(json, {
      extent: 4096,
      debug: 0,
    });

    const format = new GeoJSON({
      dataProjection: new Projection({
        code: 'TILE_PIXELS',
        units: 'tile-pixels',
        extent: [0, 0, 4096, 4096],
      }),
    });

    const replacer = function (key, value) {
      if (!value || !value.geometry) {
        return value;
      }

      let type;
      const rawType = value.type;
      let geometry = value.geometry;
      if (rawType === 1) {
        type = 'MultiPoint';
        if (geometry.length == 1) {
          type = 'Point';
          geometry = geometry[0];
        }
      } else if (rawType === 2) {
        type = 'MultiLineString';
        if (geometry.length == 1) {
          type = 'LineString';
          geometry = geometry[0];
        }
      } else if (rawType === 3) {
        type = 'Polygon';
        if (geometry.length > 1) {
          type = 'MultiPolygon';
          geometry = [geometry];
        }
      }

      return {
        'type': 'Feature',
        'geometry': {
          'type': type,
          'coordinates': geometry,
        },
        'properties': value.tags,
      };
    };

    const vectorSource = new VectorTileSource({
      tileUrlFunction: function (tileCoord) {
        // Use the tile coordinate as a pseudo URL for caching purposes
        return JSON.stringify(tileCoord);
      },
      tileLoadFunction: function (tile, url) {
        const tileCoord = JSON.parse(url);
        const data = tileIndex.getTile(
          tileCoord[0],
          tileCoord[1],
          tileCoord[2],
        );
        const geojson = JSON.stringify(
          {
            type: 'FeatureCollection',
            features: data ? data.features : [],
          },
          replacer,
        );
        const features = format.readFeatures(geojson, {
          extent: vectorSource.getTileGrid().getTileCoordExtent(tileCoord),
          featureProjection: map.getView().getProjection(),
        });
        tile.setFeatures(features);
      },
    });

    const vectorLayer = new VectorTileLayer({
      source: vectorSource,
      style: function (feature, resolution) {
        return new Style({
          stroke: new Stroke({
              color: '#0000ff',
              width: 2
          }),
          fill: new Fill({
              color: 'rgba(0, 0, 255, 0.1)'
          }),
          text: new Text({
              font: '12px Calibri,sans-serif',
              fill: new Fill({
                  color: '#000'
              }),
              stroke: new Stroke({
                  color: '#fff',
                  width: 3
              }),
              text: feature.get('name') // 显示名称属性
          })
      });
      },
    });

    const map = new Map({
      target: 'map',
      layers: [    new TileLayer({
        source: new OSM()
      }),vectorLayer],
      view: new View({
        center:fromLonLat([103, 40]) ,
        zoom: 4,


      }),
    });
  });
