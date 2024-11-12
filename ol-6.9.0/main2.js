import './style.css';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import apply from 'ol-mapbox-style';


apply('map', 'mapbox://styles/mapbox/streets-v11', {accessToken: 'pk.eyJ1IjoiNjMxMjk4OTgzIiwiYSI6ImNrcXE3bGJjMzExd2Yyd3IxZnVsMzF3YnoifQ.PwJgJ85Al8qG_6Sr6OecbA'}).then(res=> {
    res.addLayer(      new VectorTileLayer({
            declutter: true,
            source: new VectorTileSource({
                format: new MVT(),
                url:
                    'https://{a-d}.tiles.mapbox.com/v1/mapbox.mapbox-streets-v8/' +
                    '{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiNjMxMjk4OTgzIiwiYSI6ImNrcXE3bGJjMzExd2Yyd3IxZnVsMzF3YnoifQ.PwJgJ85Al8qG_6Sr6OecbA'

            }),
        })

    )






});





