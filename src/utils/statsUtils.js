import {
  getTodayKey,
  addDaysToDateKey,
  parseDateKey,
  generateChallengeDays,
  isHabitScheduledForDate
} from './dateUtils';
import { differenceInCalendarDays, subDays, startOfWeek, endOfWeek } from 'date-fns';

/**
 * Calculates habit execution summary for a specific date
 */
export function getDailyCompletion(dateKey, habits, records) {
  if (!habits || habits.length === 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0, isPerfect: false, hasActivity: false };
  }

  // Active habits scheduled for this specific date (e.g. daily habits, plus weekend deep-dives on Sat/Sun)
  const activeHabits = habits.filter(h => (!h.archivedAt || h.archivedAt > dateKey) && isHabitScheduledForDate(h, dateKey));
  const totalCount = activeHabits.length;

  if (totalCount === 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0, isPerfect: false, hasActivity: false };
  }

  let completedCount = 0;
  activeHabits.forEach(habit => {
    const key = `${habit.id}_${dateKey}`;
    const rec = records[key];
    if (rec && rec.completed) {
      completedCount++;
    }
  });

  const percentage = Math.round((completedCount / totalCount) * 100);
  const isPerfect = completedCount === totalCount;
  const hasActivity = completedCount > 0;

  return {
    completedCount,
    totalCount,
    percentage,
    isPerfect,
    hasActivity,
    dateKey,
  };
}

/**
 * Calculates current streak, best streak, active days, and perfect days
 */
export function calculateStreaks(habits, records, startDateKey) {
  const todayKey = getTodayKey();
  const startDate = parseDateKey(startDateKey);
  const todayDate = parseDateKey(todayKey);

  // If challenge hasn't started yet
  if (todayDate < startDate) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      currentPerfectStreak: 0,
      bestPerfectStreak: 0,
      activeDaysCount: 0,
      perfectDaysCount: 0,
    };
  }

  const daysElapsed = Math.max(1, differenceInCalendarDays(todayDate, startDate) + 1);
  const dayStats = [];

  for (let i = 0; i < daysElapsed; i++) {
    const dKey = addDaysToDateKey(startDateKey, i);
    const stat = getDailyCompletion(dKey, habits, records);
    dayStats.push({ dateKey: dKey, ...stat });
  }

  let activeDaysCount = 0;
  let perfectDaysCount = 0;

  let currentActiveStreak = 0;
  let bestActiveStreak = 0;
  let tempActiveStreak = 0;

  let currentPerfectStreak = 0;
  let bestPerfectStreak = 0;
  let tempPerfectStreak = 0;

  // Walk forward to calculate best streaks and total counts
  for (let i = 0; i < dayStats.length; i++) {
    const day = dayStats[i];
    if (day.hasActivity) {
      activeDaysCount++;
      tempActiveStreak++;
      if (tempActiveStreak > bestActiveStreak) {
        bestActiveStreak = tempActiveStreak;
      }
    } else {
      tempActiveStreak = 0;
    }

    if (day.isPerfect) {
      perfectDaysCount++;
      tempPerfectStreak++;
      if (tempPerfectStreak > bestPerfectStreak) {
        bestPerfectStreak = tempPerfectStreak;
      }
    } else {
      tempPerfectStreak = 0;
    }
  }

  // Calculate current streak walking backwards from today
  // If today has activity, include today; if today hasn't had activity yet, check yesterday
  const todayStat = dayStats[dayStats.length - 1];
  let startIndex = dayStats.length - 1;

  if (!todayStat.hasActivity) {
    // If today hasn't been completed yet, streak might still be alive from yesterday
    startIndex = dayStats.length - 2;
  }

  for (let i = startIndex; i >= 0; i--) {
    if (dayStats[i].hasActivity) {
      currentActiveStreak++;
    } else {
      break;
    }
  }

  // Current perfect streak
  let perfectStartIndex = dayStats.length - 1;
  if (!todayStat.isPerfect) {
    perfectStartIndex = dayStats.length - 2;
  }
  for (let i = perfectStartIndex; i >= 0; i--) {
    if (dayStats[i].isPerfect) {
      currentPerfectStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak: currentActiveStreak,
    bestStreak: Math.max(bestActiveStreak, currentActiveStreak),
    currentPerfectStreak,
    bestPerfectStreak: Math.max(bestPerfectStreak, currentPerfectStreak),
    activeDaysCount,
    perfectDaysCount,
  };
}

/**
 * Calculates number of habits completed in current calendar week
 */
export function getHabitsCompletedThisWeek(habits, records) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  let completedThisWeek = 0;
  let totalScheduledThisWeek = 0;

  for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
    const dKey = addDaysToDateKey(getTodayKey(), differenceInCalendarDays(d, now));
    const activeHabits = habits.filter(h => (!h.archivedAt || h.archivedAt > dKey) && isHabitScheduledForDate(h, dKey));
    activeHabits.forEach(h => {
      totalScheduledThisWeek++;
      const rec = records[`${h.id}_${dKey}`];
      if (rec && rec.completed) {
        completedThisWeek++;
      }
    });
  }

  return {
    completed: completedThisWeek,
    total: totalScheduledThisWeek,
    rate: totalScheduledThisWeek > 0 ? Math.round((completedThisWeek / totalScheduledThisWeek) * 100) : 0
  };
}

/**
 * Calculates overall completion rate across all challenge days so far
 */
export function getOverallCompletionRate(habits, records, startDateKey) {
  const todayKey = getTodayKey();
  const startDate = parseDateKey(startDateKey);
  const todayDate = parseDateKey(todayKey);

  if (todayDate < startDate) return 0;

  const daysElapsed = Math.max(1, differenceInCalendarDays(todayDate, startDate) + 1);
  let totalPossible = 0;
  let totalCompleted = 0;

  for (let i = 0; i < daysElapsed; i++) {
    const dKey = addDaysToDateKey(startDateKey, i);
    const stat = getDailyCompletion(dKey, habits, records);
    totalPossible += stat.totalCount;
    totalCompleted += stat.completedCount;
  }

  return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
}

/**
 * Calculates category-level completion rates
 */
export function getCategoryPerformance(habits, records, startDateKey, rangeDays = 30) {
  const todayKey = getTodayKey();
  const startDate = parseDateKey(startDateKey);
  const todayDate = parseDateKey(todayKey);

  const daysCount = Math.min(rangeDays, Math.max(1, differenceInCalendarDays(todayDate, startDate) + 1));
  const categoryStats = {
    technical: { id: 'technical', name: 'Technical Mastery', completed: 0, total: 0, rate: 0, color: '#3B82F6' },
    communication: { id: 'communication', name: 'Communication & Confidence', completed: 0, total: 0, rate: 0, color: '#8B5CF6' },
    fitness: { id: 'fitness', name: 'Athletic Physique', completed: 0, total: 0, rate: 0, color: '#10B981' }
  };

  for (let i = daysCount - 1; i >= 0; i--) {
    const dKey = addDaysToDateKey(todayKey, -i);
    if (dKey < startDateKey) continue;

    habits.forEach(habit => {
      if (!isHabitScheduledForDate(habit, dKey)) return;
      const cat = categoryStats[habit.categoryId];
      if (cat) {
        cat.total++;
        const rec = records[`${habit.id}_${dKey}`];
        if (rec && rec.completed) {
          cat.completed++;
        }
      }
    });
  }

  Object.values(categoryStats).forEach(cat => {
    cat.rate = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
  });

  return categoryStats;
}

/**
 * Returns daily trend points for Recharts line chart
 * Range: '7d' | '30d' | 'all'
 */
export function getDailyTrendData(habits, records, startDateKey, range = '30d', durationDays = 90) {
  const todayKey = getTodayKey();
  let daysToShow = 30;

  if (range === '7d') daysToShow = 7;
  else if (range === 'all') daysToShow = durationDays;

  const data = [];
  for (let i = daysToShow - 1; i >= 0; i--) {
    const dateKey = addDaysToDateKey(todayKey, -i);
    const dayStat = getDailyCompletion(dateKey, habits, records);
    const parts = dateKey.split('-');
    const label = `${parts[1]}/${parts[2]}`;

    data.push({
      dateKey,
      label,
      completionRate: dayStat.percentage,
      completed: dayStat.completedCount,
      total: dayStat.totalCount,
      isToday: dateKey === todayKey,
    });
  }

  return data;
}

/**
 * Returns weekly completion data for Recharts bar chart
 */
export function getWeeklyConsistencyData(habits, records, startDateKey, durationDays = 90) {
  const totalWeeks = Math.ceil(durationDays / 7);
  const data = [];
  const todayKey = getTodayKey();

  for (let w = 1; w <= totalWeeks; w++) {
    const weekStartDay = (w - 1) * 7;
    let completedCount = 0;
    let totalPossible = 0;
    let daysInWeekCount = 0;
    let weekActive = false;

    for (let d = 0; d < 7; d++) {
      const dayIndex = weekStartDay + d;
      if (dayIndex >= durationDays) break;
      const dateKey = addDaysToDateKey(startDateKey, dayIndex);
      daysInWeekCount++;

      if (dateKey <= todayKey) {
        weekActive = true;
        const stat = getDailyCompletion(dateKey, habits, records);
        completedCount += stat.completedCount;
        totalPossible += stat.totalCount;
      }
    }

    const rate = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

    data.push({
      weekNumber: w,
      label: `W${w}`,
      weekLabel: `Week ${w}`,
      rate,
      completed: completedCount,
      total: totalPossible,
      isActive: weekActive,
    });
  }

  return data;
}

/**
 * Generates data for GitHub-style 90-day heatmap
 */
export function getHabitHeatmapData(habits, records, startDateKey, durationDays = 90) {
  const days = generateChallengeDays(startDateKey, durationDays);

  return days.map(d => {
    const stat = getDailyCompletion(d.dateKey, habits, records);

    let status = 'future';
    let intensity = 0; // 0 to 4

    if (d.isFuture) {
      status = 'future';
      intensity = 0;
    } else if (stat.completedCount === 0 && d.isPast) {
      status = 'missed';
      intensity = 0;
    } else if (stat.isPerfect) {
      status = 'completed';
      intensity = 4;
    } else if (stat.percentage >= 70) {
      status = 'in_progress';
      intensity = 3;
    } else if (stat.percentage >= 40) {
      status = 'in_progress';
      intensity = 2;
    } else if (stat.percentage > 0) {
      status = 'in_progress';
      intensity = 1;
    } else {
      status = 'not_started';
      intensity = 0;
    }

    return {
      ...d,
      ...stat,
      status,
      intensity,
    };
  });
}

/**
 * Generates honest, rule-based personal insights from real data
 */
export function generatePersonalInsights(habits, records, startDateKey) {
  const insights = [];
  const todayKey = getTodayKey();
  const overallRate = getOverallCompletionRate(habits, records, startDateKey);
  const streaks = calculateStreaks(habits, records, startDateKey);
  const categories = getCategoryPerformance(habits, records, startDateKey, 14);

  // 1. Identify strongest habit over past 14 days
  let strongestHabit = null;
  let highestHabitRate = -1;

  habits.forEach(habit => {
    let completed = 0;
    let days = 0;
    for (let i = 0; i < 14; i++) {
      const dKey = addDaysToDateKey(todayKey, -i);
      if (dKey < startDateKey) continue;
      days++;
      const rec = records[`${habit.id}_${dKey}`];
      if (rec && rec.completed) completed++;
    }
    const rate = days > 0 ? completed / days : 0;
    if (rate > highestHabitRate) {
      highestHabitRate = rate;
      strongestHabit = habit;
    }
  });

  if (strongestHabit && highestHabitRate > 0) {
    const pct = Math.round(highestHabitRate * 100);
    insights.push({
      type: 'strength',
      title: 'Strongest Anchor Habit',
      message: `Your most consistent habit over the last 14 days is "${strongestHabit.name}" with a ${pct}% completion rate. This anchor habit keeps momentum alive.`,
    });
  }

  // 2. Category comparison
  const catList = Object.values(categories).filter(c => c.total > 0).sort((a, b) => b.rate - a.rate);
  if (catList.length >= 2) {
    const leader = catList[0];
    const trailing = catList[catList.length - 1];
    if (leader.rate - trailing.rate > 15) {
      insights.push({
        type: 'balance',
        title: 'Priority Alignment',
        message: `${leader.name} leads at ${leader.rate}% execution, while ${trailing.name} is at ${trailing.rate}%. Focus on bridging this gap to maintain all three pillars.`,
      });
    } else {
      insights.push({
        type: 'balance',
        title: 'Balanced Pillars',
        message: `Your execution across Technical, Communication, and Athletic goals is remarkably well-balanced within a ${leader.rate - trailing.rate}% margin.`,
      });
    }
  }

  // 3. Streak reflection
  if (streaks.currentStreak >= 7) {
    insights.push({
      type: 'momentum',
      title: 'Compounding Streak',
      message: `You've maintained an active streak of ${streaks.currentStreak} days. You are past the initial resistance phase; focus on frictionless daily execution.`,
    });
  } else if (streaks.currentStreak > 0) {
    insights.push({
      type: 'momentum',
      title: 'Active Momentum',
      message: `Currently on a ${streaks.currentStreak}-day execution run. Remember: "Discipline over motivation. Never negotiate with your goals."`,
    });
  } else {
    insights.push({
      type: 'action',
      title: 'Fresh Opportunity',
      message: `Today is an open canvas. Complete your primary 3-hour coding session or daily workout to initiate your next streak.`,
    });
  }

  // 4. Overall milestone progress
  if (overallRate >= 80) {
    insights.push({
      type: 'elite',
      title: 'High-Integrity Performance',
      message: `Your overall challenge completion rate is ${overallRate}%. This puts you in the top tier of consistency for personal transformations.`,
    });
  }

  return insights;
}
