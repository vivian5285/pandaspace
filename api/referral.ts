import axios from 'axios';
import type { UserProfile, ReferralStats, ReferralRecord, PaginatedResponse } from '../types/referral';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const referralApi = {
  getUserProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/user/profile');
    return data;
  },

  getReferralStats: async (): Promise<ReferralStats> => {
    const { data } = await api.get('/referral/stats');
    return data;
  },

  getReferralHistory: async (page: number, pageSize: number): Promise<PaginatedResponse<ReferralRecord>> => {
    const { data } = await api.get('/referral/history', {
      params: { page, pageSize }
    });
    return data;
  }
}; 