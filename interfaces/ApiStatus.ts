interface ApiCheckResult {
  implemented: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
  requiredFor: string[];
}

const apiStatus: Record<string, ApiCheckResult> = {
  // 收益相关（Dashboard 核心依赖）
  '/earnings/summary': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，Dashboard页面的核心数据',
    requiredFor: ['Dashboard']
  },
  
  '/earnings/history': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，收益历史页面的主要数据',
    requiredFor: ['收益历史页']
  },

  // 策略相关（策略管理核心依赖）
  '/strategy/list': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，Dashboard和策略列表的核心数据',
    requiredFor: ['Dashboard', '策略列表页']
  },

  '/strategy/enable/:id': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，策略控制的基本功能',
    requiredFor: ['策略详情页', 'Dashboard']
  },

  '/strategy/disable/:id': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，策略控制的基本功能',
    requiredFor: ['策略详情页', 'Dashboard']
  },

  // 推广相关（推广中心依赖）
  '/referral/stats': {
    implemented: false,
    priority: 'MEDIUM',
    notes: '需要实现，推广中心的统计数据',
    requiredFor: ['推广中心页']
  },

  '/referral/history': {
    implemented: false,
    priority: 'MEDIUM',
    notes: '需要实现，推广中心的历史记录',
    requiredFor: ['推广中心页']
  },

  // 用户相关
  '/user/profile': {
    implemented: false,
    priority: 'HIGH',
    notes: '需要实现，用户基本信息获取',
    requiredFor: ['所有页面']
  }
}; 