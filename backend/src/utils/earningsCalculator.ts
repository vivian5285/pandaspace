import { TradingProfit } from '../services/earningsService';

// 计算月化收益
export function calculateMonthlyReturn(profit: number, initialInvestment: number): number {
  return (profit / initialInvestment) * 100;
}

// 预测未来收益
export function predictFutureEarnings(
  historicalProfits: TradingProfit[],
  currentMonthlyReturn: number
): {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
} {
  // 计算历史平均收益
  const averageProfit = historicalProfits.reduce((sum, trade) => sum + trade.profit, 0) / historicalProfits.length;

  // 计算收益增长率
  const growthRate = calculateGrowthRate(historicalProfits);

  // 预测未来收益
  return {
    nextMonth: currentMonthlyReturn * (1 + growthRate),
    nextQuarter: currentMonthlyReturn * (1 + growthRate) * 3,
    nextYear: currentMonthlyReturn * (1 + growthRate) * 12,
  };
}

// 计算收益增长率
function calculateGrowthRate(profits: TradingProfit[]): number {
  if (profits.length < 2) return 0;

  // 按日期排序
  const sortedProfits = [...profits].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 计算第一个月和最后一个月的总收益
  const firstMonth = getMonthTotal(sortedProfits.slice(0, Math.floor(sortedProfits.length / 2)));
  const lastMonth = getMonthTotal(sortedProfits.slice(-Math.floor(sortedProfits.length / 2)));

  // 计算增长率
  return (lastMonth - firstMonth) / firstMonth;
}

// 计算指定时间段的总收益
function getMonthTotal(profits: TradingProfit[]): number {
  return profits.reduce((sum, trade) => sum + trade.profit, 0);
} 