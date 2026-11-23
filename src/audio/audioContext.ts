import { AudioContextManager } from './AudioContextManager';

export function getAudioContext(): AudioContext {
  return AudioContextManager.getInstance().getContext();
}
