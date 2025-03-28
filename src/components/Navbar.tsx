import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      label: '账户设置',
      icon: Cog6ToothIcon,
      href: '/settings',
    },
    {
      label: '交易数据',
      icon: ChartBarIcon,
      href: '/statistics',
    },
    {
      label: '推广中心',
      icon: UserGroupIcon,
      href: '/referral',
    },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="熊猫量化"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                熊猫量化
              </span>
            </Link>
          </div>

          {/* 用户菜单 */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <span className="hidden sm:block font-medium">{user.name}</span>
            </button>

            {/* 下拉菜单 */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                {/* 用户信息 */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>

                {/* 菜单项 */}
                <div className="py-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-400" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* 退出登录 */}
                <div className="border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 