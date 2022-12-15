import { Button, Card, Typography } from '@mui/material';
// import { PluginManager } from 'live-plugin-manager';
import ScreenFrame from 'renderer/components/navigation/ScreenFrame';

export default function HomeScreen() {
  return (
    <ScreenFrame name="Home">
      <Card elevation={2} sx={{ padding: 2 }}>
        <Typography variant="h6">Welcome</Typography>
      </Card>
      <Card elevation={2} sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h6">New Packages</Typography>
        <Button
          variant="contained"
          onClick={async () => {
            console.log('Clicked.');
            const result = await window.plugins.installModule(
              'C:\\Users\\Ruben\\Downloads\\Testpackage'
            );
            if (result) {
              console.log('Package installed successfully.');

              // const manager = new PluginManager();
              // const pckg = manager.require('mmuiplugintest');
              console.log(result);
            } else {
              console.log('Error installing the package.');
            }
          }}
        >
          Install
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            console.log('Clicked.');
            const result = await window.plugins.requireModule('mmuiplugintest');
            if (result) {
              console.log('Required successfully');
              console.log(result);
              const pluginInstance = result.createInstance();
              console.log('Plugin Instance: ', pluginInstance);
            } else {
              console.log('Error requiring the plugin.');
            }
          }}
        >
          Require
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('generate', []);
          }}
        >
          Generate
        </Button>
      </Card>
    </ScreenFrame>
  );
}
