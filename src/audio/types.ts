import { StrumAction, StrumPattern, AudioSettings, SpeedTrainerConfig, TimeSignature, Subdivision } from '@/types/strum';

export type AudioEngineStatus =
  | 'uninitialized'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'stopped'
  | 'error';

export type StrumDirection = 'down' | 'up';

export interface TickEvent {
  slotIndex: number;
  barIndex: number;
  beatNumber: number;
  subdivisionLabel: string;
  direction: StrumDirection;
  chordName: string;
  currentBpm: number;
  isCountIn: boolean;
  countInBeat: number;
  audioTime?: number;
}

export type TickCallback = (event: TickEvent) => void;
export type StateChangeCallback = (state: AudioEngineStatus) => void;
export type LoadingProgressCallback = (loaded: number, total: number, percent: number) => void;
export type BpmChangeCallback = (newBpm: number) => void;

export interface AudioEngineOptions {
  pattern: StrumPattern;
  chordProgression: string[];
  audioSettings: AudioSettings;
  speedTrainer: SpeedTrainerConfig;
  bpm: number;
}
