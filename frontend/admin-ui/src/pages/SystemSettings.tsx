import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    maintenanceMode: boolean;
    maxUsers: number;
  };
  security: {
    twoFactorRequired: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
    ipWhitelist: string[];
  };
  trading: {
    minDeposit: number;
    maxDeposit: number;
    minWithdrawal: number;
    maxWithdrawal: number;
    platformFee: number;
    referralCommission: {
      firstLevel: number;
      secondLevel: number;
    };
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    telegramEnabled: boolean;
    alertThresholds: {
      profit: number;
      loss: number;
      system: number;
    };
  };
  performance: {
    maxConcurrentTrades: number;
    apiRateLimit: number;
    cacheDuration: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: '',
      siteDescription: '',
      maintenanceMode: false,
      maxUsers: 1000,
    },
    security: {
      twoFactorRequired: false,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      ipWhitelist: [],
    },
    trading: {
      minDeposit: 100,
      maxDeposit: 10000,
      minWithdrawal: 100,
      maxWithdrawal: 10000,
      platformFee: 10,
      referralCommission: {
        firstLevel: 20,
        secondLevel: 10,
      },
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      telegramEnabled: false,
      alertThresholds: {
        profit: 10,
        loss: 5,
        system: 80,
      },
    },
    performance: {
      maxConcurrentTrades: 100,
      apiRateLimit: 100,
      cacheDuration: 300,
      logLevel: 'info',
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // 模拟数据
  useEffect(() => {
    const mockSettings: SystemSettings = {
      general: {
        siteName: 'PandaSpace',
        siteDescription: '智能量化交易平台',
        maintenanceMode: false,
        maxUsers: 1000,
      },
      security: {
        twoFactorRequired: true,
        maxLoginAttempts: 5,
        sessionTimeout: 30,
        ipWhitelist: ['192.168.1.1', '10.0.0.1'],
      },
      trading: {
        minDeposit: 100,
        maxDeposit: 10000,
        minWithdrawal: 100,
        maxWithdrawal: 10000,
        platformFee: 10,
        referralCommission: {
          firstLevel: 20,
          secondLevel: 10,
        },
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        telegramEnabled: false,
        alertThresholds: {
          profit: 10,
          loss: 5,
          system: 80,
        },
      },
      performance: {
        maxConcurrentTrades: 100,
        apiRateLimit: 100,
        cacheDuration: 300,
        logLevel: 'info',
      },
    };
    setSettings(mockSettings);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (
    section: keyof SystemSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // 实现保存设置逻辑
    console.log('保存设置:', settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="站点名称"
          value={settings.general.siteName}
          onChange={(e) =>
            handleSettingChange('general', 'siteName', e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="站点描述"
          multiline
          rows={3}
          value={settings.general.siteDescription}
          onChange={(e) =>
            handleSettingChange('general', 'siteDescription', e.target.value)
          }
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.general.maintenanceMode}
              onChange={(e) =>
                handleSettingChange('general', 'maintenanceMode', e.target.checked)
              }
            />
          }
          label="维护模式"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom>最大用户数</Typography>
        <Slider
          value={settings.general.maxUsers}
          onChange={(_, value) =>
            handleSettingChange('general', 'maxUsers', value)
          }
          min={100}
          max={10000}
          step={100}
          marks
          valueLabelDisplay="auto"
        />
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.security.twoFactorRequired}
              onChange={(e) =>
                handleSettingChange(
                  'security',
                  'twoFactorRequired',
                  e.target.checked
                )
              }
            />
          }
          label="强制两步验证"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最大登录尝试次数"
          value={settings.security.maxLoginAttempts}
          onChange={(e) =>
            handleSettingChange(
              'security',
              'maxLoginAttempts',
              parseInt(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="会话超时时间(分钟)"
          value={settings.security.sessionTimeout}
          onChange={(e) =>
            handleSettingChange(
              'security',
              'sessionTimeout',
              parseInt(e.target.value)
            )
          }
        />
      </Grid>
    </Grid>
  );

  const renderTradingSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最小存款金额"
          value={settings.trading.minDeposit}
          onChange={(e) =>
            handleSettingChange(
              'trading',
              'minDeposit',
              parseFloat(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最大存款金额"
          value={settings.trading.maxDeposit}
          onChange={(e) =>
            handleSettingChange(
              'trading',
              'maxDeposit',
              parseFloat(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最小提现金额"
          value={settings.trading.minWithdrawal}
          onChange={(e) =>
            handleSettingChange(
              'trading',
              'minWithdrawal',
              parseFloat(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最大提现金额"
          value={settings.trading.maxWithdrawal}
          onChange={(e) =>
            handleSettingChange(
              'trading',
              'maxWithdrawal',
              parseFloat(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom>平台费用 (%)</Typography>
        <Slider
          value={settings.trading.platformFee}
          onChange={(_, value) =>
            handleSettingChange('trading', 'platformFee', value)
          }
          min={0}
          max={20}
          step={1}
          marks
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom>推荐佣金</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="第一层佣金 (%)"
              value={settings.trading.referralCommission.firstLevel}
              onChange={(e) =>
                handleSettingChange('trading', 'referralCommission', {
                  ...settings.trading.referralCommission,
                  firstLevel: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="第二层佣金 (%)"
              value={settings.trading.referralCommission.secondLevel}
              onChange={(e) =>
                handleSettingChange('trading', 'referralCommission', {
                  ...settings.trading.referralCommission,
                  secondLevel: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.emailEnabled}
              onChange={(e) =>
                handleSettingChange(
                  'notifications',
                  'emailEnabled',
                  e.target.checked
                )
              }
            />
          }
          label="启用邮件通知"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.smsEnabled}
              onChange={(e) =>
                handleSettingChange(
                  'notifications',
                  'smsEnabled',
                  e.target.checked
                )
              }
            />
          }
          label="启用短信通知"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.telegramEnabled}
              onChange={(e) =>
                handleSettingChange(
                  'notifications',
                  'telegramEnabled',
                  e.target.checked
                )
              }
            />
          }
          label="启用Telegram通知"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography gutterBottom>告警阈值</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="收益阈值 (%)"
              value={settings.notifications.alertThresholds.profit}
              onChange={(e) =>
                handleSettingChange('notifications', 'alertThresholds', {
                  ...settings.notifications.alertThresholds,
                  profit: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="亏损阈值 (%)"
              value={settings.notifications.alertThresholds.loss}
              onChange={(e) =>
                handleSettingChange('notifications', 'alertThresholds', {
                  ...settings.notifications.alertThresholds,
                  loss: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="系统负载阈值 (%)"
              value={settings.notifications.alertThresholds.system}
              onChange={(e) =>
                handleSettingChange('notifications', 'alertThresholds', {
                  ...settings.notifications.alertThresholds,
                  system: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderPerformanceSettings = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="最大并发交易数"
          value={settings.performance.maxConcurrentTrades}
          onChange={(e) =>
            handleSettingChange(
              'performance',
              'maxConcurrentTrades',
              parseInt(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="API速率限制"
          value={settings.performance.apiRateLimit}
          onChange={(e) =>
            handleSettingChange(
              'performance',
              'apiRateLimit',
              parseInt(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="缓存持续时间(秒)"
          value={settings.performance.cacheDuration}
          onChange={(e) =>
            handleSettingChange(
              'performance',
              'cacheDuration',
              parseInt(e.target.value)
            )
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>日志级别</InputLabel>
          <Select
            value={settings.performance.logLevel}
            onChange={(e) =>
              handleSettingChange('performance', 'logLevel', e.target.value)
            }
          >
            <MenuItem value="debug">Debug</MenuItem>
            <MenuItem value="info">Info</MenuItem>
            <MenuItem value="warn">Warn</MenuItem>
            <MenuItem value="error">Error</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        系统设置
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          设置已保存
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{ mb: 3 }}
          >
            <Tab
              icon={<SecurityIcon />}
              label="常规设置"
              iconPosition="start"
            />
            <Tab
              icon={<SecurityIcon />}
              label="安全设置"
              iconPosition="start"
            />
            <Tab
              icon={<PaymentIcon />}
              label="交易设置"
              iconPosition="start"
            />
            <Tab
              icon={<NotificationsIcon />}
              label="通知设置"
              iconPosition="start"
            />
            <Tab
              icon={<SpeedIcon />}
              label="性能设置"
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ mt: 3 }}>
            {activeTab === 0 && renderGeneralSettings()}
            {activeTab === 1 && renderSecuritySettings()}
            {activeTab === 2 && renderTradingSettings()}
            {activeTab === 3 && renderNotificationSettings()}
            {activeTab === 4 && renderPerformanceSettings()}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveSettings}
            >
              保存设置
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SystemSettings; 