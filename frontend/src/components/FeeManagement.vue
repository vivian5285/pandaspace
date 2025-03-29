<template>
  <div class="fee-management">
    <h2>托管费用管理</h2>
    
    <!-- 费用概览 -->
    <div class="fee-overview">
      <el-card class="fee-card">
        <template #header>
          <div class="card-header">
            <span>费用概览</span>
            <div class="header-controls">
              <el-button type="primary" @click="refreshFeeData">刷新</el-button>
              <el-button type="info" @click="showGiftRules">使用规则</el-button>
            </div>
          </div>
        </template>
        <div class="fee-stats">
          <div class="stat-item">
            <span class="label">当前余额</span>
            <span class="value">{{ currentBalance }} USDT</span>
          </div>
          <div class="stat-item gift-account-item">
            <span class="label">赠送账户</span>
            <span class="value gift-account">{{ giftAccountBalance }} USDT</span>
            <span class="sub-label">仅用于抵扣托管费</span>
            <el-tooltip
              v-if="giftAccountBalance <= 5"
              content="赠送账户余额较低，请及时充值"
              placement="top"
            >
              <el-icon class="warning-icon"><Warning /></el-icon>
            </el-tooltip>
          </div>
          <div class="stat-item">
            <span class="label">平台抽成</span>
            <span class="value">{{ platformFee }} USDT</span>
          </div>
          <div class="stat-item">
            <span class="label">领导人抽成</span>
            <span class="value">{{ leaderFee }} USDT</span>
          </div>
          <div class="stat-item">
            <span class="label">总费用</span>
            <span class="value">{{ totalFee }} USDT</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 费用历史 -->
    <div class="fee-history">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>费用历史</span>
            <div class="header-controls">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="loadFeeHistory"
              />
              <el-button type="primary" @click="loadFeeHistory">查询</el-button>
            </div>
          </div>
        </template>
        <el-table :data="feeHistory" style="width: 100%">
          <el-table-column prop="created_at" label="日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column prop="platform_fee" label="平台抽成" width="180">
            <template #default="scope">
              {{ scope.row.platform_fee }} USDT
            </template>
          </el-table-column>
          <el-table-column prop="leader_fee" label="领导人抽成" width="180">
            <template #default="scope">
              {{ scope.row.leader_fee }} USDT
            </template>
          </el-table-column>
          <el-table-column prop="gift_used" label="赠送抵扣" width="180">
            <template #default="scope">
              <span class="gift-amount">{{ scope.row.gift_used }} USDT</span>
            </template>
          </el-table-column>
          <el-table-column prop="total_fee" label="总费用">
            <template #default="scope">
              {{ scope.row.total_fee }} USDT
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 费用报告 -->
    <div class="fee-report">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>费用报告</span>
            <el-radio-group v-model="reportPeriod" @change="loadFeeReport">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="report-content">
          <div class="report-stats">
            <div class="stat-item">
              <span class="label">总费用</span>
              <span class="value">{{ reportData.total_fees }} USDT</span>
            </div>
            <div class="stat-item">
              <span class="label">平台费用</span>
              <span class="value">{{ reportData.platform_fees }} USDT</span>
            </div>
            <div class="stat-item">
              <span class="label">领导人费用</span>
              <span class="value">{{ reportData.leader_fees }} USDT</span>
            </div>
            <div class="stat-item">
              <span class="label">赠送抵扣</span>
              <span class="value gift-account">{{ reportData.gift_used }} USDT</span>
            </div>
          </div>
          <div class="report-chart">
            <!-- 这里可以添加图表组件 -->
          </div>
        </div>
      </el-card>
    </div>

    <!-- 赠送账户规则对话框 -->
    <el-dialog
      v-model="giftRulesVisible"
      title="赠送账户使用规则"
      width="600px"
    >
      <div class="gift-rules">
        <div v-for="(rule, index) in giftRules" :key="index" class="rule-item">
          <h3>{{ rule.title }}</h3>
          <p>{{ rule.content }}</p>
        </div>
        <div class="notification-info">
          <h4>通知设置</h4>
          <p>当赠送账户余额变动超过 {{ giftRules.notifications.balance_threshold }} USDT 时，系统将发送通知。</p>
          <p class="warning-text">{{ giftRules.notifications.low_balance_warning }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 赠送账户通知 -->
    <el-drawer
      v-model="notificationsVisible"
      title="赠送账户通知"
      direction="rtl"
      size="400px"
    >
      <div class="notifications-list">
        <el-timeline>
          <el-timeline-item
            v-for="notification in giftNotifications"
            :key="notification.id"
            :timestamp="formatDate(notification.created_at)"
            :type="getNotificationType(notification.type)"
          >
            <div class="notification-content">
              <h4>{{ notification.message }}</h4>
              <div class="notification-details">
                <p>变动金额: {{ notification.data.amount }} USDT</p>
                <p>当前余额: {{ notification.data.current_balance }} USDT</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Warning } from '@element-plus/icons-vue'
import axios from 'axios'

export default {
  name: 'FeeManagement',
  components: {
    Warning
  },
  setup() {
    const currentBalance = ref(0)
    const giftAccountBalance = ref(0)
    const platformFee = ref(0)
    const leaderFee = ref(0)
    const totalFee = ref(0)
    const feeHistory = ref([])
    const dateRange = ref([])
    const reportPeriod = ref('month')
    const reportData = ref({})
    const giftRulesVisible = ref(false)
    const notificationsVisible = ref(false)
    const giftRules = ref({})
    const giftNotifications = ref([])

    const loadFeeData = async () => {
      try {
        const response = await axios.get(`/api/fees/calculate/${userId}`)
        const data = response.data
        currentBalance.value = data.current_balance
        giftAccountBalance.value = data.gift_balance
        platformFee.value = data.platform_fee
        leaderFee.value = data.leader_fee
        totalFee.value = data.total_fee
      } catch (error) {
        ElMessage.error('加载费用数据失败')
      }
    }

    const loadFeeHistory = async () => {
      try {
        const [startDate, endDate] = dateRange.value
        const response = await axios.get(`/api/fees/history/${userId}`, {
          params: {
            start_date: startDate,
            end_date: endDate
          }
        })
        feeHistory.value = response.data
      } catch (error) {
        ElMessage.error('加载费用历史失败')
      }
    }

    const loadFeeReport = async () => {
      try {
        const response = await axios.get(`/api/fees/report/${userId}`, {
          params: {
            period: reportPeriod.value
          }
        })
        reportData.value = response.data
      } catch (error) {
        ElMessage.error('加载费用报告失败')
      }
    }

    const loadGiftRules = async () => {
      try {
        const response = await axios.get('/api/gift/rules')
        giftRules.value = response.data
      } catch (error) {
        ElMessage.error('加载赠送账户规则失败')
      }
    }

    const loadGiftNotifications = async () => {
      try {
        const response = await axios.get('/api/gift/notifications')
        giftNotifications.value = response.data
      } catch (error) {
        ElMessage.error('加载通知失败')
      }
    }

    const showGiftRules = () => {
      giftRulesVisible.value = true
      loadGiftRules()
    }

    const getNotificationType = (type) => {
      const types = {
        gift_account_created: 'success',
        gift_balance_used: 'warning',
        gift_balance_low: 'danger'
      }
      return types[type] || 'info'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    onMounted(() => {
      loadFeeData()
      loadFeeReport()
      loadGiftNotifications()
    })

    return {
      currentBalance,
      giftAccountBalance,
      platformFee,
      leaderFee,
      totalFee,
      feeHistory,
      dateRange,
      reportPeriod,
      reportData,
      giftRulesVisible,
      notificationsVisible,
      giftRules,
      giftNotifications,
      showGiftRules,
      loadGiftRules,
      loadGiftNotifications,
      getNotificationType,
      formatDate
    }
  }
}
</script>

<style scoped>
.fee-management {
  padding: 20px;
}

.fee-overview {
  margin-bottom: 20px;
}

.fee-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.header-controls {
  display: flex;
  gap: 10px;
}

.fee-history {
  margin-bottom: 20px;
}

.report-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.report-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-chart {
  min-height: 300px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 20px;
}

.gift-account {
  color: #67C23A;
}

.sub-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.gift-amount {
  color: #67C23A;
  font-weight: bold;
}

.gift-account-item {
  position: relative;
}

.warning-icon {
  position: absolute;
  top: 0;
  right: 0;
  color: #E6A23C;
  font-size: 20px;
}

.gift-rules {
  padding: 20px;
}

.rule-item {
  margin-bottom: 20px;
}

.rule-item h3 {
  color: #409EFF;
  margin-bottom: 10px;
}

.rule-item p {
  color: #606266;
  line-height: 1.6;
}

.notification-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.notification-info h4 {
  color: #409EFF;
  margin-bottom: 10px;
}

.warning-text {
  color: #E6A23C;
  font-weight: bold;
  margin-top: 10px;
}

.notifications-list {
  padding: 20px;
}

.notification-content {
  background-color: #F5F7FA;
  padding: 10px;
  border-radius: 4px;
}

.notification-content h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.notification-details {
  font-size: 14px;
  color: #606266;
}

.notification-details p {
  margin: 5px 0;
}
</style> 