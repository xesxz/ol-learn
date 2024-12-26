import { useEffect } from 'react'
import './App.css'
import L from 'leaflet'

function App() {
  useEffect(() => {
    initMap()
  }, [])


  function initMap() {
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // L.marker([51.5, -0.09]).addTo(map)
    //     .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //     .openPopup();
  }
const style = { height: '100vh', width: '100vw' }
  return (
   <div id='map' style={style}>

   </div>
  )
}

export default App
