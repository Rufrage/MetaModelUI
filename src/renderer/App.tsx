import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationFrame from 'renderer/components/navigation/NavigationFrame';
import ObjectsScreen from 'renderer/screens/ObjectsScreen';
import './App.css';

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
      <Router>
        <Routes>
          <Route path="/" element={<NavigationFrame />}>
            <Route index element={<ObjectsScreen />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
