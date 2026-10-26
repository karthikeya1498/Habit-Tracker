import React from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { ChallengeCard } from '../components/dashboard/ChallengeCard';
import { TodayExecutionCard } from '../components/dashboard/TodayExecutionCard';
import { DayHistoryCard } from '../components/dashboard/DayHistoryCard';
import { ConsistencyStats } from '../components/dashboard/ConsistencyStats';
import { PriorityGoalCards } from '../components/dashboard/PriorityGoalCards';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';

export function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Rotating statement */}
      <WelcomeBanner />

      {/* Challenge Summary & Today's Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <ChallengeCard />
        </div>
        <div className="md:col-span-1">
          <TodayExecutionCard />
        </div>
      </div>

      {/* Day-by-Day Execution History: Clickable past days and what was completed vs missed */}
      <DayHistoryCard />

      {/* 4 Consistency Statistics from real data */}
      <ConsistencyStats />

      {/* Priority 01, 02, 03 Cards */}
      <PriorityGoalCards />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}
