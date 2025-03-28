// 推广页面
export default function ReferralPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 邀请码卡片 */}
      <InviteCodeCard />
      
      {/* 推广统计 */}
      <ReferralStats />
      
      {/* 返佣记录 */}
      <ReferralHistory />
    </div>
  );
} 