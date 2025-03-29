<template>
  <div class="strategy-management">
    <h2>交易策略管理</h2>

    <!-- 交易分析 -->
    <div class="trading-analysis">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>交易分析</span>
            <el-button type="primary" @click="refreshAnalysis">刷新</el-button>
          </div>
        </template>
        <div class="analysis-stats">
          <div class="stat-item">
            <span class="label">总交易次数</span>
            <span class="value">{{ analysis.total_trades }}</span>
          </div>
          <div class="stat-item">
            <span class="label">胜率</span>
            <span class="value">{{ (analysis.win_rate * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">平均收益</span>
            <span class="value">{{ analysis.average_profit.toFixed(2) }} USDT</span>
          </div>
          <div class="stat-item">
            <span class="label">最大回撤</span>
            <span class="value">{{ (analysis.max_drawdown * 100).toFixed(2) }}%</span>
          </div>
          <div class="stat-item">
            <span class="label">夏普比率</span>
            <span class="value">{{ analysis.sharpe_ratio.toFixed(2) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 策略推荐 -->
    <div class="strategy-recommendations">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>策略推荐</span>
            <el-button type="primary" @click="refreshRecommendations">刷新</el-button>
          </div>
        </template>
        <el-table :data="recommendations" style="width: 100%">
          <el-table-column prop="name" label="策略名称" width="180">
            <template #default="scope">
              <el-tag :type="getRiskLevelType(scope.row.risk_level)">
                {{ scope.row.name }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="expected_return" label="预期收益" width="180" />
          <el-table-column prop="recommendation_reason" label="推荐理由" />
        </el-table>
      </el-card>
    </div>

    <!-- 性能报告 -->
    <div class="performance-report">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>性能报告</span>
            <el-radio-group v-model="reportPeriod" @change="loadPerformanceReport">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="report-content">
          <div class="report-stats">
            <div class="stat-item">
              <span class="label">总交易次数</span>
              <span class="value">{{ performance.total_trades }}</span>
            </div>
            <div class="stat-item">
              <span class="label">总收益</span>
              <span class="value">{{ performance.total_profit.toFixed(2) }} USDT</span>
            </div>
            <div class="stat-item">
              <span class="label">胜率</span>
              <span class="value">{{ (performance.win_rate * 100).toFixed(2) }}%</span>
            </div>
            <div class="stat-item">
              <span class="label">最大回撤</span>
              <span class="value">{{ (performance.max_drawdown * 100).toFixed(2) }}%</span>
            </div>
          </div>
          <div class="report-chart">
            <!-- 这里可以添加图表组件 -->
          </div>
          <div class="strategy-stats">
            <h3>策略统计</h3>
            <el-table :data="strategyStats" style="width: 100%">
              <el-table-column prop="strategy" label="策略" />
              <el-table-column prop="total_trades" label="交易次数" />
              <el-table-column prop="winning_trades" label="盈利次数" />
              <el-table-column prop="total_profit" label="总收益" />
              <el-table-column prop="avg_profit" label="平均收益" />
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'StrategyManagement',
  setup() {
    const analysis = ref({})
    const recommendations = ref([])
    const reportPeriod = ref('month')
    const performance = ref({})
    const strategyStats = ref([])

    const loadAnalysis = async () => {
      try {
        const response = await axios.get(`/api/strategies/analyze/${userId}`)
        analysis.value = response.data
      } catch (error) {
        ElMessage.error('加载交易分析失败')
      }
    }

    const loadRecommendations = async () => {
      try {
        const response = await axios.get(`/api/strategies/recommend/${userId}`)
        recommendations.value = response.data
      } catch (error) {
        ElMessage.error('加载策略推荐失败')
      }
    }

    const loadPerformanceReport = async () => {
      try {
        const response = await axios.get(`/api/strategies/performance/${userId}`, {
          params: {
            period: reportPeriod.value
          }
        })
        performance.value = response.data
        strategyStats.value = Object.entries(response.data.strategy_stats).map(([strategy, stats]) => ({
          strategy,
          ...stats
        }))
      } catch (error) {
        ElMessage.error('加载性能报告失败')
      }
    }

    const getRiskLevelType = (riskLevel) => {
      const types = {
        low: 'success',
        medium: 'warning',
        high: 'danger'
      }
      return types[riskLevel] || 'info'
    }

    onMounted(() => {
      loadAnalysis()
      loadRecommendations()
      loadPerformanceReport()
    })

    return {
      analysis,
      recommendations,
      reportPeriod,
      performance,
      strategyStats,
      loadAnalysis,
      loadRecommendations,
      loadPerformanceReport,
      getRiskLevelType
    }
  }
}
</script>

<style scoped>
.strategy-management {
  padding: 20px;
}

.trading-analysis {
  margin-bottom: 20px;
}

.analysis-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-item .value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strategy-recommendations {
  margin-bottom: 20px;
}

.report-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.report-chart {
  min-height: 300px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
}

.strategy-stats {
  grid-column: 1 / -1;
  margin-top: 20px;
}

.strategy-stats h3 {
  margin-bottom: 20px;
}
</style> 