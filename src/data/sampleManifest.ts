/**
 * StrumGuide — Guitar Sample Manifest
 * Source: Meta Open Sound — Steel Guitar (CC0 1.0 Universal)
 * https://github.com/facebookincubator/Meta-open-sound
 */

export type GuitarStringName = 'LowE' | 'A' | 'D' | 'G' | 'B' | 'HighE';
export type GuitarVelocityLayer = 'Vel01' | 'Vel02' | 'Vel03';

export interface GuitarSampleEntry {
  stringName: GuitarStringName;
  stringIndex: number; // 0 = LowE, 1 = A, 2 = D, 3 = G, 4 = B, 5 = HighE
  fret: number;
  note: string;
  velocityLayer: GuitarVelocityLayer;
  path: string;
}

export const GUITAR_STRING_NAMES: GuitarStringName[] = [
  'LowE',
  'A',
  'D',
  'G',
  'B',
  'HighE',
];

export const STRING_TUNING_NOTES: Record<GuitarStringName, { openNote: string; baseFreq: number }> = {
  LowE: { openNote: 'E2', baseFreq: 82.41 },
  A: { openNote: 'A2', baseFreq: 110.0 },
  D: { openNote: 'D3', baseFreq: 146.83 },
  G: { openNote: 'G3', baseFreq: 196.0 },
  B: { openNote: 'B3', baseFreq: 246.94 },
  HighE: { openNote: 'E4', baseFreq: 329.63 },
};

// Map of frets 0-4 to note names per string
export const FRET_NOTE_MAP: Record<GuitarStringName, Record<number, string>> = {
  LowE: { 0: 'E2', 1: 'F2', 2: 'Fs2', 3: 'G2', 4: 'Gs2' },
  A: { 0: 'A2', 1: 'As2', 2: 'B2', 3: 'C3', 4: 'Cs3' },
  D: { 0: 'D3', 1: 'Ds3', 2: 'E3', 3: 'F3', 4: 'Fs3' },
  G: { 0: 'G3', 1: 'Gs3', 2: 'A3', 3: 'As3', 4: 'B3' },
  B: { 0: 'B3', 1: 'C4', 2: 'Cs4', 3: 'D4', 4: 'Ds4' },
  HighE: { 0: 'E4', 1: 'F4', 2: 'Fs4', 3: 'G4', 4: 'Gs4' },
};

// Build all sample entries
export const GUITAR_SAMPLES: GuitarSampleEntry[] = [];

const VELOCITIES: GuitarVelocityLayer[] = ['Vel01', 'Vel02', 'Vel03'];

GUITAR_STRING_NAMES.forEach((strName, strIdx) => {
  const frets = FRET_NOTE_MAP[strName];
  for (const fretStr in frets) {
    const fret = Number(fretStr);
    const note = frets[fret];
    for (const vel of VELOCITIES) {
      const filename = `INSGuitarSteel_String${strName}_${vel}_${note}_01.ogg`;
      GUITAR_SAMPLES.push({
        stringName: strName,
        stringIndex: strIdx,
        fret,
        note,
        velocityLayer: vel,
        path: `/audio/guitar/meta-steel/${filename}`,
      });
    }
  }
});

// Fast lookup key: `${stringIndex}_${fret}_${velocity}`
const samplePathLookup = new Map<string, string>();
GUITAR_SAMPLES.forEach((sample) => {
  const key = `${sample.stringIndex}_${sample.fret}_${sample.velocityLayer}`;
  samplePathLookup.set(key, sample.path);
});

/**
 * Retrieve the sample path for a specific string, fret, and velocity layer.
 * Falls back to Vel02 if requested velocity layer is not available.
 */
export function getSamplePath(
  stringIndex: number,
  fret: number,
  velocity: GuitarVelocityLayer = 'Vel02'
): string | null {
  const exactKey = `${stringIndex}_${fret}_${velocity}`;
  const path = samplePathLookup.get(exactKey);
  if (path) return path;

  // Fallback to medium velocity Vel02
  const fallbackKey = `${stringIndex}_${fret}_Vel02`;
  return samplePathLookup.get(fallbackKey) || null;
}

/**
 * Get all sample paths to preload.
 */
export function getAllSamplePaths(): string[] {
  return GUITAR_SAMPLES.map((s) => s.path);
}
