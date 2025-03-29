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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material';

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'scalping' | 'supertrend' | 'grid';
  status: 'active' | 'inactive' | 'testing';
  riskLevel: number;
  maxLeverage: number;
  parameters: {
    [key: string]: any;
  };
  performance: {
    totalTrades: number;
    winRate: number;
    averageProfit: number;
    maxDrawdown: number;
  };
}

const StrategyManagement: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    riskLevel: 5,
    maxLeverage: 10,
    parameters: {},
  });

  // 模拟数据
  useEffect(() => {
    const mockStrategies: Strategy[] = [
      {
        id: '1',
        name: '快速套利策略',
        description: '基于价格波动的快速套利策略',
        type: 'scalping',
        status: 'active',
        riskLevel: 5,
        maxLeverage: 10,
        parameters: {
          entryThreshold: 0.5,
          exitThreshold: 0.3,
          maxHoldTime: 300,
        },
        performance: {
          totalTrades: 100,
          winRate: 65,
          averageProfit: 0.8,
          maxDrawdown: 2.5,
        },
      },
      // 添加更多模拟数据...
    ];
    setStrategies(mockStrategies);
  }, []);

  const handleEditStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setFormData({
      name: strategy.name,
      description: strategy.description,
      type: strategy.type,
      riskLevel: strategy.riskLevel,
      maxLeverage: strategy.maxLeverage,
      parameters: strategy.parameters,
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleAddStrategy = () => {
    setSelectedStrategy(null);
    setFormData({
      name: '',
      description: '',
      type: '',
      riskLevel: 5,
      maxLeverage: 10,
      parameters: {},
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    // 实现删除策略逻辑
    console.log('删除策略:', strategyId);
  };

  const handleToggleStatus = (strategyId: string, currentStatus: string) => {
    // 实现切换策略状态逻辑
    console.log('切换策略状态:', strategyId, currentStatus);
  };

  const handleSaveStrategy = () => {
    // 实现保存策略逻辑
    console.log('保存策略:', formData);
    setOpenDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'testing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">策略管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStrategy}
        >
          添加策略
        </Button>
      </Box>

      {/* 策略列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>策略名称</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>风险等级</TableCell>
              <TableCell>最大杠杆</TableCell>
              <TableCell>总交易次数</TableCell>
              <TableCell>胜率</TableCell>
              <TableCell>平均收益</TableCell>
              <TableCell>最大回撤</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {strategies.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell>{strategy.name}</TableCell>
                <TableCell>{strategy.type}</TableCell>
                <TableCell>
                  <Chip
                    label={strategy.status}
                    color={getStatusColor(strategy.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{strategy.riskLevel}</TableCell>
                <TableCell>{strategy.maxLeverage}x</TableCell>
                <TableCell>{strategy.performance.totalTrades}</TableCell>
                <TableCell>{strategy.performance.winRate}%</TableCell>
                <TableCell>{strategy.performance.averageProfit}%</TableCell>
                <TableCell>{strategy.performance.maxDrawdown}%</TableCell>
                <TableCell>
                  <Tooltip title="编辑">
                    <IconButton
                      size="small"
                      onClick={() => handleEditStrategy(strategy)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={strategy.status === 'active' ? '停用' : '启用'}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleToggleStatus(strategy.id, strategy.status)
                      }
                    >
                      {strategy.status === 'active' ? (
                        <StopIcon />
                      ) : (
                        <PlayArrowIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="删除">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteStrategy(strategy.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 编辑策略对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? '编辑策略' : '添加策略'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="策略名称"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="描述"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="策略类型"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <MenuItem value="scalping">快速套利</MenuItem>
                <MenuItem value="supertrend">超级趋势</MenuItem>
                <MenuItem value="grid">网格交易</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>风险等级</Typography>
              <Slider
                value={formData.riskLevel}
                onChange={(_, value) =>
                  setFormData({ ...formData, riskLevel: value as number })
                }
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>最大杠杆</Typography>
              <Slider
                value={formData.maxLeverage}
                onChange={(_, value) =>
                  setFormData({ ...formData, maxLeverage: value as number })
                }
                min={1}
                max={100}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                策略参数
              </Typography>
              {/* 根据策略类型显示不同的参数设置 */}
              {formData.type === 'scalping' && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="入场阈值"
                      type="number"
                      value={formData.parameters.entryThreshold || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parameters: {
                            ...formData.parameters,
                            entryThreshold: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="出场阈值"
                      type="number"
                      value={formData.parameters.exitThreshold || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parameters: {
                            ...formData.parameters,
                            exitThreshold: parseFloat(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="最大持仓时间(秒)"
                      type="number"
                      value={formData.parameters.maxHoldTime || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parameters: {
                            ...formData.parameters,
                            maxHoldTime: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSaveStrategy} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StrategyManagement; 