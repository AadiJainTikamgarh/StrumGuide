import { CHORD_DATA, COMMON_PROGRESSIONS as DATA_PROGRESSIONS, ExtendedChordDefinition } from '@/data/chords';
import { ChordDefinition } from '@/types/strum';

export const CHORD_LIBRARY: Record<string, ChordDefinition> = CHORD_DATA;
export const COMMON_PROGRESSIONS = DATA_PROGRESSIONS;
export type { ExtendedChordDefinition };
