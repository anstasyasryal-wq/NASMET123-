/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, RotateCcw, Volume2, VolumeX, Smartphone, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

const STORAGE_ROSARY_LIFETIME = 'mokarasa_rosary_lifetime_total';
const STORAGE_ROSARY_PRAYER = 'mokarasa_rosary_active_prayer';

export const PRAYER_PRESETS = [
  {
    id: 'jesus_prayer',
    title: 'صلاة يسوع (سهم المخدع)',
    text: '«يَا رَبِّي يَسُوعُ الْمَسِيحُ، ابْنَ اللهِ، ارْحَمْنِي أَنَا الْخَاطِئَ»',
    verse: '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ» (إشعياء 30: 15)',
  },
  {
    id: 'mercy_prayer',
    title: 'طلب المعونة والخلاص',
    text: '«يَا رَبِّي يَسُوعَ الْمَسِيحَ، أَعِنِّي وَخَلِّصْنِي وَاشْفِ ضَعْفِي»',
    verse: '«تَكْفِيكَ نِعْمَتِي، لأَنَّ قُوَّتِي فِي الضَّعْفِ تُكْمَلُ» (2 كو 12: 9)',
  },
  {
    id: 'thanksgiving',
    title: 'صلاة الشكر الدائم',
    text: '«أَشْكُرُكَ يَا رَبَّ الْحَيَاةِ عَلَى كُلِّ حَالٍ، وَمِنْ أَجْلِ كُلِّ حَالٍ»',
    verse: '«شَاكِرِينَ كُلَّ حِينٍ عَلَى كُلِّ شَيْءٍ» (أفسس 5: 20)',
  },
  {
    id: 'kyrie_eleison',
    title: 'طلبة كيرياليسون',
    text: '«كِيرْيَالِيسُونَ.. يَا رَبُّ ارْحَمْ.. يَا رَبُّ ارْحَمْ»',
    verse: '«ارْحَمْنِي يَا اللهُ كَعَظِيمِ رَحْمَتِكَ» (مزمور 51: 1)',
  },
];

export const JesusPrayerRosary: React.FC = () => {
  const [targetKnots, setTargetKnots] = useState<33 | 50 | 100>(33);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [activePrayerIdx, setActivePrayerIdx] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_ROSARY_PRAYER);
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [lifetimeTotal, setLifetimeTotal] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_ROSARY_LIFETIME);
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });
  const [hapticEnabled, setHapticEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activePrayer = PRAYER_PRESETS[activePrayerIdx] || PRAYER_PRESETS[0];

  const handleKnock = () => {
    // 1. Audio tick
    if (soundEnabled) {
      soundManager.playTick();
    }

    // 2. Haptic Feedback
    if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(28);
      } catch {}
    }

    const nextCount = currentCount + 1;
    const newLifetime = lifetimeTotal + 1;
    setLifetimeTotal(newLifetime);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ROSARY_LIFETIME, String(newLifetime));
    }

    if (nextCount >= targetKnots) {
      // Completed round
      if (soundEnabled) {
        soundManager.playCorrect();
      }
      if (hapticEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {}
      }
      setCurrentCount(0);
      setCompletedRounds((prev) => prev + 1);

      // Add consecration points
      if (typeof window !== 'undefined') {
        const bonus = parseInt(localStorage.getItem('mokarasa_consecration_bonus') || '0', 10);
        localStorage.setItem('mokarasa_consecration_bonus', String(bonus + 20));
      }

      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setCurrentCount(nextCount);
    }
  };

  const handleResetRound = () => {
    soundManager.playTick();
    setCurrentCount(0);
  };

  const handleSelectPrayer = (idx: number) => {
    soundManager.playTick();
    setActivePrayerIdx(idx);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ROSARY_PRAYER, String(idx));
    }
  };

  const progressPercent = Math.min(100, Math.round((currentCount / targetKnots) * 100));

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Hero Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 border border-amber-600/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
              <span>📿</span>
              <span>المسبحة الروحية لمخدع المكرس</span>
            </span>
            <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
              مسبحة صلاة يسوع والاهتزاز اللمسي
            </h2>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              صلاة قلبية دائمة تساعدك على حراسة الفكر والاتصال الدائم بالله، مع نبض لمسي خفيف على الهاتف لتصلي في أي وقت ومكان دون تشتت.
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-2 bg-stone-950/80 p-3 rounded-2xl border border-stone-800 text-center shrink-0">
            <div>
              <span className="text-[10px] text-stone-400 block">إجمالي الصلوات</span>
              <span className="font-mono text-base font-bold text-amber-300">{lifetimeTotal.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="text-[10px] text-stone-400 block">الدورات المكتملة</span>
              <span className="font-mono text-base font-bold text-emerald-400">{completedRounds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Presets Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>اختر الصلاة السهمية للمسبحة:</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRAYER_PRESETS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleSelectPrayer(idx)}
              className={`p-2.5 rounded-2xl text-xs font-bold transition border text-right flex flex-col justify-between min-h-[58px] cursor-pointer touch-manipulation ${
                activePrayerIdx === idx
                  ? 'bg-amber-600/30 border-amber-500 text-amber-100 shadow-md'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{p.title}</span>
              <span className="text-[10px] text-stone-400 font-normal truncate mt-1">{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Knots & Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-300">طول الدورة:</span>
          {[33, 50, 100].map((num) => (
            <button
              key={num}
              onClick={() => {
                soundManager.playTick();
                setTargetKnots(num as 33 | 50 | 100);
                setCurrentCount(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                targetKnots === num
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {num === 33 ? '٣٣ (سنوات الفداء)' : num === 50 ? '٥٠' : '١٠٠'}
            </button>
          ))}
        </div>

        {/* Sensory Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition border cursor-pointer ${
              hapticEnabled
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title="الاهتزاز اللمسي"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{hapticEnabled ? 'اهتزاز مفعّل' : 'اهتزاز متوقف'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition border cursor-pointer ${
              soundEnabled
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title="الصوت"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleResetRound}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition border border-stone-700 cursor-pointer"
            title="إعادة تصفير الدورة الحالية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Rosary Dial */}
      <div className="p-6 sm:p-10 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Active prayer display */}
        <div className="text-center space-y-2 max-w-lg">
          <h3 className="font-spiritual text-lg sm:text-2xl font-black text-amber-100 leading-relaxed px-4">
            {activePrayer.text}
          </h3>
          <p className="text-xs text-amber-400/90 font-medium">
            {activePrayer.verse}
          </p>
        </div>

        {/* Circular Touch Bead Button */}
        <div className="relative flex items-center justify-center">
          {/* Outer SVG Ring Progress */}
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-stone-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-amber-500 transition-all duration-200 ease-out"
              strokeWidth="10"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Button */}
          <button
            type="button"
            onClick={handleKnock}
            className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-950 via-stone-900 to-amber-900 hover:from-amber-900 hover:to-amber-800 border-4 border-amber-500/70 shadow-2xl flex flex-col items-center justify-center text-center transition-transform active:scale-95 cursor-pointer touch-manipulation group"
          >
            <span className="text-3xl sm:text-4xl mb-1 group-hover:scale-110 transition-transform">✝️</span>
            <span className="font-spiritual text-base sm:text-lg font-bold text-amber-200">اضغط للصلاة</span>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-3xl font-black text-amber-400">{currentCount}</span>
              <span className="text-xs text-stone-400">/ {targetKnots}</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1">«ياربي يسوع»</span>
          </button>
        </div>

        {/* Progress Bar & percentage */}
        <div className="w-full max-w-md space-y-1.5 text-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 px-1">
            <span>تقدم العقد: {currentCount} من {targetKnots}</span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
