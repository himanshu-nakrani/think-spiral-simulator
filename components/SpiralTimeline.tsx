'use client';

import { Thought } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SpiralTimelineProps {
  thoughts: Thought[];
}

export function SpiralTimeline({ thoughts }: SpiralTimelineProps) {
  if (thoughts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-semibold tracking-tight text-slate-100">The Spiral</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute bottom-0 left-2 top-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_18px_rgba(124,58,237,0.7)]" />

        {/* Thoughts */}
        <div className="max-h-[34rem] space-y-4 overflow-y-auto pl-10 pr-1">
          {thoughts.map((thought, index) => (
            <motion.div
              key={thought.id}
              className="flex gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              {/* Dot indicator */}
              <div className="absolute left-0 mt-2 h-4 w-4 animate-pulse rounded-full border-2 border-slate-900 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_14px_rgba(236,72,153,0.8)]" />

              {/* Card */}
              <Card className="w-full p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 text-xs font-semibold text-slate-400">
                      Level {index + 1}
                    </div>
                    <p className="text-slate-100">{thought.text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className="border-transparent bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-2.5 py-1 text-[11px] text-purple-100 shadow-[0_0_12px_rgba(124,58,237,0.35)]">
                      Intensity {Math.round(thought.emotionScore)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
