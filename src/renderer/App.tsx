import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NavigationFrame from 'renderer/components/navigation/NavigationFrame';
import AuthProvider from 'renderer/providers/AuthProvider';
import ObjectsProvider from 'renderer/providers/ObjectsProvider';
import LoginScreen from 'renderer/screens/auth/LoginScreen';
import RegisterScreen from 'renderer/screens/auth/RegisterScreen';
import HomeScreen from 'renderer/screens/home/HomeScreen';
import ObjectFormScreen from 'renderer/screens/object/ObjectFormScreen';
import ObjectListScreen from 'renderer/screens/object/ObjectListScreen';
import ObjectScreen from 'renderer/screens/object/ObjectScreen';
import './App.css';
import ViewsProvider from './providers/ViewsProvider';
import ViewFormScreen from './screens/view/ViewFormScreen';
import ViewListScreen from './screens/view/ViewListScreen';
import ViewScreen from './screens/view/ViewScreen';

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
        <ObjectsProvider>
          <ViewsProvider>
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
                </Route>
                <Route path="/auth/" element={<NavigationFrame basePath="/" />}>
                  <Route index element={<LoginScreen />} />
                  <Route path="/auth/register/" element={<RegisterScreen />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </ViewsProvider>
        </ObjectsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
