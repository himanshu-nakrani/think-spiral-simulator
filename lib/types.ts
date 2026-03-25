export type ThinkMode = 'anxious' | 'logical' | 'dramatic';

export interface Thought {
  id: string;
  text: string;
  emotionScore: number;
  timestamp: Date;
}

export interface SpiralEntry {
  id: string;
  initialThought: string;
  mode: ThinkMode;
  thoughts: Thought[];
  realityCheck: string;
  insights: string[];
  createdAt: Date;
  emotionScores: number[];
}

export interface SimulationResponse {
  id: string;
  thoughts: Thought[];
  emotionScores: number[];
}

export interface RealityCheckResponse {
  realityCheck: string;
  insights: string[];
}

export interface HistoryResponse {
  entries: SpiralEntry[];
}

export interface InsightsResponse {
  commonPatterns: string[];
  emotionalTrends: {
    average: number;
    peak: number;
    mode: ThinkMode;
  };
  recommendations: string[];
}
