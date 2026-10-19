export interface AmbientMusicOptions {
  frequencies: number[];
  filterFreq?: number;
  tempo?: number;
}

export interface AmbientMusicHandle {
  stop: () => void;
}

const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];
const MAJOR_PROGRESSION = [0, 5, 3, 4];
const MINOR_PROGRESSION = [0, 5, 2, 6];
const LOOKAHEAD_SEC = 0.6;
const SCHEDULER_INTERVAL_MS = 120;

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
  const thirdCents =
    options.frequencies.length > 1 ? 1200 * Math.log2(options.frequencies[1] / root) : 400;
  const isMinor = Math.abs(thirdCents - 300) < 50;
  const scale = isMinor ? MINOR_SCALE : MAJOR_SCALE;
  const progression = isMinor ? MINOR_PROGRESSION : MAJOR_PROGRESSION;
  const beat = 60 / (options.tempo ?? 54);
  const melodyOctave = root < 250 ? 1 : 0;

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
  wet.gain.value = 0.45;
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
  padFilter.frequency.value = Math.max(500, options.filterFreq ?? 600) * 1.4;
  padFilter.Q.value = 0.5;
  padFilter.connect(input);

  const activeSources = new Set<OscillatorNode>();
  const registerSource = (osc: OscillatorNode) => {
    activeSources.add(osc);
    osc.onended = () => activeSources.delete(osc);
  };

  const playPadChord = (degree: number, time: number, length: number) => {
    const release = 2.2;
    const voices: { freq: number; level: number; type: OscillatorType; detune: number }[] = [];
    [0, 2, 4].forEach((step) => {
      const freq = noteFreq(degree + step, -1);
      voices.push({ freq, level: 0.035, type: 'sine', detune: -6 });
      voices.push({ freq, level: 0.018, type: 'triangle', detune: 6 });
    });
    voices.push({ freq: noteFreq(degree, -2), level: 0.06, type: 'sine', detune: 0 });

    voices.forEach(({ freq, level, type, detune }) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(level, time + 1.8);
      env.gain.setValueAtTime(level, time + length);
      env.gain.linearRampToValueAtTime(0, time + length + release);
      osc.connect(env);
      env.connect(padFilter);
      osc.start(time);
      osc.stop(time + length + release + 0.1);
      registerSource(osc);
    });
  };

  const playBell = (freq: number, time: number, velocity: number) => {
    const partials = [
      { ratio: 1, level: 1, decay: 3.2 },
      { ratio: 2, level: 0.25, decay: 2 },
      { ratio: 3.01, level: 0.08, decay: 1.1 },
    ];
    partials.forEach(({ ratio, level, decay }) => {
      const osc = ctx.createOscillator();
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
      registerSource(osc);
    });
  };

  let beatIndex = 0;
  let melodyDegree = 2;
  let nextBeatTime = ctx.currentTime + 0.15;

  const schedule = () => {
    while (nextBeatTime < ctx.currentTime + LOOKAHEAD_SEC) {
      const bar = Math.floor(beatIndex / 4);
      const beatInBar = beatIndex % 4;
      const chordDegree = progression[bar % progression.length];

      if (beatInBar === 0) {
        playPadChord(chordDegree, nextBeatTime, beat * 4);
        melodyDegree = chordDegree + [0, 2, 4][Math.floor(Math.random() * 3)];
        playBell(noteFreq(melodyDegree, melodyOctave), nextBeatTime, 0.16);
      } else if (Math.random() < 0.7) {
        const step = [-2, -1, 1, 2][Math.floor(Math.random() * 4)];
        melodyDegree = Math.min(11, Math.max(0, melodyDegree + step));
        playBell(noteFreq(melodyDegree, melodyOctave), nextBeatTime, 0.1);
      }

      if (beatInBar !== 3 && Math.random() < 0.25) {
        const passing = Math.min(11, Math.max(0, melodyDegree + (Math.random() < 0.5 ? -1 : 1)));
        playBell(noteFreq(passing, melodyOctave), nextBeatTime + beat / 2, 0.07);
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
        activeSources.forEach((osc) => {
          try {
            osc.stop();
          } catch {}
        });
        activeSources.clear();
        bus.disconnect();
      }, 700);
    },
  };
}
