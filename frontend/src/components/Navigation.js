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
                Chicago Crime Analysis
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      );
};

export default Navigation;