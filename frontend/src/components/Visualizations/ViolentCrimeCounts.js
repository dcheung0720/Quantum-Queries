import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactLoading from 'react-loading';


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


const ViolentCrimeCounts = ({data}) =>{
    //ward selection 
    const [ward, setWard] = useState('All');

    const svgRef = useRef();
    const violentCrimes = ['BATTERY', 'ASSAULT','ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE']
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
        const violentCrimesFiltered = ['BATTERY', 'ASSAULT', 'ROBBERY', 'CRIMINAL SEXUAL ASSAULT', 'HOMICIDE'].filter(x => checkedItems[x] == true);


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
  
        }
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
        <div style = {{display: "flex", justifyContent:"center", alignItems: "center"}}>
            <div className="controls" style = {{paddingLeft: "20px", paddingRight: "20px", width: "150px"}}>
                <h3>Controls</h3>
                <WardSelection ward = {ward} setWard={setWard}></WardSelection>
                <div className="checkboxes" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
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
            </div>
            {data != null? 
                <svg  className='graphs' ref = {svgRef}/>:
                <ReactLoading className='graphs' color = {"grey"}  height={'200px'} width={"200px"}></ReactLoading>
            }
            <div id="tooltip" style={{ position: "absolute", opacity: 0, backgroundColor: "white", padding: "10px", borderRadius: "5px", border: "1px solid black" }}></div>
        </div>
    )

};

const WardSelection = ({ward, setWard}) =>{

    const handleChange = (event) => {
        setWard(event.target.value);
    };

    let oneToFifty = Array.from(Array(50).keys());
    oneToFifty.unshift("All");

    return(
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label">Ward</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ward}
                label="Ward"
                onChange={handleChange}
                style={{width: "150px"}}
            >
                {oneToFifty.map(v => <MenuItem style={{textOverflow: 'ellipsis'}} value={v}>{v + 1} {chicagoWardsNeighborhoods[v + 1]}</MenuItem>)}
            </Select>
      </FormControl>
    )
};

export default ViolentCrimeCounts;