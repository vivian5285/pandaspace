import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserHome } from './pages/UserHome';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<UserHome />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 