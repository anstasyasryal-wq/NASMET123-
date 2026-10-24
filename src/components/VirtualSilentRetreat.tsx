import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Clock, X, Sparkles, Volume2, Bell, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface VirtualSilentRetreatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualSilentRetreat: React.FC<VirtualSilentRetreatProps> = ({ isOpen, onClose }) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(3);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          soundManager.playChurchTone('coptic_bell');
          try {
            confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
          } catch {}
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartRetreat = (mins: number) => {
    soundManager.playTick();
    setDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div className="bg-gradient-to-b from-[#181614] via-[#0f0e0d] to-[#121110] border-2 border-amber-600/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              🕯️
            </div>
            <div>
              <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                خلوة الصمت السكونية
              </h3>
              <p className="text-[11px] text-stone-400">انفصل عن صخب العالم وادخل إلى مخدعك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Candle & Icon Glow Center */}
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-tr from-amber-950 via-stone-900 to-amber-900/50 border-2 border-amber-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="absolute inset-2 rounded-full border border-amber-400/20 animate-ping opacity-25" />
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl sm:text-6xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]"
            >
              🕯️
            </motion.div>
          </div>

          {!isRunning && !isCompleted && (
            <div className="text-center space-y-2">
              <p className="font-spiritual text-amber-200 text-sm">اختر مدة السكون الإلهي:</p>
              <div className="flex justify-center gap-2">
                {[3, 5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleStartRetreat(mins)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {mins} دقائق
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timer Display */}
          {(isRunning || isCompleted) && (
            <div className="text-center space-y-3">
              <div className="font-mono text-4xl sm:text-5xl font-black text-amber-400 tracking-wider">
                {formatTime(timeLeftSeconds)}
              </div>
              <p className="text-xs text-stone-300 font-spiritual">
                {isCompleted
                  ? '✨ تمت خلوة السكون بنعمة الله - املأ قلبك بالسلام'
                  : '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ»'}
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-center gap-3">
          {isRunning ? (
            <button
              onClick={() => {
                soundManager.playTick();
                setIsRunning(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
            >
              إيقاف مؤقت
            </button>
          ) : !isCompleted ? (
            <button
              onClick={() => handleStartRetreat(durationMinutes)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-sm transition shadow-lg cursor-pointer"
            >
              بدء خلوة السكون ({durationMinutes} دقائق) ✝️
            </button>
          ) : (
            <button
              onClick={() => {
                setIsCompleted(false);
                setIsRunning(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer"
            >
              بدء خلوة جديدة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
