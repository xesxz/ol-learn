import config from "./config"
import {
  XYZ,
} from "ol/source";
import {
  Tile
} from "ol/layer";


// import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import { Projection} from 'ol/proj';


// proj4.defs("EPSG:4490","GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
// register(proj4);
// var projection = new Projection({
//   code: 'EPSG:4490',
//   units: 'degrees',
//   axisOrientation: 'neu'
// });
// projection.setExtent([-180, -90, 180, 90]);
// projection.setWorldExtent([-180, -90, 180, 90]);




const BASEMAP =   config.BASEMAP.map(item  => {
  return  new Tile({
    source: new XYZ({
      url:item,
      // projection:projection
    }),

  });
})

export default BASEMAP
