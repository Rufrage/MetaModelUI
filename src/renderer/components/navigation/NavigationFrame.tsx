import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const NavigationFrame = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Navigation />
      </Grid>
      <Grid item xs={9}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default NavigationFrame;
