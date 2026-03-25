'use client';

import { Thought } from '@/lib/types';
import { Card } from '@/components/ui/card';

interface SpiralTimelineProps {
  thoughts: Thought[];
}

export function SpiralTimeline({ thoughts }: SpiralTimelineProps) {
  if (thoughts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">The Spiral</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-red-600" />

        {/* Thoughts */}
        <div className="space-y-4 pl-10">
          {thoughts.map((thought, index) => (
            <div key={thought.id} className="flex gap-4">
              {/* Dot indicator */}
              <div className="absolute left-0 mt-2 h-4 w-4 rounded-full border-2 border-slate-900 bg-gradient-to-r from-purple-600 to-red-600" />

              {/* Card */}
              <Card className="w-full border-slate-700 bg-slate-800/50 p-4 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-2 text-xs font-semibold text-slate-400">
                      Level {index + 1}
                    </div>
                    <p className="text-slate-100">{thought.text}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-200">
                        {Math.round(thought.emotionScore)}
                      </div>
                      <div className="text-xs text-slate-500">emotion</div>
                    </div>
                    {/* Emotion bar */}
                    <div className="h-16 w-1 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="w-full bg-gradient-to-t from-red-600 to-purple-600"
                        style={{
                          height: `${Math.min(
                            100,
                            (thought.emotionScore / 100) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
