import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Card, Grid, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketData {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  volume: number;
  timestamp: Date;
}

interface TradeData {
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  profit: number;
  status: string;
}

const RealTimeData: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [activeTrades, setActiveTrades] = useState<TradeData[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001');
    setSocket(newSocket);

    // 订阅市场数据
    newSocket.emit('subscribeMarket', 'BTCUSDT');

    // 订阅交易更新
    newSocket.emit('subscribeTrades', 'user123'); // 替换为实际用户ID

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('marketUpdate', (data: MarketData) => {
      setMarketData(prev => [...prev.slice(-20), data]);
    });

    socket.on('tradeUpdate', (data: TradeData) => {
      setActiveTrades(prev => {
        const index = prev.findIndex(trade => trade.symbol === data.symbol);
        if (index === -1) return [...prev, data];
        const newTrades = [...prev];
        newTrades[index] = data;
        return newTrades;
      });
    });

    return () => {
      socket.off('marketUpdate');
      socket.off('tradeUpdate');
    };
  }, [socket]);

  const chartData = {
    labels: marketData.map(data => new Date(data.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'BTC/USDT',
        data: marketData.map(data => data.currentPrice),
        borderColor: 'rgb(75, 192, 192)',
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
        text: '实时价格走势',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* 价格图表 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Line options={chartOptions} data={chartData} />
          </Card>
        </Grid>

        {/* 市场数据概览 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              市场概览
            </Typography>
            {marketData.length > 0 && (
              <Box>
                <Typography>
                  当前价格: ${marketData[marketData.length - 1].currentPrice.toFixed(2)}
                </Typography>
                <Typography color={marketData[marketData.length - 1].priceChange >= 0 ? 'success.main' : 'error.main'}>
                  24h涨跌: {marketData[marketData.length - 1].priceChange.toFixed(2)}%
                </Typography>
                <Typography>
                  24h成交量: {marketData[marketData.length - 1].volume.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* 活跃交易 */}
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              活跃交易
            </Typography>
            <Grid container spacing={2}>
              {activeTrades.map((trade, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle1">
                      {trade.symbol}
                    </Typography>
                    <Typography>
                      类型: {trade.type === 'long' ? '做多' : '做空'}
                    </Typography>
                    <Typography>
                      入场价: ${trade.entryPrice.toFixed(2)}
                    </Typography>
                    <Typography>
                      当前价: ${trade.currentPrice.toFixed(2)}
                    </Typography>
                    <Typography color={trade.profit >= 0 ? 'success.main' : 'error.main'}>
                      盈亏: ${trade.profit.toFixed(2)}
                    </Typography>
                    <Typography>
                      状态: {trade.status}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RealTimeData; 