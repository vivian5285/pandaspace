import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg bg-white">
      {type === 'success' ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
      )}
      <p className="text-sm text-gray-700">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-500"
      >
        ×
      </button>
    </div>
  );
}; 