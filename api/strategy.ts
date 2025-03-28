import axios from 'axios';
import type { Strategy, StrategyMode } from '../types/strategy';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const strategyApi = {
  getStrategy: async (id: string): Promise<Strategy> => {
    const { data } = await api.get(`/strategy/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: 'active' | 'inactive'): Promise<void> => {
    await api.post(`/strategy/${status === 'active' ? 'enable' : 'disable'}/${id}`);
  },

  updateMode: async (id: string, mode: StrategyMode): Promise<void> => {
    await api.put(`/strategy/${id}/mode`, { mode });
  }
}; 