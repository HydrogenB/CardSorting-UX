import * as React from 'react';

interface LiveRegionProps {
  politeness?: 'polite' | 'assertive' | 'off';
  ariaLabel?: string;
  children: React.ReactNode;
}

export function LiveRegion({ politeness = 'polite', ariaLabel, children }: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-label={ariaLabel}
      className="sr-only"
    >
      {children}
    </div>
  );
}

export function useLiveRegion() {
  const [announcement, setAnnouncement] = React.useState('');
  const [politeness, setPoliteness] = React.useState<'polite' | 'assertive'>('polite');

  const announce = React.useCallback((message: string, options?: { politeness?: 'polite' | 'assertive' }) => {
    setPoliteness(options?.politeness || 'polite');
    setAnnouncement('');
    // Small delay to ensure screen readers pick up the change
    setTimeout(() => setAnnouncement(message), 100);
  }, []);

  return { announcement, politeness, announce };
}
