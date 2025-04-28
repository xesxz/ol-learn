import useMap from '../hooks/map';
import { GeoTIFF } from 'ol/source';
import { useEffect } from 'react';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import cme_gridValueLayer from '../libs/cme_gridValueLayer/cme_gridValueLayer.js';
export default function CogRender() {
 const map = useMap();


 useEffect(() => {
  if(map){







const tiffSource = new GeoTIFF({
  normalize: false,
  sources: [{
    url:'/NAFP_NWFP_SPCC__TEM_103_2_20241117080000_3_0 (1) (1).tif'

  }],

});


const tiffLayer = new WebGLTileLayer({
  source: tiffSource,
  style:{

    color:[
      "case",
      [
          "==",
          [
              "band",
              2
          ],
          0
      ],
      [
          "color",
          0,
          0,
          0,
          0
      ],
      [
          "<=",
          [
              "band",
              1
          ],
          -36
      ],
      [
          "color",
          128,
          0,
          124
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -36,
          -32
      ],
      [
          "color",
          128,
          0,
          124
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -32,
          -28
      ],
      [
          "color",
          0,
          47,
          134
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -28,
          -24
      ],
      [
          "color",
          26,
          92,
          166
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -24,
          -20
      ],
      [
          "color",
          32,
          117,
          210
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -20,
          -16
      ],
      [
          "color",
          60,
          160,
          240
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -16,
          -12
      ],
      [
          "color",
          117,
          207,
          255
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -12,
          -8
      ],
      [
          "color",
          151,
          255,
          244
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -8,
          -4
      ],
      [
          "color",
          189,
          249,
          255
      ],
      [
          "between",
          [
              "band",
              1
          ],
          -4,
          0
      ],
      [
          "color",
          242,
          255,
          255
      ],
      [
          "between",
          [
              "band",
              1
          ],
          0,
          4
      ],
      [
          "color",
          223,
          255,
          217
      ],
      [
          "between",
          [
              "band",
              1
          ],
          4,
          8
      ],
      [
          "color",
          196,
          255,
          183
      ],
      [
          "between",
          [
              "band",
              1
          ],
          8,
          12
      ],
      [
          "color",
          186,
          254,
          131
      ],
      [
          "between",
          [
              "band",
              1
          ],
          12,
          16
      ],
      [
          "color",
          252,
          254,
          156
      ],
      [
          "between",
          [
              "band",
              1
          ],
          16,
          20
      ],
      [
          "color",
          255,
          243,
          196
      ],
      [
          "between",
          [
              "band",
              1
          ],
          20,
          24
      ],
      [
          "color",
          255,
          220,
          168
      ],
      [
          "between",
          [
              "band",
              1
          ],
          24,
          28
      ],
      [
          "color",
          255,
          175,
          117
      ],
      [
          "between",
          [
              "band",
              1
          ],
          28,
          32
      ],
      [
          "color",
          253,
          135,
          132
      ],
      [
          "between",
          [
              "band",
              1
          ],
          32,
          35
      ],
      [
          "color",
          236,
          91,
          95
      ],
      [
          "between",
          [
              "band",
              1
          ],
          35,
          37
      ],
      [
          "color",
          255,
          51,
          51
      ],
      [
          "between",
          [
              "band",
              1
          ],
          37,
          40
      ],
      [
          "color",
          201,
          1,
          1
      ],
      [
          "between",
          [
              "band",
              1
          ],
          40,
          40
      ],
      [
          "color",
          153,
          51,
          1
      ],
      [
          "color",
          153,
          51,
          1
      ]
  ]
  },

});

 map.current.addLayer(tiffLayer)




   let config = {
        map:  map.current, //地图实例
        params: {
          type: 'grid',
          layer: tiffLayer, //图层实例
          // layerName: data.textId ?? data.id, //文本图层的图层名字,默认是栅格数据id名称加上_Text
          // precision: 1, //格网数据显示的小数点的精度
          // opacity: 1, //透明度
          // maxZoom: 15, // 最大缩放级别
          // zIndex: Number(data.zIndex) + 1 ?? 2, //图层层级
          // showTextRange: range,
          distanceArrow: 80, //距离
          // textStyle: data.textStyle ?? {
          //   //文本样式
          //   font: "11px Calibri,sans-serif", //字体
          //   fill: {
          //     color: "#000000", //填充颜色
          //   },
          //   stroke: {
          //     // strokeStyle:'white',
          //     lineWidth: 5
          //   }
          // },
        },
      };


 let lyr = new cme_gridValueLayer(); //调用渲染文本图层方法

 map.current.addLayer(lyr); //添加图层

 lyr._render(config); //把数据添加到图层上





  }
 }, [map]);










  return <div id="map">


  </div>;
}
