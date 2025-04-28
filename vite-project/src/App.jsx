import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Template from './page/tempalte';
import Home from './page/home';
import CogRender from './page/cogRender';
import WebGLPoints from './page/WebGLPoints';
import Idw2Contour from './page/Idw2Contour';
import GridPoint from './page/gridPoint';
import Wms from './page/wms';
import GridValueLayer from './page/gridValueLayer'
import Olms from './page/olms'
function App() {

  return (
    <Router>
      <div
        className="app-container "

      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/template" element={<Template />} />
          <Route path="/cogRender" element={<CogRender />} />
          <Route path="/WebGLPoints" element={<WebGLPoints />} />
          <Route path="/Idw2Contour" element={<Idw2Contour />} />
          <Route path="/gridPoint" element={<GridPoint />} />
          <Route path="/wms" element={<Wms />} />
          <Route path="/gridValueLayer" element={<GridValueLayer />} />
          <Route path="/olms" element={<Olms />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
