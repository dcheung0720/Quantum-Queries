import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Navigation = () =>{
    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed">
            <Toolbar variant="dense">
              <Typography variant="h5" color="inherit" component="div">
                  <img className = "chicagoStars" src = {"/chicagoStar.png"}/> <img className = "chicagoStars" src = {"/chicagoStar.png"} />  Chicago Crime Analysis <img className = "chicagoStars" src = {"/chicagoStar.png"} /> <img className = "chicagoStars" src = {"/chicagoStar.png"} />
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      );
};

export default Navigation;