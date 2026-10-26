import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CircularProgress, Button } from '../common/UIElements';
import { getDailyCompletion } from '../../utils/statsUtils';
import { getTodayKey } from '../../utils/dateUtils';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function TodayExecutionCard() {
  const {
    habits,
    records,
    effectiveTodayKey,
    challengeInfo,
    daySummaries,
    setActiveTab,
    setSelectedDate,
    finalizeDay
  } = useApp();

  const dailyStat = getDailyCompletion(effectiveTodayKey, habits, records);
  const isFinalized = Boolean(daySummaries[effectiveTodayKey]);

  const handleGoToToday = () => {
    setSelectedDate(effectiveTodayKey);
    setActiveTab('habits');
  };

  const handleFinalize = () => {
    finalizeDay(effectiveTodayKey);
  };

  return (
    <Card bulge={true} className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-content-secondary">
            Day {challengeInfo.currentDay} Execution
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            dailyStat.isPerfect
              ? 'bg-status-success-bg text-status-success border-status-success-border font-semibold'
              : 'bg-surface-hover text-content-secondary border-surface-border'
          }`}>
            {dailyStat.isPerfect ? '100% EXECUTED' : 'IN PROGRESS'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 my-2">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-content-main">
                {dailyStat.completedCount}
              </span>
              <span className="text-base font-mono text-content-muted">
                / {dailyStat.totalCount}
              </span>
            </div>
            <p className="text-xs text-content-secondary">
              habits completed today
            </p>
          </div>

          <CircularProgress percentage={dailyStat.percentage} size={76} strokeWidth={7} />
        </div>
      </div>

      <div className="pt-4 border-t border-surface-border mt-3 flex items-center justify-between">
        <p className="text-xs font-medium text-content-secondary">
          {dailyStat.totalCount - dailyStat.completedCount === 0
            ? 'All daily targets accomplished!'
            : `${dailyStat.totalCount - dailyStat.completedCount} habits remaining`}
        </p>

        <div className="flex items-center gap-2">
          {!isFinalized && dailyStat.completedCount > 0 && (
            <button
              onClick={handleFinalize}
              className="text-[11px] font-mono px-2 py-1 rounded bg-surface-hover hover:bg-content-main hover:text-surface-card border border-surface-border text-content-main transition-colors font-semibold"
            >
              Close Day
            </button>
          )}
          <button
            onClick={handleGoToToday}
            className="text-xs font-semibold text-content-main hover:underline flex items-center gap-1 group"
          >
            Track habits <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Card>
  );
}
