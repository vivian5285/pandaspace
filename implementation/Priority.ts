const implementationPriority = [
  // 第一批实现（核心功能）
  {
    endpoints: [
      '/earnings/summary',
      '/strategy/list',
      '/user/profile'
    ],
    reason: 'Dashboard页面的核心依赖，影响用户首页展示'
  },

  // 第二批实现（功能完整性）
  {
    endpoints: [
      '/strategy/enable/:id',
      '/strategy/disable/:id',
      '/earnings/history'
    ],
    reason: '策略控制和收益查看的基本功能'
  },

  // 第三批实现（推广功能）
  {
    endpoints: [
      '/referral/stats',
      '/referral/history'
    ],
    reason: '推广中心功能'
  }
]; 