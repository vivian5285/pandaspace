import React from 'react';
import { motion } from 'framer-motion';
import BrandAnimation from './BrandAnimation';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = '加载中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <BrandAnimation type="loading" size={150} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-lg text-gray-600 dark:text-gray-300"
      >
        {message}
      </motion.p>
    </div>
  );
};

export default LoadingState; 