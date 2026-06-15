import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import type { ToastState } from '../contexts/ToastContext';

interface ToastProps {
  toast: ToastState;
  isExiting: boolean;
  onClose: () => void;
}

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-500',
    iconBg: 'bg-green-500/10 dark:bg-green-500/15',
    accent: 'border-l-green-500',
    label: 'Sucesso',
  },
  error: {
    icon: AlertTriangle,
    iconClass: 'text-red-500',
    iconBg: 'bg-red-500/10 dark:bg-red-500/15',
    accent: 'border-l-red-500',
    label: 'Atenção',
  },
} as const;

export function Toast({ toast, isExiting, onClose }: ToastProps) {
  const config = STATUS_CONFIG[toast.type];
  const Icon = config.icon;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col items-end pointer-events-none sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      <div
        role="alert"
        className={`pointer-events-auto flex w-[min(100vw-2.5rem,22rem)] items-start gap-3 rounded-xl border border-gray-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-800/90 border-l-4 ${config.accent} ${
          isExiting ? 'toast-exit' : 'toast-enter'
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconBg}`}
        >
          <Icon className={`h-5 w-5 ${config.iconClass}`} aria-hidden />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {config.label}
          </p>
          <p className="mt-0.5 text-sm font-medium leading-snug text-gray-800 dark:text-gray-100">
            {toast.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
