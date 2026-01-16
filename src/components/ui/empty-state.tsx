import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

/**
 * EmptyState variant styles
 */
const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'py-6 px-3',
        default: 'py-12 px-4',
        lg: 'py-16 px-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  /** Icon to display */
  icon?: LucideIcon;
  /** Main heading text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action element (button, link, etc.) */
  action?: React.ReactNode;
}

/**
 * Empty state component for when there's no data to display
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Inbox}
 *   title="No items"
 *   description="Get started by creating your first item."
 *   action={<Button>Create Item</Button>}
 * />
 * ```
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, action, size, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ size }), className)}
        {...props}
      >
        {Icon && (
          <div
            className={cn(
              'rounded-full bg-muted flex items-center justify-center mb-4 transition-transform hover:scale-105',
              size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
            )}
          >
            <Icon
              className={cn(
                'text-muted-foreground',
                size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'
              )}
              aria-hidden="true"
            />
          </div>
        )}
        <h3
          className={cn(
            'font-semibold text-foreground',
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'text-muted-foreground mt-1 max-w-sm',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}
          >
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState, emptyStateVariants };
