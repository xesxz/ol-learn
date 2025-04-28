/**
 * @module CME2D/CME2DCore/layer/cme_gridValueLayer/gridNumberSource
 */
import ImageCanvasSource from "ol/source/ImageCanvas.js";
import { getCanvasExtent, getGridPoints, mergeObject } from "./gridHelper.js";
// import {
//     transform
// } from "../../../proj.js";
// import {
//     Point
// } from "../../../geom.js";
// import Feature from "../../../Feature.js";
import {transformExtent} from 'ol/proj';

import {
    getWindSpeedAndDirection
} from "./utils.js";

class gridNumberSource {
    constructor(map) {
        this.options = null; //params.params;
        this.map = map; //params.this.map;
        this.padding = 10;
        this.canvas = document.createElement('canvas');
    }

    /**
     * 使用给定参数初始化一个WebGL函数。
     * 这段代码片段初始化了一个用于单个参数的WebGL函数。
     * 它创建了一个具有特定选项和生成画布的函数的画布来源。该函数基于提供的范围、
     * 分辨率、像素比率、大小和投影等参数生成画布。然后，
     * 函数通过操作画布上下文根据选项对象中提供的数据绘制文本和图标。
     *
     * @param {Object} params - WebGL函数的参数。
     * @return {ImageCanvasSource} WebGL函数的画布源。
     */
    InitWebGLFunctionSingle(params) {
        this.options = params;
        const unitList = ['℃', 'C'];
        function inRange(val, range) {
            return val >= range.min && val <= range.max;
        }
        const canvasSource = new ImageCanvasSource({
            ratio: 1,
            projection: this.map.getView().getProjection().getCode(), //'EPSG:4326',
            /**
             * 根据给定的范围、分辨率、像素比率、大小和投影生成画布。
             *
             * @param {type} extent - 参数范围的描述
             * @param {type} resolution - 分辨率参数的描述
             * @param {type} pixelRatio - 像素比率参数的描述
             * @param {type} size - 大小参数的描述
             * @param {type} projection - 投影参数的描述
             * @return {type} 返回值描述
             */
            canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
              debugger
                const params = this.options;
                const { distanceArrow, fixedPixel, layer, showTextRange, precision } = params;
                const _precision = precision || 1;
                const style = layer.style_;
                const source = layer.getSource();
                const _resolutions = source.getResolutions();
                const rawResolution = _resolutions.slice(-1)[0];
                let _bandCount = 0;
                if (source.getMetaDatas) {
                    const { bandCount } = source.getMetaDatas();
                    _bandCount = bandCount;
                } else {
                    _bandCount = style.bandsNumber || 0;
                }
                const range = Object.assign({ min: -9999, max: 9999 }, showTextRange);
                var canvas = this.canvas;
                canvas.width = size[0];
                canvas.height = size[1];
                var context = canvas.getContext("2d");
                context.scale(pixelRatio, pixelRatio);
                let textSymbol = { //文本样式
                    font: "14px Calibri,sans-serif", //字体
                    // textBaseline: "middle",//垂直对齐
                    fill: { //填充
                        color: "#000", //颜色
                    },
                    stroke: { //边框
                        color: "#fff", //颜色
                        width: 4, //宽度
                    },
                };
                // 合并样式选项
                if (params.textStyle) {
                    mergeObject(textSymbol, params.textStyle);
                }
                context.fillStyle = '#00000000';
                context.fillRect(0, 0, size[0], size[1]);
                context.fillStyle = textSymbol.fill?.color || '#000000ff';
                if (textSymbol.stroke) {
                    context.strokeStyle = textSymbol.stroke.strokeStyle || "#ffffff"; // 字体边框颜色
                    context.lineWidth = textSymbol.stroke.lineWidth || 1; // 字体边框宽度
                }
                //1. 使用`font`设置字体。
                context.font = textSymbol.font; //"14px blod serif";
                context.textAlign = "center";
                let mapProject = projection.getCode();
                let proj = layer.getProperties().proj;
                let projCode = proj.projection;
                let offsetNumber = proj.offsetNumber || 0;
                let unit = proj.unit;
                var newExtent = proj.extent;
                if (projCode != mapProject) {
                    newExtent = transformExtent(proj.extent, projCode, mapProject);
                }
                let distance = +distanceArrow || 80;
                if (fixedPixel) {
                    distance = Math.max((rawResolution / resolution), distance);
                }
                this.padding = Math.ceil(distance / 5);
                // 获取外层范围，用以判断canvas数字是否在地图区域之内
                const outExtent = getCanvasExtent(this.map, extent);
                // 获取内层范围，确定canvas绘制范围
                const extent1 = getCanvasExtent(this.map, newExtent, this.padding);
                const xyList = getGridPoints(extent1, distance, outExtent, this.padding);
                const { scala, scale, offset } = style;
                const _scale = scale || scala;
                for (let idx = 0; idx < xyList.length; idx++) {
                    let data = layer.getData(xyList[idx]);
                    if (!(data && data.length)) continue;
                    let drawNum = (data[0] - offset) / _scale;
                    if (_bandCount >= 2) {
                        let uv = getWindSpeedAndDirection(drawNum, (data[1] - offset) / _scale);
                        drawNum = uv.speed; //风速
                    } else if (unitList.includes(unit)) {
                        drawNum -= 273.15;
                    }
                    if (!inRange(drawNum, range)) continue;
                    drawNum = drawNum.toFixed(_precision);
                    let xPixel = xyList[idx][0] - offsetNumber;
                    let yPixel = xyList[idx][1] - offsetNumber;
                    if (textSymbol.stroke) {
                        context.strokeText(drawNum, xPixel, yPixel);
                    }
                    context.fillText(drawNum, xPixel, yPixel);
                    context.fill(); // 填充颜色
                }
                return canvas;
            }
        });
        return canvasSource;
    }

    setOptions(options) {
        this.options = options;
    }


}

export { gridNumberSource }
