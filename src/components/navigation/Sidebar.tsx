'use client';

import React from 'react';
import {
  Home,
  Music2,
  LayoutGrid,
  GitBranch,
  Library,
  Settings,
  Radio,
} from 'lucide-react';

export type NavigationTab =
  | 'practice'
  | 'patterns'
  | 'chords'
  | 'progressions'
  | 'library'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  isDarkMode: boolean;
  isPlaying: boolean;
  onTabChange: (tab: NavigationTab) => void;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  isPlaying,
  onTabChange,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'practice', label: 'Practice', icon: <Home className="w-4 h-4 stroke-[2.2]" /> },
    { id: 'patterns', label: 'Patterns', icon: <Music2 className="w-4 h-4 stroke-[2.2]" /> },
    { id: 'chords', label: 'Chords', icon: <LayoutGrid className="w-4 h-4 stroke-[2.2]" /> },
    { id: 'progressions', label: 'Progressions', icon: <GitBranch className="w-4 h-4 stroke-[2.2]" /> },
    { id: 'library', label: 'Library', icon: <Library className="w-4 h-4 stroke-[2.2]" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 stroke-[2.2]" /> },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          DESKTOP FIXED LEFT SIDEBAR
      ────────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 h-screen fixed left-0 top-0 border-r border-analog-border bg-analog-surface flex-col justify-between p-5 z-40 select-none shadow-xs">
        <div>
          {/* Brand Logo & Wordmark matching UI inspiration */}
          <div className="flex items-center space-x-3 mb-8 px-1">
            {/* Guitar Pick Icon */}
            <div
              className="w-10 h-10 rounded-xl bg-analog-accent flex items-center justify-center text-white shadow-sm shrink-0"
              style={{
                clipPath: 'polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)',
              }}
            >
              {/* Soundwave lines inside pick */}
              <div className="flex items-center space-x-0.5">
                <span className="w-0.5 h-2 bg-white rounded-full" />
                <span className="w-0.5 h-4 bg-white rounded-full" />
                <span className="w-0.5 h-5 bg-white rounded-full" />
                <span className="w-0.5 h-3 bg-white rounded-full" />
                <span className="w-0.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            <div>
              <h1 className="font-display text-base font-extrabold tracking-tight text-analog-primary leading-tight">
                StrumGuide
              </h1>
              <p className="font-sans text-[11px] font-medium text-analog-secondary leading-tight">
                Guitar Rhythm Trainer
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-analog-accent text-white shadow-sm'
                      : 'text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? 'text-white' : 'text-analog-secondary'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {/* Active playing indicator */}
                  {item.id === 'practice' && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom subtle acoustic guitar preview watermark & engine status */}
        <div className="pt-4 border-t border-analog-border/50">
          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-analog-secondary">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-strum-down animate-pulse' : 'bg-analog-border'}`} />
              <span>{isPlaying ? 'ACTIVE SYNC' : 'STANDBY'}</span>
            </span>
            <span>v2.0 PRO</span>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE BOTTOM NAVIGATION BAR (with iOS safe-area padding)
      ────────────────────────────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-analog-border bg-analog-surface/95 backdrop-blur-md px-1.5 sm:px-3 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around z-50 shadow-lg select-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center py-1 px-1 sm:px-2 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'text-analog-accent font-bold scale-105'
                  : 'text-analog-secondary hover:text-analog-primary active:scale-95'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="font-mono text-[8.5px] sm:text-[9.5px] mt-0.5 truncate max-w-[48px] sm:max-w-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
