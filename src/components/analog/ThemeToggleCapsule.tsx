'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleCapsuleProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  className?: string;
}

export const ThemeToggleCapsule: React.FC<ThemeToggleCapsuleProps> = ({
  isDarkMode,
  onToggleTheme,
  className = '',
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggleTheme}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggleTheme();
        }
      }}
      className={`relative inline-flex items-center p-1 rounded-full bg-[#24211D] dark:bg-[#1A1815] border border-[#3E3933] dark:border-[#2F2B26] shadow-inner transition-all hover:border-[#585047] cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-analog-accent active:scale-95 ${className}`}
      title={isDarkMode ? 'Dark stage mode active - Click for warm cream light theme' : 'Light warm cream theme active - Click for dark stage mode'}
    >
      {/* Sliding active pill backdrop */}
      <span
        aria-hidden="true"
        className={`absolute top-1 bottom-1 w-7 rounded-full bg-[#3D372F] dark:bg-analog-accent shadow-xs transition-transform duration-200 ease-out ${
          isDarkMode ? 'left-1 translate-x-7' : 'left-1 translate-x-0'
        }`}
      />

      {/* Sun icon */}
      <span
        className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 ${
          !isDarkMode
            ? 'text-amber-300'
            : 'text-[#8E8679] hover:text-[#B5AD9F]'
        }`}
      >
        <Sun className="w-3.5 h-3.5 stroke-[2.2]" />
      </span>

      {/* Moon icon */}
      <span
        className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 ${
          isDarkMode
            ? 'text-white'
            : 'text-[#8E8679] hover:text-[#B5AD9F]'
        }`}
      >
        <Moon className="w-3.5 h-3.5 stroke-[2.2]" />
      </span>
    </button>
  );
};
