import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
  }>;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  menuItems,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />

      {/* 菜单内容 */}
      <div className="relative flex flex-col w-full max-w-xs bg-white h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-50"
                onClick={onClose}
              >
                <item.icon className="mr-4 h-6 w-6 text-gray-400" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-gray-50"
          >
            <ArrowRightOnRectangleIcon className="mr-4 h-6 w-6" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  );
}; 