export type StrumAction = 'DOWN' | 'UP' | 'GHOST' | 'MUTE' | 'REST';

export type ChordMode = 'single' | 'progression';

export type TimeSignature = '4/4' | '3/4';

export type Subdivision = '8th' | '16th';

export interface StrumSlot {
  id: string;
  action: StrumAction;
  beatNumber: number; // e.g. 1, 2, 3, 4
  subdivisionLabel: string; // e.g. "1", "&", "e", "a"
  direction: 'down' | 'up'; // natural physical direction of hand
  isAccented?: boolean;
}

export interface ChordDefinition {
  name: string;
  displayName: string;
  // Fret positions from string 6 (low E) to string 1 (high E). -1 means mute/don't play, 0 means open string.
  frets: [number, number, number, number, number, number];
  // Standard tuning base frequencies (low E=82.41Hz, A=110Hz, D=146.83Hz, G=196Hz, B=246.94Hz, high E=329.63Hz)
  // Actual frequencies of the fretted notes:
  frequencies: [number, number, number, number, number, number];
  fingering?: string[]; // display guidance, e.g. ['3', '2', '0', '0', '0', '3']
  category: 'Major' | 'Minor' | 'Dominant 7th' | 'Other';
}

export interface StrumPattern {
  id: string;
  name: string;
  description: string;
  timeSignature: TimeSignature;
  subdivision: Subdivision;
  slots: StrumSlot[];
  category: 'Beginner' | 'Pop/Rock' | 'Folk' | 'Funk/R&B' | 'Custom';
  suggestedBpm: number;
}

export interface ProgressionBar {
  barIndex: number;
  chordName: string;
}

export interface SpeedTrainerConfig {
  enabled: boolean;
  startBpm: number;
  targetBpm: number;
  incrementBpm: number;
  incrementEveryBars: number;
}

export interface AudioSettings {
  masterVolume: number;
  guitarVolume: number;
  isGuitarMuted: boolean;
  metronomeVolume: number;
  isMetronomeMuted: boolean;
  countInEnabled: boolean;
}
