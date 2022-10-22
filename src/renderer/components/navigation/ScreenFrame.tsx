import { Container, Grid, Paper, Typography } from '@mui/material';

interface ScreenFrameProps {
  name: string;
  children: JSX.Element | JSX.Element[];
}

export default function ScreenFrame({ name, children }: ScreenFrameProps) {
  return (
    <Container sx={{ height: '100%' }}>
      <Grid container direction="column" sx={{ height: '100%' }}>
        <Grid item padding={2}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6">{name}</Typography>
          </Paper>
        </Grid>
        <Grid item xs padding={2}>
          <Paper
            elevation={1}
            sx={{
              padding: 2,
              minHeight: '100%',
              maxHeight: '500px',
              overflow: 'auto',
            }}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
