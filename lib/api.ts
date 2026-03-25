import axios from 'axios';
import {
  SimulationResponse,
  RealityCheckResponse,
  BreakSpiralResponse,
  CompareModesResponse,
  HistoryResponse,
  InsightsResponse,
  ThinkMode,
} from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

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

  async breakSpiral(spiralId: string): Promise<BreakSpiralResponse> {
    try {
      const response = await apiClient.post<BreakSpiralResponse>('/api/break-spiral', {
        spiral_id: spiralId,
      });
      return response.data;
    } catch (error) {
      console.error('Error breaking spiral:', error);
      throw error;
    }
  },

  async compareModes(
    initialThought: string,
    primaryMode: ThinkMode,
    compareMode: ThinkMode
  ): Promise<CompareModesResponse> {
    try {
      const response = await apiClient.post<CompareModesResponse>('/api/compare-modes', {
        initial_thought: initialThought,
        primary_mode: primaryMode,
        compare_mode: compareMode,
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing modes:', error);
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
