import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';
import { Route } from 'react-router-dom';
import { GeneratorPlugin } from '../GeneratorPlugin';
import ViewFormScreen from './view/ViewFormScreen';
import ViewListScreen from './view/ViewListScreen';
import ViewScreen from './view/ViewScreen';

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
        <Route path={route} element={<ViewScreen />}>
          <Route index element={<ViewListScreen />} />
          <Route path=":id" element={<ViewFormScreen />} />
        </Route>
      );
    },
  },
};

export default ViewPlugin;
