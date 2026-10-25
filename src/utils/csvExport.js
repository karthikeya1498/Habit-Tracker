import { generateChallengeDays, formatDisplayDate } from './dateUtils';
import { getDailyCompletion } from './statsUtils';

/**
 * Generates and downloads a CSV of the 90-day transformation journey
 */
export function exportJourneyToCSV(habits, records, journal, startDateKey, durationDays = 90) {
  const days = generateChallengeDays(startDateKey, durationDays);

  const headers = [
    'Challenge Day',
    'Date',
    'Status',
    'Completion Rate (%)',
    'Completed Habits Count',
    'Total Scheduled Habits',
    'Completed Habit Names',
    'Missed Habit Names',
    'Daily Coding (min)',
    'Journal Entry Length',
    'Journal Excerpt'
  ];

  const rows = days.map(d => {
    const stat = getDailyCompletion(d.dateKey, habits, records);

    let status = 'Future';
    if (d.isToday) status = 'Today';
    else if (d.isPast) {
      if (stat.isPerfect) status = 'Completed (100%)';
      else if (stat.completedCount > 0) status = 'In Progress';
      else status = 'Missed';
    }

    const completedNames = [];
    const missedNames = [];
    let codingMinutes = 0;

    habits.forEach(h => {
      const rec = records[`${h.id}_${d.dateKey}`];
      if (rec && rec.completed) {
        completedNames.push(h.name);
      } else {
        missedNames.push(h.name);
      }
      if (h.id === 'habit_coding' && rec) {
        codingMinutes = rec.actualValue || (rec.completed ? 180 : 0);
      }
    });

    const journalEntry = journal[d.dateKey];
    const journalLength = journalEntry && journalEntry.content ? journalEntry.content.length : 0;
    const journalExcerpt = journalEntry && journalEntry.content
      ? journalEntry.content.slice(0, 100).replace(/(\r\n|\n|\r|"|,)/gm, ' ')
      : '';

    return [
      `Day ${d.dayNumber}`,
      d.dateKey,
      status,
      `${stat.percentage}%`,
      stat.completedCount,
      stat.totalCount,
      `"${completedNames.join('; ')}"`,
      `"${missedNames.join('; ')}"`,
      codingMinutes,
      journalLength,
      `"${journalExcerpt}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OBSESSION_90_Day_Journey_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
