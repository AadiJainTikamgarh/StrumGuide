'use client';

import React, { useState } from 'react';
import { Volume2, BookOpen } from 'lucide-react';
import { CHORD_LIBRARY } from '@/constants/chords';
import { ChordDefinition } from '@/types/strum';

interface ChordExplorerViewProps {
  onPlayChordSound: (chordName: string) => void;
  onSendToProgression?: (chordName: string) => void;
}

export const ChordExplorerView: React.FC<ChordExplorerViewProps> = ({
  onPlayChordSound,
  onSendToProgression,
}) => {
  const [selectedChord, setSelectedChord] = useState<string>('G');

  const chordDef: ChordDefinition = CHORD_LIBRARY[selectedChord] || CHORD_LIBRARY.G;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile">
        <div className="flex items-center space-x-2 text-strum-down font-display text-[10px] font-bold uppercase tracking-widest mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Fretboard & Voicing Explorer</span>
        </div>
        <h2 className="font-display text-2xl font-black text-analog-primary tracking-tight">
          Guitar Chords & Fingerings
        </h2>
        <p className="font-sans text-xs text-analog-secondary mt-1 max-w-xl">
          Inspect fingerings, open strings, muted strings, and individual string frequencies. Click any chord or string to audition its physical acoustic sound.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chord Selector Matrix (5 cols) */}
        <div className="lg:col-span-5 rounded-lg border border-analog-border bg-analog-surface p-5 shadow-tactile space-y-4">
          <div className="flex items-center justify-between border-b border-analog-border/50 pb-2">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
              Select Chord
            </span>
            <span className="font-mono text-[10px] text-analog-secondary">OPEN VOICINGS</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.keys(CHORD_LIBRARY).map((chordKey) => {
              const chord = CHORD_LIBRARY[chordKey];
              const isSelected = selectedChord === chordKey;

              return (
                <button
                  key={chordKey}
                  onClick={() => {
                    setSelectedChord(chordKey);
                    onPlayChordSound(chordKey);
                  }}
                  className={`p-3 rounded-md border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-analog-accent text-white border-analog-accent shadow-sm'
                      : 'bg-analog-bg border-analog-border text-analog-primary hover:border-analog-secondary'
                  }`}
                >
                  <span className="font-display text-lg font-black">{chordKey}</span>
                  <span className="font-mono text-[9px] opacity-80">{chord.category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed High-Resolution Fretboard Panel (7 cols) */}
        <div className="lg:col-span-7 rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-6">
          <div className="flex items-center justify-between border-b border-analog-border pb-3">
            <div>
              <span className="font-mono text-[10px] font-bold text-analog-secondary uppercase">
                ACTIVE VOICING
              </span>
              <h3 className="font-display text-2xl font-black text-analog-primary">
                {chordDef.displayName}
              </h3>
            </div>

            <button
              onClick={() => onPlayChordSound(selectedChord)}
              className="px-4 py-2 rounded bg-analog-accent text-white font-display text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm hover:opacity-95 transition cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>STRUM CHORD</span>
            </button>
          </div>

          {/* Large Fretboard Visual */}
          <div className="p-6 rounded-md bg-analog-bg border border-analog-border flex flex-col items-center">
            {/* Top X / O indicators */}
            <div className="w-64 flex justify-between px-3 text-xs font-mono font-bold text-analog-secondary mb-1">
              {chordDef.frets.map((f, i) => (
                <span
                  key={i}
                  className={
                    f === -1
                      ? 'text-strum-mute font-black'
                      : f === 0
                      ? 'text-strum-down font-black'
                      : 'text-analog-border'
                  }
                >
                  {f === -1 ? '✕ MUTE' : f === 0 ? '○ OPEN' : ''}
                </span>
              ))}
            </div>

            {/* Nut Line */}
            <div className="w-64 h-2 bg-analog-secondary/70 rounded-xs mb-1" />

            {/* Frets 1 to 5 */}
            <div className="w-64 border-l-2 border-r-2 border-analog-secondary/80">
              {[1, 2, 3, 4, 5].map((fret) => (
                <div
                  key={fret}
                  className="relative w-full h-9 border-b border-analog-border flex justify-between px-3 items-center"
                >
                  {/* Fret wire number label */}
                  <span className="absolute -left-6 font-mono text-[9px] text-analog-secondary">
                    F{fret}
                  </span>

                  {/* 6 String wires running down */}
                  <div className="absolute inset-x-3 inset-y-0 flex justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((str) => (
                      <div
                        key={str}
                        className="h-full bg-analog-border"
                        style={{ width: `${2.2 - str * 0.25}px` }}
                      />
                    ))}
                  </div>

                  {/* Fretted finger dots */}
                  {chordDef.frets.map((f, s) => {
                    if (f !== fret) return <div key={s} className="w-4 h-4" />;
                    return (
                      <div
                        key={s}
                        className="relative z-10 w-5 h-5 rounded-full bg-analog-accent border border-white text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-sm"
                      >
                        {s + 1}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* String tuning labels */}
            <div className="w-64 flex justify-between px-3 text-[10px] font-mono text-analog-secondary mt-2">
              <span>6:E</span>
              <span>5:A</span>
              <span>4:D</span>
              <span>3:G</span>
              <span>2:B</span>
              <span>1:e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
