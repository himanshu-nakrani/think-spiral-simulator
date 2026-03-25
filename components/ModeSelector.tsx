'use client';

import { ThinkMode } from '@/lib/types';
import { motion } from 'framer-motion';

interface ModeSelectorProps {
  selectedMode: ThinkMode;
  onModeChange: (mode: ThinkMode) => void;
}

const MODES = [
  {
    id: 'anxious' as ThinkMode,
    label: 'Anxious',
    description: 'Catastrophic thinking patterns',
  },
  {
    id: 'logical' as ThinkMode,
    label: 'Logical',
    description: 'Analytical overthinking',
  },
  {
    id: 'dramatic' as ThinkMode,
    label: 'Dramatic',
    description: 'Emotional escalation',
  },
];

export function ModeSelector({
  selectedMode,
  onModeChange,
}: ModeSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-slate-100">
        Choose Your Spiral Pattern
      </label>
      <div className="grid grid-cols-1 gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
        {MODES.map((mode) => (
          <motion.button
            key={mode.id}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onModeChange(mode.id)}
            className={`relative w-full rounded-xl px-4 py-3 text-left transition-all duration-200 ${
              selectedMode === mode.id
                ? 'border border-purple-400/50 bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-100 shadow-lg shadow-purple-900/20'
                : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="w-full">
              <div className="font-medium">{mode.label}</div>
              <div className="mt-1 text-xs text-muted">{mode.description}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
