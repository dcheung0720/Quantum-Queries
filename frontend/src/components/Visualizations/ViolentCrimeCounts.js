import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const ViolentCrimeCounts = ({data}) =>{
    //ward selection 
    const [ward, setWard] = useState('All');

    const svgRef = useRef();
    const violentCrimes = ['BATTERY', 'ASSAULT', 'CRIM SEXUAL ASSAULT', 'ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE']
    // checkbox states
    const [checkedItems, setCheckedItems] = useState(() => {
        return violentCrimes.reduce((acc, crimeType) => {
          acc[crimeType] = true;
          return acc;
        }, {});
      });

    useEffect(() =>{
        const svg = d3.select(svgRef.current);
        // dimensions
        const w = 700;
        const h = 400;

        const margin = {top: 30, bottom: 0, left: 50, right: 30};
        const height = h - margin.top - margin.bottom;
        const width = w - margin.left - margin.right;   

        const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
        const violentCrimesFiltered = ['BATTERY', 'ASSAULT', 'CRIM SEXUAL ASSAULT', 'ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE'].filter(x => checkedItems[x] == true);


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
            const wardCol = columns.indexOf("Ward");
            
            //configure data into labels and data points for each crime type and ward
            const crimeData = years.map(year => {
                return({
                    label: year,
                    crimeCounts: violentCrimesFiltered.map(crime => 
                            {
                                return ward === "All"? data["data"].filter(d => d[yearCol] === year && d[crimeTypeCol] === crime).length : 
                                                       data["data"].filter(d => d[yearCol] === year && d[crimeTypeCol] === crime && d[wardCol] === ward).length
                            }
                    )}
                )
            });

            console.log(crimeData)
            const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width]).padding(0.2);

            const yCrimes = crimeData.map(crime => crime.crimeCounts.reduce((cum, cur) => cum + cur), 0);
            
            const yMax = Math.max(...yCrimes) * 1.2;

            const yScale = d3.scaleLinear()
                        .domain([0, yMax])
                        .range([height, margin.top]);
            const colorScale = d3.scaleOrdinal()
                        .domain(violentCrimesFiltered)
                        .range(d3.schemeCategory10);
            

            //create stack data for easier processing.
            const stackedData = d3.stack()
            .keys(violentCrimesFiltered)
            .offset(d3.stackOffsetNone)
            .order(d3.stackOrderNone)
            (crimeData.map(d => {
              const obj = {};
              violentCrimesFiltered.forEach((key, i) => {
                obj[key] = d.crimeCounts[i];
              });
              obj.label = d.label;
              return obj;
            }));

            // x axis
            svg.append("g")
            .attr('transform', `translate(${margin.left}, ${height})`)
            .call(d3.axisBottom(xScale));

            // Title
            svg.append("text")
                .attr("x", width/3)
                .attr("y", margin.top)
                .text("Violent Crimes 2017 - 2023")
                .style("font-size", "20px")

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
                        .attr("width", xScale.bandwidth())
                        .on("mouseover", handleMouseOver)  // Show tooltip on mouseover
                        .on("mouseout", handleMouseOut)    // Hide tooltip on mouseout
                        .transition()
                        .duration(1000)
                        .attr("y", (d, i) => yScale(d[1]))
                        .attr("height", (d, i) => yScale(d[0]) - yScale(d[1]));

            // legend
            const legend = svg.append('g')
                           .attr("class", 'legend')
                           .attr('transform', `translate(${width - margin.left - 100}, 5)`);
            const legendRectSize = 16;
            const legendSpacing = 3;
            
            const legendItems = legend.selectAll('g')
                               .data(violentCrimesFiltered)
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

    }, [data, checkedItems, ward])

    const handleChange = (e) =>{
        const {name, checked} = e.target;
        setCheckedItems(
            {
                ...checkedItems,
                [name]: checked
            }
        )
    };

    return(
        <div style = {{display: "flex", flexDirection: "column"}}>
            <WardSelection ward = {ward} setWard={setWard}></WardSelection>
            <div style = {{width: 700, height: 50}}>
                {violentCrimes.map(crime => 
                    <FormControlLabel
                        label= {crime}
                        control = {<Checkbox
                                    checked={checkedItems[crime]}
                                    name = {crime}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                    />}
                    />
                )}
            </div>
            <svg  className='graphs' ref = {svgRef}></svg>
            <div id="tooltip" style={{ position: "absolute", opacity: 0, backgroundColor: "white", padding: "10px", borderRadius: "5px", border: "1px solid black" }}></div>
        </div>
    )

};

const WardSelection = ({ward, setWard}) =>{

    const handleChange = (event) => {
        setWard(event.target.value);
    };

    const oneToFifty = Array.from(Array(50).keys());

    return(
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Ward</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ward}
          label="Ward"
          onChange={handleChange}
        >
          {oneToFifty.map(v => <MenuItem value={v}>{v}</MenuItem>)}
        </Select>
      </FormControl>
    )
};

export default ViolentCrimeCounts;