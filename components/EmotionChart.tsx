'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface EmotionChartProps {
  emotionScores: number[];
}

export function EmotionChart({ emotionScores }: EmotionChartProps) {
  if (emotionScores.length === 0) {
    return null;
  }

  const data = emotionScores.map((score, index) => ({
    level: `L${index + 1}`,
    emotion: score,
  }));

  const avgScore = Math.round(
    emotionScores.reduce((a, b) => a + b, 0) / emotionScores.length
  );
  const maxScore = Math.max(...emotionScores);

  return (
    <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">
          Emotional Trajectory
        </h3>
        <div className="flex gap-6 text-sm">
          <div>
            <div className="text-xs text-slate-500">Average</div>
            <div className="font-bold text-slate-200">{avgScore}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Peak</div>
            <div className="font-bold text-red-400">{maxScore}</div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="level" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="emotion"
            stroke="#a855f7"
            dot={{ fill: '#a855f7', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
