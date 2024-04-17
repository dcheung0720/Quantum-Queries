import { useEffect, useState } from "react";


export const useJsonData = () =>{
    const [json, setJson] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        const getJson = async() =>{
            try{
                const response = await fetch("/2017-2023.json", {

                });
                if(!response.ok){
                    throw new Error("Network error");
                }
                const data = await response.json();
                setJson(data);
            } catch (err){
                setError(err.message);
                console.log(err);
            }
        };
        getJson();
    }, []);

    return [json, error];

};

export const useGeoJsonData = () =>{
    const [geoJson, setGeoJson] = useState();
    const [error, setError] = useState();
    
    useEffect(() =>{
        const getGeoJson = async() =>{
            try{
                const response = await fetch("/wards.geojson");
                if(!response.ok){
                    throw new Error("Network Error")
                }

                const data = await response.json();
                setGeoJson(data);
            } catch (err){  
                setError(err);
            }
        };
        getGeoJson();
    }, []);

    return [geoJson, error];
};

export default useJsonData;
