'use client';

import React from 'react';
import { Play, Pause, Square, RotateCcw, Repeat, Flame } from 'lucide-react';
import { SpeedTrainerConfig } from '@/types/strum';

interface TransportConsoleProps {
  isPlaying: boolean;
  loopEnabled: boolean;
  speedTrainer: SpeedTrainerConfig;
  currentBar: number;
  onTogglePlay: () => void;
  onStop: () => void;
  onRestart: () => void;
  onToggleLoop: () => void;
  onToggleSpeedTrainer: () => void;
}

export const TransportConsole: React.FC<TransportConsoleProps> = ({
  isPlaying,
  loopEnabled,
  speedTrainer,
  currentBar,
  onTogglePlay,
  onStop,
  onRestart,
  onToggleLoop,
  onToggleSpeedTrainer,
}) => {
  return (
    <div className="relative w-full rounded-lg border border-analog-border bg-analog-surface p-3 shadow-tactile select-none flex flex-wrap items-center justify-between gap-4">
      {/* Corner machine screws */}
      <div className="absolute top-1.5 left-1.5 machine-screw" />
      <div className="absolute top-1.5 right-1.5 machine-screw" />
      <div className="absolute bottom-1.5 left-1.5 machine-screw" />
      <div className="absolute bottom-1.5 right-1.5 machine-screw" />

      {/* Primary Tape Transport Strip */}
      <div className="flex items-center space-x-2 pl-3">
        {/* Large Master Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          className={`h-11 px-5 rounded-md font-display font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition cursor-pointer shadow-tactile ${
            isPlaying
              ? 'bg-analog-accent text-white border-2 border-analog-accent hover:opacity-95'
              : 'bg-analog-accent text-white border-2 border-analog-accent hover:opacity-95'
          }`}
          title="Play / Pause (Spacebar)"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white stroke-none" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white stroke-none translate-x-0.5" />
              <span>START PLAYBACK</span>
            </>
          )}
        </button>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="h-11 px-3 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated active:bg-analog-border text-analog-primary flex items-center space-x-1 font-display text-xs font-semibold transition cursor-pointer shadow-xs"
          title="Stop & Reset to Beat 1"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">STOP</span>
        </button>

        {/* Restart / Rewind Button */}
        <button
          onClick={onRestart}
          className="h-11 px-3 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated active:bg-analog-border text-analog-primary flex items-center space-x-1 font-display text-xs font-semibold transition cursor-pointer shadow-xs"
          title="Restart from Beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESTART</span>
        </button>
      </div>

      {/* Auxiliary Switches & Tape Counter */}
      <div className="flex items-center space-x-3 pr-3">
        {/* Loop Toggle */}
        <button
          onClick={onToggleLoop}
          className={`h-9 px-3 rounded border text-xs font-mono font-bold flex items-center space-x-1.5 transition cursor-pointer ${
            loopEnabled
              ? 'bg-analog-elevated border-analog-primary text-analog-primary'
              : 'border-analog-border text-analog-secondary hover:text-analog-primary'
          }`}
          title="Continuous Loop Mode"
        >
          <Repeat className="w-3 h-3" />
          <span>LOOP: {loopEnabled ? 'ON' : '1x'}</span>
        </button>

        {/* Speed Trainer Toggle */}
        <button
          onClick={onToggleSpeedTrainer}
          className={`h-9 px-3 rounded border text-xs font-display font-bold uppercase tracking-wider flex items-center space-x-1.5 transition cursor-pointer ${
            speedTrainer.enabled
              ? 'bg-analog-accent/15 border-analog-accent text-analog-accent'
              : 'border-analog-border text-analog-secondary hover:text-analog-primary'
          }`}
          title="Auto-accelerando BPM trainer"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>SPEED TRAINER</span>
        </button>

        {/* Tape Bar Counter Display */}
        <div className="px-3 py-1.5 rounded bg-analog-bg border border-analog-border font-mono text-xs flex items-center space-x-1.5 text-analog-secondary">
          <span className="text-[10px] uppercase font-bold text-analog-secondary/70">BAR</span>
          <span className="font-bold text-analog-primary">{isPlaying ? currentBar + 1 : '1'}</span>
        </div>
      </div>
    </div>
  );
};
