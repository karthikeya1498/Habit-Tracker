import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../common/UIElements';
import { ConfirmationDialog } from '../common/Modal';
import { getTodayKey } from '../../utils/dateUtils';
import { CheckCheck, BookOpen, CheckSquare, Calendar, Zap } from 'lucide-react';

export function QuickActions() {
  const {
    completeAllHabitsToday,
    setSelectedDate,
    setActiveTab,
  } = useApp();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleReviewToday = () => {
    setSelectedDate(getTodayKey());
    setActiveTab('habits');
  };

  const handleAddJournal = () => {
    setSelectedDate(getTodayKey());
    setActiveTab('journal');
  };

  const handleViewJourney = () => {
    setActiveTab('journey');
  };

  return (
    <>
      <Card className="space-y-3">
        <div className="flex items-center gap-2 pb-1">
          <Zap className="w-3.5 h-3.5 text-content-main" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-content-main font-mono">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Action 1: Complete today's habits with confirmation */}
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex flex-col items-start gap-1.5 p-3 rounded-lg bg-surface-hover/60 hover:bg-surface-hover border border-surface-border text-left transition-all group"
          >
            <div className="p-1.5 rounded-md bg-surface-card text-content-main shadow-subtle group-hover:scale-105 transition-transform">
              <CheckCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-content-main">Complete Today</p>
              <p className="text-[10px] text-content-secondary">Mark all habits fulfilled</p>
            </div>
          </button>

          {/* Action 2: Add journal entry */}
          <button
            onClick={handleAddJournal}
            className="flex flex-col items-start gap-1.5 p-3 rounded-lg bg-surface-hover/60 hover:bg-surface-hover border border-surface-border text-left transition-all group"
          >
            <div className="p-1.5 rounded-md bg-surface-card text-content-main shadow-subtle group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-content-main">Write Journal</p>
              <p className="text-[10px] text-content-secondary">Daily evening reflection</p>
            </div>
          </button>

          {/* Action 3: Review today's progress */}
          <button
            onClick={handleReviewToday}
            className="flex flex-col items-start gap-1.5 p-3 rounded-lg bg-surface-hover/60 hover:bg-surface-hover border border-surface-border text-left transition-all group"
          >
            <div className="p-1.5 rounded-md bg-surface-card text-content-main shadow-subtle group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-content-main">Review Habits</p>
              <p className="text-[10px] text-content-secondary">Log numeric progress</p>
            </div>
          </button>

          {/* Action 4: View 90-day journey */}
          <button
            onClick={handleViewJourney}
            className="flex flex-col items-start gap-1.5 p-3 rounded-lg bg-surface-hover/60 hover:bg-surface-hover border border-surface-border text-left transition-all group"
          >
            <div className="p-1.5 rounded-md bg-surface-card text-content-main shadow-subtle group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-content-main">90-Day Journey</p>
              <p className="text-[10px] text-content-secondary">View progress roadmap</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Confirmation Dialog for Completing All Habits */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={completeAllHabitsToday}
        title="Complete Today's Habits?"
        message="This will mark all scheduled habits for today as completed with full target values. Are you sure you executed all your priorities today?"
        confirmLabel="Yes, Mark All Complete"
        cancelLabel="Cancel"
      />
    </>
  );
}
