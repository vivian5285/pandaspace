import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

interface UserProfile {
  username: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  withdrawalAddress: string;
}

const AccountSettings: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    username: 'user123',
    email: 'user@example.com',
    phone: '+1234567890',
    twoFactorEnabled: false,
    withdrawalAddress: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleProfileChange = (field: keyof UserProfile, value: string | boolean) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }

    try {
      // 实现密码修改逻辑
      console.log('修改密码:', {
        currentPassword,
        newPassword,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('修改密码失败:', error);
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      // 实现两步验证开关逻辑
      console.log('切换两步验证:', !profile.twoFactorEnabled);
      handleProfileChange('twoFactorEnabled', !profile.twoFactorEnabled);
      setShowSuccess(true);
    } catch (error) {
      console.error('切换两步验证失败:', error);
    }
  };

  const steps = [
    { label: '个人信息', icon: <PersonIcon /> },
    { label: '安全设置', icon: <SecurityIcon /> },
    { label: '提现设置', icon: <PaymentIcon /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        账户设置
      </Typography>

      <Grid container spacing={3}>
        {/* 步骤指示器 */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.label} onClick={() => setActiveStep(index)}>
                  <StepLabel StepIconProps={{ icon: step.icon }}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Card>
        </Grid>

        {/* 成功提示 */}
        {showSuccess && (
          <Grid item xs={12}>
            <Alert
              severity="success"
              onClose={() => setShowSuccess(false)}
              sx={{ mb: 2 }}
            >
              设置已更新
            </Alert>
          </Grid>
        )}

        {/* 个人信息 */}
        {activeStep === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                个人信息
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={profile.username}
                    onChange={(e) => handleProfileChange('username', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="手机号"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary">
                    保存修改
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}

        {/* 安全设置 */}
        {activeStep === 1 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                安全设置
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    修改密码
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="当前密码"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="新密码"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="确认新密码"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePasswordChange}
                      >
                        修改密码
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.twoFactorEnabled}
                        onChange={handleTwoFactorToggle}
                      />
                    }
                    label="启用两步验证"
                  />
                  <Typography variant="body2" color="text.secondary">
                    启用后，登录时需要输入验证码
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}

        {/* 提现设置 */}
        {activeStep === 2 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                提现设置
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="提现地址"
                    value={profile.withdrawalAddress}
                    onChange={(e) =>
                      handleProfileChange('withdrawalAddress', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary">
                    保存提现地址
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AccountSettings; 