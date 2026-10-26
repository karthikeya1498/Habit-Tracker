import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';
import { PanelLeftOpen } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';

export function AppLayout({ children }) {
  const {
    isSidebarOpen,
    toggleSidebar,
    activeTab,
    challengeInfo,
    effectiveTodayKey
  } = useApp();

  return (
    <div className="min-h-screen bg-surface-bg text-content-main flex flex-col md:flex-row antialiased selection:bg-content-main selection:text-surface-card">
      {/* Mobile Top Nav */}
      <MobileNav />

      {/* Desktop Flexible Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Top Header Bar when Side Dashboard is closed */}
        {!isSidebarOpen && (
          <header className="hidden md:flex items-center justify-between px-6 py-2.5 bg-surface-card/80 backdrop-blur-md border-b border-surface-border sticky top-0 z-20 transition-all">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover text-xs font-mono font-bold text-content-main shadow-subtle transition-all bulge-box-sm"
                title="Open Side Dashboard (Ctrl+B)"
                aria-label="Open side dashboard"
              >
                <PanelLeftOpen className="w-4 h-4 text-content-main" />
                <span>Open Side Dashboard</span>
                <span className="text-[10px] text-content-muted bg-surface-hover px-1.5 py-0.5 rounded font-normal">
                  Ctrl+B
                </span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-content-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-content-main" />
                <span className="uppercase font-bold text-content-main">{activeTab}</span>
                <span>•</span>
                <span>Day {challengeInfo.currentDay} of 90</span>
              </div>
            </div>

            <div className="text-xs font-mono text-content-muted">
              {formatDisplayDate(effectiveTodayKey, 'EEEE, MMM d, yyyy')}
            </div>
          </header>
        )}

        {/* Main Content Page Container */}
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
}
