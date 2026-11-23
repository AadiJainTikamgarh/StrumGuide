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
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-3 shadow-md flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Left: Pattern Selector & Favorite */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <select
            value={currentPattern.id}
            onChange={(e) => {
              const found = PRESET_PATTERNS.find((p) => p.id === e.target.value);
              if (found) onSelectPattern(found);
            }}
            className="appearance-none px-3.5 py-1.5 pr-8 rounded-xl bg-analog-bg border border-analog-border font-display text-xs font-bold text-analog-primary cursor-pointer hover:border-analog-secondary"
          >
            {PRESET_PATTERNS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-analog-secondary absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        <button
          className="p-1.5 rounded-lg text-analog-secondary hover:text-analog-accent transition cursor-pointer"
          title="Favorite pattern"
        >
          <Star className="w-4 h-4 fill-analog-accent text-analog-accent" />
        </button>
      </div>

      {/* Center: Tape Transport Controls with Large Circular Play Button */}
      <div className="flex items-center space-x-2.5">
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
          className="w-12 h-12 rounded-full bg-analog-accent text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
          className={`p-2 rounded-xl transition cursor-pointer ${
            loopEnabled
              ? 'text-analog-accent bg-analog-accent/10'
              : 'text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated'
          }`}
          title="Continuous Loop"
        >
          <Repeat className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Speed Trainer Pill */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSpeedTrainer}
          className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 font-display text-xs font-bold transition cursor-pointer ${
            speedTrainer.enabled
              ? 'bg-analog-accent/10 border-analog-accent text-analog-accent'
              : 'bg-analog-bg border-analog-border text-analog-secondary hover:text-analog-primary'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Speed Trainer</span>

          {/* Toggle Switch */}
          <div
            className={`w-7 h-4 rounded-full transition-colors relative shrink-0 ${
              speedTrainer.enabled ? 'bg-analog-accent' : 'bg-analog-border'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                speedTrainer.enabled ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
