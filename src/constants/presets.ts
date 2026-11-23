import { StrumPattern, StrumSlot } from '@/types/strum';

export function createEmptySlots(timeSignature: '4/4' | '3/4', subdivision: '8th' | '16th'): StrumSlot[] {
  const beats = timeSignature === '4/4' ? 4 : 3;
  const slotsPerBeat = subdivision === '8th' ? 2 : 4;
  const totalSlots = beats * slotsPerBeat;
  const slots: StrumSlot[] = [];

  const labels8th = ['1', '&', '2', '&', '3', '&', '4', '&'];
  const labels16th = [
    '1', 'e', '&', 'a',
    '2', 'e', '&', 'a',
    '3', 'e', '&', 'a',
    '4', 'e', '&', 'a',
  ];

  for (let i = 0; i < totalSlots; i++) {
    const beatNumber = Math.floor(i / slotsPerBeat) + 1;
    let label = '';
    let direction: 'down' | 'up' = 'down';

    if (subdivision === '8th') {
      const subIdx = i % 2;
      label = subIdx === 0 ? `${beatNumber}` : '&';
      direction = subIdx === 0 ? 'down' : 'up';
    } else {
      const subIdx = i % 4;
      const subLabels = ['1', 'e', '&', 'a'];
      label = subIdx === 0 ? `${beatNumber}` : subLabels[subIdx];
      // 16th-note natural pendulum motor: 1=down, e=up, &=down, a=up
      direction = subIdx % 2 === 0 ? 'down' : 'up';
    }

    slots.push({
      id: `slot-${i}`,
      action: 'REST',
      beatNumber,
      subdivisionLabel: label,
      direction,
      isAccented: i === 0,
    });
  }

  return slots;
}

export const PRESET_PATTERNS: StrumPattern[] = [
  {
    id: 'island-strum',
    name: 'The Island Strum',
    description: 'The most famous guitar strumming pattern (D _ D U _ U D U). Used in Riptide, Somewhere Over The Rainbow, and hundreds more.',
    timeSignature: '4/4',
    subdivision: '8th',
    category: 'Beginner',
    suggestedBpm: 92,
    slots: [
      { id: 'is-0', action: 'DOWN', beatNumber: 1, subdivisionLabel: '1', direction: 'down', isAccented: true },
      { id: 'is-1', action: 'REST', beatNumber: 1, subdivisionLabel: '&', direction: 'up' },
      { id: 'is-2', action: 'DOWN', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'is-3', action: 'UP', beatNumber: 2, subdivisionLabel: '&', direction: 'up' },
      { id: 'is-4', action: 'GHOST', beatNumber: 3, subdivisionLabel: '3', direction: 'down' }, // air strum down!
      { id: 'is-5', action: 'UP', beatNumber: 3, subdivisionLabel: '&', direction: 'up' },
      { id: 'is-6', action: 'DOWN', beatNumber: 4, subdivisionLabel: '4', direction: 'down' },
      { id: 'is-7', action: 'UP', beatNumber: 4, subdivisionLabel: '&', direction: 'up' },
    ],
  },
  {
    id: 'folk-country-strum',
    name: 'Folk / Country Strum',
    description: 'Steady alternating rhythm (D _ D U D _ D U) giving songs a driving acoustic train beat.',
    timeSignature: '4/4',
    subdivision: '8th',
    category: 'Folk',
    suggestedBpm: 105,
    slots: [
      { id: 'fc-0', action: 'DOWN', beatNumber: 1, subdivisionLabel: '1', direction: 'down', isAccented: true },
      { id: 'fc-1', action: 'REST', beatNumber: 1, subdivisionLabel: '&', direction: 'up' },
      { id: 'fc-2', action: 'DOWN', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'fc-3', action: 'UP', beatNumber: 2, subdivisionLabel: '&', direction: 'up' },
      { id: 'fc-4', action: 'DOWN', beatNumber: 3, subdivisionLabel: '3', direction: 'down' },
      { id: 'fc-5', action: 'REST', beatNumber: 3, subdivisionLabel: '&', direction: 'up' },
      { id: 'fc-6', action: 'DOWN', beatNumber: 4, subdivisionLabel: '4', direction: 'down' },
      { id: 'fc-7', action: 'UP', beatNumber: 4, subdivisionLabel: '&', direction: 'up' },
    ],
  },
  {
    id: 'pop-rock-percussive',
    name: 'Pop-Rock with Chuck/Mute',
    description: 'D _ X U _ U X U - Features percussive acoustic slap (X) on beats 2 and 4 acting as a snare drum.',
    timeSignature: '4/4',
    subdivision: '8th',
    category: 'Pop/Rock',
    suggestedBpm: 100,
    slots: [
      { id: 'pr-0', action: 'DOWN', beatNumber: 1, subdivisionLabel: '1', direction: 'down', isAccented: true },
      { id: 'pr-1', action: 'REST', beatNumber: 1, subdivisionLabel: '&', direction: 'up' },
      { id: 'pr-2', action: 'MUTE', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'pr-3', action: 'UP', beatNumber: 2, subdivisionLabel: '&', direction: 'up' },
      { id: 'pr-4', action: 'GHOST', beatNumber: 3, subdivisionLabel: '3', direction: 'down' },
      { id: 'pr-5', action: 'UP', beatNumber: 3, subdivisionLabel: '&', direction: 'up' },
      { id: 'pr-6', action: 'MUTE', beatNumber: 4, subdivisionLabel: '4', direction: 'down' },
      { id: 'pr-7', action: 'UP', beatNumber: 4, subdivisionLabel: '&', direction: 'up' },
    ],
  },
  {
    id: 'waltz-3-4',
    name: 'Classic 3/4 Waltz',
    description: 'Boom-Chic-Chic waltz rhythm (D _ D U D U) in 3/4 time for ballads and traditional tunes.',
    timeSignature: '3/4',
    subdivision: '8th',
    category: 'Folk',
    suggestedBpm: 120,
    slots: [
      { id: 'w-0', action: 'DOWN', beatNumber: 1, subdivisionLabel: '1', direction: 'down', isAccented: true },
      { id: 'w-1', action: 'REST', beatNumber: 1, subdivisionLabel: '&', direction: 'up' },
      { id: 'w-2', action: 'DOWN', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'w-3', action: 'UP', beatNumber: 2, subdivisionLabel: '&', direction: 'up' },
      { id: 'w-4', action: 'DOWN', beatNumber: 3, subdivisionLabel: '3', direction: 'down' },
      { id: 'w-5', action: 'UP', beatNumber: 3, subdivisionLabel: '&', direction: 'up' },
    ],
  },
  {
    id: 'funk-16th-groove',
    name: '16th-Note Funk & R&B Groove',
    description: 'Dynamic 16-step grid (1 e & a 2 e & a 3 e & a 4 e & a) with syncopated ghost strums and tight accents.',
    timeSignature: '4/4',
    subdivision: '16th',
    category: 'Funk/R&B',
    suggestedBpm: 84,
    slots: [
      { id: 'f-0', action: 'DOWN', beatNumber: 1, subdivisionLabel: '1', direction: 'down', isAccented: true },
      { id: 'f-1', action: 'GHOST', beatNumber: 1, subdivisionLabel: 'e', direction: 'up' },
      { id: 'f-2', action: 'DOWN', beatNumber: 1, subdivisionLabel: '&', direction: 'down' },
      { id: 'f-3', action: 'UP', beatNumber: 1, subdivisionLabel: 'a', direction: 'up' },
      { id: 'f-4', action: 'MUTE', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'f-5', action: 'UP', beatNumber: 2, subdivisionLabel: 'e', direction: 'up' },
      { id: 'f-6', action: 'GHOST', beatNumber: 2, subdivisionLabel: '&', direction: 'down' },
      { id: 'f-7', action: 'UP', beatNumber: 2, subdivisionLabel: 'a', direction: 'up' },
      { id: 'f-8', action: 'GHOST', beatNumber: 3, subdivisionLabel: '3', direction: 'down' },
      { id: 'f-9', action: 'UP', beatNumber: 3, subdivisionLabel: 'e', direction: 'up' },
      { id: 'f-10', action: 'DOWN', beatNumber: 3, subdivisionLabel: '&', direction: 'down' },
      { id: 'f-11', action: 'REST', beatNumber: 3, subdivisionLabel: 'a', direction: 'up' },
      { id: 'f-12', action: 'MUTE', beatNumber: 4, subdivisionLabel: '4', direction: 'down' },
      { id: 'f-13', action: 'REST', beatNumber: 4, subdivisionLabel: 'e', direction: 'up' },
      { id: 'f-14', action: 'DOWN', beatNumber: 4, subdivisionLabel: '&', direction: 'down' },
      { id: 'f-15', action: 'UP', beatNumber: 4, subdivisionLabel: 'a', direction: 'up' },
    ],
  },
  {
    id: 'reggae-offbeat',
    name: 'Reggae / Ska Skank',
    description: 'Emphasizes only the off-beats (&) with quick percussive upstrokes, keeping the main beats silent.',
    timeSignature: '4/4',
    subdivision: '8th',
    category: 'Beginner',
    suggestedBpm: 75,
    slots: [
      { id: 'r-0', action: 'GHOST', beatNumber: 1, subdivisionLabel: '1', direction: 'down' },
      { id: 'r-1', action: 'UP', beatNumber: 1, subdivisionLabel: '&', direction: 'up' },
      { id: 'r-2', action: 'GHOST', beatNumber: 2, subdivisionLabel: '2', direction: 'down' },
      { id: 'r-3', action: 'UP', beatNumber: 2, subdivisionLabel: '&', direction: 'up' },
      { id: 'r-4', action: 'GHOST', beatNumber: 3, subdivisionLabel: '3', direction: 'down' },
      { id: 'r-5', action: 'UP', beatNumber: 3, subdivisionLabel: '&', direction: 'up' },
      { id: 'r-6', action: 'GHOST', beatNumber: 4, subdivisionLabel: '4', direction: 'down' },
      { id: 'r-7', action: 'UP', beatNumber: 4, subdivisionLabel: '&', direction: 'up' },
    ],
  },
];
