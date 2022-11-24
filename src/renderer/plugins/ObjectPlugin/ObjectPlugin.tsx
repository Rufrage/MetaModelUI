import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import { Route } from 'react-router-dom';
import ViewFormScreen from 'renderer/plugins/ViewPlugin/view/ViewFormScreen';
import ViewListScreen from 'renderer/plugins/ViewPlugin/view/ViewListScreen';
import ViewScreen from 'renderer/plugins/ViewPlugin/view/ViewScreen';
import { GeneratorPlugin } from '../GeneratorPlugin';

const route = '/objects/';

const ObjectPlugin: GeneratorPlugin = {
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
        <Route path={route} element={<ViewScreen />}>
          <Route index element={<ViewListScreen />} />
          <Route path=":id" element={<ViewFormScreen />} />
        </Route>
      );
    },
  },
};

export default ObjectPlugin;
