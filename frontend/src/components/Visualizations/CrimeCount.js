import { useEffect, useRef, useState } from 'react';
import { useData } from '../../utilities/firebase';
import * as d3 from 'd3';

const CrimeCount = () =>{
    const svgRef = useRef();
    const [data, error] = useData("/");

    useEffect(()=>{
        const w = 600;
        const h = 400;

        const svg = d3.select(svgRef.current);
        const margin = {top: 20, bottom: 20, left: 20, right: 20};
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;

        const x = d3.scaleBand().range([0, width]).padding(0.2);
        const y = d3.scaleLinear().domain([0, 500000]).range([height, 0]);

        const startingYear = 2022;
        if(data != null){
            const countData= Object.entries(data).map((x, idx) => {
                   return ( 
                        {   
                            label : startingYear + idx,
                            counts: x[1].reduce((cum, cur) => cum + cur.length, 0)
                        }
                    )
                });

            //remove all svg contents
            svg.selectAll('*').remove();

            //add all the elements
            svg.attr("width", w)
               .attr("height", h)
               .append('g')
               .attr("transform", `translate(${margin.left}, 0)`)
               .selectAll('rect')
               .data(countData)
               .enter().append('rect')
               .attr('x', d => x(d.label))
               .attr('y', d => y(d.counts))
               .attr('width', x.bandwidth())
               .attr('height', d => height - y(d.counts))
               .attr('fill', 'steelblue');

            //add axis
            svg.append('g')
               .attr("transform", `translate(0, ${height})`)
               .call(d3.axisBottom(x));
            
            svg.append('g')
               .call(d3.axisLeft(y));
        };



    }, [data]);
    return(
        <svg ref = {svgRef}></svg>
    )
};

export default CrimeCount;