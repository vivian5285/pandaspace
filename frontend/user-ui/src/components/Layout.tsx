import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/trading">Trading</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <p>&copy; 2024 Trading Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 