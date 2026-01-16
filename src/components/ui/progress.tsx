import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value */
  value?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Show indeterminate animation (ignores value) */
  indeterminate?: boolean;
}

/**
 * Progress bar component for showing completion status
 * 
 * @example
 * ```tsx
 * <Progress value={75} />
 * <Progress indeterminate />
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      className,
      showLabel = false,
      size = 'md',
      variant = 'default',
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const sizeStyles = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };

    const variantStyles = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={indeterminate ? 'Loading' : `${Math.round(percentage)}% complete`}
          className={cn(
            'w-full bg-muted rounded-full overflow-hidden',
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variantStyles[variant],
              indeterminate && 'animate-progress-indeterminate w-1/3'
            )}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
        {showLabel && !indeterminate && (
          <p className="text-xs text-muted-foreground mt-1 text-right font-medium">
            {Math.round(percentage)}%
          </p>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value */
  value?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Show indeterminate animation */
  indeterminate?: boolean;
}

/**
 * Circular progress indicator
 */
const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      value = 0,
      max = 100,
      size = 48,
      strokeWidth = 4,
      className,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={indeterminate ? 'Loading' : `${Math.round(percentage)}% complete`}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className={cn('-rotate-90', indeterminate && 'animate-spin')}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={indeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            className="text-primary transition-all duration-500 ease-out"
          />
        </svg>
        {!indeterminate && (
          <span className="absolute text-xs font-medium tabular-nums">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';

export { Progress, CircularProgress };
