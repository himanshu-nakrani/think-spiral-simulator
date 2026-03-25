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

export interface BreakSpiralItem {
  thought: string;
  rationalCounter: string;
}

export interface BreakSpiralResponse {
  reframes: BreakSpiralItem[];
}

export interface CompareModesResponse {
  primaryMode: ThinkMode;
  compareMode: ThinkMode;
  primaryThoughts: Thought[];
  primaryEmotionScores: number[];
  compareThoughts: Thought[];
  compareEmotionScores: number[];
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
  patternDetection: {
    dominantTopic: string;
    commonTrigger: string;
    peakHour: number | null;
    peakWeekday: string | null;
  };
  recommendations: string[];
}
