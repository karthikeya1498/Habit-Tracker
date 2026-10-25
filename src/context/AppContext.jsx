import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { getTodayKey, getChallengeStatus, isHabitScheduledForDate } from '../utils/dateUtils';
import { MOTIVATIONAL_QUOTES } from '../utils/defaultData';
import { exportJourneyToCSV } from '../utils/csvExport';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [settings, setSettingsState] = useState(() => StorageService.getSettings());
  const [habits, setHabitsState] = useState(() => StorageService.getHabits());
  const [goals, setGoalsState] = useState(() => StorageService.getGoals());
  const [records, setRecordsState] = useState(() => StorageService.getRecords());
  const [journal, setJournalState] = useState(() => StorageService.getJournal());
  const [weeklyNotes, setWeeklyNotesState] = useState(() => StorageService.getWeeklyNotes());

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(getTodayKey());
  const [toasts, setToasts] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Apply dark mode theme class to html root
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // system
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(settings.theme);

    const listener = (e) => {
      if (settings.theme === 'system') {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings.theme]);

  // Toast notification helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, type: 'success', ...toast };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Motivational quote rotator
  const refreshMotivationalQuote = useCallback(() => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  }, []);

  // Update Settings
  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettingsState(merged);
    StorageService.saveSettings(merged);
    addToast({ title: 'Settings saved', message: 'Preferences updated successfully.' });
  }, [settings, addToast]);

  // Toggle habit completed for a specific date
  const toggleHabitComplete = useCallback((habitId, dateKey = selectedDate) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const recordKey = `${habitId}_${dateKey}`;
    const existing = records[recordKey] || { completed: false, actualValue: 0, note: '' };
    const willBeCompleted = !existing.completed;

    let targetValue = habit.targetValue || 1;
    let actualValue = willBeCompleted ? targetValue : 0;

    const updated = StorageService.saveRecord(habitId, dateKey, {
      completed: willBeCompleted,
      actualValue,
      note: existing.note || '',
      words: existing.words || []
    });

    setRecordsState({ ...updated });

    if (willBeCompleted) {
      addToast({
        title: 'Habit completed',
        message: `${habit.name} recorded for ${dateKey === getTodayKey() ? 'today' : dateKey}.`,
        type: 'success'
      });
    }
  }, [habits, records, selectedDate, addToast]);

  // Update measurable habit progress
  const updateHabitProgress = useCallback((habitId, dateKey, actualValue, completed, note = '', words = []) => {
    const habit = habits.find(h => h.id === habitId);
    const numericVal = Number(actualValue) || 0;
    const isCompleted = completed !== undefined ? completed : numericVal >= (habit?.targetValue || 1);

    const updated = StorageService.saveRecord(habitId, dateKey, {
      completed: isCompleted,
      actualValue: numericVal,
      note,
      words
    });

    setRecordsState({ ...updated });

    addToast({
      title: 'Progress saved',
      message: `${habit?.name || 'Habit'}: ${numericVal} ${habit?.unit || ''} logged.`,
      type: 'success'
    });
  }, [habits, addToast]);

  // Complete all habits today with confirmation
  const completeAllHabitsToday = useCallback(() => {
    const today = getTodayKey();
    const updatedRecords = { ...records };

    habits.forEach(habit => {
      if (habit.archivedAt) return;
      if (!isHabitScheduledForDate(habit, today)) return;
      const key = `${habit.id}_${today}`;
      const existing = updatedRecords[key] || {};
      updatedRecords[key] = {
        habitId: habit.id,
        dateKey: today,
        completed: true,
        actualValue: habit.targetValue || 1,
        note: existing.note || '',
        words: existing.words || [],
        updatedAt: new Date().toISOString()
      };
    });

    StorageService.saveRecords(updatedRecords);
    setRecordsState(updatedRecords);
    addToast({
      title: "Today's Execution Complete",
      message: 'All scheduled habits for today marked as completed.',
      type: 'success'
    });
  }, [habits, records, addToast]);

  // Habit Management: Add, Edit, Archive, Delete, Reorder
  const addHabit = useCallback((newHabitData) => {
    const newHabit = {
      id: `habit_${Date.now()}`,
      name: newHabitData.name.trim(),
      description: newHabitData.description || '',
      categoryId: newHabitData.categoryId || 'technical',
      trackingType: newHabitData.trackingType || 'binary',
      schedule: newHabitData.schedule || 'daily',
      targetValue: Number(newHabitData.targetValue) || 1,
      unit: newHabitData.unit || (newHabitData.trackingType === 'duration' ? 'min' : 'session'),
      icon: newHabitData.icon || 'CheckCircle',
      sortOrder: habits.length + 1,
      createdAt: new Date().toISOString(),
    };

    const updated = [...habits, newHabit];
    setHabitsState(updated);
    StorageService.saveHabits(updated);
    addToast({ title: 'Habit created', message: `"${newHabit.name}" added to routine.` });
  }, [habits, addToast]);

  const editHabit = useCallback((habitId, updatedData) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          ...updatedData,
          schedule: updatedData.schedule || h.schedule || 'daily',
          targetValue: Number(updatedData.targetValue) || h.targetValue,
        };
      }
      return h;
    });

    setHabitsState(updated);
    StorageService.saveHabits(updated);
    addToast({ title: 'Habit updated', message: 'Habit details saved successfully.' });
  }, [habits, addToast]);

  const archiveHabit = useCallback((habitId) => {
    const updated = habits.map(h => {
      if (h.id === habitId) {
        return { ...h, archivedAt: h.archivedAt ? null : getTodayKey() };
      }
      return h;
    });
    setHabitsState(updated);
    StorageService.saveHabits(updated);
    addToast({ title: 'Habit archived', message: 'Habit moved to archive.' });
  }, [habits, addToast]);

  const deleteHabit = useCallback((habitId) => {
    const target = habits.find(h => h.id === habitId);
    const updated = habits.filter(h => h.id !== habitId);
    setHabitsState(updated);
    StorageService.saveHabits(updated);
    addToast({
      title: 'Habit deleted',
      message: `"${target?.name || 'Habit'}" was removed.`,
      type: 'warning'
    });
  }, [habits, addToast]);

  const reorderHabits = useCallback((newHabitsList) => {
    const indexed = newHabitsList.map((h, i) => ({ ...h, sortOrder: i + 1 }));
    setHabitsState(indexed);
    StorageService.saveHabits(indexed);
  }, []);

  // Goal updates
  const updateGoal = useCallback((goalId, updatedData) => {
    const updated = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, ...updatedData };
      }
      return g;
    });
    setGoalsState(updated);
    StorageService.saveGoals(updated);
    addToast({ title: 'Goal updated', message: 'Transformation objective updated.' });
  }, [goals, addToast]);

  // Journal management
  const saveJournalEntry = useCallback((dateKey, content, tags = []) => {
    const updated = StorageService.saveJournalEntry(dateKey, { content, tags });
    setJournalState({ ...updated });
  }, []);

  // Weekly reflection notes
  const saveWeeklyReflection = useCallback((weekNumber, reflection) => {
    const updated = StorageService.saveWeeklyReflection(weekNumber, reflection);
    setWeeklyNotesState({ ...updated });
    addToast({ title: 'Weekly review saved', message: `Reflection for Week ${weekNumber} saved.` });
  }, [addToast]);

  // Backup and restore
  const exportBackup = useCallback(() => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBSESSION_Backup_${getTodayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Backup exported', message: 'JSON backup file downloaded.' });
  }, [addToast]);

  const importBackup = useCallback((jsonStr) => {
    const res = StorageService.importData(jsonStr);
    if (res.success) {
      setSettingsState(StorageService.getSettings());
      setHabitsState(StorageService.getHabits());
      setGoalsState(StorageService.getGoals());
      setRecordsState(StorageService.getRecords());
      setJournalState(StorageService.getJournal());
      setWeeklyNotesState(StorageService.getWeeklyNotes());
      addToast({
        title: 'Import successful',
        message: `Restored ${res.summary.habits} habits, ${res.summary.records} records, ${res.summary.journalEntries} journal entries.`
      });
      return { success: true };
    } else {
      addToast({ title: 'Import failed', message: res.error, type: 'missed' });
      return { success: false, error: res.error };
    }
  }, [addToast]);

  const exportCSV = useCallback(() => {
    exportJourneyToCSV(habits, records, journal, settings.startDate, settings.durationDays);
    addToast({ title: 'CSV exported', message: '90-Day Journey spreadsheet downloaded.' });
  }, [habits, records, journal, settings, addToast]);

  // Reset challenge dates
  const resetChallenge = useCallback((newStartDate = '2026-10-26') => {
    StorageService.resetChallenge(newStartDate);
    setSettingsState(StorageService.getSettings());
    addToast({ title: 'Challenge reset', message: `90-Day challenge set to start on ${newStartDate}.` });
  }, [addToast]);

  // Complete reset to clean state
  const resetAllData = useCallback(() => {
    StorageService.resetAll();
    setSettingsState(StorageService.getSettings());
    setHabitsState(StorageService.getHabits());
    setGoalsState(StorageService.getGoals());
    setRecordsState(StorageService.getRecords());
    setJournalState(StorageService.getJournal());
    setWeeklyNotesState(StorageService.getWeeklyNotes());
    addToast({ title: 'Data reset', message: 'All local records restored to fresh initial state.', type: 'warning' });
  }, [addToast]);

  // Load realistic sample demo data
  const loadDemoData = useCallback(() => {
    const demo = StorageService.loadSampleData();
    setSettingsState(demo.settings);
    setHabitsState(demo.habits);
    setRecordsState(demo.records);
    setJournalState(demo.journal);
    addToast({
      title: 'Demo Data Loaded',
      message: 'Past 14 days populated with realistic habits, streaks, and journal logs.'
    });
  }, [addToast]);

  const challengeInfo = useMemo(() => {
    return getChallengeStatus(settings.startDate, settings.durationDays);
  }, [settings.startDate, settings.durationDays]);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex] || MOTIVATIONAL_QUOTES[0];

  const value = {
    settings,
    habits,
    goals,
    records,
    journal,
    weeklyNotes,
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    toasts,
    addToast,
    dismissToast,
    currentQuote,
    refreshMotivationalQuote,
    challengeInfo,
    // Operations
    toggleHabitComplete,
    updateHabitProgress,
    completeAllHabitsToday,
    addHabit,
    editHabit,
    archiveHabit,
    deleteHabit,
    reorderHabits,
    updateGoal,
    saveJournalEntry,
    saveWeeklyReflection,
    updateSettings,
    exportBackup,
    importBackup,
    exportCSV,
    resetChallenge,
    resetAllData,
    loadDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
