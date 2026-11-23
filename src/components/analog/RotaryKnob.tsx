'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Minus, Plus, Zap } from 'lucide-react';

interface RotaryKnobProps {
  value: number;
  min: number;
  max: number;
  label?: string;
  unit?: string;
  onChange: (val: number) => void;
  onTapTempo?: () => void;
  size?: number; // diameter in px
}

export const RotaryKnob: React.FC<RotaryKnobProps> = ({
  value,
  min = 40,
  max = 240,
  label = 'TEMPO',
  unit = 'BPM',
  onChange,
  onTapTempo,
  size = 110,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Angle range: -135deg to +135deg (270 degrees total rotation)
  const angle = ((value - min) / (max - min)) * 270 - 135;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY; // upward drag increases
    const range = max - min;
    // 200px drag = full range
    const step = Math.round((deltaY / 220) * range);
    const nextVal = Math.min(max, Math.max(min, startValRef.current + step));
    if (nextVal !== value) {
      onChange(nextVal);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    const nextVal = Math.min(max, Math.max(min, value + delta));
    onChange(nextVal);
  };

  const adjustBy = (delta: number) => {
    const nextVal = Math.min(max, Math.max(min, value + delta));
    onChange(nextVal);
  };

  // Generate radial tick marks
  const ticks = Array.from({ length: 19 }).map((_, i) => {
    const tickAngle = (i / 18) * 270 - 135;
    const isActive = tickAngle <= angle;
    return { angle: tickAngle, isActive, isMajor: i % 3 === 0 };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <span className="font-display text-[10px] uppercase font-bold tracking-widest text-analog-secondary">
          {label}
        </span>
        <span className="font-mono text-[10px] text-analog-secondary">
          {min}–{max}
        </span>
      </div>

      {/* Rotary Dial Container */}
      <div className="relative flex items-center justify-center p-2">
        {/* Outer radial ticks */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: size + 36, height: size + 36 }}
        >
          {ticks.map((t, idx) => (
            <div
              key={idx}
              className="absolute pointer-events-none"
              style={{
                width: t.isMajor ? '2px' : '1px',
                height: t.isMajor ? '8px' : '5px',
                backgroundColor: t.isActive
                  ? 'var(--analog-accent)'
                  : 'var(--analog-border)',
                transform: `rotate(${t.angle}deg) translateY(-${size / 2 + 10}px)`,
                transformOrigin: 'center center',
                transition: 'background-color 0.1s ease',
              }}
            />
          ))}

          {/* Interactive Knob Body */}
          <div
            ref={knobRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className={`relative rounded-full cursor-ns-resize touch-none select-none transition-shadow ${
              isDragging
                ? 'shadow-lg ring-2 ring-analog-accent'
                : 'shadow-knob hover:border-analog-accent/60'
            }`}
            style={{
              width: size,
              height: size,
              background: 'radial-gradient(circle at 35% 35%, var(--analog-surface), var(--analog-elevated))',
              border: '2px solid var(--analog-border)',
            }}
            title="Drag up/down or use mouse wheel to set tempo"
          >
            {/* Machined Inner Grooves & Texture */}
            <div className="absolute inset-2 rounded-full border border-analog-border/50 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-full border border-dashed border-analog-border/30 opacity-70" />
            </div>

            {/* Rotating Indicator Needle / Dot */}
            <div
              className="absolute inset-0 flex items-start justify-center pt-2 pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            >
              <div className="w-1.5 h-4 rounded-full bg-analog-accent shadow-sm" />
            </div>

            {/* Center Cap with Value Readout */}
            <div className="absolute inset-4 rounded-full bg-analog-bg border border-analog-border/80 flex flex-col items-center justify-center pointer-events-none shadow-inner">
              <span className="font-mono text-2xl font-bold tracking-tight text-analog-primary leading-none">
                {value}
              </span>
              <span className="font-mono text-[9px] font-semibold text-analog-secondary mt-0.5 tracking-wider">
                {unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stepping and Tap Controls */}
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={() => adjustBy(-5)}
          className="px-2 py-1 rounded border border-analog-border bg-analog-surface hover:bg-analog-elevated active:bg-analog-border font-mono text-[10px] font-bold text-analog-secondary transition"
          title="-5 BPM"
        >
          -5
        </button>
        <button
          onClick={() => adjustBy(-1)}
          className="p-1 rounded border border-analog-border bg-analog-surface hover:bg-analog-elevated active:bg-analog-border text-analog-secondary transition"
          title="-1 BPM"
        >
          <Minus className="w-3 h-3" />
        </button>
        {onTapTempo && (
          <button
            onClick={onTapTempo}
            className="px-2.5 py-1 rounded border border-analog-accent/40 bg-analog-surface hover:bg-analog-accent/10 active:bg-analog-accent active:text-white font-display text-[10px] font-bold uppercase tracking-wider text-analog-accent flex items-center gap-1 transition"
            title="Tap rhythmically to calculate BPM"
          >
            <Zap className="w-2.5 h-2.5" />
            <span>Tap</span>
          </button>
        )}
        <button
          onClick={() => adjustBy(1)}
          className="p-1 rounded border border-analog-border bg-analog-surface hover:bg-analog-elevated active:bg-analog-border text-analog-secondary transition"
          title="+1 BPM"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={() => adjustBy(5)}
          className="px-2 py-1 rounded border border-analog-border bg-analog-surface hover:bg-analog-elevated active:bg-analog-border font-mono text-[10px] font-bold text-analog-secondary transition"
          title="+5 BPM"
        >
          +5
        </button>
      </div>
    </div>
  );
};
