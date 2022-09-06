import { Container, Grid, Paper, Typography } from '@mui/material';

interface ScreenFrameProps {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export default function ScreenFrame({ name, children }: ScreenFrameProps) {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} pt={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6">{name}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12} pt={2}>
        <Paper elevation={1} sx={{ padding: 2 }}>
          {children}
        </Paper>
      </Grid>
    </Container>
  );
}
