'use client';

import { ThinkMode } from '@/lib/types';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-200">
        Choose Your Spiral Pattern
      </label>
      <div className="grid grid-cols-3 gap-3">
        {MODES.map((mode) => (
          <Button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            variant={selectedMode === mode.id ? 'default' : 'outline'}
            className={`flex flex-col items-center gap-1 py-6 ${
              selectedMode === mode.id
                ? 'border-purple-600 bg-purple-600/20 text-purple-200'
                : 'border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="font-semibold">{mode.label}</div>
            <div className="text-xs text-slate-400">{mode.description}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
