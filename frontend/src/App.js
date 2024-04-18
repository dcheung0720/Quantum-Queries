import logo from './logo.svg';
import './App.css';
import CrimeCount from './components/Visualizations/CrimeCount';
import useJsonData from './utilities/jsonData';
import ViolentCrimeCounts from './components/Visualizations/ViolentCrimeCounts';
import ViolentCrimesLeaftlet from './components/Visualizations/VioletCrimesLeaflet';
import PhotoCards from './components/Visualizations/PhotoCards';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


function App() {
  const [data, error] = useJsonData();
  const [year, setYear] = React.useState(0);

  const vistList = [{
                          graph: <CrimeCount data = {data}/>,
                          title: "How are the crime rates in the past few years?",
                          icon: <TrendingUpIcon style={{ color: 'red' }}/>,
                          descriptions: ["From 2017 to 2023, crime rates in Chicago remained relatively stable, experiencing a noticeable decrease during the Covid-19 pandemic. However, since the peak of the pandemic, crime rates have been on the rise, approaching pre-pandemic levels. This upward trend suggests that Chicago may be experiencing an increase in crime, potentially surpassing the levels seen before Covid-19, raising concerns about public safety in the city."]
                        },
                        {
                          graph: <ViolentCrimeCounts data = {data}/>,
                          title: "What about the violent crimes?",
                          icon: <TrendingUpIcon/>,
                          descriptions: [
                            "The overall trend in crime rates in Chicago, encompassing theft, fraud, and hate crimes, mirrors the pattern observed in violent crimes. There was a decline during the Covid-19 pandemic, followed by a steady increase as the pandemic subsided. This rising trend in violent crimes is alarming and contributes to feelings of insecurity among residents of Chicago.",    
                            "However, not all categories of violent crimes show the same trend. Homicides peaked during the Covid-19 lockdowns, likely attributed to more people staying at home. Since then, the homicide rate has been gradually decreasing, approaching or possibly even falling below pre-pandemic levels.",
                            "In contrast, criminal sexual assault has seen a continuous increase since before the pandemic, with a surge during the Covid-19 period that has persisted to the present day."]
                        },
                        {
                          graph: <ViolentCrimesLeaftlet data = {data} year = {year} setYear={setYear}/>,
                          title: `Violent Crimes Across Different Wards and Neighborhood in ${2017 + year}`,
                          icon: <TrendingUpIcon/>,
                          descriptions: ["While violent crime rates are on the rise, the impact isn't uniform across all areas of Chicago. A map detailing violent crimes across the city's wards from 2017 to 2023 reveals varying trends. The Northside and southwest side exhibit fluctuating rates, with some areas seeing decreases while others experience increases, though numbers remain consistently high, ranging from 500 to 1000 incidents.",
                                          "A striking observation from the map is the persistent red shading over the loop and southside of Chicago, indicating these areas haven't seen improvements in safety. In fact, they may have become even more perilous over the years.",
                                          "While certain parts of Chicago are witnessing a decline in violent crimes, many wards and neighborhoods continue to grapple with consistently high levels of violent incidents."
                          ] 
                        },
                        {
                          graphs: ["/Holt/1.png", "/Holt/2.png", "/Holt/3.png","/Holt/4.png","/Holt/5.png"],
                          title: `How Are The Homicide Rates by Wards?`,
                          icon: <TrendingUpIcon/>,
                          descriptions: ["This map of Chicago is divided by ward. Chicago has fifty different wards each with their own elected alderman. Each map is colored on the basis of homicide count. The coloration ranges from a dark blue to a dark red. The darkest blue represents the safest wards by homicide count. While the darkest red represents the most dangerous or highest number of reported homicides in the given ward. These maps are broken out to show year over year data for 2017, 2018, 2021, 2022 and 2023.",]
                        }
                      ];
  

  return (
    <div className="App">
        <Card style={{marginLeft: "20px", marginRight: "20px", height: "100px", backgroundColor: "#B3DDF2"}}>
            <h1><img className = "chicagoStars" src = {"/chicagoStar.png"}/><img className = "chicagoStars" src = {"/chicagoStar.png"}/>Is Chicago Becoming More Dangerous? <img className = "chicagoStars" src = {"/chicagoStar.png"}/><img className = "chicagoStars" src = {"/chicagoStar.png"}/></h1>
        </Card>
        {vistList.map(component => 
          <Card style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px", backgroundColor: "#B3DDF2"}}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <b><em>{component.title} {component.icon}</em></b>
              </Typography>
                {component.graph? component.graph : <PhotoCards images = {component.graphs}/>}
              <hr></hr>
              <Typography variant="h6" color="text.primary" style={{textAlign:"left"}}>
                {component.descriptions.map(description => <p>{description}</p>)}
              </Typography>
            </CardContent>
          </Card>)
        }
    </div>
  );
}



export default App;
