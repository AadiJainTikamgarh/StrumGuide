/**
 * StrumGuide — AudioContextManager
 * Safely manages Web Audio API AudioContext lifecycle,
 * unlocking after explicit user interaction and handling suspension/interruption.
 */

export class AudioContextManager {
  private static instance: AudioContextManager | null = null;
  private context: AudioContext | null = null;
  private isUserUnlocked = false;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  /**
   * Returns whether user interaction has already unlocked the audio context.
   */
  public isUnlocked(): boolean {
    return this.isUserUnlocked && this.context !== null && this.context.state === 'running';
  }

  /**
   * Retrieves or creates the AudioContext. If called from a user gesture, resumes automatically.
   */
  public getContext(): AudioContext {
    if (typeof window === 'undefined') {
      throw new Error('AudioContext is only available in browser environments');
    }

    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      
      this.context = new AudioContextClass({
        latencyHint: 'interactive',
      });

      // Handle context interruptions (e.g. bluetooth disconnect, OS sleep)
      this.context.onstatechange = () => {
        if (this.context?.state === 'running') {
          this.isUserUnlocked = true;
        }
      };
    }

    if (this.context.state === 'suspended') {
      this.context.resume().then(() => {
        this.isUserUnlocked = true;
      }).catch((err) => {
        console.warn('AudioContext resume deferred until next gesture:', err);
      });
    }

    return this.context;
  }

  /**
   * Explicitly resume context upon user interaction (e.g. click play or preview).
   */
  public async ensureRunning(): Promise<AudioContext> {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    this.isUserUnlocked = true;
    return ctx;
  }

  /**
   * Current AudioContext state.
   */
  public getState(): AudioContextState | 'uninitialized' {
    return this.context ? this.context.state : 'uninitialized';
  }

  /**
   * Closes the context when destroying the engine.
   */
  public async close(): Promise<void> {
    if (this.context && this.context.state !== 'closed') {
      await this.context.close();
      this.context = null;
      this.isUserUnlocked = false;
    }
  }
}
