import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Target,
  BarChart3,
  BookOpen,
  Settings,
  RefreshCw,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'habits', label: 'Daily Habits', icon: CheckSquare },
  { id: 'journey', label: '90-Day Journey', icon: Calendar },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    challengeInfo,
    currentQuote,
    refreshMotivationalQuote
  } = useApp();

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-surface-sidebar border-r border-surface-border p-4 select-none justify-between">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 pt-2">
          {/* Minimalist Monochrome Logo */}
          <div className="w-8 h-8 rounded-lg bg-content-main flex items-center justify-center text-surface-card shadow-sm">
            <span className="font-mono font-bold text-sm tracking-tighter">90</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-content-main uppercase">OBSESSION</h1>
            <p className="text-[10px] tracking-wider text-content-secondary uppercase font-mono">
              90-Day Transformation
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-surface-card text-content-main shadow-subtle border border-surface-border font-semibold'
                    : 'text-content-secondary hover:text-content-main hover:bg-surface-hover/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-content-main' : 'text-content-muted'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-content-main" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Challenge Progress & Quote */}
      <div className="space-y-4 pt-4 border-t border-surface-border">
        {/* Challenge Progress Card */}
        <div
          onClick={() => setActiveTab('journey')}
          className="p-3 bg-surface-card border border-surface-border rounded-xl cursor-pointer hover:border-surface-border-strong transition-all group"
        >
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-content-secondary uppercase font-semibold">Challenge</span>
            <span className="text-content-main font-bold">
              {challengeInfo.status === 'not_started'
                ? 'Starts Soon'
                : challengeInfo.status === 'completed'
                ? 'Completed'
                : `Day ${challengeInfo.currentDay} / 90`}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-content-main h-full rounded-full transition-all duration-300"
              style={{ width: `${challengeInfo.percentComplete}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-content-muted mt-2">
            <span>{challengeInfo.daysRemaining} days left</span>
            <span className="flex items-center gap-0.5 group-hover:text-content-main transition-colors">
              View map <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="p-3 rounded-lg bg-surface-hover/50 border border-surface-border/60 relative group">
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs text-content-secondary italic leading-relaxed">
              "{currentQuote}"
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshMotivationalQuote();
              }}
              title="New statement"
              className="p-1 text-content-muted hover:text-content-main hover:bg-surface-hover rounded transition-colors shrink-0"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
