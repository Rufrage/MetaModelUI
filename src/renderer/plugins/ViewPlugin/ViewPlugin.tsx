import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import { Route } from 'react-router-dom';
import ObjectFormScreen from 'renderer/plugins/ObjectPlugin/object/ObjectFormScreen';
import ObjectListScreen from 'renderer/plugins/ObjectPlugin/object/ObjectListScreen';
import ObjectScreen from 'renderer/plugins/ObjectPlugin/object/ObjectScreen';
import { GeneratorPlugin } from '../GeneratorPlugin';

const route = '/views/';

const ViewPlugin: GeneratorPlugin = {
  name: 'Views',
  route,
  menu: {
    getMenuItems() {
      return {
        menuName: 'Views',
        hotkey: 'V',
        icon: <AutoAwesomeMosaicOutlinedIcon fontSize="small" />,
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

export default ViewPlugin;
