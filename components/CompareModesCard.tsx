'use client';

import { Thought, ThinkMode } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Activity, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

interface CompareModesCardProps {
  primaryMode: ThinkMode;
  compareMode: ThinkMode;
  primaryThoughts: Thought[];
  compareThoughts: Thought[];
}

function ModeColumn({ mode, thoughts }: { mode: ThinkMode; thoughts: Thought[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold capitalize text-purple-200">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/5">
          <Scale className="h-3.5 w-3.5" />
        </span>
        {mode}
      </p>
      <div className="space-y-2">
        {thoughts.slice(0, 4).map((t, i) => (
          <motion.p
            key={t.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="text-sm text-slate-200"
          >
            {i + 1}. {t.text}
          </motion.p>
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-3xl font-semibold tracking-tight text-slate-100">
          Compare Modes
        </h3>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
          <Activity className="h-3.5 w-3.5" />
          Side-by-side intensity
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <ModeColumn mode={primaryMode} thoughts={primaryThoughts} />
        <ModeColumn mode={compareMode} thoughts={compareThoughts} />
      </div>
    </Card>
  );
}
