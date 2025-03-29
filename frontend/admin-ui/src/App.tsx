import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StrategyManagement from './pages/StrategyManagement';
import SystemSettings from './pages/SystemSettings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/strategies" element={<StrategyManagement />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 