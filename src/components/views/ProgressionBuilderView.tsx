'use client';

import React from 'react';
import { Layers, ArrowRight, Play, Plus, Trash2 } from 'lucide-react';
import { COMMON_PROGRESSIONS, CHORD_LIBRARY } from '@/constants/chords';
import { AnalogChordCard } from '@/components/analog/AnalogChordCard';

interface ProgressionBuilderViewProps {
  progression: string[];
  activeBarIndex: number;
  isPlaying: boolean;
  onProgressionChange: (newProg: string[]) => void;
  onPlayChordSound: (chord: string) => void;
  onApplyAndPractice: () => void;
}

export const ProgressionBuilderView: React.FC<ProgressionBuilderViewProps> = ({
  progression,
  activeBarIndex,
  isPlaying,
  onProgressionChange,
  onPlayChordSound,
  onApplyAndPractice,
}) => {
  const handleChordChange = (index: number, chordName: string) => {
    const next = [...progression];
    next[index] = chordName;
    onProgressionChange(next);
  };

  const handleAddBar = () => {
    if (progression.length < 8) {
      onProgressionChange([...progression, 'G']);
    }
  };

  const handleRemoveBar = () => {
    if (progression.length > 2) {
      onProgressionChange(progression.slice(0, -1));
    }
  };

  const handleLoadPreset = (chords: string[]) => {
    onProgressionChange(chords);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-analog-olive font-display text-[10px] font-bold uppercase tracking-widest mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Bar Architecture</span>
            </div>
            <h2 className="font-display text-2xl font-black text-analog-primary tracking-tight">
              Chord Progression Builder
            </h2>
            <p className="font-sans text-xs text-analog-secondary mt-1 max-w-xl">
              Arrange sequential chord bars for full-song strumming practice. Choose from proven harmonic templates or construct your own custom progression.
            </p>
          </div>

          <button
            onClick={onApplyAndPractice}
            className="px-4 py-2.5 rounded bg-analog-accent text-white font-display text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm hover:opacity-95 transition cursor-pointer self-start md:self-auto"
          >
            <span>APPLY TO PRACTICE STUDIO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Progression Templates */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-5 shadow-tactile space-y-3">
        <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary block border-b border-analog-border/50 pb-2">
          Classic Chord Progression Presets
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_PROGRESSIONS.map((prog) => (
            <div
              key={prog.name}
              onClick={() => handleLoadPreset(prog.chords)}
              className="p-3.5 rounded-md border border-analog-border bg-analog-bg/60 hover:border-analog-accent hover:bg-analog-elevated transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="font-display text-xs font-bold text-analog-primary">
                  {prog.name}
                </span>
                <div className="flex items-center space-x-2 mt-2 font-mono text-sm font-black text-analog-accent">
                  {prog.chords.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-analog-surface border border-analog-border">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <span className="font-mono text-[9px] text-analog-secondary mt-3">
                Click to load template →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Active Progression Sequencer Grid */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
        <div className="flex items-center justify-between border-b border-analog-border pb-3">
          <div>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
              Active Progression Sequence ({progression.length} Bars)
            </span>
            <span className="font-mono text-[10px] text-analog-secondary block mt-0.5">
              Bar loops automatically into the next during metronome playback
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRemoveBar}
              disabled={progression.length <= 2}
              className="px-2.5 py-1 rounded border border-analog-border bg-analog-bg hover:bg-analog-elevated text-analog-secondary font-mono text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              - Remove Bar
            </button>
            <button
              onClick={handleAddBar}
              disabled={progression.length >= 8}
              className="px-2.5 py-1 rounded border border-analog-border bg-analog-bg hover:bg-analog-elevated text-analog-primary font-mono text-xs font-bold disabled:opacity-30 cursor-pointer"
            >
              + Add Bar
            </button>
          </div>
        </div>

        {/* Horizontal Progression Bar Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {progression.map((chord, index) => (
            <div key={`prog-builder-${index}`} className="flex flex-col space-y-2">
              <AnalogChordCard
                chordName={chord}
                barNumber={index + 1}
                isActive={isPlaying && activeBarIndex % progression.length === index}
                onSelectChord={(newChord) => handleChordChange(index, newChord)}
                onPreviewSound={onPlayChordSound}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
