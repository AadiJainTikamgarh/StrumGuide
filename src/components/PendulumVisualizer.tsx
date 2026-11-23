'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowUp, VolumeX, Ghost } from 'lucide-react';
import { StrumAction } from '@/types/strum';

interface PendulumVisualizerProps {
  isPlaying: boolean;
  isCountIn: boolean;
  countInBeat: number;
  currentSlotIndex: number;
  currentBeat: number;
  currentSubdivision: string;
  currentDirection: 'down' | 'up';
  currentAction: StrumAction;
  currentChord: string;
  bpm: number;
  timeSignature: '4/4' | '3/4';
}

export const PendulumVisualizer: React.FC<PendulumVisualizerProps> = ({
  isPlaying,
  isCountIn,
  countInBeat,
  currentBeat,
  currentSubdivision,
  currentDirection,
  currentAction,
  currentChord,
  bpm,
}) => {
  // If count-in is active, show the prominent count-in overlay with motion spring punch
  if (isCountIn) {
    return (
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-700/20 border-2 border-amber-500/40 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col items-center justify-center min-h-[160px] text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-1">
            Count-In (Get Ready to Strum)
          </span>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={countInBeat}
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.3, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="text-7xl font-black text-amber-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]"
            >
              {countInBeat}
            </motion.div>
          </AnimatePresence>

          <p className="mt-2 text-sm text-amber-200/80 font-medium">
            Lock in with the click • Ready on chord <span className="font-bold underline">{currentChord}</span>
          </p>
        </div>
      </div>
    );
  }

  // Calculate dynamic action styling
  const actionBadges: Record<StrumAction, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    DOWN: {
      label: 'STRUM DOWN',
      bg: 'bg-emerald-500/20 border-emerald-500/60 shadow-emerald-500/30',
      text: 'text-emerald-400',
      icon: <ArrowDown className="w-5 h-5 stroke-[2.5]" />,
    },
    UP: {
      label: 'STRUM UP',
      bg: 'bg-sky-500/20 border-sky-500/60 shadow-sky-500/30',
      text: 'text-sky-400',
      icon: <ArrowUp className="w-5 h-5 stroke-[2.5]" />,
    },
    GHOST: {
      label: 'AIR STRUM (GHOST)',
      bg: 'bg-slate-500/20 border-slate-400/50 shadow-slate-500/20',
      text: 'text-slate-300',
      icon: <Ghost className="w-5 h-5" />,
    },
    MUTE: {
      label: 'MUTE / SLAP (x)',
      bg: 'bg-orange-500/20 border-orange-500/60 shadow-orange-500/30',
      text: 'text-orange-400',
      icon: <VolumeX className="w-5 h-5" />,
    },
    REST: {
      label: 'REST',
      bg: 'bg-zinc-800/40 border-zinc-700/40',
      text: 'text-zinc-400',
      icon: <span className="text-sm font-mono tracking-wider">—</span>,
    },
  };

  const currentBadge = actionBadges[currentAction] || actionBadges.REST;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-2xl backdrop-blur-xl">
      {/* Background ambient glow animated with motion */}
      <motion.div
        animate={{
          scale: currentAction !== 'REST' ? 1.15 : 0.9,
          opacity: currentAction !== 'REST' ? 0.25 : 0.08,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors duration-200 ${
          currentAction === 'DOWN'
            ? 'bg-emerald-500'
            : currentAction === 'UP'
            ? 'bg-sky-500'
            : currentAction === 'MUTE'
            ? 'bg-orange-500'
            : currentAction === 'GHOST'
            ? 'bg-slate-400'
            : 'bg-zinc-700'
        }`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Column: Beat & Chord indicator */}
        <div className="flex flex-col items-center md:items-start space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Beat</span>
            <span className="text-2xl font-black text-white font-mono">
              {isPlaying ? `${currentBeat} (${currentSubdivision})` : '—'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">Active Chord</span>
            <motion.span
              key={currentChord}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="px-3 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-lg font-mono"
            >
              {currentChord}
            </motion.span>
          </div>
        </div>

        {/* Center Column: The Virtual Strumming Pendulum Guide with Motion Spring Physics */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-52 h-32 flex flex-col items-center justify-between p-2 rounded-xl bg-zinc-950/90 border border-zinc-800 shadow-inner">
            {/* Top guide label */}
            <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-2">
              <span className={currentDirection === 'up' ? 'text-sky-400 font-bold' : ''}>Top (Upstroke)</span>
              <span>Down</span>
            </div>

            {/* Virtual String Lines Bar */}
            <div className="relative w-full h-14 flex items-center justify-center">
              {/* 6 Guitar strings visual with vibration on strike */}
              <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-30">
                {[0, 1, 2, 3, 4, 5].map((strIdx) => (
                  <motion.div
                    key={strIdx}
                    animate={
                      isPlaying && currentAction !== 'REST' && currentAction !== 'GHOST'
                        ? { x: [0, (strIdx % 2 === 0 ? 1 : -1) * 1.5, 0] }
                        : { x: 0 }
                    }
                    transition={{ duration: 0.08, repeat: 1 }}
                    className="w-full bg-zinc-300"
                    style={{ height: `${1.6 - strIdx * 0.2}px` }}
                  />
                ))}
              </div>

              {/* The Strum Pick indicator animated with spring physics */}
              <motion.div
                animate={{
                  y: !isPlaying ? 0 : currentDirection === 'down' ? 18 : -18,
                  scale: currentAction !== 'REST' ? 1.08 : 0.92,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 450,
                  damping: 24,
                }}
                className="absolute flex items-center justify-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border shadow-xl transition-colors duration-150 ${
                    currentAction === 'DOWN'
                      ? 'bg-emerald-500 border-emerald-300 text-black shadow-emerald-500/50'
                      : currentAction === 'UP'
                      ? 'bg-sky-500 border-sky-300 text-black shadow-sky-500/50'
                      : currentAction === 'GHOST'
                      ? 'bg-slate-700 border-slate-400 text-slate-300 border-dashed'
                      : currentAction === 'MUTE'
                      ? 'bg-orange-500 border-orange-300 text-black shadow-orange-500/50'
                      : 'bg-zinc-800 border-zinc-600 text-zinc-400'
                  }`}
                >
                  {currentDirection === 'down' ? (
                    <ArrowDown className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <ArrowUp className="w-5 h-5 stroke-[3]" />
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Bottom guide label */}
            <div className="flex justify-between w-full text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-2">
              <span className={currentDirection === 'down' ? 'text-emerald-400 font-bold' : ''}>Bottom (Downstroke)</span>
              <span>Up</span>
            </div>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 font-medium">
            Pendulum motion: Constant hand speed
          </span>
        </div>

        {/* Right Column: Active Strum Action Card with Motion Spring Bounce */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <motion.div
            key={`${currentAction}-${currentBeat}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: isPlaying ? [0.95, 1.04, 1] : 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border shadow-lg transition-colors ${currentBadge.bg}`}
          >
            <span className={currentBadge.text}>{currentBadge.icon}</span>
            <span className={`text-sm font-extrabold tracking-wide uppercase ${currentBadge.text}`}>
              {isPlaying ? currentBadge.label : 'PAUSED'}
            </span>
          </motion.div>
          <span className="text-xs text-zinc-500 mt-2 font-mono">
            {bpm} BPM • {isPlaying ? 'In Sync' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
