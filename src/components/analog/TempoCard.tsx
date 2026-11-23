'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startBpm: number;
    centerX: number;
    centerY: number;
  }>({
    startX: 0,
    startY: 0,
    startBpm: bpm,
    centerX: 0,
    centerY: 0,
  });

  // Rotary angle: -135deg (at 40 BPM) to +135deg (at 240 BPM) -> 270 deg span
  const angle = Math.min(135, Math.max(-135, ((bpm - 40) / (240 - 40)) * 270 - 135));

  // Pointer move handler attached globally to window during active drag
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      const { startX, startY, startBpm, centerX, centerY } = dragStartRef.current;

      // 1. Check if dragging circularly around the center of the knob
      const distFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      let nextBpm = startBpm;

      if (distFromCenter > 25 && distFromCenter < 180) {
        // Circular angle tracking
        // Angle in degrees from top (0 = 12 o'clock, clockwise positive)
        let deg = Math.atan2(e.clientX - centerX, -(e.clientY - centerY)) * (180 / Math.PI);
        // Normalize deg to -135 to +135 range
        if (deg > 180) deg -= 360;
        
        // Clamp dead-zone at bottom (-180 to -135 and +135 to +180)
        if (deg < -135 && deg > -175) deg = -135;
        else if (deg > 135 && deg < 175) deg = 135;
        
        if (deg >= -135 && deg <= 135) {
          const ratio = (deg + 135) / 270;
          nextBpm = Math.round(40 + ratio * (240 - 40));
        } else {
          // In the dead zone at the bottom, use vertical linear delta fallback
          const deltaY = startY - e.clientY;
          const deltaX = e.clientX - startX;
          const combinedDelta = deltaY * 1.0 + deltaX * 0.7;
          const pxPerBpm = e.shiftKey ? 8 : 2.5;
          const step = Math.round(combinedDelta / pxPerBpm);
          nextBpm = startBpm + step;
        }
      } else {
        // Linear vertical/diagonal drag (standard DAW dial interaction)
        const deltaY = startY - e.clientY; // upward drag increases
        const deltaX = e.clientX - startX; // rightward drag increases
        const combinedDelta = deltaY * 1.0 + deltaX * 0.7;
        const pxPerBpm = e.shiftKey ? 8 : 2.5;
        const step = Math.round(combinedDelta / pxPerBpm);
        nextBpm = startBpm + step;
      }

      nextBpm = Math.min(240, Math.max(40, nextBpm));
      if (nextBpm !== bpm) {
        onBpmChange(nextBpm);
      }
    },
    [isDragging, bpm, onBpmChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Register global window listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.button !== 0) return; // Only primary mouse button

    const rect = knobRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.left + rect.width / 2 : e.clientX;
    const centerY = rect ? rect.top + rect.height / 2 : e.clientY;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBpm: bpm,
      centerX,
      centerY,
    };

    setIsDragging(true);
  };

  // Mouse wheel scroll support (+/- 1 BPM, or +/- 5 with Shift)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const step = e.shiftKey ? 5 : 1;
    const delta = e.deltaY < 0 ? step : -step;
    onBpmChange(Math.min(240, Math.max(40, bpm + delta)));
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      onBpmChange(Math.min(240, bpm + step));
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      onBpmChange(Math.max(40, bpm - step));
    } else if (e.key === 'PageUp') {
      e.preventDefault();
      onBpmChange(Math.min(240, bpm + 10));
    } else if (e.key === 'PageDown') {
      e.preventDefault();
      onBpmChange(Math.max(40, bpm - 10));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onBpmChange(40);
    } else if (e.key === 'End') {
      e.preventDefault();
      onBpmChange(240);
    }
  };

  const adjustBy = (delta: number) => {
    onBpmChange(Math.min(240, Math.max(40, bpm + delta)));
  };

  // Static graduation marks around dial perimeter (from -135deg to +135deg)
  const RADIAL_TICKS = [
    -135, -120, -105, -90, -75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90, 105, 120, 135,
  ];

  return (
    <div className="rounded-2xl border border-analog-border bg-analog-surface p-4 sm:p-5 shadow-xs flex flex-col select-none h-full">
      {/* Card Header */}
      <div className="flex items-center space-x-2 text-analog-primary mb-2">
        <Sliders className="w-4 h-4 text-analog-secondary" />
        <h3 className="font-display text-sm font-bold tracking-tight">Tempo</h3>
      </div>

      {/* Main Instrument Cluster */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 flex-1 my-auto py-1">
        {/* BPM Big Number Display */}
        <div className="flex flex-col min-w-[55px] sm:min-w-[70px]">
          <span className="font-display text-3xl sm:text-4xl font-black text-analog-primary leading-none tracking-tight">
            {bpm}
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-semibold text-analog-secondary mt-0.5 sm:mt-1">
            BPM
          </span>
        </div>

        {/* Brushed Metallic Rotary Dial */}
        <div className="relative flex flex-col items-center">
          <div
            ref={knobRef}
            tabIndex={0}
            role="slider"
            aria-label="Tempo BPM Dial"
            aria-valuemin={40}
            aria-valuemax={240}
            aria-valuenow={bpm}
            onPointerDown={handlePointerDown}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => onBpmChange(90)}
            className={`w-20 h-20 rounded-full cursor-ns-resize touch-none select-none relative flex items-center justify-center transition-shadow outline-none ${
              isDragging
                ? 'ring-2 ring-analog-accent shadow-md scale-[1.02]'
                : 'shadow-md hover:border-analog-accent/50 focus-visible:ring-2 focus-visible:ring-analog-accent'
            }`}
            style={{
              background: 'radial-gradient(circle at 35% 35%, #FFFFFF, var(--analog-border))',
              border: '2px solid var(--analog-border)',
            }}
            title="Drag up/down, rotate, or scroll to adjust BPM. Double click to reset."
          >
            {/* Outer radial graduation ticks */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {RADIAL_TICKS.map((tickAngle) => {
                const isActive = tickAngle <= angle;
                const isMajor = tickAngle % 45 === 0 || tickAngle === 0;
                return (
                  <div
                    key={tickAngle}
                    className="absolute"
                    style={{
                      transform: `rotate(${tickAngle}deg) translateY(-37px)`,
                    }}
                  >
                    <div
                      className={`rounded-full transition-colors ${
                        isActive
                          ? 'bg-analog-accent'
                          : 'bg-analog-border/80'
                      }`}
                      style={{
                        width: isMajor ? '2px' : '1.5px',
                        height: isMajor ? '5px' : '3px',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Inner machined bezel line */}
            <div className="absolute inset-2.5 rounded-full border border-analog-secondary/25 pointer-events-none" />

            {/* Rotating Orange Needle / Line Indicator */}
            <div
              className="absolute inset-0 flex items-start justify-center pt-2 pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <div className="w-1.5 h-3.5 rounded-full bg-analog-accent shadow-xs" />
            </div>

            {/* Brushed metallic center cap */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-analog-surface to-analog-elevated border border-analog-border pointer-events-none shadow-2xs flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-analog-secondary/20 border border-analog-border/50" />
            </div>
          </div>

          {/* Tap Tempo Button underneath */}
          <button
            onClick={onTapTempo}
            className="mt-2.5 px-3 py-1 rounded-full border border-analog-border bg-analog-bg hover:bg-analog-elevated active:bg-analog-accent active:text-white text-analog-primary font-display text-[10px] font-bold tracking-wider flex items-center space-x-1 shadow-2xs transition cursor-pointer"
            title="Tap tempo"
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
        <div className="flex flex-row sm:flex-col gap-2 sm:space-y-2 pl-0 sm:pl-1 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-analog-border/50 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex-1 sm:flex-none">
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

          <div className="flex-1 sm:flex-none">
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
