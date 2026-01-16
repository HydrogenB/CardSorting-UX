import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /** Position of the tooltip relative to the trigger */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Additional CSS classes */
  className?: string;
  /** Delay before showing tooltip (ms) */
  delayMs?: number;
  /** Whether tooltip is disabled */
  disabled?: boolean;
}

let tooltipCounter = 0;

/**
 * Tooltip component for displaying additional information on hover or focus
 * 
 * @example
 * ```tsx
 * <Tooltip content="More info">
 *   <button>Hover me</button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  className,
  delayMs = 200,
  disabled = false,
}: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const [delayedShow, setDelayedShow] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const [tooltipId] = React.useState(() => `tooltip-${++tooltipCounter}`);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const handleShow = React.useCallback(() => {
    if (disabled) return;
    setShow(true);
    timeoutRef.current = setTimeout(() => setDelayedShow(true), delayMs);
  }, [delayMs, disabled]);

  const handleHide = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(false);
    setDelayedShow(false);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isVisible = show && delayedShow && !disabled;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onFocus={handleShow}
      onBlur={handleHide}
    >
      {/* Trigger element with aria-describedby */}
      <span aria-describedby={isVisible ? tooltipId : undefined}>
        {children}
      </span>
      
      {/* Tooltip content */}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium',
            'bg-foreground text-background rounded-md shadow-lg',
            'whitespace-nowrap pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            positions[side],
            className
          )}
        >
          {content}
          {/* Arrow indicator */}
          <div
            className={cn(
              'absolute w-2 h-2 bg-foreground rotate-45',
              side === 'top' && 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
              side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
              side === 'left' && 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2',
              side === 'right' && 'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
            )}
          />
        </div>
      )}
    </div>
  );
}
