import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface ProfitInfo {
  total_profit: number;
  platform_fee: number;
  leader_commissions: {
    [key: string]: number;
  };
  user_final_profit: number;
  timestamp: string;
}

interface ProfitSummary {
  total_profits: number;
  total_platform_fees: number;
  total_leader_commissions: number;
  total_user_profits: number;
  profit_trend: number;
}

const ProfitDistribution: React.FC = () => {
  const [profitHistory, setProfitHistory] = useState<ProfitInfo[]>([]);
  const [profitSummary, setProfitSummary] = useState<ProfitSummary>({
    total_profits: 0,
    total_platform_fees: 0,
    total_leader_commissions: 0,
    total_user_profits: 0,
    profit_trend: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockProfitHistory: ProfitInfo[] = [
      {
        total_profit: 1000,
        platform_fee: 100,
        leader_commissions: {
          'leader1': 200,
          'leader2': 100,
        },
        user_final_profit: 600,
        timestamp: '2024-03-20T10:00:00Z',
      },
      {
        total_profit: 800,
        platform_fee: 80,
        leader_commissions: {
          'leader1': 160,
          'leader2': 80,
        },
        user_final_profit: 480,
        timestamp: '2024-03-19T15:30:00Z',
      },
    ];

    const mockProfitSummary: ProfitSummary = {
      total_profits: 1800,
      total_platform_fees: 180,
      total_leader_commissions: 540,
      total_user_profits: 1080,
      profit_trend: 25, // 25% increase
    };

    setProfitHistory(mockProfitHistory);
    setProfitSummary(mockProfitSummary);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        收益分配
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 收益概览 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总收益
              </Typography>
              <Typography variant="h4">
                ${profitSummary.total_profits.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  icon={profitSummary.profit_trend >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  label={`${Math.abs(profitSummary.profit_trend)}%`}
                  color={profitSummary.profit_trend >= 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                平台抽成
              </Typography>
              <Typography variant="h4">
                ${profitSummary.total_platform_fees.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {(profitSummary.total_platform_fees / profitSummary.total_profits * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                领导人抽成
              </Typography>
              <Typography variant="h4">
                ${profitSummary.total_leader_commissions.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {(profitSummary.total_leader_commissions / profitSummary.total_profits * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                最终收益
              </Typography>
              <Typography variant="h4">
                ${profitSummary.total_user_profits.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {(profitSummary.total_user_profits / profitSummary.total_profits * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 收益分配历史 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            收益分配历史
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell>总收益</TableCell>
                  <TableCell>平台抽成</TableCell>
                  <TableCell>领导人抽成</TableCell>
                  <TableCell>最终收益</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profitHistory.map((profit, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(profit.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>${profit.total_profit.toFixed(2)}</TableCell>
                    <TableCell>${profit.platform_fee.toFixed(2)}</TableCell>
                    <TableCell>
                      ${Object.values(profit.leader_commissions).reduce((a, b) => a + b, 0).toFixed(2)}
                    </TableCell>
                    <TableCell>${profit.user_final_profit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfitDistribution; 