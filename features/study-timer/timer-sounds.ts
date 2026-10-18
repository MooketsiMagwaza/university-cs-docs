import type { TimerTone } from './timer-types';

/**
 * The alarm sounds are computed here, sample by sample, so there are no audio files to load. Each one is a short
 * pattern that ends in silence, so playing it in a loop has no click and a natural pause between rings.
 */

type Note = {
  at: number;
  freq: number;
  length: number;
  /** Frequency ratio and loudness of each partial. */
  partials: Array<[number, number]>;
  /** How fast the note fades (per second); 0 holds it level until the short release. */
  decay: number;
  attack?: number;
};

const TWO_PI = Math.PI * 2;
const RELEASE = 0.02;
const PEAK = 0.9;

const bell: Array<[number, number]> = [[1, 1], [2.76, 0.4], [5.4, 0.2]];
const square: Array<[number, number]> = [[1, 1], [3, 1 / 3], [5, 1 / 5]];
const pure: Array<[number, number]> = [[1, 1], [2, 0.15]];
const warm: Array<[number, number]> = [[1, 1], [2, 0.2]];

const patterns: Record<TimerTone, { seconds: number; notes: Note[] }> = {
  chime: {
    seconds: 3.2,
    notes: [
      { at: 0, freq: 1046.5, length: 1.2, partials: bell, decay: 3.5 },
      { at: 0.45, freq: 1318.5, length: 1.2, partials: bell, decay: 3.5 },
      { at: 0.9, freq: 1568, length: 1.4, partials: bell, decay: 3 },
    ],
  },
  beep: {
    seconds: 1.8,
    notes: [0, 0.3, 0.6].map((at) => ({ at, freq: 880, length: 0.18, partials: pure, decay: 0 })),
  },
  digital: {
    seconds: 1.6,
    notes: [0, 1, 2, 3, 4, 5].map((index) => ({
      at: index * 0.12,
      freq: index % 2 === 0 ? 1318.5 : 987.8,
      length: 0.09,
      partials: square,
      decay: 0,
    })),
  },
  soft: {
    seconds: 3.2,
    notes: [
      { at: 0, freq: 523.25, length: 1.6, partials: warm, decay: 2, attack: 0.03 },
      { at: 0.6, freq: 659.25, length: 1.8, partials: warm, decay: 2, attack: 0.03 },
    ],
  },
};

/** One pass of the pattern as mono samples between -1 and 1. */
export function synthesizeTone(tone: TimerTone, sampleRate: number): Float32Array {
  const { seconds, notes } = patterns[tone];
  const out = new Float32Array(Math.round(seconds * sampleRate));

  for (const note of notes) {
    const start = Math.round(note.at * sampleRate);
    const count = Math.min(out.length - start, Math.round(note.length * sampleRate));
    const attack = Math.max(1, Math.round((note.attack ?? 0.005) * sampleRate));
    const release = Math.max(1, Math.round(RELEASE * sampleRate));
    for (let index = 0; index < count; index += 1) {
      const time = index / sampleRate;
      let value = 0;
      for (const [ratio, loudness] of note.partials) value += loudness * Math.sin(TWO_PI * note.freq * ratio * time);
      let envelope = Math.exp(-time * note.decay);
      if (index < attack) envelope *= index / attack;
      if (index >= count - release) envelope *= (count - index) / release;
      out[start + index] += value * envelope;
    }
  }

  let peak = 0;
  for (const sample of out) peak = Math.max(peak, Math.abs(sample));
  if (peak > 0) for (let index = 0; index < out.length; index += 1) out[index] = (out[index] * PEAK) / peak;
  return out;
}
