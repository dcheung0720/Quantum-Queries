import logo from './logo.svg';
import './App.css';
import CrimeCount from './components/Visualizations/CrimeCount';
import useJsonData from './utilities/jsonData';
import ViolentCrimeCounts from './components/Visualizations/ViolentCrimeCounts';
import ViolentCrimesLeaftlet from './components/Visualizations/VioletCrimesLeaflet';

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

  const componentList = [{
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
                        }
                      ];
  return (
    <div className="App">
        <Card style={{marginLeft: "20px", marginRight: "20px", height: "100px"}}>
            <h1>Is Chicago Becoming More Violent?</h1>
        </Card>
        {componentList.map(component => 
        <Card style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px"}}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              <em>{component.title}</em>
            </Typography>
              {component.graph}
            <Typography variant="body2" color="text.secondary">
              {component.description}
            </Typography>
          </CardContent>
        </Card>)}
    </div>
  );
}



export default App;
