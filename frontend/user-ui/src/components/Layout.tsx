import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="user-layout">
      <header className="user-header">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/trading">Trading</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </nav>
      </header>
      <main className="user-main">
        {children}
      </main>
      <footer className="user-footer">
        <p>&copy; 2024 Panda Trade. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout; 