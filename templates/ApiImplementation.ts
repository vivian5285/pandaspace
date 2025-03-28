// 1. 收益概览接口
export async function getEarningsSummary(req: Request, res: Response) {
  try {
    const userId = req.user.id; // 从认证中间件获取

    const summary = await prisma.earnings.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfDay(new Date())
        }
      },
      _sum: {
        amount: true
      }
    });

    const monthSummary = await prisma.earnings.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth(new Date())
        }
      },
      _sum: {
        amount: true
      }
    });

    const totalSummary = await prisma.earnings.aggregate({
      where: {
        userId
      },
      _sum: {
        amount: true
      }
    });

    return res.json({
      todayEarnings: summary._sum.amount || 0,
      monthEarnings: monthSummary._sum.amount || 0,
      totalEarnings: totalSummary._sum.amount || 0,
      returnRate: calculateReturnRate(totalSummary._sum.amount || 0)
    });
  } catch (error) {
    console.error('Failed to fetch earnings summary:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch earnings summary'
      }
    });
  }
}

// 2. 策略列表接口
export async function getStrategyList(req: Request, res: Response) {
  try {
    const userId = req.user.id;

    const strategies = await prisma.strategy.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        mode: true,
        returnRate: true,
        lastRunTime: true
      }
    });

    return res.json({ strategies });
  } catch (error) {
    console.error('Failed to fetch strategy list:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch strategy list'
      }
    });
  }
} 