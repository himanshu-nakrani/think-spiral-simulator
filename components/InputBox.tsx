'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThinkMode } from '@/lib/types';

interface InputBoxProps {
  onSubmit: (thought: string) => void;
  isLoading: boolean;
  mode: ThinkMode;
}

const SUGGESTED_THOUGHTS: Record<ThinkMode, string[]> = {
  anxious: [
    'I made a mistake in my presentation today.',
    'My friend has not replied to my message yet.',
    'I might have said something awkward in that meeting.',
  ],
  logical: [
    'If this project slips by one week, what happens next?',
    'I am overanalyzing every decision at work.',
    'I keep trying to optimize every step before starting.',
  ],
  dramatic: [
    'I forgot one task and now everything feels ruined.',
    'One bad day makes me feel like I am failing at life.',
    'A small setback feels like a total disaster.',
  ],
};

export function InputBox({ onSubmit, isLoading, mode }: InputBoxProps) {
  const [thought, setThought] = useState('');

  const handleSubmit = () => {
    if (thought.trim()) {
      onSubmit(thought);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's troubling your mind? Enter your thought..."
          className="min-h-28 resize-none rounded-xl border border-slate-700/80 bg-slate-900/80 p-4 text-slate-100 placeholder-slate-500 shadow-inner shadow-black/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-500">
          {thought.length > 0 && `${thought.length} characters`}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-400">Suggested thoughts</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_THOUGHTS[mode].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isLoading}
              onClick={() => setThought(suggestion)}
              className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 transition hover:border-purple-500/50 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!thought.trim() || isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-900/30 hover:from-purple-500 hover:to-fuchsia-500 disabled:bg-slate-700"
      >
        {isLoading ? 'Spiraling...' : 'Explore the Spiral'}
      </Button>
    </div>
  );
}
