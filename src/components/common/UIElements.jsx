import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-content-accent/20 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-content-main text-surface-card hover:bg-content-accent shadow-sm active:scale-[0.98]',
    secondary: 'bg-surface-card text-content-main border border-surface-border hover:bg-surface-hover hover:border-surface-border-strong active:scale-[0.98]',
    outline: 'bg-transparent text-content-main border border-surface-border hover:bg-surface-hover active:scale-[0.98]',
    ghost: 'bg-transparent text-content-secondary hover:text-content-main hover:bg-surface-hover active:scale-[0.98]',
    danger: 'bg-status-missed-bg text-status-missed border border-status-missed-border hover:bg-status-missed hover:text-white active:scale-[0.98]',
    subtle: 'bg-surface-hover text-content-main hover:bg-surface-active active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      {...props}
    >
      {Icon && <Icon className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2 py-0.5 font-medium',
  };

  const variantStyles = {
    neutral: 'bg-surface-hover text-content-secondary border border-surface-border',
    success: 'bg-status-success-bg text-status-success border border-status-success-border',
    warning: 'bg-status-warning-bg text-status-warning border border-status-warning-border',
    missed: 'bg-status-missed-bg text-status-missed border border-status-missed-border',
    accent: 'bg-content-main text-surface-card border border-transparent',
  };

  return (
    <span className={twMerge(clsx('inline-flex items-center gap-1 rounded-md tracking-tight uppercase font-mono', sizeStyles[size], variantStyles[variant], className))}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-surface-card border border-surface-border rounded-xl p-5 shadow-card transition-all duration-150',
          hoverable && 'hover:border-surface-border-strong hover:shadow-subtle cursor-pointer',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProgressBar({
  progress = 0,
  height = 'h-2',
  className = '',
  color = 'bg-content-main',
  showLabel = false,
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className={twMerge('w-full', className)}>
      <div className={clsx('w-full bg-surface-hover rounded-full overflow-hidden', height)}>
        <div
          className={clsx('h-full transition-all duration-500 ease-out rounded-full', color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-content-secondary mt-1 font-mono">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
    </div>
  );
}

export function CircularProgress({
  percentage = 0,
  size = 72,
  strokeWidth = 6,
  className = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div className={twMerge('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-hover"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-content-main transition-all duration-500 ease-out"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold font-mono text-content-main">
        {percentage}%
      </div>
    </div>
  );
}
