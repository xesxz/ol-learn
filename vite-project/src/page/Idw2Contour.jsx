import useMap from "../hooks/map";
import { useEffect } from "react";
import WebGLTileLayer from 'ol/layer/WebGLTile';
import Vector from 'ol/source/Vector.js';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
export default function Idw2Contour() {
  const map = useMap();
  function getColor(config) {
    // 线性插值函数
    function interpolateColor(value, start, end) {
      const [startValue, startColor] = start;
      const [endValue, endColor] = end;

      // 计算插值比例
      const ratio = (value - startValue) / (endValue - startValue);

      // 对 RGB 分量进行插值
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * ratio);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * ratio);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * ratio);
      const a = startColor[3] !== undefined ?
        startColor[3] + (endColor[3] - startColor[3]) * ratio : 1;

      return [r, g, b, a];
    }

    return function(feature) {
      const value = feature.get('value');

      // 找到对应的颜色区间并进行插值
      for (let i = 0; i < config.length - 1; i++) {
        if (value >= config[i][0] && value < config[i + 1][0]) {
          const interpolatedColor = interpolateColor(
            value,
            config[i],
            config[i + 1]
          );

          return new Style({
            fill: new Fill({
              color: `rgba(${interpolatedColor.join(',')})`,
            }),
            stroke: new Stroke({
              color: '#319FD3',
              width: 1
            })
          });
        }
      }

      // 如果超出范围，使用最后一个颜色
      return new Style({
        fill: new Fill({
          color: `rgba(${config[config.length - 1][1].join(',')})`,
        }),
        stroke: new Stroke({
          color: '#319FD3',
          width: 1
        })
      });
    };
  }
  useEffect(() => {
    if (map) {
      const PRE  = [
        [0, [255, 255, 255, 0]],
        [0.1, [165, 242, 141]],
        [10, [61, 189, 60]],
        [25, [98, 184, 255]],
        [50, [0, 2, 254]],
        [100, [253, 0, 253]],
        [250, [131, 0, 65]],
      ]



      let breaks = []
      let valueColors = []
      colorArr.forEach((item) => {
          breaks.push(item.value);
          valueColors = [...valueColors, item.value, item.color]
      })

      const Idw2Contour = Idw2ContourUtils.Idw2Contour
      const {
          vector_contours: geoJson
      } = Idw2Contour({
          points: ResData,
          breaks,
          clpFeature: CqBorder.features[0]
      })


      // 创建矢量图层
      const layer = new VectorLayer({
        source: new Vector({
          features: new GeoJSON().readFeatures(geoJson)
        }),
        style: getColor(PRE)
      });

map.current.addLayer(layer)
map.current.getView().fit(layer.getSource().getExtent(), map.current.getSize());



    }
  }, [map]);





  return <div id="map"></div>;
}

