import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import plugin from 'js-plugin';
import { Route } from 'react-router-dom';
import { GeneratorPlugin } from '../GeneratorPlugin';
import ObjectFormScreen from './object/ObjectFormScreen';
import ObjectListScreen from './object/ObjectListScreen';
import ObjectScreen from './object/ObjectScreen';

const route = '/objects/';

export const ObjectPlugin: GeneratorPlugin = {
  name: 'Object',
  route,
  menu: {
    getMenuItems() {
      return {
        menuName: 'Objects',
        hotkey: 'O',
        icon: <DataObjectOutlinedIcon fontSize="small" />,
        route,
      };
    },
    getNavigationRoutes() {
      return (
        <Route path={route} element={<ObjectScreen />}>
          <Route index element={<ObjectListScreen />} />
          <Route path=":id" element={<ObjectFormScreen />} />
        </Route>
      );
    },
  },
};

export const init = () => {
  if (!plugin.getPlugin(ObjectPlugin.name)) {
    plugin.register(ObjectPlugin);
    console.log('ObjectPlugin registered successfully!');
  } else {
    console.log('ObjectPlugin already registered!');
  }
};
