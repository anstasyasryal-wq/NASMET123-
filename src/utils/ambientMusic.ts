export interface AmbientMusicOptions {
  frequencies: number[];
  filterFreq?: number;
  tempo?: number;
  waveform?: OscillatorType;
  /** Unique per hymn (e.g. track id) so every hymn gets its own instrument, rhythm and melody. */
  seed?: string;
}

export interface AmbientMusicHandle {
  stop: () => void;
}

export type LeadInstrument = 'bell' | 'harp' | 'flute' | 'choir';
type Accompaniment = 'pad' | 'arpeggio' | 'drone' | 'organ';

export interface MusicProfile {
  isMinor: boolean;
  tempo: number;
  lead: LeadInstrument;
  accompaniment: Accompaniment;
  progression: number[];
  motif: (number | null)[];
  melodyOctave: number;
}

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];
const MAJOR_PROGRESSIONS = [
  [0, 5, 3, 4],
  [0, 3, 4, 0],
  [0, 4, 5, 3],
  [0, 3, 0, 4],
  [5, 3, 0, 4],
  [0, 1, 4, 0],
];
const MINOR_PROGRESSIONS = [
  [0, 5, 2, 6],
  [0, 3, 4, 0],
  [0, 6, 5, 4],
  [0, 3, 6, 2],
  [0, 5, 3, 4],
];
const LEADS: LeadInstrument[] = ['bell', 'harp', 'flute', 'choir'];
const ACCOMPANIMENTS: Accompaniment[] = ['pad', 'arpeggio', 'drone', 'organ'];
const MOTIF_BEATS = 16;
const LOOKAHEAD_SEC = 0.6;
const SCHEDULER_INTERVAL_MS = 120;

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rng: () => number, list: T[]) => list[Math.floor(rng() * list.length)];

export function buildMusicProfile(options: AmbientMusicOptions): MusicProfile {
  const root = options.frequencies[0] ?? 220;
  const thirdCents =
    options.frequencies.length > 1 ? 1200 * Math.log2(options.frequencies[1] / root) : 400;
  const isMinor = Math.abs(thirdCents - 300) < 50;
  const rng = createRng(hashString(options.seed ?? options.frequencies.join('-')));

  const progression = pick(rng, isMinor ? MINOR_PROGRESSIONS : MAJOR_PROGRESSIONS);
  const lead = pick(rng, LEADS);
  const accompaniment = pick(rng, ACCOMPANIMENTS);
  const baseTempo = isMinor ? 44 : 52;
  const tempo = options.tempo ?? Math.round(baseTempo + rng() * 26);

  // A fixed melodic phrase per hymn, repeated so each hymn has a recognizable tune.
  const motif: (number | null)[] = [];
  let degree = pick(rng, [0, 2, 4]);
  const restChance = lead === 'flute' || lead === 'choir' ? 0.35 : 0.2;
  for (let i = 0; i < MOTIF_BEATS; i++) {
    const beatInBar = i % 4;
    if (beatInBar === 0) {
      const chord = progression[Math.floor(i / 4) % progression.length];
      degree = chord + pick(rng, [0, 2, 4]);
      motif.push(degree);
    } else if (rng() < restChance) {
      motif.push(null);
    } else {
      degree = Math.min(11, Math.max(0, degree + pick(rng, [-2, -1, -1, 1, 1, 2, 3])));
      motif.push(degree);
    }
  }

  return {
    isMinor,
    tempo,
    lead,
    accompaniment,
    progression,
    motif,
    melodyOctave: root < 250 ? 1 : 0,
  };
}

function createReverb(ctx: AudioContext): ConvolverNode {
  const length = Math.floor(ctx.sampleRate * 3.5);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

export function startAmbientMusic(
  ctx: AudioContext,
  destination: AudioNode,
  options: AmbientMusicOptions
): AmbientMusicHandle {
  const root = options.frequencies[0] ?? 220;
  const profile = buildMusicProfile(options);
  const scale = profile.isMinor ? MINOR_SCALE : MAJOR_SCALE;
  const beat = 60 / profile.tempo;
  const padWave: OscillatorType = options.waveform ?? 'sine';

  const noteFreq = (degree: number, octave: number) => {
    const octaveShift = Math.floor(degree / 7);
    const index = ((degree % 7) + 7) % 7;
    return root * Math.pow(2, (scale[index] + 12 * (octaveShift + octave)) / 12);
  };

  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0, ctx.currentTime);
  bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  bus.connect(destination);

  const reverb = createReverb(ctx);
  const wet = ctx.createGain();
  wet.gain.value = profile.lead === 'harp' ? 0.35 : 0.5;
  reverb.connect(wet);
  wet.connect(bus);

  const dry = ctx.createGain();
  dry.gain.value = 0.7;
  dry.connect(bus);

  const input = ctx.createGain();
  input.connect(dry);
  input.connect(reverb);

  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = Math.max(350, options.filterFreq ?? 600) * 1.6;
  padFilter.Q.value = 0.6;
  padFilter.connect(input);

  const activeSources = new Set<AudioScheduledSourceNode>();
  const track = <T extends AudioScheduledSourceNode>(node: T) => {
    activeSources.add(node);
    node.onended = () => activeSources.delete(node);
    return node;
  };

  const tone = (
    freq: number,
    type: OscillatorType,
    time: number,
    attack: number,
    hold: number,
    release: number,
    level: number,
    target: AudioNode,
    detune = 0
  ) => {
    const osc = track(ctx.createOscillator());
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(level, time + attack);
    env.gain.setValueAtTime(level, time + attack + hold);
    env.gain.linearRampToValueAtTime(0, time + attack + hold + release);
    osc.connect(env);
    env.connect(target);
    osc.start(time);
    osc.stop(time + attack + hold + release + 0.1);
    return osc;
  };

  const pluck = (freq: number, time: number, velocity: number, decay: number) => {
    [
      { ratio: 1, level: 1, type: 'triangle' as OscillatorType },
      { ratio: 2, level: 0.3, type: 'sine' as OscillatorType },
      { ratio: 3, level: 0.1, type: 'sine' as OscillatorType },
    ].forEach(({ ratio, level, type }) => {
      const osc = track(ctx.createOscillator());
      osc.type = type;
      osc.frequency.value = freq * ratio;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(velocity * level, time + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, time + decay / ratio);
      osc.connect(env);
      env.connect(input);
      osc.start(time);
      osc.stop(time + decay + 0.1);
    });
  };

  const bell = (freq: number, time: number, velocity: number) => {
    [
      { ratio: 1, level: 1, decay: 3.2 },
      { ratio: 2, level: 0.25, decay: 2 },
      { ratio: 3.01, level: 0.08, decay: 1.1 },
    ].forEach(({ ratio, level, decay }) => {
      const osc = track(ctx.createOscillator());
      osc.type = 'sine';
      osc.frequency.value = freq * ratio;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(velocity * level, time + 0.015);
      env.gain.exponentialRampToValueAtTime(0.0001, time + decay);
      osc.connect(env);
      env.connect(input);
      osc.start(time);
      osc.stop(time + decay + 0.1);
    });
  };

  const flute = (freq: number, time: number, velocity: number, length: number) => {
    const osc = tone(freq, 'sine', time, 0.12, Math.max(0.1, length - 0.2), 0.35, velocity, input);
    const vibrato = track(ctx.createOscillator());
    vibrato.frequency.value = 5;
    const depth = ctx.createGain();
    depth.gain.value = freq * 0.006;
    vibrato.connect(depth);
    depth.connect(osc.frequency);
    vibrato.start(time + 0.25);
    vibrato.stop(time + length + 0.5);
    tone(freq * 2, 'sine', time, 0.15, Math.max(0.1, length - 0.2), 0.3, velocity * 0.12, input);
  };

  const choirFormant = ctx.createBiquadFilter();
  choirFormant.type = 'bandpass';
  choirFormant.frequency.value = 750;
  choirFormant.Q.value = 1.2;
  choirFormant.connect(input);

  const choir = (freq: number, time: number, velocity: number, length: number) => {
    [-8, 8].forEach((detune) =>
      tone(freq, 'sawtooth', time, 0.35, Math.max(0.1, length - 0.3), 0.8, velocity * 0.4, choirFormant, detune)
    );
    tone(freq, 'sine', time, 0.35, Math.max(0.1, length - 0.3), 0.8, velocity * 0.5, input);
  };

  const playLead = (freq: number, time: number, velocity: number, length: number) => {
    switch (profile.lead) {
      case 'harp':
        pluck(freq, time, velocity * 1.1, 2.4);
        break;
      case 'flute':
        flute(freq, time, velocity * 0.8, length);
        break;
      case 'choir':
        choir(freq, time, velocity * 0.7, length);
        break;
      default:
        bell(freq, time, velocity);
    }
  };

  const playAccompaniment = (degree: number, time: number, barLength: number) => {
    const chord = [0, 2, 4].map((step) => noteFreq(degree + step, -1));
    const bass = noteFreq(degree, -2);

    switch (profile.accompaniment) {
      case 'arpeggio': {
        const pattern = [0, 1, 2, 1, 0, 1, 2, 1];
        const step = barLength / pattern.length;
        pattern.forEach((idx, i) => pluck(chord[idx], time + i * step, 0.05, 1.6));
        tone(bass, 'sine', time, 0.4, barLength - 0.4, 1.2, 0.05, padFilter);
        break;
      }
      case 'drone':
        tone(noteFreq(0, -2), 'sine', time, 1.5, barLength - 1, 2, 0.06, padFilter);
        tone(noteFreq(4, -2), 'sine', time, 1.5, barLength - 1, 2, 0.035, padFilter);
        tone(chord[0], padWave, time, 1.2, barLength - 1, 1.5, 0.02, padFilter);
        break;
      case 'organ':
        chord.forEach((freq) => {
          tone(freq, 'square', time, 0.25, barLength - 0.3, 0.8, 0.008, padFilter);
          tone(freq * 2, 'sine', time, 0.25, barLength - 0.3, 0.8, 0.012, padFilter);
        });
        tone(bass, 'sine', time, 0.25, barLength - 0.3, 0.8, 0.06, padFilter);
        break;
      default:
        chord.forEach((freq) => {
          tone(freq, padWave, time, 1.8, barLength - 1.5, 2.2, 0.035, padFilter, -6);
          tone(freq, 'triangle', time, 1.8, barLength - 1.5, 2.2, 0.018, padFilter, 6);
        });
        tone(bass, 'sine', time, 1.8, barLength - 1.5, 2.2, 0.06, padFilter);
    }
  };

  let beatIndex = 0;
  let nextBeatTime = ctx.currentTime + 0.15;

  const schedule = () => {
    while (nextBeatTime < ctx.currentTime + LOOKAHEAD_SEC) {
      const bar = Math.floor(beatIndex / 4);
      const beatInBar = beatIndex % 4;

      if (beatInBar === 0) {
        playAccompaniment(profile.progression[bar % profile.progression.length], nextBeatTime, beat * 4);
      }

      const motifIndex = beatIndex % profile.motif.length;
      const degree = profile.motif[motifIndex];
      // Every other repetition is played an octave higher for a call-and-response feel.
      const cycle = Math.floor(beatIndex / profile.motif.length);
      const octave = profile.melodyOctave + (cycle % 4 === 3 ? 1 : 0);
      if (degree !== null) {
        let length = beat;
        while (
          length < beat * 3 &&
          profile.motif[(motifIndex + Math.round(length / beat)) % profile.motif.length] === null
        ) {
          length += beat;
        }
        playLead(noteFreq(degree, octave), nextBeatTime, beatInBar === 0 ? 0.16 : 0.11, length);
      }

      beatIndex++;
      nextBeatTime += beat;
    }
  };

  schedule();
  const intervalId = window.setInterval(schedule, SCHEDULER_INTERVAL_MS);

  return {
    stop: () => {
      window.clearInterval(intervalId);
      const now = ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.linearRampToValueAtTime(0, now + 0.6);
      window.setTimeout(() => {
        activeSources.forEach((node) => {
          try {
            node.stop();
          } catch {}
        });
        activeSources.clear();
        bus.disconnect();
      }, 700);
    },
  };
}
