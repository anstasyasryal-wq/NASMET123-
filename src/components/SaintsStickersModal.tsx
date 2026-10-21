import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  SAINTS_STICKERS_DATA,
  SaintSticker,
  getDailySaintSticker,
} from '../data/saintsStickersData';
import {
  X,
  Sparkles,
  Shield,
  Heart,
  Scroll,
  Search,
  Filter,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Globe,
  Award,
  Bookmark,
} from 'lucide-react';

interface SaintsStickersModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentUser?: User | null;
  isFullView?: boolean;
  onBackToHome?: () => void;
}

const SaintStickerAlbumCard = React.memo<{
  sticker: SaintSticker;
  isSelected: boolean;
  onSelect: (s: SaintSticker) => void;
}>(({ sticker, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(sticker)}
      className={`p-5 rounded-3xl border-2 transition-all duration-200 cursor-pointer space-y-3 flex flex-col justify-between hover:scale-[1.02] shadow-lg ${
        isSelected
          ? 'bg-gradient-to-br from-amber-950/90 to-stone-900 border-amber-400 shadow-amber-500/20'
          : 'bg-stone-900 border-stone-800 hover:border-amber-700/50'
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-stone-800 shadow-inner">
            {sticker.badgeIcon}
          </span>
          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-full font-bold">
            {sticker.traditionLabel.split(' ')[0]}
          </span>
        </div>

        <div>
          <h4 className="font-spiritual text-base font-bold text-amber-100">
            {sticker.name}
          </h4>
          <p className="text-[11px] text-amber-300/80 font-serif">
            {sticker.epithet}
          </p>
        </div>

        <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-[11px] space-y-1">
          <span className="text-stone-400 block text-[10px]">الفضيلة المنبه عليها:</span>
          <span className="font-bold text-amber-200">{sticker.virtue}</span>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed font-spiritual line-clamp-2">
          «{sticker.quote}»
        </p>
      </div>

      <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-amber-400 font-bold">
        <span>عرض رسالة القديس</span>
        <span>←</span>
      </div>
    </div>
  );
});

SaintStickerAlbumCard.displayName = 'SaintStickerAlbumCard';

export const SaintsStickersModal: React.FC<SaintsStickersModalProps> = ({
  isOpen = true,
  onClose,
  currentUser,
  isFullView = false,
  onBackToHome,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<SaintSticker>(() => {
    return getDailySaintSticker(false).sticker;
  });

  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(() => {
    return getDailySaintSticker(false).timeRemainingMs;
  });

  const [activeTab, setActiveTab] = useState<'today_sticker' | 'album'>('today_sticker');
  const [traditionFilter, setTraditionFilter] = useState<string>('all');
  const [virtueFilter, setVirtueFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [collectedStickerIds, setCollectedStickerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mokarasa_collected_saints_stickers_v1');
      return saved ? JSON.parse(saved) : [selectedSticker.id];
    } catch {
      return [selectedSticker.id];
    }
  });

  // Countdown timer - Only runs when modal is open and on today_sticker tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'today_sticker') return;
    const timer = setInterval(() => {
      setTimeRemainingMs((prev) => {
        if (prev <= 1000) {
          const fresh = getDailySaintSticker(false);
          setSelectedSticker(fresh.sticker);
          return fresh.timeRemainingMs;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, activeTab]);

  const formatRemainingTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDrawNewSticker = () => {
    soundManager.playCorrect();
    const fresh = getDailySaintSticker(true);
    setSelectedSticker(fresh.sticker);
    setTimeRemainingMs(fresh.timeRemainingMs);

    if (!collectedStickerIds.includes(fresh.sticker.id)) {
      const updated = [...collectedStickerIds, fresh.sticker.id];
      setCollectedStickerIds(updated);
      try {
        localStorage.setItem('mokarasa_collected_saints_stickers_v1', JSON.stringify(updated));
      } catch {}
    }

    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const handleSelectFromAlbum = (stk: SaintSticker) => {
    soundManager.playTick();
    setSelectedSticker(stk);
    setActiveTab('today_sticker');
    if (!collectedStickerIds.includes(stk.id)) {
      const updated = [...collectedStickerIds, stk.id];
      setCollectedStickerIds(updated);
      try {
        localStorage.setItem('mokarasa_collected_saints_stickers_v1', JSON.stringify(updated));
      } catch {}
    }
  };

  const handleCopySticker = () => {
    soundManager.playVictory();
    const text = `🌟 استكر وبركة قديس اليوم | حسب قلب الله\n\n🕊️ ${selectedSticker.name} (${selectedSticker.epithet})\n🏛️ التقليد: ${selectedSticker.traditionLabel}\n✨ الفضيلة المنبه عليها: ${selectedSticker.virtue}\n\n💌 رسالة القديس لك:\n${selectedSticker.dailyMessage}\n\n📖 قول مأثور:\n«${selectedSticker.quote}» (${selectedSticker.quoteRef})\n\n🩺 تدريب اليوم:\n${selectedSticker.practicalExercise}\n\n✝️ تطبيق «حسب قلب الله»`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  // Filtered Album
  const filteredAlbum = SAINTS_STICKERS_DATA.filter((s) => {
    const matchesTradition =
      traditionFilter === 'all' ||
      (traditionFilter === 'east' && s.tradition === 'east') ||
      (traditionFilter === 'west' && s.tradition === 'west') ||
      (traditionFilter === 'celtic' && s.tradition === 'celtic') ||
      (traditionFilter === 'syrian_armenian' && s.tradition === 'syrian_armenian') ||
      (traditionFilter === 'universal' && s.tradition === 'universal');

    const matchesVirtue = virtueFilter === 'all' || s.virtueCategory === virtueFilter;

    const matchesQuery =
      s.name.includes(searchQuery) ||
      s.virtue.includes(searchQuery) ||
      s.dailyMessage.includes(searchQuery) ||
      s.quote.includes(searchQuery);

    return matchesTradition && matchesVirtue && matchesQuery;
  });

  if (!isFullView && !isOpen) return null;

  const content = (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-800/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
            🌟
          </div>
          <div>
            <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
              <span>استكرات القديسين اليومية والتنبيه على الفضائل</span>
            </h2>
            <p className="text-xs text-amber-300/80 font-serif">
              قديسو الشرق والغرب وكنائس العالم الجامعة — رسالة وبركة وتدريب فضيلة لكل يوم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Switch tabs */}
          <div className="flex items-center p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-bold">
            <button
              onClick={() => {
                soundManager.playTick();
                setActiveTab('today_sticker');
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'today_sticker'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              استكر اليوم
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                setActiveTab('album');
              }}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'album'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span>ألبوم الاستكرات</span>
              <span className="text-[10px] bg-amber-900/60 px-1.5 py-0.2 rounded-full font-mono text-amber-300">
                {collectedStickerIds.length}/{SAINTS_STICKERS_DATA.length}
              </span>
            </button>
          </div>

          {!isFullView && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {isFullView && onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 rotate-180" />
              <span>الرئيسية</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TODAY'S SAINT STICKER */}
      {/* ========================================================================= */}
      {activeTab === 'today_sticker' && (
        <div className="space-y-6">
          {/* Glowing Daily Sticker Card */}
          <div
            className={`p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-stone-950 via-[#1b150f] to-stone-950 border-3 ${selectedSticker.stickerColor} shadow-2xl relative overflow-hidden space-y-6 text-right`}
          >
            {/* Halo Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Sticker Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 border-b border-stone-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2.5 rounded-2xl bg-stone-900/90 border border-amber-500/30 shadow-md">
                  {selectedSticker.badgeIcon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {selectedSticker.traditionLabel}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {selectedSticker.century}
                    </span>
                  </div>
                  <h3 className="font-spiritual text-xl sm:text-3xl font-bold text-amber-100 mt-1">
                    {selectedSticker.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-serif font-semibold">
                    {selectedSticker.epithet}
                  </p>
                </div>
              </div>

              {/* Virtue Alert Pill */}
              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="text-[10px] text-stone-400">تنبيه الفضيلة لليوم:</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>{selectedSticker.virtue}</span>
                </span>
              </div>
            </div>

            {/* Daily Message */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950/80 border border-amber-600/30 space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <span>💌</span>
                <span>رسالة القديس لك في مخدعك اليوم:</span>
              </div>
              <p className="font-spiritual text-sm sm:text-base text-stone-100 leading-relaxed font-bold">
                {selectedSticker.dailyMessage}
              </p>
            </div>

            {/* Patristic Quote */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-700/40 space-y-1.5 relative z-10 text-xs sm:text-sm">
              <span className="text-amber-300 font-serif font-bold block">
                «{selectedSticker.quote}»
              </span>
              <span className="text-[11px] text-stone-400 font-mono block text-left">
                — المصدر: {selectedSticker.quoteRef}
              </span>
            </div>

            {/* Practical Prescription */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-600/40 space-y-1.5 relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تدريب اليوم العملي لتجسيد هذه الفضيلة:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-semibold">
                {selectedSticker.practicalExercise}
              </p>
            </div>

            {/* Sticker Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800 text-xs relative z-10">
              <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>يتجدد الاستكر تلقائياً بعد:</span>
                <span className="text-amber-300 font-bold">{formatRemainingTime(timeRemainingMs)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDrawNewSticker}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>سحب استكر آخر بالقرعة</span>
                </button>

                <button
                  onClick={handleCopySticker}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>مشاركة وبطاقة الاستكر</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition cursor-pointer"
                  title="طباعة الاستكر"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SAINTS STICKER ALBUM */}
      {/* ========================================================================= */}
      {activeTab === 'album' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="p-5 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-md">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-950 border border-stone-800">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن قديس، كنيسة، أو فضيلة (تواضع، صلاة، محبة، سلام، تجرد)..."
                className="w-full bg-transparent text-stone-100 text-xs sm:text-sm outline-none placeholder:text-stone-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-200 text-xs font-bold"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Tradition Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
              <span className="text-stone-400 text-[11px] shrink-0 ml-1">التقليد الكنسي:</span>
              {[
                { id: 'all', label: 'الكل (١٨+)' },
                { id: 'east', label: 'الشرق الأرثوذكسي' },
                { id: 'west', label: 'الغرب والكنائس اللاتينية' },
                { id: 'celtic', label: 'التراث السلتي' },
                { id: 'syrian_armenian', label: 'السرياني والأرمني' },
                { id: 'universal', label: 'التراث الروحي الجامع' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    soundManager.playTick();
                    setTraditionFilter(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
                    traditionFilter === f.id
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Virtue Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none pt-1">
              <span className="text-stone-400 text-[11px] shrink-0 ml-1">نوع الفضيلة:</span>
              {[
                { id: 'all', label: 'كل الفضائل' },
                { id: 'humility', label: 'الاتضاع' },
                { id: 'prayer', label: 'الصلاة والمخدع' },
                { id: 'love', label: 'المحبة والبذل' },
                { id: 'peace', label: 'السلام والسكينة' },
                { id: 'faith', label: 'الإيمان والصبر' },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    soundManager.playTick();
                    setVirtueFilter(v.id);
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] transition shrink-0 cursor-pointer ${
                    virtueFilter === v.id
                      ? 'bg-amber-700 text-white shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stickers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAlbum.map((sticker) => (
              <SaintStickerAlbumCard
                key={sticker.id}
                sticker={sticker}
                isSelected={selectedSticker.id === sticker.id}
                onSelect={handleSelectFromAlbum}
              />
            ))}
          </div>
        </div>
      )}

      {/* Copy Alert */}
      {copiedNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-amber-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>تم نسخ استكر وبركة قديس اليوم بنجاح للمشاركة!</span>
        </div>
      )}
    </div>
  );

  if (isFullView) {
    return <div className="max-w-5xl mx-auto pb-16">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/70 shadow-2xl text-stone-100 max-h-[92vh] overflow-y-auto">
        {content}
      </div>
    </div>
  );
};
