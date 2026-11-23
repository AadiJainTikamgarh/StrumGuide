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
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-5 shadow-xs select-none">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-analog-border/50">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-analog-secondary" />
          <h3 className="font-display text-sm font-bold tracking-tight text-analog-primary">
            Strumming Pattern
          </h3>
        </div>

        {/* Center / Right Control Cluster */}
        <div className="flex items-center space-x-2">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-4">
        {/* Left: Stacked Subdivision Toggles (2 cols) */}
        <div
          role="radiogroup"
          aria-label="Subdivision rhythm timing"
          className="lg:col-span-2 flex flex-col space-y-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={subdivision === '8th'}
            onClick={() => onSubdivisionChange('8th')}
            className={`px-3 py-2 rounded-xl border text-xs font-display font-bold flex items-center justify-between transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              subdivision === '8th'
                ? 'border-analog-accent text-analog-accent bg-analog-accent/10 shadow-xs'
                : 'border-analog-border text-analog-secondary bg-analog-bg hover:text-analog-primary hover:border-analog-secondary/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-analog-accent">↓↓</span>
              <span>8th Notes</span>
            </div>
            {subdivision === '8th' && (
              <span className="w-1.5 h-1.5 rounded-full bg-analog-accent" />
            )}
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={subdivision === '16th'}
            onClick={() => onSubdivisionChange('16th')}
            className={`px-3 py-2 rounded-xl border text-xs font-display font-bold flex items-center justify-between transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-analog-accent ${
              subdivision === '16th'
                ? 'border-analog-accent text-analog-accent bg-analog-accent/10 shadow-xs'
                : 'border-analog-border text-analog-secondary bg-analog-bg hover:text-analog-primary hover:border-analog-secondary/60'
            }`}
          >
            <div className="flex items-center space-x-1.5">
              <span className="font-mono text-analog-accent">↓↓↓↓</span>
              <span>16th Notes</span>
            </div>
            {subdivision === '16th' && (
              <span className="w-1.5 h-1.5 rounded-full bg-analog-accent" />
            )}
          </button>
        </div>

        {/* Center: Interactive Beat Slots Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Beat Numbers Above Slots */}
          <div className="grid grid-cols-8 gap-2 mb-1.5 px-1 text-center font-display text-xs font-bold text-analog-secondary">
            {visibleSlots.map((s, idx) => (
              <span key={`lbl-${idx}`} className={s.subdivisionLabel.match(/[0-9]/) ? 'text-analog-primary font-black' : ''}>
                {s.subdivisionLabel}
              </span>
            ))}
          </div>

          {/* Rhythm Keycap Slots */}
          <div className="grid grid-cols-8 gap-2">
            {visibleSlots.map((slot, idx) => {
              const isCurrent = isPlaying && currentSlotIndex % slotsPerBar === idx;

              // Style matching reference UI
              let bgStyle = 'bg-analog-elevated/70 border-analog-border text-analog-secondary';
              let icon = <Minus className="w-4 h-4 stroke-[2.5]" />;

              if (slot.action === 'DOWN') {
                bgStyle = 'bg-strum-down border-strum-down text-white shadow-xs';
                icon = <ArrowDown className="w-5 h-5 stroke-[3]" />;
              } else if (slot.action === 'UP') {
                bgStyle = 'bg-strum-up border-strum-up text-white shadow-xs';
                icon = <ArrowUp className="w-5 h-5 stroke-[3]" />;
              } else if (slot.action === 'GHOST') {
                bgStyle = 'bg-analog-surface border-2 border-dashed border-analog-secondary text-analog-secondary';
                icon = <Ghost className="w-4 h-4" />;
              } else if (slot.action === 'MUTE') {
                bgStyle = 'bg-strum-mute border-strum-mute text-white shadow-xs';
                icon = <X className="w-5 h-5 stroke-[3]" />;
              }

              return (
                <div key={slot.id} className="relative flex flex-col items-center">
                  {/* Top Orange Carrot / Pointer Triangle on Active Step */}
                  <div className="h-2 flex items-center justify-center">
                    {isCurrent && (
                      <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-analog-accent animate-bounce" />
                    )}
                  </div>

                  {/* Key Button */}
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onSlotCycleAction(idx)}
                    className={`w-full h-14 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${bgStyle} ${
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

        {/* Right: Legend Card (2 cols) */}
        <div className="lg:col-span-2 p-3 rounded-xl bg-analog-bg/70 border border-analog-border text-[10px] font-sans flex flex-col space-y-1.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-down flex items-center justify-center text-white text-[8px] font-bold">
              ↓
            </span>
            <span className="text-analog-primary font-medium">Down Strum</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-up flex items-center justify-center text-white text-[8px] font-bold">
              ↑
            </span>
            <span className="text-analog-primary font-medium">Up Strum</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded border border-dashed border-analog-secondary flex items-center justify-center text-analog-secondary text-[8px]">
              ↓
            </span>
            <span className="text-analog-secondary font-medium">Ghost / Air</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-strum-mute flex items-center justify-center text-white text-[8px] font-bold">
              ✕
            </span>
            <span className="text-analog-primary font-medium">Mute / Slap</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-analog-elevated flex items-center justify-center text-analog-secondary text-[8px]">
              —
            </span>
            <span className="text-analog-secondary font-medium">Rest</span>
          </div>
        </div>
      </div>
    </div>
  );
};
