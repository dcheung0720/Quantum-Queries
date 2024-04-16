import { useEffect, useRef } from "react";
import * as d3 from 'd3';

const ViolentCrimeCounts = ({data}) =>{
    const svgRef = useRef();

    useEffect(() =>{
        const svg = d3.select(svgRef.current);
        // dimensions
        const w = 700;
        const h = 400;

        const margin = {top: 30, bottom: 0, left: 50, right: 30};
        const height = h - margin.top - margin.bottom;
        const width = w - margin.left - margin.right;   

        const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const violentCrimes = ['BATTERY', 'ASSAULT', 'CRIM SEXUAL ASSAULT', 'ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE'];
        const xScale = d3.scaleBand()
                        .domain(years)
                        .range([0, width]).padding(0.2);
        const yScale = d3.scaleLinear()
                        .domain([0, 100000])
                        .range([height, margin.top]);
        const colorScale = d3.scaleOrdinal()
                           .domain(violentCrimes)
                           .range(d3.schemeCategory10);


        if(data != null){
            svg.selectAll('*').remove();

            // tooltip
            // Add this function to show the tooltip
            const handleMouseOver = (event, d) => {
                const tooltip = d3.select("#tooltip");
                tooltip.style("opacity", 1)
                .style("left", event.pageX + "px")
                .style("top", event.pageY + "px")
                .html(`Year: ${d.data.label}<br> #cases: ${d[1] - d[0]}`);
            };
            
            // Add this function to hide the tooltip
            const handleMouseOut = () => {
                const tooltip = d3.select("#tooltip");
                tooltip.style("opacity", 0);
            };

            const columns = data["columns"];
            const yearCol = columns.indexOf("Year");
            const crimeTypeCol = columns.indexOf("Primary Type");
            
            //configure data into labels and data points for each crime type.
            const crimeData = years.map(year => {
                return({
                    label: year,
                    crimeCounts: violentCrimes.map(crime => 
                            data["data"].filter(d => d[yearCol] === year && d[crimeTypeCol] === crime).length
                    )}
                )
            });
            

            //create stack data for easier processing.
            const stackedData = d3.stack()
            .keys(violentCrimes)
            .offset(d3.stackOffsetNone)
            .order(d3.stackOrderNone)
            (crimeData.map(d => {
              const obj = {};
              violentCrimes.forEach((key, i) => {
                obj[key] = d.crimeCounts[i];
              });
              obj.label = d.label;
              return obj;
            }));

            // x axis
            svg.append("g")
            .attr('transform', `translate(${margin.left}, ${height})`)
            .call(d3.axisBottom(xScale));

            // y axis   
            svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(yScale));

            // bars
            svg.attr("width", w)
                .attr("height", h)
                .selectAll("Bar")
                .data(stackedData)
                .enter().append("g")
                    .attr("class", "bar")
                    .attr("fill", d => colorScale(d.key))
                    .selectAll("rect")
                    .data(d => d)
                    .enter().append("rect")
                        .attr("x", (d, i) => xScale(d.data.label) + margin.left)
                        .attr("y", (d, i) => yScale(d[1]))
                        .attr("width", xScale.bandwidth())
                        .attr("height", (d, i) => yScale(d[0]) - yScale(d[1]))
                        .on("mouseover", handleMouseOver)  // Show tooltip on mouseover
                        .on("mouseout", handleMouseOut)    // Hide tooltip on mouseout
                        .transition()
                        .duration(1000);

            // legend
            const legend = svg.append('g')
                           .attr("class", 'legend')
                           .attr('transform', `translate(${width - margin.left - 100}, 5)`);
            const legendRectSize = 16;
            const legendSpacing = 3;
            
            const legendItems = legend.selectAll('g')
                               .data(violentCrimes)
                               .enter().append('g')
                               .attr('transform', (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

            legendItems.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("fill", d => colorScale(d));
            
            legendItems.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
                                .text(d => d);
  
        };


    }, [data])

    return(
        <>
            <svg ref = {svgRef} style={{backgroundColor: "white", marginTop: "20px", borderRadius: "10px", border: "4px solid black"}}></svg>
            <div id="tooltip" style={{ position: "absolute", opacity: 0, backgroundColor: "white", padding: "10px", borderRadius: "5px", border: "1px solid black" }}></div>
        </>
    )

};

export default ViolentCrimeCounts;