import {
  Button,
  Container,
  Grid,
  MenuList,
  Paper,
  Typography,
} from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from 'renderer/providers/AuthProvider';
import MenuListItem from './MenuLinkItem';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2} sx={{ height: '100vh', paddingBottom: 2 }}>
          <Paper elevation={1} sx={{ padding: 2, height: '100%', flex: '1' }}>
            <Typography variant="h6">Navigation</Typography>
            {user ? (
              <MenuList>
                <MenuListItem route="/" label="Home" hotkey="H" />
                <MenuListItem route="/objects" label="Objects" hotkey="O" />
              </MenuList>
            ) : (
              <MenuList>
                <MenuListItem route="/auth" label="Login" hotkey="L" />
                <MenuListItem
                  route="/auth/register"
                  label="Register"
                  hotkey="R"
                />
              </MenuList>
            )}
            {user && (
              <Grid container direction="row" alignItems="flex-end">
                <Grid item>
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
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Navigation;
