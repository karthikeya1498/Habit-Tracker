import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Target,
  BarChart3,
  BookOpen,
  Settings,
  RefreshCw
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

export function MobileNav() {
  const {
    activeTab,
    setActiveTab,
    challengeInfo,
    currentQuote,
    refreshMotivationalQuote
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-sidebar border-b border-surface-border sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-content-main flex items-center justify-center text-surface-card shadow-sm">
            <span className="font-mono font-bold text-xs">90</span>
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-widest text-content-main uppercase">OBSESSION</h1>
            <p className="text-[9px] text-content-secondary font-mono">
              Day {challengeInfo.currentDay} of 90
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-content-main hover:bg-surface-hover rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Body */}
          <div className="fixed inset-y-0 left-0 w-72 bg-surface-sidebar border-r border-surface-border p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-content-main flex items-center justify-center text-surface-card">
                    <span className="font-mono font-bold text-sm">90</span>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold tracking-widest text-content-main uppercase">OBSESSION</h2>
                    <p className="text-[10px] text-content-secondary uppercase font-mono">Transformation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-content-secondary hover:text-content-main hover:bg-surface-hover rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-surface-card text-content-main shadow-subtle border border-surface-border font-semibold'
                          : 'text-content-secondary hover:text-content-main hover:bg-surface-hover/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-content-main" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-4 border-t border-surface-border space-y-3">
              <div className="p-3 bg-surface-card border border-surface-border rounded-xl">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-content-secondary">DAY {challengeInfo.currentDay} / 90</span>
                  <span className="font-bold text-content-main">{challengeInfo.percentComplete}%</span>
                </div>
                <div className="w-full bg-surface-hover h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-content-main h-full rounded-full"
                    style={{ width: `${challengeInfo.percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-surface-hover/60 border border-surface-border flex items-center justify-between text-xs text-content-secondary italic">
                <span>"{currentQuote}"</span>
                <button
                  onClick={refreshMotivationalQuote}
                  className="p-1 text-content-muted hover:text-content-main"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
