import { useState, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
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

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...toast, id }]);
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 4000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 shadow-green-100',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 shadow-red-100',
  info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-blue-100',
  warning: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800 shadow-amber-100',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[1700] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast, index) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'group relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
              'animate-in slide-in-from-right-full duration-300 ease-out',
              'hover:shadow-xl transition-all duration-200',
              'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200',
              styles[toast.type]
            )}
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'both',
            }}
          >
            {/* Progress Bar */}
            {toast.duration && toast.duration > 0 && (
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-current to-transparent opacity-30 rounded-b-xl animate-pulse" 
                style={{
                  animation: `shrink ${toast.duration}ms linear forwards`,
                }}
              />
            )}
            
            <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0 animate-pulse', iconStyles[toast.type])} />
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-sm opacity-90 mt-1 leading-relaxed">{toast.description}</p>
              )}
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className={cn(
                    'mt-2 text-xs font-medium underline decoration-2 underline-offset-2',
                    'hover:no-underline transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 rounded'
                  )}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className={cn(
                'p-1 rounded-lg transition-all duration-200',
                'hover:bg-black/10 active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
              )}
              aria-label="Close notification"
            >
              <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
