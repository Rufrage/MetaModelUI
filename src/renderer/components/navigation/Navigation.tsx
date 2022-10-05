import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import TransformOutlinedIcon from '@mui/icons-material/TransformOutlined';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {
  Button,
  Container,
  Divider,
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
  useHotkeys('T', (event) => {
    event.preventDefault();
    navigate('/templates/');
  });
  useHotkeys('G', (event) => {
    event.preventDefault();
    navigate('/generate/');
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
              <Grid item pt={4}>
                {user ? (
                  <>
                    <Divider />
                    <MenuList>
                      <Typography
                        variant="body2"
                        sx={{
                          paddingLeft: 2,
                          paddingBottom: 1,
                          fontWeight: 600,
                        }}
                      >
                        Model
                      </Typography>
                      <MenuListItem
                        route="/"
                        label="Home"
                        hotkey="H"
                        icon={<HomeOutlinedIcon fontSize="small" />}
                      />
                      <MenuListItem
                        route="/objects/"
                        label="Objects"
                        hotkey="O"
                        icon={<DataObjectOutlinedIcon fontSize="small" />}
                        nested
                      />
                      <MenuListItem
                        route="/views/"
                        label="Views"
                        hotkey="V"
                        icon={
                          <AutoAwesomeMosaicOutlinedIcon fontSize="small" />
                        }
                        nested
                      />
                    </MenuList>
                    <Divider />
                    <MenuList>
                      <Typography
                        variant="body2"
                        sx={{
                          paddingLeft: 2,
                          paddingBottom: 1,
                          fontWeight: 600,
                        }}
                      >
                        Code
                      </Typography>
                      <MenuListItem
                        route="/templates/"
                        label="Templates"
                        hotkey="T"
                        icon={<TextSnippetIcon fontSize="small" />}
                      />
                      <MenuListItem
                        route="/generate/"
                        label="Generate"
                        hotkey="G"
                        icon={<TransformOutlinedIcon fontSize="small" />}
                      />
                    </MenuList>
                  </>
                ) : (
                  <MenuList>
                    <MenuListItem
                      route="/auth/"
                      label="Login"
                      hotkey="L"
                      icon={<LoginOutlinedIcon fontSize="small" />}
                    />
                    <MenuListItem
                      route="/auth/register/"
                      label="Register"
                      hotkey="R"
                      icon={<PersonAddAltOutlinedIcon fontSize="small" />}
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
