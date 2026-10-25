import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/UIElements';
import {
  calculateStreaks,
  getHabitsCompletedThisWeek,
  getOverallCompletionRate
} from '../../utils/statsUtils';
import { Flame, Trophy, CalendarCheck, Percent } from 'lucide-react';

export function ConsistencyStats() {
  const { habits, records, settings } = useApp();

  const streaks = calculateStreaks(habits, records, settings.startDate);
  const weekStats = getHabitsCompletedThisWeek(habits, records);
  const overallRate = getOverallCompletionRate(habits, records, settings.startDate);

  const stats = [
    {
      id: 'current_streak',
      label: 'CURRENT STREAK',
      value: `${streaks.currentStreak} ${streaks.currentStreak === 1 ? 'day' : 'days'}`,
      description: streaks.currentStreak > 0 ? 'Active momentum' : 'Start your streak today',
      icon: Flame,
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'best_streak',
      label: 'BEST STREAK',
      value: `${streaks.bestStreak} ${streaks.bestStreak === 1 ? 'day' : 'days'}`,
      description: `${streaks.perfectDaysCount} perfect days logged`,
      icon: Trophy,
      color: 'text-content-main',
    },
    {
      id: 'week_habits',
      label: 'THIS WEEK',
      value: `${weekStats.completed} completed`,
      description: `${weekStats.rate}% weekly rate`,
      icon: CalendarCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'overall_rate',
      label: 'OVERALL COMPLETION',
      value: `${overallRate}%`,
      description: `${streaks.activeDaysCount} total active days`,
      icon: Percent,
      color: 'text-content-main',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-content-muted">
                {item.label}
              </span>
              <Icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-content-main">
                {item.value}
              </div>
              <p className="text-[11px] text-content-secondary mt-0.5 truncate">
                {item.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
