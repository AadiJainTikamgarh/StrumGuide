'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ArrowUp, Hand } from 'lucide-react';
import { StrumAction } from '@/types/strum';

// Static deterministic tick coordinates to guarantee 100% hydration matching between SSR and client
const GRADUATION_TICKS = [
  { deg: -32, x1: 76.55, y1: 35.46, x2: 70.19, y2: 25.28 },
  { deg: -24, x1: 86.65, y1: 30.09, x2: 84.21, y2: 24.61 },
  { deg: -16, x1: 97.4, y1: 26.18, x2: 95.74, y2: 20.41 },
  { deg: -8, x1: 108.59, y1: 23.8, x2: 107.75, y2: 17.86 },
  { deg: 0, x1: 120, y1: 23, x2: 120, y2: 11 },
  { deg: 8, x1: 131.41, y1: 23.8, x2: 132.25, y2: 17.86 },
  { deg: 16, x1: 142.6, y1: 26.18, x2: 144.26, y2: 20.41 },
  { deg: 24, x1: 153.35, y1: 30.09, x2: 155.79, y2: 24.61 },
  { deg: 32, x1: 163.45, y1: 35.46, x2: 169.81, y2: 25.28 },
];

interface MechanicalPendulumProps {
  isPlaying: boolean;
  isCountIn: boolean;
  countInBeat: number;
  currentDirection: 'down' | 'up';
  currentAction: StrumAction;
  currentBeat: number;
  currentSubdivision: string;
  currentChord: string;
  bpm: number;
}

export const MechanicalPendulum: React.FC<MechanicalPendulumProps> = ({
  isPlaying,
  isCountIn,
  countInBeat,
  currentDirection,
}) => {
  // Angle of the pendulum: -32 degrees on downstroke (pointing left to DOWN), +32 degrees on upstroke (pointing right to UP)
  const pendulumAngle = !isPlaying ? 0 : currentDirection === 'down' ? -30 : 30;

  return (
    <div className="relative rounded-2xl border border-analog-border bg-analog-surface p-4 sm:p-5 shadow-xs flex flex-col select-none overflow-hidden h-full">
      {/* Card Header */}
      <div className="flex items-center space-x-2 text-analog-primary mb-2">
        <Hand className="w-4 h-4 text-analog-secondary" />
        <h3 className="font-display text-sm font-bold tracking-tight">Strum Motion</h3>
      </div>

      {/* Count-In Overlay if active */}
      <AnimatePresence>
        {isCountIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-analog-surface/95 backdrop-blur-xs p-4 text-center"
          >
            <span className="font-display text-[10px] font-bold uppercase tracking-widest text-analog-accent mb-1">
              COUNT-IN
            </span>
            <motion.div
              key={countInBeat}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="font-mono text-5xl font-black text-analog-accent tracking-tighter"
            >
              {countInBeat}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gauge Metronome Arc Chamber - Optical Center Fill */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-auto min-h-[140px] py-1">
        {/* Curved Speedometer-style Arc Guide (SVG) */}
        <svg
          className="w-full max-w-[240px] h-32 sm:h-36 pointer-events-none"
          viewBox="0 0 240 120"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main outer faint arc */}
          <path
            d="M 30 100 A 90 90 0 0 1 210 100"
            fill="none"
            stroke="var(--analog-border)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Calibrated graduation tick marks */}
          {GRADUATION_TICKS.map(({ deg, x1, y1, x2, y2 }) => (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                deg < 0
                  ? 'var(--analog-accent)'
                  : deg > 0
                  ? '#65A889'
                  : 'var(--analog-secondary)'
              }
              strokeWidth={deg === -32 || deg === 32 || deg === 0 ? '2' : '1'}
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}
        </svg>

        {/* Directional Labels: DOWN on Left (Orange) and UP on Right (Green) */}
        <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 flex justify-between pointer-events-none">
          <div
            className={`flex items-center space-x-1 font-display text-[11px] font-black tracking-wider transition-colors ${
              currentDirection === 'down' && isPlaying
                ? 'text-analog-accent scale-105'
                : 'text-analog-accent/70'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5 stroke-[3]" />
            <span>DOWN</span>
          </div>

          <div
            className={`flex items-center space-x-1 font-display text-[11px] font-black tracking-wider transition-colors ${
              currentDirection === 'up' && isPlaying
                ? 'text-strum-down scale-105'
                : 'text-strum-down/70'
            }`}
          >
            <ArrowUp className="w-3.5 h-3.5 stroke-[3]" />
            <span>UP</span>
          </div>
        </div>

        {/* Oscillating Pendulum Arm with Guitar Pick Tip */}
        <div className="absolute bottom-1 w-12 h-28 flex justify-center items-end pointer-events-none" style={{ transformOrigin: 'bottom center' }}>
          <motion.div
            animate={{
              rotate: pendulumAngle,
            }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 26,
            }}
            className="absolute bottom-2 flex flex-col items-center origin-bottom"
            style={{ width: '40px', height: '100px' }}
          >
            {/* Guitar Pick Tip Pointer with sound wave details */}
            <div
              className="w-7 h-8 rounded-lg bg-analog-accent text-white flex items-center justify-center shadow-md relative"
              style={{
                clipPath: 'polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)',
              }}
            >
              <div className="flex items-center space-x-0.5">
                <span className="w-0.5 h-1.5 bg-white rounded-full" />
                <span className="w-0.5 h-3 bg-white rounded-full" />
                <span className="w-0.5 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Sleek Rod with sliding weight */}
            <div className="w-1.5 h-3 bg-analog-secondary/80 rounded-xs mt-0.5" />
            <div className="w-1 flex-1 bg-gradient-to-b from-analog-border via-analog-secondary to-analog-border" />
          </motion.div>

          {/* Center Brass Pivot Rivet */}
          <div className="relative z-10 w-5 h-5 rounded-full bg-analog-surface border-2 border-analog-border flex items-center justify-center shadow-xs">
            <div className="w-2 h-2 rounded-full bg-analog-primary" />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-center font-sans italic text-[11px] text-analog-secondary mt-auto pt-1">
        Continuous Pendulum Motion
      </div>
    </div>
  );
};
