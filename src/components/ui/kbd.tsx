import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Kbd variant styles for keyboard key representation
 */
const kbdVariants = cva(
  'inline-flex items-center justify-center font-mono font-medium bg-muted border border-border rounded text-muted-foreground select-none',
  {
    variants: {
      size: {
        sm: 'px-1 py-0.5 text-[10px] min-w-[18px]',
        default: 'px-1.5 py-0.5 text-xs min-w-[22px]',
        lg: 'px-2 py-1 text-sm min-w-[28px]',
      },
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-md border-b-2',
        flat: 'shadow-none',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  /** The key or key combination to display */
  children: React.ReactNode;
}

/**
 * Keyboard key component for displaying keyboard shortcuts
 * 
 * @example
 * ```tsx
 * <Kbd>⌘</Kbd>
 * <Kbd>Shift</Kbd>
 * <Kbd size="lg" variant="elevated">Enter</Kbd>
 * ```
 */
const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ children, className, size, variant, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ size, variant }), className)}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);
Kbd.displayName = 'Kbd';

export { Kbd, kbdVariants };
