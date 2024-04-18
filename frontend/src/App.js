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



function App() {
  const [data, error] = useJsonData();
  const [year, setYear] = React.useState(0);

  const vistList = [{
                          graph: <CrimeCount data = {data}/>,
                          title: "How are the crime rates in the past few years?",
                          description: "DESCRIPTION"
                        },
                        {
                          graph: <ViolentCrimeCounts data = {data}/>,
                          title: "What about the violent crimes?",
                          description: "DESCRIPTION"
                        },
                        {
                          graph: <ViolentCrimesLeaftlet data = {data} year = {year} setYear={setYear}/>,
                          title: `Violent Crimes Across Different Wards and Neighborhood in ${2017 + year}`,
                          description: "DESCRIPTION"
                        },
                        {
                          graphs: ["/Holt/1.png", "/Holt/2.png", "/Holt/3.png","/Holt/4.png","/Holt/5.png"],
                          title: `How Are The Homicide Rates by Wards?`,
                          description: "This map of   Chicago is divided by ward. Chicago has fifty different wards each with their own elected alderman. Each map is colored on the basis of homicide count. The coloration ranges from a dark blue to a dark red. The darkest blue represents the safest wards by homicide count. While the darkest red represents the most dangerous or highest number of reported homicides in the given ward. These maps are broken out to show year over year data for 2017, 2018, 2021, 2022 and 2023."
                        }
                      ];
  

  return (
    <div className="App">
        <Card style={{marginLeft: "20px", marginRight: "20px", height: "100px", backgroundColor: "#B3DDF2"}}>
            <h1><img className = "chicagoStars" src = {"/chicagoStar.png"}/><img className = "chicagoStars" src = {"/chicagoStar.png"}/>Is Chicago Becoming More Violent? <img className = "chicagoStars" src = {"/chicagoStar.png"}/><img className = "chicagoStars" src = {"/chicagoStar.png"}/></h1>
        </Card>
        {vistList.map(component => 
          <Card style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px", backgroundColor: "#B3DDF2"}}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <b><em>{component.title}</em></b>
              </Typography>
                {component.graph? component.graph : <PhotoCards images = {component.graphs}/>}
              <hr></hr>
              <Typography variant="h5" color="text.primary" style={{textAlign:"left"}}>
                {component.description}
              </Typography>
            </CardContent>
          </Card>)
        }
    </div>
  );
}



export default App;
