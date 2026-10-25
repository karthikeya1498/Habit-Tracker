import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Badge } from '../components/common/UIElements';
import { ConfirmationDialog } from '../components/common/Modal';
import { getTodayKey, formatDisplayDate } from '../utils/dateUtils';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Sun,
  Moon,
  Laptop,
  AlertTriangle,
  Database,
  Calendar,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    exportBackup,
    importBackup,
    exportCSV,
    resetChallenge,
    resetAllData,
    loadDemoData,
    addToast
  } = useApp();

  const [startDate, setStartDate] = useState(settings.startDate);
  const [durationDays, setDurationDays] = useState(settings.durationDays);
  const [theme, setTheme] = useState(settings.theme || 'system');
  const [weekStartDay, setWeekStartDay] = useState(settings.weekStartDay || 'monday');

  // Confirmation dialogs
  const [isResetChallengeOpen, setIsResetChallengeOpen] = useState(false);
  const [isResetAllOpen, setIsResetAllOpen] = useState(false);
  const [isLoadDemoOpen, setIsLoadDemoOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveChallengeSettings = (e) => {
    e.preventDefault();
    updateSettings({
      startDate,
      durationDays: Number(durationDays) || 90,
      theme,
      weekStartDay,
    });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="pb-4 border-b border-surface-border">
        <h1 className="text-2xl font-extrabold tracking-tight text-content-main uppercase font-mono">
          Workspace Settings
        </h1>
        <p className="text-xs text-content-secondary mt-0.5">
          Configure your 90-day transformation parameters, appearance, and local backups.
        </p>
      </div>

      {/* Browser Local Storage Notice */}
      <div className="p-4 bg-surface-hover/50 border border-surface-border rounded-xl space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-content-main font-mono">
          <Database className="w-4 h-4 text-content-secondary" />
          <span>Local Storage Architecture</span>
        </div>
        <p className="text-xs text-content-secondary leading-relaxed">
          Your transformation tracking records and journals are saved directly to this browser's <code className="text-content-main font-mono">localStorage</code>. No external servers or paid accounts are required. <strong>Important:</strong> Clearing your browser data or cache can erase local records; download a JSON backup regularly.
        </p>
      </div>

      {/* Challenge Configuration */}
      <Card className="space-y-5">
        <div>
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
            90-Day Challenge Parameters
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Adjust the challenge start date and duration.
          </p>
        </div>

        <form onSubmit={handleSaveChallengeSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase font-mono text-content-main">
                Challenge Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-mono text-content-main focus:outline-none focus:border-content-main"
              />
              <span className="text-[10px] text-content-muted">
                Current: {formatDisplayDate(startDate, 'EEEE, MMM d, yyyy')}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase font-mono text-content-main">
                Challenge Duration (Days)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-2 bg-surface-card border border-surface-border rounded-lg text-xs font-mono text-content-main focus:outline-none focus:border-content-main"
              />
              <span className="text-[10px] text-content-muted">
                Default: 90 days (13 weeks)
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="sm">
              Save Parameters
            </Button>
          </div>
        </form>
      </Card>

      {/* Appearance & Interface */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
            Appearance & Theme
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Choose your preferred workspace visual mode.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Laptop },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = theme === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleThemeChange(mode.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-content-main bg-surface-card text-content-main shadow-subtle ring-1 ring-content-main'
                    : 'border-surface-border bg-surface-hover/30 hover:bg-surface-hover text-content-secondary'
                }`}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Data Backup & Portability */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
            Data Portability & Backups
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Export complete JSON state or import a previously downloaded backup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* JSON Export */}
          <button
            onClick={exportBackup}
            className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-left transition-colors group"
          >
            <Download className="w-4 h-4 text-content-main group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-semibold text-content-main mt-1">Export JSON Backup</span>
            <span className="text-[10px] text-content-secondary">All habits, records & journals</span>
          </button>

          {/* JSON Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-left transition-colors group"
          >
            <Upload className="w-4 h-4 text-content-main group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-semibold text-content-main mt-1">Restore from Backup</span>
            <span className="text-[10px] text-content-secondary">Import valid JSON file</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />

          {/* CSV Export */}
          <button
            onClick={exportCSV}
            className="flex flex-col items-start gap-1 p-3.5 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-hover text-left transition-colors group"
          >
            <FileSpreadsheet className="w-4 h-4 text-content-main group-hover:-translate-y-0.5 transition-transform" />
            <span className="text-xs font-semibold text-content-main mt-1">Export Journey (CSV)</span>
            <span className="text-[10px] text-content-secondary">90-day progress spreadsheet</span>
          </button>
        </div>
      </Card>

      {/* Demo Data & Testing */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-content-main">
              Sample Demonstration Data
            </h2>
            <p className="text-xs text-content-secondary mt-0.5">
              Populate the past 14 days with realistic habit execution and reflections to test streaks and charts immediately.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            icon={Sparkles}
            onClick={() => setIsLoadDemoOpen(true)}
          >
            Load Demo Data
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-status-missed-border/60 bg-status-missed-bg/20 space-y-4">
        <div>
          <h2 className="text-xs font-bold uppercase font-mono tracking-wider text-status-missed flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Irreversible actions. Confirmation is strictly required.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-status-missed-border/40">
          <div>
            <h4 className="text-xs font-semibold text-content-main">Reset Challenge Start Date</h4>
            <p className="text-[11px] text-content-secondary">
              Resets challenge starting day to today. Preserves your custom habits.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            icon={RotateCcw}
            onClick={() => setIsResetChallengeOpen(true)}
          >
            Reset to Today
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-status-missed-border/40">
          <div>
            <h4 className="text-xs font-semibold text-status-missed">Reset All Data</h4>
            <p className="text-[11px] text-content-secondary">
              Wipes all habit definitions, tracked records, and journal entries back to fresh factory state.
            </p>
          </div>
          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={() => setIsResetAllOpen(true)}
          >
            Reset All Records
          </Button>
        </div>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={isResetChallengeOpen}
        onClose={() => setIsResetChallengeOpen(false)}
        onConfirm={() => resetChallenge(getTodayKey())}
        title="Reset Challenge to Today?"
        message="This will set Day 1 of the 90-day transformation to today. Your habit configurations will remain intact."
        confirmLabel="Reset Challenge"
      />

      <ConfirmationDialog
        isOpen={isResetAllOpen}
        onClose={() => setIsResetAllOpen(false)}
        onConfirm={resetAllData}
        title="Reset All Data?"
        message="This will completely clear your local storage and restore fresh defaults. All historical days and journal entries will be lost unless you have exported a JSON backup."
        confirmLabel="Wipe & Reset Everything"
        isDestructive={true}
      />

      <ConfirmationDialog
        isOpen={isLoadDemoOpen}
        onClose={() => setIsLoadDemoOpen(false)}
        onConfirm={loadDemoData}
        title="Load Sample Demo Data?"
        message="This will populate the previous 14 days with realistic habit execution and reflections so you can inspect charts, streaks, and heatmap performance immediately."
        confirmLabel="Load Demo Data"
      />
    </div>
  );
}
