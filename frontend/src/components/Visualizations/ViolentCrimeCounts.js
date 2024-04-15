import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ViolentCrimeCounts = ({data}) =>{
    const svgRef = useRef();

    useEffect(() =>{
        const svg = d3.select(svgRef.current);
        // dimensions
        const w = 700;
        const h = 400;

        const margin = {top: 30, bottom: 30, left: 30, right: 30};
        const height = h - margin.top - margin.bottom;
        const width = w - margin.left - margin.right;   

        const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const violentCrimes = ['BATTERY', 'ASSAULT', 'CRIM SEXUAL ASSAULT', 'ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE', 'DOMESTIC VIOLENCE'];
        const xScale = d3.scaleBand()
                        .domain(years)
                        .range([0, width]).padding(0.2);
        const yScale = d3.scaleLinear()
                        .domain([0, 100000])
                        .range([height, 0 ]);
        const colorScale = d3.scaleOrdinal()
                           .domain(violentCrimes)
                           .range(d3.schemeCategory10);


        if(data != null){
            svg.selectAll('*').remove();

            const columns = data["columns"];
            const yearCol = columns.indexOf("Year");
            const crimeTypeCol = columns.indexOf("Primary Type");
    
            const crimeData = years.map(year => {
                return({
                    label: year,
                    crimeCounts: violentCrimes.map(crime => 
                            data["data"].filter(d => d[yearCol] == year && d[crimeTypeCol] == crime).length
                    )}
                )
            });
        };


    }, [data])

    return(
        <svg ref = {svgRef}></svg>
    )

};

export default ViolentCrimeCounts;