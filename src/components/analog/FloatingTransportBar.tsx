'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Star,
  Rocket,
  ChevronDown,
} from 'lucide-react';
import { StrumPattern, SpeedTrainerConfig } from '@/types/strum';
import { PRESET_PATTERNS } from '@/constants/presets';
import { ToggleSwitch } from './ToggleSwitch';

interface FloatingTransportBarProps {
  currentPattern: StrumPattern;
  isPlaying: boolean;
  loopEnabled: boolean;
  speedTrainer: SpeedTrainerConfig;
  onSelectPattern: (pattern: StrumPattern) => void;
  onTogglePlay: () => void;
  onRestart: () => void;
  onToggleLoop: () => void;
  onToggleSpeedTrainer: () => void;
}

export const FloatingTransportBar: React.FC<FloatingTransportBarProps> = ({
  currentPattern,
  isPlaying,
  loopEnabled,
  speedTrainer,
  onSelectPattern,
  onTogglePlay,
  onRestart,
  onToggleLoop,
  onToggleSpeedTrainer,
}) => {
  return (
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-3 sm:p-3.5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 select-none min-w-0">
      {/* Top Mobile Row: Pattern Selector & Speed Trainer on mobile */}
      <div className="flex sm:contents items-center justify-between w-full gap-2">
        {/* Left: Pattern Selector & Favorite */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="relative min-w-0">
            <select
              value={currentPattern.id}
              onChange={(e) => {
                const found = PRESET_PATTERNS.find((p) => p.id === e.target.value);
                if (found) onSelectPattern(found);
              }}
              className="appearance-none px-3 py-1.5 pr-7 sm:px-3.5 sm:pr-8 rounded-xl bg-analog-bg border border-analog-border font-display text-xs font-bold text-analog-primary cursor-pointer hover:border-analog-secondary truncate max-w-[170px] sm:max-w-none"
            >
              {PRESET_PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-analog-secondary absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <button
            className="p-1.5 rounded-lg text-analog-secondary hover:text-analog-accent transition cursor-pointer shrink-0"
            title="Favorite pattern"
          >
            <Star className="w-4 h-4 fill-analog-accent text-analog-accent" />
          </button>
        </div>

        {/* Speed Trainer for Mobile (shown on mobile, hidden on sm+) */}
        <div className="flex sm:hidden items-center shrink-0">
          <div
            role="button"
            tabIndex={0}
            onClick={onToggleSpeedTrainer}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onToggleSpeedTrainer();
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center space-x-2 font-display text-xs font-bold transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              speedTrainer.enabled
                ? 'bg-analog-accent/10 border-analog-accent/60 text-analog-accent shadow-2xs'
                : 'bg-analog-bg border-analog-border text-analog-secondary hover:text-analog-primary'
            }`}
            title="Toggle Speed Trainer"
          >
            <Rocket className={`w-3.5 h-3.5 ${speedTrainer.enabled ? 'text-analog-accent' : 'text-analog-secondary'}`} />
            <ToggleSwitch
              size="sm"
              checked={speedTrainer.enabled}
              onChange={onToggleSpeedTrainer}
              label="Toggle Speed Trainer"
            />
          </div>
        </div>
      </div>

      {/* Center: Tape Transport Controls with Large Circular Play Button */}
      <div className="flex items-center justify-center space-x-2 sm:space-x-2.5">
        {/* Reset / Loop */}
        <button
          onClick={onRestart}
          className="p-2 rounded-xl text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated transition cursor-pointer"
          title="Return to start"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Skip Back */}
        <button
          onClick={onRestart}
          className="p-2 rounded-xl text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated transition cursor-pointer"
          title="Previous measure"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Big Circular Orange Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-analog-accent text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Play / Pause (Spacebar)"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white stroke-none" />
          ) : (
            <Play className="w-5 h-5 fill-white stroke-none ml-0.5" />
          )}
        </button>

        {/* Skip Forward */}
        <button
          className="p-2 rounded-xl text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated transition cursor-pointer"
          title="Next measure"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Repeat Loop Toggle */}
        <button
          onClick={onToggleLoop}
          role="switch"
          aria-checked={loopEnabled}
          aria-label="Toggle continuous loop"
          className={`p-2 rounded-xl transition-all cursor-pointer relative ${
            loopEnabled
              ? 'text-analog-accent bg-analog-accent/15 border border-analog-accent/40 shadow-2xs font-bold'
              : 'text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated border border-transparent'
          }`}
          title={loopEnabled ? 'Continuous Loop Active - Click to disable' : 'Click to enable Continuous Loop'}
        >
          <Repeat className="w-4 h-4" />
          {loopEnabled && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-analog-accent" />
          )}
        </button>
      </div>

      {/* Right: Speed Trainer Pill (shown on sm+ desktop/tablet) */}
      <div className="hidden sm:flex items-center space-x-2">
        <div
          role="button"
          tabIndex={0}
          onClick={onToggleSpeedTrainer}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              onToggleSpeedTrainer();
            }
          }}
          className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2.5 font-display text-xs font-bold transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
            speedTrainer.enabled
              ? 'bg-analog-accent/10 border-analog-accent/60 text-analog-accent shadow-2xs'
              : 'bg-analog-bg border-analog-border text-analog-secondary hover:text-analog-primary hover:border-analog-secondary/60'
          }`}
          title="Toggle Speed Trainer (gradually increases tempo every 2 bars)"
        >
          <Rocket className={`w-3.5 h-3.5 transition-colors ${speedTrainer.enabled ? 'text-analog-accent' : 'text-analog-secondary'}`} />
          <span className="font-display text-xs font-bold">Speed Trainer</span>

          {/* Toggle Switch */}
          <ToggleSwitch
            size="sm"
            checked={speedTrainer.enabled}
            onChange={onToggleSpeedTrainer}
            label="Toggle Speed Trainer"
          />
        </div>
      </div>
    </div>
  );
};
