import axios from 'axios';
import {
  SimulationResponse,
  RealityCheckResponse,
  HistoryResponse,
  InsightsResponse,
  ThinkMode,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async simulate(
    initialThought: string,
    mode: ThinkMode
  ): Promise<SimulationResponse> {
    try {
      const response = await apiClient.post<SimulationResponse>('/api/simulate', {
        initial_thought: initialThought,
        mode,
      });
      return response.data;
    } catch (error) {
      console.error('Error simulating spiral:', error);
      throw error;
    }
  },

  async realityCheck(spiralId: string): Promise<RealityCheckResponse> {
    try {
      const response = await apiClient.post<RealityCheckResponse>(
        '/api/reality-check',
        {
          spiral_id: spiralId,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting reality check:', error);
      throw error;
    }
  },

  async getHistory(): Promise<HistoryResponse> {
    try {
      const response = await apiClient.get<HistoryResponse>('/api/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching history:', error);
      throw error;
    }
  },

  async getInsights(): Promise<InsightsResponse> {
    try {
      const response = await apiClient.get<InsightsResponse>('/api/insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  },
};
