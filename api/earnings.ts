import axios from 'axios';
import type { EarningRecord } from '../types/earnings';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function fetchEarningsHistory(): Promise<EarningRecord[]> {
  const { data } = await api.get('/earnings/history');
  return data;
} 