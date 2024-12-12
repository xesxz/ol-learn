import Pbf from "pbf";//引入pbf
import axios from "axios";//引入axios
import geobuf from "geobuf";// 引入geobuf

axios
.get('/data11.json', { responseType: "arraybuffer" })
.then(function (res) {
  var vt = new Pbf(res.data);
  var geojson = geobuf.decode(vt)


  console.log(geojson)


});




