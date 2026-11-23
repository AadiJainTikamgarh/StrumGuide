'use client';

import React from 'react';
import { CHORD_LIBRARY } from '@/constants/chords';
import { ChordDefinition } from '@/types/strum';

interface AnalogChordCardProps {
  chordName: string;
  barNumber?: number;
  isActive?: boolean;
  onSelectChord?: (name: string) => void;
  onPreviewSound?: (name: string) => void;
}

export const AnalogChordCard: React.FC<AnalogChordCardProps> = ({
  chordName,
  barNumber,
  isActive = false,
  onSelectChord,
  onPreviewSound,
}) => {
  const chordDef: ChordDefinition = CHORD_LIBRARY[chordName] || CHORD_LIBRARY.G;

  return (
    <div
      onClick={() => onPreviewSound && onPreviewSound(chordName)}
      className={`relative p-2.5 rounded-md border transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-analog-elevated border-2 border-analog-accent shadow-sm'
          : 'bg-analog-surface border-analog-border hover:border-analog-secondary'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-1.5">
        {barNumber !== undefined ? (
          <span className="font-mono text-[9px] font-bold text-analog-secondary">
            BAR {barNumber}
          </span>
        ) : (
          <span className="font-mono text-[9px] text-analog-secondary">
            {chordDef.category}
          </span>
        )}

        <div className="flex items-center space-x-1">
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-analog-accent animate-ping" />
          )}
          <span className="font-display text-sm font-black text-analog-primary">
            {chordName}
          </span>
        </div>
      </div>

      {/* Mini Fretboard Grid */}
      <div className="flex flex-col items-center py-1">
        {/* Open / Mute strings top line */}
        <div className="w-24 flex justify-between px-1 text-[8px] font-mono text-analog-secondary mb-0.5">
          {chordDef.frets.map((f, i) => (
            <span
              key={i}
              className={
                f === -1
                  ? 'text-strum-mute font-bold'
                  : f === 0
                  ? 'text-strum-down font-bold'
                  : 'text-analog-border'
              }
            >
              {f === -1 ? 'x' : f === 0 ? 'o' : '·'}
            </span>
          ))}
        </div>

        {/* Nut Line */}
        <div className="w-24 h-1 bg-analog-secondary/60 rounded-xs mb-0.5" />

        {/* 4 Frets grid */}
        <div className="w-24 border-l border-r border-analog-border">
          {[1, 2, 3, 4].map((fret) => (
            <div
              key={fret}
              className="relative w-full h-3 border-b border-analog-border flex justify-between px-1 items-center"
            >
              {/* String wires */}
              <div className="absolute inset-x-1 inset-y-0 flex justify-between pointer-events-none">
                {[0, 1, 2, 3, 4, 5].map((str) => (
                  <div key={str} className="w-[1px] h-full bg-analog-border/50" />
                ))}
              </div>

              {/* Fretted finger dots */}
              {chordDef.frets.map((f, s) => {
                if (f !== fret) return <div key={s} className="w-2 h-2" />;
                return (
                  <div
                    key={s}
                    className="relative z-10 w-2 h-2 rounded-full bg-analog-accent shadow-2xs"
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selector dropdown if provided */}
      {onSelectChord && (
        <select
          value={chordName}
          onChange={(e) => onSelectChord(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full mt-1.5 bg-analog-bg border border-analog-border rounded text-[10px] font-mono font-bold text-analog-primary py-0.5 px-1 cursor-pointer"
        >
          {Object.keys(CHORD_LIBRARY).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
