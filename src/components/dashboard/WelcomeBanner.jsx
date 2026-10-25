import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate, getTodayKey } from '../../utils/dateUtils';
import { RefreshCw, Sparkles } from 'lucide-react';

export function WelcomeBanner() {
  const { currentQuote, refreshMotivationalQuote } = useApp();
  const todayFormatted = formatDisplayDate(getTodayKey(), 'EEEE, MMMM d, yyyy');

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-surface-border">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-content-secondary font-semibold">
            {todayFormatted}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-main uppercase">
          OBSESSION
        </h1>
        <p className="text-sm text-content-secondary font-medium">
          "Become the person your goals demand."
        </p>
      </div>

      {/* Rotating Motivational Statement */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-card border border-surface-border rounded-xl shadow-subtle group">
        <Sparkles className="w-3.5 h-3.5 text-content-muted shrink-0" />
        <p className="text-xs font-medium text-content-main italic">
          {currentQuote}
        </p>
        <button
          onClick={refreshMotivationalQuote}
          title="Refresh motivational statement"
          className="p-1 rounded text-content-muted hover:text-content-main hover:bg-surface-hover transition-colors ml-1"
        >
          <RefreshCw className="w-3 h-3 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
