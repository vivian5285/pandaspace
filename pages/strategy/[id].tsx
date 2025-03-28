// 策略详情页
export default function StrategyDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 策略信息 */}
      <StrategyInfo />
      
      {/* 参数配置 */}
      <StrategyParams />
      
      {/* 控制面板 */}
      <StrategyControl />
    </div>
  );
} 