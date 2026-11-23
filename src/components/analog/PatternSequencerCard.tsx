'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Pencil,
  Play,
  Pause,
  Undo2,
  Redo2,
  Trash2,
  ChevronDown,
  ArrowDown,
  ArrowUp,
  X,
  Minus,
  Ghost,
  Volume2,
} from 'lucide-react';
import { StrumSlot, StrumAction, TimeSignature, Subdivision } from '@/types/strum';

interface PatternSequencerCardProps {
  slots: StrumSlot[];
  currentSlotIndex: number;
  isPlaying: boolean;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  barCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onSlotCycleAction: (index: number) => void;
  onSubdivisionChange: (sub: Subdivision) => void;
  onBarCountChange: (bars: number) => void;
  onTogglePlay: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearPattern: () => void;
}

export const PatternSequencerCard: React.FC<PatternSequencerCardProps> = ({
  slots,
  currentSlotIndex,
  isPlaying,
  timeSignature,
  subdivision,
  barCount,
  canUndo,
  canRedo,
  onSlotCycleAction,
  onSubdivisionChange,
  onBarCountChange,
  onTogglePlay,
  onUndo,
  onRedo,
  onClearPattern,
}) => {
  const [isEditing, setIsEditing] = React.useState(true);
  const slotsPerBeat = subdivision === '8th' ? 2 : 4;
  const beatsPerBar = timeSignature === '4/4' ? 4 : 3;
  const slotsPerBar = beatsPerBar * slotsPerBeat;

  // Display only bar 1 slots or all depending on grid
  const visibleSlots = slots.slice(0, slotsPerBar);

  return (
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-3.5 sm:p-5 shadow-xs select-none min-w-0">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-3.5 border-b border-analog-border/50">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-analog-secondary shrink-0" />
          <h3 className="font-display text-sm font-bold tracking-tight text-analog-primary">
            Strumming Pattern
          </h3>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {/* Edit Pill */}
          <button
            type="button"
            role="switch"
            aria-checked={isEditing}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 rounded-full border font-display text-xs font-bold flex items-center space-x-1.5 transition-all select-none cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              isEditing
                ? 'border-analog-accent bg-analog-accent text-white shadow-xs'
                : 'border-analog-accent/40 bg-analog-accent/10 text-analog-accent hover:bg-analog-accent hover:text-white'
            }`}
            title="Toggle pattern editing mode"
          >
            <Pencil className="w-3 h-3" />
            <span>{isEditing ? 'Editing' : 'Edit'}</span>
          </button>

          {/* Mini Play / Pause */}
          <button
            onClick={onTogglePlay}
            className="px-3 py-1 rounded-full border border-analog-border bg-analog-bg hover:bg-analog-elevated text-analog-primary font-display text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Bar selector dropdown */}
          <div className="relative">
            <select
              value={barCount}
              onChange={(e) => onBarCountChange(Number(e.target.value))}
              className="appearance-none px-3 py-1 pr-6 rounded-full bg-analog-bg border border-analog-border font-mono text-xs font-bold text-analog-primary cursor-pointer"
            >
              <option value={1}>1 Bar</option>
              <option value={2}>2 Bars</option>
              <option value={4}>4 Bars</option>
            </select>
            <ChevronDown className="w-3 h-3 text-analog-secondary absolute right-2 top-2 pointer-events-none" />
          </div>

          <div className="h-4 w-[1px] bg-analog-border mx-1" />

          {/* Undo, Redo, Trash */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-full hover:bg-analog-elevated text-analog-secondary hover:text-analog-primary disabled:opacity-30 transition cursor-pointer"
              title="Undo edit (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-full hover:bg-analog-elevated text-analog-secondary hover:text-analog-primary disabled:opacity-30 transition cursor-pointer"
              title="Redo edit (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClearPattern}
              className="p-1.5 rounded-full hover:bg-analog-elevated text-analog-secondary hover:text-analog-accent transition cursor-pointer"
              title="Reset pattern"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sequencer Workspace: Left Subdivision Toggles + Center Slots + Right Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-center pt-3.5 sm:pt-4">
        {/* Left: Stacked Subdivision Toggles (2 cols on desktop, 2-col row on mobile) */}
        <div
          role="radiogroup"
          aria-label="Subdivision rhythm timing"
          className="lg:col-span-2 grid grid-cols-2 lg:flex lg:flex-col gap-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={subdivision === '8th'}
            onClick={() => onSubdivisionChange('8th')}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-display font-bold flex items-center justify-between transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              subdivision === '8th'
                ? 'border-analog-accent text-analog-accent bg-analog-accent/10 shadow-xs'
                : 'border-analog-border text-analog-secondary bg-analog-bg hover:text-analog-primary hover:border-analog-secondary/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-analog-accent">↓↓</span>
              <span className="text-[11px] sm:text-xs">8th Notes</span>
            </div>
            {subdivision === '8th' && (
              <span className="w-1.5 h-1.5 rounded-full bg-analog-accent shrink-0" />
            )}
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={subdivision === '16th'}
            onClick={() => onSubdivisionChange('16th')}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-display font-bold flex items-center justify-between transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              subdivision === '16th'
                ? 'border-analog-accent text-analog-accent bg-analog-accent/10 shadow-xs'
                : 'border-analog-border text-analog-secondary bg-analog-bg hover:text-analog-primary hover:border-analog-secondary/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-analog-accent">↓↓↓↓</span>
              <span className="text-[11px] sm:text-xs">16th Notes</span>
            </div>
            {subdivision === '16th' && (
              <span className="w-1.5 h-1.5 rounded-full bg-analog-accent shrink-0" />
            )}
          </button>
        </div>

        {/* Center: Interactive Beat Slots Grid (8 cols on desktop) */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          <div className="overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="min-w-[280px] sm:min-w-0">
              {/* Beat Numbers Above Slots */}
              <div className="grid grid-cols-8 gap-1.5 sm:gap-2 mb-1.5 px-0.5 text-center font-display text-[10px] sm:text-xs font-bold text-analog-secondary">
                {visibleSlots.map((s, idx) => (
                  <span key={`lbl-${idx}`} className={s.subdivisionLabel.match(/[0-9]/) ? 'text-analog-primary font-black' : ''}>
                    {s.subdivisionLabel}
                  </span>
                ))}
              </div>

              {/* Rhythm Keycap Slots */}
              <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
                {visibleSlots.map((slot, idx) => {
                  const isCurrent = isPlaying && currentSlotIndex % slotsPerBar === idx;

                  // Style matching reference UI
                  let bgStyle = 'bg-analog-elevated/70 border-analog-border text-analog-secondary';
                  let icon = <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />;

                  if (slot.action === 'DOWN') {
                    bgStyle = 'bg-strum-down border-strum-down text-white shadow-xs';
                    icon = <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />;
                  } else if (slot.action === 'UP') {
                    bgStyle = 'bg-strum-up border-strum-up text-white shadow-xs';
                    icon = <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />;
                  } else if (slot.action === 'GHOST') {
                    bgStyle = 'bg-analog-surface border-2 border-dashed border-analog-secondary text-analog-secondary';
                    icon = <Ghost className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
                  } else if (slot.action === 'MUTE') {
                    bgStyle = 'bg-strum-mute border-strum-mute text-white shadow-xs';
                    icon = <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />;
                  }

                  return (
                    <div key={slot.id} className="relative flex flex-col items-center">
                      {/* Top Orange Carrot / Pointer Triangle on Active Step */}
                      <div className="h-2 flex items-center justify-center">
                        {isCurrent && (
                          <div className="w-0 h-0 border-l-[4px] sm:border-l-[5px] border-l-transparent border-r-[4px] sm:border-r-[5px] border-r-transparent border-t-[5px] sm:border-t-[6px] border-t-analog-accent animate-bounce" />
                        )}
                      </div>

                      {/* Key Button */}
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => onSlotCycleAction(idx)}
                        className={`w-full h-11 sm:h-14 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${bgStyle} ${
                          isCurrent ? 'ring-2 ring-analog-accent ring-offset-2 ring-offset-analog-surface scale-105 z-10' : ''
                        }`}
                        title={`Click to cycle action (${slot.action})`}
                      >
                        {icon}
                      </motion.button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Legend Card (2 cols on desktop, responsive badge grid on mobile/tablet) */}
        <div className="lg:col-span-2 p-2.5 sm:p-3 rounded-xl bg-analog-bg/70 border border-analog-border text-[10px] font-sans grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-col gap-1.5 sm:gap-2 lg:gap-0 lg:space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-down flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              ↓
            </span>
            <span className="text-analog-primary font-medium truncate">Down Strum</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-up flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              ↑
            </span>
            <span className="text-analog-primary font-medium truncate">Up Strum</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded border border-dashed border-analog-secondary flex items-center justify-center text-analog-secondary text-[8px] shrink-0">
              ↓
            </span>
            <span className="text-analog-secondary font-medium truncate">Ghost / Air</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-mute flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              ✕
            </span>
            <span className="text-analog-primary font-medium truncate">Mute / Slap</span>
          </div>

          <div className="flex items-center space-x-1.5 col-span-2 sm:col-span-1 lg:col-span-auto">
            <span className="w-3.5 h-3.5 rounded bg-analog-elevated flex items-center justify-center text-analog-secondary text-[8px] shrink-0">
              —
            </span>
            <span className="text-analog-secondary font-medium truncate">Rest</span>
          </div>
        </div>
      </div>
    </div>
  );
};
