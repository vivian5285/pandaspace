import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  QrCode as QrCodeIcon,
} from '@mui/icons-material';

interface ReferralUser {
  id: string;
  username: string;
  joinDate: Date;
  totalProfit: number;
  monthlyReturn: number;
  level: number;
}

interface ReferralReward {
  id: string;
  amount: number;
  type: 'direct' | 'indirect';
  date: Date;
  status: 'pending' | 'paid';
}

const ReferralCenter: React.FC = () => {
  const [referralLink, setReferralLink] = useState('https://pandaquant.com/ref/abc123');
  const [referralUsers, setReferralUsers] = useState<ReferralUser[]>([
    {
      id: '1',
      username: 'user1',
      joinDate: new Date('2024-01-01'),
      totalProfit: 5000,
      monthlyReturn: 12.5,
      level: 1,
    },
    {
      id: '2',
      username: 'user2',
      joinDate: new Date('2024-01-15'),
      totalProfit: 3000,
      monthlyReturn: 8.2,
      level: 2,
    },
  ]);

  const [rewards, setRewards] = useState<ReferralReward[]>([
    {
      id: '1',
      amount: 100,
      type: 'direct',
      date: new Date('2024-02-01'),
      status: 'paid',
    },
    {
      id: '2',
      amount: 50,
      type: 'indirect',
      date: new Date('2024-02-15'),
      status: 'pending',
    },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  const handleShare = () => {
    // 实现分享功能
    console.log('分享链接:', referralLink);
  };

  const handleShowQRCode = () => {
    // 实现显示二维码功能
    console.log('显示二维码:', referralLink);
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'primary';
      case 2:
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        推广中心
      </Typography>

      <Grid container spacing={3}>
        {/* 推广链接卡片 */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              您的推广链接
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                value={referralLink}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Tooltip title="复制链接">
                <IconButton onClick={handleCopyLink}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="分享">
                <IconButton onClick={handleShare}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="显示二维码">
                <IconButton onClick={handleShowQRCode}>
                  <QrCodeIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              直接推荐获得20%收益分成，间接推荐获得10%收益分成
            </Typography>
          </Card>
        </Grid>

        {/* 推荐用户列表 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              推荐用户
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>用户名</TableCell>
                    <TableCell>加入时间</TableCell>
                    <TableCell>总收益</TableCell>
                    <TableCell>月化收益</TableCell>
                    <TableCell>等级</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {referralUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {user.joinDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>${user.totalProfit.toFixed(2)}</TableCell>
                      <TableCell>{user.monthlyReturn}%</TableCell>
                      <TableCell>
                        <Chip
                          label={`${user.level}级`}
                          color={getLevelColor(user.level)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* 推荐奖励列表 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              推荐奖励
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>金额</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>日期</TableCell>
                    <TableCell>状态</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewards.map(reward => (
                    <TableRow key={reward.id}>
                      <TableCell>${reward.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {reward.type === 'direct' ? '直接推荐' : '间接推荐'}
                      </TableCell>
                      <TableCell>
                        {reward.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reward.status === 'paid' ? '已发放' : '待发放'}
                          color={reward.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferralCenter; 