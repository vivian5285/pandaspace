import React from 'react';
import Lottie from 'react-lottie';
import { motion } from 'framer-motion';

interface BrandAnimationProps {
  type: 'welcome' | 'thinking' | 'success' | 'loading';
  size?: number;
}

const BrandAnimation: React.FC<BrandAnimationProps> = ({ type, size = 200 }) => {
  const animations = {
    welcome: require('../assets/animations/panda-welcome.json'),
    thinking: require('../assets/animations/panda-thinking.json'),
    success: require('../assets/animations/panda-success.json'),
    loading: require('../assets/animations/panda-loading.json'),
  };

  const options = {
    loop: true,
    autoplay: true,
    animationData: animations[type],
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Lottie options={options} height={size} width={size} />
    </motion.div>
  );
};

export default BrandAnimation; 