import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'

const ViolentCrimesLeaftlet = ({data}) =>{
    return(
    <MapContainer center={[41.85, -87.9]} zoom={10} style = {{height: "100vh"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    )
};

export default ViolentCrimesLeaftlet;