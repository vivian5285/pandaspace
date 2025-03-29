import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  };

  return (
    <motion.div
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`${sizeClasses[size]} relative`}>
        {/* 熊猫头部 */}
        <div className="absolute inset-0 bg-panda-primary rounded-full">
          {/* 耳朵 */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-panda-primary rounded-full"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-panda-primary rounded-full"></div>
          {/* 眼睛 */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full"></div>
          {/* 鼻子 */}
          <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
      {variant === 'full' && (
        <span className={`font-display font-bold text-panda-primary ${textSizeClasses[size]}`}>
          熊猫量化
        </span>
      )}
    </motion.div>
  );
};

export default Logo; 