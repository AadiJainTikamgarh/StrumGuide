/**
 * StrumGuide — Metronome
 * High-precision Web Audio metronome click generator with distinctive downbeat and regular beat voicing.
 */

import { AudioContextManager } from './AudioContextManager';

export class Metronome {
  private outputNode: GainNode;

  constructor(outputNode: GainNode) {
    this.outputNode = outputNode;
  }

  /**
   * Schedule an analog woodblock click sound at a specific audio timeline time.
   */
  public scheduleClick(time: number, isDownbeat: boolean, volume: number): void {
    if (volume <= 0.001) return;

    const ctx = AudioContextManager.getInstance().getContext();

    // Downbeat uses higher pitch and slightly longer resonance
    const freq = isDownbeat ? 1400 : 920;
    const clickGain = isDownbeat ? volume * 0.95 : volume * 0.65;
    const duration = isDownbeat ? 0.042 : 0.032;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    // Pitch sweep creates an organic tactile wood impact
    osc.frequency.exponentialRampToValueAtTime(freq * 0.35, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(clickGain, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.outputNode);

    osc.start(time);
    osc.stop(time + duration + 0.005);
  }
}
