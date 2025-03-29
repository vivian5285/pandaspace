import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PandaMascot from '../components/PandaMascot';
import AccountOverview from '../components/AccountOverview';
import PageTransition from '../components/PageTransition';
import LoadingState from '../components/LoadingState';
import BrandToast from '../components/BrandToast';
import BrandAnimation from '../components/BrandAnimation';

const UserHome: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <LoadingState message="正在加载您的数据..." />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900">
        <PandaMascot position="top" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
          <div className="text-center mb-12">
            <BrandAnimation type="welcome" size={150} />
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mt-4">
              欢迎回来，今天继续发大财！
            </h1>
          </div>

          <AccountOverview />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/trading">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <span className="text-4xl mb-4 block">📈</span>
                <h3 className="text-xl font-semibold text-panda-primary">Start Trading</h3>
              </motion.div>
            </Link>

            <Link to="/strategies">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <span className="text-4xl mb-4 block">⚙️</span>
                <h3 className="text-xl font-semibold text-panda-primary">Manage Strategies</h3>
              </motion.div>
            </Link>

            <Link to="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
              >
                <span className="text-4xl mb-4 block">👤</span>
                <h3 className="text-xl font-semibold text-panda-primary">Profile Settings</h3>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        <PandaMascot position="bottom" />
      </div>

      <BrandToast
        message="欢迎使用熊猫量化交易平台！"
        type="success"
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </PageTransition>
  );
};

export default UserHome; 