import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, ProgressBar } from '../common/UIElements';
import { getTodayKey, isHabitScheduledForDate, isWeekend } from '../../utils/dateUtils';
import { HabitLogModal } from '../habits/HabitLogModal';
import { Code, MessageSquare, Dumbbell, Check, ChevronRight, Edit3 } from 'lucide-react';

const PRIORITY_META = {
  technical: {
    number: '01',
    title: 'TECHNICAL MASTERY',
    tagline: 'Daily coding 3hrs. Weekends: CS Fundamentals, Data Structures, OS & System Design.',
    icon: Code,
  },
  communication: {
    number: '02',
    title: 'COMMUNICATION',
    tagline: 'Improve English fluency, speaking, communication skills, and confidence.',
    icon: MessageSquare,
  },
  fitness: {
    number: '03',
    title: 'ATHLETIC PHYSIQUE',
    tagline: 'Build strength, fitness, discipline, and an athletic body.',
    icon: Dumbbell,
  },
};

export function PriorityGoalCards() {
  const {
    goals,
    habits,
    records,
    toggleHabitComplete,
    updateHabitProgress,
    setActiveTab,
  } = useApp();

  const [activeHabitForModal, setActiveHabitForModal] = useState(null);
  const todayKey = getTodayKey();
  const isWeekendToday = isWeekend(todayKey);

  const categories = ['technical', 'communication', 'fitness'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-content-main font-mono">
            Today's Priorities
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            The three pillars of your transformation. Execute daily without excuses.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('goals')}
          className="text-xs font-medium text-content-secondary hover:text-content-main flex items-center gap-1 group"
        >
          <span>All Goals</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {categories.map((catId) => {
          const meta = PRIORITY_META[catId];
          const Icon = meta.icon;
          const catHabits = habits.filter(
            (h) => h.categoryId === catId && (!h.archivedAt || h.archivedAt > todayKey)
          );
          const scheduledHabits = catHabits.filter(h => isHabitScheduledForDate(h, todayKey));

          let completedCount = 0;
          scheduledHabits.forEach((h) => {
            const rec = records[`${h.id}_${todayKey}`];
            if (rec && rec.completed) completedCount++;
          });

          const pct = scheduledHabits.length > 0 ? Math.round((completedCount / scheduledHabits.length) * 100) : 0;

          return (
            <Card
              key={catId}
              className="flex flex-col justify-between hover:border-surface-border-strong transition-all"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-content-muted">
                      {meta.number}
                    </span>
                    <span className="text-content-muted">•</span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-content-main font-mono">
                      {meta.title}
                    </h3>
                  </div>
                  <div className="p-1.5 rounded-lg bg-surface-hover text-content-main">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                  {meta.tagline}
                </p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-content-muted">
                    <span>{completedCount} of {scheduledHabits.length} scheduled done</span>
                    <span>{pct}%</span>
                  </div>
                  <ProgressBar
                    progress={pct}
                    height="h-1.5"
                    color={pct === 100 ? 'bg-status-success' : 'bg-content-main'}
                  />
                </div>

                {/* Habit checklist */}
                <div className="space-y-1.5 pt-1">
                  {catHabits.map((h) => {
                    const recordKey = `${h.id}_${todayKey}`;
                    const rec = records[recordKey] || { completed: false, actualValue: 0 };
                    const isDone = Boolean(rec.completed);
                    const isScheduled = isHabitScheduledForDate(h, todayKey);

                    return (
                      <div
                        key={h.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors group/item ${
                          isDone
                            ? 'bg-status-success-bg/40 border border-status-success-border/60 text-content-main'
                            : !isScheduled
                            ? 'bg-surface-hover/30 border border-transparent text-content-muted opacity-75'
                            : 'bg-surface-hover/50 hover:bg-surface-hover border border-transparent text-content-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleHabitComplete(h.id, todayKey)}
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors border shrink-0 ${
                              isDone
                                ? 'bg-status-success border-status-success text-white'
                                : 'border-surface-border-strong hover:border-content-main bg-surface-card'
                            }`}
                          >
                            {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              onClick={() => setActiveHabitForModal(h)}
                              className={`truncate cursor-pointer hover:underline ${
                                isDone ? 'line-through text-content-muted' : 'text-content-main font-medium'
                              }`}
                            >
                              {h.name}
                            </span>
                            {h.schedule === 'weekends' && (
                              <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-surface-hover text-content-muted shrink-0">
                                {isWeekendToday ? 'Weekend' : 'Wknd'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Value / Logger trigger */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {h.trackingType !== 'binary' && (
                            <span className="font-mono text-[10px] text-content-muted">
                              {rec.actualValue || 0}/{h.targetValue} {h.unit}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveHabitForModal(h)}
                            title="Log progress or notes"
                            className="p-1 opacity-0 group-hover/item:opacity-100 text-content-muted hover:text-content-main transition-opacity"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer navigation */}
              <div className="pt-4 border-t border-surface-border mt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('goals')}
                  className="w-full text-center text-xs font-semibold text-content-secondary hover:text-content-main transition-colors"
                >
                  View Goal Details & Milestones →
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Habit Log Modal */}
      {activeHabitForModal && (
        <HabitLogModal
          isOpen={Boolean(activeHabitForModal)}
          onClose={() => setActiveHabitForModal(null)}
          habit={activeHabitForModal}
          dateKey={todayKey}
          currentRecord={records[`${activeHabitForModal.id}_${todayKey}`]}
          onSave={updateHabitProgress}
        />
      )}
    </div>
  );
}
