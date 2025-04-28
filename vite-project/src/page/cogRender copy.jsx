import useMap from '../hooks/map';
import { GeoTIFF } from 'ol/source';
import { useEffect } from 'react';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import {
  Pool,
  globals as geotiffGlobals,
  fromBlob as tiffFromBlob,
  fromUrl as tiffFromUrl,
  fromUrls as tiffFromUrls,
} from 'geotiff';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as Vector } from 'ol/source';

import { Style, Fill, Text, Stroke } from 'ol/style';

export default function CogRender() {
  const map = useMap();
  function getColor(config) {
    const interpolateArray = ['interpolate', ['linear'], ['band', 1]];

    config.forEach(([value, color]) => {
      interpolateArray.push(value);
      interpolateArray.push(color);
    });
    return interpolateArray;
  }

  useEffect(() => {
    if (map) {
      const tmpLegend = [
        [-36, [128, 0, 124]],
        [-32, [0, 47, 134]],
        [-28, [26, 92, 166]],
        [-24, [32, 117, 210]],
        [-20, [60, 160, 240]],
        [-16, [117, 207, 255]],
        [-12, [151, 255, 244]],
        [-8, [189, 249, 255]],
        [-4, [242, 255, 255]],
        [0, [223, 255, 217]],
        [4, [196, 255, 183]],
        [8, [186, 254, 131]],
        [12, [252, 254, 156]],
        [16, [255, 243, 196]],
        [20, [255, 220, 168]],
        [24, [255, 175, 117]],
        [28, [253, 135, 132]],
        [32, [236, 91, 95]],
        [35, [255, 51, 51]],
        [37, [201, 1, 1]],
        [40, [153, 51, 1]],
        [100, [71, 14, 0]],
        [1000, [255, 255, 0]],
      ];

      const tmpLegend1 = [
        [-36, [128, 0, 124, 0.5]],
        [-32, [0, 47, 134, 0.5]],
        [-28, [26, 92, 166, 0.5]],
        [-24, [32, 117, 210, 0.5]],
        [-20, [60, 160, 240, 0.5]],
        [-16, [117, 207, 255, 0.5]],
        [-12, [151, 255, 244, 0.5]],
        [-8, [189, 249, 255, 0.5]],
        [-4, [242, 255, 255, 0.5]],
        [0, [223, 255, 217, 0.5]],
        [4, [196, 255, 183, 0.5]],
        [8, [186, 254, 131, 0.5]],
        [12, [252, 254, 156, 0.5]],
        [16, [255, 243, 196, 0.5]],
        [20, [255, 220, 168, 0.5]],
        [24, [255, 175, 117, 0.5]],
        [28, [253, 135, 132, 0.5]],
        [32, [236, 91, 95, 0.5]],
        [35, [255, 51, 51, 0.5]],
        [37, [201, 1, 1, 0.5]],
        [40, [153, 51, 1, 0.5]],
        [100, [71, 14, 0, 0.5]],
        [1000, [255, 255, 0, 0.5]],
      ];

      map.current.getView().on('change:resolution', debounce(() => {
        console.log('缩放了，干点事');
        test()
        // 可以在这里重新抽稀/重新渲染点
      }, 300));


      const PRE = [
        [0, [255, 255, 255, 0]],
        [0.1, [165, 242, 141]],
        [10, [61, 189, 60]],
        [25, [98, 184, 255]],
        [50, [0, 2, 254]],
        [100, [253, 0, 253]],
        [250, [131, 0, 65]],
      ];

      const tiffSource = new GeoTIFF({
        normalize: false,
        sources: [
          {
            url:"http://10.194.90.150:9001/GEO_LAYER/NAFP/NWFD/SPCC/BCCD/2025/20250410/TEM/NAFP_NWFP_SPCC__TEM_103_2_20250410080000_33_0.tif"
            // url: 'http://10.194.90.150:9001/GEO_LAYER/NAFP/CEMC-CMA-CPSV3-DAILY/BCCD/2025/20250409/T2M/NAFP_CEMC_CMA_CPS_V3_S2S_DAILY_NC__T2M_103_0_20250409000000_312_0.tif',
            // url:'/NAFP_NWFP_SPCC__TEM_103_2_20241117080000_3_0 (1) (1).tif'
            // url:"/NAFP_NWFP_SPCC__ER03_1_0_20241115080000_24_0_24H.tif"
            // url:"/NAFP_GRID_ANA_REALTIME_HOR_CHN__2TEM_103_2_20241112090000_0_0.tif",
            // url:"/333.tif"
            // url:"http://10.194.90.150:9001/GEO_LAYER/NAFP/NWFD/SPCC/BCCD/2024/20241117/TEM/NAFP_NWFP_SPCC__TEM_103_2_20241117080000_3_0.tif"
          },
        ],
      });
      console.log(tiffSource.getProperties(), 888);

      console.log(getColor(tmpLegend));

      const tiffLayer = new WebGLTileLayer({
        source: tiffSource,
        style: {
          // color: getColor(tmpLegend1),
          // color: getColor(tmpLegend)
          color: [
            'case',
            ['==', ['band', 2], 0],
            ['color', 0, 0, 0, 0],
            ['<=', ['band', 1], -36],
            ['color', 128, 0, 124],
            ['between', ['band', 1], -36, -32],
            ['color', 128, 0, 124],
            ['between', ['band', 1], -32, -28],
            ['color', 0, 47, 134],
            ['between', ['band', 1], -28, -24],
            ['color', 26, 92, 166],
            ['between', ['band', 1], -24, -20],
            ['color', 32, 117, 210],
            ['between', ['band', 1], -20, -16],
            ['color', 60, 160, 240],
            ['between', ['band', 1], -16, -12],
            ['color', 117, 207, 255],
            ['between', ['band', 1], -12, -8],
            ['color', 151, 255, 244],
            ['between', ['band', 1], -8, -4],
            ['color', 189, 249, 255],
            ['between', ['band', 1], -4, 0],
            ['color', 242, 255, 255],
            ['between', ['band', 1], 0, 4],
            ['color', 223, 255, 217],
            ['between', ['band', 1], 4, 8],
            ['color', 196, 255, 183],
            ['between', ['band', 1], 8, 12],
            ['color', 186, 254, 131],
            ['between', ['band', 1], 12, 16],
            ['color', 252, 254, 156],
            ['between', ['band', 1], 16, 20],
            ['color', 255, 243, 196],
            ['between', ['band', 1], 20, 24],
            ['color', 255, 220, 168],
            ['between', ['band', 1], 24, 28],
            ['color', 255, 175, 117],
            ['between', ['band', 1], 28, 32],
            ['color', 253, 135, 132],
            ['between', ['band', 1], 32, 35],
            ['color', 236, 91, 95],
            ['between', ['band', 1], 35, 37],
            ['color', 255, 51, 51],
            ['between', ['band', 1], 37, 40],
            ['color', 201, 1, 1],
            ['between', ['band', 1], 40, 40],
            ['color', 153, 51, 1],
            ['color', 153, 51, 1],
          ],
        },
      });

      map.current.addLayer(tiffLayer);
    }
  }, [map]);
let vectorLayer = null;
  async function test() {


    if(vectorLayer) {
      map.current.removeLayer(vectorLayer);
    }
    const tiff = await tiffFromUrl(
      'http://10.194.90.150:9001/GEO_LAYER/NAFP/NWFD/SPCC/BCCD/2025/20250410/TEM/NAFP_NWFP_SPCC__TEM_103_2_20250410080000_33_0.tif',
    );
    const image = await tiff.getImage();
    const data = await image.readRasters();

    const width = image.getWidth();
    const height = image.getHeight();

    const tiepoint = image.getTiePoints()[0]; // 左上角的地理坐标
    const pixelScale = image.getFileDirectory().ModelPixelScale; // 像素大小

    const geoTransform = [
      tiepoint.x,
      pixelScale[0],
      0,
      tiepoint.y,
      0,
      -pixelScale[1], // 注意Y方向一般是负的（从上往下是正方向）
    ];

    const vectorSource = new Vector({
      features: createFeaturesFromRaster(
        data,
        width,
        height,
        geoTransform,
        map.current.getView().getZoom(),
      ),
    });

    vectorLayer = new VectorLayer({
      name:'点',
      source: vectorSource,
      zIndex: 19999,
      style: (feature) => {
        const value = feature.get('value');
        return new Style({
          text: new Text({
            font: '12px Calibri,sans-serif',
            fill: new Fill({
              color: '#000',
            }),
            stroke: new Stroke({
              color: '#fff',
              width: 3,
            }),
            text: Number(value).toFixed(2), // 显示数值
          }),
        });
      },
    });



    map.current.addLayer(vectorLayer);
  }

  test();

  function createFeaturesFromRaster(
    rasters,
    width,
    height,
    geoTransform,
    zoom
  ) {
    const features = [];
    console.log(zoom, 'zoom');


    // 改进的step计算方式：
    // 1. 使用对数缩放使密度变化更平滑
    // 2. 基础步长与zoom成反比
    // 3. 限制最小和最大步长
    const baseStep = Math.max(1, Math.min(10, Math.round(10 / Math.log(zoom + 1))));
    const step = Math.max(2, Math.min(baseStep, Math.floor(width / 20)));

    // 可选：添加一个密度控制因子，可以调整这个值来改变整体密度
    const densityFactor = 5.5;
    const finalStep = Math.round(step * densityFactor);

    for (let y = 0; y < height; y += finalStep) {
      for (let x = 0; x < width; x += finalStep) {
        const index = y * width + x;
        const value = rasters[0][index];

        if (value == null || isNaN(value)) continue;

        // 将像素坐标转换为地理坐标
        const px = geoTransform[0] + x * geoTransform[1] + y * geoTransform[2];
        const py = geoTransform[3] + x * geoTransform[4] + y * geoTransform[5];

        const feature = new Feature({
          geometry: new Point([px, py]),
          value: value,
        });

        features.push(feature);
      }
    }

    return features;
  }
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
  return <div id="map"></div>;
}
