import React from 'react';
import { ReferralCode } from '../components/ReferralCode';
import { ReferralStats } from '../components/ReferralStats';
import { ReferralHistory } from '../components/ReferralHistory';

export const ReferralCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">推广中心</h1>
        
        {/* 邀请码和链接区域 */}
        <ReferralCode 
          code="PANDA888" 
          link="https://pandaquant.com/ref/PANDA888" 
        />

        {/* 收益统计区域 */}
        <ReferralStats />

        {/* 邀请记录列表 */}
        <ReferralHistory />
      </div>
    </div>
  );
}; 