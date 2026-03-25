'use client';

import { BreakSpiralItem } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface BreakSpiralCardProps {
  reframes: BreakSpiralItem[];
}

export function BreakSpiralCard({ reframes }: BreakSpiralCardProps) {
  if (!reframes.length) return null;

  return (
    <Card className="border-emerald-400/25 bg-emerald-950/20 p-6">
      <h3 className="mb-4 text-3xl font-semibold tracking-tight text-emerald-100">
        Break This Spiral
      </h3>
      <div className="space-y-3">
        {reframes.map((item, index) => (
          <div key={`${item.thought}-${index}`} className="rounded-lg border border-emerald-300/20 bg-slate-900/50 p-4">
            <p className="text-sm text-rose-200">"{item.thought}"</p>
            <p className="mt-2 text-sm text-emerald-100">→ {item.rationalCounter}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
