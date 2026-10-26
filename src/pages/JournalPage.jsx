import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatDisplayDate,
  addDaysToDateKey,
  parseDateKey
} from '../utils/dateUtils';
import { getDailyCompletion } from '../utils/statsUtils';
import { differenceInCalendarDays } from 'date-fns';
import { Card, Button } from '../components/common/UIElements';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Save,
  FileDown,
  Search,
  X,
  Sparkles,
  BookOpen,
  Edit3,
  Archive,
  Check
} from 'lucide-react';

const DEFAULT_PROMPTS = `### 1. What did I accomplish today?
- 

### 2. What did I learn?
- 

### 3. What did I avoid or procrastinate on?
- 

### 4. What made me uncomfortable, and how did I respond?
- 

### 5. What will I do better tomorrow?
- `;

export function JournalPage() {
  const {
    journal,
    saveJournalEntry,
    selectedDate,
    setSelectedDate,
    settings,
    habits,
    records,
    effectiveTodayKey,
    addToast
  } = useApp();

  const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'archive'
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');

  const isToday = selectedDate === effectiveTodayKey;
  const autosaveTimerRef = useRef(null);

  // Day number calculation for current selected date
  const selectedDayNumber = Math.max(
    1,
    differenceInCalendarDays(parseDateKey(selectedDate), parseDateKey(settings.startDate)) + 1
  );

  // Load entry when selectedDate changes
  useEffect(() => {
    // Flush any pending save for previous date if needed
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    const entry = journal[selectedDate];
    if (entry) {
      setContent(entry.content || '');
      setTags(entry.tags || []);
      setLastSavedAt(entry.updatedAt ? new Date(entry.updatedAt) : null);
    } else {
      setContent('');
      setTags([]);
      setLastSavedAt(null);
    }
    setSaveStatus('saved');
  }, [selectedDate, journal]);

  // Handle content change with autosave debounce
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setSaveStatus('saving');

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      saveJournalEntry(selectedDate, newContent, tags);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
    }, 600);
  };

  // Immediate save on blur
  const handleBlur = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    saveJournalEntry(selectedDate, content, tags);
    setSaveStatus('saved');
    setLastSavedAt(new Date());
  };

  // Explicit Manual Save button
  const handleManualSave = () => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    saveJournalEntry(selectedDate, content, tags);
    setSaveStatus('saved');
    setLastSavedAt(new Date());
    addToast({
      title: 'Journal Entry Saved',
      message: `Day ${selectedDayNumber} reflection securely stored in browser storage.`,
      type: 'success'
    });
  };

  // Add Tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const clean = newTagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      const updated = [...tags, clean];
      setTags(updated);
      setNewTagInput('');
      saveJournalEntry(selectedDate, content, updated);
      setLastSavedAt(new Date());
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    saveJournalEntry(selectedDate, content, updated);
    setLastSavedAt(new Date());
  };

  // Insert default 5 prompts
  const handleInsertPrompts = () => {
    if (!content.trim() || window.confirm('Insert the 5 reflection prompts? Existing text will be appended.')) {
      const combined = content.trim() ? `${content}\n\n${DEFAULT_PROMPTS}` : DEFAULT_PROMPTS;
      setContent(combined);
      saveJournalEntry(selectedDate, combined, tags);
      setSaveStatus('saved');
      setLastSavedAt(new Date());
    }
  };

  // Export current entry as Markdown
  const handleExportCurrent = () => {
    if (!content.trim()) {
      addToast({ title: 'Empty Entry', message: 'Write something before exporting.', type: 'warning' });
      return;
    }
    const md = `# OBSESSION Transformation Journal — Day ${selectedDayNumber} (${selectedDate})\n\n**Date:** ${formatDisplayDate(selectedDate, 'EEEE, MMMM d, yyyy')}\n**Tags:** ${tags.map(t => `#${t}`).join(' ')}\n\n---\n\n${content}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBSESSION_Journal_Day_${selectedDayNumber}_${selectedDate}.md`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Exported', message: `Journal for Day ${selectedDayNumber} downloaded.` });
  };

  // Export all entries as a single Markdown document
  const handleExportAll = () => {
    const sortedDates = Object.keys(journal).sort().reverse();
    const validDates = sortedDates.filter(d => journal[d]?.content?.trim());
    if (validDates.length === 0) {
      addToast({ title: 'No Entries', message: 'No journal reflections found.', type: 'warning' });
      return;
    }

    let compiled = `# OBSESSION — Complete 90-Day Transformation Journal\n\nGenerated on: ${new Date().toISOString()}\nTotal Entries: ${validDates.length}\n\n=========================================\n\n`;

    validDates.forEach((dKey) => {
      const entry = journal[dKey];
      const dNum = Math.max(1, differenceInCalendarDays(parseDateKey(dKey), parseDateKey(settings.startDate)) + 1);
      compiled += `## Day ${dNum} — ${formatDisplayDate(dKey, 'EEEE, MMMM d, yyyy')} (${dKey})\n`;
      if (entry.tags && entry.tags.length > 0) {
        compiled += `**Tags:** ${entry.tags.map(t => `#${t}`).join(' ')}\n\n`;
      }
      compiled += `${entry.content}\n\n---\n\n`;
    });

    const blob = new Blob([compiled], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBSESSION_Journal_Complete_${effectiveTodayKey}.md`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Complete Journal Exported', message: `Downloaded ${validDates.length} days of reflections.` });
  };

  // Character and word counts for active editor
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isCompletedReflection = wordCount >= 25;

  // Compile all written journal entries across all days
  const allWrittenEntries = Object.keys(journal)
    .filter(dKey => journal[dKey]?.content?.trim())
    .sort()
    .reverse()
    .map(dKey => {
      const entry = journal[dKey];
      const dayNum = Math.max(1, differenceInCalendarDays(parseDateKey(dKey), parseDateKey(settings.startDate)) + 1);
      const dayStat = getDailyCompletion(dKey, habits, records);
      const wCount = entry.content.trim().split(/\s+/).length;
      return {
        dateKey: dKey,
        dayNumber: dayNum,
        dayStat,
        wordCount: wCount,
        ...entry
      };
    });

  // Extract all unique tags
  const allUniqueTags = Array.from(
    new Set(allWrittenEntries.flatMap(e => e.tags || []))
  );

  // Filtered entries for Archive view
  const filteredArchiveEntries = allWrittenEntries.filter(entry => {
    if (selectedTagFilter !== 'all' && !entry.tags?.includes(selectedTagFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = entry.content.toLowerCase().includes(q);
      const matchTag = entry.tags?.some(t => t.toLowerCase().includes(q));
      const matchDate = entry.dateKey.includes(q);
      const matchDay = `day ${entry.dayNumber}`.includes(q);
      return matchContent || matchTag || matchDate || matchDay;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
            Daily Journal
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Evening self-reflection. All your entries are permanently stored day-by-day.
          </p>
        </div>

        {/* Top Actions: Toggle View & Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-surface-hover/60 rounded-lg border border-surface-border">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'editor'
                  ? 'bg-surface-card text-content-main shadow-subtle font-bold'
                  : 'text-content-secondary hover:text-content-main'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Day Editor</span>
            </button>
            <button
              onClick={() => setViewMode('archive')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'archive'
                  ? 'bg-surface-card text-content-main shadow-subtle font-bold'
                  : 'text-content-secondary hover:text-content-main'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>All Written Days ({allWrittenEntries.length})</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={FileDown}
            onClick={handleExportAll}
            title="Download complete multi-day journal markdown"
          >
            Export All
          </Button>
        </div>
      </div>

      {/* VIEW MODE 1: DAY EDITOR */}
      {viewMode === 'editor' && (
        <div className="space-y-4">
          {/* Date Navigation & Save Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-card border border-surface-border rounded-xl shadow-subtle">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(addDaysToDateKey(selectedDate, -1))}
                title="Previous Day"
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-content-main transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-2">
                <span className="text-xs sm:text-sm font-bold font-mono text-content-main">
                  DAY {selectedDayNumber}
                </span>
                <span className="text-xs text-content-secondary font-mono">
                  ({formatDisplayDate(selectedDate, 'EEE, MMM d, yyyy')})
                </span>
                {isToday && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-content-main text-surface-card font-bold uppercase">
                    Today
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedDate(addDaysToDateKey(selectedDate, 1))}
                title="Next Day"
                className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-content-main transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {!isToday && (
                <Button
                  size="sm"
                  variant="outline"
                  icon={RotateCcw}
                  onClick={() => setSelectedDate(effectiveTodayKey)}
                  className="text-xs py-1"
                >
                  Return Today
                </Button>
              )}
            </div>

            {/* Save Status & Word Count & Explicit Save Button */}
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-content-secondary">
                <span
                  className={`w-2 h-2 rounded-full ${
                    saveStatus === 'saving' ? 'bg-amber-500 animate-ping' : 'bg-status-success'
                  }`}
                />
                <span>{saveStatus === 'saving' ? 'Saving...' : 'Saved to Storage'}</span>
              </div>

              <span className="text-content-muted">•</span>

              <span className={`${isCompletedReflection ? 'text-status-success font-semibold' : 'text-content-muted'}`}>
                {wordCount} words
              </span>

              <Button
                size="sm"
                variant="primary"
                icon={Save}
                onClick={handleManualSave}
                className="text-xs py-1"
              >
                Save Journal
              </Button>
            </div>
          </div>

          {/* Editor Canvas Card */}
          <Card className="space-y-4 p-5 sm:p-6">
            {/* Toolbar: Prompts Trigger & Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Sparkles}
                  onClick={handleInsertPrompts}
                  className="text-xs"
                >
                  Insert 5 Reflection Prompts
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  icon={FileDown}
                  onClick={handleExportCurrent}
                  className="text-xs"
                >
                  Export Day {selectedDayNumber}
                </Button>
              </div>

              {/* Tags Editor */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-hover border border-surface-border text-[11px] font-mono text-content-main"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-content-muted hover:text-content-main ml-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddTag} className="flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ add tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="w-24 px-2 py-1 bg-surface-hover/60 border border-surface-border rounded text-[11px] font-mono text-content-main focus:outline-none focus:border-content-main"
                  />
                </form>
              </div>
            </div>

            {/* Distraction-Free Reflection Canvas */}
            <div className="min-h-[420px]">
              <textarea
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                placeholder={`Reflect on Day ${selectedDayNumber} (${selectedDate}):\n- What priorities did you execute today?\n- Did you complete your 3h coding, speaking, and workout?\n- What held you back, and what will you do better tomorrow?...`}
                className="w-full h-[420px] bg-transparent text-sm leading-relaxed text-content-main placeholder:text-content-muted focus:outline-none resize-none font-sans"
              />
            </div>

            {/* Footer with storage assurance banner */}
            <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row sm:items-center justify-between text-xs text-content-muted font-mono gap-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-status-success" />
                Journal entries are permanently stored per date in your local storage.
              </span>
              {lastSavedAt && (
                <span>
                  Last saved: {lastSavedAt.toLocaleTimeString()}
                </span>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* VIEW MODE 2: ALL WRITTEN JOURNALS ARCHIVE FEED */}
      {viewMode === 'archive' && (
        <div className="space-y-4">
          {/* Search & Tag Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-card border border-surface-border rounded-xl">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
              <input
                type="text"
                placeholder="Search journal text, tags, or dates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-hover/50 border border-surface-border rounded-lg text-xs text-content-main placeholder:text-content-muted focus:outline-none focus:border-content-main font-mono"
              />
            </div>

            {/* Tag Filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedTagFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedTagFilter === 'all'
                    ? 'bg-content-main text-surface-card font-bold'
                    : 'bg-surface-hover text-content-secondary hover:text-content-main'
                }`}
              >
                All Tags
              </button>
              {allUniqueTags.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTagFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    selectedTagFilter === t
                      ? 'bg-content-main text-surface-card font-bold'
                      : 'bg-surface-hover text-content-secondary hover:text-content-main'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* List of All Written Journal Entries */}
          {filteredArchiveEntries.length === 0 ? (
            <Card className="text-center py-12 space-y-3">
              <div className="p-3 rounded-full bg-surface-hover w-12 h-12 mx-auto flex items-center justify-center text-content-muted">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-content-main font-mono">
                {allWrittenEntries.length === 0 ? 'No Journal Entries Written Yet' : 'No Matching Entries Found'}
              </h3>
              <p className="text-xs text-content-secondary max-w-sm mx-auto">
                {allWrittenEntries.length === 0
                  ? 'Start your daily evening reflection routine. Every day you write is preserved here forever.'
                  : 'Try adjusting your search keywords or tag filters.'}
              </p>
              {allWrittenEntries.length === 0 && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={Edit3}
                  onClick={() => setViewMode('editor')}
                >
                  Write Day {selectedDayNumber} Reflection
                </Button>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredArchiveEntries.map((entry) => (
                <Card key={entry.dateKey} bulge={true} className="space-y-3 p-5 hover:border-content-muted transition-colors">
                  {/* Entry Header: Day number, date, habits score, and word count */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-border">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-extrabold font-mono text-content-main">
                        DAY {entry.dayNumber}
                      </span>
                      <span className="text-xs font-mono text-content-secondary">
                        {formatDisplayDate(entry.dateKey, 'EEEE, MMMM d, yyyy')}
                      </span>
                      {entry.dateKey === effectiveTodayKey && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-content-main text-surface-card font-bold">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        entry.dayStat.isPerfect
                          ? 'bg-status-success-bg text-status-success border-status-success-border font-semibold'
                          : entry.dayStat.completedCount > 0
                          ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
                          : 'bg-surface-hover text-content-muted border-surface-border'
                      }`}>
                        {entry.dayStat.completedCount}/{entry.dayStat.totalCount} Habits Done
                      </span>

                      <span className="text-[11px] font-mono text-content-muted">
                        {entry.wordCount} words
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        icon={Edit3}
                        onClick={() => {
                          setSelectedDate(entry.dateKey);
                          setViewMode('editor');
                        }}
                        className="text-xs py-1 px-2.5"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono text-content-secondary bg-surface-hover px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Full Reflection Content */}
                  <div className="p-4 bg-surface-hover/30 rounded-xl border border-surface-border/60 text-xs sm:text-sm text-content-main whitespace-pre-wrap leading-relaxed font-sans">
                    {entry.content}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
