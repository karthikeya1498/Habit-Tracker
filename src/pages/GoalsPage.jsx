import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge, ProgressBar } from '../components/common/UIElements';
import { GoalModal } from '../components/goals/GoalModal';
import { getTodayKey } from '../utils/dateUtils';
import { getCategoryPerformance, getDailyCompletion } from '../utils/statsUtils';
import {
  Code,
  MessageSquare,
  Dumbbell,
  Target,
  CheckCircle2,
  Edit3,
  CheckSquare,
  ArrowRight
} from 'lucide-react';

const GOAL_ICONS = {
  technical: Code,
  communication: MessageSquare,
  fitness: Dumbbell,
};

export function GoalsPage() {
  const {
    goals,
    habits,
    records,
    settings,
    updateGoal,
    setSelectedDate,
    setActiveTab,
  } = useApp();

  const [editingGoal, setEditingGoal] = useState(null);
  const todayKey = getTodayKey();
  const categoryStats = getCategoryPerformance(habits, records, settings.startDate, 30);

  const handleOpenHabits = () => {
    setSelectedDate(todayKey);
    setActiveTab('habits');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
            Transformation Goals
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            The three non-negotiable pillars of your 90-day transformation.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={CheckSquare}
          onClick={handleOpenHabits}
        >
          Track Today's Habits
        </Button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-6">
        {goals.map((goal) => {
          const Icon = GOAL_ICONS[goal.category] || Target;
          const catStat = categoryStats[goal.category] || { completed: 0, total: 0, rate: 0 };

          // Associated habits
          const associatedHabits = habits.filter(
            (h) => h.categoryId === goal.category && (!h.archivedAt || h.archivedAt > todayKey)
          );

          // Today execution
          let todayCompleted = 0;
          associatedHabits.forEach((h) => {
            const rec = records[`${h.id}_${todayKey}`];
            if (rec && rec.completed) todayCompleted++;
          });
          const todayRate = associatedHabits.length > 0
            ? Math.round((todayCompleted / associatedHabits.length) * 100)
            : 0;

          return (
            <Card key={goal.id} className="space-y-6 p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-surface-border">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-hover flex items-center justify-center text-content-main shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-content-muted">
                        PILLAR {goal.priority}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight text-content-main font-mono uppercase mt-0.5">
                      {goal.title}
                    </h2>
                    <p className="text-xs text-content-secondary mt-1 max-w-2xl leading-relaxed">
                      "{goal.description}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Edit3}
                    onClick={() => setEditingGoal(goal)}
                  >
                    Edit Pillar
                  </Button>
                </div>
              </div>

              {/* Consistency Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-surface-hover/30 rounded-xl border border-surface-border">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
                    Today's Execution
                  </span>
                  <div className="text-xl font-bold font-mono text-content-main mt-0.5">
                    {todayCompleted} / {associatedHabits.length}
                  </div>
                  <ProgressBar
                    progress={todayRate}
                    height="h-1.5"
                    className="mt-2"
                    color={todayRate === 100 ? 'bg-status-success' : 'bg-content-main'}
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
                    30-Day Consistency
                  </span>
                  <div className="text-xl font-bold font-mono text-content-main mt-0.5">
                    {catStat.rate}%
                  </div>
                  <ProgressBar
                    progress={catStat.rate}
                    height="h-1.5"
                    className="mt-2"
                    color="bg-content-main"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
                    Total Completed Sessions
                  </span>
                  <div className="text-xl font-bold font-mono text-content-main mt-0.5">
                    {catStat.completed} sessions
                  </div>
                  <p className="text-[11px] text-content-secondary mt-2">
                    Across {associatedHabits.length} habits
                  </p>
                </div>
              </div>

              {/* Associated Habits Table */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-semibold uppercase font-mono text-content-main">
                  Associated Daily Habits ({associatedHabits.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {associatedHabits.map((h) => {
                    const rec = records[`${h.id}_${todayKey}`];
                    const isDone = Boolean(rec && rec.completed);
                    const actual = rec?.actualValue || (isDone ? h.targetValue : 0);

                    return (
                      <div
                        key={h.id}
                        className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                          isDone
                            ? 'bg-status-success-bg/30 border-status-success-border/60'
                            : 'bg-surface-card border-surface-border'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              isDone ? 'text-status-success' : 'text-content-muted'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-content-main truncate">
                              {h.name}
                            </p>
                            <p className="text-[11px] text-content-secondary line-clamp-1">
                              {h.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 font-mono text-[10px] text-content-muted ml-2">
                          {h.trackingType !== 'binary' ? (
                            <span>{actual}/{h.targetValue} {h.unit}</span>
                          ) : (
                            <span>{isDone ? 'Done' : 'Pending'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Success Criteria & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-surface-hover/40 rounded-xl border border-surface-border space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted">
                    Success Criteria
                  </span>
                  <p className="text-xs text-content-main leading-relaxed">
                    {goal.successCriteria || 'Define measurable success criteria in settings.'}
                  </p>
                </div>

                <div className="p-3.5 bg-surface-hover/40 rounded-xl border border-surface-border space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-content-muted">
                    Execution Notes
                  </span>
                  <p className="text-xs text-content-secondary italic leading-relaxed">
                    {goal.notes || 'No execution notes recorded.'}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingGoal && (
        <GoalModal
          isOpen={Boolean(editingGoal)}
          onClose={() => setEditingGoal(null)}
          goal={editingGoal}
          onSave={updateGoal}
        />
      )}
    </div>
  );
}
