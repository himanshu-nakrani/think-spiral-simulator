'use client';

import { BreakSpiralItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreakSpiralCardProps {
  reframes: BreakSpiralItem[];
}

export function BreakSpiralCard({ reframes }: BreakSpiralCardProps) {
  if (!reframes.length) return null;

  return (
    <Card className="border-emerald-400/25 bg-gradient-to-br from-emerald-950/30 via-slate-950/20 to-emerald-950/10 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-3xl font-semibold tracking-tight text-emerald-100">
          Break This Spiral
        </h3>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.25)]">
          <Sparkles className="h-3.5 w-3.5" />
          CBT Reframes
        </div>
      </div>
      <div className="space-y-3">
        {reframes.map((item, index) => (
          <motion.div
            key={`${item.thought}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: index * 0.07 }}
            className="rounded-lg border border-emerald-300/20 bg-slate-900/50 p-4"
          >
            <p className="text-sm text-rose-200">"{item.thought}"</p>
            <p className="mt-2 flex items-start gap-2 text-sm text-emerald-100">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{item.rationalCounter}</span>
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
