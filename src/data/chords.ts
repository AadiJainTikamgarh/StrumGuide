import { ChordDefinition } from '@/types/strum';

export interface ExtendedChordDefinition extends ChordDefinition {
  baseString: number; // 0 = LowE, 1 = A, 2 = D
}

export const CHORD_DATA: Record<string, ExtendedChordDefinition> = {
  G: {
    name: 'G',
    displayName: 'G Major',
    frets: [3, 2, 0, 0, 0, 3],
    frequencies: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0],
    fingering: ['3', '2', '0', '0', '0', '4'],
    category: 'Major',
    baseString: 0,
  },
  C: {
    name: 'C',
    displayName: 'C Major',
    frets: [-1, 3, 2, 0, 1, 0],
    frequencies: [0, 130.81, 164.81, 196.0, 261.63, 329.63],
    fingering: ['X', '3', '2', '0', '1', '0'],
    category: 'Major',
    baseString: 1,
  },
  D: {
    name: 'D',
    displayName: 'D Major',
    frets: [-1, -1, 0, 2, 3, 2],
    frequencies: [0, 0, 146.83, 220.0, 293.66, 369.99],
    fingering: ['X', 'X', '0', '1', '3', '2'],
    category: 'Major',
    baseString: 2,
  },
  Em: {
    name: 'Em',
    displayName: 'E Minor',
    frets: [0, 2, 2, 0, 0, 0],
    frequencies: [82.41, 123.47, 164.81, 196.0, 246.94, 329.63],
    fingering: ['0', '2', '3', '0', '0', '0'],
    category: 'Minor',
    baseString: 0,
  },
  Am: {
    name: 'Am',
    displayName: 'A Minor',
    frets: [-1, 0, 2, 2, 1, 0],
    frequencies: [0, 110.0, 164.81, 220.0, 261.63, 329.63],
    fingering: ['X', '0', '2', '3', '1', '0'],
    category: 'Minor',
    baseString: 1,
  },
  E: {
    name: 'E',
    displayName: 'E Major',
    frets: [0, 2, 2, 1, 0, 0],
    frequencies: [82.41, 123.47, 164.81, 207.65, 246.94, 329.63],
    fingering: ['0', '2', '3', '1', '0', '0'],
    category: 'Major',
    baseString: 0,
  },
  A: {
    name: 'A',
    displayName: 'A Major',
    frets: [-1, 0, 2, 2, 2, 0],
    frequencies: [0, 110.0, 164.81, 220.0, 277.18, 329.63],
    fingering: ['X', '0', '1', '2', '3', '0'],
    category: 'Major',
    baseString: 1,
  },
  F: {
    name: 'F',
    displayName: 'F Major',
    frets: [1, 3, 3, 2, 1, 1],
    frequencies: [87.31, 130.81, 174.61, 220.0, 261.63, 349.23],
    fingering: ['1', '3', '4', '2', '1', '1'],
    category: 'Major',
    baseString: 0,
  },
  Dm: {
    name: 'Dm',
    displayName: 'D Minor',
    frets: [-1, -1, 0, 2, 3, 1],
    frequencies: [0, 0, 146.83, 220.0, 293.66, 349.23],
    fingering: ['X', 'X', '0', '2', '3', '1'],
    category: 'Minor',
    baseString: 2,
  },
};

export const COMMON_PROGRESSIONS = [
  { name: 'Pop Progression (I - V - vi - IV)', chords: ['G', 'D', 'Em', 'C'] },
  { name: 'Folk / Campfire (I - IV - V - I)', chords: ['G', 'C', 'D', 'G'] },
  { name: 'Acoustic Soul (vi - IV - I - V)', chords: ['Em', 'C', 'G', 'D'] },
  { name: 'Classic Doo-Wop (I - vi - IV - V)', chords: ['C', 'Am', 'F', 'G'] },
  { name: 'Simple 2-Chord Loop (I - IV)', chords: ['G', 'C', 'G', 'C'] },
];
