import { format, addDays, differenceInCalendarDays, isValid, startOfWeek, endOfWeek } from 'date-fns';

/**
 * Parses YYYY-MM-DD string into a local Date object without UTC drift
 */
export function parseDateKey(dateKey) {
  if (!dateKey || typeof dateKey !== 'string') return new Date();
  const parts = dateKey.split('-');
  if (parts.length !== 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const date = new Date(year, month, day);
  return isValid(date) ? date : new Date();
}

/**
 * Returns date in YYYY-MM-DD local calendar format
 */
export function formatDateKey(date) {
  if (!date) return format(new Date(), 'yyyy-MM-dd');
  const d = typeof date === 'string' ? parseDateKey(date) : date;
  return format(d, 'yyyy-MM-dd');
}

/**
 * Returns today in YYYY-MM-DD
 */
export function getTodayKey() {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Adds or subtracts days from a YYYY-MM-DD string
 */
export function addDaysToDateKey(dateKey, amount) {
  const d = parseDateKey(dateKey);
  const result = addDays(d, amount);
  return formatDateKey(result);
}

/**
 * Formats a dateKey into a readable string
 */
export function formatDisplayDate(dateKey, pattern = 'EEEE, MMM d, yyyy') {
  try {
    const d = parseDateKey(dateKey);
    return format(d, pattern);
  } catch {
    return dateKey;
  }
}

/**
 * Calculate challenge day and status from start date and duration
 */
export function getChallengeStatus(startDateKey, durationDays = 90) {
  const todayKey = getTodayKey();
  const startDate = parseDateKey(startDateKey);
  const todayDate = parseDateKey(todayKey);

  const diffDays = differenceInCalendarDays(todayDate, startDate);
  const currentDay = diffDays + 1; // 1-indexed

  if (diffDays < 0) {
    return {
      status: 'not_started',
      currentDay: 0,
      daysCompleted: 0,
      daysRemaining: durationDays,
      percentComplete: 0,
      startDateKey,
      endDateKey: formatDateKey(addDays(startDate, durationDays - 1)),
      daysUntilStart: Math.abs(diffDays)
    };
  }

  if (currentDay > durationDays) {
    return {
      status: 'completed',
      currentDay: durationDays,
      daysCompleted: durationDays,
      daysRemaining: 0,
      percentComplete: 100,
      startDateKey,
      endDateKey: formatDateKey(addDays(startDate, durationDays - 1)),
      daysSinceEnd: currentDay - durationDays
    };
  }

  const daysCompleted = currentDay - 1;
  const daysRemaining = durationDays - currentDay;
  const percentComplete = Math.min(100, Math.round(((currentDay - 1) / durationDays) * 100));

  return {
    status: 'active',
    currentDay,
    daysCompleted,
    daysRemaining,
    percentComplete,
    startDateKey,
    endDateKey: formatDateKey(addDays(startDate, durationDays - 1))
  };
}

/**
 * Generate all 90 days of the challenge with metadata
 */
export function generateChallengeDays(startDateKey, durationDays = 90) {
  const todayKey = getTodayKey();
  const startDate = parseDateKey(startDateKey);
  const days = [];

  for (let i = 0; i < durationDays; i++) {
    const d = addDays(startDate, i);
    const dateKey = formatDateKey(d);
    const dayNumber = i + 1;
    const isToday = dateKey === todayKey;
    const isPast = dateKey < todayKey;
    const isFuture = dateKey > todayKey;

    days.push({
      dayNumber,
      dateKey,
      isToday,
      isPast,
      isFuture,
      weekNumber: Math.floor(i / 7) + 1
    });
  }

  return days;
}

/**
 * Generate weekly breakdown chunks
 */
export function generateChallengeWeeks(startDateKey, durationDays = 90) {
  const days = generateChallengeDays(startDateKey, durationDays);
  const weeks = [];
  const totalWeeks = Math.ceil(durationDays / 7);

  for (let w = 1; w <= totalWeeks; w++) {
    const weekDays = days.filter(d => d.weekNumber === w);
    if (weekDays.length === 0) continue;
    const startDate = weekDays[0].dateKey;
    const endDate = weekDays[weekDays.length - 1].dateKey;

    weeks.push({
      weekNumber: w,
      startDate,
      endDate,
      days: weekDays,
      isFinalWeek: w === totalWeeks
    });
  }

  return weeks;
}
