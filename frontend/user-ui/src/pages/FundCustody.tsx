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
  Divider,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface CustodySettings {
  custody_type: 'platform' | 'exchange';
  exchange_name?: string;
  exchange_api_key?: string;
  exchange_api_secret?: string;
}

interface BalanceInfo {
  balance: number;
  available_balance: number;
  used_margin: number;
}

const FundCustody: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [settings, setSettings] = useState<CustodySettings>({
    custody_type: 'platform',
  });
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>({
    balance: 0,
    available_balance: 0,
    used_margin: 0,
  });
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
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
  }, []);

  const handleCustodyTypeChange = (type: 'platform' | 'exchange') => {
    setSettings({ ...settings, custody_type: type });
    setActiveStep(1);
  };

  const handleExchangeSelect = (exchange: string) => {
    setSelectedExchange(exchange);
    setShowApiDialog(true);
  };

  const handleApiSubmit = async () => {
    try {
      // 这里应该调用后端API验证和保存API密钥
      setSettings({
        ...settings,
        exchange_name: selectedExchange,
        exchange_api_key: apiKey,
        exchange_api_secret: apiSecret,
      });
      setShowApiDialog(false);
      setSuccess('API密钥已成功保存');
    } catch (err) {
      setError('保存API密钥失败，请重试');
    }
  };

  const handleSaveSettings = async () => {
    try {
      // 这里应该调用后端API保存设置
      setSuccess('设置已成功保存');
    } catch (err) {
      setError('保存设置失败，请重试');
    }
  };

  const steps = [
    '选择资金托管方式',
    '配置交易所API',
    '确认设置',
  ];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: settings.custody_type === 'platform' ? '2px solid #1976d2' : 'none',
                }}
                onClick={() => handleCustodyTypeChange('platform')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">平台托管</Typography>
                  </Box>
                  <Typography color="textSecondary" paragraph>
                    将资金充值到平台账户，由平台代为执行交易。
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="资金由平台统一管理" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="支持快速充值和提现" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="平台提供资金安全保障" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: settings.custody_type === 'exchange' ? '2px solid #1976d2' : 'none',
                }}
                onClick={() => handleCustodyTypeChange('exchange')}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">交易所API托管</Typography>
                  </Box>
                  <Typography color="textSecondary" paragraph>
                    通过提供交易所API密钥，平台直接通过API执行交易。
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="资金由交易所直接管理" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="支持多个主流交易所" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="资金更安全，风险更低" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              配置交易所API
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>选择交易所</InputLabel>
                  <Select
                    value={selectedExchange}
                    onChange={(e) => setSelectedExchange(e.target.value)}
                  >
                    <MenuItem value="binance">币安</MenuItem>
                    <MenuItem value="okx">OKX</MenuItem>
                    <MenuItem value="gate">Gate.io</MenuItem>
                    <MenuItem value="bitget">Bitget</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setShowApiDialog(true)}
                >
                  配置API密钥
                </Button>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              确认设置
            </Typography>
            <Paper sx={{ p: 3 }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="资金托管方式"
                    secondary={settings.custody_type === 'platform' ? '平台托管' : '交易所API托管'}
                  />
                </ListItem>
                {settings.custody_type === 'exchange' && (
                  <>
                    <ListItem>
                      <ListItemText
                        primary="交易所"
                        secondary={settings.exchange_name}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="API密钥状态"
                        secondary="已配置"
                      />
                    </ListItem>
                  </>
                )}
                <ListItem>
                  <ListItemText
                    primary="当前余额"
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
        资金托管设置
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
          >
            下一步
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSaveSettings}>
            保存设置
          </Button>
        )}
      </Box>

      <Dialog open={showApiDialog} onClose={() => setShowApiDialog(false)}>
        <DialogTitle>配置API密钥</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="API Secret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowApiDialog(false)}>取消</Button>
          <Button onClick={handleApiSubmit} variant="contained">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FundCustody; 