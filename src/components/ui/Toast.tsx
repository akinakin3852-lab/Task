import { CheckCircle2, AlertCircle, Info, X, type LucideIcon } from 'lucide-react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const icons: Record<ToastType, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-white text-emerald-700',
  error: 'border-red-200 bg-white text-red-700',
  info: 'border-slate-200 bg-white text-slate-700',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className={`animate-slide-in-right flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg max-w-sm ${styles[t.type]}`}
              role="alert"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
