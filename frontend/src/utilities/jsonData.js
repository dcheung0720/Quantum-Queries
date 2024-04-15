import { useEffect, useState } from "react";


const useJsonData = () =>{
    const [json, setJson] = useState();
    const [error, setError] = useState();

    useEffect(()=>{
        const getJson = async() =>{
            try{
                const response = await fetch("/2017-2023.json");
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

export default useJsonData;