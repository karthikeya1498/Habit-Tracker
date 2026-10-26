import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Badge } from '../common/UIElements';
import { DayDetailModal } from '../journey/DayDetailModal';
import { formatDisplayDate, parseDateKey, addDaysToDateKey } from '../../utils/dateUtils';
import { getDailyCompletion } from '../../utils/statsUtils';
import { differenceInCalendarDays } from 'date-fns';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  BookOpen,
  Sparkles,
  ChevronRight,
  ArrowRight,
  History,
  CheckCheck
} from 'lucide-react';

export function DayHistoryCard() {
  const {
    habits,
    records,
    journal,
    daySummaries,
    settings,
    effectiveTodayKey,
    challengeInfo,
    finalizeDay,
    advanceToNextDay,
    setActiveTab,
    setSelectedDate
  } = useApp();

  const [inspectDayData, setInspectDayData] = useState(null);

  const startDate = parseDateKey(settings.startDate);
  const effectiveToday = parseDateKey(effectiveTodayKey);
  const daysElapsed = Math.max(1, differenceInCalendarDays(effectiveToday, startDate) + 1);

  // Generate list of days from Day 1 to current active day
  const daysList = [];
  for (let i = 0; i < daysElapsed; i++) {
    const dKey = addDaysToDateKey(settings.startDate, i);
    const dayNumber = i + 1;
    const isToday = dKey === effectiveTodayKey;
    const isPast = dKey < effectiveTodayKey;
    const stat = getDailyCompletion(dKey, habits, records);
    const journalEntry = journal[dKey];
    const summary = daySummaries[dKey];

    daysList.push({
      dayNumber,
      dateKey: dKey,
      isToday,
      isPast,
      isFuture: false,
      weekNumber: Math.floor(i / 7) + 1,
      stat,
      journalEntry,
      summary,
    });
  }

  // Reverse so the latest day is first, or keep Day 1 first
  const displayDays = [...daysList].reverse();

  const handleOpenDay = (day) => {
    setInspectDayData(day);
  };

  const handleFinalizeToday = (e, dKey) => {
    e.stopPropagation();
    finalizeDay(dKey);
  };

  return (
    <>
      <Card className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-content-main" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-content-main font-mono">
                Day-by-Day Execution History
              </h3>
              <p className="text-[11px] text-content-secondary">
                Click any day to see exactly what you completed, what you missed, and your daily journal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('journey')}
              className="text-xs font-mono font-medium text-content-secondary hover:text-content-main flex items-center gap-1"
            >
              Full 90-Day Grid <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Days Grid / List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayDays.map((day) => {
            const hasJournal = Boolean(day.journalEntry?.content?.trim());
            const words = hasJournal ? day.journalEntry.content.trim().split(/\s+/).length : 0;
            const isFinalized = Boolean(day.summary);

            return (
              <div
                key={day.dateKey}
                onClick={() => handleOpenDay(day)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-3 bulge-box ${
                  day.isToday
                    ? 'bg-surface-card border-2 border-content-main shadow-subtle hover:border-content-main'
                    : day.stat.isPerfect
                    ? 'bg-status-success-bg/20 border-status-success-border/60 hover:border-status-success'
                    : day.stat.completedCount > 0
                    ? 'bg-status-warning-bg/20 border-status-warning-border/60 hover:border-status-warning'
                    : 'bg-surface-hover/30 border-surface-border hover:border-content-muted'
                }`}
              >
                {/* Top Row: Day Number & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold font-mono text-content-main">
                      DAY {day.dayNumber}
                    </span>
                    {day.isToday && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-content-main text-surface-card font-bold uppercase">
                        Today
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    day.stat.isPerfect
                      ? 'bg-status-success-bg text-status-success border-status-success-border'
                      : day.stat.completedCount > 0
                      ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
                      : 'bg-surface-hover text-content-muted border-surface-border'
                  }`}>
                    {day.stat.percentage}% Done
                  </span>
                </div>

                {/* Date & Completion Counts */}
                <div>
                  <p className="text-xs text-content-secondary font-mono">
                    {formatDisplayDate(day.dateKey, 'EEE, MMM d, yyyy')}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                    <span className="text-status-success flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {day.stat.completedCount} completed
                    </span>
                    <span className="text-content-muted">•</span>
                    <span className={`${day.stat.totalCount - day.stat.completedCount > 0 ? 'text-status-missed font-medium' : 'text-content-muted'} flex items-center gap-1`}>
                      <XCircle className="w-3.5 h-3.5" />
                      {day.stat.totalCount - day.stat.completedCount} missed
                    </span>
                  </div>
                </div>

                {/* Journal & Finalize Status Bar */}
                <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-content-secondary">
                    <BookOpen className={`w-3.5 h-3.5 ${hasJournal ? 'text-content-main' : 'text-content-muted'}`} />
                    <span>{hasJournal ? `${words} words` : 'No journal'}</span>
                  </div>

                  {day.isToday && !isFinalized ? (
                    <button
                      onClick={(e) => handleFinalizeToday(e, day.dateKey)}
                      className="px-2 py-0.5 rounded bg-surface-hover hover:bg-content-main hover:text-surface-card text-content-main border border-surface-border transition-colors text-[10px] font-bold flex items-center gap-1"
                      title="Store and freeze day completion snapshot"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" /> Close Day
                    </button>
                  ) : isFinalized ? (
                    <span className="text-[10px] text-status-success font-semibold flex items-center gap-0.5">
                      <CheckCheck className="w-3 h-3" /> Archived
                    </span>
                  ) : (
                    <span className="text-[10px] text-content-muted group-hover:text-content-main flex items-center gap-0.5 transition-colors">
                      View details <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Day Inspection Modal */}
      {inspectDayData && (
        <DayDetailModal
          isOpen={Boolean(inspectDayData)}
          onClose={() => setInspectDayData(null)}
          dayData={inspectDayData}
        />
      )}
    </>
  );
}
