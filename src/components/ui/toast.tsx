import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'action';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

const disabledToastContext: ToastContextType = {
  toasts: [],
  addToast: () => '',
  removeToast: () => {},
  clearAll: () => {},
};

/**
 * Hook to access toast notifications
 * 
 * @example
 * ```tsx
 * const { addToast } = useToast();
 * addToast({ type: 'success', title: 'Saved!' });
 * ```
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  return context ?? disabledToastContext;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Position of toast container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Provider component for toast notifications
 */
export function ToastProvider({
  children,
  maxToasts = 5,
  position = 'bottom-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const next = [...prev, { ...toast, id }];
      // Limit number of toasts
      return next.slice(-maxToasts);
    });

    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, toast.duration || 4000);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(
    () => ({ toasts, addToast, removeToast, clearAll }),
    [toasts, addToast, removeToast, clearAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </ToastContext.Provider>
  );
}

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
  action: Info,
};

const styles: Record<ToastType, string> = {
  success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800 dark:text-green-200',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 dark:from-red-950/50 dark:to-rose-950/50 dark:border-red-800 dark:text-red-200',
  info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800 dark:text-blue-200',
  warning: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 dark:from-amber-950/50 dark:to-yellow-950/50 dark:border-amber-800 dark:text-amber-200',
  action: 'bg-zinc-800 border-zinc-700 text-zinc-100 dark:bg-zinc-900 dark:border-zinc-700',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  info: 'text-blue-500 dark:text-blue-400',
  warning: 'text-amber-500 dark:text-amber-400',
  action: 'text-zinc-400',
};

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

function ToastContainer({ toasts, removeToast, position }: ToastContainerProps) {
  // Check for reduced motion preference
  const prefersReducedMotion = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <div
      className={cn(
        'fixed z-[1700] flex flex-col gap-2 max-w-sm w-full pointer-events-none',
        positionStyles[position]
      )}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            role="alert"
            aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
            className={cn(
              'group relative flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto',
              'hover:shadow-xl transition-shadow duration-200',
              !prefersReducedMotion && 'animate-in slide-in-from-right-full duration-300 ease-out',
              styles[toast.type]
            )}
            style={
              prefersReducedMotion
                ? undefined
                : { animationDelay: `${index * 50}ms`, animationFillMode: 'both' }
            }
          >
            <Icon
              className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[toast.type])}
              aria-hidden="true"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-sm opacity-90 mt-1 leading-relaxed">{toast.description}</p>
              )}
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className={cn(
                    'mt-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded px-1',
                    toast.type === 'action'
                      ? 'px-3 py-1 border border-zinc-600 rounded-md bg-zinc-700 hover:bg-zinc-600 text-zinc-100'
                      : 'underline decoration-2 underline-offset-2 hover:no-underline'
                  )}
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className={cn(
                'p-1 rounded-lg transition-all duration-200 flex-shrink-0',
                'hover:bg-black/10 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
              )}
              aria-label="Dismiss notification"
            >
              <X
                className={cn(
                  'w-4 h-4',
                  !prefersReducedMotion && 'transition-transform duration-200 group-hover:rotate-90'
                )}
                aria-hidden="true"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
