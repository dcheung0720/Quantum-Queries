import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const CrimeCount = ({data}) =>{
    const svgRef = useRef();

    useEffect(()=>{
        const w = 700;
        const h = 400;

        const svg = d3.select(svgRef.current);
        const margin = {top: 25, bottom: 20, left: 20, right: 30};
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;

        const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const x = d3.scaleBand().range([0, width]).domain(years).padding(0.2);
        const y = d3.scaleLinear().range([height, 0]).domain([0, 300000]);

        const startingYear = 2022;
        if(data != null){
            const columns = data["columns"];
            const yearCol = columns.indexOf("Year");
            //get data where year >= 2017 and <= 2023
            const countData = years.map(year => {
                return({
                    label: year,
                    counts: data["data"].filter(d => d[yearCol] === year).length
                })
            });

            //remove all svg contents
            svg.selectAll('*').remove();

            //append the bars
            svg.attr("width", w)
               .attr("height", h)
               .append('g')
               .selectAll('rect')
               .data(countData)
               .enter().append('rect')
               .attr("transform", `translate(${margin.left * 3}, 0)`)
               .attr('x', d => x(d.label))
               .attr('y', d => y(d.counts) + margin.top)
               .attr('width', x.bandwidth())
               .transition()
               .duration(1000)
               .attr('height', d => height - y(d.counts))
               .attr('fill', 'steelblue');
            //append the texts on the bar
            svg.select('g')
               .selectAll('text')
               .data(countData)
               .enter()
               .append('text')
               .attr("x", d => x(d.label) + x.bandwidth() / 2 + margin.left * 3)
               .attr("y", d => y(d.counts) - 5 + margin.top)
               .attr('text-anchor', 'middle')
               .text(d => d.counts)
               .attr('fill', 'black')
               .style('font-size', '12px');

            //add axis
            svg.append('g')
               .attr("transform", `translate(${margin.left * 3}, ${height + margin.top})`)
               .call(d3.axisBottom(x));
               
            svg.append('g')
                .attr("transform", `translate(${margin.left * 3}, ${margin.top})`)
                .call(d3.axisLeft(y)); 
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - (height/2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Count");

            //title
            svg.append("text")
                .attr("x", width/1.8)
                .attr("y", margin.top)
                .style("text-anchor", "middle")
                .style("font-size", "20px")
                .text("Crimes Between 2017 - 2023");
        };



    }, [data]);
    return(
        <svg className='graphs' ref = {svgRef}></svg>
    )
};

export default CrimeCount;