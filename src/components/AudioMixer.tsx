'use client';

import React from 'react';
import { Volume2, VolumeX, Music, BellRing, Timer } from 'lucide-react';
import { AudioSettings } from '@/types/strum';

interface AudioMixerProps {
  settings: AudioSettings;
  onChange: (newSettings: AudioSettings) => void;
}

export const AudioMixer: React.FC<AudioMixerProps> = ({ settings, onChange }) => {
  return (
    <div className="w-full rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Audio Mix & Volume</h3>
        </div>
        <span className="text-xs text-zinc-500">Zero-drift Web Audio engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel 1: Guitar Strum Sound (with explicit Mute / Toggle) */}
        <div className="flex flex-col space-y-3 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Music className={`w-4 h-4 ${settings.isGuitarMuted ? 'text-zinc-600' : 'text-emerald-400'}`} />
              <span className="text-xs font-bold text-zinc-200">Guitar Audio</span>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() =>
                onChange({
                  ...settings,
                  isGuitarMuted: !settings.isGuitarMuted,
                })
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                settings.isGuitarMuted
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {settings.isGuitarMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enabled</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
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
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                settings.isGuitarMuted ? 'bg-zinc-800 opacity-40' : 'bg-zinc-800 accent-emerald-500'
              }`}
            />
            <span className="text-xs font-mono font-bold text-zinc-400 w-8 text-right">
              {settings.isGuitarMuted ? '0%' : `${Math.round(settings.guitarVolume * 100)}%`}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500">
            {settings.isGuitarMuted
              ? 'Guitar sound muted (practice with click only)'
              : 'Physical modeled acoustic guitar chords & sweeps'}
          </span>
        </div>

        {/* Channel 2: Metronome Click */}
        <div className="flex flex-col space-y-3 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellRing className={`w-4 h-4 ${settings.isMetronomeMuted ? 'text-zinc-600' : 'text-sky-400'}`} />
              <span className="text-xs font-bold text-zinc-200">Metronome Click</span>
            </div>
            {/* Toggle switch */}
            <button
              onClick={() =>
                onChange({
                  ...settings,
                  isMetronomeMuted: !settings.isMetronomeMuted,
                })
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                settings.isMetronomeMuted
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}
            >
              {settings.isMetronomeMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Enabled</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
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
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                settings.isMetronomeMuted ? 'bg-zinc-800 opacity-40' : 'bg-zinc-800 accent-sky-500'
              }`}
            />
            <span className="text-xs font-mono font-bold text-zinc-400 w-8 text-right">
              {settings.isMetronomeMuted ? '0%' : `${Math.round(settings.metronomeVolume * 100)}%`}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500">
            {settings.isMetronomeMuted
              ? 'Click muted (visual & guitar strum only)'
              : 'Woodblock sound with accented Beat 1'}
          </span>
        </div>

        {/* Channel 3: Count-In & Master Controls */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-200">Pre-Roll Count-In</span>
            </div>
            <button
              onClick={() =>
                onChange({
                  ...settings,
                  countInEnabled: !settings.countInEnabled,
                })
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                settings.countInEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {settings.countInEnabled ? 'Active (4 beats)' : 'Off (Starts Instantly)'}
            </button>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-xs text-zinc-400 mb-1">
              <span>Master Volume</span>
              <span className="font-mono">{Math.round(settings.masterVolume * 100)}%</span>
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
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
