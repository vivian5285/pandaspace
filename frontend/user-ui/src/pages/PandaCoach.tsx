import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import BrandAnimation from '../components/BrandAnimation';

interface GuideStep {
  title: string;
  content: string;
  animation: 'welcome' | 'thinking' | 'success' | 'loading';
}

const PandaCoach: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: GuideStep[] = [
    {
      title: '欢迎来到熊猫量化！',
      content: '我是你的专属交易教练，让我带你了解量化交易的世界。',
      animation: 'welcome'
    },
    {
      title: '什么是量化交易？',
      content: '量化交易是利用数学模型和计算机程序进行交易的方式，让交易更科学、更理性。',
      animation: 'thinking'
    },
    {
      title: '熊猫量化的优势',
      content: '我们提供智能策略、风险控制、实时监控等全方位服务，让交易更轻松。',
      animation: 'success'
    },
    {
      title: '开始你的交易之旅',
      content: '选择适合你的策略，设置参数，让熊猫帮你实现收益目标。',
      animation: 'loading'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mb-4">
              Panda 教练
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              你的专属量化交易教练
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <BrandAnimation
                type={steps[currentStep].animation}
                size={200}
              />
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mt-8"
              >
                <h2 className="text-2xl font-bold text-panda-primary dark:text-white mb-4">
                  {steps[currentStep].title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {steps[currentStep].content}
                </p>
              </motion.div>

              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-panda-accent text-white hover:bg-opacity-90'
                  }`}
                >
                  上一步
                </button>
                <button
                  onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                  disabled={currentStep === steps.length - 1}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === steps.length - 1
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-panda-accent text-white hover:bg-opacity-90'
                  }`}
                >
                  下一步
                </button>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentStep
                        ? 'bg-panda-accent'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-panda-primary dark:text-white mb-4">
              推荐学习资源
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <h4 className="text-lg font-semibold mb-2">量化交易入门</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  了解基本概念和策略类型
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <h4 className="text-lg font-semibold mb-2">风险控制指南</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  学习如何保护你的投资
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PandaCoach; 