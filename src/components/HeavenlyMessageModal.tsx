import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Heart,
  Share2,
  Copy,
  Volume2,
  VolumeX,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Search,
  BookOpen,
  Calendar,
  Layers,
  Flame,
  Check,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { User } from '../types';
import {
  HeavenlyMessage,
  HEAVENLY_MESSAGES,
  searchHeavenlyMessages,
} from '../data/heavenlyMessages';
import {
  getOrRefreshDailyMessage,
  getFreshLuckyMessage,
  getEligibleHeavenlyMessages,
  formatRemainingTime,
  getFreshStats,
  isMessageSeenInLast24Hours,
  recordMessageSeen,
} from '../utils/heavenlyHistory';
import { soundManager } from '../utils/audio';

interface HeavenlyMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  initialCategory?: string;
}

export const HeavenlyMessageModal: React.FC<HeavenlyMessageModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'daily' | 'favorites' | 'browse'>('daily');
  const [dailyInfo, setDailyInfo] = useState(() => getOrRefreshDailyMessage(false));
  const [currentMessage, setCurrentMessage] = useState<HeavenlyMessage>(() => {
    return getOrRefreshDailyMessage(false).message;
  });
  const [freshStats, setFreshStats] = useState(() => getFreshStats());
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [isDrawing, setIsDrawing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mokarasa_fav_heavenly_messages');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync daily message and non-repeating stats when modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      const daily = getOrRefreshDailyMessage(false);
      setDailyInfo(daily);
      setFreshStats(getFreshStats());
      if (activeTab === 'daily') {
        setCurrentMessage(daily.message);
      }
    }
  }, [isOpen, activeTab]);

  // Periodic remaining time update (every minute)
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setDailyInfo((prev) => {
        const currentDaily = getOrRefreshDailyMessage(false);
        return currentDaily;
      });
      setFreshStats(getFreshStats());
    }, 60000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Save favorites helper
  const toggleFavorite = (id: string) => {
    soundManager.playTick();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('mokarasa_fav_heavenly_messages', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // 24-Hour Non-Repeating: Draw a fresh lucky message
  const handleLuckyDraw = (categoryFilter?: string) => {
    if (isDrawing) return;
    setIsDrawing(true);
    soundManager.playTick();

    const cat = categoryFilter || selectedCategory;
    let flickerCount = 0;
    const interval = setInterval(() => {
      flickerCount++;
      const eligible = getEligibleHeavenlyMessages(cat, currentMessage.id);
      const randomIdx = Math.floor(Math.random() * eligible.length);
      setCurrentMessage(eligible[randomIdx] || HEAVENLY_MESSAGES[0]);
      if (flickerCount >= 6) {
        clearInterval(interval);
        // Guaranteed fresh message not seen in last 24h
        const finalMsg = getFreshLuckyMessage(cat, currentMessage.id);
        setCurrentMessage(finalMsg);
        setFreshStats(getFreshStats());
        setIsDrawing(false);
        soundManager.playCorrect();
      }
    }, 70);
  };

  // 24-Hour Non-Repeating: Request a brand new daily message
  const handleGetNewDailyMessage = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    soundManager.playTick();

    let flickerCount = 0;
    const interval = setInterval(() => {
      flickerCount++;
      const eligible = getEligibleHeavenlyMessages();
      const randomIdx = Math.floor(Math.random() * eligible.length);
      setCurrentMessage(eligible[randomIdx] || HEAVENLY_MESSAGES[0]);
      if (flickerCount >= 6) {
        clearInterval(interval);
        // Force new daily message that has not appeared in last 24h
        const freshDaily = getOrRefreshDailyMessage(true);
        setCurrentMessage(freshDaily.message);
        setDailyInfo(freshDaily);
        setFreshStats(getFreshStats());
        setIsDrawing(false);
        soundManager.playVictory();
      }
    }, 70);
  };

  // Copy message to clipboard
  const handleCopyMessage = async () => {
    const textToCopy = `🕊️ «رسالة من أبيك السماوي» 🕊️\n\n${currentMessage.salutation}\n\n${currentMessage.message}\n\n📖 الآية الشاهدة:\n${currentMessage.verse}\n(${currentMessage.verseRef})\n\n💡 تأمل لقلبك:\n${currentMessage.reflection}\n\n✝️ مشروع «حسب قلب الله»`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        soundManager.playTick();
        setTimeout(() => setCopied(false), 2200);
      } catch (err: any) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  // Share via WhatsApp or Web Share
  const handleShare = async () => {
    const shareText = `🕊️ رسالة من أبيك السماوي اليوم:\n\n«${currentMessage.message}»\n\n📖 ${currentMessage.verse} (${currentMessage.verseRef})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'رسالة من أبيك السماوي',
          text: shareText,
        });
      } catch (err: any) {
        // If user cancelled (AbortError), do not treat as error or trigger automatic copy.
        if (err.name !== 'AbortError') {
          console.error('Web share failed:', err);
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
            '_blank'
          );
        }
      }
    } else {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        '_blank'
      );
    }
  };

  // Read message aloud using speech synthesis
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${currentMessage.salutation}. ${currentMessage.message}. الشاهد من الكتاب المقدس: ${currentMessage.verse}. ${currentMessage.verseRef}. تأمل اليوم: ${currentMessage.reflection}.`
    );
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking when closed
  useEffect(() => {
    if (!isOpen && isSpeaking) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen, isSpeaking]);

  const categories = [
    { id: 'all', label: 'كل الرسائل (قرعة شاملة)', icon: '✨' },
    { id: 'comfort', label: 'طمأنينة وسلام', icon: '🕊️' },
    { id: 'love', label: 'محبة وقبول أبوي', icon: '❤️' },
    { id: 'strength', label: 'قوة وتجديد عزم', icon: '⚡' },
    { id: 'rest', label: 'راحة وشفاء القلب', icon: '🌿' },
    { id: 'guidance', label: 'إرشاد وحكمة', icon: '🧭' },
    { id: 'hope', label: 'رجاء وبداية جديدة', icon: '🌅' },
    { id: 'victory', label: 'نصرة ومجد أبدي', icon: '⚔️' },
    { id: 'protection', label: 'حماية ورعاية', icon: '🛡️' },
    { id: 'joy', label: 'فرح وتسبيح', icon: '🎉' },
    { id: 'forgiveness', label: 'مغفرة وتوبة', icon: '🤍' },
  ];

  // Favorite items list
  const favoriteMessages = useMemo(() => {
    return HEAVENLY_MESSAGES.filter((m) => favorites.includes(m.id));
  }, [favorites]);

  // Searched items list
  const filteredMessages = useMemo(() => {
    return searchHeavenlyMessages(searchQuery);
  }, [searchQuery]);

  const isCurrentFavorite = favorites.includes(currentMessage.id);
  const userName = currentUser ? currentUser.name.split(' ')[0] : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1c1917] via-[#171412] to-[#0c0a09] border border-amber-600/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-stone-100 text-right"
        dir="rtl"
      >
        {/* Top Decorative Header */}
        <div className="relative bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-500/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-xl">
              💌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-spiritual font-black text-lg sm:text-xl text-amber-200">
                  رسالة من أبيك السماوي
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  {HEAVENLY_MESSAGES.length}+ رسالة بركة
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {userName
                  ? `كلمة معزية وموجهة خصيصاً لقلبك يا ${userName}`
                  : 'كلمة معزية وموجهة خصيصاً لقلبك من فم الرب'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-3 bg-stone-950/60 border-b border-stone-800/80 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('daily');
              const daily = getOrRefreshDailyMessage(false);
              setDailyInfo(daily);
              setCurrentMessage(daily.message);
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>رسالة اليوم (تجديد كل 24 ساعة)</span>
          </button>

          <button
            onClick={() => setActiveTab('draw')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>سحب بالحظ (غير مكرر)</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>رسائلي المفضلة ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>أرشيف الرسائل</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto space-y-4">
          {/* TAB 1 & 2: LUCKY DRAW OR DAILY MESSAGE */}
          {(activeTab === 'draw' || activeTab === 'daily') && (
            <>
              {/* 24-Hour Non-Repeating Status Banner */}
              {activeTab === 'daily' && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs animate-fade-in">
                  <div className="flex items-center gap-2 text-amber-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-amber-300">حماية عدم التكرار (24 ساعة): </span>
                      <span className="text-stone-300">مضمون ألا تظهر لك هذه الرسالة مجدداً قبل انقضاء 24 ساعة.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold bg-stone-950/80 px-3 py-1.5 rounded-xl border border-amber-800/40 shrink-0 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>الوقت المتبقي: {formatRemainingTime(dailyInfo.timeRemainingMs)}</span>
                  </div>
                </div>
              )}

              {activeTab === 'draw' && (
                <div className="space-y-3">
                  <div className="bg-stone-900/80 border border-amber-600/30 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-stone-300">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>السحب يستبعد تلقائياً جميع الرسائل المعروضة في الـ 24 ساعة الماضية.</span>
                    </div>
                    <span className="text-amber-300 font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/40 shrink-0 text-[11px]">
                      {freshStats.freshCount} رسالة طازجة متوفرة
                    </span>
                  </div>

                  {/* Category pills for lucky draw */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-300/90 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        اختر حالة قلبك أو اتركها قرعة مباركة:
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {freshStats.freshCount} غير مكررة
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCategory(c.id);
                            handleLuckyDraw(c.id);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition flex items-center gap-1 cursor-pointer border ${
                            selectedCategory === c.id
                              ? 'bg-amber-500/20 text-amber-200 border-amber-400/50 shadow-xs'
                              : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800'
                          }`}
                        >
                          <span>{c.icon}</span>
                          <span>{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* The Blessed Heavenly Message Card */}
              <div
                className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#2a221b] via-[#1f1914] to-[#17130f] border-2 border-amber-500/40 shadow-2xl transition-all duration-300 overflow-hidden ${
                  isDrawing ? 'scale-[0.98] blur-[1px]' : 'scale-100 blur-0'
                }`}
              >
                {/* Spiritual Watermark & Background Glow */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-4 left-4 opacity-10 select-none text-6xl font-serif">
                  ✝️
                </div>

                {/* Card Header & Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    <span>{currentMessage.icon || '🕊️'}</span>
                    <span>{currentMessage.categoryLabel}</span>
                    <span className="text-[10px] text-emerald-400 font-mono border-r border-amber-500/30 pr-2">
                      ✓ فريدة لليوم
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Read Aloud Button */}
                    <button
                      onClick={handleToggleSpeech}
                      className={`p-2 rounded-xl transition cursor-pointer border ${
                        isSpeaking
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                      title={isSpeaking ? 'إيقاف القراءة' : 'استمع للرسالة بصوت هادئ'}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Bookmark / Favorite */}
                    <button
                      onClick={() => toggleFavorite(currentMessage.id)}
                      className={`p-2 rounded-xl transition cursor-pointer border ${
                        isCurrentFavorite
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                      title={isCurrentFavorite ? 'محفوظة في المفضلة' : 'حفظ في المفضلة'}
                    >
                      <Heart
                        className={`w-4 h-4 ${isCurrentFavorite ? 'fill-rose-400 text-rose-400' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Salutation */}
                <h4 className="text-sm font-bold text-amber-300/90 mb-3 tracking-wide flex items-center gap-1.5">
                  <span>🕊️</span>
                  <span>{currentMessage.salutation}</span>
                </h4>

                {/* Main Message Body */}
                <p className="text-base sm:text-lg text-amber-50 font-medium leading-relaxed sm:leading-loose mb-6">
                  {currentMessage.message}
                </p>

                {/* Bible Scripture Callout */}
                <div className="relative rounded-2xl bg-amber-950/40 border border-amber-500/30 p-4 sm:p-5 mb-5 shadow-inner">
                  <div className="text-amber-400/70 text-xs font-bold mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>كلمة الله الشاهدة:</span>
                  </div>
                  <p className="text-sm sm:text-base font-serif text-amber-100 font-semibold leading-relaxed mb-2">
                    {currentMessage.verse}
                  </p>
                  <div className="text-left text-xs font-bold text-amber-400">
                    — {currentMessage.verseRef}
                  </div>
                </div>

                {/* Daily Reflection */}
                <div className="bg-stone-900/60 rounded-xl p-3.5 border border-stone-800 text-xs text-stone-300 leading-normal">
                  <span className="font-bold text-amber-300 ml-1.5">💡 تأمل لقلبك اليوم:</span>
                  {currentMessage.reflection}
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-6 pt-4 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {activeTab === 'daily' ? (
                      /* Get New Daily Message Button (Guaranteed fresh, non-repeating) */
                      <button
                        onClick={handleGetNewDailyMessage}
                        disabled={isDrawing}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
                        title="الحصول على رسالة يومية جديدة مضمونة ألا تتكرر خلال 24 ساعة"
                      >
                        <RefreshCw className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
                        <span>{isDrawing ? 'جارٍ جلب رسالة جديدة...' : 'احصل على رسالة يومية جديدة (غير مكررة)'}</span>
                      </button>
                    ) : (
                      /* Lucky Draw Trigger */
                      <button
                        onClick={() => handleLuckyDraw()}
                        disabled={isDrawing}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center gap-2 transition cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <RotateCcw
                          className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`}
                        />
                        <span>{isDrawing ? 'جارٍ السحب...' : 'اسحب رسالة جديدة بالحظ'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={handleCopyMessage}
                      className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-stone-400" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>مشاركة</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <h4 className="font-bold text-sm text-amber-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <span>رسائلي المحفوظة في المخدع ({favoriteMessages.length})</span>
                </h4>
                {favoriteMessages.length > 0 && (
                  <span className="text-xs text-stone-400">
                    اضغط على أي رسالة لقراءتها بملء الشاشة
                  </span>
                )}
              </div>

              {favoriteMessages.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-stone-900/40 border border-stone-800/80">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 text-xl">
                    🤍
                  </div>
                  <h5 className="font-bold text-stone-200 text-sm mb-1">
                    لم تحفظ أي رسائل بعد
                  </h5>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
                    حين تسحب أي رسالة تلمس قلبك، اضغط على علامة القلب ❤️ لحفظها والرجوع إليها دائماً.
                  </p>
                  <button
                    onClick={() => setActiveTab('draw')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
                  >
                    اسحب رسالتك الأولى الآن
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {favoriteMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setCurrentMessage(msg);
                        setActiveTab('draw');
                      }}
                      className="p-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800/90 border border-amber-600/30 transition cursor-pointer text-right group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
                          {msg.categoryLabel}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(msg.id);
                          }}
                          className="p-1 rounded-md text-rose-400 hover:text-stone-400"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-400" />
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-stone-100 line-clamp-2 mb-1.5 group-hover:text-amber-200 transition">
                        «{msg.message}»
                      </p>
                      <div className="text-[11px] text-amber-300 font-serif">
                        {msg.verseRef}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BROWSE ALL MESSAGES */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بكلمة أو آية أو شاهد كتابي (مثل: سلام، لا تخف، راحة...)"
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>عرض {filteredMessages.length} رسالة مباركة</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-amber-400 hover:underline"
                  >
                    إلغاء البحث
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setCurrentMessage(msg);
                      setActiveTab('draw');
                    }}
                    className="p-3.5 rounded-2xl bg-stone-900/70 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-600/40 transition cursor-pointer text-right flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-amber-400 font-bold">
                          {msg.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isMessageSeenInLast24Hours(msg.id) ? (
                            <span className="text-[9px] text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/40">
                              شوهدت اليوم
                            </span>
                          ) : (
                            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              جديدة
                            </span>
                          )}
                          <span className="text-xs">{msg.icon || '🕊️'}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-stone-200 line-clamp-3 mb-2">
                        {msg.message}
                      </p>
                    </div>
                    <div className="text-[10px] text-amber-400 font-serif pt-2 border-t border-stone-800">
                      {msg.verseRef}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-stone-950 border-t border-stone-800/80 text-center text-[11px] text-stone-400 flex items-center justify-between px-5">
          <span>«كلمة الله حية وفعالة وأمضى من كل سيف ذي حدين»</span>
          <span className="text-amber-400/80">مشروع حسب قلب الله</span>
        </div>
      </div>
    </div>
  );
};
