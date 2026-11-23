import { ChordDefinition } from '@/types/strum';
import { AudioEngine } from './AudioEngine';
import { CHORD_DATA, ExtendedChordDefinition } from '@/data/chords';
import { GuitarSampler } from './GuitarSampler';
import { AudioContextManager } from './AudioContextManager';

// Direct fallback sampler node cache per AudioNode destination
const directSamplerCache = new WeakMap<AudioNode, GuitarSampler>();

function getOrCreateDirectSampler(ctx: AudioContext, destination: AudioNode): GuitarSampler {
  let sampler = directSamplerCache.get(destination);
  if (!sampler) {
    const gainNode = ctx.createGain();
    gainNode.connect(destination);
    sampler = new GuitarSampler(gainNode);
    directSamplerCache.set(destination, sampler);
  }
  return sampler;
}

/**
 * Play authentic percussive acoustic guitar mute / chuck sound.
 */
export function playGuitarMute(
  ctx: AudioContext,
  time: number,
  volume: number,
  destination: AudioNode
): void {
  try {
    const sampler = getOrCreateDirectSampler(ctx, destination);
    sampler.playMutePercussion(time, volume);
  } catch (err) {
    console.warn('[guitarSynth] playGuitarMute fallback:', err);
  }
}

/**
 * Play authentic steel string acoustic guitar chord with directional sweep.
 */
export function playGuitarStrum(
  ctx: AudioContext,
  chord: ChordDefinition,
  direction: 'down' | 'up',
  time: number,
  volume: number,
  destination: AudioNode
): void {
  try {
    const sampler = getOrCreateDirectSampler(ctx, destination);
    const extChord: ExtendedChordDefinition =
      CHORD_DATA[chord.name] || {
        ...chord,
        baseString: chord.frets.findIndex((f) => f >= 0),
      };
    sampler.playChordStrum(extChord, direction, time, volume);
  } catch (err) {
    console.warn('[guitarSynth] playGuitarStrum fallback:', err);
  }
}
