import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  formatDisplayDate,
  getTodayKey,
  addDaysToDateKey
} from '../utils/dateUtils';
import { Card, Button, Badge } from '../components/common/UIElements';
import { Modal } from '../components/common/Modal';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Calendar,
  Save,
  CheckCircle2,
  FileDown,
  Search,
  Tag,
  Plus,
  X,
  Sparkles
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
    addToast
  } = useApp();

  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving'
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isToday = selectedDate === getTodayKey();
  const autosaveTimerRef = useRef(null);

  // Load entry when selectedDate changes
  useEffect(() => {
    const entry = journal[selectedDate];
    if (entry) {
      setContent(entry.content || '');
      setTags(entry.tags || []);
    } else {
      setContent('');
      setTags([]);
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
    }, 600);
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
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tags.filter(t => t !== tagToRemove);
    setTags(updated);
    saveJournalEntry(selectedDate, content, updated);
  };

  // Insert default 5 prompts
  const handleInsertPrompts = () => {
    if (!content.trim() || window.confirm('Insert the 5 reflection prompts? Existing text will be appended.')) {
      const combined = content.trim() ? `${content}\n\n${DEFAULT_PROMPTS}` : DEFAULT_PROMPTS;
      setContent(combined);
      saveJournalEntry(selectedDate, combined, tags);
      setSaveStatus('saved');
    }
  };

  // Export current entry as Markdown
  const handleExportCurrent = () => {
    if (!content.trim()) {
      addToast({ title: 'Empty Entry', message: 'Write something before exporting.', type: 'warning' });
      return;
    }
    const md = `# OBSESSION Transformation Journal — ${selectedDate}\n\n**Date:** ${formatDisplayDate(selectedDate, 'EEEE, MMMM d, yyyy')}\n**Tags:** ${tags.map(t => `#${t}`).join(' ')}\n\n---\n\n${content}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBSESSION_Journal_${selectedDate}.md`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Exported', message: `Journal for ${selectedDate} downloaded.` });
  };

  // Export all entries as a single Markdown document
  const handleExportAll = () => {
    const sortedDates = Object.keys(journal).sort().reverse();
    if (sortedDates.length === 0) {
      addToast({ title: 'No Entries', message: 'No journal reflections found.', type: 'warning' });
      return;
    }

    let compiled = `# OBSESSION — Complete 90-Day Transformation Journal\n\nGenerated on: ${new Date().toISOString()}\nTotal Entries: ${sortedDates.length}\n\n=========================================\n\n`;

    sortedDates.forEach((dKey) => {
      const entry = journal[dKey];
      if (entry && entry.content && entry.content.trim()) {
        compiled += `## ${formatDisplayDate(dKey, 'EEEE, MMMM d, yyyy')} (${dKey})\n`;
        if (entry.tags && entry.tags.length > 0) {
          compiled += `**Tags:** ${entry.tags.map(t => `#${t}`).join(' ')}\n\n`;
        }
        compiled += `${entry.content}\n\n---\n\n`;
      }
    });

    const blob = new Blob([compiled], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OBSESSION_Journal_Complete_${getTodayKey()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Complete Journal Exported', message: 'Downloaded complete markdown archive.' });
  };

  // Character and word counts
  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isCompletedReflection = wordCount >= 25;

  // Filtered past entries for search
  const pastEntriesList = Object.keys(journal)
    .filter(d => journal[d]?.content?.trim())
    .sort()
    .reverse()
    .map(d => ({ dateKey: d, ...journal[d] }))
    .filter(e => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchContent = e.content.toLowerCase().includes(q);
      const matchTag = e.tags?.some(t => t.toLowerCase().includes(q));
      return matchContent || matchTag;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
            Daily Journal
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Evening self-reflection. Build relentless clarity and honesty with yourself.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            icon={Search}
            onClick={() => setIsSearchOpen(true)}
          >
            Past Entries ({Object.keys(journal).filter(k => journal[k]?.content?.trim()).length})
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={FileDown}
            onClick={handleExportCurrent}
          >
            Export Day
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={FileDown}
            onClick={handleExportAll}
          >
            Export All
          </Button>
        </div>
      </div>

      {/* Date Navigation & Autosave Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface-card border border-surface-border rounded-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(addDaysToDateKey(selectedDate, -1))}
            className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-content-main transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs sm:text-sm font-semibold font-mono text-content-main px-2">
            {formatDisplayDate(selectedDate, 'EEEE, MMM d, yyyy')}
          </span>

          <button
            onClick={() => setSelectedDate(addDaysToDateKey(selectedDate, 1))}
            className="p-1.5 rounded-lg border border-surface-border hover:bg-surface-hover text-content-main transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {!isToday && (
            <Button
              size="sm"
              variant="outline"
              icon={RotateCcw}
              onClick={() => setSelectedDate(getTodayKey())}
              className="text-xs py-1"
            >
              Today
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-content-secondary">
            <span className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-ping' : 'bg-status-success'}`} />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Autosaved'}</span>
          </div>

          <span className="text-content-muted">•</span>

          <span className={`${isCompletedReflection ? 'text-status-success font-semibold' : 'text-content-muted'}`}>
            {wordCount} words ({charCount} chars)
          </span>

          {isCompletedReflection && (
            <Badge variant="success" size="sm">Reflection Logged</Badge>
          )}
        </div>
      </div>

      {/* Editor Canvas */}
      <Card className="space-y-4 p-5 sm:p-6">
        {/* Template Prompt Trigger & Tags */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border">
          <Button
            size="sm"
            variant="secondary"
            icon={Sparkles}
            onClick={handleInsertPrompts}
            className="text-xs"
          >
            Insert 5 Daily Reflection Prompts
          </Button>

          {/* Tags */}
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
                placeholder="+ tag"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="w-20 px-2 py-1 bg-surface-hover/60 border border-surface-border rounded text-[11px] font-mono text-content-main focus:outline-none focus:border-content-main"
              />
            </form>
          </div>
        </div>

        {/* Large Distraction-Free Textarea */}
        <div className="min-h-[420px]">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What took place today? Did you execute your technical study, speaking practice, and athletic workout? What held you back, and what will you improve tomorrow?..."
            className="w-full h-[420px] bg-transparent text-sm leading-relaxed text-content-main placeholder:text-content-muted focus:outline-none resize-none font-sans"
          />
        </div>
      </Card>

      {/* Search Past Entries Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Search Transformation Journal"
        subtitle="Search across all historical journal reflections"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder="Search by keywords or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-surface-hover/50 border border-surface-border rounded-lg text-xs text-content-main focus:outline-none focus:border-content-main"
            />
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-surface-border/60">
            {pastEntriesList.length === 0 ? (
              <div className="text-center py-8 text-xs text-content-muted">
                No matching journal entries found.
              </div>
            ) : (
              pastEntriesList.map((entry) => (
                <div
                  key={entry.dateKey}
                  onClick={() => {
                    setSelectedDate(entry.dateKey);
                    setIsSearchOpen(false);
                  }}
                  className="pt-3 pb-2 cursor-pointer hover:bg-surface-hover/50 -mx-2 px-2 rounded-lg transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-content-main font-mono">
                      {formatDisplayDate(entry.dateKey, 'EEEE, MMM d, yyyy')}
                    </span>
                    <span className="text-[10px] font-mono text-content-muted">
                      {entry.content.trim().split(/\s+/).length} words
                    </span>
                  </div>

                  <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                    {entry.content}
                  </p>

                  {entry.tags?.length > 0 && (
                    <div className="flex gap-1 pt-1">
                      {entry.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-content-muted bg-surface-hover px-1.5 py-0.2 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
