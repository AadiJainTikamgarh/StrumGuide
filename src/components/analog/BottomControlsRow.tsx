'use client';

import React, { useState } from 'react';
import { Music2, Sliders, BarChart2, Plus, Guitar, BellRing, ChevronDown, Trash2 } from 'lucide-react';
import { AudioSettings, ChordMode } from '@/types/strum';
import { ToggleSwitch } from './ToggleSwitch';

const ALL_CHORDS = ['G', 'C', 'D', 'Em', 'Am', 'E', 'A', 'F', 'Dm'];

interface BottomControlsRowProps {
  chordMode: ChordMode;
  singleChord: string;
  progression: string[];
  activeBarIndex: number;
  isPlaying: boolean;
  audioSettings: AudioSettings;
  countInBeats: 3 | 4;
  onChordModeChange: (mode: ChordMode) => void;
  onSelectSingleChord: (chord: string) => void;
  onChordChange: (barIndex: number, chordName: string) => void;
  onAddBar: () => void;
  onRemoveBar?: (barIndex: number) => void;
  onAudioSettingsChange: (settings: AudioSettings) => void;
  onCountInBeatsChange: (beats: 3 | 4) => void;
}

export const BottomControlsRow: React.FC<BottomControlsRowProps> = ({
  chordMode,
  singleChord,
  progression,
  activeBarIndex,
  isPlaying,
  audioSettings,
  countInBeats,
  onChordModeChange,
  onSelectSingleChord,
  onChordChange,
  onAddBar,
  onRemoveBar,
  onAudioSettingsChange,
  onCountInBeatsChange,
}) => {
  const [editingBarIndex, setEditingBarIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch select-none min-w-0">
      {/* ─────────────────────────────────────────────────────────────
          1. CHORD CONTROL CARD (Single Chord vs Progression) (5 cols)
      ────────────────────────────────────────────────────────────── */}
      <div className="md:col-span-2 lg:col-span-5 rounded-2xl border border-analog-border bg-analog-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-analog-primary">
            <Music2 className="w-4 h-4 text-analog-secondary shrink-0" />
            <h3 className="font-display text-sm font-bold tracking-tight">
              {chordMode === 'single' ? 'Single Chord' : 'Chord Progression'}
            </h3>
          </div>

          {/* Segmented Mode Switcher */}
          <div
            role="radiogroup"
            aria-label="Chord playback mode"
            className="flex items-center p-1 rounded-xl bg-analog-bg/90 border border-analog-border shadow-inner shrink-0"
          >
            <button
              type="button"
              role="radio"
              aria-checked={chordMode === 'single'}
              onClick={() => onChordModeChange('single')}
              className={`px-3 py-1 rounded-lg text-[11px] font-display font-bold transition-all cursor-pointer ${
                chordMode === 'single'
                  ? 'bg-analog-accent text-white shadow-2xs font-black'
                  : 'text-analog-secondary hover:text-analog-primary'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={chordMode === 'progression'}
              onClick={() => onChordModeChange('progression')}
              className={`px-3 py-1 rounded-lg text-[11px] font-display font-bold transition-all cursor-pointer ${
                chordMode === 'progression'
                  ? 'bg-analog-accent text-white shadow-2xs font-black'
                  : 'text-analog-secondary hover:text-analog-primary'
              }`}
            >
              Progression
            </button>
          </div>
        </div>

        {/* Content based on selected mode */}
        {chordMode === 'single' ? (
          /* Single Chord Quick Selector */
          <div className="space-y-2.5 py-0.5">
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5">
              {ALL_CHORDS.map((ch) => {
                const isSelected = singleChord === ch;
                return (
                  <button
                    key={ch}
                    onClick={() => onSelectSingleChord(ch)}
                    className={`py-2 px-1 rounded-xl font-display text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-analog-accent text-white shadow-sm ring-2 ring-analog-accent/40 scale-105 font-black'
                        : 'bg-analog-elevated/70 border border-analog-border text-analog-primary hover:border-analog-secondary'
                    }`}
                  >
                    <span className="leading-none">{ch}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-sans text-analog-secondary px-0.5">
              <span>
                Looping: <strong className="text-analog-primary font-mono font-bold">{singleChord}</strong> on every bar
              </span>
              <span className="font-mono text-[10px] text-analog-olive font-bold">1 CHORD LOCKED</span>
            </div>
          </div>
        ) : (
          /* Multi-bar Progression Breadcrumb */
          <div className="space-y-2 py-0.5">
            <div className="flex items-center flex-wrap gap-2">
              {progression.map((chord, idx) => {
                const isActive = isPlaying && activeBarIndex % progression.length === idx;
                const isEditing = editingBarIndex === idx;

                return (
                  <React.Fragment key={`prog-${idx}`}>
                    <div className="relative">
                      <button
                        onClick={() => setEditingBarIndex(isEditing ? null : idx)}
                        className={`px-3.5 py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
                          isActive
                            ? 'bg-analog-accent text-white shadow-sm ring-2 ring-analog-accent/40 scale-105 font-black'
                            : isEditing
                            ? 'bg-analog-surface border-2 border-analog-accent text-analog-primary'
                            : 'bg-analog-elevated/70 border border-analog-border text-analog-primary hover:border-analog-secondary'
                        }`}
                        title="Click to change chord"
                      >
                        <span className="font-display text-sm font-black leading-none">{chord}</span>
                        <span className={`font-mono text-[9px] mt-0.5 ${isActive ? 'text-white/80' : 'text-analog-secondary'}`}>
                          Bar {idx + 1}
                        </span>
                      </button>

                      {/* Dropdown to change chord for this bar */}
                      {isEditing && (
                        <div className="absolute top-full left-0 mt-1.5 z-30 p-1.5 bg-analog-surface border border-analog-border rounded-xl shadow-lg grid grid-cols-3 gap-1 w-36">
                          {ALL_CHORDS.map((ch) => (
                            <button
                              key={ch}
                              onClick={() => {
                                onChordChange(idx, ch);
                                setEditingBarIndex(null);
                              }}
                              className={`p-1.5 rounded-lg text-xs font-display font-bold text-center transition cursor-pointer ${
                                chord === ch
                                  ? 'bg-analog-accent text-white'
                                  : 'hover:bg-analog-elevated text-analog-primary'
                              }`}
                            >
                              {ch}
                            </button>
                          ))}
                          {progression.length > 1 && onRemoveBar && (
                            <button
                              onClick={() => {
                                onRemoveBar(idx);
                                setEditingBarIndex(null);
                              }}
                              className="col-span-3 mt-1 pt-1 border-t border-analog-border text-[10px] text-analog-accent hover:underline flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove Bar</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {idx < progression.length - 1 && (
                      <span className="text-analog-secondary font-mono text-xs font-bold">›</span>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Add Chord Bar Button */}
              {progression.length < 8 && (
                <>
                  <span className="text-analog-secondary font-mono text-xs font-bold">›</span>
                  <button
                    onClick={onAddBar}
                    className="w-9 h-9 rounded-xl border border-dashed border-analog-border bg-analog-bg hover:bg-analog-elevated flex items-center justify-center text-analog-secondary hover:text-analog-primary transition cursor-pointer"
                    title="Add chord bar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <p className="font-sans text-[11px] text-analog-secondary px-0.5">
              Click any bar to change its chord. Progresses sequentially across bars.
            </p>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. AUDIO MIX CARD (4 cols on desktop, 1 col on tablet)
      ────────────────────────────────────────────────────────────── */}
      <div className="md:col-span-1 lg:col-span-4 rounded-2xl border border-analog-border bg-analog-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center space-x-2 text-analog-primary">
          <Sliders className="w-4 h-4 text-analog-secondary" />
          <h3 className="font-display text-sm font-bold tracking-tight">Audio Mix</h3>
        </div>

        <div className="space-y-2.5">
          {/* Channel 1: Guitar Acoustics */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-analog-bg/60 border border-analog-border/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Guitar className="w-4 h-4 text-analog-secondary shrink-0" />
                <span className="font-sans text-xs font-bold text-analog-primary">Guitar</span>
              </div>

              {/* Orange Toggle Switch */}
              <ToggleSwitch
                size="md"
                checked={!audioSettings.isGuitarMuted}
                onChange={(enabled) =>
                  onAudioSettingsChange({
                    ...audioSettings,
                    isGuitarMuted: !enabled,
                  })
                }
                label={audioSettings.isGuitarMuted ? 'Unmute Guitar sound' : 'Mute Guitar sound'}
              />
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Slider */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                disabled={audioSettings.isGuitarMuted}
                value={audioSettings.guitarVolume}
                onChange={(e) =>
                  onAudioSettingsChange({
                    ...audioSettings,
                    guitarVolume: parseFloat(e.target.value),
                  })
                }
                className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-accent ${
                  audioSettings.isGuitarMuted ? 'opacity-40' : ''
                }`}
              />
              <span className="font-mono text-xs font-bold text-analog-secondary w-8 text-right shrink-0">
                {audioSettings.isGuitarMuted ? '0%' : `${Math.round(audioSettings.guitarVolume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Channel 2: Metronome Click */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-analog-bg/60 border border-analog-border/70 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellRing className="w-4 h-4 text-analog-secondary shrink-0" />
                <span className="font-sans text-xs font-bold text-analog-primary">Metronome</span>
              </div>

              {/* Orange Toggle Switch */}
              <ToggleSwitch
                size="md"
                checked={!audioSettings.isMetronomeMuted}
                onChange={(enabled) =>
                  onAudioSettingsChange({
                    ...audioSettings,
                    isMetronomeMuted: !enabled,
                  })
                }
                label={audioSettings.isMetronomeMuted ? 'Unmute Metronome click' : 'Mute Metronome click'}
              />
            </div>

            <div className="flex items-center space-x-2.5">
              {/* Slider */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                disabled={audioSettings.isMetronomeMuted}
                value={audioSettings.metronomeVolume}
                onChange={(e) =>
                  onAudioSettingsChange({
                    ...audioSettings,
                    metronomeVolume: parseFloat(e.target.value),
                  })
                }
                className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-accent ${
                  audioSettings.isMetronomeMuted ? 'opacity-40' : ''
                }`}
              />
              <span className="font-mono text-xs font-bold text-analog-secondary w-8 text-right shrink-0">
                {audioSettings.isMetronomeMuted ? '0%' : `${Math.round(audioSettings.metronomeVolume * 100)}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. COUNT-IN CARD (3 cols on desktop, 1 col on tablet)
      ────────────────────────────────────────────────────────────── */}
      <div className="md:col-span-1 lg:col-span-3 rounded-2xl border border-analog-border bg-analog-surface p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
        <div className="flex items-center space-x-2 text-analog-primary">
          <BarChart2 className="w-4 h-4 text-analog-secondary" />
          <h3 className="font-display text-sm font-bold tracking-tight">Count-In</h3>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-analog-bg/60 border border-analog-border/70 flex items-center justify-between gap-3">
          {/* Beats Dropdown */}
          <div className="relative flex-1 min-w-0">
            <span className="font-mono text-[9px] text-analog-secondary uppercase block mb-1">Lead-In</span>
            <select
              value={countInBeats}
              onChange={(e) => onCountInBeatsChange(Number(e.target.value) as 3 | 4)}
              className="appearance-none w-full px-3 py-1.5 pr-6 rounded-lg bg-analog-bg border border-analog-border font-display text-xs font-bold text-analog-primary cursor-pointer truncate"
            >
              <option value={4}>4 Beats</option>
              <option value={3}>3 Beats</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-analog-secondary absolute right-2 top-6 pointer-events-none" />
          </div>

          {/* Orange Toggle Switch */}
          <div className="flex flex-col items-center justify-center pt-3">
            <ToggleSwitch
              size="md"
              checked={audioSettings.countInEnabled}
              onChange={(enabled) =>
                onAudioSettingsChange({
                  ...audioSettings,
                  countInEnabled: enabled,
                })
              }
              label={audioSettings.countInEnabled ? 'Disable Pre-Roll Count-In' : 'Enable Pre-Roll Count-In'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
