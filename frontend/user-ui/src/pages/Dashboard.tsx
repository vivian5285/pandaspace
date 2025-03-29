import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import RealTimeData from '../components/RealTimeData';
import NotificationCenter from '../components/NotificationCenter';
import ProfitAnalysis from '../components/ProfitAnalysis';

interface DashboardStats {
  totalProfit: number;
  monthlyReturn: number;
  referralEarnings: number;
  riskLevel: number;
  activeStrategies: string[];
}

const Dashboard: React.FC = () => {
  // 模拟数据，实际应从API获取
  const stats: DashboardStats = {
    totalProfit: 12500.50,
    monthlyReturn: 15.8,
    referralEarnings: 2500.00,
    riskLevel: 75,
    activeStrategies: ['超级趋势', '网格策略', '剥头皮'],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* 顶部统计卡片 */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">总收益</Typography>
            </Box>
            <Typography variant="h4" color="primary">
              ${stats.totalProfit.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">月化收益</Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              {stats.monthlyReturn}%
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PeopleIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">推荐奖励</Typography>
            </Box>
            <Typography variant="h4" color="info.main">
              ${stats.referralEarnings.toFixed(2)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SecurityIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">风险等级</Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={stats.riskLevel}
                color={stats.riskLevel > 70 ? 'warning' : 'success'}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {stats.riskLevel}% 风险承受度
            </Typography>
          </Card>
        </Grid>

        {/* 活跃策略 */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              活跃策略
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {stats.activeStrategies.map((strategy, index) => (
                <Chip
                  key={index}
                  label={strategy}
                  color="primary"
                  variant="outlined"
                  onClick={() => {}}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {/* 实时数据 */}
        <Grid item xs={12}>
          <RealTimeData />
        </Grid>

        {/* 收益分析 */}
        <Grid item xs={12}>
          <ProfitAnalysis />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 