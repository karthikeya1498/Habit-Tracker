import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button, Badge } from '../common/UIElements';
import { formatDisplayDate, getTodayKey } from '../../utils/dateUtils';
import { getDailyCompletion } from '../../utils/statsUtils';
import { CheckCircle2, XCircle, Clock, BookOpen, CheckSquare, ArrowRight } from 'lucide-react';

export function DayDetailModal({
  isOpen,
  onClose,
  dayData, // { dayNumber, dateKey, isToday, isPast, isFuture, weekNumber }
}) {
  const { habits, records, journal, setSelectedDate, setActiveTab } = useApp();

  if (!dayData) return null;

  const { dayNumber, dateKey, isToday, isPast, isFuture, weekNumber } = dayData;
  const stat = getDailyCompletion(dateKey, habits, records);
  const journalEntry = journal[dateKey];

  let statusBadge = <Badge variant="neutral">Future Day</Badge>;
  if (isToday) {
    statusBadge = <Badge variant="accent">Today (Day {dayNumber})</Badge>;
  } else if (isPast) {
    if (stat.isPerfect) {
      statusBadge = <Badge variant="success">100% Completed</Badge>;
    } else if (stat.completedCount > 0) {
      statusBadge = <Badge variant="warning">{stat.percentage}% Partial</Badge>;
    } else {
      statusBadge = <Badge variant="missed">Missed Day</Badge>;
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Day ${dayNumber} — ${formatDisplayDate(dateKey, 'EEEE, MMM d, yyyy')}`}
      subtitle={`Week ${weekNumber} of the 90-Day Challenge`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Day Status & Completion Summary */}
        <div className="flex items-center justify-between p-3 bg-surface-hover/50 rounded-xl border border-surface-border">
          <div className="flex items-center gap-2">
            {statusBadge}
          </div>
          <div className="text-right text-xs font-mono">
            <span className="font-bold text-content-main">{stat.completedCount} / {stat.totalCount}</span>
            <span className="text-content-secondary"> habits ({stat.percentage}%)</span>
          </div>
        </div>

        {/* Habits Checklist for this date */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase font-mono text-content-main">
            Habit Records for this Day
          </h4>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {habits.map((h) => {
              const rec = records[`${h.id}_${dateKey}`];
              const isDone = Boolean(rec && rec.completed);
              const actual = rec?.actualValue || (isDone ? h.targetValue : 0);

              return (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs border ${
                    isDone
                      ? 'bg-status-success-bg/30 border-status-success-border/60 text-content-main'
                      : 'bg-surface-card border-surface-border text-content-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-content-muted shrink-0" />
                    )}
                    <span className={`truncate ${isDone ? 'font-medium text-content-main' : ''}`}>
                      {h.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {h.trackingType !== 'binary' && (
                      <span className="font-mono text-[10px] text-content-secondary">
                        {actual}/{h.targetValue} {h.unit}
                      </span>
                    )}
                    {rec?.note && (
                      <span className="text-[10px] text-content-muted italic truncate max-w-[120px]">
                        "{rec.note}"
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journal Reflection for this date */}
        <div className="space-y-1.5 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase font-mono text-content-main">
              Journal Entry
            </h4>
            {journalEntry?.tags?.length > 0 && (
              <div className="flex gap-1">
                {journalEntry.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-mono text-content-muted bg-surface-hover px-1.5 py-0.2 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {journalEntry?.content?.trim() ? (
            <div className="p-3 bg-surface-hover/40 border border-surface-border rounded-lg text-xs text-content-main leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap font-sans">
              {journalEntry.content}
            </div>
          ) : (
            <div className="text-center py-4 bg-surface-hover/20 border border-dashed border-surface-border rounded-lg text-xs text-content-muted">
              No journal entry recorded for this date.
            </div>
          )}
        </div>

        {/* Bottom Actions to jump */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-border gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={CheckSquare}
            onClick={handleGoToHabits}
          >
            Open in Habits
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
