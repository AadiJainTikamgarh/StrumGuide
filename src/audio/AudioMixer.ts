/**
 * StrumGuide — AudioMixer
 * Manages gain staging, guitar body resonance EQ, metronome routing, and master volume.
 */

import { AudioContextManager } from './AudioContextManager';
import { AudioSettings } from '@/types/strum';

export class AudioMixer {
  private masterGain: GainNode;
  private guitarGain: GainNode;
  private metronomeGain: GainNode;
  private guitarInput: GainNode;
  private metronomeInput: GainNode;
  private bodyResonanceChain: {
    helmholtz: BiquadFilterNode;
    soundboard: BiquadFilterNode;
    presence: BiquadFilterNode;
    warmth: BiquadFilterNode;
  } | null = null;

  private currentSettings: AudioSettings = {
    masterVolume: 0.85,
    guitarVolume: 0.8,
    isGuitarMuted: false,
    metronomeVolume: 0.6,
    isMetronomeMuted: false,
    countInEnabled: true,
  };

  constructor() {
    const ctx = AudioContextManager.getInstance().getContext();

    // 1. Master Output
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentSettings.masterVolume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // 2. Metronome Path
    this.metronomeGain = ctx.createGain();
    this.metronomeInput = ctx.createGain();
    this.metronomeInput.connect(this.metronomeGain);
    this.metronomeGain.connect(this.masterGain);

    // 3. Guitar Path with Acoustic Body Resonance Filtering
    this.guitarGain = ctx.createGain();
    this.guitarInput = ctx.createGain();

    // Dreadnought acoustic body filter bank
    const helmholtz = ctx.createBiquadFilter();
    helmholtz.type = 'peaking';
    helmholtz.frequency.setValueAtTime(108, ctx.currentTime);
    helmholtz.Q.setValueAtTime(2.2, ctx.currentTime);
    helmholtz.gain.setValueAtTime(3.5, ctx.currentTime); // gentle warm low-end air

    const soundboard = ctx.createBiquadFilter();
    soundboard.type = 'peaking';
    soundboard.frequency.setValueAtTime(220, ctx.currentTime);
    soundboard.Q.setValueAtTime(1.8, ctx.currentTime);
    soundboard.gain.setValueAtTime(2.0, ctx.currentTime); // spruce top warmth

    const presence = ctx.createBiquadFilter();
    presence.type = 'peaking';
    presence.frequency.setValueAtTime(2800, ctx.currentTime);
    presence.Q.setValueAtTime(1.2, ctx.currentTime);
    presence.gain.setValueAtTime(1.5, ctx.currentTime); // acoustic string pick bite

    const warmth = ctx.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.setValueAtTime(8000, ctx.currentTime); // smooth analog top roll-off

    // Chain: guitarInput -> helmholtz -> soundboard -> presence -> warmth -> guitarGain -> masterGain
    this.guitarInput.connect(helmholtz);
    helmholtz.connect(soundboard);
    soundboard.connect(presence);
    presence.connect(warmth);
    warmth.connect(this.guitarGain);
    this.guitarGain.connect(this.masterGain);

    this.bodyResonanceChain = { helmholtz, soundboard, presence, warmth };

    this.applyGains();
  }

  public getGuitarInputNode(): GainNode {
    return this.guitarInput;
  }

  public getMetronomeInputNode(): GainNode {
    return this.metronomeInput;
  }

  /**
   * Smoothly apply volume and mute settings with micro-ramps to avoid audio clicks.
   */
  public updateSettings(settings: AudioSettings): void {
    this.currentSettings = { ...settings };
    this.applyGains();
  }

  public getSettings(): AudioSettings {
    return { ...this.currentSettings };
  }

  private applyGains(): void {
    const ctx = AudioContextManager.getInstance().getContext();
    const now = ctx.currentTime;
    const rampTime = 0.02; // 20ms anti-pop ramp

    // Master
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(this.currentSettings.masterVolume, now + rampTime);

    // Guitar
    const targetGuitarGain = this.currentSettings.isGuitarMuted
      ? 0
      : this.currentSettings.guitarVolume;
    this.guitarGain.gain.cancelScheduledValues(now);
    this.guitarGain.gain.linearRampToValueAtTime(targetGuitarGain, now + rampTime);

    // Metronome
    const targetMetronomeGain = this.currentSettings.isMetronomeMuted
      ? 0
      : this.currentSettings.metronomeVolume;
    this.metronomeGain.gain.cancelScheduledValues(now);
    this.metronomeGain.gain.linearRampToValueAtTime(targetMetronomeGain, now + rampTime);
  }
}
