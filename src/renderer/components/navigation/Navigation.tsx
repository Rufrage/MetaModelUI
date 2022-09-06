import { Container, Grid, MenuList, Paper, Typography } from '@mui/material';
import MenuListItem from './MenuLinkItem';

const Navigation = () => {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2} sx={{ height: '100vh', paddingBottom: 2 }}>
          <Paper elevation={1} sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6">Navigation</Typography>
            <MenuList>
              <MenuListItem route="/" label="Home" hotkey="H" />
              <MenuListItem route="/objects" label="Objects" hotkey="O" />
              <MenuListItem route="/register" label="Register" hotkey="R" />
            </MenuList>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Navigation;
