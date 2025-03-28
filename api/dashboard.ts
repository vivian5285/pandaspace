import axios from 'axios';
import type { EarningsSummary, Strategy } from '../types/dashboard';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function fetchEarningsSummary(): Promise<EarningsSummary> {
  const { data } = await api.get('/earnings/summary');
  return data;
}

export async function fetchStrategies(): Promise<Strategy[]> {
  const { data } = await api.get('/strategy/list');
  return data;
}

export async function toggleStrategy(strategyId: string, enabled: boolean): Promise<void> {
  const endpoint = enabled ? '/strategy/enable' : '/strategy/disable';
  await api.post(endpoint, { strategyId });
} 