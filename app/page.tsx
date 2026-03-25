'use client';

import { useEffect, useState } from 'react';
import { InputBox } from '@/components/InputBox';
import { ModeSelector } from '@/components/ModeSelector';
import { SpiralTimeline } from '@/components/SpiralTimeline';
import { EmotionChart } from '@/components/EmotionChart';
import { ShareCard } from '@/components/ShareCard';
import { BreakSpiralCard } from '@/components/BreakSpiralCard';
import { CompareModesCard } from '@/components/CompareModesCard';
import { api } from '@/lib/api';
import {
  BreakSpiralItem,
  CompareModesResponse,
  InsightsResponse,
  SpiralEntry,
  ThinkMode,
  Thought,
} from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Brain, Sparkles, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [mode, setMode] = useState<ThinkMode>('anxious');
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [emotionScores, setEmotionScores] = useState<number[]>([]);
  const [realityCheck, setRealityCheck] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBreakLoading, setIsBreakLoading] = useState(false);
  const [isCompareLoading, setIsCompareLoading] = useState(false);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSpinalId, setCurrentSpinalId] = useState<string | null>(null);
  const [latestThought, setLatestThought] = useState('');
  const [reframes, setReframes] = useState<BreakSpiralItem[]>([]);
  const [compareMode, setCompareMode] = useState<ThinkMode>('logical');
  const [compareResult, setCompareResult] = useState<CompareModesResponse | null>(null);
  const [historyEntries, setHistoryEntries] = useState<SpiralEntry[]>([]);
  const [insightsSummary, setInsightsSummary] = useState<InsightsResponse | null>(null);

  const loadDashboardData = async () => {
    try {
      const [historyResponse, insightsResponse] = await Promise.all([
        api.getHistory(),
        api.getInsights(),
      ]);
      setHistoryEntries(historyResponse.entries || []);
      setInsightsSummary(insightsResponse);
    } catch (dashboardError) {
      console.error('[v0] Failed loading dashboard data:', dashboardError);
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSubmit = async (initialThought: string) => {
    setIsLoading(true);
    setError(null);
    setThoughts([]);
    setEmotionScores([]);
    setRealityCheck('');
    setInsights([]);
    setReframes([]);
    setCompareResult(null);
    setLatestThought(initialThought);

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
      await loadDashboardData();
    } catch (err) {
      console.error('[v0] Error in simulation:', err);
      if (axios.isAxiosError(err) && err.code === 'ERR_NETWORK') {
        setError(
          "Couldn't reach the backend. Make sure the API is running on http://127.0.0.1:8000 (or set NEXT_PUBLIC_API_URL), then refresh and try again."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to process your thought. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakSpiral = async () => {
    if (!currentSpinalId) return;
    setIsBreakLoading(true);
    try {
      const response = await api.breakSpiral(currentSpinalId);
      setReframes(response.reframes);
    } catch (breakError) {
      console.error('[v0] Error breaking spiral:', breakError);
      setError('Could not generate break-the-spiral reframes right now.');
    } finally {
      setIsBreakLoading(false);
    }
  };

  const handleCompareModes = async () => {
    if (!latestThought) return;
    setIsCompareLoading(true);
    try {
      const response = await api.compareModes(latestThought, mode, compareMode);
      setCompareResult(response);
    } catch (compareError) {
      console.error('[v0] Error comparing modes:', compareError);
      setError('Could not compare modes right now. Please try again.');
    } finally {
      setIsCompareLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-8rem] left-1/4 h-[28rem] w-[28rem] rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-1/4 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(15,23,42,0.4))]" />
      </div>

      {/* Content */}
      <div className="relative">
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md shadow-purple-900/50">
                <Brain className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold tracking-tight text-slate-100">ThinkSpiral</p>
            </div>
            <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
              <span>Simulator</span>
              <span>Insights</span>
              <span>Share</span>
            </div>
          </div>
        </nav>
        {/* Header */}
        <header className="border-b border-white/10 bg-slate-950/20 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="mb-2 text-sm font-semibold tracking-wide text-purple-300">
              Overthinking Analysis
            </div>
            <h1 className="bg-gradient-to-r from-white via-purple-100 to-fuchsia-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
              ThinkSpiral
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Visualize and understand your overthinking patterns
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto w-full max-w-6xl px-6 py-10">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            {/* Left column - Input */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="border-white/10 bg-slate-900/55 p-6 shadow-xl shadow-black/30 backdrop-blur-xl">
                <ModeSelector selectedMode={mode} onModeChange={setMode} />
              </Card>

              <Card className="border-white/10 bg-slate-900/55 p-6 shadow-xl shadow-black/30 backdrop-blur-xl">
                <InputBox onSubmit={handleSubmit} isLoading={isLoading} mode={mode} />
              </Card>

              {error && (
                <Card className="border-red-400/30 bg-red-950/50 p-4 text-red-100 shadow-lg shadow-red-900/20 backdrop-blur">
                  <p className="text-sm leading-relaxed">{error}</p>
                </Card>
              )}

              <Card className="p-5">
                <h3 className="mb-3 text-sm font-semibold text-slate-100">
                  Insights Snapshot
                </h3>
                {isDashboardLoading ? (
                  <p className="text-sm text-slate-400">Loading insights...</p>
                ) : insightsSummary ? (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
                        <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                          <BarChart3 className="h-3.5 w-3.5" />
                          Average
                        </p>
                        <p className="font-semibold text-slate-100">
                          {Math.round(insightsSummary.emotionalTrends.average)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
                        <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                          <TrendingUp className="h-3.5 w-3.5" />
                          Peak
                        </p>
                        <p className="font-semibold text-red-300">
                          {Math.round(insightsSummary.emotionalTrends.peak)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center">
                        <p className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          Mode
                        </p>
                        <p className="font-semibold capitalize text-purple-200">
                          {insightsSummary.emotionalTrends.mode}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-slate-400">Top pattern</p>
                      <p className="line-clamp-2 text-slate-200">
                        {insightsSummary.commonPatterns[0] ||
                          'Patterns appear as you run more spirals.'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-slate-900/70 p-3">
                      <p className="text-xs font-medium text-slate-400">Pattern Detection</p>
                      <p className="mt-1 text-sm text-slate-200">
                        You mostly overthink about{' '}
                        <span className="font-semibold capitalize text-purple-200">
                          {insightsSummary.patternDetection.dominantTopic}
                        </span>
                        .
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        Common trigger:{' '}
                        <span className="font-semibold text-slate-100">
                          {insightsSummary.patternDetection.commonTrigger}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-slate-300">
                        Peak time:{' '}
                        <span className="font-semibold text-slate-100">
                          {insightsSummary.patternDetection.peakHour !== null
                            ? `${insightsSummary.patternDetection.peakHour}:00`
                            : 'Not enough data'}
                        </span>
                        {insightsSummary.patternDetection.peakWeekday
                          ? ` on ${insightsSummary.patternDetection.peakWeekday}`
                          : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No insight data yet. Run a spiral to generate analytics.
                  </p>
                )}
              </Card>
            </div>

            {/* Right column - Results */}
            <div className="space-y-6 lg:col-span-2">
              {thoughts.length > 0 && (
                <>
                  <SpiralTimeline thoughts={thoughts} />
                  <EmotionChart emotionScores={emotionScores} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button
                      onClick={handleBreakSpiral}
                      disabled={!currentSpinalId || isBreakLoading}
                      className="bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      {isBreakLoading ? 'Breaking...' : 'Break This Spiral'}
                    </Button>
                    <div className="flex gap-2">
                      <select
                        value={compareMode}
                        onChange={(e) => setCompareMode(e.target.value as ThinkMode)}
                        className="w-full rounded-md border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-slate-100"
                      >
                        {(['anxious', 'logical', 'dramatic'] as ThinkMode[])
                          .filter((m) => m !== mode)
                          .map((m) => (
                            <option key={m} value={m}>
                              Compare with {m}
                            </option>
                          ))}
                      </select>
                      <Button
                        onClick={handleCompareModes}
                        disabled={isCompareLoading || !latestThought}
                        variant="outline"
                        className="border-purple-400/40 text-purple-100 hover:bg-purple-500/10"
                      >
                        {isCompareLoading ? 'Comparing...' : 'Compare'}
                      </Button>
                    </div>
                  </div>
                  {reframes.length > 0 && <BreakSpiralCard reframes={reframes} />}
                  {compareResult && (
                    <CompareModesCard
                      primaryMode={compareResult.primaryMode}
                      compareMode={compareResult.compareMode}
                      primaryThoughts={compareResult.primaryThoughts}
                      compareThoughts={compareResult.compareThoughts}
                    />
                  )}
                  {realityCheck && (
                    <ShareCard
                      realityCheck={realityCheck}
                      insights={insights}
                      thoughts={thoughts}
                      emotionScores={emotionScores}
                    />
                  )}
                </>
              )}

              {!isLoading && thoughts.length === 0 && !error && (
                <div className="glass-surface rounded-2xl p-10 text-center shadow-xl shadow-black/20">
                  <div className="text-slate-300/90">
                    <p className="text-3xl font-semibold tracking-tight text-white">
                      Ready to explore your thoughts?
                    </p>
                    <p className="mt-3 text-base leading-relaxed text-muted">
                      Enter a thought that&apos;s been troubling you, pick a spiral pattern,
                      and watch as ThinkSpiral helps you understand the cycle.
                    </p>
                  </div>
                </div>
              )}

              <Card className="border-white/10 bg-slate-900/55 p-6 shadow-xl shadow-black/30 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-100">Recent Spirals</h3>
                  <span className="text-xs text-slate-400">
                    {historyEntries.length} total
                  </span>
                </div>
                {historyEntries.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No saved spirals yet. Submit your first thought to start tracking patterns.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {historyEntries.slice(0, 4).map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-white/10 bg-slate-900/70 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <p className="text-xs capitalize text-purple-300">{entry.mode}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(entry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="line-clamp-2 text-sm text-slate-200">
                          {entry.initialThought}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
