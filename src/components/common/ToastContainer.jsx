import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let iconClass = 'text-status-success';
        let borderClass = 'border-surface-border';

        if (toast.type === 'missed' || toast.type === 'warning') {
          Icon = AlertCircle;
          iconClass = toast.type === 'missed' ? 'text-status-missed' : 'text-status-warning';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconClass = 'text-content-secondary';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-surface-card border ${borderClass} rounded-xl shadow-modal animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-content-main leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-content-secondary mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-content-muted hover:text-content-main p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
