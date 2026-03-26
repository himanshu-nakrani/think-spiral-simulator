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
import { Activity, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-semibold tracking-tight text-slate-100">
              Emotional Trajectory
            </h3>
            <p className="mt-1 text-sm text-muted">
              Peak intensity highlights where the spiral tightens.
            </p>
          </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Activity className="h-3.5 w-3.5" />
              Average
            </div>
            <div className="font-bold text-slate-200">{avgScore}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Flame className="h-3.5 w-3.5" />
              Peak
            </div>
            <div className="font-bold text-red-400">{maxScore}</div>
          </div>
          <div className="hidden rounded-xl border border-white/10 bg-white/5 p-2.5 sm:block">
            <div className="flex items-center gap-1 text-xs text-muted">
              <Sparkles className="h-3.5 w-3.5" />
              Trend
            </div>
            <div className="font-bold text-cyan-300">Rising</div>
          </div>
        </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="emotionStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="level" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              backdropFilter: 'blur(14px)',
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Line
            type="monotone"
            dataKey="emotion"
            stroke="url(#emotionStroke)"
            dot={{ fill: '#a855f7', r: 4 }}
            activeDot={{ r: 6 }}
            strokeWidth={3}
          />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
