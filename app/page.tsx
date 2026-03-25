'use client';

import { useState } from 'react';
import { InputBox } from '@/components/InputBox';
import { ModeSelector } from '@/components/ModeSelector';
import { SpiralTimeline } from '@/components/SpiralTimeline';
import { EmotionChart } from '@/components/EmotionChart';
import { ShareCard } from '@/components/ShareCard';
import { api } from '@/lib/api';
import { ThinkMode, Thought } from '@/lib/types';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [mode, setMode] = useState<ThinkMode>('anxious');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [emotionScores, setEmotionScores] = useState<number[]>([]);
  const [realityCheck, setRealityCheck] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSpinalId, setCurrentSpinalId] = useState<string | null>(null);

  const handleSubmit = async (initialThought: string) => {
    setIsLoading(true);
    setError(null);
    setThoughts([]);
    setEmotionScores([]);
    setRealityCheck('');
    setInsights([]);

    try {
      console.log('[v0] Submitting thought:', initialThought, 'Mode:', mode);
      const response = await api.simulate(initialThought, mode);
      console.log('[v0] Simulation response:', response);

      setCurrentSpinalId(response.id);
      setThoughts(response.thoughts);
      setEmotionScores(response.emotionScores);

      // Get reality check
      console.log('[v0] Fetching reality check for spiral:', response.id);
      const realityCheckResponse = await api.realityCheck(response.id);
      console.log('[v0] Reality check response:', realityCheckResponse);
      setRealityCheck(realityCheckResponse.realityCheck);
      setInsights(realityCheckResponse.insights);
    } catch (err) {
      console.error('[v0] Error in simulation:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to process your thought. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <div className="mb-2 text-sm font-semibold text-purple-400">
              Overthinking Analysis
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-100">
              ThinkSpiral
            </h1>
            <p className="mt-2 text-slate-400">
              Visualize and understand your overthinking patterns
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left column - Input */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <ModeSelector selectedMode={mode} onModeChange={setMode} />
              </Card>

              <Card className="border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
                <InputBox onSubmit={handleSubmit} isLoading={isLoading} />
              </Card>

              {error && (
                <Card className="border-red-900/50 bg-red-950/30 p-4 text-red-200">
                  <p className="text-sm">{error}</p>
                </Card>
              )}
            </div>

            {/* Right column - Results */}
            <div className="space-y-6 lg:col-span-2">
              {thoughts.length > 0 && (
                <>
                  <SpiralTimeline thoughts={thoughts} />
                  <EmotionChart emotionScores={emotionScores} />
                  {realityCheck && (
                    <ShareCard realityCheck={realityCheck} insights={insights} />
                  )}
                </>
              )}

              {!isLoading && thoughts.length === 0 && !error && (
                <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center backdrop-blur">
                  <div className="text-slate-400">
                    <p className="text-lg font-semibold">
                      Ready to explore your thoughts?
                    </p>
                    <p className="mt-2 text-sm">
                      Enter a thought that&apos;s been troubling you, pick a spiral pattern,
                      and watch as ThinkSpiral helps you understand the cycle.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
