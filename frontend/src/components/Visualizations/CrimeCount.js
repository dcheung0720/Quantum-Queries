import { useEffect, useRef, useState } from 'react';
import rd3 from 'react-d3-library';
import { useData } from '../../utilities/firebase';

const CrimeCount = () =>{
    const svgRef = useRef();
    const [data, error] = useData("/2023");
    console.log(data);
    return(
        <svg ref = {svgRef}></svg>
    )
};

export default CrimeCount;