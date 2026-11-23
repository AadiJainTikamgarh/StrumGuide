/**
 * StrumGuide — useAudioEngine Hook
 * Decouples the Web Audio engine from React UI rendering while exposing a reactive API.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from './AudioEngine';
import { AudioEngineStatus, TickEvent } from './types';
import { StrumPattern, AudioSettings, SpeedTrainerConfig } from '@/types/strum';

export interface UseAudioEngineProps {
  initialPattern: StrumPattern;
  initialProgression: string[];
  initialSettings: AudioSettings;
  initialSpeedTrainer: SpeedTrainerConfig;
  initialBpm: number;
  onTick?: (event: TickEvent) => void;
  onBpmChange?: (bpm: number) => void;
}

export function useAudioEngine({
  initialPattern,
  initialProgression,
  initialSettings,
  initialSpeedTrainer,
  initialBpm,
  onTick,
  onBpmChange,
}: UseAudioEngineProps) {
  const engineRef = useRef<AudioEngine | null>(null);
  const [status, setStatus] = useState<AudioEngineStatus>('uninitialized');
  const [loadPercent, setLoadPercent] = useState<number>(0);

  // Initialize engine on first mount (lazy AudioContext instantiation)
  useEffect(() => {
    const engine = AudioEngine.getInstance({
      pattern: initialPattern,
      chordProgression: initialProgression,
      audioSettings: initialSettings,
      speedTrainer: initialSpeedTrainer,
      bpm: initialBpm,
    });
    engineRef.current = engine;

    const unsubStatus = engine.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    const unsubProgress = engine.onProgress((_loaded, _total, percent) => {
      setLoadPercent(percent);
    });

    const unsubTick = engine.onTick((event) => {
      onTick?.(event);
    });

    const unsubBpm = engine.onBpmChange((newBpm) => {
      onBpmChange?.(newBpm);
    });

    // Background preload of steel guitar samples
    engine.preload();

    return () => {
      unsubStatus();
      unsubProgress();
      unsubTick();
      unsubBpm();
      engine.stop();
    };
  }, []);

  const play = useCallback(async () => {
    if (engineRef.current) {
      await engineRef.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
  }, []);

  const restart = useCallback(async () => {
    if (engineRef.current) {
      await engineRef.current.restart();
    }
  }, []);

  const previewChord = useCallback(async (chordName: string) => {
    if (engineRef.current) {
      await engineRef.current.previewChord(chordName);
    }
  }, []);

  const previewString = useCallback(async (stringIndex: number, fret: number) => {
    if (engineRef.current) {
      await engineRef.current.previewString(stringIndex, fret);
    }
  }, []);

  const updateBpm = useCallback((bpm: number) => {
    engineRef.current?.setBpm(bpm);
  }, []);

  const updatePattern = useCallback((pattern: StrumPattern) => {
    engineRef.current?.setPattern(pattern);
  }, []);

  const updateChordProgression = useCallback((chords: string[]) => {
    engineRef.current?.setChordProgression(chords);
  }, []);

  const updateAudioSettings = useCallback((settings: AudioSettings) => {
    engineRef.current?.setAudioSettings(settings);
  }, []);

  const updateSpeedTrainer = useCallback((config: SpeedTrainerConfig) => {
    engineRef.current?.setSpeedTrainer(config);
  }, []);

  const updateCountInBeats = useCallback((beats: 3 | 4) => {
    engineRef.current?.setCountInBeats(beats);
  }, []);

  return {
    status,
    isPlaying: status === 'playing',
    isLoading: status === 'loading',
    isReady: status === 'ready' || status === 'playing' || status === 'stopped',
    loadPercent,
    play,
    stop,
    restart,
    previewChord,
    previewString,
    updateBpm,
    updatePattern,
    updateChordProgression,
    updateAudioSettings,
    updateSpeedTrainer,
    updateCountInBeats,
  };
}
