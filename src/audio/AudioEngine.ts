/**
 * StrumGuide — AudioEngine
 * Unified high-level audio system coordinator integrating Web Audio API,
 * Meta Open Sound steel guitar samples, directional strum scheduling, and mixer controls.
 */

import { AudioContextManager } from './AudioContextManager';
import { SampleLoader } from './SampleLoader';
import { GuitarSampler } from './GuitarSampler';
import { Metronome } from './Metronome';
import { AudioMixer } from './AudioMixer';
import { StrumScheduler } from './StrumScheduler';
import { CHORD_DATA, ExtendedChordDefinition } from '@/data/chords';
import {
  AudioEngineStatus,
  TickCallback,
  StateChangeCallback,
  LoadingProgressCallback,
  BpmChangeCallback,
  AudioEngineOptions,
} from './types';
import { StrumPattern, AudioSettings, SpeedTrainerConfig } from '@/types/strum';

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private status: AudioEngineStatus = 'uninitialized';
  private contextManager: AudioContextManager;
  private sampleLoader: SampleLoader;
  private mixer: AudioMixer | null = null;
  private guitarSampler: GuitarSampler | null = null;
  private metronome: Metronome | null = null;
  private scheduler: StrumScheduler | null = null;

  private onTickListeners: Set<TickCallback> = new Set();
  private onStatusListeners: Set<StateChangeCallback> = new Set();
  private onProgressListeners: Set<LoadingProgressCallback> = new Set();
  private onBpmListeners: Set<BpmChangeCallback> = new Set();

  private options: AudioEngineOptions;

  private constructor(options: AudioEngineOptions) {
    this.options = options;
    this.contextManager = AudioContextManager.getInstance();
    this.sampleLoader = SampleLoader.getInstance();
  }

  public static getInstance(initialOptions?: AudioEngineOptions): AudioEngine {
    if (!AudioEngine.instance) {
      if (!initialOptions) {
        throw new Error('AudioEngine must be initialized with options on first call');
      }
      AudioEngine.instance = new AudioEngine(initialOptions);
    }
    return AudioEngine.instance;
  }

  private setStatus(newStatus: AudioEngineStatus) {
    this.status = newStatus;
    this.onStatusListeners.forEach((cb) => cb(newStatus));
  }

  public getStatus(): AudioEngineStatus {
    return this.status;
  }

  /**
   * Lazily instantiate audio nodes upon first user gesture.
   */
  private ensureAudioNodes(): void {
    if (!this.mixer) {
      this.mixer = new AudioMixer();
      this.mixer.updateSettings(this.options.audioSettings);

      this.guitarSampler = new GuitarSampler(this.mixer.getGuitarInputNode());
      this.metronome = new Metronome(this.mixer.getMetronomeInputNode());

      this.scheduler = new StrumScheduler(
        this.guitarSampler,
        this.metronome,
        this.mixer,
        this.options.pattern,
        this.options.chordProgression,
        this.options.speedTrainer,
        this.options.bpm
      );

      this.scheduler.onTick((event) => {
        this.onTickListeners.forEach((cb) => cb(event));
      });

      this.scheduler.onBpmChange((newBpm) => {
        this.options.bpm = newBpm;
        this.onBpmListeners.forEach((cb) => cb(newBpm));
      });
    }
  }

  /**
   * Preload sample assets in the background.
   */
  public async preload(): Promise<void> {
    if (this.sampleLoader.isFullyLoaded()) {
      this.setStatus('ready');
      return;
    }

    this.setStatus('loading');
    try {
      await this.sampleLoader.preloadAll((loaded, total, percent) => {
        this.onProgressListeners.forEach((cb) => cb(loaded, total, percent));
      });
      this.setStatus('ready');
    } catch (err) {
      console.error('[AudioEngine] Sample preload failed:', err);
      this.setStatus('error');
    }
  }

  /**
   * Start pattern playback.
   */
  public async play(): Promise<void> {
    await this.contextManager.ensureRunning();
    this.ensureAudioNodes();

    if (!this.sampleLoader.isFullyLoaded()) {
      // Trigger preload in background if not already complete
      this.preload();
    }

    if (this.scheduler) {
      this.scheduler.start(this.options.audioSettings.countInEnabled);
      this.setStatus('playing');
    }
  }

  /**
   * Stop pattern playback and choke ringing strings.
   */
  public stop(): void {
    if (this.scheduler) {
      this.scheduler.stop();
    }
    this.setStatus('stopped');
  }

  /**
   * Restart pattern from beat 1.
   */
  public async restart(): Promise<void> {
    await this.contextManager.ensureRunning();
    this.ensureAudioNodes();
    if (this.scheduler) {
      this.scheduler.restart();
      this.setStatus('playing');
    }
  }

  /**
   * Audition an authentic acoustic chord strum on user interaction.
   */
  public async previewChord(chordName: string, direction: 'down' | 'up' = 'down'): Promise<void> {
    await this.contextManager.ensureRunning();
    this.ensureAudioNodes();

    const chordDef: ExtendedChordDefinition =
      CHORD_DATA[chordName] || CHORD_DATA.G;

    if (this.guitarSampler && this.mixer) {
      const ctx = this.contextManager.getContext();
      const settings = this.mixer.getSettings();
      const vol = settings.isGuitarMuted ? 0 : settings.guitarVolume;
      this.guitarSampler.playChordStrum(chordDef, direction, ctx.currentTime, vol);
    }
  }

  /**
   * Pluck a single guitar string (e.g. fretboard inspection).
   */
  public async previewString(stringIndex: number, fret: number): Promise<void> {
    await this.contextManager.ensureRunning();
    this.ensureAudioNodes();

    if (this.guitarSampler && this.mixer) {
      const ctx = this.contextManager.getContext();
      const settings = this.mixer.getSettings();
      const vol = settings.isGuitarMuted ? 0 : settings.guitarVolume;
      this.guitarSampler.playStringNote(stringIndex, fret, ctx.currentTime, 85, vol);
    }
  }

  // Parameter Setters
  public setBpm(bpm: number): void {
    this.options.bpm = bpm;
    if (this.scheduler) {
      this.scheduler.setBpm(bpm);
    }
  }

  public setPattern(pattern: StrumPattern): void {
    this.options.pattern = pattern;
    if (this.scheduler) {
      this.scheduler.setPattern(pattern);
    }
  }

  public setChordProgression(chords: string[]): void {
    this.options.chordProgression = chords;
    if (this.scheduler) {
      this.scheduler.setChordProgression(chords);
    }
  }

  public setAudioSettings(settings: AudioSettings): void {
    this.options.audioSettings = settings;
    if (this.mixer) {
      this.mixer.updateSettings(settings);
    }
  }

  public setSpeedTrainer(config: SpeedTrainerConfig): void {
    this.options.speedTrainer = config;
    if (this.scheduler) {
      this.scheduler.setSpeedTrainer(config);
    }
  }

  public setCountInBeats(beats: 3 | 4): void {
    if (this.scheduler) {
      this.scheduler.setCountInBeats(beats);
    }
  }

  // Listener subscriptions
  public onTick(callback: TickCallback): () => void {
    this.onTickListeners.add(callback);
    return () => this.onTickListeners.delete(callback);
  }

  public onStatusChange(callback: StateChangeCallback): () => void {
    this.onStatusListeners.add(callback);
    // Initial callback
    callback(this.status);
    return () => this.onStatusListeners.delete(callback);
  }

  public onProgress(callback: LoadingProgressCallback): () => void {
    this.onProgressListeners.add(callback);
    return () => this.onProgressListeners.delete(callback);
  }

  public onBpmChange(callback: BpmChangeCallback): () => void {
    this.onBpmListeners.add(callback);
    return () => this.onBpmListeners.delete(callback);
  }
}
