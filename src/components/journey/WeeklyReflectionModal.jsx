import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/UIElements';
import { Check, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';

export function WeeklyReflectionModal({
  isOpen,
  onClose,
  weekInfo, // { weekNumber, startDate, endDate, rate, mostConsistentHabit }
}) {
  const { weeklyNotes, saveWeeklyReflection } = useApp();
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    if (weekInfo) {
      const saved = weeklyNotes[weekInfo.weekNumber]?.reflection || '';
      setReflection(saved);
    }
  }, [weekInfo, weeklyNotes, isOpen]);

  if (!weekInfo) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveWeeklyReflection(weekInfo.weekNumber, reflection.trim());
    onClose();
  };

  const formattedStart = formatDisplayDate(weekInfo.startDate, 'MMM d');
  const formattedEnd = formatDisplayDate(weekInfo.endDate, 'MMM d, yyyy');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Week ${weekInfo.weekNumber} Reflection`}
      subtitle={`${formattedStart} — ${formattedEnd} • Execution Rate: ${weekInfo.rate}%`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-surface-hover/50 rounded-xl border border-surface-border text-xs text-content-secondary space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-content-main">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Weekly Review Guidelines</span>
          </div>
          <p>
            Assess what went well, which habit created the strongest momentum, and what friction needs to be eliminated for the upcoming week.
          </p>
          {weekInfo.mostConsistentHabit && (
            <p className="text-content-main font-medium pt-1">
              Top Anchor Habit: <span className="font-mono">{weekInfo.mostConsistentHabit}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase font-mono text-content-main">
            Weekly Insights & Lessons Learned
          </label>
          <textarea
            rows="6"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What patterns did you notice this week? Did coding deep-work happen before distractions? How did your sleep and nutrition impact your communication confidence?"
            className="w-full text-xs p-3 bg-surface-card border border-surface-border rounded-xl text-content-main placeholder:text-content-muted focus:outline-none focus:border-content-main resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" icon={Check}>
            Save Reflection
          </Button>
        </div>
      </form>
    </Modal>
  );
}
