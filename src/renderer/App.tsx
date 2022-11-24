import {
  createTheme,
  CssBaseline,
  MenuItem,
  ThemeProvider,
} from '@mui/material';
import plugin from 'js-plugin';
import { useState, ReactElement, useEffect } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import 'renderer/App.css';
import NavigationFrame from 'renderer/components/navigation/NavigationFrame';
import AuthProvider from 'renderer/providers/AuthProvider';
import ObjectsProvider from 'renderer/providers/ObjectsProvider';
import TemplatesProvider from 'renderer/providers/TemplatesProvider';
import ViewsProvider from 'renderer/providers/ViewsProvider';
import LoginScreen from 'renderer/screens/auth/LoginScreen';
import RegisterScreen from 'renderer/screens/auth/RegisterScreen';
import GenerateListScreen from 'renderer/screens/generate/GenerateListScreen';
import GenerateScreen from 'renderer/screens/generate/GenerateScreen';
import HomeScreen from 'renderer/screens/home/HomeScreen';
import ObjectFormScreen from 'renderer/plugins/ObjectPlugin/object/ObjectFormScreen';
import ObjectListScreen from 'renderer/plugins/ObjectPlugin/object/ObjectListScreen';
import ObjectScreen from 'renderer/plugins/ObjectPlugin/object/ObjectScreen';
import TemplateFormScreen from 'renderer/screens/template/TemplateFormScreen';
import TemplateListScreen from 'renderer/screens/template/TemplateListScreen';
import TemplateScreen from 'renderer/screens/template/TemplateScreen';
import ViewFormScreen from 'renderer/plugins/ViewPlugin/view/ViewFormScreen';
import ViewListScreen from 'renderer/plugins/ViewPlugin/view/ViewListScreen';
import ViewScreen from 'renderer/plugins/ViewPlugin/view/ViewScreen';
import ObjectPlugin from './plugins/ObjectPlugin/ObjectPlugin';
import ViewPlugin from './plugins/ViewPlugin/ViewPlugin';
import BuildProfilesProvider from './providers/BuildProfileProvider';
import GenerateProvider from './providers/GenerateProvider';

const themes = {
  light: createTheme(),
  dark: createTheme({
    palette: { mode: 'dark' },
  }),
};

export default function App() {
  if (!plugin.getPlugin(ObjectPlugin.name)) {
    plugin.register(ObjectPlugin);
  }
  if (!plugin.getPlugin(ViewPlugin.name)) {
    plugin.register(ViewPlugin);
  }

  const [navigationRouteItems, setNavigationRouteItems] = useState<
    ReactElement[]
  >([]);

  useEffect(() => {
    const routeItems = plugin.invoke('menu.getNavigationRoutes');
    setNavigationRouteItems(routeItems as ReactElement[]);
  }, []);

  return (
    <ThemeProvider theme={themes.dark}>
      <CssBaseline />
      <AuthProvider>
        <BuildProfilesProvider>
          <TemplatesProvider>
            <ViewsProvider>
              <ObjectsProvider>
                <GenerateProvider>
                  <MemoryRouter>
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <NavigationFrame routesProtected loginPath="/auth" />
                        }
                      >
                        <Route index element={<HomeScreen />} />
                        <Route path="/templates/" element={<TemplateScreen />}>
                          <Route index element={<TemplateListScreen />} />
                          <Route path=":id" element={<TemplateFormScreen />} />
                        </Route>
                        <Route path="/generate/" element={<GenerateScreen />}>
                          <Route index element={<GenerateListScreen />} />
                        </Route>
                        {navigationRouteItems.map((navigationRouteItem) => {
                          return navigationRouteItem;
                        })}
                      </Route>
                      <Route
                        path="/auth/"
                        element={<NavigationFrame basePath="/" />}
                      >
                        <Route index element={<LoginScreen />} />
                        <Route
                          path="/auth/register/"
                          element={<RegisterScreen />}
                        />
                      </Route>
                    </Routes>
                  </MemoryRouter>
                </GenerateProvider>
              </ObjectsProvider>
            </ViewsProvider>
          </TemplatesProvider>
        </BuildProfilesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
