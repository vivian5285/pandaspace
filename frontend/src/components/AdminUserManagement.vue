<template>
  <div class="admin-user-management">
    <h2>用户管理</h2>
    
    <!-- 搜索和过滤 -->
    <div class="search-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户 (邮箱/用户名/钱包地址)"
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <!-- 添加筛选条件 -->
    <div class="filter-bar">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
            <el-option label="正常" value="active" />
            <el-option label="暂停" value="suspended" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item label="余额范围">
          <el-input-number v-model="filterForm.min_balance" :min="0" placeholder="最小余额" />
          <span class="mx-2">-</span>
          <el-input-number v-model="filterForm.max_balance" :min="0" placeholder="最大余额" />
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="filterForm.registration_date_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="团队规模">
          <el-input-number v-model="filterForm.team_size_min" :min="0" placeholder="最小规模" />
          <span class="mx-2">-</span>
          <el-input-number v-model="filterForm.team_size_max" :min="0" placeholder="最大规模" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加批量操作按钮 -->
    <div class="batch-actions" v-if="selectedUsers.length > 0">
      <el-button-group>
        <el-button type="primary" @click="showBatchStatusDialog">
          批量修改状态
        </el-button>
        <el-button type="danger" @click="showBatchDeleteDialog">
          批量删除
        </el-button>
        <el-button type="warning" @click="showBatchResetPasswordDialog">
          批量重置密码
        </el-button>
      </el-button-group>
    </div>

    <!-- 添加导出按钮 -->
    <div class="export-actions">
      <el-button type="success" @click="exportUsers">
        导出用户数据
      </el-button>
    </div>

    <!-- 添加数据统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总用户数</span>
              </div>
            </template>
            <div class="statistics-value">{{ statistics.total_users }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>活跃用户</span>
              </div>
            </template>
            <div class="statistics-value">{{ statistics.active_users }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总交易量</span>
              </div>
            </template>
            <div class="statistics-value">{{ statistics.total_trades }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>总交易金额</span>
              </div>
            </template>
            <div class="statistics-value">{{ statistics.total_volume }} USDT</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加趋势图表 -->
    <div class="trends-section">
      <el-card class="trends-card">
        <template #header>
          <div class="card-header">
            <span>趋势分析</span>
            <el-radio-group v-model="trendPeriod" size="small" @change="loadTrends">
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="90d">90天</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="trends-charts">
          <el-row :gutter="20">
            <el-col :span="12">
              <div ref="userGrowthChart" class="chart"></div>
            </el-col>
            <el-col :span="12">
              <div ref="tradeVolumeChart" class="chart"></div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-4">
            <el-col :span="12">
              <div ref="profitTrendChart" class="chart"></div>
            </el-col>
            <el-col :span="12">
              <div ref="activeUsersChart" class="chart"></div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 添加系统性能监控 -->
    <div class="system-monitoring">
      <el-card class="monitoring-card">
        <template #header>
          <div class="card-header">
            <span>系统性能监控</span>
            <el-button type="primary" size="small" @click="refreshSystemStats">
              刷新
            </el-button>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="monitoring-item">
              <div class="monitoring-title">CPU使用率</div>
              <el-progress 
                type="dashboard" 
                :percentage="systemStats.cpu.percent"
                :color="getProgressColor(systemStats.cpu.percent)"
              />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="monitoring-item">
              <div class="monitoring-title">内存使用率</div>
              <el-progress 
                type="dashboard" 
                :percentage="systemStats.memory.percent"
                :color="getProgressColor(systemStats.memory.percent)"
              />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="monitoring-item">
              <div class="monitoring-title">磁盘使用率</div>
              <el-progress 
                type="dashboard" 
                :percentage="systemStats.disk.percent"
                :color="getProgressColor(systemStats.disk.percent)"
              />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="monitoring-item">
              <div class="monitoring-title">进程数</div>
              <div class="monitoring-value">{{ systemStats.processes }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 用户列表 -->
    <el-table :data="users" style="width: 100%" v-loading="loading">
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="wallet_address" label="钱包地址" width="200" />
      <el-table-column prop="balance" label="账户余额" width="120">
        <template #default="scope">
          {{ scope.row.balance }} USDT
        </template>
      </el-table-column>
      <el-table-column prop="gift_account_balance" label="赠送余额" width="120">
        <template #default="scope">
          {{ scope.row.gift_account_balance }} USDT
        </template>
      </el-table-column>
      <el-table-column prop="service_fee_balance" label="托管金额" width="120">
        <template #default="scope">
          {{ scope.row.service_fee_balance }} USDT
        </template>
      </el-table-column>
      <el-table-column prop="registration_date" label="注册时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.registration_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" @click="showUserDetails(scope.row)">
              详情
            </el-button>
            <el-button 
              type="warning" 
              @click="showStatusDialog(scope.row)"
              :disabled="scope.row.status === 'banned'"
            >
              修改状态
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailsVisible"
      title="用户详情"
      width="80%"
      class="user-details-dialog"
    >
      <div v-if="selectedUser" class="user-details">
        <!-- 基本信息 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="邮箱">{{ selectedUser.basic_info.email }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ selectedUser.basic_info.username }}</el-descriptions-item>
            <el-descriptions-item label="钱包地址">{{ selectedUser.basic_info.wallet_address }}</el-descriptions-item>
            <el-descriptions-item label="API Key">{{ selectedUser.basic_info.api_key }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ formatDate(selectedUser.basic_info.registration_date) }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(selectedUser.basic_info.status)">
                {{ getStatusText(selectedUser.basic_info.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 余额信息 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>余额信息</span>
            </div>
          </template>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="账户余额">{{ selectedUser.balance_info.balance }} USDT</el-descriptions-item>
            <el-descriptions-item label="赠送余额">{{ selectedUser.balance_info.gift_account_balance }} USDT</el-descriptions-item>
            <el-descriptions-item label="托管金额">{{ selectedUser.balance_info.service_fee_balance }} USDT</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 邀请信息 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>邀请信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="邀请人">
              {{ selectedUser.referrer ? selectedUser.referrer.username : '无' }}
            </el-descriptions-item>
            <el-descriptions-item label="团队规模">
              {{ selectedUser.team.total_team_size }} 人
            </el-descriptions-item>
            <el-descriptions-item label="直接邀请">
              {{ selectedUser.team.direct_referrals }} 人
            </el-descriptions-item>
            <el-descriptions-item label="二级邀请">
              {{ selectedUser.team.second_level_referrals }} 人
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 交易统计 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>交易统计 ({{ selectedUser.trading_stats.period }})</span>
            </div>
          </template>
          <el-descriptions :column="4" border>
            <el-descriptions-item label="总交易数">{{ selectedUser.trading_stats.total_trades }}</el-descriptions-item>
            <el-descriptions-item label="盈利交易">{{ selectedUser.trading_stats.winning_trades }}</el-descriptions-item>
            <el-descriptions-item label="总盈利">{{ selectedUser.trading_stats.total_profit }} USDT</el-descriptions-item>
            <el-descriptions-item label="胜率">{{ selectedUser.trading_stats.win_rate.toFixed(2) }}%</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 费用历史 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>费用历史</span>
            </div>
          </template>
          <el-table :data="selectedUser.fee_history" style="width: 100%">
            <el-table-column prop="created_at" label="时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                {{ scope.row.amount }} USDT
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="120">
              <template #default="scope">
                {{ getFeeTypeText(scope.row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-card>

        <!-- 赠送账户历史 -->
        <el-card class="detail-card">
          <template #header>
            <div class="card-header">
              <span>赠送账户历史</span>
            </div>
          </template>
          <el-table :data="selectedUser.gift_history" style="width: 100%">
            <el-table-column prop="created_at" label="时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="scope">
                {{ scope.row.amount }} USDT
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="120">
              <template #default="scope">
                {{ getGiftTypeText(scope.row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" />
          </el-table>
        </el-card>
      </div>
    </el-dialog>

    <!-- 修改状态对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="修改用户状态"
      width="400px"
    >
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusType(selectedUser?.status)">
            {{ getStatusText(selectedUser?.status) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="statusForm.newStatus">
            <el-option label="正常" value="active" />
            <el-option label="暂停" value="suspended" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUserStatus">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加批量状态修改对话框 -->
    <el-dialog
      v-model="batchStatusDialogVisible"
      title="批量修改用户状态"
      width="400px"
    >
      <el-form :model="batchStatusForm" label-width="100px">
        <el-form-item label="选择状态">
          <el-select v-model="batchStatusForm.status">
            <el-option label="正常" value="active" />
            <el-option label="暂停" value="suspended" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchStatusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateBatchStatus">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加用户操作日志对话框 -->
    <el-dialog
      v-model="logsDialogVisible"
      title="用户操作日志"
      width="80%"
      class="logs-dialog"
    >
      <el-table :data="userLogs" style="width: 100%" v-loading="logsLoading">
        <el-table-column prop="created_at" label="时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作" width="120" />
        <el-table-column prop="details" label="详情" />
        <el-table-column prop="ip_address" label="IP地址" width="140" />
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="logsCurrentPage"
          v-model:page-size="logsPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="logsTotal"
          layout="total, sizes, prev, pager, next"
          @size-change="handleLogsSizeChange"
          @current-change="handleLogsCurrentChange"
        />
      </div>
    </el-dialog>

    <!-- 添加用户行为分析对话框 -->
    <el-dialog
      v-model="behaviorDialogVisible"
      title="用户行为分析"
      width="80%"
      class="behavior-dialog"
    >
      <div v-if="selectedUser" class="behavior-analysis">
        <!-- 交易行为 -->
        <el-card class="behavior-card">
          <template #header>
            <div class="card-header">
              <span>交易行为</span>
            </div>
          </template>
          <el-descriptions :column="4" border>
            <el-descriptions-item label="总交易数">{{ userBehavior.trading_behavior.total_trades }}</el-descriptions-item>
            <el-descriptions-item label="胜率">{{ userBehavior.trading_behavior.win_rate.toFixed(2) }}%</el-descriptions-item>
            <el-descriptions-item label="平均盈利">{{ userBehavior.trading_behavior.avg_profit.toFixed(2) }} USDT</el-descriptions-item>
            <el-descriptions-item label="最大盈利">{{ userBehavior.trading_behavior.max_profit.toFixed(2) }} USDT</el-descriptions-item>
            <el-descriptions-item label="最大亏损">{{ userBehavior.trading_behavior.max_loss.toFixed(2) }} USDT</el-descriptions-item>
            <el-descriptions-item label="交易频率">{{ userBehavior.trading_behavior.trading_frequency.toFixed(2) }}次/天</el-descriptions-item>
            <el-descriptions-item label="偏好交易时间">{{ userBehavior.trading_behavior.preferred_time || '无' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

export default {
  name: 'AdminUserManagement',
  components: {
    Search
  },
  setup() {
    const users = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const pageSize = ref(20)
    const total = ref(0)
    const detailsVisible = ref(false)
    const statusDialogVisible = ref(false)
    const selectedUser = ref(null)
    const statusForm = ref({
      newStatus: ''
    })
    const selectedUsers = ref([])
    const filterForm = ref({
      status: '',
      min_balance: null,
      max_balance: null,
      registration_date_range: [],
      team_size_min: null,
      team_size_max: null
    })
    const statistics = ref({
      total_users: 0,
      active_users: 0,
      total_trades: 0,
      total_volume: 0
    })
    const batchStatusDialogVisible = ref(false)
    const batchStatusForm = ref({
      status: ''
    })
    const logsDialogVisible = ref(false)
    const userLogs = ref([])
    const logsLoading = ref(false)
    const logsCurrentPage = ref(1)
    const logsPageSize = ref(20)
    const logsTotal = ref(0)

    const loadUsers = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/admin/users', {
          params: {
            page: currentPage.value,
            page_size: pageSize.value,
            search: searchQuery.value
          }
        })
        users.value = response.data.users
        total.value = response.data.total
      } catch (error) {
        ElMessage.error('加载用户数据失败')
      } finally {
        loading.value = false
      }
    }

    const showUserDetails = async (user) => {
      try {
        const response = await axios.get(`/api/admin/users/${user.id}`)
        selectedUser.value = response.data
        detailsVisible.value = true
      } catch (error) {
        ElMessage.error('加载用户详情失败')
      }
    }

    const showStatusDialog = (user) => {
      selectedUser.value = user
      statusForm.value.newStatus = user.status
      statusDialogVisible.value = true
    }

    const updateUserStatus = async () => {
      try {
        await axios.put(`/api/admin/users/${selectedUser.value.id}/status`, {
          status: statusForm.value.newStatus
        })
        ElMessage.success('用户状态更新成功')
        statusDialogVisible.value = false
        loadUsers()
      } catch (error) {
        ElMessage.error('更新用户状态失败')
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
      loadUsers()
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      loadUsers()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      loadUsers()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    const getStatusType = (status) => {
      const types = {
        active: 'success',
        suspended: 'warning',
        banned: 'danger'
      }
      return types[status] || 'info'
    }

    const getStatusText = (status) => {
      const texts = {
        active: '正常',
        suspended: '暂停',
        banned: '封禁'
      }
      return texts[status] || status
    }

    const getFeeTypeText = (type) => {
      const texts = {
        platform_fee: '平台费用',
        leader_fee: '领导人费用',
        service_fee: '服务费用'
      }
      return texts[type] || type
    }

    const getGiftTypeText = (type) => {
      const texts = {
        gift_account_created: '账户创建',
        gift_balance_used: '余额使用',
        gift_balance_low: '余额不足'
      }
      return texts[type] || type
    }

    // 加载统计数据
    const loadStatistics = async () => {
      try {
        const response = await axios.get('/api/admin/statistics')
        statistics.value = response.data
      } catch (error) {
        ElMessage.error('加载统计数据失败')
      }
    }

    // 处理筛选
    const handleFilter = () => {
      currentPage.value = 1
      loadUsers()
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.value = {
        status: '',
        min_balance: null,
        max_balance: null,
        registration_date_range: [],
        team_size_min: null,
        team_size_max: null
      }
      handleFilter()
    }

    // 导出用户数据
    const exportUsers = async () => {
      try {
        const response = await axios.post('/api/admin/users/export', filterForm.value, {
          responseType: 'blob'
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `users_export_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        ElMessage.error('导出用户数据失败')
      }
    }

    // 显示批量状态修改对话框
    const showBatchStatusDialog = () => {
      if (selectedUsers.value.length === 0) {
        ElMessage.warning('请先选择用户')
        return
      }
      batchStatusDialogVisible.value = true
    }

    // 批量更新状态
    const updateBatchStatus = async () => {
      try {
        await axios.post('/api/admin/users/batch-status', {
          user_ids: selectedUsers.value.map(user => user.id),
          status: batchStatusForm.value.status
        })
        ElMessage.success('批量更新状态成功')
        batchStatusDialogVisible.value = false
        loadUsers()
      } catch (error) {
        ElMessage.error('批量更新状态失败')
      }
    }

    // 显示用户操作日志
    const showUserLogs = async (user) => {
      logsDialogVisible.value = true
      await loadUserLogs(user.id)
    }

    // 加载用户操作日志
    const loadUserLogs = async (userId) => {
      logsLoading.value = true
      try {
        const response = await axios.get(`/api/admin/users/${userId}/logs`, {
          params: {
            page: logsCurrentPage.value,
            page_size: logsPageSize.value
          }
        })
        userLogs.value = response.data.logs
        logsTotal.value = response.data.total
      } catch (error) {
        ElMessage.error('加载用户操作日志失败')
      } finally {
        logsLoading.value = false
      }
    }

    // 处理日志分页
    const handleLogsSizeChange = (val) => {
      logsPageSize.value = val
      loadUserLogs(selectedUser.value.id)
    }

    const handleLogsCurrentChange = (val) => {
      logsCurrentPage.value = val
      loadUserLogs(selectedUser.value.id)
    }

    onMounted(() => {
      loadUsers()
      loadStatistics()
    })

    return {
      users,
      loading,
      searchQuery,
      currentPage,
      pageSize,
      total,
      detailsVisible,
      statusDialogVisible,
      selectedUser,
      statusForm,
      selectedUsers,
      filterForm,
      statistics,
      batchStatusDialogVisible,
      batchStatusForm,
      logsDialogVisible,
      userLogs,
      logsLoading,
      logsCurrentPage,
      logsPageSize,
      logsTotal,
      loadUsers,
      showUserDetails,
      showStatusDialog,
      updateUserStatus,
      handleSearch,
      handleSizeChange,
      handleCurrentChange,
      formatDate,
      getStatusType,
      getStatusText,
      getFeeTypeText,
      getGiftTypeText,
      handleFilter,
      resetFilter,
      exportUsers,
      showBatchStatusDialog,
      updateBatchStatus,
      showUserLogs,
      loadUserLogs,
      handleLogsSizeChange,
      handleLogsCurrentChange
    }
  }
}
</script>

<style scoped>
.admin-user-management {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.user-details-dialog {
  max-height: 80vh;
  overflow-y: auto;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.filter-bar {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.batch-actions {
  margin-bottom: 20px;
}

.export-actions {
  margin-bottom: 20px;
}

.statistics-cards {
  margin-bottom: 20px;
}

.statistics-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
}

.logs-dialog {
  max-height: 80vh;
  overflow-y: auto;
}

.mx-2 {
  margin: 0 8px;
}
</style> 