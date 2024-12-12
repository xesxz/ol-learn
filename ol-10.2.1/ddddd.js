
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Vector as VectorLayer} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';
import {Feature} from 'ol';
import {LineString} from 'ol/geom';
import {Style, Stroke} from 'ol/style';
import {fromLonLat} from 'ol/proj';

// 导入温度数据
import temperatureGridData from './data/temperatureGrid.js';

class ContourMap {
    constructor() {
        this.initMap();
        this.initLayers();
        this.initInteractions();
        this.bindEvents();
    }

    initMap() {
        // 初始化地图
        this.map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: fromLonLat([116, 40]), // 北京附近
                zoom: 8
            })
        });
    }

    initLayers() {
        // 初始化等值线图层
        this.contourSource = new VectorSource();
        this.contourLayer = new VectorLayer({
            source: this.contourSource,
            style: (feature) => {
                return new Style({
                    stroke: new Stroke({
                        color: this.getColorForValue(feature.get('value')),
                        width: 2
                    })
                });
            }
        });
        this.map.addLayer(this.contourLayer);
    }

    initInteractions() {
        // 添加鼠标悬停交互
        this.map.on('pointermove', (evt) => {
            const feature = this.map.forEachFeatureAtPixel(evt.pixel,
                (feature) => feature
            );

            const infoElement = document.getElementById('hover-info');
            if (feature) {
                const value = feature.get('value');
                infoElement.innerHTML = `温度: ${value.toFixed(1)}°C`;
            } else {
                infoElement.innerHTML = '';
            }
        });
    }

    bindEvents() {
        // 绑定更新按钮事件
        document.getElementById('updateContours').addEventListener('click', () => {
            this.updateContours();
        });
    }

    getColorForValue(value) {
        // 根据温度值返回颜色
        const colors = [
            {temp: 20, color: '#0000ff'},
            {temp: 22, color: '#00ff00'},
            {temp: 24, color: '#ff0000'}
        ];

        for (let i = 0; i < colors.length - 1; i++) {
            if (value <= colors[i + 1].temp) {
                return colors[i].color;
            }
        }
        return colors[colors.length - 1].color;
    }

    generateContours() {
        const interval = parseFloat(document.getElementById('interval').value);
        const minTemp = Math.min(...temperatureGridData.data.flat());
        const maxTemp = Math.max(...temperatureGridData.data.flat());

        const contours = [];
        for (let value = Math.ceil(minTemp); value <= maxTemp; value += interval) {
            const lines = this.marchingSquares(value);
            lines.forEach(line => {
                const feature = new Feature({
                    geometry: new LineString(line.map(coord =>
                        fromLonLat([
                            temperatureGridData.bounds[0] + coord[0] *
                                (temperatureGridData.bounds[2] - temperatureGridData.bounds[0]) /
                                (temperatureGridData.cols - 1),
                            temperatureGridData.bounds[1] + coord[1] *
                                (temperatureGridData.bounds[3] - temperatureGridData.bounds[1]) /
                                (temperatureGridData.rows - 1)
                        ])
                    )),
                    value: value
                });
                contours.push(feature);
            });
        }
        return contours;
    }

    marchingSquares(threshold) {
        // 简化版的marching squares算法
        const lines = [];
        const rows = temperatureGridData.rows;
        const cols = temperatureGridData.cols;

        for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
                const cell = [
                    temperatureGridData.data[i][j],
                    temperatureGridData.data[i][j + 1],
                    temperatureGridData.data[i + 1][j + 1],
                    temperatureGridData.data[i + 1][j]
                ];

                const points = this.getContourSegments(cell, threshold, i, j);
                if (points.length > 0) {
                    lines.push(points);
                }
            }
        }
        return this.connectLines(lines);
    }

    getContourSegments(cell, threshold, row, col) {
        // 获取单元格的等值线段
        const points = [];
        const state = cell.map(val => val > threshold ? 1 : 0)
            .reduce((acc, val, idx) => acc + (val << idx), 0);

        // 根据状态确定等值线段的位置
        switch(state) {
            case 1:
            case 14:
                points.push([col, row + 0.5], [col + 0.5, row]);
                break;
            case 2:
            case 13:
                points.push([col + 0.5, row], [col + 1, row + 0.5]);
                break;
            case 3:
            case 12:
                points.push([col, row + 0.5], [col + 1, row + 0.5]);
                break;
            case 4:
            case 11:
                points.push([col + 1, row + 0.5], [col + 0.5, row + 1]);
                break;
            case 6:
            case 9:
                points.push([col + 0.5, row], [col + 0.5, row + 1]);
                break;
            case 7:
            case 8:
                points.push([col, row + 0.5], [col + 0.5, row + 1]);
                break;
        }
        return points;
    }

    connectLines(lines) {
        // 连接等值线段
        const connected = [];
        while (lines.length > 0) {
            let currentLine = lines.pop();
            let changed = true;

            while (changed) {
                changed = false;
                for (let i = lines.length - 1; i >= 0; i--) {
                    const line = lines[i];
                    if (this.canConnect(currentLine, line)) {
                        currentLine = currentLine.concat(line);
                        lines.splice(i, 1);
                        changed = true;
                    }
                }
            }
            connected.push(currentLine);
        }
        return connected;
    }

    canConnect(line1, line2) {
        // 判断两条线段是否可以连接
        const [start1, end1] = [line1[0], line1[line1.length - 1]];
        const [start2, end2] = [line2[0], line2[line2.length - 1]];

        const epsilon = 0.0001;
        return (
            Math.abs(start1[0] - end2[0]) < epsilon && Math.abs(start1[1] - end2[1]) < epsilon ||
            Math.abs(end1[0] - start2[0]) < epsilon && Math.abs(end1[1] - start2[1]) < epsilon
        );
    }

    updateContours() {
        this.contourSource.clear();
        const contours = this.generateContours();
        this.contourSource.addFeatures(contours);
    }
}

// 创建应用实例
const app = new ContourMap();
app.updateContours();
