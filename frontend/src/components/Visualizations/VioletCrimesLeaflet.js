import { MapContainer, TileLayer, useMap, Popup, Marker, Polygon, Tooltip } from 'react-leaflet';
import useJsonData, { useGeoJsonData, useWardData } from '../../utilities/jsonData';
import L from "leaflet";
import { color } from 'd3';
import { useEffect, useState } from 'react';

const Legend = () => {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            const grades = [0, 500, 1000, 1500, 2000, 2500];
            const colors = ['#FFFF00', '#ecca00', '#ec9b00', '#ec5300', '#ec2400', '#ec0000'];
            let labels = [];
            let from;
            let to;

            for (let i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<div class="legend-item">' +
                    '<i style="background:' + colors[i] + '"></i> ' +
                    from + (to ? "&ndash;" + to : "+") +
                    '</div>'
                );
            }

            div.innerHTML = labels.join("");
            return div;
        };

        legend.addTo(map);

        return () => {
            // Remove the legend when the component unmounts
            legend.remove();
        };
    }, [map]);

    return null;
};

const ViolentCrimesLeaftlet = ({year, setYear}) =>{
    const colorPicker = (number) =>{
        if(number <= 500){
            return {color : "#FFFF00"}
        }
        else if(number <= 1000){
            return {color : "#ecca00"}
        }
        else if (number <= 1500){
            return {color : "#ec9b00"}
        }
        else if (number <= 2000){
            return {color : "#ec5300"}
        }
        else if (number <= 2500){
            return {color : "#ec2400"}
        }
        else{
            return {color : "#ec0000"}
        }
    };


    const [geoJsonData, error] = useGeoJsonData();
    const [wardData, error2] = useWardData();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setYear(prevYear => (prevYear + 1) % 7);
        }, 500);

        // Cleanup the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, [geoJsonData]);

    const chicagoWardsNeighborhoods = {
        1: "Bucktown/Wicker Park/Ukrainian Village",
        2: "Lincoln Park/Old Town/Gold Coast",
        3: "Bronzeville/Near South Side/Douglas",
        4: "Hyde Park/Kenwood/Bronzeville",
        5: "South Shore/Woodlawn/Grand Crossing",
        6: "Chatham/Greater Grand Crossing/Avalon Park",
        7: "South Chicago/Calumet Heights/South Deering",
        8: "South Shore/Calumet Heights/Avalon Park",
        9: "Roseland/Pullman/Riverdale",
        10: "Hegewisch/East Side/South Chicago",
        11: "Beverly/Mount Greenwood/Morgan Park",
        12: "Bridgeport/Armour Square/Chinatown",
        13: "Back of the Yards/Heart of Chicago/McKinley Park",
        14: "Pilsen/University Village/Little Italy",
        15: "North Center/Roscoe Village/Ravenswood",
        16: "Irving Park/Portage Park/Old Irving Park",
        17: "Albany Park/Mayfair/North Park",
        18: "Montclare/Belmont Heights/Dunning",
        19: "Belmont Cragin/Hermosa/Kelvyn Park",
        20: "Logan Square/Humboldt Park/Hermosa",
        21: "Humboldt Park/West Town/Ukrainian Village",
        22: "West Town/Wicker Park/Bucktown",
        23: "Clearing/Garfield Ridge/Archer Heights",
        24: "West Lawn/Chicago Lawn/Marquette Park",
        25: "West Lawn/Ashburn/Chicago Lawn",
        26: "Little Village/South Lawndale/Pilsen",
        27: "Brighton Park/McKinley Park/Gage Park",
        28: "Loop/Near South Side/West Loop",
        29: "Near West Side/West Town/United Center",
        30: "South Lawndale/Little Village/Marshall Square",
        31: "Lower West Side/Near West Side/University Village",
        32: "Beverly/Washington Heights/Roseland",
        33: "Washington Heights/West Pullman/Roseland",
        34: "Auburn Gresham/Chatham/Greater Grand Crossing",
        35: "Calumet Heights/Avalon Park/Burnside",
        36: "Oakland/Douglas/Grand Boulevard",
        37: "Oakland/Grand Boulevard/Kenwood",
        38: "Grand Boulevard/Bronzeville/Douglas",
        39: "Kenwood/Hyde Park/Oakland",
        40: "South Shore/South Chicago/Avalon Park",
        41: "Hyde Park/Woodlawn/Kenwood",
        42: "Woodlawn/South Shore/Grand Crossing",
        43: "South Chicago/East Side/Hegewisch",
        44: "Auburn Gresham/Englewood/Gresham",
        45: "Englewood/New City/Back of the Yards",
        46: "New City/West Englewood/Englewood",
        47: "Chatham/Burnside/Roseland",
        48: "Roseland/East Side/Calumet Heights",
        49: "Calumet Heights/Pullman/Roseland",
        50: "Pullman/Roseland/South Deering"
    }

    if(geoJsonData!=null && wardData){

        return(
                <MapContainer center={[41.85, -87.9]} zoom={10} style={{ height: "50vh" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Legend />
                    {
                        geoJsonData["features"].map(feature => {
                            const multiPolygon = [feature.geometry.coordinates[0][0].map(
                                coordinate => [coordinate[1], coordinate[0]]
                            )];

                            const ward = parseInt(feature.properties.ward);
                            const violentCrimeCounts = wardData[ward][2017 + year].crimeCount;

                            return (
                                <Polygon
                                    pathOptions={colorPicker(violentCrimeCounts)}
                                    positions={multiPolygon}
                                >
                                    <Tooltip sticky>
                                        <h3>Ward/Neighborhood: {chicagoWardsNeighborhoods[ward]}</h3>
                                        <h3>Violent Crime Count: {violentCrimeCounts}</h3>
                                    </Tooltip>
                                </Polygon>
                            );
                        })
                    }
                </MapContainer>
        )
    }
    
};

export default ViolentCrimesLeaftlet;