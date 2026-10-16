import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'header' | 'floating' | 'mobile';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'header', className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  if (variant === 'floating') {
    return (
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 left-6 z-40 p-3 rounded-full transition-all duration-300 ease-out select-none cursor-pointer flex items-center justify-center group ${
          isDark
            ? 'bg-[#182126] text-teal border border-[#2B3B44] shadow-clay-dark hover:shadow-teal-glow'
            : 'bg-white text-ink-light border border-border-light shadow-clay hover:shadow-clay-hover'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="relative w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
          {isDark ? (
            <Sun className="w-5 h-5 stroke-[1.8] text-amber-300 animate-fade-in" />
          ) : (
            <Moon className="w-5 h-5 stroke-[1.8] text-slate-700 animate-fade-in" />
          )}
        </span>
      </button>
    );
  }

  // Header tactile pill toggle
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center h-8 px-2 rounded-full cursor-pointer select-none transition-all duration-300 ease-out group ${
        isDark
          ? 'bg-[#141A1E] border border-[#26343C] shadow-clay-dark'
          : 'bg-[#F0F2F5] border border-[#E2E6EA] shadow-clay-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Sliding pill thumb */}
      <span
        className={`absolute top-1 bottom-1 w-6 rounded-full transition-all duration-300 ease-out ${
          isDark
            ? 'right-1 bg-[#1F2930] shadow-sm border border-[#30414B]'
            : 'left-1 bg-white shadow-sm border border-black/5'
        }`}
      />

      {/* Sun Icon (Light indicator) */}
      <span
        className={`relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-200 ${
          !isDark ? 'text-amber-500' : 'text-slate-500 opacity-60'
        }`}
      >
        <Sun className="w-3.5 h-3.5 stroke-[2]" />
      </span>

      {/* Moon Icon (Dark indicator) */}
      <span
        className={`relative z-10 w-6 h-6 flex items-center justify-center transition-colors duration-200 ${
          isDark ? 'text-teal' : 'text-slate-400 opacity-60'
        }`}
      >
        <Moon className="w-3.5 h-3.5 stroke-[2]" />
      </span>

      {/* Label text */}
      <span
        className={`relative z-10 ml-1 mr-1 text-[10px] font-mono tracking-wider uppercase hidden sm:inline-block transition-colors duration-200 ${
          isDark ? 'text-ink-darkMuted' : 'text-ink-lightMuted'
        }`}
      >
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};
