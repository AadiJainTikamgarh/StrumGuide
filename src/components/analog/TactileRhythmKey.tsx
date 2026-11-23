'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUp, X, Minus, Ghost } from 'lucide-react';
import { StrumSlot, StrumAction } from '@/types/strum';

interface TactileRhythmKeyProps {
  slot: StrumSlot;
  index: number;
  isActive: boolean;
  onCycleAction: (index: number) => void;
  onSetAction: (index: number, action: StrumAction) => void;
}

export const TactileRhythmKey: React.FC<TactileRhythmKeyProps> = ({
  slot,
  index,
  isActive,
  onCycleAction,
  onSetAction,
}) => {
  const isDownstroke = slot.direction === 'down';

  // Physical color token assignment
  const stateThemes: Record<
    StrumAction,
    {
      bg: string;
      border: string;
      text: string;
      icon: React.ReactNode;
      label: string;
    }
  > = {
    DOWN: {
      bg: 'bg-strum-down/15',
      border: 'border-strum-down',
      text: 'text-strum-down',
      icon: <ArrowDown className="w-4 h-4 stroke-[2.5]" />,
      label: 'DOWN',
    },
    UP: {
      bg: 'bg-strum-up/15',
      border: 'border-strum-up',
      text: 'text-strum-up',
      icon: <ArrowUp className="w-4 h-4 stroke-[2.5]" />,
      label: 'UP',
    },
    GHOST: {
      bg: 'bg-analog-elevated/40',
      border: 'border-dashed border-analog-secondary',
      text: 'text-analog-secondary',
      icon: <Ghost className="w-3.5 h-3.5" />,
      label: 'AIR',
    },
    MUTE: {
      bg: 'bg-strum-mute/15',
      border: 'border-strum-mute',
      text: 'text-strum-mute',
      icon: <X className="w-4 h-4 stroke-[2.5]" />,
      label: 'MUTE',
    },
    REST: {
      bg: 'bg-analog-surface',
      border: 'border-analog-border',
      text: 'text-analog-border',
      icon: <Minus className="w-3.5 h-3.5 opacity-60" />,
      label: 'REST',
    },
  };

  const theme = stateThemes[slot.action];

  return (
    <div className="relative flex flex-col items-center group">
      {/* Physical Instrument Keycap */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        animate={
          isActive
            ? {
                y: -2,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
              }
            : {
                y: 0,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }
        }
        transition={{ duration: 0.08 }}
        onClick={() => onCycleAction(index)}
        className={`relative w-full min-h-[72px] rounded-md border-2 p-1.5 flex flex-col items-center justify-between cursor-pointer select-none transition-colors ${
          theme.bg
        } ${theme.border} ${
          isActive
            ? 'ring-2 ring-analog-accent ring-offset-1 ring-offset-analog-surface z-10'
            : 'hover:border-analog-secondary'
        }`}
        title={`Slot ${slot.subdivisionLabel} • Click to cycle (${theme.label})`}
      >
        {/* Top Header: Subdivision label & mini status LED */}
        <div className="flex items-center justify-between w-full px-0.5">
          <span className="font-mono text-[10px] font-bold text-analog-secondary">
            {slot.subdivisionLabel}
          </span>

          {/* Machine Indicator LED */}
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isActive
                ? 'bg-analog-accent shadow-xs shadow-analog-accent'
                : slot.action !== 'REST'
                ? 'bg-analog-secondary/60'
                : 'bg-analog-border'
            }`}
          />
        </div>

        {/* Center Action Icon */}
        <div className={`my-0.5 ${theme.text}`}>{theme.icon}</div>

        {/* Bottom Direction Marker */}
        <div className="flex items-center justify-center w-full border-t border-analog-border/30 pt-0.5">
          <span className="font-mono text-[9px] uppercase tracking-tighter text-analog-secondary/70">
            {isDownstroke ? '↓ dn' : '↑ up'}
          </span>
        </div>
      </motion.button>
    </div>
  );
};
