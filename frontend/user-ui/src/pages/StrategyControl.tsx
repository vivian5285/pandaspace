import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Switch,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  GridOn as GridIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  riskLevel: number;
  leverage: number;
  parameters: Record<string, any>;
}

const StrategyControl: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: '超级趋势策略',
      description: '基于价格趋势的动态止损止盈策略',
      isActive: true,
      riskLevel: 70,
      leverage: 2,
      parameters: {
        period: 14,
        multiplier: 3,
        stopLoss: 2,
        takeProfit: 4,
      },
    },
    {
      id: '2',
      name: '网格策略',
      description: '在固定价格区间内进行网格交易',
      isActive: false,
      riskLevel: 50,
      leverage: 1,
      parameters: {
        upperPrice: 50000,
        lowerPrice: 45000,
        gridCount: 10,
        investment: 1000,
      },
    },
    {
      id: '3',
      name: '剥头皮策略',
      description: '快速进出场获取小额利润',
      isActive: true,
      riskLevel: 30,
      leverage: 1,
      parameters: {
        profitTarget: 0.5,
        stopLoss: 0.3,
        maxHoldingTime: 5,
      },
    },
  ]);

  const handleStrategyToggle = (strategyId: string) => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === strategyId
          ? { ...strategy, isActive: !strategy.isActive }
          : strategy
      )
    );
  };

  const handleRiskLevelChange = (strategyId: string, value: number) => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === strategyId
          ? { ...strategy, riskLevel: value }
          : strategy
      )
    );
  };

  const handleLeverageChange = (strategyId: string, value: number) => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === strategyId
          ? { ...strategy, leverage: value }
          : strategy
      )
    );
  };

  const handleParameterChange = (
    strategyId: string,
    parameter: string,
    value: any
  ) => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === strategyId
          ? {
              ...strategy,
              parameters: {
                ...strategy.parameters,
                [parameter]: value,
              },
            }
          : strategy
      )
    );
  };

  const getStrategyIcon = (strategyName: string) => {
    switch (strategyName) {
      case '超级趋势策略':
        return <TrendingUpIcon />;
      case '网格策略':
        return <GridIcon />;
      case '剥头皮策略':
        return <SpeedIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        策略控制
      </Typography>

      <Grid container spacing={3}>
        {strategies.map(strategy => (
          <Grid item xs={12} md={6} key={strategy.id}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getStrategyIcon(strategy.name)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {strategy.name}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Switch
                  checked={strategy.isActive}
                  onChange={() => handleStrategyToggle(strategy.id)}
                />
              </Box>

              <Typography color="text.secondary" paragraph>
                {strategy.description}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>风险等级</Typography>
                <Slider
                  value={strategy.riskLevel}
                  onChange={(_, value) =>
                    handleRiskLevelChange(strategy.id, value as number)
                  }
                  min={0}
                  max={100}
                  marks
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  {strategy.riskLevel}%
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>杠杆倍数</Typography>
                <Slider
                  value={strategy.leverage}
                  onChange={(_, value) =>
                    handleLeverageChange(strategy.id, value as number)
                  }
                  min={1}
                  max={10}
                  marks
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  {strategy.leverage}x
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>策略参数</Typography>
                {Object.entries(strategy.parameters).map(([key, value]) => (
                  <TextField
                    key={key}
                    label={key}
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleParameterChange(strategy.id, key, Number(e.target.value))
                    }
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  // 保存策略设置
                  console.log('保存策略设置:', strategy);
                }}
              >
                保存设置
              </Button>

              {strategy.isActive && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  策略已激活
                </Alert>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StrategyControl; 