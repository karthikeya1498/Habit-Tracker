import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressBar, Badge } from '../common/UIElements';
import { ConfirmationDialog } from '../common/Modal';
import {
  Check,
  Edit3,
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Archive,
  Trash2,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

import { isWeekend, isHabitScheduledForDate } from '../../utils/dateUtils';

export function HabitRow({
  habit,
  dateKey,
  onOpenLogModal,
  onOpenEditModal,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) {
  const { records, toggleHabitComplete, archiveHabit, deleteHabit } = useApp();
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const recordKey = `${habit.id}_${dateKey}`;
  const record = records[recordKey] || { completed: false, actualValue: 0, note: '' };
  const isCompleted = Boolean(record.completed);
  const isWeekendDay = isWeekend(dateKey);
  const isScheduledToday = isHabitScheduledForDate(habit, dateKey);

  const target = habit.targetValue || 1;
  const actual = record.actualValue || (isCompleted ? target : 0);
  const percent = habit.trackingType === 'binary'
    ? (isCompleted ? 100 : 0)
    : Math.min(100, Math.round((actual / target) * 100));

  const isVocab = habit.id === 'habit_vocab';

  return (
    <>
      <div
        className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all duration-150 gap-3 bulge-box ${
          isCompleted
            ? 'bg-status-success-bg/30 border-status-success-border/70 hover:border-status-success'
            : !isScheduledToday
            ? 'bg-surface-card/60 border-surface-border/70 opacity-80 hover:opacity-100'
            : 'bg-surface-card border-surface-border hover:border-surface-border-strong hover:shadow-subtle'
        }`}
      >
        {/* Left Section: Checkbox + Title + Description */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => toggleHabitComplete(habit.id, dateKey)}
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 border shrink-0 mt-0.5 ${
              isCompleted
                ? 'bg-status-success border-status-success text-white shadow-sm'
                : 'border-surface-border-strong hover:border-content-main bg-surface-card'
            }`}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Habit Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => onOpenLogModal(habit)}
                className={`text-sm font-semibold cursor-pointer hover:underline ${
                  isCompleted ? 'text-content-secondary line-through' : 'text-content-main'
                }`}
              >
                {habit.name}
              </span>

              {habit.isPrimary && (
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-content-main text-surface-card">
                  Daily Anchor
                </span>
              )}

              {habit.schedule === 'weekends' && (
                <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                  isWeekendDay
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold'
                    : 'bg-surface-hover text-content-muted border-surface-border'
                }`}>
                  {isWeekendDay ? 'Weekend Focus' : 'Weekends Only'}
                </span>
              )}

              {/* Progress tag */}
              {habit.trackingType !== 'binary' && (
                <span className="text-xs font-mono font-medium text-content-secondary bg-surface-hover px-2 py-0.5 rounded-md border border-surface-border">
                  {actual} / {target} {habit.unit}
                </span>
              )}
            </div>

            {habit.description && (
              <p className="text-xs text-content-secondary mt-0.5 leading-relaxed line-clamp-1">
                {habit.description}
              </p>
            )}

            {/* Note preview if exists for this date */}
            {record.note && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-content-secondary italic bg-surface-hover/50 px-2 py-0.5 rounded border border-surface-border/50 max-w-lg">
                <FileText className="w-3 h-3 shrink-0 text-content-muted" />
                <span className="truncate">{record.note}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Progress Bar + Action Menu */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-border/60">
          {/* Progress bar for measurable habits */}
          {habit.trackingType !== 'binary' && (
            <div className="w-24 sm:w-28 space-y-1">
              <ProgressBar
                progress={percent}
                height="h-1.5"
                color={percent >= 100 ? 'bg-status-success' : 'bg-content-main'}
              />
              <div className="text-[10px] font-mono text-content-muted text-right">
                {percent}%
              </div>
            </div>
          )}

          {/* Quick Log button */}
          <button
            type="button"
            onClick={() => onOpenLogModal(habit)}
            className="flex items-center gap-1 text-xs font-medium text-content-secondary hover:text-content-main px-2.5 py-1.5 rounded-lg border border-surface-border bg-surface-hover/30 hover:bg-surface-hover transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>

          {/* Reordering Up/Down */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              disabled={isFirst}
              onClick={onMoveUp}
              title="Move Up"
              className="p-1 text-content-muted hover:text-content-main disabled:opacity-20 rounded"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={onMoveDown}
              title="Move Down"
              className="p-1 text-content-muted hover:text-content-main disabled:opacity-20 rounded"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More options menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-content-secondary hover:text-content-main hover:bg-surface-hover rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-44 bg-surface-card border border-surface-border rounded-xl shadow-modal py-1.5 z-30 text-xs animate-in fade-in duration-150">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenLogModal(habit);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-hover text-content-main flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Log Progress & Notes</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenEditModal(habit);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-hover text-content-main flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Edit Habit Definition</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      archiveHabit(habit.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-surface-hover text-content-secondary flex items-center gap-2"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>{habit.archivedAt ? 'Unarchive Habit' : 'Archive Habit'}</span>
                  </button>
                  <div className="my-1 border-t border-surface-border" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setIsDeleteConfirmOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-status-missed-bg text-status-missed flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Habit</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={() => deleteHabit(habit.id)}
        title="Delete Habit?"
        message={`Are you sure you want to delete "${habit.name}"? This will permanently remove the habit definition and its historical logs.`}
        confirmLabel="Delete Habit"
        isDestructive={true}
      />
    </>
  );
}
