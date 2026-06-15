import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'nav' | 'floating';
}

export function ThemeToggle({ variant = 'nav' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'floating') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-300 hover:text-[#00BFFF] dark:hover:text-[#00BFFF] shadow-sm transition-colors"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className="flex items-center justify-center gap-2 px-6 py-5 text-white font-black text-sm tracking-widest transition-all hover:bg-[#1565C0] border-b md:border-b-0 md:border-r border-white/20"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
