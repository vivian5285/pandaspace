/**
 * 创建推广收益分润记录
 * @param userId 产生收益的用户ID
 * @param amount 收益金额
 * @param strategyType 策略类型
 */
async function createReferralEarnings(
  userId: string,
  amount: number,
  strategyType: string
): Promise<void> {
  // 查找用户的邀请关系
  const userInviteInfo = await getUserInviteInfo(userId);
  
  if (!userInviteInfo) {
    return;
  }

  // 一级邀请人分润（10%）
  if (userInviteInfo.inviterUserId) {
    await insertEarningsRecord(
      userInviteInfo.inviterUserId,
      amount * 0.1,
      strategyType,
      'referral',
      userId
    );
  }

  // 二级邀请人分润（5%）
  if (userInviteInfo.grandInviterUserId) {
    await insertEarningsRecord(
      userInviteInfo.grandInviterUserId,
      amount * 0.05,
      strategyType,
      'referral',
      userId
    );
  }
} 