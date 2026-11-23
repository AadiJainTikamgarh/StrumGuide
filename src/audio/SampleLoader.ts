/**
 * StrumGuide — SampleLoader
 * Loads, decodes, and caches Web Audio API AudioBuffers for Meta Steel Guitar samples.
 */

import { AudioContextManager } from './AudioContextManager';
import { getAllSamplePaths } from '@/data/sampleManifest';
import { LoadingProgressCallback } from './types';

export class SampleLoader {
  private static instance: SampleLoader | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private pendingFetches: Map<string, Promise<AudioBuffer | null>> = new Map();
  private isPreloaded = false;
  private isLoading = false;

  private constructor() {}

  public static getInstance(): SampleLoader {
    if (!SampleLoader.instance) {
      SampleLoader.instance = new SampleLoader();
    }
    return SampleLoader.instance;
  }

  /**
   * Check if all required samples are already decoded and cached in memory.
   */
  public isFullyLoaded(): boolean {
    return this.isPreloaded;
  }

  /**
   * Get an already decoded buffer from cache.
   */
  public getBuffer(samplePath: string): AudioBuffer | null {
    return this.bufferCache.get(samplePath) || null;
  }

  /**
   * Load and decode a single sample if not already cached.
   */
  public async loadSample(samplePath: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(samplePath)) {
      return this.bufferCache.get(samplePath)!;
    }

    if (this.pendingFetches.has(samplePath)) {
      return this.pendingFetches.get(samplePath)!;
    }

    const fetchPromise = (async () => {
      try {
        const response = await fetch(samplePath);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} fetching sample: ${samplePath}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const ctx = AudioContextManager.getInstance().getContext();

        // Web Audio decode
        const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
          ctx.decodeAudioData(
            arrayBuffer.slice(0),
            (decoded) => resolve(decoded),
            (err) => reject(err)
          );
        });

        this.bufferCache.set(samplePath, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[SampleLoader] Could not load ${samplePath}:`, err);
        return null;
      } finally {
        this.pendingFetches.delete(samplePath);
      }
    })();

    this.pendingFetches.set(samplePath, fetchPromise);
    return fetchPromise;
  }

  /**
   * Preload all samples defined in the manifest with concurrency pooling.
   */
  public async preloadAll(onProgress?: LoadingProgressCallback): Promise<void> {
    if (this.isPreloaded) {
      if (onProgress) {
        const total = this.bufferCache.size;
        onProgress(total, total, 100);
      }
      return;
    }

    if (this.isLoading) return;
    this.isLoading = true;

    const allPaths = getAllSamplePaths();
    const total = allPaths.length;
    let loadedCount = 0;

    // Report initial progress
    if (onProgress) onProgress(0, total, 0);

    const concurrency = 8;
    const queue = [...allPaths];

    const worker = async () => {
      while (queue.length > 0) {
        const path = queue.shift();
        if (!path) break;
        await this.loadSample(path);
        loadedCount++;
        if (onProgress) {
          const percent = Math.round((loadedCount / total) * 100);
          onProgress(loadedCount, total, percent);
        }
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    this.isPreloaded = true;
    this.isLoading = false;
  }

  /**
   * Clears in-memory decoded sample cache.
   */
  public clearCache(): void {
    this.bufferCache.clear();
    this.pendingFetches.clear();
    this.isPreloaded = false;
    this.isLoading = false;
  }
}
