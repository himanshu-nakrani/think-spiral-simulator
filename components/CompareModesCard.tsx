'use client';

import { Thought, ThinkMode } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface CompareModesCardProps {
  primaryMode: ThinkMode;
  compareMode: ThinkMode;
  primaryThoughts: Thought[];
  compareThoughts: Thought[];
}

function ModeColumn({ mode, thoughts }: { mode: ThinkMode; thoughts: Thought[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
      <p className="mb-3 text-sm font-semibold capitalize text-purple-200">{mode}</p>
      <div className="space-y-2">
        {thoughts.slice(0, 4).map((t, i) => (
          <p key={t.id} className="text-sm text-slate-200">
            {i + 1}. {t.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function CompareModesCard({
  primaryMode,
  compareMode,
  primaryThoughts,
  compareThoughts,
}: CompareModesCardProps) {
  if (!primaryThoughts.length || !compareThoughts.length) return null;

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-3xl font-semibold tracking-tight text-slate-100">
        Compare Modes
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        <ModeColumn mode={primaryMode} thoughts={primaryThoughts} />
        <ModeColumn mode={compareMode} thoughts={compareThoughts} />
      </div>
    </Card>
  );
}
