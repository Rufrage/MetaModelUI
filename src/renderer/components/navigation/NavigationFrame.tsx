/* eslint-disable no-nested-ternary */
import { Grid } from '@mui/material';
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from 'renderer/providers/AuthProvider';
import Navigation from './Navigation';

interface NavigationFrameProps {
  routesProtected?: boolean;
  loginPath?: string;
  basePath?: string;
}

const NavigationFrame = ({
  routesProtected = false,
  loginPath = '/',
  basePath = '/',
}: NavigationFrameProps) => {
  const { user } = useContext(AuthContext);
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Navigation />
      </Grid>
      <Grid item xs={9}>
        {routesProtected ? (
          /** If the routes are protected and the user is not logged in, route to the login path */
          !user ? (
            <Navigate to={loginPath} />
          ) : (
            <Outlet />
          )
        ) : /** If the route is not protected (auth screens) and the user is logged in, route to the base path */
        user != null ? (
          <Navigate to={basePath} />
        ) : (
          <Outlet />
        )}
      </Grid>
    </Grid>
  );
};

export default NavigationFrame;
