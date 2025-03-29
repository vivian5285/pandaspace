import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { ThemeProvider } from './theme/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import Register from './components/Register';
import MultiChainWallet from './pages/MultiChainWallet';
import ProfitDistribution from './pages/ProfitDistribution';
import CustodyFee from './pages/CustodyFee';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Pandaspace
              </Typography>
              <LanguageSelector />
              <ThemeToggle />
            </Toolbar>
          </AppBar>
          <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
            {!isAuthenticated ? (
              <Register onSuccess={handleRegisterSuccess} />
            ) : (
              <Routes>
                <Route path="/" element={<MultiChainWallet />} />
                <Route path="/profit" element={<ProfitDistribution />} />
                <Route path="/custody-fee" element={<CustodyFee />} />
              </Routes>
            )}
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 