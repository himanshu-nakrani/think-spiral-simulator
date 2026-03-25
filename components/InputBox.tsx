'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface InputBoxProps {
  onSubmit: (thought: string) => void;
  isLoading: boolean;
}

export function InputBox({ onSubmit, isLoading }: InputBoxProps) {
  const [thought, setThought] = useState('');

  const handleSubmit = () => {
    if (thought.trim()) {
      onSubmit(thought);
      setThought('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative">
        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's troubling your mind? Enter your thought..."
          className="min-h-24 resize-none rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          disabled={isLoading}
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-500">
          {thought.length > 0 && `${thought.length} characters`}
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!thought.trim() || isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700"
      >
        {isLoading ? 'Spiraling...' : 'Explore the Spiral'}
      </Button>
    </div>
  );
}
