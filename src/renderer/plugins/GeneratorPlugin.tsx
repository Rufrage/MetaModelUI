import { Plugin } from 'js-plugin';
import { ReactElement } from 'react';

interface MenuItem {
  menuName?: string;
  hotkey?: string;
  icon?: JSX.Element;
  route?: string;
}

interface GeneratorPlugin extends Plugin {
  route: string;
  menu: {
    getMenuItems?: () => MenuItem;
    getNavigationRoutes?: () => ReactElement;
  };
}

export { MenuItem, GeneratorPlugin };
