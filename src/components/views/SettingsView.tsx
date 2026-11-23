'use client';

import React from 'react';
import { Sliders, Keyboard, Cpu } from 'lucide-react';
import { ThemeToggleCapsule } from '@/components/analog/ThemeToggleCapsule';

interface SettingsViewProps {
  isDarkMode: boolean;
  countInBeats: 3 | 4;
  onToggleTheme: () => void;
  onCountInBeatsChange: (beats: 3 | 4) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  countInBeats,
  onToggleTheme,
  onCountInBeatsChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile">
        <div className="flex items-center space-x-2 text-analog-secondary font-display text-[10px] font-bold uppercase tracking-widest mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Hardware Configuration</span>
        </div>
        <h2 className="font-display text-2xl font-black text-analog-primary tracking-tight">
          System Preferences & Calibration
        </h2>
        <p className="font-sans text-xs text-analog-secondary mt-1 max-w-xl">
          Configure physical aesthetic theme, timing count-in defaults, Web Audio sample engine parameters, and reference keyboard shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Visual Identity & Theme */}
        <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-analog-border/50 pb-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
              Visual Equipment Finish
            </span>
            <span className="font-mono text-[9px] text-analog-secondary">COLOR SYSTEM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-analog-bg border border-analog-border">
            <div>
              <span className="font-display text-sm font-bold text-analog-primary block">
                {isDarkMode ? 'Dark Charcoal Bronze (#20211E)' : 'Modern Warm Cream (#F4F0E7)'}
              </span>
              <span className="font-sans text-xs text-analog-secondary">
                {isDarkMode
                  ? 'High-contrast studio stage aesthetic'
                  : 'Warm analog paper & vintage gear aesthetic'}
              </span>
            </div>

            <ThemeToggleCapsule
              isDarkMode={isDarkMode}
              onToggleTheme={onToggleTheme}
            />
          </div>

          {/* Pre-roll count-in preference */}
          <div className="flex items-center justify-between p-3 rounded-md bg-analog-bg border border-analog-border">
            <div>
              <span className="font-display text-sm font-bold text-analog-primary block">
                Default Pre-Roll Count-In
              </span>
              <span className="font-sans text-xs text-analog-secondary">
                Metronome count clicks before playback begins
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label="Default count-in beats"
              className="flex items-center p-1 rounded-xl bg-analog-surface border border-analog-border shadow-inner font-mono text-xs"
            >
              <button
                type="button"
                role="radio"
                aria-checked={countInBeats === 3}
                onClick={() => onCountInBeatsChange(3)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  countInBeats === 3
                    ? 'bg-analog-accent text-white shadow-2xs font-black'
                    : 'text-analog-secondary hover:text-analog-primary'
                }`}
              >
                3 BEATS
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={countInBeats === 4}
                onClick={() => onCountInBeatsChange(4)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  countInBeats === 4
                    ? 'bg-analog-accent text-white shadow-2xs font-black'
                    : 'text-analog-secondary hover:text-analog-primary'
                }`}
              >
                4 BEATS
              </button>
            </div>
          </div>
        </div>

        {/* Audio Engine Specs */}
        <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-analog-border/50 pb-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
              Audio Engine Telemetry
            </span>
            <div className="flex items-center space-x-1 font-mono text-[9px] text-strum-down">
              <Cpu className="w-3 h-3" />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1.5 border-b border-analog-border/40">
              <span className="text-analog-secondary">Architecture</span>
              <span className="font-bold text-analog-primary">Web Audio API (Lookahead Scheduler)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-analog-border/40">
              <span className="text-analog-secondary">Timing Precision</span>
              <span className="font-bold text-analog-primary">Sample-Accurate (&lt; 0.1ms jitter)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-analog-border/40">
              <span className="text-analog-secondary">Lookahead Window</span>
              <span className="font-bold text-analog-primary">120ms (interval: 25ms)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-analog-secondary">Synthesis Model</span>
              <span className="font-bold text-analog-primary">Physical Modeling Karplus-Strong</span>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="md:col-span-2 rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-analog-border pb-2">
            <div className="flex items-center space-x-2">
              <Keyboard className="w-4 h-4 text-analog-accent" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
                Instrument Keyboard Shortcuts
              </span>
            </div>
            <span className="font-mono text-[9px] text-analog-secondary">TACTILE HOTKEYS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">Start / Pause</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                Spacebar
              </kbd>
            </div>
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">Tap Tempo</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                T
              </kbd>
            </div>
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">BPM Fine Step</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                ← / →
              </kbd>
            </div>
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">BPM Coarse (±5)</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                Shift + ← / →
              </kbd>
            </div>
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">Undo Pattern Edit</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                Ctrl + Z
              </kbd>
            </div>
            <div className="p-2.5 rounded bg-analog-bg border border-analog-border flex items-center justify-between">
              <span className="text-analog-secondary">Redo Pattern Edit</span>
              <kbd className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border font-bold text-analog-primary shadow-2xs">
                Ctrl + Y
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
