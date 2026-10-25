import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-bg text-content-main flex flex-col md:flex-row antialiased selection:bg-content-main selection:text-surface-card">
      {/* Mobile Top Nav */}
      <MobileNav />

      {/* Desktop Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area with restrained max width */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          {children}
        </div>
      </main>

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
}
