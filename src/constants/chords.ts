import { CHORD_DATA, COMMON_PROGRESSIONS as DATA_PROGRESSIONS, ExtendedChordDefinition, ALL_CHORDS_LIST, CHORD_CATEGORIES } from '@/data/chords';
import { ChordDefinition } from '@/types/strum';

export const CHORD_LIBRARY: Record<string, ChordDefinition> = CHORD_DATA;
export const COMMON_PROGRESSIONS = DATA_PROGRESSIONS;
export const ALL_CHORDS = ALL_CHORDS_LIST;
export { ALL_CHORDS_LIST, CHORD_CATEGORIES };
export type { ExtendedChordDefinition };
