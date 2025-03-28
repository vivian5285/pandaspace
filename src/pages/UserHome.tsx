import React from 'react';
import { UserStats } from '../components/UserStats';
import { StrategyCard } from '../components/StrategyCard';
import { Navbar } from '../components/Navbar';

interface Strategy {
  id: string;
  name: string;
  isActive: boolean;
  monthlyReturn: number;
}

const strategies: Strategy[] = [
  {
    id: '1',
    name: '超级趋势过滤器',
    isActive: true,
    monthlyReturn: 15.8,
  },
  {
    id: '2',
    name: '剥头皮',
    isActive: false,
    monthlyReturn: 8.2,
  },
  {
    id: '3',
    name: '智能网格',
    isActive: true,
    monthlyReturn: 12.5,
  },
];

export const UserHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserStats />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">交易策略</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy) => (
              <StrategyCard key={strategy.id} strategy={strategy} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}; 