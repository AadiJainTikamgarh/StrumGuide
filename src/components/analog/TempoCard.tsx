'use client';

import React, { useRef, useState } from 'react';
import { Sliders, ChevronDown, Radio } from 'lucide-react';
import { TimeSignature, Subdivision } from '@/types/strum';

interface TempoCardProps {
  bpm: number;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  onBpmChange: (bpm: number) => void;
  onTapTempo: () => void;
  onTimeSignatureChange: (ts: TimeSignature) => void;
  onSubdivisionChange: (sub: Subdivision) => void;
}

export const TempoCard: React.FC<TempoCardProps> = ({
  bpm,
  timeSignature,
  subdivision,
  onBpmChange,
  onTapTempo,
  onTimeSignatureChange,
  onSubdivisionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(bpm);

  // Rotary angle: -135deg to +135deg
  const angle = ((bpm - 40) / (240 - 40)) * 270 - 135;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startValRef.current = bpm;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = startYRef.current - e.clientY;
    const step = Math.round((deltaY / 180) * 200);
    const nextVal = Math.min(240, Math.max(40, startValRef.current + step));
    if (nextVal !== bpm) onBpmChange(nextVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const adjustBy = (delta: number) => {
    onBpmChange(Math.min(240, Math.max(40, bpm + delta)));
  };

  return (
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-5 shadow-xs flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center space-x-2 text-analog-primary mb-3">
        <Sliders className="w-4 h-4 text-analog-secondary" />
        <h3 className="font-display text-sm font-bold tracking-tight">Tempo</h3>
      </div>

      {/* Main Instrument Cluster */}
      <div className="flex items-center justify-between gap-3">
        {/* BPM Big Number Display */}
        <div className="flex flex-col">
          <span className="font-display text-4xl font-black text-analog-primary leading-none tracking-tight">
            {bpm}
          </span>
          <span className="font-mono text-xs font-semibold text-analog-secondary mt-1">
            BPM
          </span>
        </div>

        {/* Brushed Metallic Rotary Knob */}
        <div className="relative flex flex-col items-center">
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`w-20 h-20 rounded-full cursor-ns-resize touch-none select-none transition-shadow relative flex items-center justify-center ${
              isDragging ? 'ring-2 ring-analog-accent shadow-md' : 'shadow-md hover:border-analog-accent/40'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FFFFFF, var(--analog-border))',
              border: '2px solid var(--analog-border)',
            }}
            title="Drag up or down to set tempo"
          >
            {/* Outer ring */}
            <div className="absolute inset-1.5 rounded-full border border-analog-secondary/30 pointer-events-none" />

            {/* Rotating Needle / Line Indicator */}
            <div
              className="absolute inset-0 flex items-start justify-center pt-1.5 pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.08s ease-out',
              }}
            >
              <div className="w-1 h-3 rounded-full bg-analog-accent" />
            </div>

            {/* Brushed metallic center cap */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-analog-surface to-analog-elevated border border-analog-border pointer-events-none" />
          </div>

          {/* Tap Tempo Button underneath */}
          <button
            onClick={onTapTempo}
            className="mt-2.5 px-3 py-1 rounded-full border border-analog-border bg-analog-bg hover:bg-analog-elevated active:bg-analog-accent active:text-white text-analog-primary font-display text-[10px] font-bold tracking-wider flex items-center space-x-1 shadow-2xs transition cursor-pointer"
          >
            <Radio className="w-2.5 h-2.5 text-analog-accent" />
            <span>Tap</span>
          </button>
        </div>

        {/* Vertical Fine Steppers (+5, +1, -1, -5) */}
        <div className="flex flex-col space-y-1">
          <button
            onClick={() => adjustBy(5)}
            className="px-2 py-1 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated font-mono text-[10px] font-bold text-analog-secondary hover:text-analog-primary transition cursor-pointer"
            title="+5 BPM"
          >
            +5
          </button>
          <button
            onClick={() => adjustBy(1)}
            className="px-2 py-1 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated font-mono text-[10px] font-bold text-analog-secondary hover:text-analog-primary transition cursor-pointer"
            title="+1 BPM"
          >
            +1
          </button>
          <button
            onClick={() => adjustBy(-1)}
            className="px-2 py-1 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated font-mono text-[10px] font-bold text-analog-secondary hover:text-analog-primary transition cursor-pointer"
            title="-1 BPM"
          >
            -1
          </button>
          <button
            onClick={() => adjustBy(-5)}
            className="px-2 py-1 rounded-md border border-analog-border bg-analog-bg hover:bg-analog-elevated font-mono text-[10px] font-bold text-analog-secondary hover:text-analog-primary transition cursor-pointer"
            title="-5 BPM"
          >
            -5
          </button>
        </div>

        {/* Time Signature & Subdivision dropdowns */}
        <div className="flex flex-col space-y-2 pl-1 border-l border-analog-border/50">
          <div>
            <span className="font-mono text-[9px] text-analog-secondary uppercase block mb-0.5">
              Time
            </span>
            <div className="relative">
              <select
                value={timeSignature}
                onChange={(e) => onTimeSignatureChange(e.target.value as TimeSignature)}
                className="appearance-none px-2.5 py-1 pr-6 rounded-md bg-analog-bg border border-analog-border font-mono text-xs font-bold text-analog-primary cursor-pointer w-full"
              >
                <option value="4/4">4/4</option>
                <option value="3/4">3/4</option>
              </select>
              <ChevronDown className="w-3 h-3 text-analog-secondary absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          <div>
            <span className="font-mono text-[9px] text-analog-secondary uppercase block mb-0.5">
              Subdivision
            </span>
            <div className="relative">
              <select
                value={subdivision}
                onChange={(e) => onSubdivisionChange(e.target.value as Subdivision)}
                className="appearance-none px-2.5 py-1 pr-6 rounded-md bg-analog-bg border border-analog-border font-mono text-xs font-bold text-analog-primary cursor-pointer w-full"
              >
                <option value="8th">8th</option>
                <option value="16th">16th</option>
              </select>
              <ChevronDown className="w-3 h-3 text-analog-secondary absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
