import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsCard variant styles
 */
const statsCardVariants = cva(
  'rounded-xl border bg-card transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-border',
        elevated: 'border-border shadow-md hover:shadow-lg',
        outline: 'border-border/60 bg-transparent',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface StatsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsCardVariants> {
  /** Title/label for the stat */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Optional subtitle or additional context */
  subtitle?: string;
  /** Optional icon to display */
  icon?: LucideIcon;
  /** Trend direction */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend value to display (e.g., "+12%") */
  trendValue?: string;
}

/**
 * Stats card component for displaying metrics and KPIs
 * 
 * @example
 * ```tsx
 * <StatsCard
 *   title="Total Users"
 *   value={1234}
 *   trend="up"
 *   trendValue="+12%"
 *   icon={Users}
 * />
 * ```
 */
const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  (
    {
      title,
      value,
      subtitle,
      icon: Icon,
      trend,
      trendValue,
      variant,
      size,
      className,
      ...props
    },
    ref
  ) => {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

    return (
      <div
        ref={ref}
        className={cn(statsCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p
              className={cn(
                'font-bold mt-1 tabular-nums',
                size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-3xl' : 'text-2xl'
              )}
            >
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
            {trend && trendValue && (
              <p
                className={cn(
                  'text-xs font-medium mt-1.5 flex items-center gap-1',
                  trend === 'up' && 'text-green-600 dark:text-green-400',
                  trend === 'down' && 'text-red-600 dark:text-red-400',
                  trend === 'neutral' && 'text-muted-foreground'
                )}
              >
                <TrendIcon className="w-3 h-3" aria-hidden="true" />
                <span>{trendValue}</span>
              </p>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0',
                size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2'
              )}
            >
              <Icon
                className={cn(
                  'text-primary',
                  size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
                )}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
StatsCard.displayName = 'StatsCard';

export { StatsCard, statsCardVariants };
