import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface DepositInfo {
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}

interface BalanceInfo {
  balance: number;
  available_balance: number;
  used_margin: number;
}

const Deposit: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>({
    balance: 0,
    available_balance: 0,
    used_margin: 0,
  });
  const [depositHistory, setDepositHistory] = useState<DepositInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 模拟数据
  useEffect(() => {
    const mockBalanceInfo: BalanceInfo = {
      balance: 10000,
      available_balance: 9000,
      used_margin: 1000,
    };
    setBalanceInfo(mockBalanceInfo);

    const mockDepositHistory: DepositInfo[] = [
      {
        amount: 5000,
        currency: 'USDT',
        payment_method: 'Bank Transfer',
        status: 'completed',
        timestamp: '2024-03-20T10:00:00Z',
      },
      {
        amount: 3000,
        currency: 'USDT',
        payment_method: 'Crypto',
        status: 'completed',
        timestamp: '2024-03-19T15:30:00Z',
      },
    ];
    setDepositHistory(mockDepositHistory);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDeposit = async () => {
    try {
      // 这里应该调用后端API处理充值
      const newDeposit: DepositInfo = {
        amount: parseFloat(amount),
        currency,
        payment_method: paymentMethod,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };

      setDepositHistory([newDeposit, ...depositHistory]);
      setSuccess('充值申请已提交，请等待处理');
      setAmount('');
      setActiveStep(2);
    } catch (err) {
      setError('充值失败，请重试');
    }
  };

  const steps = [
    '选择充值金额',
    '选择支付方式',
    '确认充值',
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              选择充值金额
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="充值金额"
                  value={amount}
                  onChange={handleAmountChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>选择币种</InputLabel>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <MenuItem value="USDT">USDT</MenuItem>
                    <MenuItem value="BTC">BTC</MenuItem>
                    <MenuItem value="ETH">ETH</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              选择支付方式
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: paymentMethod === 'bank' ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => setPaymentMethod('bank')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccountBalanceIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">银行转账</Typography>
                    </Box>
                    <Typography color="textSecondary">
                      通过银行转账充值，支持多种货币。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: paymentMethod === 'crypto' ? '2px solid #1976d2' : 'none',
                  }}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">加密货币</Typography>
                    </Box>
                    <Typography color="textSecondary">
                      使用加密货币充值，快速到账。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              确认充值信息
            </Typography>
            <Paper sx={{ p: 3 }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="充值金额"
                    secondary={`${amount} ${currency}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="支付方式"
                    secondary={paymentMethod === 'bank' ? '银行转账' : '加密货币'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="手续费"
                    secondary="0%"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="预计到账时间"
                    secondary={paymentMethod === 'bank' ? '1-3个工作日' : '10-30分钟'}
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        充值
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

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button
                onClick={() => setActiveStep((prev) => prev - 1)}
                sx={{ mr: 1 }}
              >
                上一步
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={() => setActiveStep((prev) => prev + 1)}
                disabled={!amount || (activeStep === 1 && !paymentMethod)}
              >
                下一步
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleDeposit}
                disabled={!amount || !paymentMethod}
              >
                确认充值
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                账户余额
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="总余额"
                    secondary={`${balanceInfo.balance.toFixed(2)} USDT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="可用余额"
                    secondary={`${balanceInfo.available_balance.toFixed(2)} USDT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="已用保证金"
                    secondary={`${balanceInfo.used_margin.toFixed(2)} USDT`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                充值历史
              </Typography>
              <List>
                {depositHistory.map((deposit, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {deposit.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : deposit.status === 'pending' ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <WarningIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${deposit.amount} ${deposit.currency}`}
                        secondary={`${deposit.payment_method} - ${new Date(deposit.timestamp).toLocaleString()}`}
                      />
                    </ListItem>
                    {index < depositHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Deposit; 