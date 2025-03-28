import { http } from '@/utils/request';
import type { 
  ReferralStats, 
  ReferralHistory,
  Strategy,
  UserProfile 
} from '@/types';

// 推广相关 API
export const referralApi = {
  getStats: () => 
    http.get<ReferralStats>('/referral/stats'),

  getHistory: (params: { page: number; pageSize: number }) => 
    http.get<ReferralHistory>('/referral/history', { params }),
};

// 策略相关 API
export const strategyApi = {
  getList: () => 
    http.get<Strategy[]>('/strategy/list'),

  getDetail: (id: string) => 
    http.get<Strategy>(`/strategy/${id}`),

  enable: (id: string) => 
    http.post(`/strategy/enable/${id}`),

  disable: (id: string) => 
    http.post(`/strategy/disable/${id}`),

  updateMode: (id: string, mode: 'simulation' | 'live') => 
    http.put(`/strategy/${id}/mode`, { mode }),
};

// 用户相关 API
export const userApi = {
  getProfile: () => 
    http.get<UserProfile>('/user/profile'),

  updateSettings: (settings: Partial<UserProfile>) => 
    http.put('/user/settings', settings),
}; 