import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import { motion, AnimatePresence } from 'framer-motion';

interface PandaMascotProps {
  position?: 'top' | 'bottom' | 'side';
  size?: number;
  page?: 'dashboard' | 'trading' | 'profile' | 'strategy-market' | 'daily-brief';
  showTutorial?: boolean;
}

const messages = {
  dashboard: "欢迎回来，今天继续发大财！",
  trading: "需要我帮你分析一下吗？",
  profile: "记得补全个人资料哦~",
  'strategy-market': "让我帮你找到最适合的策略！",
  'daily-brief': "今天市场有什么新变化呢？"
};

const tutorials = {
  dashboard: [
    { title: "账户概览", content: "这里可以看到你的总资产和收益情况" },
    { title: "持仓管理", content: "查看和管理你的当前持仓" },
    { title: "交易历史", content: "查看你的历史交易记录" }
  ],
  trading: [
    { title: "实时行情", content: "查看最新的市场行情" },
    { title: "交易操作", content: "在这里进行买入和卖出操作" },
    { title: "风险控制", content: "设置止损和止盈来保护你的投资" }
  ],
  'strategy-market': [
    { title: "策略选择", content: "浏览不同的交易策略" },
    { title: "参数配置", content: "根据你的需求调整策略参数" },
    { title: "回测分析", content: "查看策略的历史表现" }
  ]
};

const PandaMascot: React.FC<PandaMascotProps> = ({
  position = 'bottom',
  size = 150,
  page = 'dashboard',
  showTutorial = false
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const options = {
    loop: true,
    autoplay: true,
    animationData: require('../assets/panda-animation.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const positionClasses = {
    top: 'top-10 right-10',
    bottom: 'bottom-10 right-10',
    side: 'top-1/2 right-10 transform -translate-y-1/2',
  };

  useEffect(() => {
    if (showTutorial) {
      const timer = setInterval(() => {
        setCurrentTutorial(prev => (prev + 1) % (tutorials[page]?.length || 0));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [showTutorial, page]);

  const handleClick = () => {
    setIsAnimating(true);
    setShowMessage(!showMessage);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.div
      className={`fixed z-50 ${positionClasses[position]}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div className="relative">
        <motion.div
          animate={{ scale: isAnimating ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Lottie options={options} height={size} width={size} />
        </motion.div>

        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-xs"
            >
              {showTutorial && tutorials[page] ? (
                <div>
                  <h4 className="font-semibold text-panda-primary mb-2">
                    {tutorials[page][currentTutorial].title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tutorials[page][currentTutorial].content}
                  </p>
                  <div className="flex justify-center space-x-2 mt-3">
                    {tutorials[page].map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentTutorial(index);
                        }}
                        className={`w-2 h-2 rounded-full ${
                          index === currentTutorial
                            ? 'bg-panda-accent'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-panda-primary">
                  {messages[page]}
                </p>
              )}
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PandaMascot; 