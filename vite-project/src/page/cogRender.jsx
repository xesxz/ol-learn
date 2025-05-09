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
    console.log(image, 'data');
    console.log(data, 'data');
    console.log(image.getGDALMetadata()      , 'data');



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


  const stations = [{"id":6,"province":"四川省","city":"达州市","stationName":"达川","stationIdC":"57328","lon":107.5067,"lat":31.2075,"alti":344.9},{"id":18,"province":"四川省","city":"遂宁市","stationName":"遂宁","stationIdC":"57405","lon":105.5622,"lat":30.5069,"alti":354.9},{"id":19,"province":"四川省","city":"凉山州","stationName":"西昌","stationIdC":"56571","lon":102.2678,"lat":27.9036,"alti":1590.9},{"id":32,"province":"四川省","city":"广元市","stationName":"广元","stationIdC":"57206","lon":105.8997,"lat":32.4244,"alti":545.4},{"id":38,"province":"四川省","city":"眉山市","stationName":"眉山","stationIdC":"56391","lon":103.8758,"lat":30.0581,"alti":484},{"id":41,"province":"四川省","city":"自贡市","stationName":"自贡","stationIdC":"56396","lon":104.7658,"lat":29.3575,"alti":353.4},{"id":54,"province":"四川省","city":"阿坝州","stationName":"马尔康","stationIdC":"56172","lon":102.2286,"lat":31.8989,"alti":2686.8},{"id":61,"province":"四川省","city":"攀枝花","stationName":"攀枝花","stationIdC":"56666","lon":101.7211,"lat":26.5761,"alti":1190.1},{"id":69,"province":"四川省","city":"广安市","stationName":"广安","stationIdC":"57415","lon":106.6403,"lat":30.5219,"alti":372.3},{"id":77,"province":"四川省","city":"资阳市","stationName":"资阳","stationIdC":"56298","lon":104.6581,"lat":30.0683,"alti":414.2},{"id":78,"province":"四川省","city":"甘孜藏族自治州","stationName":"康定","stationIdC":"56374","lon":101.9606,"lat":30.055,"alti":2606.3},{"id":84,"province":"四川省","city":"乐山市","stationName":"乐山","stationIdC":"56386","lon":103.7553,"lat":29.5647,"alti":424.2},{"id":90,"province":"四川省","city":"南充市","stationName":"高坪","stationIdC":"57411","lon":106.1319,"lat":30.7456,"alti":347},{"id":105,"province":"四川省","city":"德阳市","stationName":"德阳","stationIdC":"56198","lon":104.4983,"lat":31.3181,"alti":525.7},{"id":115,"province":"四川省","city":"雅安市","stationName":"雅安","stationIdC":"56287","lon":102.9994,"lat":29.9831,"alti":627.6},{"id":126,"province":"四川省","city":"泸州市","stationName":"纳溪","stationIdC":"57604","lon":105.3928,"lat":28.7875,"alti":368.6},{"id":142,"province":"四川省","city":"巴中市","stationName":"巴中","stationIdC":"57313","lon":106.785,"lat":31.8872,"alti":556.7},{"id":148,"province":"四川省","city":"绵阳市","stationName":"绵阳","stationIdC":"56196","lon":104.7264,"lat":31.4403,"alti":521.1},{"id":154,"province":"四川省","city":"内江市","stationName":"东兴区","stationIdC":"57503","lon":105.1186,"lat":29.6197,"alti":349.9},{"id":271,"province":"四川","city":"成都市","stationName":"锦江三圣乡","stationIdC":"S1003","lon":104.1578,"lat":30.5894,"alti":507},{"id":2091,"province":"四川省","city":"宜宾市","stationName":"安阜古塔路","stationIdC":"S5702","lon":104.5967,"lat":28.7983,"alti":340.8}]


  let url =       'http://10.194.90.150:9001/GEO_LAYER/NAFP/NWFD/SPCC/BCCD/2025/20250410/TEM/NAFP_NWFP_SPCC__TEM_103_2_20250410080000_33_0.tif'


async function getData(){
  let  r  = await  assignTiffValuesToStations(url, stations)

  console.log(r, 'r');
}


getData()



  async function assignTiffValuesToStations(tiffUrl, stations) {
    const tiff = await tiffFromUrl(
      tiffUrl,

    );
    const image = await tiff.getImage();
    const rasters = await image.readRasters(); // 默认读取所有波段
    const tiepoint = image.getTiePoints()[0];
    const pixelScale = image.getFileDirectory().ModelPixelScale;

    const [originX, originY] = [tiepoint.x, tiepoint.y];
    const [resX, resY] = pixelScale;
    const width = image.getWidth();
    const height = image.getHeight();

    for (const station of stations) {
      const lon = station.lon;
      const lat = station.lat;

      const col = Math.floor((lon - originX) / resX);
      const row = Math.floor((originY - lat) / resY);

      if (col < 0 || row < 0 || col >= width || row >= height) {
        station.tiffValue = null; // 超出边界
      } else {
        const index = row * width + col;
        station.tiffValue = rasters[0][index]; // 假设单波段
      }
    }

    return stations;
  }

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
    const step = Math.max(2, Math.min(baseStep, Math.floor(width / 10)));


    console.log(baseStep,12312);

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
