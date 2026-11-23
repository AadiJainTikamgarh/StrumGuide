'use client';

import React from 'react';
import { TempoCard } from '@/components/analog/TempoCard';
import { MechanicalPendulum } from '@/components/analog/MechanicalPendulum';
import { CurrentChordCard } from '@/components/analog/CurrentChordCard';
import { PatternSequencerCard } from '@/components/analog/PatternSequencerCard';
import { BottomControlsRow } from '@/components/analog/BottomControlsRow';
import { FloatingTransportBar } from '@/components/analog/FloatingTransportBar';
import {
  StrumPattern,
  StrumAction,
  TimeSignature,
  Subdivision,
  AudioSettings,
  SpeedTrainerConfig,
  ChordMode,
} from '@/types/strum';

interface PracticeStudioProps {
  pattern: StrumPattern;
  bpm: number;
  barCount: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  chordMode: ChordMode;
  singleChord: string;
  progression: string[];
  activeChord: string;
  activeBarIndex: number;
  isPlaying: boolean;
  isCountIn: boolean;
  countInBeat: number;
  countInBeats: 3 | 4;
  currentSlotIndex: number;
  currentBeat: number;
  currentSubdivision: string;
  currentDirection: 'down' | 'up';
  currentAction: StrumAction;
  loopEnabled: boolean;
  speedTrainer: SpeedTrainerConfig;
  audioSettings: AudioSettings;
  canUndo: boolean;
  canRedo: boolean;
  onBpmChange: (bpm: number) => void;
  onTapTempo: () => void;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onSubdivisionChange: (sub: Subdivision) => void;
  onBarCountChange: (bars: number) => void;
  onSlotCycleAction: (index: number) => void;
  onClearPattern: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onChordModeChange: (mode: ChordMode) => void;
  onSelectSingleChord: (chord: string) => void;
  onChordChange: (barIndex: number, chordName: string) => void;
  onPrevChord?: () => void;
  onNextChord?: () => void;
  onRemoveChordBar?: (barIndex: number) => void;
  onChordSoundPreview: (chordName: string) => void;
  onTogglePlay: () => void;
  onStop: () => void;
  onRestart: () => void;
  onToggleLoop: () => void;
  onToggleSpeedTrainer: () => void;
  onAudioSettingsChange: (settings: AudioSettings) => void;
  onCountInBeatsChange: (beats: 3 | 4) => void;
  onSelectPattern: (pattern: StrumPattern) => void;
  onAddChordBar: () => void;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  pattern,
  bpm,
  barCount,
  timeSignature,
  subdivision,
  chordMode,
  singleChord,
  progression,
  activeChord,
  activeBarIndex,
  isPlaying,
  isCountIn,
  countInBeat,
  countInBeats,
  currentSlotIndex,
  currentBeat,
  currentSubdivision,
  currentDirection,
  currentAction,
  loopEnabled,
  speedTrainer,
  audioSettings,
  canUndo,
  canRedo,
  onBpmChange,
  onTapTempo,
  onTimeSignatureChange,
  onSubdivisionChange,
  onBarCountChange,
  onSlotCycleAction,
  onClearPattern,
  onUndo,
  onRedo,
  onChordModeChange,
  onSelectSingleChord,
  onChordChange,
  onPrevChord,
  onNextChord,
  onRemoveChordBar,
  onChordSoundPreview,
  onTogglePlay,
  onRestart,
  onToggleLoop,
  onToggleSpeedTrainer,
  onAudioSettingsChange,
  onCountInBeatsChange,
  onSelectPattern,
  onAddChordBar,
}) => {
  return (
    <div className="space-y-4 sm:space-y-5 min-w-0">
      {/* ─────────────────────────────────────────────────────────────
          ROW 1: TEMPO CARD + STRUM MOTION GAUGE + CURRENT CHORD CARD
      ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {/* Card 1: Tempo Instrument */}
        <div className="col-span-1">
          <TempoCard
            bpm={bpm}
            timeSignature={timeSignature}
            subdivision={subdivision}
            onBpmChange={onBpmChange}
            onTapTempo={onTapTempo}
            onTimeSignatureChange={onTimeSignatureChange}
            onSubdivisionChange={onSubdivisionChange}
          />
        </div>

        {/* Card 2: Strum Motion Gauge */}
        <div className="col-span-1">
          <MechanicalPendulum
            isPlaying={isPlaying}
            isCountIn={isCountIn}
            countInBeat={countInBeat}
            currentDirection={currentDirection}
            currentAction={currentAction}
            currentBeat={currentBeat}
            currentSubdivision={currentSubdivision}
            currentChord={activeChord}
            bpm={bpm}
          />
        </div>

        {/* Card 3: Current Chord & Hand Fingering Thumbnail */}
        <div className="col-span-1 md:col-span-2 xl:col-span-1">
          <CurrentChordCard
            chordName={activeChord}
            chordMode={chordMode}
            onPrevChord={onPrevChord}
            onNextChord={onNextChord}
            onPlaySound={onChordSoundPreview}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ROW 2: STRUMMING PATTERN SEQUENCER
      ────────────────────────────────────────────────────────────── */}
      <PatternSequencerCard
        slots={pattern.slots}
        currentSlotIndex={currentSlotIndex}
        isPlaying={isPlaying}
        timeSignature={timeSignature}
        subdivision={subdivision}
        barCount={barCount}
        canUndo={canUndo}
        canRedo={canRedo}
        onSlotCycleAction={onSlotCycleAction}
        onSubdivisionChange={onSubdivisionChange}
        onBarCountChange={onBarCountChange}
        onTogglePlay={onTogglePlay}
        onUndo={onUndo}
        onRedo={onRedo}
        onClearPattern={onClearPattern}
      />

      {/* ─────────────────────────────────────────────────────────────
          ROW 3: CHORD CONTROLS (SINGLE CHORD / PROGRESSION) + AUDIO MIX + COUNT-IN
      ────────────────────────────────────────────────────────────── */}
      <BottomControlsRow
        chordMode={chordMode}
        singleChord={singleChord}
        progression={progression}
        activeBarIndex={activeBarIndex}
        isPlaying={isPlaying}
        audioSettings={audioSettings}
        countInBeats={countInBeats}
        onChordModeChange={onChordModeChange}
        onSelectSingleChord={onSelectSingleChord}
        onChordChange={onChordChange}
        onAddBar={onAddChordBar}
        onRemoveBar={onRemoveChordBar}
        onAudioSettingsChange={onAudioSettingsChange}
        onCountInBeatsChange={onCountInBeatsChange}
      />

      {/* ─────────────────────────────────────────────────────────────
          ROW 4: FLOATING BOTTOM TRANSPORT BAR
      ────────────────────────────────────────────────────────────── */}
      <FloatingTransportBar
        currentPattern={pattern}
        isPlaying={isPlaying}
        loopEnabled={loopEnabled}
        speedTrainer={speedTrainer}
        onSelectPattern={onSelectPattern}
        onTogglePlay={onTogglePlay}
        onRestart={onRestart}
        onToggleLoop={onToggleLoop}
        onToggleSpeedTrainer={onToggleSpeedTrainer}
      />
    </div>
  );
};
