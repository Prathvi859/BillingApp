import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import Navbar from './components/Layout/Navbar';
import ItemsList from './components/Items/ItemsList';
import CreateInvoice from './components/Invoice/CreateInvoice';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<CreateInvoice />} />
            <Route path="/items" element={<ItemsList />} />
            <Route path="/invoices" element={<CreateInvoice />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
