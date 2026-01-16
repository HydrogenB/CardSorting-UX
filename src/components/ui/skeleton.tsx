import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Skeleton variant styles
 */
const skeletonVariants = cva(
  'animate-pulse bg-muted relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        circular: 'rounded-full',
        text: 'rounded h-4',
        rectangular: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Enable shimmer animation effect */
  shimmer?: boolean;
}

/**
 * Skeleton loading placeholder component
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-[200px]" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 * ```
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, shimmer = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          skeletonVariants({ variant }),
          shimmer && [
            'before:absolute before:inset-0 before:-translate-x-full',
            'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
            'before:animate-[shimmer_1.5s_infinite]',
          ],
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable shimmer animation */
  shimmer?: boolean;
}

/**
 * Pre-composed skeleton for card layouts
 */
const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, shimmer = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'rounded-xl border border-border bg-card p-4 space-y-3',
          className
        )}
        {...props}
      >
        <Skeleton className="h-24 w-full" variant="rectangular" shimmer={shimmer} />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" shimmer={shimmer} />
          <Skeleton className="h-3 w-1/2" shimmer={shimmer} />
        </div>
      </div>
    );
  }
);
CardSkeleton.displayName = 'CardSkeleton';

export interface ListSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of items to show */
  items?: number;
  /** Enable shimmer animation */
  shimmer?: boolean;
}

/**
 * Pre-composed skeleton for list layouts
 */
const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  ({ items = 3, className, shimmer = true, ...props }, ref) => {
    return (
      <div ref={ref} aria-hidden="true" className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <Skeleton className="w-8 h-8" variant="rectangular" shimmer={shimmer} />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" shimmer={shimmer} />
              <Skeleton className="h-3 w-1/2" shimmer={shimmer} />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
ListSkeleton.displayName = 'ListSkeleton';

export interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  columns?: number;
  /** Enable shimmer animation */
  shimmer?: boolean;
}

/**
 * Pre-composed skeleton for table layouts
 */
const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, className, shimmer = true, ...props }, ref) => {
    return (
      <div ref={ref} aria-hidden="true" className={cn('space-y-2', className)} {...props}>
        {/* Header */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-10" variant="rectangular" shimmer={shimmer} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-8"
                shimmer={shimmer}
                style={{ animationDelay: `${(rowIndex * columns + colIndex) * 50}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
);
TableSkeleton.displayName = 'TableSkeleton';

export { Skeleton, CardSkeleton, ListSkeleton, TableSkeleton, skeletonVariants };
