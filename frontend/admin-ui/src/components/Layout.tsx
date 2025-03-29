import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/trading">Trading</Link></li>
          </ul>
        </nav>
      </header>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default Layout; 