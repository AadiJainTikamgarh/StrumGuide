'use client';

import React from 'react';
import { Volume2, VolumeX, Music, BellRing, Timer } from 'lucide-react';
import { AudioSettings } from '@/types/strum';

interface AmpMixerProps {
  settings: AudioSettings;
  countInBeats: 3 | 4;
  onChange: (newSettings: AudioSettings) => void;
  onCountInBeatsChange: (beats: 3 | 4) => void;
}

export const AmpMixer: React.FC<AmpMixerProps> = ({
  settings,
  countInBeats,
  onChange,
  onCountInBeatsChange,
}) => {
  return (
    <div className="relative w-full rounded-lg border border-analog-border bg-analog-surface p-4 shadow-tactile select-none">
      {/* Corner machine screws */}
      <div className="absolute top-2 left-2 machine-screw" />
      <div className="absolute top-2 right-2 machine-screw" />
      <div className="absolute bottom-2 left-2 machine-screw" />
      <div className="absolute bottom-2 right-2 machine-screw" />

      {/* Amp Head Header Plate */}
      <div className="flex items-center justify-between pb-3 border-b border-analog-border mb-4 px-2">
        <div className="flex items-center space-x-2">
          <span className="font-display text-[10px] uppercase font-bold tracking-widest text-analog-primary">
            Amp Channel Mixer
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-analog-elevated border border-analog-border text-analog-secondary">
            AUDIO GAIN
          </span>
        </div>
        <span className="font-mono text-[10px] text-analog-secondary">
          MASTER: {Math.round(settings.masterVolume * 100)}%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-1">
        {/* Channel 1: Guitar Acoustics */}
        <div className="p-3 rounded border border-analog-border/70 bg-analog-bg/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  !settings.isGuitarMuted ? 'bg-strum-down shadow-xs' : 'bg-analog-border'
                }`}
              />
              <span className="font-display text-[11px] font-bold text-analog-primary uppercase tracking-wider">
                Guitar Sound
              </span>
            </div>

            <button
              onClick={() =>
                onChange({
                  ...settings,
                  isGuitarMuted: !settings.isGuitarMuted,
                })
              }
              className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold transition ${
                settings.isGuitarMuted
                  ? 'bg-analog-elevated border-analog-border text-analog-secondary'
                  : 'bg-strum-down/15 border-strum-down text-strum-down'
              }`}
            >
              {settings.isGuitarMuted ? 'MUTED' : 'ACTIVE'}
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-analog-secondary mb-1">
              <span>Level</span>
              <span>{settings.isGuitarMuted ? '0%' : `${Math.round(settings.guitarVolume * 100)}%`}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              disabled={settings.isGuitarMuted}
              value={settings.guitarVolume}
              onChange={(e) =>
                onChange({
                  ...settings,
                  guitarVolume: parseFloat(e.target.value),
                })
              }
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-strum-down ${
                settings.isGuitarMuted ? 'opacity-40' : ''
              }`}
            />
          </div>
        </div>

        {/* Channel 2: Metronome Click */}
        <div className="p-3 rounded border border-analog-border/70 bg-analog-bg/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  !settings.isMetronomeMuted ? 'bg-analog-accent shadow-xs' : 'bg-analog-border'
                }`}
              />
              <span className="font-display text-[11px] font-bold text-analog-primary uppercase tracking-wider">
                Metronome Click
              </span>
            </div>

            <button
              onClick={() =>
                onChange({
                  ...settings,
                  isMetronomeMuted: !settings.isMetronomeMuted,
                })
              }
              className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold transition ${
                settings.isMetronomeMuted
                  ? 'bg-analog-elevated border-analog-border text-analog-secondary'
                  : 'bg-analog-accent/15 border-analog-accent text-analog-accent'
              }`}
            >
              {settings.isMetronomeMuted ? 'MUTED' : 'ACTIVE'}
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-analog-secondary mb-1">
              <span>Level</span>
              <span>{settings.isMetronomeMuted ? '0%' : `${Math.round(settings.metronomeVolume * 100)}%`}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              disabled={settings.isMetronomeMuted}
              value={settings.metronomeVolume}
              onChange={(e) =>
                onChange({
                  ...settings,
                  metronomeVolume: parseFloat(e.target.value),
                })
              }
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-accent ${
                settings.isMetronomeMuted ? 'opacity-40' : ''
              }`}
            />
          </div>
        </div>

        {/* Channel 3: Count-In & Master Level */}
        <div className="p-3 rounded border border-analog-border/70 bg-analog-bg/50 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Timer className="w-3.5 h-3.5 text-analog-secondary" />
              <span className="font-display text-[11px] font-bold text-analog-primary uppercase tracking-wider">
                Pre-Roll Count
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() =>
                  onChange({
                    ...settings,
                    countInEnabled: !settings.countInEnabled,
                  })
                }
                className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold transition ${
                  settings.countInEnabled
                    ? 'bg-analog-primary text-analog-bg border-analog-primary'
                    : 'bg-analog-elevated border-analog-border text-analog-secondary'
                }`}
              >
                {settings.countInEnabled ? 'ON' : 'OFF'}
              </button>

              {settings.countInEnabled && (
                <div className="flex items-center border border-analog-border rounded text-[9px] font-mono overflow-hidden">
                  <button
                    onClick={() => onCountInBeatsChange(3)}
                    className={`px-1.5 py-0.5 font-bold ${
                      countInBeats === 3 ? 'bg-analog-accent text-white' : 'text-analog-secondary'
                    }`}
                  >
                    3b
                  </button>
                  <button
                    onClick={() => onCountInBeatsChange(4)}
                    className={`px-1.5 py-0.5 font-bold ${
                      countInBeats === 4 ? 'bg-analog-accent text-white' : 'text-analog-secondary'
                    }`}
                  >
                    4b
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-analog-secondary mb-1">
              <span>Master Output</span>
              <span>{Math.round(settings.masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.masterVolume}
              onChange={(e) =>
                onChange({
                  ...settings,
                  masterVolume: parseFloat(e.target.value),
                })
              }
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-analog-border accent-analog-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
