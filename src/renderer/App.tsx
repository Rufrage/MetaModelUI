import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
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
import ObjectFormScreen from 'renderer/screens/object/ObjectFormScreen';
import ObjectListScreen from 'renderer/screens/object/ObjectListScreen';
import ObjectScreen from 'renderer/screens/object/ObjectScreen';
import TemplateFormScreen from 'renderer/screens/template/TemplateFormScreen';
import TemplateListScreen from 'renderer/screens/template/TemplateListScreen';
import TemplateScreen from 'renderer/screens/template/TemplateScreen';
import ViewFormScreen from 'renderer/screens/view/ViewFormScreen';
import ViewListScreen from 'renderer/screens/view/ViewListScreen';
import ViewScreen from 'renderer/screens/view/ViewScreen';

const themes = {
  light: createTheme(),
  dark: createTheme({
    palette: { mode: 'dark' },
  }),
};

export default function App() {
  return (
    <ThemeProvider theme={themes.dark}>
      <CssBaseline />
      <AuthProvider>
        <TemplatesProvider>
          <ViewsProvider>
            <ObjectsProvider>
              <MemoryRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <NavigationFrame routesProtected loginPath="/auth" />
                    }
                  >
                    <Route index element={<HomeScreen />} />
                    <Route path="/objects/" element={<ObjectScreen />}>
                      <Route index element={<ObjectListScreen />} />
                      <Route path=":id" element={<ObjectFormScreen />} />
                    </Route>
                    <Route path="/views/" element={<ViewScreen />}>
                      <Route index element={<ViewListScreen />} />
                      <Route path=":id" element={<ViewFormScreen />} />
                    </Route>
                    <Route path="/templates/" element={<TemplateScreen />}>
                      <Route index element={<TemplateListScreen />} />
                      <Route path=":id" element={<TemplateFormScreen />} />
                    </Route>
                    <Route path="/generate/" element={<GenerateScreen />}>
                      <Route index element={<GenerateListScreen />} />
                    </Route>
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
            </ObjectsProvider>
          </ViewsProvider>
        </TemplatesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
