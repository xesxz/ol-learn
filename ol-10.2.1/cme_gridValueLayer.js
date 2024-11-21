import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Style, Stroke, Text, Fill } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import ImageLayer from 'ol/layer/Image.js';
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

class gridNumberClass extends ImageLayer {
  /**
   * 整个函数的描述。
   *
   * @param {type} options - 参数描述
   * @return {type} 返回值描述
   */
  constructor() {
    super({});
    this.canvasSource = null;
    this.gridSource = null;
    this.options = null;
  }
  /**
   * 渲染选项并返回一个解析为true的Promise。
   *
   * @param {Object} options - 要渲染的选项。
   * @return {Promise} 一个解析为true的Promise。
   */
  _render(options) {
    if (!options.params?.layer) {
      throw Error('参数options缺少"params.layer"参数');
    }
    this.gridSource = new gridNumberSource(options.map);
    this.options = options;
    let that = this;
    return new Promise((resolve) => {
      that.canvasSource = that.gridSource.InitWebGLFunctionSingle(
        options.params,
      );
      that.setSource(that.canvasSource);
      for (let key in options.params) {
        const value = options.params[key];
        that.set(key, value);
      }

      that.setProperties(options.params);
      that.set('params', options.params);

      //  that.once('sourceready', function (event) {
      options.map.once('rendercomplete', function () {
        that.canvasSource.changed();
        // PanByPixel(options.map, 0.1, 0.1);
        resolve(true);
      });
    });
  }

  /**
   * 设置函数的来源。
   *
   * @param {type} paramName - 参数的描述
   * @return {type} 返回值的描述
   */
  _setSource(layer) {
    this.options.params.layer = layer;
    let that = this;
    return new Promise((resolve) => {
      // that.canvasSource = new InitWebGLFunctionSingle(this.options);

      that.canvasSource = that.gridSource.InitWebGLFunctionSingle(
        that.options.params,
      );
      that.setSource(that.canvasSource);

      // // that.once('postcompose', function (event) {
      //   // that.once('postrender', function (event) {
      //   that.once('sourceready', function (event) {
      //   that.canvasSource.changed()
      //   PanByPixel(that.options.map, 1, 1);

      //   resolve(true);
      // })
      that.once('sourceready', function (event) {
        that.once('postrender', function (event) {
          that.canvasSource.changed();
          // PanByPixel(that.options.map, 0.1, 0.1);
          resolve(true);
        });
      });
    });
  }
  /**
   * 对整个函数的描述。
   *
   * @param {type} paramName - 参数描述
   * @return {type} 返回值描述
   */
  _setStyle(options) {
    let tempStyle = {};
    let tempObject = this.values_ || {};
    for (let key in tempObject) {
      const value = tempObject[key];
      if (key != 'layer') {
        tempStyle[key] = value;
      }
    }

    let styleobject = mergeObjects(tempStyle, options.params);
    for (let key in styleobject) {
      const value = styleobject[key];
      this.set(key, value);
    }
    // let  styleobject = Object.assign({},  this.getProperties()["params"], options.params);
    this.options.params = styleobject;
    styleobject.layer = tempObject.layer;
    // this.set("params", styleobject);
    this.gridSource.setOptions(styleobject);
    this.canvasSource.changed();
    return Promise.resolve(styleobject);
  }

  getSource() {
    return this.canvasSource;
  }
  /**
   * 整个函数的描述。
   *
   */
  _remove() {
    this.dispose();
    // 变量清空
  }
}
