import { Card, Typography } from '@mui/material';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';

export default function HomeScreen() {
  return (
    <ScreenFrame name="Home">
      <Card elevation={2} sx={{ padding: 2 }}>
        <Typography variant="h6">Welcome</Typography>
      </Card>
    </ScreenFrame>
  );
}
