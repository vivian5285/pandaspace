import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';

interface DynamicFeedbackProps {
  type: 'success' | 'error' | 'info';
  message: string;
  animationData: any;
  isVisible: boolean;
  onClose: () => void;
}

const DynamicFeedback: React.FC<DynamicFeedbackProps> = ({
  type,
  message,
  animationData,
  isVisible,
  onClose,
}) => {
  const options = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const bgColor = {
    success: 'bg-green-100',
    error: 'bg-red-100',
    info: 'bg-blue-100',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed bottom-4 right-4 ${bgColor[type]} rounded-lg shadow-lg p-4 flex items-center space-x-4`}
        >
          <div className="w-12 h-12">
            <Lottie options={options} height={48} width={48} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{message}</p>
            <button
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              关闭
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DynamicFeedback; 