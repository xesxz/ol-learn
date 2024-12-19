import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = [{
    name: '模板',
    path: '/template'
  }, {
    name: 'CogRender',
    path: '/cogRender'
  }, {
    name: 'WebGLPoints',
    path: '/WebGLPoints'
  }, {
    name: 'Idw2Contour',
    path: '/Idw2Contour'
  }, {
    name: 'GridPoint',
    path: '/GridPoint'
  }, {
    name: 'Wms',
    path: '/Wms'
  }]
  return <ul>
    {
      navigate.map((item) => (
        <li key={item.path}><Link to={item.path}>{item.name}</Link></li>
      ))
    }

  </ul>;
}
