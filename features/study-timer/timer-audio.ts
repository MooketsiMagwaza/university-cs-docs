import { synthesizeTone } from './timer-sounds';
import type { TimerTone } from './timer-types';

/** A ringing alarm stops by itself after this long, so a forgotten tab does not ring all night. */
const MAX_RING_SECONDS = 600;

let context: AudioContext | null = null;
let stopCurrent: (() => void) | null = null;
const buffers = new Map<string, AudioBuffer>();

function audioContext() {
  if (context) return context;
  const AudioContextClass = window.AudioContext || (window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;
  if (!AudioContextClass) return null;
  try {
    context = new AudioContextClass();
  } catch {
    return null;
  }
  return context;
}

/**
 * Browsers keep audio silent until the reader has interacted with the page. Called from the Start click, this
 * creates the audio context inside that click, so an alarm that rings later, from a timer, is allowed to be heard.
 */
export function unlockTimerAudio() {
  const audio = audioContext();
  if (audio && audio.state === 'suspended') void audio.resume().catch(() => {});
}

function bufferFor(audio: AudioContext, tone: TimerTone) {
  const key = `${tone}:${audio.sampleRate}`;
  let buffer = buffers.get(key);
  if (!buffer) {
    const samples = synthesizeTone(tone, audio.sampleRate);
    buffer = audio.createBuffer(1, samples.length, audio.sampleRate);
    buffer.getChannelData(0).set(samples);
    buffers.set(key, buffer);
  }
  return buffer;
}

export function stopTimerTone() {
  stopCurrent?.();
  stopCurrent = null;
}

/**
 * Plays the tone once, or over and over when `loop` is set. A looping buffer is played by the audio clock itself, so
 * it keeps ringing in a background tab whose timers are throttled. Only one tone plays at a time.
 */
export function playTimerTone(tone: TimerTone, volume: number, loop: boolean) {
  stopTimerTone();
  const audio = audioContext();
  if (!audio) return;
  try {
    if (audio.state === 'suspended') void audio.resume().catch(() => {});
    const source = audio.createBufferSource();
    source.buffer = bufferFor(audio, tone);
    source.loop = loop;
    const gain = audio.createGain();
    // A squared curve feels more even to the ear than a straight line.
    const level = Math.max(0, Math.min(1, volume / 100));
    gain.gain.value = level * level;
    source.connect(gain);
    gain.connect(audio.destination);
    source.start();
    if (loop) source.stop(audio.currentTime + MAX_RING_SECONDS);

    const stop = () => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
      source.disconnect();
      gain.disconnect();
      if (stopCurrent === stop) stopCurrent = null;
    };
    source.onended = stop;
    stopCurrent = stop;
  } catch {
    // Audio is optional and the browser may still be blocking it.
  }
}
