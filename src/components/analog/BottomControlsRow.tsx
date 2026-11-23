'use client';

import React, { useState } from 'react';
import { Music2, Sliders, BarChart2, Plus, Guitar, BellRing, ChevronDown } from 'lucide-react';
import { AudioSettings, ChordMode } from '@/types/strum';
import { ALL_CHORDS, CHORD_LIBRARY } from '@/constants/chords';
import { ToggleSwitch } from './ToggleSwitch';
import { ChordPickerModal } from './ChordPickerModal';

const CHORD_GROUPS: Record<string, string[]> = {
  Essential: ['G', 'C', 'D', 'Em', 'Am', 'E', 'A', 'F', 'Dm', 'Bm'],
  Major: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cadd9', 'Cmaj7', 'Fmaj7', 'Gmaj7'],
  Minor: ['Am', 'Bm', 'Dm', 'Em', 'F#m'],
  '7th': ['A7', 'B7', 'C7', 'D7', 'E7', 'G7', 'Am7', 'Dm7', 'Em7'],
  'Sus/Add': ['Dsus4', 'Dsus2', 'Asus4', 'Asus2', 'Cadd9'],
  All: ALL_CHORDS,
};

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
  onPreviewSound?: (chordName: string) => void;
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
  onPreviewSound,
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
          /* Single Chord Quick Selector with Dropdown */
          <div className="space-y-2.5 py-0.5">
            <div className="flex items-center space-x-3">
              {/* Selected Chord Badge with large bold lettering */}
              <div className="w-14 h-12 rounded-xl bg-analog-accent text-white flex flex-col items-center justify-center shrink-0 shadow-xs ring-2 ring-analog-accent/30">
                <span className="font-display text-xl font-black leading-none">{singleChord}</span>
                <span className="font-mono text-[8px] opacity-80 mt-0.5 uppercase tracking-wider">
                  {CHORD_LIBRARY[singleChord]?.category || 'Major'}
                </span>
              </div>

              {/* Native Dropdown Selector */}
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] text-analog-secondary uppercase tracking-wider font-bold">
                    Chord Voicing
                  </span>
                  <span className="font-mono text-[9px] text-analog-secondary truncate max-w-[140px]">
                    {CHORD_LIBRARY[singleChord]?.displayName || singleChord}
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={singleChord}
                    onChange={(e) => onSelectSingleChord(e.target.value)}
                    className="appearance-none w-full px-3 py-1.5 pr-8 rounded-xl bg-analog-bg border border-analog-border font-display text-xs font-bold text-analog-primary cursor-pointer hover:border-analog-secondary/70 focus:outline-none focus:ring-2 focus:ring-analog-accent truncate"
                  >
                    <optgroup label="Essential Open Chords">
                      {CHORD_GROUPS.Essential.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch} — {CHORD_LIBRARY[ch]?.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Major Chords">
                      {CHORD_GROUPS.Major.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch} — {CHORD_LIBRARY[ch]?.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Minor Chords">
                      {CHORD_GROUPS.Minor.map((ch) => (
                        <option key={ch} value={ch}>
                          {ch} — {CHORD_LIBRARY[ch]?.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="7th Chords">
                      {CHORD_GROUPS['7th'].map((ch) => (
                        <option key={ch} value={ch}>
                          {ch} — {CHORD_LIBRARY[ch]?.displayName}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Suspended & Add Chords">
                      {CHORD_GROUPS['Sus/Add'].map((ch) => (
                        <option key={ch} value={ch}>
                          {ch} — {CHORD_LIBRARY[ch]?.displayName}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown className="w-4 h-4 text-analog-secondary absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>
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

                return (
                  <React.Fragment key={`prog-${idx}`}>
                    <button
                      onClick={() => setEditingBarIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
                        isActive
                          ? 'bg-analog-accent text-white shadow-sm ring-2 ring-analog-accent/40 scale-105 font-black'
                          : 'bg-analog-elevated/70 border border-analog-border text-analog-primary hover:border-analog-accent hover:bg-analog-surface'
                      }`}
                      title="Click to change chord in modal"
                    >
                      <span className="font-display text-sm font-black leading-none">{chord}</span>
                      <span className={`font-mono text-[9px] mt-0.5 ${isActive ? 'text-white/80' : 'text-analog-secondary'}`}>
                        Bar {idx + 1}
                      </span>
                    </button>

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
              Click any bar to change its chord in the chord library modal.
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

        <div className="space-y-3 py-1">
          {/* Channel 1: Guitar Acoustics */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs">
            {/* Label column: fixed width of 90px ensures "Guitar" and "Metronome" never push the toggle */}
            <div className="flex items-center space-x-1.5 w-[88px] sm:w-24 shrink-0">
              <Guitar className="w-4 h-4 text-analog-secondary shrink-0" />
              <span className="font-sans text-xs font-bold text-analog-primary truncate">Guitar</span>
            </div>

            {/* Tactile Toggle Switch */}
            <div className="shrink-0">
              <ToggleSwitch
                size="sm"
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

            {/* Volume Fader */}
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
              className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-accent min-w-[50px] ${
                audioSettings.isGuitarMuted ? 'opacity-40' : ''
              }`}
            />
            <span className="font-mono text-xs font-bold text-analog-secondary w-7 text-right shrink-0">
              {audioSettings.isGuitarMuted ? '0%' : `${Math.round(audioSettings.guitarVolume * 100)}%`}
            </span>
          </div>

          {/* Channel 2: Metronome Click */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs">
            {/* Label column: fixed width of 90px ensures "Metronome" (9 chars) NEVER collides with toggle */}
            <div className="flex items-center space-x-1.5 w-[88px] sm:w-24 shrink-0">
              <BellRing className="w-4 h-4 text-analog-secondary shrink-0" />
              <span className="font-sans text-xs font-bold text-analog-primary truncate">Metronome</span>
            </div>

            {/* Tactile Toggle Switch */}
            <div className="shrink-0">
              <ToggleSwitch
                size="sm"
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

            {/* Volume Fader */}
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
              className={`flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-accent min-w-[50px] ${
                audioSettings.isMetronomeMuted ? 'opacity-40' : ''
              }`}
            />
            <span className="font-mono text-xs font-bold text-analog-secondary w-7 text-right shrink-0">
              {audioSettings.isMetronomeMuted ? '0%' : `${Math.round(audioSettings.metronomeVolume * 100)}%`}
            </span>
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

        <div className="space-y-2 py-0.5">
          <div className="flex items-center justify-between gap-3">
            {/* Beats Dropdown */}
            <div className="relative flex-1 min-w-0">
              <span className="font-mono text-[9px] text-analog-secondary uppercase tracking-wider block mb-1">Lead-In</span>
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

            {/* Tactile Toggle Switch */}
            <div className="flex flex-col items-center justify-center pt-3 shrink-0">
              <ToggleSwitch
                size="sm"
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

          <p className="font-sans text-[11px] text-analog-secondary px-0.5">
            Pre-roll count before playback begins
          </p>
        </div>
      </div>

      {/* Chord Picker Modal for Progression Bars */}
      {editingBarIndex !== null && (
        <ChordPickerModal
          isOpen={editingBarIndex !== null}
          barIndex={editingBarIndex}
          currentChord={progression[editingBarIndex] || 'G'}
          totalBars={progression.length}
          onSelectChord={(newChord) => onChordChange(editingBarIndex, newChord)}
          onRemoveBar={
            progression.length > 1 && onRemoveBar
              ? () => onRemoveBar(editingBarIndex)
              : undefined
          }
          onClose={() => setEditingBarIndex(null)}
          onPreviewSound={onPreviewSound}
        />
      )}
    </div>
  );
};
