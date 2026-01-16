import * as React from 'react';
import { cn } from '@/lib/utils';

/** Valid aria-relevant attribute values */
type AriaRelevant = 'additions' | 'removals' | 'text' | 'all' | 'additions removals' | 'additions text' | 'removals additions' | 'removals text' | 'text additions' | 'text removals';

export interface LiveRegionProps {
  /** Politeness level for screen reader announcements */
  politeness?: 'polite' | 'assertive' | 'off';
  /** Accessible label for the region */
  'aria-label'?: string;
  /** Whether to also make the region atomic */
  atomic?: boolean;
  /** What types of changes are relevant */
  relevant?: AriaRelevant;
  /** Content to announce */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Live region component for screen reader announcements
 * 
 * @example
 * ```tsx
 * <LiveRegion politeness="polite">
 *   {statusMessage}
 * </LiveRegion>
 * ```
 */
export function LiveRegion({
  politeness = 'polite',
  'aria-label': ariaLabel,
  atomic = true,
  relevant = 'additions text',
  children,
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-label={ariaLabel}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
}

export interface UseLiveRegionOptions {
  /** Default politeness level */
  defaultPoliteness?: 'polite' | 'assertive';
  /** Delay before clearing announcement (ms) */
  clearDelay?: number;
}

/**
 * Hook for programmatic live region announcements
 * 
 * @example
 * ```tsx
 * const { announcement, politeness, announce } = useLiveRegion();
 * 
 * // Then in JSX:
 * <LiveRegion politeness={politeness}>{announcement}</LiveRegion>
 * 
 * // To announce:
 * announce('Item added');
 * announce('Error occurred', { politeness: 'assertive' });
 * ```
 */
export function useLiveRegion(options: UseLiveRegionOptions = {}) {
  const { defaultPoliteness = 'polite', clearDelay = 5000 } = options;
  
  const [announcement, setAnnouncement] = React.useState('');
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>(defaultPoliteness);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const announce = React.useCallback(
    (message: string, opts?: { politeness?: 'polite' | 'assertive'; clearAfter?: number }) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new politeness and clear for re-announcement
      setPoliteness(opts?.politeness || defaultPoliteness);
      setAnnouncement('');

      // Small delay to ensure screen readers pick up the change
      requestAnimationFrame(() => {
        setAnnouncement(message);
      });

      // Auto-clear after delay
      const delay = opts?.clearAfter ?? clearDelay;
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setAnnouncement('');
        }, delay);
      }
    },
    [defaultPoliteness, clearDelay]
  );

  const clear = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAnnouncement('');
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { announcement, politeness, announce, clear };
}
