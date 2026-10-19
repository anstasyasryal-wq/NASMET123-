import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { startAmbientMusic, type AmbientMusicHandle } from '../utils/ambientMusic';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  Sparkles,
  Radio,
  Sliders,
} from 'lucide-react';

export interface HymnTrack {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  frequencies: number[]; // chord frequencies for ambient Web Audio synth
}

const MONASTIC_TRACKS: HymnTrack[] = [
  {
    id: 'agios',
    title: 'لحن آغيوس (قدوس الله القدوس القوي)',
    subtitle: 'ألحان القيامة والتسبيح الملائكي الهادئ للتأمل',
    category: 'ألحان مقدسة',
    duration: '04:30',
    frequencies: [220, 277.18, 329.63, 440], // A Major contemplative chord
  },
  {
    id: 'ti-horani',
    title: 'لحن تي هوراني (شفاعة العذراء أم النور)',
    subtitle: 'تسبحة روحية هادئة تعزز السكون القلبي',
    category: 'تمجيدات السيدة العذراء',
    duration: '05:15',
    frequencies: [196, 246.94, 293.66, 392], // G Major peaceful chord
  },
  {
    id: 'psalm-23',
    title: 'مزمور الراعي والاتكال (الرب راعيّ فلا يعوزني شيء)',
    subtitle: 'ترتيل داوودي هادئ للطمأنينة والسلام',
    category: 'مزامير المخدع',
    duration: '03:45',
    frequencies: [261.63, 329.63, 392, 523.25], // C Major serene chord
  },
  {
    id: 'monastic-silence',
    title: 'ألحان سكون البرية وأنفاس صلاة يسوع',
    subtitle: 'تأمل صامت مع نغمات جرس الدير الهادئ',
    category: 'ألحان الرهبان',
    duration: '06:00',
    frequencies: [174.61, 220, 261.63, 349.23], // F Major deep meditative
  },
];

export const MonasticAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<AmbientMusicHandle | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentTrack = MONASTIC_TRACKS[currentTrackIndex];

  const stopSynth = () => {
    musicRef.current?.stop();
    musicRef.current = null;
  };

  const startSynth = (track: HymnTrack) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 1.2, ctx.currentTime);

      stopSynth();
      musicRef.current = startAmbientMusic(ctx, gainNodeRef.current, {
        frequencies: track.frequencies,
      });
    } catch {
      // Audio context unavailable
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startSynth(currentTrack);
    } else {
      stopSynth();
    }
    return () => {
      stopSynth();
    };
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 1.2,
        audioCtxRef.current.currentTime
      );
    }
  }, [isMuted, volume]);

  const togglePlay = () => {
    soundManager.playTick();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    soundManager.playTick();
    setCurrentTrackIndex((prev) => (prev + 1) % MONASTIC_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    soundManager.playTick();
    setCurrentTrackIndex((prev) => (prev - 1 + MONASTIC_TRACKS.length) % MONASTIC_TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    soundManager.playTick();
    setIsMuted(!isMuted);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border border-amber-600/40 p-5 sm:p-6 shadow-xl space-y-4 text-right">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-600/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 relative">
            <Radio className={`w-6 h-6 ${isPlaying ? 'animate-pulse text-amber-400' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{currentTrack.category}</span>
            </div>
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
              {currentTrack.title}
            </h3>
            <p className="text-xs text-stone-300">{currentTrack.subtitle}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition"
            title="الترنيمة السابقة"
          >
            <SkipBack className="w-4 h-4 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition cursor-pointer"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition"
            title="الترنيمة التالية"
          >
            <SkipForward className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>

      {/* Volume and Track Selection */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={toggleMute} className="text-stone-400 hover:text-amber-400 transition">
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-400" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-28 sm:w-36 accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-stone-400 font-mono">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Quick Track Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {MONASTIC_TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                soundManager.playTick();
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                currentTrackIndex === idx
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {track.category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
