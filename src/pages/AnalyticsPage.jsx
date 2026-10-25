import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  getDailyTrendData,
  getWeeklyConsistencyData,
  getCategoryPerformance,
  getHabitHeatmapData,
  calculateStreaks,
  generatePersonalInsights
} from '../utils/statsUtils';
import { Card, Button, Badge } from '../components/common/UIElements';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Trophy,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export function AnalyticsPage() {
  const { habits, records, settings } = useApp();
  const [trendRange, setTrendRange] = useState('30d'); // '7d' | '30d' | 'all'

  // Data calculations
  const trendData = getDailyTrendData(habits, records, settings.startDate, trendRange, settings.durationDays);
  const weeklyData = getWeeklyConsistencyData(habits, records, settings.startDate, settings.durationDays);
  const categoryStats = getCategoryPerformance(habits, records, settings.startDate, 30);
  const heatmapData = getHabitHeatmapData(habits, records, settings.startDate, settings.durationDays);
  const streaks = calculateStreaks(habits, records, settings.startDate);
  const insights = generatePersonalInsights(habits, records, settings.startDate);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 bg-surface-card border border-surface-border rounded-lg shadow-modal text-xs font-mono">
          <p className="font-bold text-content-main">{data.dateKey || data.weekLabel || label}</p>
          <p className="text-content-secondary mt-0.5">
            Completion: <strong className="text-content-main">{payload[0].value}%</strong>
          </p>
          {data.completed !== undefined && data.total !== undefined && (
            <p className="text-[11px] text-content-muted">
              {data.completed} / {data.total} habits fulfilled
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
            Performance Analytics
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Honest visual metrics calculated directly from your actual tracking logs.
          </p>
        </div>
      </div>

      {/* Streak Analysis Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
              Current Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-content-main">
            {streaks.currentStreak} {streaks.currentStreak === 1 ? 'day' : 'days'}
          </div>
          <p className="text-[11px] text-content-secondary">
            Consecutive active days
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
              Best Active Streak
            </span>
            <Trophy className="w-4 h-4 text-content-main" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-content-main">
            {streaks.bestStreak} {streaks.bestStreak === 1 ? 'day' : 'days'}
          </div>
          <p className="text-[11px] text-content-secondary">
            Personal all-time record
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
              Active Days
            </span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-content-main">
            {streaks.activeDaysCount} days
          </div>
          <p className="text-[11px] text-content-secondary">
            At least 1 habit fulfilled
          </p>
        </Card>

        <Card className="p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-content-muted">
              Perfect 100% Days
            </span>
            <CheckCircle2 className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-content-main">
            {streaks.perfectDaysCount} days
          </div>
          <p className="text-[11px] text-content-secondary">
            All scheduled habits completed
          </p>
        </Card>
      </div>

      {/* Daily Completion Trend Line Chart */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              Daily Completion Trend (%)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Daily percentage of completed habits over time
            </p>
          </div>

          <div className="flex items-center gap-1 bg-surface-hover/60 p-1 rounded-lg border border-surface-border text-xs">
            {[
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'all', label: 'All 90 Days' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTrendRange(t.id)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-colors ${
                  trendRange === t.id
                    ? 'bg-surface-card text-content-main shadow-subtle font-bold'
                    : 'text-content-secondary hover:text-content-main'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" />
              <XAxis
                dataKey="label"
                stroke="var(--text-muted)"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--text-muted)"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="completionRate"
                stroke="var(--text-main)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--text-main)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grid: Weekly Consistency Bar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Consistency */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              Weekly Consistency (Weeks 1 – 13)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Habit completion rate across each 7-day sprint
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.15)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="var(--text-muted)"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  tickLine={false}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isActive ? 'var(--text-main)' : 'rgba(150, 150, 150, 0.25)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              Pillar Consistency (Last 30 Days)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Comparison across the three core transformation pillars
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {Object.values(categoryStats).map((cat) => (
              <div key={cat.id} className="space-y-1.5 p-3 rounded-xl bg-surface-hover/30 border border-surface-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-content-main">{cat.name}</span>
                  <span className="font-mono font-bold text-content-main">{cat.rate}%</span>
                </div>
                <div className="w-full bg-surface-hover h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-content-main h-full rounded-full transition-all duration-300"
                    style={{ width: `${cat.rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-content-muted">
                  <span>{cat.completed} completed sessions</span>
                  <span>{cat.total} total scheduled</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* GitHub-Style 90-Day Heatmap */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              90-Day Execution Heatmap
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Visual intensity map. Darker cells indicate higher daily execution.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono text-content-secondary">
            <span>Less</span>
            <span className="w-3 h-3 rounded bg-surface-hover border border-surface-border" />
            <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800" />
            <span className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-800 border border-emerald-400 dark:border-emerald-700" />
            <span className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500" />
            <span className="w-3 h-3 rounded bg-emerald-700 dark:bg-emerald-400 border border-emerald-800 dark:border-emerald-300" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[640px]">
            {heatmapData.map((cell) => {
              let cellBg = 'bg-surface-hover/40 border-surface-border';

              if (cell.isFuture) {
                cellBg = 'bg-surface-hover/20 border-surface-border/50 opacity-40';
              } else if (cell.intensity === 4) {
                cellBg = 'bg-emerald-700 dark:bg-emerald-400 border-emerald-800 dark:border-emerald-300';
              } else if (cell.intensity === 3) {
                cellBg = 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500';
              } else if (cell.intensity === 2) {
                cellBg = 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400 dark:border-emerald-700';
              } else if (cell.intensity === 1) {
                cellBg = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
              } else if (cell.status === 'missed') {
                cellBg = 'bg-status-missed-bg border-status-missed-border';
              }

              return (
                <div
                  key={cell.dayNumber}
                  title={`Day ${cell.dayNumber} (${cell.dateKey}): ${cell.percentage}% (${cell.completedCount}/${cell.totalCount} habits)`}
                  className={`w-3.5 h-3.5 rounded-[3px] border transition-transform hover:scale-125 cursor-pointer ${cellBg}`}
                />
              );
            })}
          </div>
        </div>
      </Card>

      {/* Dynamic Rule-Based Personal Insights */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-content-main" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
            Personal Transformation Insights
          </h3>
        </div>

        {insights.length === 0 ? (
          <p className="text-xs text-content-secondary italic">
            Complete a few days of tracking to unlock personalized algorithmic insights.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {insights.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-surface-hover/40 border border-surface-border rounded-xl space-y-1"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-content-main font-mono">
                  <Info className="w-3.5 h-3.5 text-content-secondary" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-content-secondary leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
