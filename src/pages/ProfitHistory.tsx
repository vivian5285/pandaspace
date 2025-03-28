import React from 'react';
import { EmptyState } from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const ProfitHistory: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* 收益历史为空的场景 */}
      <EmptyState
        image="profit"
        title="暂无收益数据"
        description="策略运行后，这里将显示您的收益数据"
        actionText="查看运行中的策略"
        onAction={() => navigate('/strategies')}
      />

      {/* 推广记录为空的场景 */}
      <EmptyState
        image="referral"
        title="暂无推广记录"
        description="邀请好友加入，一起开启量化交易之旅"
        actionText="立即邀请好友"
        onAction={() => navigate('/referral')}
      />
    </div>
  );
};

export default ProfitHistory; 