import { useEffect, useCallback } from 'react';
import * as React from 'react';
import { useRunStore } from '@/store/runStore';

export function useKeyboardShortcuts() {
  const { undo, reset } = useRunStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Global shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            // Redo functionality not implemented yet
          } else {
            // Undo
            undo();
          }
          break;
      }
    }

    // Escape key to reset/cancel
    if (event.key === 'Escape') {
      reset();
    }

    // Number keys for quick category selection
    if (event.key >= '1' && event.key <= '9') {
      // Quick selection functionality not implemented yet
    }
  }, [undo, reset]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useRovingTabIndex(items: string[]) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedIndex(items.length - 1);
        break;
    }
  }, [items.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedIndex, setFocusedIndex };
}
