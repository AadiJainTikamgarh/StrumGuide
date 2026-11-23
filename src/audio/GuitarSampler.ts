/**
 * StrumGuide — GuitarSampler
 * Manages 6-string polyphonic playback with physical string choke groups,
 * authentic velocity layers (Vel01, Vel02, Vel03) from Meta Steel Guitar,
 * directional strumming dynamics, and percussive string muting.
 */

import { AudioContextManager } from './AudioContextManager';
import { SampleLoader } from './SampleLoader';
import { getSamplePath, GuitarVelocityLayer, FRET_NOTE_MAP } from '@/data/sampleManifest';
import { ExtendedChordDefinition } from '@/data/chords';

interface ActiveStringVoice {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
  startTime: number;
}

export class GuitarSampler {
  private outputNode: GainNode;
  private sampleLoader: SampleLoader;
  // 6 string voices (index 0 = LowE, 1 = A, 2 = D, 3 = G, 4 = B, 5 = HighE)
  private activeVoices: Map<number, ActiveStringVoice> = new Map();

  constructor(outputNode: GainNode) {
    this.outputNode = outputNode;
    this.sampleLoader = SampleLoader.getInstance();
  }

  /**
   * Determine the velocity layer based on dynamic MIDI-equivalent velocity (1 - 127).
   */
  public getVelocityLayer(velocity: number): GuitarVelocityLayer {
    if (velocity <= 48) return 'Vel01';
    if (velocity <= 96) return 'Vel02';
    return 'Vel03';
  }

  /**
   * Choke a specific string's currently ringing note (with a smooth 30ms anti-pop ramp).
   */
  public chokeString(stringIndex: number, time: number): void {
    const active = this.activeVoices.get(stringIndex);
    if (active) {
      const { source, gainNode } = active;
      try {
        const chokeTime = Math.max(time, gainNode.context.currentTime);
        gainNode.gain.cancelScheduledValues(chokeTime);
        gainNode.gain.setValueAtTime(gainNode.gain.value, chokeTime);
        gainNode.gain.linearRampToValueAtTime(0.0001, chokeTime + 0.03);
        source.stop(chokeTime + 0.035);
      } catch {
        // Node may have already ended
      }
      this.activeVoices.delete(stringIndex);
    }
  }

  /**
   * Choke all 6 strings simultaneously (for Mute or Stop).
   */
  public chokeAllStrings(time: number): void {
    for (let strIdx = 0; strIdx < 6; strIdx++) {
      this.chokeString(strIdx, time);
    }
  }

  /**
   * Play an individual note on a string at a scheduled audio timeline timestamp.
   */
  public playStringNote(
    stringIndex: number,
    fret: number,
    time: number,
    velocity: number = 75,
    volumeScale: number = 1.0
  ): void {
    if (fret < 0 || volumeScale <= 0.001) return;

    const ctx = AudioContextManager.getInstance().getContext();
    const velLayer = this.getVelocityLayer(velocity);

    const samplePath = getSamplePath(stringIndex, fret, velLayer);
    if (!samplePath) return;

    const buffer = this.sampleLoader.getBuffer(samplePath);
    if (!buffer) {
      // If buffer is still loading asynchronously, attempt quick load
      this.sampleLoader.loadSample(samplePath).then((loaded) => {
        if (loaded && ctx.currentTime <= time + 0.05) {
          this.triggerNoteBuffer(stringIndex, loaded, Math.max(time, ctx.currentTime), velocity, volumeScale);
        }
      });
      return;
    }

    this.triggerNoteBuffer(stringIndex, buffer, time, velocity, volumeScale);
  }

  private triggerNoteBuffer(
    stringIndex: number,
    buffer: AudioBuffer,
    time: number,
    velocity: number,
    volumeScale: number
  ): void {
    const ctx = AudioContextManager.getInstance().getContext();

    // 1. Choke previous note on this string
    this.chokeString(stringIndex, time);

    // 2. Create voice nodes
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const voiceGain = ctx.createGain();

    // Natural dynamics: normalize velocity 1-127 to gain 0.3 - 1.0
    const velGain = (velocity / 127) * 0.8 + 0.2;
    const finalGain = Math.min(1.0, velGain * volumeScale);

    voiceGain.gain.setValueAtTime(finalGain, time);

    source.connect(voiceGain);
    voiceGain.connect(this.outputNode);

    source.start(time);

    // Record as active voice for this string choke group
    this.activeVoices.set(stringIndex, {
      source,
      gainNode: voiceGain,
      startTime: time,
    });

    // Cleanup voice reference when sample finishes naturally
    source.onended = () => {
      const current = this.activeVoices.get(stringIndex);
      if (current && current.source === source) {
        this.activeVoices.delete(stringIndex);
      }
    };
  }

  /**
   * Play an authentic percussive fret-hand slap / acoustic mute ("chuck").
   */
  public playMutePercussion(time: number, volume: number = 0.8): void {
    if (volume <= 0.001) return;

    // Choke any ringing strings
    this.chokeAllStrings(time);

    const ctx = AudioContextManager.getInstance().getContext();
    const duration = 0.045;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const channelData = noiseBuffer.getChannelData(0);

    // Pick slap noise burst with steep exponential decay
    for (let i = 0; i < bufferSize; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const slapFilter = ctx.createBiquadFilter();
    slapFilter.type = 'bandpass';
    slapFilter.frequency.setValueAtTime(1450, time);
    slapFilter.Q.setValueAtTime(2.2, time);

    const slapGain = ctx.createGain();
    slapGain.gain.setValueAtTime(volume * 0.75, time);
    slapGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    // Deep wood body knock
    const woodThump = ctx.createOscillator();
    const woodGain = ctx.createGain();
    woodThump.type = 'sine';
    woodThump.frequency.setValueAtTime(130, time);
    woodThump.frequency.exponentialRampToValueAtTime(40, time + duration);

    woodGain.gain.setValueAtTime(volume * 0.6, time);
    woodGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    noiseSource.connect(slapFilter);
    slapFilter.connect(slapGain);
    slapGain.connect(this.outputNode);

    woodThump.connect(woodGain);
    woodGain.connect(this.outputNode);

    noiseSource.start(time);
    woodThump.start(time);
    woodThump.stop(time + duration);
  }

  /**
   * Play a full chord with authentic directional strumming.
   *
   * Downstroke: plucks strings from lowest string to high E with 9-13ms delay per string.
   * Emphasizes lower and middle strings (deep, full sound).
   *
   * Upstroke: plucks strings from high E up towards lower strings with 8-11ms delay per string.
   * Emphasizes top strings (crisp, articulate pick brush).
   */
  public playChordStrum(
    chord: ExtendedChordDefinition,
    direction: 'down' | 'up',
    time: number,
    baseVolume: number = 0.8,
    isGhost: boolean = false
  ): void {
    if (baseVolume <= 0.001) return;

    // Collect active (non-muted) strings
    const activeStrings: { stringIndex: number; fret: number }[] = [];
    for (let strIdx = 0; strIdx < 6; strIdx++) {
      const fret = chord.frets[strIdx];
      if (fret >= 0) {
        activeStrings.push({ stringIndex: strIdx, fret });
      }
    }

    if (activeStrings.length === 0) return;

    const isDown = direction === 'down';
    // Downstrum: string 0 (or chord base) to 5. Upstrum: string 5 down to chord base.
    const ordered = isDown ? [...activeStrings] : [...activeStrings].reverse();

    // Strum delay per string (8ms to 13ms creates realistic human physical pick sweep)
    const stringDelaySec = isDown ? 0.011 : 0.009;

    ordered.forEach((str, i) => {
      const pluckTime = time + i * stringDelaySec;

      let velocity = isDown ? 82 : 72; // baseline velocity
      let strVolume = baseVolume;

      if (isGhost) {
        // Ghost notes are soft, muted strokes (~35 velocity)
        velocity = 32;
        strVolume *= 0.45;
      } else if (isDown) {
        // Downstroke: Bass strings ring stronger
        const bassBoost = (5 - str.stringIndex) * 0.04;
        velocity = Math.min(115, velocity + Math.round((5 - str.stringIndex) * 4));
        strVolume *= (0.85 + bassBoost);
      } else {
        // Upstroke: Treble strings ring stronger
        const trebleBoost = str.stringIndex * 0.04;
        velocity = Math.min(105, velocity + Math.round(str.stringIndex * 3));
        strVolume *= (0.75 + trebleBoost);
      }

      this.playStringNote(str.stringIndex, str.fret, pluckTime, velocity, Math.min(1.0, strVolume));
    });
  }
}
