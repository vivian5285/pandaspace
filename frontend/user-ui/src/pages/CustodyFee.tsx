import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface CustodyFeeSummary {
  current_balance: number;
  pending_fees: number;
  total_deposits: number;
  total_withdrawals: number;
  total_settlements: number;
  settlement_type: 'weekly' | 'daily';
  last_settlement_time: string;
}

interface FeeHistory {
  amount: number;
  type: 'deposit' | 'withdraw';
  timestamp: string;
}

interface SettlementHistory {
  profit: number;
  fee_calculation: {
    platform_fee: number;
    leader_commissions: {
      [key: string]: number;
    };
    total_fee: number;
  };
  timestamp: string;
}

const CustodyFee: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [summary, setSummary] = useState<CustodyFeeSummary>({
    current_balance: 0,
    pending_fees: 0,
    total_deposits: 0,
    total_withdrawals: 0,
    total_settlements: 0,
    settlement_type: 'weekly',
    last_settlement_time: '',
  });
  const [feeHistory, setFeeHistory] = useState<FeeHistory[]>([]);
  const [settlementHistory, setSettlementHistory] = useState<SettlementHistory[]>([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockSummary: CustodyFeeSummary = {
      current_balance: 1000,
      pending_fees: 200,
      total_deposits: 2000,
      total_withdrawals: 500,
      total_settlements: 500,
      settlement_type: 'weekly',
      last_settlement_time: '2024-03-20T10:00:00Z',
    };

    const mockFeeHistory: FeeHistory[] = [
      {
        amount: 1000,
        type: 'deposit',
        timestamp: '2024-03-20T10:00:00Z',
      },
      {
        amount: 500,
        type: 'withdraw',
        timestamp: '2024-03-19T15:30:00Z',
      },
    ];

    const mockSettlementHistory: SettlementHistory[] = [
      {
        profit: 1000,
        fee_calculation: {
          platform_fee: 100,
          leader_commissions: {
            'leader1': 200,
            'leader2': 100,
          },
          total_fee: 400,
        },
        timestamp: '2024-03-20T10:00:00Z',
      },
    ];

    setSummary(mockSummary);
    setFeeHistory(mockFeeHistory);
    setSettlementHistory(mockSettlementHistory);
    setLoading(false);
  }, []);

  const handleDeposit = async () => {
    try {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('请输入有效的充值金额');
        return;
      }

      // 这里应该调用后端API处理充值
      setSummary({
        ...summary,
        current_balance: summary.current_balance + amount,
        total_deposits: summary.total_deposits + amount,
      });
      setFeeHistory([
        {
          amount,
          type: 'deposit',
          timestamp: new Date().toISOString(),
        },
        ...feeHistory,
      ]);
      setDepositAmount('');
      setSuccess('充值成功');
    } catch (err) {
      setError('充值失败，请重试');
    }
  };

  const handleWithdraw = async () => {
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('请输入有效的提现金额');
        return;
      }

      if (amount > summary.current_balance) {
        setError('余额不足');
        return;
      }

      // 这里应该调用后端API处理提现
      setSummary({
        ...summary,
        current_balance: summary.current_balance - amount,
        total_withdrawals: summary.total_withdrawals + amount,
      });
      setFeeHistory([
        {
          amount,
          type: 'withdraw',
          timestamp: new Date().toISOString(),
        },
        ...feeHistory,
      ]);
      setWithdrawAmount('');
      setSuccess('提现成功');
    } catch (err) {
      setError('提现失败，请重试');
    }
  };

  const handleSettle = async () => {
    try {
      // 这里应该调用后端API处理结算
      setSummary({
        ...summary,
        current_balance: summary.current_balance - summary.pending_fees,
        pending_fees: 0,
        total_settlements: summary.total_settlements + summary.pending_fees,
      });
      setSuccess('结算成功');
    } catch (err) {
      setError('结算失败，请重试');
    }
  };

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
        托管费用管理
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* 费用概览 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                当前余额
              </Typography>
              <Typography variant="h4">
                ${summary.current_balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                待结算费用
              </Typography>
              <Typography variant="h4">
                ${summary.pending_fees.toFixed(2)}
              </Typography>
              <Chip
                label={summary.settlement_type === 'weekly' ? '周结算' : '日结算'}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总充值金额
              </Typography>
              <Typography variant="h4">
                ${summary.total_deposits.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总提现金额
              </Typography>
              <Typography variant="h4">
                ${summary.total_withdrawals.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 操作区域 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                充值托管费用
              </Typography>
              <TextField
                fullWidth
                label="充值金额"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleDeposit}
                disabled={!depositAmount}
              >
                充值
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                提现托管费用
              </Typography>
              <TextField
                fullWidth
                label="提现金额"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleWithdraw}
                disabled={!withdrawAmount}
              >
                提现
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                结算托管费用
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                待结算金额：${summary.pending_fees.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSettle}
                disabled={summary.pending_fees <= 0}
              >
                结算
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 历史记录 */}
      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="充值提现历史" />
            <Tab label="结算历史" />
          </Tabs>

          {activeTab === 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>时间</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>金额</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeHistory.map((fee, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(fee.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={fee.type === 'deposit' ? '充值' : '提现'}
                          color={fee.type === 'deposit' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>${fee.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>时间</TableCell>
                    <TableCell>盈利</TableCell>
                    <TableCell>平台抽成</TableCell>
                    <TableCell>领导人抽成</TableCell>
                    <TableCell>总费用</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settlementHistory.map((settlement, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(settlement.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>${settlement.profit.toFixed(2)}</TableCell>
                      <TableCell>
                        ${settlement.fee_calculation.platform_fee.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${Object.values(settlement.fee_calculation.leader_commissions)
                          .reduce((a, b) => a + b, 0)
                          .toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${settlement.fee_calculation.total_fee.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustodyFee; 