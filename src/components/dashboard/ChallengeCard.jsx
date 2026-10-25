import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, ProgressBar, Button } from '../common/UIElements';
import { formatDisplayDate } from '../../utils/dateUtils';
import { Calendar, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export function ChallengeCard() {
  const { challengeInfo, setActiveTab } = useApp();

  const formattedStart = formatDisplayDate(challengeInfo.startDateKey, 'MMM d, yyyy');
  const formattedEnd = formatDisplayDate(challengeInfo.endDateKey, 'MMM d, yyyy');

  if (challengeInfo.status === 'not_started') {
    return (
      <Card className="border-status-warning-border bg-status-warning-bg/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-status-warning font-mono text-xs font-semibold uppercase">
              <Clock className="w-4 h-4" />
              <span>Challenge Starts Soon</span>
            </div>
            <h3 className="text-base font-bold text-content-main">
              Transformation begins in {challengeInfo.daysUntilStart} {challengeInfo.daysUntilStart === 1 ? 'day' : 'days'}
            </h3>
            <p className="text-xs text-content-secondary">
              Scheduled start date: {formattedStart}. Target completion: {formattedEnd}.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setActiveTab('settings')}
          >
            Adjust Start Date
          </Button>
        </div>
      </Card>
    );
  }

  if (challengeInfo.status === 'completed') {
    return (
      <Card className="border-status-success-border bg-status-success-bg/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-status-success font-mono text-xs font-semibold uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>90-Day Challenge Completed</span>
            </div>
            <h3 className="text-base font-bold text-content-main">
              You finished all 90 days of the transformation!
            </h3>
            <p className="text-xs text-content-secondary">
              Started {formattedStart} • Concluded {formattedEnd}. Review your full journey and export your transformation summary.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={ArrowRight}
            onClick={() => setActiveTab('journey')}
          >
            View Journey Summary
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-content-secondary">
            90-Day Transformation Challenge
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-content-muted">
          <span>{formattedStart}</span>
          <span>→</span>
          <span>{formattedEnd}</span>
        </div>
      </div>

      {/* Main Day Counter */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-content-main">
              DAY {challengeInfo.currentDay}
            </span>
            <span className="text-lg font-mono text-content-muted">/ 90</span>
          </div>
          <p className="text-xs text-content-secondary mt-0.5">
            {challengeInfo.daysCompleted} {challengeInfo.daysCompleted === 1 ? 'day' : 'days'} completed • {challengeInfo.daysRemaining} days remaining
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-content-main">
            {challengeInfo.percentComplete}%
          </span>
          <p className="text-[11px] font-mono uppercase text-content-muted">Overall progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <ProgressBar
          progress={challengeInfo.percentComplete}
          height="h-2.5"
          color="bg-content-main"
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-content-muted">
          <span>Day 1</span>
          <span>Day 45 (Midpoint)</span>
          <span>Day 90</span>
        </div>
      </div>
    </Card>
  );
}
