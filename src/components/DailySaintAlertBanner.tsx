import React, { useState, useEffect } from 'react';
import { getDailySaintSticker, SaintSticker } from '../data/saintsStickersData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface DailySaintAlertBannerProps {
  onOpenFullModal: () => void;
}

export const DailySaintAlertBanner: React.FC<DailySaintAlertBannerProps> = ({
  onOpenFullModal,
}) => {
  const [data, setData] = useState(() => getDailySaintSticker(false));
  const [timeRemainingMs, setTimeRemainingMs] = useState(data.timeRemainingMs);
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mokarasa_saint_alert_expanded');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemainingMs((prev) => {
        if (prev <= 1000) {
          const fresh = getDailySaintSticker(false);
          setData(fresh);
          return fresh.timeRemainingMs;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRemainingTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDrawNew = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playCorrect();
    const fresh = getDailySaintSticker(true);
    setData(fresh);
    setTimeRemainingMs(fresh.timeRemainingMs);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playVictory();
    const text = `🌟 تنبيه قديس اليوم وفضيلة النهار\n\n🕊️ ${data.sticker.name} (${data.sticker.epithet})\n🏛️ التقليد: ${data.sticker.traditionLabel}\n✨ الفضيلة المنبه عليها: ${data.sticker.virtue}\n\n💌 رسالة القديس لك:\n${data.sticker.dailyMessage}\n\n🩺 تدريب اليوم:\n${data.sticker.practicalExercise}\n\n✝️ تطبيق «حسب قلب الله»`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleExpand = () => {
    soundManager.playTick();
    const next = !isExpanded;
    setIsExpanded(next);
    try {
      localStorage.setItem('mokarasa_saint_alert_expanded', JSON.stringify(next));
    } catch {}
  };

  const { sticker } = data;

  return (
    <div
      className={`rounded-3xl border-2 shadow-2xl transition-all duration-300 relative overflow-hidden text-right select-none ${
        isExpanded
          ? 'bg-gradient-to-r from-stone-950 via-[#1a140d] to-stone-950 border-amber-500/70 p-5 sm:p-7'
          : 'bg-stone-950/95 border-amber-600/50 p-3.5 hover:border-amber-400 cursor-pointer'
      }`}
      onClick={!isExpanded ? toggleExpand : undefined}
      dir="rtl"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* COMPACT VIEW */}
      {!isExpanded && (
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 rounded-xl bg-stone-900 border border-amber-500/30">
              {sticker.badgeIcon}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-amber-200 font-spiritual text-sm sm:text-base">
                تنبيه قديس اليوم: {sticker.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                ينبه على: {sticker.virtue}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDrawNew}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="سحب قديس آخر بالقرعة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">سحب بالقرعة</span>
            </button>

            <button
              onClick={toggleExpand}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300"
              title="توسيع التنبيه لقراءة الرسالة كاملة"
            >
              <ChevronDown className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* EXPANDED FULL VIEW */}
      {isExpanded && (
        <div className="space-y-4 relative z-10 animate-fade-in">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                {sticker.badgeIcon}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    {sticker.traditionLabel}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>غير مكرر ٢٤ ساعة (دورة سنوية)</span>
                  </span>
                </div>
                <h3 className="font-spiritual text-lg sm:text-2xl font-bold text-amber-100">
                  {sticker.name}
                </h3>
                <p className="text-xs text-amber-300/90 font-serif">
                  {sticker.epithet} • {sticker.century}
                </p>
              </div>
            </div>

            {/* Virtue Alert Badge & Actions */}
            <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-400">الفضيلة المنبه عليها اليوم:</span>
                <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-md">
                  {sticker.virtue}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleExpand}
                  className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1"
                  title="تصغير التنبيه"
                >
                  <ChevronUp className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px]">تصغير</span>
                </button>
              </div>
            </div>
          </div>

          {/* Daily Message Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-950/90 border border-amber-600/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>رسالة القديس لمخدعك وخدمتك اليوم:</span>
            </div>
            <p className="font-spiritual text-xs sm:text-sm text-stone-100 leading-relaxed font-semibold">
              {sticker.dailyMessage}
            </p>
          </div>

          {/* Practical Exercise */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-600/30 text-xs sm:text-sm text-stone-200 flex items-start gap-2.5">
            <span className="text-emerald-400 font-bold shrink-0">🩺 تدريب اليوم العملي:</span>
            <span className="leading-relaxed">{sticker.practicalExercise}</span>
          </div>

          {/* Footer Controls & Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>يتجدد استكر قديس اليوم تلقائياً بعد:</span>
              <span className="text-amber-300 font-bold">{formatRemainingTime(timeRemainingMs)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleDrawNew}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>سحب قديس آخر بالقرعة</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold transition flex items-center gap-1.5 cursor-pointer text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرسالة'}</span>
              </button>

              <button
                onClick={onOpenFullModal}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>عرض ألبوم الاستكرات الكامل (٣٦٥ يوماً)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
