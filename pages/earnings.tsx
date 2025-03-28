// 收益页面
export default function EarningsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 收益图表 */}
      <EarningsChart />
      
      {/* 收益记录表格 */}
      <EarningsTable />
    </div>
  );
} 