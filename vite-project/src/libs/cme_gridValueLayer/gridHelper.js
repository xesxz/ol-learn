// 获取canvas坐标范围
export function getCanvasExtent(map, extent, padding) {
  const [xmin, ymin] = map.getPixelFromCoordinate([extent[0], extent[3]]);
  const [xmax, ymax] = map.getPixelFromCoordinate([extent[2], extent[1]]);
  const newExtent = [xmin, ymin, xmax, ymax];
  if (!padding) return newExtent;
  return newExtent.map((v, i) => v + (i < 2 ? padding : -padding));
}

export function mergeObject(object1, object2) {
  Object.keys(object2).forEach(name => {
    if (object1[name] === null || typeof object1[name] !== 'object') {
      object1[name] = object2[name];
      return;
    }
    mergeObject(object1[name], object2[name]);
  });
  return object1;
}

// 设置风向杆偏移位置
export function setArrowOffset(params) {
  if (!params) return null;
  if (params.type == "arrow") {
    params.picOffset = 150;
    return params;
  }
  params.picOffset = 84;
  switch (params.typeColor) {
    case "white":
      params.picOffset = 20;
      break;
    case "black":
      params.picOffset = 52;
      break;
    case "blue":
      params.picOffset = 84;
      break;
    case "orange":
      params.picOffset = 116;
      break;
    default:
      params.picOffset = 52;
      break;
  }
  return params;
}

// 判断点p是否在extent范围内
function isInExtent(extent, p) {
  const [x0, y0, x1, y1] = extent;
  return p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
}

// 获取canvas上的网格坐标
export function getGridPoints(extent, distance, outExtent, padding) {
  const xyList = [];
  const dx = extent[0] < 0 ? distance - Math.abs(extent[0] % distance) : 0;
  const dy = extent[1] < 0 ? distance - Math.abs(extent[1] % distance) : 0;
  const xMin = Math.max(extent[0], outExtent[0]) + dx;
  const yMin = Math.max(extent[1], outExtent[1]) + dy;
  const xMax = Math.min(extent[2], outExtent[2]);
  const yMax = Math.min(extent[3], outExtent[3]);
  for (let x = xMin; x <= xMax; x += distance) {
    for (let y = yMin; y <= yMax; y += distance) {
      if (!isInExtent(outExtent, [x, y])) continue;
      xyList.push([x, y]);
    }
  }
  return xyList;
}


