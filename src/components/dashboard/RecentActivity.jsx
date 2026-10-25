import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/UIElements';
import { formatDisplayDate, getTodayKey } from '../../utils/dateUtils';
import { HabitLogModal } from '../habits/HabitLogModal';
import { CheckCircle2, BookOpen, Clock, ArrowUpRight } from 'lucide-react';

export function RecentActivity() {
  const { habits, records, journal, setSelectedDate, setActiveTab, updateHabitProgress } = useApp();
  const [modalHabitData, setModalHabitData] = useState(null);

  // Compile completed records and journal updates
  const activities = [];

  // Habits
  Object.values(records).forEach((rec) => {
    if (rec.completed) {
      const habit = habits.find((h) => h.id === rec.habitId);
      if (habit) {
        activities.push({
          type: 'habit',
          id: `${rec.habitId}_${rec.dateKey}`,
          habit,
          dateKey: rec.dateKey,
          title: habit.name,
          detail: rec.actualValue > 0 ? `${rec.actualValue} ${habit.unit}` : 'Completed',
          note: rec.note,
          updatedAt: rec.updatedAt || rec.dateKey,
        });
      }
    }
  });

  // Journal
  Object.values(journal).forEach((entry) => {
    if (entry.content && entry.content.trim().length > 0) {
      activities.push({
        type: 'journal',
        id: `journal_${entry.dateKey}`,
        dateKey: entry.dateKey,
        title: 'Daily Reflection Saved',
        detail: `${entry.content.trim().length} chars`,
        note: entry.content.slice(0, 60) + '...',
        updatedAt: entry.updatedAt || entry.dateKey,
      });
    }
  });

  // Sort descending by updatedAt
  activities.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const recent = activities.slice(0, 5);

  const handleClick = (act) => {
    if (act.type === 'habit') {
      setModalHabitData({
        habit: act.habit,
        dateKey: act.dateKey,
        record: records[`${act.habit.id}_${act.dateKey}`],
      });
    } else {
      setSelectedDate(act.dateKey);
      setActiveTab('journal');
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-content-secondary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-content-main font-mono">
            Recent Activity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-content-muted">
          Latest tracking events
        </span>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-6 text-xs text-content-secondary">
          No activity recorded yet. Check off a habit or write a journal entry to begin your log.
        </div>
      ) : (
        <div className="divide-y divide-surface-border/60">
          {recent.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className="py-2.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-surface-hover/50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-md shrink-0 ${
                    item.type === 'habit'
                      ? 'bg-status-success-bg text-status-success'
                      : 'bg-surface-hover text-content-main'
                  }`}
                >
                  {item.type === 'habit' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-content-main truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] font-mono text-content-muted bg-surface-hover px-1.5 py-0.2 rounded">
                      {item.detail}
                    </span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-content-secondary truncate max-w-sm">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-content-muted">
                  {formatDisplayDate(item.dateKey, 'MMM d')}
                </span>
                <ArrowUpRight className="w-3 h-3 text-content-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Habit detail / edit modal */}
      {modalHabitData && (
        <HabitLogModal
          isOpen={Boolean(modalHabitData)}
          onClose={() => setModalHabitData(null)}
          habit={modalHabitData.habit}
          dateKey={modalHabitData.dateKey}
          currentRecord={modalHabitData.record}
          onSave={updateHabitProgress}
        />
      )}
    </Card>
  );
}
