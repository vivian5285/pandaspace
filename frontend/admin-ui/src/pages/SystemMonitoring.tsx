import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeUsers: number;
  activeTrades: number;
  apiLatency: number;
  errorRate: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

const SystemMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeUsers: 0,
    activeTrades: 0,
    apiLatency: 0,
    errorRate: 0,
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [timeRange, setTimeRange] = useState('1h');

  // 模拟数据
  useEffect(() => {
    const mockMetrics: SystemMetrics = {
      cpu: 45,
      memory: 60,
      disk: 75,
      network: 30,
      activeUsers: 150,
      activeTrades: 500,
      apiLatency: 120,
      errorRate: 0.5,
    };
    setMetrics(mockMetrics);

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'warning',
        message: 'CPU使用率超过80%',
        timestamp: '2024-03-20 10:30:00',
        status: 'active',
      },
      {
        id: '2',
        type: 'error',
        message: 'API响应时间异常',
        timestamp: '2024-03-20 10:25:00',
        status: 'active',
      },
      // 添加更多模拟数据...
    ];
    setAlerts(mockAlerts);
  }, []);

  const chartData = {
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'],
    datasets: [
      {
        label: 'CPU使用率',
        data: [30, 45, 35, 50, 40, 45],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: '内存使用率',
        data: [40, 55, 45, 60, 50, 60],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '系统资源使用趋势',
      },
    },
  };

  const handleRefresh = () => {
    // 实现刷新数据逻辑
    console.log('刷新数据');
  };

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleResolveAlert = (alertId: string) => {
    // 实现解决告警逻辑
    console.log('解决告警:', alertId);
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
        return <CheckCircleIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">系统监控</Typography>
        <Box>
          <TextField
            select
            size="small"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{ mr: 2, minWidth: 120 }}
          >
            <MenuItem value="1h">最近1小时</MenuItem>
            <MenuItem value="24h">最近24小时</MenuItem>
            <MenuItem value="7d">最近7天</MenuItem>
          </TextField>
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* 系统指标卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MemoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography color="textSecondary">CPU使用率</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.cpu}
                sx={{ mb: 1 }}
              />
              <Typography variant="h6">{metrics.cpu}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StorageIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography color="textSecondary">内存使用率</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.memory}
                sx={{ mb: 1 }}
              />
              <Typography variant="h6">{metrics.memory}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SpeedIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography color="textSecondary">API延迟</Typography>
              </Box>
              <Typography variant="h6">{metrics.apiLatency}ms</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography color="textSecondary">错误率</Typography>
              </Box>
              <Typography variant="h6">{metrics.errorRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 资源使用趋势图 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Line data={chartData} options={chartOptions} />
        </CardContent>
      </Card>

      {/* 告警列表 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            系统告警
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>类型</TableCell>
                  <TableCell>消息</TableCell>
                  <TableCell>时间</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Chip
                        icon={getAlertIcon(alert.type)}
                        label={alert.type}
                        color={getAlertColor(alert.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{alert.timestamp}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.status}
                        color={alert.status === 'active' ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="查看详情">
                        <IconButton
                          size="small"
                          onClick={() => handleViewAlert(alert)}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                      {alert.status === 'active' && (
                        <Tooltip title="解决告警">
                          <IconButton
                            size="small"
                            onClick={() => handleResolveAlert(alert.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 告警详情对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>告警详情</DialogTitle>
        <DialogContent>
          {selectedAlert && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography color="textSecondary">类型</Typography>
                  <Chip
                    icon={getAlertIcon(selectedAlert.type)}
                    label={selectedAlert.type}
                    color={getAlertColor(selectedAlert.type)}
                    sx={{ mt: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">消息</Typography>
                  <Typography>{selectedAlert.message}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">时间</Typography>
                  <Typography>{selectedAlert.timestamp}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="textSecondary">状态</Typography>
                  <Chip
                    label={selectedAlert.status}
                    color={selectedAlert.status === 'active' ? 'error' : 'success'}
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemMonitoring; 