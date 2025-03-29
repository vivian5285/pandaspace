import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import PandaMascot from '../components/PandaMascot';

interface InviteStats {
  totalInvites: number;
  totalEarnings: number;
  pendingEarnings: number;
  inviteLink: string;
  platformFee: number;
  directReferralEarnings: number;
  indirectReferralEarnings: number;
  guaranteedEarnings: number;
  totalMonthlyEarnings: number;
  directReferralCount: number;
  indirectReferralCount: number;
}

interface InviteRecord {
  id: string;
  inviteeName: string;
  inviteDate: string;
  reward: number;
  status: 'pending' | 'completed' | 'failed';
  level: 'direct' | 'indirect';
  monthlyEarnings: number;
  platformFee: number;
  referralFee: number;
  guaranteedEarnings: number;
}

const InviteCenter: React.FC = () => {
  const [stats, setStats] = useState<InviteStats>({
    totalInvites: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    inviteLink: 'https://pandaquant.com/invite/abc123',
    platformFee: 0,
    directReferralEarnings: 0,
    indirectReferralEarnings: 0,
    guaranteedEarnings: 0,
    totalMonthlyEarnings: 0,
    directReferralCount: 0,
    indirectReferralCount: 0
  });
  const [records, setRecords] = useState<InviteRecord[]>([]);
  const [showRules, setShowRules] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(stats.inviteLink);
      setIsCopied(true);
      // 播放提示音
      const audio = new Audio('/sounds/copy.mp3');
      audio.play();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSocial = (platform: string) => {
    const shareUrl = encodeURIComponent(stats.inviteLink);
    const shareText = encodeURIComponent('加入熊猫量化，开启智能交易之旅！');
    
    const shareLinks = {
      wechat: `weixin://dl/share?url=${shareUrl}`,
      weibo: `http://service.weibo.com/share/share.php?url=${shareUrl}&title=${shareText}`,
      qq: `http://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&title=${shareText}`,
    };

    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-panda-background dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 欢迎区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-panda-primary dark:text-white mb-4">
              邀请中心
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              邀请好友，赚取收益
            </p>
          </motion.div>

          {/* 邀请链接卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 w-full">
                <h3 className="text-lg font-semibold mb-4">你的邀请链接</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={stats.inviteLink}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-panda-accent focus:border-panda-accent"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className="px-6 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                  >
                    {isCopied ? '已复制' : '复制链接'}
                  </motion.button>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial('wechat')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-opacity-90"
                >
                  微信
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial('weibo')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-90"
                >
                  微博
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => shareToSocial('qq')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-opacity-90"
                >
                  QQ
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* 邀请统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">邀请统计</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">直接邀请</span>
                  <span className="font-semibold">{stats.directReferralCount}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">间接邀请</span>
                  <span className="font-semibold">{stats.indirectReferralCount}人</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">本月收益</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">总收益</span>
                  <span className="font-semibold text-panda-success">
                    ${stats.totalMonthlyEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平台抽成</span>
                  <span className="font-semibold text-gray-500">
                    ${stats.platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">保证收益</span>
                  <span className="font-semibold text-panda-primary">
                    ${stats.guaranteedEarnings.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">分成收益</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">第一层分成</span>
                  <span className="font-semibold text-panda-gold">
                    ${stats.directReferralEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">第二层分成</span>
                  <span className="font-semibold text-panda-gold">
                    ${stats.indirectReferralEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">待结算收益</span>
                  <span className="font-semibold text-panda-accent">
                    ${stats.pendingEarnings.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 邀请记录 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">邀请记录</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRules(true)}
                className="px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
              >
                奖励规则
              </motion.button>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">你还没有邀请任何人，快来获取奖励吧！</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="px-6 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                >
                  复制邀请链接
                </motion.button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        被邀请人
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邀请时间
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        奖励金额
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.inviteeName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {record.inviteDate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            ${record.reward.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : record.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status === 'completed' ? '已完成' : record.status === 'pending' ? '待结算' : '已失效'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>

        {/* 奖励规则弹窗 */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowRules(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-semibold mb-4">邀请奖励规则</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">平台收益分配</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      平台将从每位用户的收益中抽取 10% 作为平台费用。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">用户收益保障</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      平台确保每个用户至少获得 50% 的月化收益（除去平台和领导人分成后的收益）。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">领导人分成</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        第一层分成（直接邀请）：邀请者从其直接推荐的用户收益中获得 20% 的分成。
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        第二层分成（间接邀请）：邀请者从其下线的下线的收益中获得 10% 的分成。
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">收益计算示例</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        假设用户托管 10000元，获得 50% 收益（5000元）：
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• 平台抽成：500元（10%）</li>
                        <li>• 用户收益：4500元（保证 50%）</li>
                        <li>• 第一层分成：1000元（20%）</li>
                        <li>• 第二层分成：500元（10%）</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRules(false)}
                  className="mt-6 w-full px-4 py-2 bg-panda-accent text-white rounded-lg hover:bg-opacity-90"
                >
                  我知道了
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <PandaMascot position="bottom" page="invite" />
      </div>
    </PageTransition>
  );
};

export default InviteCenter; 