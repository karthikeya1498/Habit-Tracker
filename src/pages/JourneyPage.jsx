import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  generateChallengeDays,
  generateChallengeWeeks,
  formatDisplayDate,
  getTodayKey
} from '../utils/dateUtils';
import { getDailyCompletion } from '../utils/statsUtils';
import { MILESTONES } from '../utils/defaultData';
import { Card, Button, Badge, ProgressBar } from '../components/common/UIElements';
import { DayDetailModal } from '../components/journey/DayDetailModal';
import { WeeklyReflectionModal } from '../components/journey/WeeklyReflectionModal';
import {
  Download,
  Calendar,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Edit3
} from 'lucide-react';

export function JourneyPage() {
  const {
    settings,
    habits,
    records,
    weeklyNotes,
    challengeInfo,
    exportCSV
  } = useApp();

  const [selectedDayData, setSelectedDayData] = useState(null);
  const [selectedWeekInfo, setSelectedWeekInfo] = useState(null);

  const days = generateChallengeDays(settings.startDate, settings.durationDays);
  const weeks = generateChallengeWeeks(settings.startDate, settings.durationDays);
  const todayKey = getTodayKey();

  // Find most consistent habit for a given week
  const getMostConsistentHabitForWeek = (weekDays) => {
    let topHabit = null;
    let maxCompletions = -1;

    habits.forEach(h => {
      let count = 0;
      weekDays.forEach(d => {
        const rec = records[`${h.id}_${d.dateKey}`];
        if (rec && rec.completed) count++;
      });
      if (count > maxCompletions && count > 0) {
        maxCompletions = count;
        topHabit = h.name;
      }
    });

    return topHabit;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
            90-Day Journey
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            The full architecture of your 3-month transformation. 90 days of deliberate compounding.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={exportCSV}
        >
          Export Journey (CSV)
        </Button>
      </div>

      {/* 90-Day Visual Grid */}
      <Card className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              Transformation Grid (90 Days)
            </h3>
            <p className="text-xs text-content-secondary">
              Click any day to inspect completed habits, notes, and journal entries.
            </p>
          </div>

          {/* Grid Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono text-content-secondary flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-status-success-bg border border-status-success-border" />
              <span>100% Done</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-status-warning-bg border border-status-warning-border" />
              <span>Partial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-status-missed-bg border border-status-missed-border" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface-card border-2 border-content-main" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface-hover/60 border border-surface-border" />
              <span>Future</span>
            </div>
          </div>
        </div>

        {/* The 90-Day Matrix */}
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-10 lg:grid-cols-15 gap-2 pt-2">
          {days.map((day) => {
            const stat = getDailyCompletion(day.dateKey, habits, records);

            let dayStyle = 'bg-surface-hover/40 border-surface-border text-content-muted';
            let dayStatus = 'Future';

            if (day.isToday) {
              dayStyle = 'bg-surface-card border-2 border-content-main text-content-main font-bold shadow-sm';
              dayStatus = 'Today';
            } else if (day.isPast) {
              if (stat.isPerfect) {
                dayStyle = 'bg-status-success-bg border border-status-success-border text-status-success font-semibold';
                dayStatus = 'Completed';
              } else if (stat.completedCount > 0) {
                dayStyle = 'bg-status-warning-bg border border-status-warning-border text-status-warning font-medium';
                dayStatus = 'Partial';
              } else {
                dayStyle = 'bg-status-missed-bg border border-status-missed-border text-status-missed font-medium';
                dayStatus = 'Missed';
              }
            }

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setSelectedDayData(day)}
                title={`Day ${day.dayNumber}: ${day.dateKey} (${dayStatus})`}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-150 hover:scale-105 hover:shadow-subtle cursor-pointer ${dayStyle}`}
              >
                <span className="text-[10px] font-mono leading-none">D{day.dayNumber}</span>
                <span className="text-[9px] font-mono opacity-70 mt-1">
                  {day.dateKey.split('-').slice(1).join('/')}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Milestones Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-content-main" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-content-main font-mono">
            Transformation Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MILESTONES.map((m) => {
            const isUnlocked = challengeInfo.currentDay >= m.day && challengeInfo.status !== 'not_started';
            const isCurrent = challengeInfo.currentDay === m.day;

            return (
              <Card
                key={m.day}
                className={`space-y-2 p-4 transition-all ${
                  isUnlocked
                    ? 'border-status-success-border/70 bg-surface-card'
                    : 'border-surface-border bg-surface-hover/20 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-content-muted">
                    Day {m.day}
                  </span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-content-muted" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-content-main">{m.title}</h4>
                  <p className="text-[11px] text-content-secondary mt-1 leading-snug">
                    {m.description}
                  </p>
                </div>

                <div className="pt-2 text-[10px] font-mono">
                  {isUnlocked ? (
                    <span className="text-status-success font-semibold">Unlocked</span>
                  ) : (
                    <span className="text-content-muted">
                      Unlocks in {m.day - challengeInfo.currentDay} days
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weekly Breakdown (13 Weeks) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-content-main" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main font-mono">
              Weekly Breakdown (13 Weeks)
            </h2>
          </div>
          <span className="text-xs font-mono text-content-muted">
            13 deliberate 7-day sprints
          </span>
        </div>

        <div className="space-y-3">
          {weeks.map((week) => {
            const isCurrentWeek = week.days.some(d => d.isToday);
            const isPastWeek = week.days.every(d => d.isPast);

            let totalWeekPossible = 0;
            let totalWeekCompleted = 0;

            week.days.forEach(d => {
              if (d.dateKey <= todayKey) {
                const s = getDailyCompletion(d.dateKey, habits, records);
                totalWeekPossible += s.totalCount;
                totalWeekCompleted += s.completedCount;
              }
            });

            const rate = totalWeekPossible > 0 ? Math.round((totalWeekCompleted / totalWeekPossible) * 100) : 0;
            const topHabit = getMostConsistentHabitForWeek(week.days);
            const savedReflection = weeklyNotes[week.weekNumber]?.reflection;

            return (
              <Card
                key={week.weekNumber}
                className={`p-4 transition-all ${
                  isCurrentWeek ? 'border-content-main ring-1 ring-content-main/10 shadow-subtle' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-content-main">
                        Week {week.weekNumber}
                      </span>
                      <span className="text-content-muted text-xs">•</span>
                      <span className="text-xs font-mono text-content-secondary">
                        {formatDisplayDate(week.startDate, 'MMM d')} – {formatDisplayDate(week.endDate, 'MMM d, yyyy')}
                      </span>
                      {isCurrentWeek && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-content-main text-surface-card font-bold">
                          Current Sprint
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-content-secondary flex-wrap">
                      <span>
                        Completion: <strong className="text-content-main font-mono">{rate}%</strong>
                      </span>
                      {topHabit && (
                        <span>
                          Anchor Habit: <strong className="text-content-main">{topHabit}</strong>
                        </span>
                      )}
                    </div>

                    {savedReflection && (
                      <p className="text-xs text-content-secondary italic line-clamp-1 bg-surface-hover/40 px-2 py-1 rounded border border-surface-border/50">
                        "{savedReflection}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant={savedReflection ? 'secondary' : 'outline'}
                      icon={Edit3}
                      onClick={() =>
                        setSelectedWeekInfo({
                          weekNumber: week.weekNumber,
                          startDate: week.startDate,
                          endDate: week.endDate,
                          rate,
                          mostConsistentHabit: topHabit,
                        })
                      }
                    >
                      {savedReflection ? 'Edit Review' : 'Review Week'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {selectedDayData && (
        <DayDetailModal
          isOpen={Boolean(selectedDayData)}
          onClose={() => setSelectedDayData(null)}
          dayData={selectedDayData}
        />
      )}

      {selectedWeekInfo && (
        <WeeklyReflectionModal
          isOpen={Boolean(selectedWeekInfo)}
          onClose={() => setSelectedWeekInfo(null)}
          weekInfo={selectedWeekInfo}
        />
      )}
    </div>
  );
}
