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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface Position {
  symbol: string;
  side: 'buy' | 'sell';
  leverage: number;
  base_position_size: number;
  leveraged_position_size: number;
  margin_required: number;
  market_price: number;
  pnl?: number;
  timestamp: string;
}

interface PositionSummary {
  total_positions: number;
  total_used_margin: number;
  available_balance: number;
  positions: Record<string, Position>;
}

interface RiskMetrics {
  total_risk_value: number;
  risk_ratio: number;
  max_risk_allowed: number;
}

const PositionManager: React.FC = () => {
  const [positionSummary, setPositionSummary] = useState<PositionSummary>({
    total_positions: 0,
    total_used_margin: 0,
    available_balance: 0,
    positions: {},
  });
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    total_risk_value: 0,
    risk_ratio: 0,
    max_risk_allowed: 0,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newPosition, setNewPosition] = useState({
    symbol: '',
    side: 'buy',
    leverage: 1,
    risk_percentage: 0.05,
  });

  // 模拟数据
  useEffect(() => {
    const mockPositionSummary: PositionSummary = {
      total_positions: 2,
      total_used_margin: 1000,
      available_balance: 5000,
      positions: {
        'BTC/USDT': {
          symbol: 'BTC/USDT',
          side: 'buy',
          leverage: 5,
          base_position_size: 100,
          leveraged_position_size: 500,
          margin_required: 100,
          market_price: 50000,
          pnl: 50,
          timestamp: '2024-03-20T10:00:00Z',
        },
        'ETH/USDT': {
          symbol: 'ETH/USDT',
          side: 'sell',
          leverage: 3,
          base_position_size: 200,
          leveraged_position_size: 600,
          margin_required: 200,
          market_price: 3000,
          pnl: -30,
          timestamp: '2024-03-20T09:30:00Z',
        },
      },
    };

    const mockRiskMetrics: RiskMetrics = {
      total_risk_value: 150,
      risk_ratio: 0.03,
      max_risk_allowed: 100,
    };

    setPositionSummary(mockPositionSummary);
    setRiskMetrics(mockRiskMetrics);
  }, []);

  const handleOpenPosition = () => {
    setOpenDialog(true);
  };

  const handleClosePosition = async (symbol: string) => {
    // 实现平仓逻辑
    console.log('平仓:', symbol);
  };

  const handleSavePosition = async () => {
    // 实现开仓逻辑
    console.log('开仓:', newPosition);
    setOpenDialog(false);
  };

  const getRiskLevel = (riskRatio: number) => {
    if (riskRatio < 0.01) return 'low';
    if (riskRatio < 0.02) return 'medium';
    return 'high';
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        仓位管理
      </Typography>

      {/* 账户概览 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                可用余额
              </Typography>
              <Typography variant="h4">
                ${positionSummary.available_balance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                已用保证金
              </Typography>
              <Typography variant="h4">
                ${positionSummary.total_used_margin.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                风险水平
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ mr: 1 }}>
                  {(riskMetrics.risk_ratio * 100).toFixed(1)}%
                </Typography>
                <Chip
                  label={getRiskLevel(riskMetrics.risk_ratio)}
                  color={getRiskColor(getRiskLevel(riskMetrics.risk_ratio))}
                  size="small"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(riskMetrics.risk_ratio / 0.02) * 100}
                color={getRiskColor(getRiskLevel(riskMetrics.risk_ratio))}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 仓位列表 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">当前仓位</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenPosition}
            >
              开仓
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>交易对</TableCell>
                  <TableCell>方向</TableCell>
                  <TableCell>杠杆</TableCell>
                  <TableCell>仓位大小</TableCell>
                  <TableCell>保证金</TableCell>
                  <TableCell>开仓价格</TableCell>
                  <TableCell>盈亏</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(positionSummary.positions).map((position) => (
                  <TableRow key={position.symbol}>
                    <TableCell>{position.symbol}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          position.side === 'buy' ? (
                            <TrendingUpIcon />
                          ) : (
                            <TrendingDownIcon />
                          )
                        }
                        label={position.side === 'buy' ? '做多' : '做空'}
                        color={position.side === 'buy' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{position.leverage}x</TableCell>
                    <TableCell>
                      ${position.leveraged_position_size.toFixed(2)}
                    </TableCell>
                    <TableCell>${position.margin_required.toFixed(2)}</TableCell>
                    <TableCell>${position.market_price.toFixed(2)}</TableCell>
                    <TableCell
                      sx={{
                        color: position.pnl && position.pnl > 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      ${position.pnl?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CloseIcon />}
                        onClick={() => handleClosePosition(position.symbol)}
                      >
                        平仓
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 开仓对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>开仓</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>交易对</InputLabel>
                <Select
                  value={newPosition.symbol}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, symbol: e.target.value })
                  }
                >
                  <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                  <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                  <MenuItem value="BNB/USDT">BNB/USDT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>方向</InputLabel>
                <Select
                  value={newPosition.side}
                  onChange={(e) =>
                    setNewPosition({ ...newPosition, side: e.target.value })
                  }
                >
                  <MenuItem value="buy">做多</MenuItem>
                  <MenuItem value="sell">做空</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>杠杆</Typography>
              <Slider
                value={newPosition.leverage}
                onChange={(_, value) =>
                  setNewPosition({ ...newPosition, leverage: value as number })
                }
                min={1}
                max={100}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>风险比例</Typography>
              <Slider
                value={newPosition.risk_percentage}
                onChange={(_, value) =>
                  setNewPosition({
                    ...newPosition,
                    risk_percentage: value as number,
                  })
                }
                min={0.01}
                max={0.1}
                step={0.01}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSavePosition} variant="contained" color="primary">
            确认开仓
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PositionManager; 