import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VideoManagement from './pages/VideoManagement';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/videos" element={<VideoManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 