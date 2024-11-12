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


const map = new Map({
    target: 'map',
    layers: [new TileLayer({
        source: new OSM()
    })],
    view: new View({
        // center: fromLonLat([103.22, 34.23]),
        projection: 'EPSG:4326',
        center: [104.065, 30.697],
        zoom: 10
    })
});



fetch('/data/geojson/gasLine.json')
  .then(res => res.json())
  .then(data => {

    const vSource = new VectorSource({
      features: new GeoJSON().readFeatures(data),

    })
   const layer = new VectorLayer({
    source: vSource,
    style: createDirectionArrowlStyle(null, 30)
   })
   map.addLayer(layer)
   map.getView().fit(vSource.getExtent(), {
    padding: [100, 100, 100, 100]
   })

  })



function createDirectionArrowlStyle(style, zIndex) {
  // 箭头动态线默认样式
  const arrowLine = {
    color: "green",
    width: 10,
    arrowInterval: 40,
    arrowSize: [5, 9],
    arrowLineWidth: 2,
    arrowLineColor: "#faf4ff",
  };

  let options = {
    animate: false,
    speed: 100,
    ...arrowLine,
  };
  let canvas = createCanvasArrow(options);
  return new Style({
    renderer: (coordinates, state) => {
      if (state.geometry.getType() !== "LineString") {
        return;
      }
      let offset = state.feature.__arrowLineOffset || 0;
      const context = toContext(state.context, { pixelRatio: 1 });
      context.setStyle(
        new Style({
          stroke: new Stroke({
            ...options,
          }),
        })
      );
      let trackLine = new LineString(coordinates);
      context.drawGeometry(trackLine);

      let tree = new rbush();
      trackLine.forEachSegment(function (start, end) {
        const p = start;
        const p0 = end;
        // 计算每个segment的方向，即箭头旋转方向
        let rotation;
        if (p[1] <= p0[1]) {
          rotation = Math.PI / 2 - Math.atan2(p[1] - p0[1], p[0] - p0[0]);
        } else {
          let temR = -Math.atan2(p0[1] - p[1], p0[0] - p[0]);
          if (temR > Math.PI / 2) {
            rotation = (Math.PI * 3) / 2 + temR;
          } else {
            rotation = temR - Math.PI / 2;
          }
        }

        rotation = rotation + (90 / 180) * Math.PI;

        let geom = new LineString([start, end]);
        // 获取线范围
        let extent = geom.getExtent();
        let item = {
          minX: extent[0],
          minY: extent[1],
          maxX: extent[2],
          maxY: extent[3],
          geom: geom,
          rotation: rotation,
        };
        tree.insert(item);
      });
      // 轨迹地理长度
      let length = trackLine.getLength();
      // 像素间隔步长
      let stpes = options.arrowInterval;
      // 将像素步长转实际地理距离步长
      let geo_steps = stpes;
      let arrowsNum = parseInt(length / geo_steps);
      if (offset > length * (1 - 1 / arrowsNum)) {
        offset = 0;
      }

      // 箭头总数

      for (let i = options.animate ? 0 : 1; i < arrowsNum; i++) {
        let fraction = (i * 1.0) / arrowsNum + offset / length;

        if (fraction > 1) {
          fraction = fraction - 1;
        }
        let arraw_coor = trackLine.getCoordinateAt(fraction);
        let tol = 10; // 查询设置的点的容差，测试地图单位是米。如果是4326坐标系单位为度的话，改成0.0001.
        let arraw_coor_buffer = [
          arraw_coor[0] - tol,
          arraw_coor[1] - tol,
          arraw_coor[0] + tol,
          arraw_coor[1] + tol,
        ];
        // 进行btree查询
        let treeSearch = tree.search({
          minX: arraw_coor_buffer[0],
          minY: arraw_coor_buffer[1],
          maxX: arraw_coor_buffer[2],
          maxY: arraw_coor_buffer[3],
        });
        let arrow_rotation;
        // 只查询一个，那么肯定是它了，直接返回
        if (treeSearch.length == 1) {
          arrow_rotation = treeSearch[0].rotation;
        } else if (treeSearch.length > 1) {
          let results = treeSearch.filter(function (item) {
            // 换一种方案，设置一个稍小的容差，消除精度问题
            let _tol = 1; // 消除精度误差的容差
            if (
              item.geom.intersectsExtent([
                arraw_coor[0] - _tol,
                arraw_coor[1] - _tol,
                arraw_coor[0] + _tol,
                arraw_coor[1] + _tol,
              ])
            )
              return true;
          });
          if (results.length > 0) {
            arrow_rotation = results[0].rotation;
          }
        }

        context.setStyle(
          new Style({
            image: new Icon({
              img: canvas,
              imgSize: [canvas.width, canvas.height],
              rotation: -arrow_rotation,
            }),
          })
        );

        context.drawGeometry(new Point(arraw_coor));
      }

      if (options.animate) {
        state.feature.__arrowLineOffset = offset + options.speed / 60;
        state.layer.changed();
      }
    },
    ...(zIndex !== undefined ? { zIndex } : {}),
  });
}

// 创建箭头图标
function createCanvasArrow(options) {
  const canvas = document.createElement("canvas");
  const context = toContext(canvas.getContext("2d"), {
    size: [options.arrowSize[0], options.arrowSize[1]],
    pixelRatio: 1,
  });
  const width = options.arrowSize[0];
  const height = options.arrowSize[1];
  if (height < 2) return;
  if (width < 1) return;

  context.setStyle(
    new Style({
      stroke: new Stroke({
        color: options.arrowLineColor,
        width: options.arrowLineWidth,
      }),
    })
  );
  context.drawGeometry(
    new LineString([
      [0, 0],
      [width, height / 2],
      [0, height],
    ])
  );
  return canvas;
}
