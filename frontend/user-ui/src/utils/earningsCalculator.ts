export const calculateEarnings = (
  investment: number,
  monthlyReturn: number
) => {
  const totalEarnings = investment * (monthlyReturn / 100);
  const platformFee = totalEarnings * 0.1; // 平台抽成 10%
  const remainingEarnings = totalEarnings - platformFee;
  const guaranteedEarnings = remainingEarnings * 0.5; // 保证用户获得 50%
  
  return {
    totalEarnings,
    platformFee,
    remainingEarnings,
    guaranteedEarnings,
    directReferralFee: totalEarnings * 0.2, // 第一层分成 20%
    indirectReferralFee: totalEarnings * 0.1, // 第二层分成 10%
  };
}; 