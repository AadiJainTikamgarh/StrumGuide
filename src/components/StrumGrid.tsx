'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowUp, VolumeX, Ghost, Minus, RefreshCw } from 'lucide-react';
import { StrumSlot, StrumAction, TimeSignature, Subdivision } from '@/types/strum';

interface StrumGridProps {
  slots: StrumSlot[];
  currentSlotIndex: number;
  isPlaying: boolean;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  barCount: number; // 1 or 2
  onSlotChange: (index: number, newAction: StrumAction) => void;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onSubdivisionChange: (sub: Subdivision) => void;
  onBarCountChange: (bars: number) => void;
  onClearPattern: () => void;
}

export const StrumGrid: React.FC<StrumGridProps> = ({
  slots,
  currentSlotIndex,
  isPlaying,
  timeSignature,
  subdivision,
  barCount,
  onSlotChange,
  onTimeSignatureChange,
  onSubdivisionChange,
  onBarCountChange,
  onClearPattern,
}) => {
  // Cycle to next action on quick click
  const handleSlotClick = (index: number, currentSlot: StrumSlot) => {
    const isDownSlot = currentSlot.direction === 'down';
    const primaryStrum: StrumAction = isDownSlot ? 'DOWN' : 'UP';

    let nextAction: StrumAction = 'REST';
    if (currentSlot.action === 'REST') {
      nextAction = primaryStrum;
    } else if (currentSlot.action === primaryStrum) {
      nextAction = 'GHOST';
    } else if (currentSlot.action === 'GHOST') {
      nextAction = 'MUTE';
    } else if (currentSlot.action === 'MUTE') {
      nextAction = 'REST';
    } else {
      nextAction = primaryStrum;
    }

    onSlotChange(index, nextAction);
  };

  const slotsPerBeat = subdivision === '8th' ? 2 : 4;
  const beatsPerBar = timeSignature === '4/4' ? 4 : 3;
  const slotsPerBar = beatsPerBar * slotsPerBeat;

  // Group slots by bar and then by beat
  const bars: StrumSlot[][] = [];
  for (let b = 0; b < barCount; b++) {
    const start = b * slotsPerBar;
    const end = start + slotsPerBar;
    bars.push(slots.slice(start, end));
  }

  return (
    <div className="w-full rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-xl backdrop-blur-xl">
      {/* Top Controls: Meters, Subdivisions, Bar count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Signature Toggle */}
          <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onTimeSignatureChange('4/4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeSignature === '4/4'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              4/4 Time
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onTimeSignatureChange('3/4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeSignature === '3/4'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3/4 Waltz
            </motion.button>
          </div>

          {/* Subdivision Toggle: 8th vs 16th */}
          <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSubdivisionChange('8th')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subdivision === '8th'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              8th Notes (1 & 2 &)
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onSubdivisionChange('16th')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subdivision === '16th'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              16th Notes (1 e & a)
            </motion.button>
          </div>

          {/* Bar Count Toggle */}
          <div className="flex items-center rounded-xl bg-zinc-950 p-1 border border-zinc-800">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onBarCountChange(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                barCount === 1
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              1 Bar
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onBarCountChange(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                barCount === 2
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              2 Bars
            </motion.button>
          </div>
        </div>

        {/* Legend & Clear Pattern */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearPattern}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition"
            title="Reset pattern to blank rests"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Grid</span>
          </motion.button>
        </div>
      </div>

      {/* Color Code Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-zinc-400 py-3 px-1 gap-2">
        <span className="font-semibold text-zinc-500">Click any box to cycle:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <strong className="text-emerald-400">Down (↓)</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" />
            <strong className="text-sky-400">Up (↑)</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-slate-400 inline-block" />
            <strong className="text-slate-300">Ghost (Air Strum)</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
            <strong className="text-orange-400">Mute/Slap (x)</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-zinc-600 inline-block" />
            <strong className="text-zinc-400">Rest (—)</strong>
          </span>
        </div>
      </div>

      {/* Strumming Sequence Grid */}
      <div className="space-y-6 mt-2">
        {bars.map((barSlots, barIdx) => {
          const globalOffset = barIdx * slotsPerBar;

          // Group by beat
          const beatGroups: StrumSlot[][] = [];
          for (let b = 0; b < beatsPerBar; b++) {
            beatGroups.push(barSlots.slice(b * slotsPerBeat, (b + 1) * slotsPerBeat));
          }

          return (
            <div key={`bar-${barIdx}`} className="space-y-2">
              {barCount > 1 && (
                <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
                  <span>Bar {barIdx + 1}</span>
                  <span className="text-zinc-500 font-mono">
                    {timeSignature} • {subdivision}
                  </span>
                </div>
              )}

              {/* Beat Cards Grid */}
              <div className={`grid gap-3 ${beatsPerBar === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
                {beatGroups.map((group, beatIdx) => (
                  <div
                    key={`bar-${barIdx}-beat-${beatIdx}`}
                    className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col space-y-1.5"
                  >
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                      Beat {beatIdx + 1}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {group.map((slot, groupSlotIdx) => {
                        const globalSlotIndex = globalOffset + beatIdx * slotsPerBeat + groupSlotIdx;
                        const isCurrent = isPlaying && currentSlotIndex === globalSlotIndex;

                        // Visual styling based on action
                        let cardStyle = 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700';
                        let icon = <Minus className="w-4 h-4 opacity-40" />;

                        if (slot.action === 'DOWN') {
                          cardStyle = 'bg-emerald-500/15 border-emerald-500/60 text-emerald-400 shadow-sm shadow-emerald-500/20';
                          icon = <ArrowDown className="w-5 h-5 stroke-[2.5]" />;
                        } else if (slot.action === 'UP') {
                          cardStyle = 'bg-sky-500/15 border-sky-500/60 text-sky-400 shadow-sm shadow-sky-500/20';
                          icon = <ArrowUp className="w-5 h-5 stroke-[2.5]" />;
                        } else if (slot.action === 'GHOST') {
                          cardStyle = 'bg-slate-700/30 border-slate-400/60 text-slate-300 border-dashed';
                          icon = <Ghost className="w-4 h-4" />;
                        } else if (slot.action === 'MUTE') {
                          cardStyle = 'bg-orange-500/15 border-orange-500/60 text-orange-400 shadow-sm shadow-orange-500/20';
                          icon = <VolumeX className="w-5 h-5" />;
                        }

                        return (
                          <div
                            key={slot.id}
                            className="flex-1 flex flex-col items-center group relative"
                          >
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.94 }}
                              animate={
                                isCurrent
                                  ? { scale: [1, 1.08, 1.04], filter: 'brightness(1.3)' }
                                  : { scale: 1, filter: 'brightness(1)' }
                              }
                              transition={{ duration: 0.12 }}
                              onClick={() => handleSlotClick(globalSlotIndex, slot)}
                              className={`w-full py-3 px-1 rounded-xl border flex flex-col items-center justify-center transition-colors cursor-pointer relative ${cardStyle} ${
                                isCurrent ? 'ring-2 ring-white z-10' : ''
                              }`}
                              title={`Beat ${slot.beatNumber} (${slot.subdivisionLabel}) - Click to toggle action`}
                            >
                              {/* Subdivision Label */}
                              <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-white transition">
                                {slot.subdivisionLabel}
                              </span>

                              {/* Main Action Icon */}
                              <div className="my-1">{icon}</div>

                              {/* Direction cue indicator */}
                              <span className="text-[9px] uppercase tracking-tighter text-zinc-500 font-mono">
                                {slot.direction === 'down' ? '↓' : '↑'}
                              </span>
                            </motion.button>

                            {/* Mini quick-action selector on hover with motion */}
                            <div className="absolute -bottom-9 hidden group-hover:flex items-center gap-0.5 bg-zinc-950 border border-zinc-700 p-1 rounded-lg shadow-2xl z-20">
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotChange(globalSlotIndex, 'DOWN');
                                }}
                                className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400"
                                title="Set Downstrum"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotChange(globalSlotIndex, 'UP');
                                }}
                                className="p-1 hover:bg-sky-500/20 rounded text-sky-400"
                                title="Set Upstrum"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotChange(globalSlotIndex, 'GHOST');
                                }}
                                className="p-1 hover:bg-slate-500/20 rounded text-slate-300"
                                title="Set Ghost Strum"
                              >
                                <Ghost className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotChange(globalSlotIndex, 'MUTE');
                                }}
                                className="p-1 hover:bg-orange-500/20 rounded text-orange-400"
                                title="Set Mute/Slap"
                              >
                                <VolumeX className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSlotChange(globalSlotIndex, 'REST');
                                }}
                                className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
                                title="Set Rest"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
