import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Toast } from '../components/Toast';

export type ToastType = 'success' | 'error';

export interface ToastState {
  message: string;
  type: ToastType;
}

const TOAST_DURATION_MS = 5000;
const TOAST_EXIT_MS = 220;

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const dismissToast = useCallback(() => {
    if (!toast) return;

    setIsExiting(true);
    window.setTimeout(() => {
      setToast(null);
      setIsExiting(false);
    }, TOAST_EXIT_MS);
  }, [toast]);

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setIsExiting(false);
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast || isExiting) return;

    const timer = window.setTimeout(() => dismissToast(), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast, isExiting, dismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Toast toast={toast} isExiting={isExiting} onClose={dismissToast} />
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}
