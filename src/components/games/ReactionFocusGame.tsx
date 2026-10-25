import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Clock,
  ArrowRight,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
  Flame,
  Award,
} from 'lucide-react';

interface ReactionFocusGameProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface GridCell {
  id: number;
  type: 'virtue' | 'distraction' | 'empty';
  label: string;
  icon: string;
  points: number;
  expiresAt: number;
}

const GOOD_TARGETS = [
  { label: 'صلاة نقية', icon: '🙏', points: 15 },
  { label: 'محبة باذلة', icon: '❤️', points: 15 },
  { label: 'وداعة قلب', icon: '🕊️', points: 15 },
  { label: 'تسبيح روحي', icon: '🎶', points: 20 },
  { label: 'صوم وتجرد', icon: '🍞', points: 15 },
  { label: 'هدوء المخدع', icon: '🕯️', points: 25 },
];

const BAD_TARGETS = [
  { label: 'كسل وتراخٍ', icon: '😴', points: -15 },
  { label: 'قلق وتشتت', icon: '⚡', points: -15 },
  { label: 'غضب متسرع', icon: '😡', points: -20 },
  { label: 'مديح باطل', icon: '📢', points: -20 },
];

const GAME_DURATION_SECS = 30;

export const ReactionFocusGame: React.FC<ReactionFocusGameProps> = ({ onBack, onSuccess }) => {
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECS);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [cells, setCells] = useState<GridCell[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      type: 'empty',
      label: '',
      icon: '',
      points: 0,
      expiresAt: 0,
    }))
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mokarasa_reaction_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const playSfx = (type: 'good' | 'bad' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'good') soundManager.playCorrect();
      if (type === 'bad') soundManager.playTick();
      if (type === 'win') soundManager.playCelebration();
    } catch {}
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION_SECS);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Timer Countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft <= 0 && isPlaying) {
      setIsPlaying(false);
      setIsGameOver(true);
      playSfx('win');
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('mokarasa_reaction_highscore', String(score));
        } catch {}
      }
      try {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } catch {}
      onSuccess(Math.max(50, Math.floor(score / 3)));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft, score, highScore, onSuccess]);

  // Spawner Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        // Pick 1 to 2 random cells to spawn or change
        setCells((current) => {
          const now = Date.now();
          const next = [...current];

          // Clear expired
          for (let i = 0; i < 9; i++) {
            if (next[i].type !== 'empty' && next[i].expiresAt <= now) {
              next[i] = { id: i, type: 'empty', label: '', icon: '', points: 0, expiresAt: 0 };
            }
          }

          // Pick an empty cell
          const emptyIndices = next.map((c, i) => (c.type === 'empty' ? i : -1)).filter((i) => i !== -1);
          if (emptyIndices.length > 0) {
            const targetIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            const isGood = Math.random() > 0.28; // 72% chance good, 28% distraction

            if (isGood) {
              const item = GOOD_TARGETS[Math.floor(Math.random() * GOOD_TARGETS.length)];
              next[targetIdx] = {
                id: targetIdx,
                type: 'virtue',
                label: item.label,
                icon: item.icon,
                points: item.points,
                expiresAt: now + 1600, // 1.6s to click
              };
            } else {
              const item = BAD_TARGETS[Math.floor(Math.random() * BAD_TARGETS.length)];
              next[targetIdx] = {
                id: targetIdx,
                type: 'distraction',
                label: item.label,
                icon: item.icon,
                points: item.points,
                expiresAt: now + 2000,
              };
            }
          }

          return next;
        });
      }, 550);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle cell click
  const handleCellClick = (cell: GridCell) => {
    if (!isPlaying || cell.type === 'empty') return;

    if (cell.type === 'virtue') {
      playSfx('good');
      const add = cell.points + combo * 2;
      setScore((s) => s + add);
      setCombo((c) => {
        const nextC = c + 1;
        if (nextC > maxCombo) setMaxCombo(nextC);
        return nextC;
      });
    } else {
      // Clicked distraction
      playSfx('bad');
      setScore((s) => Math.max(0, s + cell.points));
      setCombo(0);
    }

    // Clear clicked cell
    setCells((current) =>
      current.map((c) =>
        c.id === cell.id ? { id: c.id, type: 'empty', label: '', icon: '', points: 0, expiresAt: 0 } : c
      )
    );
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            ⚡
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              تحدي سرعة البديهة والتركيز (Focus & Reaction)
            </h2>
            <p className="text-xs text-stone-400">
              اضغط بأقصى سرعة على الفضائل الروحية وتجنب المشتتات والكسل خلال 30 ثانية حماسية!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمركز</span>
          </button>
        </div>
      </div>

      {/* Score & Timer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-bold">الوقت المتبقي: {timeLeft} ثانية</span>
        </div>

        <div className="flex items-center gap-2 text-stone-200">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>النقاط: <strong className="text-amber-400 text-base">{score}</strong></span>
        </div>

        <div className="flex items-center gap-2 text-stone-300">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>المتتالية: <strong className="text-orange-400">{combo}x</strong></span>
        </div>

        <div className="text-stone-400 font-sans">
          أفضل رقم: <strong className="text-stone-200">{highScore}</strong>
        </div>
      </div>

      {/* 3x3 Grid Arena */}
      <div className="relative min-h-[360px] sm:min-h-[420px] bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-stone-800 rounded-3xl p-6 sm:p-8 flex items-center justify-center shadow-2xl overflow-hidden">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[420px] aspect-square">
          {cells.map((cell) => {
            const isGood = cell.type === 'virtue';
            const isBad = cell.type === 'distraction';

            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => handleCellClick(cell)}
                disabled={!isPlaying || cell.type === 'empty'}
                className={`rounded-2xl border-2 transition-all duration-150 flex flex-col items-center justify-center select-none aspect-square p-2 ${
                  isGood
                    ? 'bg-gradient-to-b from-emerald-900 to-emerald-950 border-emerald-400 ring-4 ring-emerald-500/30 scale-102 shadow-lg animate-bounce-subtle cursor-pointer'
                    : isBad
                    ? 'bg-gradient-to-b from-rose-950 to-stone-950 border-rose-500 ring-2 ring-rose-500/20 shadow-md cursor-pointer'
                    : 'bg-stone-900/60 border-stone-800/80 cursor-default'
                }`}
              >
                {cell.type !== 'empty' && (
                  <motion.div
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center text-center space-y-1"
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-md">{cell.icon}</span>
                    <span className="text-[10px] sm:text-xs font-bold font-spiritual text-stone-100 truncate max-w-full">
                      {cell.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold ${
                        isGood ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {isGood ? `+${cell.points}` : cell.points}
                    </span>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-20 text-center">
            <div className="max-w-sm w-full bg-stone-900 border-2 border-amber-600/50 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-3xl mx-auto">
                ⚡
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-amber-300 font-spiritual">
                  {isGameOver ? 'انتهت الجولة!' : 'تحدي التركيز وسرعة البديهة'}
                </h3>
                {isGameOver ? (
                  <p className="text-xs text-stone-300">
                    حققت <strong>{score} نقطة</strong> مع أعلى متتالية <strong>{maxCombo}x</strong>!
                  </p>
                ) : (
                  <p className="text-xs text-stone-400">
                    اضغط فقط على الفضائل (صلاة، محبة، وداعة) وتجنب المشتتات والكسل قبل نفاد الـ 30 ثانية.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={startGame}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition cursor-pointer"
              >
                {isGameOver ? 'العب جولة جديدة ➔' : 'ابدأ التحدي الآن (30 ثانية)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactionFocusGame;
