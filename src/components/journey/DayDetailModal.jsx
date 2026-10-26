import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button, Badge } from '../common/UIElements';
import { formatDisplayDate, isHabitScheduledForDate } from '../../utils/dateUtils';
import { getDailyCompletion } from '../../utils/statsUtils';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  CheckSquare,
  Sparkles
} from 'lucide-react';

export function DayDetailModal({
  isOpen,
  onClose,
  dayData, // { dayNumber, dateKey, isToday, isPast, isFuture, weekNumber }
}) {
  const {
    habits,
    records,
    journal,
    daySummaries,
    effectiveTodayKey,
    setSelectedDate,
    setActiveTab,
    finalizeDay
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'completed' | 'missed'

  if (!dayData) return null;

  const { dayNumber, dateKey, isPast, isFuture, weekNumber } = dayData;
  const isEffectiveToday = dateKey === effectiveTodayKey;

  // Active scheduled habits for this day
  const scheduledHabits = habits.filter(
    (h) => (!h.archivedAt || h.archivedAt > dateKey) && isHabitScheduledForDate(h, dateKey)
  );

  const completedHabits = scheduledHabits.filter((h) => {
    const rec = records[`${h.id}_${dateKey}`];
    return Boolean(rec && rec.completed);
  });

  const notCompletedHabits = scheduledHabits.filter((h) => {
    const rec = records[`${h.id}_${dateKey}`];
    return !rec || !rec.completed;
  });

  const stat = getDailyCompletion(dateKey, habits, records);
  const journalEntry = journal[dateKey];
  const storedSummary = daySummaries[dateKey];

  let statusBadge = <Badge variant="neutral">Future Day</Badge>;
  if (isEffectiveToday) {
    statusBadge = <Badge variant="accent">Active Tracking Day (Day {dayNumber})</Badge>;
  } else if (isPast || dateKey < effectiveTodayKey) {
    if (stat.isPerfect) {
      statusBadge = <Badge variant="success">100% Fully Executed</Badge>;
    } else if (stat.completedCount > 0) {
      statusBadge = <Badge variant="warning">{stat.percentage}% Partial Execution</Badge>;
    } else {
      statusBadge = <Badge variant="missed">0% Missed Day</Badge>;
    }
  }

  const handleGoToHabits = () => {
    setSelectedDate(dateKey);
    setActiveTab('habits');
    onClose();
  };

  const handleGoToJournal = () => {
    setSelectedDate(dateKey);
    setActiveTab('journal');
    onClose();
  };

  const handleFinalize = () => {
    finalizeDay(dateKey);
  };

  const wordCount = journalEntry?.content?.trim()
    ? journalEntry.content.trim().split(/\s+/).length
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Day ${dayNumber} — What Have I Done?`}
      subtitle={`${formatDisplayDate(dateKey, 'EEEE, MMMM d, yyyy')} • Week ${weekNumber}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Day Score & Execution Header */}
        <div className="p-4 bg-surface-card border border-surface-border rounded-xl shadow-subtle space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {statusBadge}
              {storedSummary && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-hover border border-surface-border text-content-secondary">
                  Snapshot Archived
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-content-secondary">Execution Score:</span>
              <span className={`text-sm font-extrabold ${stat.isPerfect ? 'text-status-success' : 'text-content-main'}`}>
                {stat.completedCount} / {stat.totalCount} ({stat.percentage}%)
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-border/60 text-center font-mono">
            <div className="p-2 rounded-lg bg-surface-hover/50">
              <span className="block text-[10px] text-content-muted uppercase">Completed</span>
              <span className="text-sm font-bold text-status-success">{completedHabits.length}</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-hover/50">
              <span className="block text-[10px] text-content-muted uppercase">Not Completed</span>
              <span className={`text-sm font-bold ${notCompletedHabits.length > 0 ? 'text-status-missed' : 'text-content-muted'}`}>
                {notCompletedHabits.length}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-surface-hover/50">
              <span className="block text-[10px] text-content-muted uppercase">Journal Words</span>
              <span className={`text-sm font-bold ${wordCount > 0 ? 'text-content-main' : 'text-content-muted'}`}>
                {wordCount}
              </span>
            </div>
          </div>
        </div>

        {/* View Filter Switcher: All | Completed | Not Completed */}
        <div className="flex items-center justify-between gap-2 border-b border-surface-border pb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTabFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTabFilter === 'all'
                  ? 'bg-content-main text-surface-card font-bold'
                  : 'text-content-secondary hover:text-content-main hover:bg-surface-hover'
              }`}
            >
              All Habits ({scheduledHabits.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTabFilter === 'completed'
                  ? 'bg-status-success text-white font-bold'
                  : 'text-content-secondary hover:text-content-main hover:bg-surface-hover'
              }`}
            >
              Completed ({completedHabits.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('missed')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeTabFilter === 'missed'
                  ? 'bg-status-missed text-white font-bold'
                  : 'text-content-secondary hover:text-content-main hover:bg-surface-hover'
              }`}
            >
              Not Completed ({notCompletedHabits.length})
            </button>
          </div>

          {!storedSummary && !isFuture && (
            <button
              onClick={handleFinalize}
              className="text-[11px] font-mono font-semibold text-content-main hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Save Day Snapshot
            </button>
          )}
        </div>

        {/* Habits Breakdown List */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {/* SECTION 1: Completed Habits */}
          {(activeTabFilter === 'all' || activeTabFilter === 'completed') && completedHabits.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-status-success uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed Habits ({completedHabits.length})</span>
              </div>
              <div className="space-y-1.5">
                {completedHabits.map((h) => {
                  const rec = records[`${h.id}_${dateKey}`];
                  const actual = rec?.actualValue !== undefined ? rec.actualValue : h.targetValue;
                  return (
                    <div
                      key={h.id}
                      className="p-2.5 rounded-lg border border-status-success-border/60 bg-status-success-bg/25 flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                          <span className="font-semibold text-content-main truncate">{h.name}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-status-success shrink-0">
                          {h.trackingType !== 'binary' ? `${actual} / ${h.targetValue} ${h.unit}` : 'Done'}
                        </span>
                      </div>
                      {rec?.note && (
                        <p className="text-[11px] text-content-secondary italic pl-6">
                          "{rec.note}"
                        </p>
                      )}
                      {rec?.words && rec.words.length > 0 && (
                        <div className="pl-6 flex flex-wrap gap-1 pt-0.5">
                          {rec.words.map((w, idx) => (
                            <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-hover border border-surface-border text-content-main">
                              {w.word}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: Not Completed Habits */}
          {(activeTabFilter === 'all' || activeTabFilter === 'missed') && notCompletedHabits.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-status-missed uppercase">
                <XCircle className="w-3.5 h-3.5" />
                <span>Not Completed / Missed ({notCompletedHabits.length})</span>
              </div>
              <div className="space-y-1.5">
                {notCompletedHabits.map((h) => {
                  return (
                    <div
                      key={h.id}
                      className="p-2.5 rounded-lg border border-surface-border bg-surface-hover/30 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <XCircle className="w-4 h-4 text-status-missed shrink-0" />
                        <span className="font-medium text-content-secondary truncate">{h.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] text-content-muted">
                          Target: {h.targetValue} {h.unit}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-status-missed-bg text-status-missed border border-status-missed-border font-semibold">
                          Missed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTabFilter === 'completed' && completedHabits.length === 0 && (
            <div className="text-center py-6 text-xs text-content-muted border border-dashed border-surface-border rounded-lg">
              No habits were completed on this day.
            </div>
          )}

          {activeTabFilter === 'missed' && notCompletedHabits.length === 0 && (
            <div className="text-center py-6 text-xs text-status-success font-semibold border border-dashed border-status-success-border rounded-lg">
              🎉 100% Execution! No habits were missed on this day.
            </div>
          )}
        </div>

        {/* SECTION 3: Journal Reflection for this Date */}
        <div className="space-y-2 pt-3 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-content-main" />
              <h4 className="text-xs font-bold uppercase font-mono text-content-main">
                Daily Journal Reflection
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {journalEntry?.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {journalEntry.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono text-content-muted bg-surface-hover px-1.5 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
              {wordCount > 0 && (
                <span className="text-[10px] font-mono text-status-success font-semibold">
                  {wordCount} words logged
                </span>
              )}
            </div>
          </div>

          {journalEntry?.content?.trim() ? (
            <div className="p-3.5 bg-surface-hover/50 border border-surface-border rounded-xl text-xs text-content-main leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-sans">
              {journalEntry.content}
            </div>
          ) : (
            <div className="p-4 bg-surface-hover/20 border border-dashed border-surface-border rounded-xl text-center space-y-2">
              <p className="text-xs text-content-muted">
                No reflection written for Day {dayNumber} ({dateKey}).
              </p>
              <Button size="sm" variant="outline" icon={BookOpen} onClick={handleGoToJournal}>
                Write Journal for Day {dayNumber}
              </Button>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-surface-border gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={CheckSquare}
            onClick={handleGoToHabits}
          >
            Track in Habits Page
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={BookOpen}
              onClick={handleGoToJournal}
            >
              Open in Journal
            </Button>
            <Button size="sm" variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
