import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import PandaMascot from '../components/PandaMascot';

interface StrategyParams {
  name: string;
  type: 'grid' | 'trend' | 'dca';
  symbol: string;
  investment: number;
  gridLevels: number;
  gridSpacing: number;
  stopLoss: number;
  takeProfit: number;
}

const StrategyConfig: React.FC = () => {
  const [params, setParams] = useState<StrategyParams>({
    name: '',
    type: 'grid',
    symbol: 'BTC/USDT',
    investment: 1000,
    gridLevels: 5,
    gridSpacing: 2,
    stopLoss: 5,
    takeProfit: 10,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    // TODO: 调用API保存策略配置
  };

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
              策略配置
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              自定义你的交易策略参数
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  策略名称
                </label>
                <input
                  type="text"
                  value={params.name}
                  onChange={(e) => setParams({ ...params, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  策略类型
                </label>
                <select
                  value={params.type}
                  onChange={(e) => setParams({ ...params, type: e.target.value as StrategyParams['type'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                >
                  <option value="grid">网格交易</option>
                  <option value="trend">趋势跟踪</option>
                  <option value="dca">定投策略</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  交易对
                </label>
                <input
                  type="text"
                  value={params.symbol}
                  onChange={(e) => setParams({ ...params, symbol: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  投资金额 (USDT)
                </label>
                <input
                  type="number"
                  value={params.investment}
                  onChange={(e) => setParams({ ...params, investment: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                />
              </div>

              {params.type === 'grid' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      网格层数
                    </label>
                    <input
                      type="number"
                      value={params.gridLevels}
                      onChange={(e) => setParams({ ...params, gridLevels: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      网格间距 (%)
                    </label>
                    <input
                      type="number"
                      value={params.gridSpacing}
                      onChange={(e) => setParams({ ...params, gridSpacing: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    止损比例 (%)
                  </label>
                  <input
                    type="number"
                    value={params.stopLoss}
                    onChange={(e) => setParams({ ...params, stopLoss: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    止盈比例 (%)
                  </label>
                  <input
                    type="number"
                    value={params.takeProfit}
                    onChange={(e) => setParams({ ...params, takeProfit: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-panda-accent focus:ring-panda-accent"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-panda-accent hover:bg-opacity-90'
                }`}
              >
                {isSaving ? '保存中...' : '保存策略'}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <PandaMascot position="bottom" page="strategy-market" />
      </div>
    </PageTransition>
  );
};

export default StrategyConfig; 