import express from 'express';
import { EarningsService } from '../services/earningsService';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const earningsService = new EarningsService();

// 获取收益报告
router.get('/', authenticateToken, async (req, res) => {
  try {
    const timeRange = (req.query.timeRange as 'week' | 'month' | 'year') || 'month';
    const report = await earningsService.generateEarningsReport(req.user.id);
    res.json(report);
  } catch (error) {
    console.error('Error fetching earnings report:', error);
    res.status(500).json({ error: '获取收益报告失败' });
  }
});

// 导出收益数据
router.get('/export', authenticateToken, async (req, res) => {
  try {
    const format = (req.query.format as 'csv' | 'excel') || 'csv';
    const data = await earningsService.exportEarningsData(req.user.id, format);
    
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel');
    res.setHeader('Content-Disposition', `attachment; filename=earnings-report.${format}`);
    res.send(data);
  } catch (error) {
    console.error('Error exporting earnings data:', error);
    res.status(500).json({ error: '导出收益数据失败' });
  }
});

// 获取交易收益历史
router.get('/trading', authenticateToken, async (req, res) => {
  try {
    const timeRange = (req.query.timeRange as 'week' | 'month' | 'year') || 'month';
    const profits = await earningsService.getTradingProfits(req.user.id, timeRange);
    res.json(profits);
  } catch (error) {
    console.error('Error fetching trading profits:', error);
    res.status(500).json({ error: '获取交易收益失败' });
  }
});

// 获取推荐收益
router.get('/referral', authenticateToken, async (req, res) => {
  try {
    const earnings = await earningsService.getReferralEarnings(req.user.id);
    res.json(earnings);
  } catch (error) {
    console.error('Error fetching referral earnings:', error);
    res.status(500).json({ error: '获取推荐收益失败' });
  }
});

export default router; 