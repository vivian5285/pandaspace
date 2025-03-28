// Dashboard 页面
export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 收益概览 */}
      <EarningsSummary />
      
      {/* 策略列表 */}
      <StrategyList />
    </div>
  );
} 