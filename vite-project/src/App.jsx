import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Template from './page/tempalte';
import Home from './page/home';
import CogRender from './page/cogRender';
import WebGLPoints from './page/WebGLPoints';
import Idw2Contour from './page/Idw2Contour';
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;