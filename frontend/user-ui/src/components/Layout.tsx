import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import BrandAnimation from './BrandAnimation';
import { useTheme } from '../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-panda-background'}`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Logo variant="full" size="medium" />
            </Link>
            <div className="flex items-center space-x-8">
              <nav>
                <ul className="flex space-x-8">
                  <li>
                    <Link to="/" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-panda-accent'}`}>
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link to="/trading" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-panda-accent'}`}>
                      交易
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-panda-accent'}`}>
                      个人中心
                    </Link>
                  </li>
                </ul>
              </nav>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-panda-primary'} text-white py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg mb-4">让每一个普通人，也能拥有自己的交易策略。</p>
            <p className="text-sm opacity-75">&copy; 2024 熊猫量化. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 