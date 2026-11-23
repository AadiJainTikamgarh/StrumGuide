'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Zap, Plus, Minus, Flame } from 'lucide-react';
import { SpeedTrainerConfig } from '@/types/strum';

interface MetronomeControlsProps {
  isPlaying: boolean;
  bpm: number;
  speedTrainer: SpeedTrainerConfig;
  onTogglePlay: () => void;
  onBpmChange: (newBpm: number) => void;
  onSpeedTrainerChange: (config: SpeedTrainerConfig) => void;
}

export const MetronomeControls: React.FC<MetronomeControlsProps> = ({
  isPlaying,
  bpm,
  speedTrainer,
  onTogglePlay,
  onBpmChange,
  onSpeedTrainerChange,
}) => {
  // Tap tempo state
  const tapTimesRef = useRef<number[]>([]);
  const [tapActive, setTapActive] = useState(false);

  const handleTapTempo = () => {
    const now = Date.now();
    const tapTimes = tapTimesRef.current;

    // Reset if last tap was more than 2 seconds ago
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000) {
      tapTimes.length = 0;
    }

    tapTimes.push(now);
    setTapActive(true);
    setTimeout(() => setTapActive(false), 120);

    if (tapTimes.length >= 2) {
      // Calculate intervals
      const intervals = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        onBpmChange(calculatedBpm);
      }
    }
  };

  const adjustBpm = (delta: number) => {
    const nextBpm = Math.min(240, Math.max(40, bpm + delta));
    onBpmChange(nextBpm);
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Play/Pause Button & Big BPM Display */}
        <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-start">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20 }}
            onClick={onTogglePlay}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl cursor-pointer ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 text-black'
            }`}
            title="Toggle Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white stroke-none" />
            ) : (
              <Play className="w-7 h-7 fill-black stroke-none translate-x-0.5" />
            )}
          </motion.button>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Tempo</span>
            <div className="flex items-baseline space-x-1.5">
              <motion.span
                key={bpm}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="text-4xl font-black font-mono tracking-tight text-white"
              >
                {bpm}
              </motion.span>
              <span className="text-sm font-semibold text-zinc-500">BPM</span>
            </div>
          </div>

          {/* Quick step buttons */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => adjustBpm(-5)}
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="-5 BPM"
            >
              -5
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => adjustBpm(-1)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="-1 BPM"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => adjustBpm(1)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="+1 BPM"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => adjustBpm(5)}
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="+5 BPM"
            >
              +5
            </motion.button>
          </div>
        </div>

        {/* BPM Slider and Tap Tempo */}
        <div className="flex-1 w-full max-w-xl flex flex-col space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-zinc-400">
            <span>Slow (40)</span>
            <span>Andante (80)</span>
            <span>Moderato (120)</span>
            <span>Allegro (160)</span>
            <span>Fast (240)</span>
          </div>
          <input
            type="range"
            min={40}
            max={240}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Tap Tempo & Speed Trainer Trigger with Motion physics */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.92 }}
            animate={tapActive ? { scale: 0.95 } : { scale: 1 }}
            onClick={handleTapTempo}
            className={`px-4 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              tapActive
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/40'
                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Tap Tempo</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() =>
              onSpeedTrainerChange({
                ...speedTrainer,
                enabled: !speedTrainer.enabled,
                startBpm: bpm,
              })
            }
            className={`px-4 py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              speedTrainer.enabled
                ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md shadow-orange-500/20'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className={`w-4 h-4 ${speedTrainer.enabled ? 'text-orange-400' : 'text-zinc-500'}`} />
            <span>Speed Trainer</span>
          </motion.button>
        </div>
      </div>

      {/* Speed Trainer Expanded Panel with AnimatePresence */}
      <AnimatePresence>
        {speedTrainer.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 bg-orange-500/5 p-4 rounded-xl border border-orange-500/20">
              <div className="flex items-center gap-2 text-xs text-orange-300 font-semibold">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Speed Trainer Active: Gradually increases tempo every few bars</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Target BPM:</span>
                  <input
                    type="number"
                    min={bpm}
                    max={240}
                    value={speedTrainer.targetBpm}
                    onChange={(e) =>
                      onSpeedTrainerChange({
                        ...speedTrainer,
                        targetBpm: Math.max(bpm, Number(e.target.value)),
                      })
                    }
                    className="w-16 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Increment:</span>
                  <select
                    value={speedTrainer.incrementBpm}
                    onChange={(e) =>
                      onSpeedTrainerChange({
                        ...speedTrainer,
                        incrementBpm: Number(e.target.value),
                      })
                    }
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white font-mono"
                  >
                    <option value={1}>+1 BPM</option>
                    <option value={2}>+2 BPM</option>
                    <option value={3}>+3 BPM</option>
                    <option value={5}>+5 BPM</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Every:</span>
                  <select
                    value={speedTrainer.incrementEveryBars}
                    onChange={(e) =>
                      onSpeedTrainerChange({
                        ...speedTrainer,
                        incrementEveryBars: Number(e.target.value),
                      })
                    }
                    className="px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-white font-mono"
                  >
                    <option value={1}>1 loop</option>
                    <option value={2}>2 loops</option>
                    <option value={4}>4 loops</option>
                    <option value={8}>8 loops</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
