function mergeObjects(obj1, obj2) {
  const mergedObj = {};

  // 遍历obj1的根属性
  for (let prop in obj1) {
    if (obj1.hasOwnProperty(prop)) {
      // 如果属性值是对象，则进行合并
      if (typeof obj1[prop] === 'object' && obj1[prop] !== null) {
        mergedObj[prop] = Object.assign({}, obj1[prop]);
      } else {
        mergedObj[prop] = obj1[prop];
      }
    }
  }

  // 遍历obj2的根属性
  for (let prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      // 如果属性在mergedObj中已存在，使用Object.assign()合并值
      if (mergedObj.hasOwnProperty(prop) && typeof mergedObj[prop] === 'object' && mergedObj[prop] !== null) {
        mergedObj[prop] = Object.assign({}, mergedObj[prop], obj2[prop]);
      } else {
        // 否则直接赋值
        mergedObj[prop] = obj2[prop];
      }
    }
  }

  return mergedObj;
}


function getWindSpeedAndDirection(u, v) {
  let data = {}
  const speed = Math.sqrt(u * u + v * v)
  let dir = 270.0 - Math.atan2(v, u) * 180.0 / Math.PI
  if (dir >= 360) dir = dir - 360
  data.speed = speed;
  data.direction = dir.toString();
  return data;
}

export {

  mergeObjects,
  getWindSpeedAndDirection
};
