import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  formatDisplayDate,
  addDaysToDateKey,
  parseDateKey
} from '../../utils/dateUtils';
import { getDailyCompletion } from '../../utils/statsUtils';
import { differenceInCalendarDays } from 'date-fns';
import { Button } from '../common/UIElements';
import { DayDetailModal } from '../journey/DayDetailModal';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Eye
} from 'lucide-react';

export function DateNavigator() {
  const {
    selectedDate,
    setSelectedDate,
    habits,
    records,
    settings,
    effectiveTodayKey,
    daySummaries,
    finalizeDay
  } = useApp();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const isToday = selectedDate === effectiveTodayKey;

  const dayNumber = Math.max(
    1,
    differenceInCalendarDays(parseDateKey(selectedDate), parseDateKey(settings.startDate)) + 1
  );

  const handlePrevDay = () => {
    setSelectedDate(addDaysToDateKey(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDaysToDateKey(selectedDate, 1));
  };

  const handleReturnToday = () => {
    setSelectedDate(effectiveTodayKey);
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const dailyStat = getDailyCompletion(selectedDate, habits, records);
  const isFinalized = Boolean(daySummaries[selectedDate]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-surface-card border border-surface-border rounded-xl shadow-card">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrevDay}
            title="Previous Day"
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover text-content-main transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex items-center">
            <label
              htmlFor="date-picker-input"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover cursor-pointer text-sm font-semibold text-content-main transition-colors select-none font-mono"
            >
              <CalendarIcon className="w-4 h-4 text-content-secondary" />
              <span className="font-extrabold text-content-main">DAY {dayNumber}</span>
              <span className="text-content-secondary text-xs">• {formatDisplayDate(selectedDate, 'EEE, MMM d, yyyy')}</span>
              {isToday && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-content-main text-surface-card font-bold">
                  Today
                </span>
              )}
            </label>
            <input
              id="date-picker-input"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="sr-only"
            >
            </input>
          </div>

          <button
            onClick={handleNextDay}
            title="Next Day"
            className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover text-content-main transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReturnToday}
              icon={RotateCcw}
              className="text-xs py-1"
            >
              Today
            </Button>
          )}

          {/* Button to view Day Breakdown (What have I done?) */}
          <Button
            size="sm"
            variant="outline"
            icon={Eye}
            onClick={() => setIsDetailModalOpen(true)}
            className="text-xs py-1"
          >
            Day Summary
          </Button>

          {/* Quick Finalize Snapshot button */}
          {!isFinalized && dailyStat.completedCount > 0 && (
            <Button
              size="sm"
              variant="secondary"
              icon={Sparkles}
              onClick={() => finalizeDay(selectedDate)}
              className="text-xs py-1"
              title="Save permanent snapshot of completed & missed habits"
            >
              Close Day
            </Button>
          )}
        </div>

        {/* Day Progress Summary */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-content-main">
              {dailyStat.completedCount} / {dailyStat.totalCount} completed
            </div>
            <div className="text-[11px] font-mono text-content-secondary">
              {dailyStat.percentage}% day execution
            </div>
          </div>

          <div className="w-20 bg-surface-hover h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                dailyStat.isPerfect ? 'bg-status-success' : 'bg-content-main'
              }`}
              style={{ width: `${dailyStat.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {isDetailModalOpen && (
        <DayDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          dayData={{
            dayNumber,
            dateKey: selectedDate,
            isToday,
            isPast: selectedDate < effectiveTodayKey,
            isFuture: selectedDate > effectiveTodayKey,
            weekNumber: Math.floor((dayNumber - 1) / 7) + 1,
          }}
        />
      )}
    </>
  );
}
