'use client';

import React from 'react';
import { Music, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { CHORD_LIBRARY } from '@/constants/chords';
import { ChordDefinition, ChordMode } from '@/types/strum';

interface CurrentChordCardProps {
  chordName: string;
  chordMode?: ChordMode;
  onPrevChord?: () => void;
  onNextChord?: () => void;
  onPlaySound?: (chord: string) => void;
}

export const CurrentChordCard: React.FC<CurrentChordCardProps> = ({
  chordName,
  chordMode,
  onPrevChord,
  onNextChord,
  onPlaySound,
}) => {
  const chordDef: ChordDefinition = CHORD_LIBRARY[chordName] || CHORD_LIBRARY.G;

  return (
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-5 shadow-xs flex flex-col justify-between select-none h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-analog-primary">
          <Music className="w-4 h-4 text-analog-secondary" />
          <h3 className="font-display text-sm font-bold tracking-tight">Current Chord</h3>
        </div>
        {chordMode && (
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-analog-bg border border-analog-border text-analog-secondary font-bold">
            {chordMode === 'single' ? 'Single' : 'Progression'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Left: Chord Name & Fretboard Diagram */}
        <div className="flex flex-col items-center">
          <span className="font-display text-2xl font-black text-analog-primary leading-none mb-1">
            {chordName}
          </span>

          <div className="relative flex items-center justify-between w-full">
            {/* Prev arrow */}
            <button
              onClick={onPrevChord}
              className="p-0.5 rounded text-analog-secondary hover:text-analog-primary transition cursor-pointer"
              title="Previous chord"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Mini Fretboard Grid with orange finger dots */}
            <div className="flex flex-col items-center py-0.5">
              {/* String markers */}
              <div className="w-16 flex justify-between px-0.5 text-[7px] font-mono font-bold text-analog-secondary mb-0.5">
                {chordDef.frets.map((f, i) => (
                  <span
                    key={i}
                    className={
                      f === -1
                        ? 'text-analog-accent'
                        : f === 0
                        ? 'text-strum-down'
                        : 'text-analog-border'
                    }
                  >
                    {f === -1 ? 'x' : f === 0 ? 'o' : '·'}
                  </span>
                ))}
              </div>

              {/* Nut */}
              <div className="w-16 h-0.5 bg-analog-secondary/80 rounded-xs mb-0.5" />

              {/* 3 Frets */}
              <div className="w-16 border-l border-r border-analog-secondary/70">
                {[1, 2, 3].map((fret) => (
                  <div
                    key={fret}
                    className="relative w-full h-3 border-b border-analog-border flex justify-between px-0.5 items-center"
                  >
                    {/* Strings */}
                    <div className="absolute inset-x-0.5 inset-y-0 flex justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4, 5].map((str) => (
                        <div key={str} className="w-[1px] h-full bg-analog-border/70" />
                      ))}
                    </div>

                    {/* Orange finger dots */}
                    {chordDef.frets.map((f, s) => {
                      if (f !== fret) return <div key={s} className="w-1.5 h-1.5" />;
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

            {/* Next arrow */}
            <button
              onClick={onNextChord}
              className="p-0.5 rounded text-analog-secondary hover:text-analog-primary transition cursor-pointer"
              title="Next chord"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center space-x-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-analog-accent" />
            <span className="w-1 h-1 rounded-full bg-analog-border" />
            <span className="w-1 h-1 rounded-full bg-analog-border" />
          </div>
        </div>

        {/* Right: Guitar Hand Photo Thumbnail Card */}
        <div
          onClick={() => onPlaySound && onPlaySound(chordName)}
          className="relative rounded-xl overflow-hidden border border-analog-border aspect-4/3 bg-zinc-900 group cursor-pointer shadow-xs"
          title="Click to audition acoustic chord"
        >
          {/* Guitar neck fretboard image */}
          <img
            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=400&q=80"
            alt="Guitar Chord Fingering"
            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Floating Play Icon */}
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 group-hover:bg-analog-accent transition">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
