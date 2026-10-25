import { DEFAULT_HABITS, DEFAULT_GOALS, getDefaultSettings } from '../utils/defaultData';
import { getTodayKey, addDaysToDateKey } from '../utils/dateUtils';

const KEYS = {
  HABITS: 'obsession_habits_v1',
  RECORDS: 'obsession_records_v1',
  GOALS: 'obsession_goals_v1',
  JOURNAL: 'obsession_journal_v1',
  SETTINGS: 'obsession_settings_v1',
  WEEKLY_NOTES: 'obsession_weekly_notes_v1',
};

// Safe JSON parser
function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (err) {
    console.error('Storage parse error:', err);
    return fallback;
  }
}

export const StorageService = {
  getSettings() {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    const parsed = safeParse(raw, null);
    if (!parsed) {
      const defaults = getDefaultSettings();
      this.saveSettings(defaults);
      return defaults;
    }
    return { ...getDefaultSettings(), ...parsed };
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getHabits() {
    const raw = localStorage.getItem(KEYS.HABITS);
    const parsed = safeParse(raw, null);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      this.saveHabits(DEFAULT_HABITS);
      return DEFAULT_HABITS;
    }
    return parsed;
  },

  saveHabits(habits) {
    try {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits:', e);
    }
  },

  getGoals() {
    const raw = localStorage.getItem(KEYS.GOALS);
    const parsed = safeParse(raw, null);
    if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
      this.saveGoals(DEFAULT_GOALS);
      return DEFAULT_GOALS;
    }
    return parsed;
  },

  saveGoals(goals) {
    try {
      localStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals:', e);
    }
  },

  /**
   * Records are stored as an object with key `${habitId}_${dateKey}`:
   * {
   *   habitId: string,
   *   dateKey: string (YYYY-MM-DD),
   *   completed: boolean,
   *   actualValue: number,
   *   note?: string,
   *   words?: Array<{ word: string, meaning: string, example: string }>,
   *   updatedAt: string
   * }
   */
  getRecords() {
    const raw = localStorage.getItem(KEYS.RECORDS);
    return safeParse(raw, {});
  },

  saveRecords(records) {
    try {
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save records:', e);
    }
  },

  saveRecord(habitId, dateKey, recordData) {
    const records = this.getRecords();
    const key = `${habitId}_${dateKey}`;
    records[key] = {
      habitId,
      dateKey,
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    this.saveRecords(records);
    return records;
  },

  /**
   * Journal entries:
   * Keyed by dateKey:
   * {
   *   [dateKey]: {
   *     id: string,
   *     dateKey: string,
   *     content: string,
   *     tags: string[],
   *     updatedAt: string
   *   }
   * }
   */
  getJournal() {
    const raw = localStorage.getItem(KEYS.JOURNAL);
    return safeParse(raw, {});
  },

  saveJournal(journal) {
    try {
      localStorage.setItem(KEYS.JOURNAL, JSON.stringify(journal));
    } catch (e) {
      console.error('Failed to save journal:', e);
    }
  },

  saveJournalEntry(dateKey, entry) {
    const journal = this.getJournal();
    journal[dateKey] = {
      id: entry.id || `journal_${dateKey}`,
      dateKey,
      content: entry.content || '',
      tags: entry.tags || [],
      updatedAt: new Date().toISOString()
    };
    this.saveJournal(journal);
    return journal;
  },

  getWeeklyNotes() {
    const raw = localStorage.getItem(KEYS.WEEKLY_NOTES);
    return safeParse(raw, {});
  },

  saveWeeklyNotes(notes) {
    try {
      localStorage.setItem(KEYS.WEEKLY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save weekly notes:', e);
    }
  },

  saveWeeklyReflection(weekNumber, text) {
    const notes = this.getWeeklyNotes();
    notes[weekNumber] = {
      weekNumber,
      reflection: text,
      updatedAt: new Date().toISOString()
    };
    this.saveWeeklyNotes(notes);
    return notes;
  },

  // Export full JSON bundle
  exportAllData() {
    const data = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'OBSESSION',
      settings: this.getSettings(),
      habits: this.getHabits(),
      goals: this.getGoals(),
      records: this.getRecords(),
      journal: this.getJournal(),
      weeklyNotes: this.getWeeklyNotes(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import and validate JSON
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid backup file: Not a valid JSON object.' };
      }

      if (!Array.isArray(data.habits)) {
        return { success: false, error: 'Invalid backup: missing habits array.' };
      }

      if (data.records && typeof data.records !== 'object') {
        return { success: false, error: 'Invalid backup: invalid records format.' };
      }

      // Safe restore
      if (data.settings) this.saveSettings(data.settings);
      if (data.habits) this.saveHabits(data.habits);
      if (data.goals) this.saveGoals(data.goals);
      if (data.records) this.saveRecords(data.records);
      if (data.journal) this.saveJournal(data.journal);
      if (data.weeklyNotes) this.saveWeeklyNotes(data.weeklyNotes);

      return {
        success: true,
        summary: {
          habits: data.habits ? data.habits.length : 0,
          records: data.records ? Object.keys(data.records).length : 0,
          journalEntries: data.journal ? Object.keys(data.journal).length : 0,
        }
      };
    } catch (err) {
      return { success: false, error: `Import failed: ${err.message}` };
    }
  },

  // Reset challenge starting date, keep habits
  resetChallenge(newStartDateKey = getTodayKey()) {
    const settings = this.getSettings();
    settings.startDate = newStartDateKey;
    this.saveSettings(settings);
  },

  // Complete reset to defaults
  resetAll() {
    localStorage.removeItem(KEYS.HABITS);
    localStorage.removeItem(KEYS.RECORDS);
    localStorage.removeItem(KEYS.GOALS);
    localStorage.removeItem(KEYS.JOURNAL);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.WEEKLY_NOTES);
  },

  // Generates realistic sample data for previous days to allow immediate testing of streaks and charts
  loadSampleData() {
    const today = getTodayKey();
    const startDate = addDaysToDateKey(today, -13); // Start 14 days ago (Day 14)
    const settings = {
      ...this.getSettings(),
      startDate,
      durationDays: 90
    };
    this.saveSettings(settings);

    const habits = DEFAULT_HABITS;
    this.saveHabits(habits);

    const records = {};
    const journal = {};

    // Populate the past 14 days with realistic high-discipline performance
    for (let i = 0; i < 14; i++) {
      const dateKey = addDaysToDateKey(startDate, i);
      const isWeekend = i % 7 === 5 || i % 7 === 6;
      const isPast = dateKey < today;

      habits.forEach((habit) => {
        const key = `${habit.id}_${dateKey}`;
        let completed = true;
        let actualValue = habit.targetValue;
        let note = '';

        // Occasional realistic variance
        if (i === 3 && habit.id === 'habit_sysdesign') {
          completed = false;
          actualValue = 10;
        } else if (i === 8 && habit.id === 'habit_workout') {
          completed = false;
          actualValue = 0;
          note = 'Scheduled rest & active stretching';
        } else if (habit.id === 'habit_coding') {
          actualValue = isWeekend ? 210 : 180;
          completed = true;
          note = isWeekend ? 'Built React custom hook & algorithms' : 'Worked on Core backend features';
        } else if (habit.id === 'habit_vocab') {
          actualValue = 5;
          completed = true;
        } else if (habit.id === 'habit_hydration') {
          actualValue = 3200;
          completed = true;
        }

        records[key] = {
          habitId: habit.id,
          dateKey,
          completed,
          actualValue,
          note,
          updatedAt: new Date().toISOString()
        };
      });

      // Add a couple of realistic journal entries
      if (i === 7 || i === 12 || i === 13) {
        journal[dateKey] = {
          id: `journal_${dateKey}`,
          dateKey,
          content: `### 1. Accomplishments\n- Completed deep work 3-hour coding block without phone distractions.\n- Shadowed 20 minutes of Lex Fridman podcast.\n- Finished heavy compound lifting session.\n\n### 2. Learnings\n- Understanding memory caches and LRU eviction policy.\n- Keeping vocal cadence steady conveys confidence.\n\n### 3. Tomorrow's Focus\n- Push to Day ${i + 2} with 100% execution.`,
          tags: ['coding', 'discipline', 'fitness'],
          updatedAt: new Date().toISOString()
        };
      }
    }

    this.saveRecords(records);
    this.saveJournal(journal);

    return { settings, habits, records, journal };
  }
};
