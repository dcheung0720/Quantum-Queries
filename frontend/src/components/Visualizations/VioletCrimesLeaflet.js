import { MapContainer, TileLayer, useMap, Popup, Marker, Polygon, Tooltip } from 'react-leaflet';
import useJsonData, { useGeoJsonData } from '../../utilities/jsonData';

const ViolentCrimesLeaftlet = ({data}) =>{

    const [geoJsonData, error] = useGeoJsonData();
    const [jsonData, error2] = useJsonData();

    const purpleOptions = { color: 'purple' };


    return(
        geoJsonData!=null && jsonData &&
            <MapContainer center={[41.85, -87.9]} zoom={10} style = {{height: "100vh"}}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    geoJsonData["features"].map(feature =>{
                        const multiPolygon = [feature.geometry.coordinates[0][0].map(
                            coordinate => [coordinate[1], coordinate[0]]
                        )];


                        return(
                            <Polygon pathOptions={purpleOptions} positions={multiPolygon}>
                                <Tooltip sticky>sticky Tooltip for Polygon</Tooltip>
                            </Polygon>
                        )
                    })
                }
            </MapContainer>
    )
};

export default ViolentCrimesLeaftlet;