import { ChordDefinition, StrumPattern, AudioSettings, SpeedTrainerConfig } from '@/types/strum';
import { CHORD_DATA, ExtendedChordDefinition } from '@/data/chords';
import { AudioContextManager } from './AudioContextManager';
import { GuitarSampler } from './GuitarSampler';
import { Metronome } from './Metronome';
import { AudioMixer } from './AudioMixer';
import { TickEvent, TickCallback, BpmChangeCallback } from './types';

export type { TickEvent, TickCallback, BpmChangeCallback };

export class StrumScheduler {
  private isRunning = false;
  private timerId: number | null = null;
  private nextSlotTime = 0;
  private currentSlotIndex = 0;
  private currentBarIndex = 0;
  private currentBpm = 90;
  private isCountIn = false;
  private countInBeat = 1;
  private countInBeatsTotal: 3 | 4 = 4;
  private totalLoopsCompleted = 0;

  private pattern: StrumPattern;
  private chordProgression: string[] = ['G'];
  private audioSettings: AudioSettings;
  private speedTrainer: SpeedTrainerConfig;
  private onTickCallback: TickCallback | null = null;
  private onBpmChangeCallback: BpmChangeCallback | null = null;

  private mixer: AudioMixer | null = null;
  private guitarSampler: GuitarSampler | null = null;
  private metronome: Metronome | null = null;

  constructor(
    pattern: StrumPattern,
    chordProgression: string[],
    audioSettings: AudioSettings,
    speedTrainer: SpeedTrainerConfig,
    initialBpm: number
  ) {
    this.pattern = pattern;
    this.chordProgression = chordProgression.length > 0 ? chordProgression : ['G'];
    this.audioSettings = audioSettings;
    this.speedTrainer = speedTrainer;
    this.currentBpm = initialBpm;
    this.countInBeatsTotal = pattern.timeSignature === '3/4' ? 3 : 4;
  }

  public setPattern(pattern: StrumPattern) {
    this.pattern = pattern;
    this.countInBeatsTotal = pattern.timeSignature === '3/4' ? 3 : 4;
    if (this.currentSlotIndex >= pattern.slots.length) {
      this.currentSlotIndex = 0;
    }
  }

  public setChordProgression(chords: string[]) {
    this.chordProgression = chords.length > 0 ? chords : ['G'];
  }

  public setAudioSettings(settings: AudioSettings) {
    this.audioSettings = settings;
    if (this.mixer) {
      this.mixer.updateSettings(settings);
    }
  }

  public setSpeedTrainer(config: SpeedTrainerConfig) {
    this.speedTrainer = config;
  }

  public setBpm(bpm: number) {
    this.currentBpm = Math.min(240, Math.max(40, bpm));
  }

  public getBpm(): number {
    return this.currentBpm;
  }

  public setCountInBeats(beats: 3 | 4) {
    this.countInBeatsTotal = beats;
  }

  public onTick(cb: TickCallback) {
    this.onTickCallback = cb;
  }

  public onBpmChange(cb: BpmChangeCallback) {
    this.onBpmChangeCallback = cb;
  }

  private initAudio() {
    if (!this.mixer) {
      this.mixer = new AudioMixer();
      this.mixer.updateSettings(this.audioSettings);
      this.guitarSampler = new GuitarSampler(this.mixer.getGuitarInputNode());
      this.metronome = new Metronome(this.mixer.getMetronomeInputNode());
    } else {
      this.mixer.updateSettings(this.audioSettings);
    }
  }

  public async start() {
    if (this.isRunning) return;

    await AudioContextManager.getInstance().ensureRunning();
    this.initAudio();

    this.isRunning = true;
    this.currentSlotIndex = 0;
    this.currentBarIndex = 0;
    this.totalLoopsCompleted = 0;

    if (this.speedTrainer.enabled) {
      this.currentBpm = this.speedTrainer.startBpm;
      if (this.onBpmChangeCallback) {
        this.onBpmChangeCallback(this.currentBpm);
      }
    }

    const ctx = AudioContextManager.getInstance().getContext();
    this.nextSlotTime = ctx.currentTime + 0.05;

    if (this.audioSettings.countInEnabled) {
      this.isCountIn = true;
      this.countInBeat = 1;
    } else {
      this.isCountIn = false;
    }

    this.runSchedulerLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isCountIn = false;

    if (this.guitarSampler) {
      const ctx = AudioContextManager.getInstance().getContext();
      this.guitarSampler.chokeAllStrings(ctx.currentTime);
    }
  }

  private runSchedulerLoop() {
    const lookAheadIntervalMs = 25;
    const scheduleAheadSec = 0.12;

    this.timerId = window.setInterval(() => {
      if (!this.isRunning) return;
      const ctx = AudioContextManager.getInstance().getContext();

      while (this.nextSlotTime < ctx.currentTime + scheduleAheadSec) {
        if (this.isCountIn) {
          this.scheduleCountInBeat(ctx, this.nextSlotTime);
        } else {
          this.schedulePatternSlot(ctx, this.nextSlotTime);
        }
      }
    }, lookAheadIntervalMs);
  }

  private scheduleCountInBeat(ctx: AudioContext, time: number) {
    const quarterBeatSec = 60 / this.currentBpm;
    const isFirst = this.countInBeat === 1;

    // Metronome click on count-in
    if (!this.audioSettings.isMetronomeMuted && this.metronome) {
      this.metronome.scheduleClick(
        time,
        isFirst,
        this.audioSettings.metronomeVolume
      );
    }

    const currentBeat = this.countInBeat;
    const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);

    setTimeout(() => {
      if (!this.isRunning || !this.isCountIn) return;
      if (this.onTickCallback) {
        this.onTickCallback({
          slotIndex: -1,
          barIndex: 0,
          beatNumber: currentBeat,
          subdivisionLabel: `${currentBeat}`,
          direction: 'down',
          chordName: this.chordProgression[0] || 'G',
          currentBpm: this.currentBpm,
          isCountIn: true,
          countInBeat: currentBeat,
          audioTime: time,
        });
      }
    }, delayMs);

    this.nextSlotTime += quarterBeatSec;
    this.countInBeat++;

    if (this.countInBeat > this.countInBeatsTotal) {
      this.isCountIn = false;
      this.currentSlotIndex = 0;
      this.currentBarIndex = 0;
    }
  }

  private schedulePatternSlot(ctx: AudioContext, time: number) {
    const slots = this.pattern.slots;
    if (slots.length === 0) return;

    const slot = slots[this.currentSlotIndex];
    const quarterBeatSec = 60 / this.currentBpm;
    const slotsPerQuarter = this.pattern.subdivision === '8th' ? 2 : 4;
    const slotDurationSec = quarterBeatSec / (slotsPerQuarter === 2 ? 2 : 4);
    const beatsPerBar = this.pattern.timeSignature === '4/4' ? 4 : 3;
    const slotsPerBar = slotsPerQuarter * beatsPerBar;

    // Multi-bar chord mapping
    const barInPattern = Math.floor(this.currentSlotIndex / slotsPerBar);
    const patternBars = Math.max(1, Math.floor(slots.length / slotsPerBar));
    const globalBarNumber = this.currentBarIndex * patternBars + barInPattern;
    const chordIndex = globalBarNumber % this.chordProgression.length;
    const currentChordName = this.chordProgression[chordIndex] || 'G';
    const chordDef: ExtendedChordDefinition =
      CHORD_DATA[currentChordName] || CHORD_DATA.G;

    // 1. Metronome scheduling
    const isMainBeat =
      this.pattern.subdivision === '8th'
        ? this.currentSlotIndex % 2 === 0
        : this.currentSlotIndex % 4 === 0;

    if (isMainBeat && !this.audioSettings.isMetronomeMuted && this.metronome) {
      const isBarDownbeat = this.currentSlotIndex % slotsPerBar === 0;
      this.metronome.scheduleClick(
        time,
        isBarDownbeat,
        this.audioSettings.metronomeVolume
      );
    }

    // 2. High-Fidelity Acoustic Guitar Playback using Meta Open Sound samples
    if (!this.audioSettings.isGuitarMuted && this.guitarSampler) {
      const vol = this.audioSettings.guitarVolume;
      switch (slot.action) {
        case 'DOWN':
          this.guitarSampler.playChordStrum(chordDef, 'down', time, vol);
          break;
        case 'UP':
          this.guitarSampler.playChordStrum(chordDef, 'up', time, vol);
          break;
        case 'GHOST':
          this.guitarSampler.playChordStrum(chordDef, slot.direction, time, vol, true);
          break;
        case 'MUTE':
          this.guitarSampler.playMutePercussion(time, vol);
          break;
        case 'REST':
          break;
      }
    }

    // 3. UI tick dispatch
    const capturedSlotIdx = this.currentSlotIndex;
    const capturedBarIdx = globalBarNumber;
    const capturedBpm = this.currentBpm;
    const delayMs = Math.max(0, (time - ctx.currentTime) * 1000);

    setTimeout(() => {
      if (!this.isRunning || this.isCountIn) return;
      if (this.onTickCallback) {
        this.onTickCallback({
          slotIndex: capturedSlotIdx,
          barIndex: capturedBarIdx,
          beatNumber: slot.beatNumber,
          subdivisionLabel: slot.subdivisionLabel,
          direction: slot.direction,
          chordName: currentChordName,
          currentBpm: capturedBpm,
          isCountIn: false,
          countInBeat: 0,
          audioTime: time,
        });
      }
    }, delayMs);

    // Advance time and slot
    this.nextSlotTime += slotDurationSec;
    this.currentSlotIndex++;

    if (this.currentSlotIndex >= slots.length) {
      this.currentSlotIndex = 0;
      this.currentBarIndex++;
      this.totalLoopsCompleted++;

      // Speed trainer
      if (this.speedTrainer.enabled) {
        if (this.totalLoopsCompleted % this.speedTrainer.incrementEveryBars === 0) {
          if (this.currentBpm < this.speedTrainer.targetBpm) {
            this.currentBpm = Math.min(
              this.speedTrainer.targetBpm,
              this.currentBpm + this.speedTrainer.incrementBpm
            );
            if (this.onBpmChangeCallback) {
              this.onBpmChangeCallback(this.currentBpm);
            }
          }
        }
      }
    }
  }
}
