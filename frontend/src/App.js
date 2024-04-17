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
                          graph: <ViolentCrimesLeaftlet data = {data}/>,
                          title: "What about the violent crimes?",
                          description: "DESCRIPTION"
                        }
                      ];
  return (
    <div className="App">
        <h1>Are There More Violent Crimes in Chicago?</h1>
        {componentList.map(component => 
        <Card style={{marginTop: "30px", marginLeft: "20px", marginRight: "20px"}}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {component.title}
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
