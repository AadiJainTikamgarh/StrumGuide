'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CHORD_LIBRARY, COMMON_PROGRESSIONS } from '@/constants/chords';
import { ChordDefinition } from '@/types/strum';

interface ChordSelectorProps {
  mode: 'single' | 'progression';
  singleChord: string;
  progression: string[];
  activeBarIndex: number;
  onModeChange: (mode: 'single' | 'progression') => void;
  onSingleChordChange: (chord: string) => void;
  onProgressionChange: (progression: string[]) => void;
}

export const ChordSelector: React.FC<ChordSelectorProps> = ({
  mode,
  singleChord,
  progression,
  activeBarIndex,
  onModeChange,
  onSingleChordChange,
  onProgressionChange,
}) => {
  const currentChordDef: ChordDefinition =
    CHORD_LIBRARY[mode === 'single' ? singleChord : progression[activeBarIndex % progression.length]] ||
    CHORD_LIBRARY.G;

  const handleBarChordChange = (barIndex: number, chordName: string) => {
    const updated = [...progression];
    updated[barIndex] = chordName;
    onProgressionChange(updated);
  };

  const addBar = () => {
    if (progression.length < 8) {
      onProgressionChange([...progression, 'G']);
    }
  };

  const removeBar = () => {
    if (progression.length > 2) {
      onProgressionChange(progression.slice(0, -1));
    }
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800/80 mb-5 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Chords & Progressions</h3>
          <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeChange('single')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                mode === 'single'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Single Chord
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onModeChange('progression')}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                mode === 'progression'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Chord Progression
            </motion.button>
          </div>
        </div>

        {mode === 'progression' && (
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const found = COMMON_PROGRESSIONS.find((p) => p.name === e.target.value);
                if (found) {
                  onProgressionChange(found.chords);
                }
              }}
              className="text-xs bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-300 font-medium"
            >
              <option value="">Load Preset Progression...</option>
              {COMMON_PROGRESSIONS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} ({p.chords.join(' - ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Chord Buttons / Progression Builder */}
        <div className="lg:col-span-2 space-y-4">
          {mode === 'single' ? (
            <div className="space-y-3">
              <span className="text-xs text-zinc-400 font-medium">Select chord to loop:</span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(CHORD_LIBRARY).map((chordName) => {
                  const isSelected = singleChord === chordName;
                  return (
                    <motion.button
                      key={chordName}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      onClick={() => onSingleChordChange(chordName)}
                      className={`w-14 h-12 rounded-xl font-bold font-mono text-base flex flex-col items-center justify-center border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/30 font-black'
                          : 'bg-zinc-950/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {chordName}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Bars Sequence:</span>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={removeBar}
                    disabled={progression.length <= 2}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    - Remove Bar
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={addBar}
                    disabled={progression.length >= 8}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    + Add Bar
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {progression.map((chord, barIdx) => {
                  const isActive = activeBarIndex % progression.length === barIdx;
                  return (
                    <motion.div
                      key={`prog-bar-${barIdx}`}
                      animate={isActive ? { scale: 1.03 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`p-3 rounded-xl border flex flex-col space-y-2 transition-colors ${
                        isActive
                          ? 'bg-emerald-500/15 border-emerald-500/70 ring-2 ring-emerald-500/40 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-950/60 border-zinc-800'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Bar {barIdx + 1}</span>
                        {isActive && <span className="text-emerald-400 font-bold">Now Playing</span>}
                      </div>

                      <select
                        value={chord}
                        onChange={(e) => handleBarChordChange(barIdx, e.target.value)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg py-1.5 px-2 text-white font-mono font-bold text-base focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                      >
                        {Object.keys(CHORD_LIBRARY).map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mini Chord Fretboard Diagram with Motion */}
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-col items-center justify-center">
          <div className="flex items-center justify-between w-full mb-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fret Diagram</span>
            <motion.span
              key={currentChordDef.displayName}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-bold text-emerald-400 font-mono"
            >
              {currentChordDef.displayName}
            </motion.span>
          </div>

          {/* Fretboard visual */}
          <div className="relative w-40 p-2 flex flex-col items-center">
            {/* Nut indicator */}
            <div className="w-full flex justify-between px-2 text-[10px] font-mono font-bold text-zinc-500 mb-1">
              {currentChordDef.frets.map((f, i) => (
                <span key={i} className={f === -1 ? 'text-rose-400' : f === 0 ? 'text-emerald-400' : 'text-zinc-400'}>
                  {f === -1 ? 'X' : f === 0 ? 'O' : ''}
                </span>
              ))}
            </div>

            {/* Nut Line */}
            <div className="w-full h-1 bg-zinc-300 rounded mb-0.5" />

            {/* Frets 1 to 4 */}
            <div className="w-full border-l border-r border-zinc-600">
              {[1, 2, 3, 4].map((fretNum) => (
                <div
                  key={fretNum}
                  className="relative w-full h-7 border-b border-zinc-700 flex justify-between px-2 items-center"
                >
                  {/* String lines running vertically */}
                  <div className="absolute inset-x-2 top-0 bottom-0 flex justify-between pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((strIdx) => (
                      <div key={strIdx} className="w-[1px] h-full bg-zinc-500/40" />
                    ))}
                  </div>

                  {/* Finger dots */}
                  {currentChordDef.frets.map((f, strIdx) => {
                    const isFrettedHere = f === fretNum;
                    return (
                      <div key={strIdx} className="relative z-10 w-2 h-2 flex items-center justify-center">
                        {isFrettedHere && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                            className="w-4 h-4 rounded-full bg-emerald-500 border border-emerald-300 shadow-md shadow-emerald-500/50 flex items-center justify-center text-[9px] font-black text-black"
                          >
                            {strIdx + 1}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* String labels */}
            <div className="w-full flex justify-between px-2 text-[9px] font-mono text-zinc-500 mt-1">
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
