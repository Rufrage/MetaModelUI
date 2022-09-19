import {
  Button,
  Container,
  Grid,
  MenuList,
  Paper,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'renderer/providers/AuthProvider';
import MenuListItem from './MenuLinkItem';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  /** Call Link programmatically on hotkey press */
  const navigate = useNavigate();
  useHotkeys('H', (event) => {
    event.preventDefault();
    navigate('/');
  });
  useHotkeys('O', (event) => {
    event.preventDefault();
    navigate('/objects/');
  });
  useHotkeys('V', (event) => {
    event.preventDefault();
    navigate('/views/');
  });
  useHotkeys('L', (event) => {
    event.preventDefault();
    navigate('/auth/');
  });
  useHotkeys('R', (event) => {
    event.preventDefault();
    navigate('/auth/register/');
  });

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2} sx={{ height: '100vh', paddingBottom: 2 }}>
          <Paper elevation={1} sx={{ height: '100%', flex: '1' }}>
            <Grid container direction="column" sx={{ height: '100%' }}>
              <Grid item pt={2} pl={2}>
                <Typography variant="h6">Navigation</Typography>
              </Grid>
              <Grid item>
                {user ? (
                  <MenuList>
                    <MenuListItem route="/" label="Home" hotkey="H" />
                    <MenuListItem
                      route="/objects/"
                      label="Objects"
                      hotkey="O"
                    />
                    <MenuListItem route="/views/" label="Views" hotkey="V" />
                  </MenuList>
                ) : (
                  <MenuList>
                    <MenuListItem route="/auth/" label="Login" hotkey="L" />
                    <MenuListItem
                      route="/auth/register/"
                      label="Register"
                      hotkey="R"
                    />
                  </MenuList>
                )}
              </Grid>
              {user && (
                <Grid item paddingX={2} marginTop="auto" marginBottom={2}>
                  <Button
                    type="button"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Navigation;
