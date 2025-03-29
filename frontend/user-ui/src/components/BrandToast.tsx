import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandAnimation from './BrandAnimation';

interface BrandToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

const BrandToast: React.FC<BrandToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
}) => {
  const typeClasses = {
    success: 'bg-panda-success',
    warning: 'bg-panda-warning',
    error: 'bg-panda-error',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 z-50 ${typeClasses[type]} text-white p-4 rounded-lg shadow-lg flex items-center space-x-3`}
        >
          <BrandAnimation type="success" size={40} />
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-4 hover:opacity-80"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandToast; 