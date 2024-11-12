import RBush from 'rbush';

// 创建一个RBush实例
const tree = new RBush();

// 插入一些数据点
tree.insert({
  minX: 20,
  minY: 40,
  maxX: 30,
  maxY: 50,
  id: 1
});

// 进行范围查询
const result = tree.search({
  minX: 10,
  minY: 30,
  maxX: 40,
  maxY: 60
});

console.log(result); // 输出符合条件的数据点
