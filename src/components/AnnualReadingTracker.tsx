import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Sparkles,
  Bookmark,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Compass,
  Layers,
  Edit3,
  Save,
  BarChart2,
  Grid,
  Info,
} from 'lucide-react';
import {
  PlanType,
  DailyBibleReading,
  DailyPatristicReading,
  ReadingProgressRecord,
  MONTHS_METADATA,
  ANNUAL_BIBLE_PLAN,
  ANNUAL_PATRISTICS_PLAN,
  getCurrentDayOfYear,
  getStoredReadingProgress,
  toggleReadingDayCompletion,
  saveReadingNote,
  getReadingBadges,
} from '../data/annualReadingPlan';

interface AnnualReadingTrackerProps {
  currentUser?: User | null;
  onOpenLogin?: () => void;
  compact?: boolean;
}

export const AnnualReadingTracker: React.FC<AnnualReadingTrackerProps> = ({
  currentUser,
  onOpenLogin,
  compact = false,
}) => {
  const [planType, setPlanType] = useState<PlanType>('bible');
  const todayDayOfYear = useMemo(() => getCurrentDayOfYear(), []);
  const [selectedDay, setSelectedDay] = useState<number>(todayDayOfYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    return Math.min(12, Math.max(1, new Date().getMonth() + 1));
  });
  const [viewMode, setViewMode] = useState<'today' | 'heatmap' | 'months' | 'badges'>('today');

  // Reading progress state
  const [progress, setProgress] = useState<ReadingProgressRecord>(() =>
    getStoredReadingProgress(planType, currentUser?.id)
  );

  // Note editing state for selected day
  const [noteText, setNoteText] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  // Sync progress when planType or user changes
  useEffect(() => {
    const p = getStoredReadingProgress(planType, currentUser?.id);
    setProgress(p);
  }, [planType, currentUser?.id]);

  // Sync note text when selectedDay changes
  useEffect(() => {
    setNoteText(progress.notes[selectedDay] || '');
    setNoteSaved(false);
  }, [selectedDay, progress.notes]);

  // Current reading item
  const currentBibleReading: DailyBibleReading = useMemo(() => {
    return ANNUAL_BIBLE_PLAN[selectedDay - 1] || ANNUAL_BIBLE_PLAN[0];
  }, [selectedDay]);

  const currentPatristicReading: DailyPatristicReading = useMemo(() => {
    return ANNUAL_PATRISTICS_PLAN[selectedDay - 1] || ANNUAL_PATRISTICS_PLAN[0];
  }, [selectedDay]);

  const isSelectedDayDone = progress.completedDays.includes(selectedDay);

  // Toggle completion
  const handleToggleCurrentDay = () => {
    const willBeDone = !isSelectedDayDone;
    if (willBeDone) {
      soundManager.playVictory();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      soundManager.playTick();
    }
    const updated = toggleReadingDayCompletion(planType, selectedDay, currentUser?.id);
    setProgress(updated);
  };

  // Save personal reflection note
  const handleSaveNote = () => {
    soundManager.playTick();
    const updated = saveReadingNote(planType, selectedDay, noteText, currentUser?.id);
    setProgress(updated);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  // Copy reading
  const handleCopyReading = async () => {
    soundManager.playTick();
    let text = '';
    if (planType === 'bible') {
      text = `📖 قراءة اليوم ${selectedDay} من خطة الكتاب المقدس السنوية:\n\n📜 العهد القديم: ${currentBibleReading.oldTestament}\n🕊️ المزامير والحكمة: ${currentBibleReading.psalms}\n✝️ العهد الجديد: ${currentBibleReading.newTestament}\n\n«${currentBibleReading.keyVerse}» (${currentBibleReading.keyVerseRef})\n\nمشروع «حسب قلب الله»`;
    } else {
      text = `🕯️ قراءة اليوم ${selectedDay} من خطة أقوال الآباء السنوية:\n\nالقديس: ${currentPatristicReading.father}\nالكتاب: ${currentPatristicReading.workTitle}\n\n«${currentPatristicReading.quote}»\n\nتأمل اليوم: ${currentPatristicReading.practicalReflection}\n\nمشروع «حسب قلب الله»`;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedQuote(true);
        setTimeout(() => setCopiedQuote(false), 2000);
      } catch (err: any) {
        console.error('Clipboard write failed:', err);
      }
    }
  };

  // Stats
  const totalCompleted = progress.completedDays.length;
  const percentage = Math.round((totalCompleted / 365) * 100);
  const badges = useMemo(
    () => getReadingBadges(totalCompleted, progress.currentStreak),
    [totalCompleted, progress.currentStreak]
  );
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Visual Header / Switcher */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-[#1c1813] to-amber-950 p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-black text-amber-200">
                متتبع خطة القراءة السنوية (٣٦٥ يوماً)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
              خطة منهجية مدروسة لمرافقة كلمة الله أو ذخائر كتابات الآباء على مدار السنة كاملة مع تتبع بصري يومي وأسبوعي وشهري لنسبة الإنجاز.
            </p>

            {/* Plan Switcher Pills */}
            <div className="inline-flex p-1 rounded-2xl bg-stone-950/90 border border-stone-800 gap-1.5 mt-2">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setPlanType('bible');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  planType === 'bible'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>الكتاب المقدس في عام</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTick();
                  setPlanType('patristics');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  planType === 'patristics'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>ذخائر الآباء السنوية</span>
              </button>
            </div>
          </div>

          {/* Radial Circular Progress Gauge */}
          <div className="flex items-center gap-5 bg-stone-950/80 p-4 rounded-3xl border border-amber-600/30 shadow-lg">
            {/* SVG Circular Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-stone-800"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - totalCompleted / 365)}
                  strokeLinecap="round"
                  className="text-amber-500 transition-all duration-700 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-black text-amber-200 font-mono">{percentage}%</span>
                <span className="text-[9px] text-stone-400 font-bold">مكتمل</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-1.5 text-xs text-right">
              <div>
                <span className="text-stone-400 block text-[11px]">الأيام المنجزة:</span>
                <span className="text-amber-300 font-bold font-mono text-base">
                  {totalCompleted} <span className="text-xs text-stone-400 font-normal">من 365</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold pt-1 border-t border-stone-800">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>السلسلة الحالية: {progress.currentStreak} يوم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Sub-navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-900/90 rounded-2xl border border-stone-800 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => {
            soundManager.playTick();
            setViewMode('today');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            viewMode === 'today'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>قراءة اليوم ومخدعي</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setViewMode('heatmap');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            viewMode === 'heatmap'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>خريطة الإنجاز السنوية (Heatmap)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setViewMode('months');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            viewMode === 'months'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>شهور الخطة السنوية (١٢ شهراً)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setViewMode('badges');
          }}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
            viewMode === 'badges'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>أوسمة الأمانة ({unlockedBadgesCount} / {badges.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TODAY'S READING VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'today' && (
        <div className="space-y-6">
          {/* Day Navigator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setSelectedDay((prev) => Math.max(1, prev - 1));
                }}
                disabled={selectedDay <= 1}
                className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 disabled:opacity-30 cursor-pointer"
                title="اليوم السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 font-bold flex items-center gap-2">
                <span>اليوم {selectedDay} من 365</span>
                {selectedDay === todayDayOfYear && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    اليوم الحالي
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  soundManager.playTick();
                  setSelectedDay((prev) => Math.min(365, prev + 1));
                }}
                disabled={selectedDay >= 365}
                className="p-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 disabled:opacity-30 cursor-pointer"
                title="اليوم التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Quick jump to today */}
            {selectedDay !== todayDayOfYear && (
              <button
                onClick={() => {
                  soundManager.playTick();
                  setSelectedDay(todayDayOfYear);
                }}
                className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>الرجوع ليوم اليوم ({todayDayOfYear})</span>
              </button>
            )}
          </div>

          {/* Reading Card for the Day */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1f1a14] via-stone-900 to-stone-950 border-2 border-amber-500/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold block mb-1">
                  {planType === 'bible'
                    ? currentBibleReading.monthName
                    : `${currentPatristicReading.monthName} · ${currentPatristicReading.copticEra}`}
                </span>
                <h3 className="font-spiritual text-lg sm:text-xl font-bold text-stone-100">
                  {planType === 'bible'
                    ? currentBibleReading.title
                    : `${currentPatristicReading.father}: ${currentPatristicReading.workTitle}`}
                </h3>
              </div>

              {/* Completion Toggle Button */}
              <button
                onClick={handleToggleCurrentDay}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0 ${
                  isSelectedDayDone
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white shadow-amber-900/30'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSelectedDayDone ? 'أتممت قراءة اليوم بنعمة الله ✓' : 'تحديد قراءة اليوم كمكتملة'}</span>
              </button>
            </div>

            {/* Content for Bible vs Patristics */}
            {planType === 'bible' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Old Testament */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>العهد القديم:</span>
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-stone-100 font-serif">
                    {currentBibleReading.oldTestament}
                  </p>
                  <span className="text-[11px] text-stone-400 block">أسفار التاريخ والشريعة</span>
                </div>

                {/* Psalms & Wisdom */}
                <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-600/30 space-y-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>المزامير والحكمة:</span>
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-amber-100 font-serif">
                    {currentBibleReading.psalms}
                  </p>
                  <span className="text-[11px] text-amber-400/80 block">صلوات داود وحكمة سليمان</span>
                </div>

                {/* New Testament */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4" />
                    <span>العهد الجديد:</span>
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-stone-100 font-serif">
                    {currentBibleReading.newTestament}
                  </p>
                  <span className="text-[11px] text-stone-400 block">الأناجيل والرسائل وسفر الرؤيا</span>
                </div>
              </div>
            ) : (
              /* Patristic Daily Reading */
              <div className="space-y-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                    <span>موضوع التأمل: {currentPatristicReading.topic}</span>
                    <span>{currentPatristicReading.father}</span>
                  </div>
                  <p className="text-sm sm:text-base font-spiritual text-amber-100 leading-relaxed italic">
                    {currentPatristicReading.quote}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs text-stone-300 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">💡 التطبيق الروحي لليوم:</span>
                  {currentPatristicReading.practicalReflection}
                </div>
              </div>
            )}

            {/* Reflection Note & Toolbar */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تأملاتي وملاحظاتي في مخدع القراءة لليوم:</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReading}
                    className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs flex items-center gap-1 cursor-pointer"
                    title="نسخ قراءة اليوم"
                  >
                    {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuote ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="ما هي الآية أو الرسالة التي لمست قلبك في قراءة اليوم؟ اكتبها هنا لترجع إليها دائماً..."
                rows={2}
                className="w-full p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  {noteSaved ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم حفظ التأمل</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                      <span>حفظ التأمل في سجلي</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. YEAR HEATMAP GRID VIEW (52 WEEKS x 7 DAYS) */}
      {/* ========================================================================= */}
      {viewMode === 'heatmap' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-spiritual font-bold text-base sm:text-lg text-amber-200">
                خريطة الإنجاز السنوية الكاملة (٣٦٥ يوماً)
              </h3>
              <p className="text-xs text-stone-400">
                كل مربع يمثل يوماً من أيام السنة. المربعات الخضراء تمثل الأيام المكتملة. اضغط على أي مربع للانتقال لقراءته.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-stone-950 border border-stone-800" />
                <span>غير مكتمل</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 shadow-xs" />
                <span>مكتمل</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded border-2 border-amber-400 bg-amber-500/30" />
                <span>اليوم الحالي</span>
              </span>
            </div>
          </div>

          {/* 365 Days Grid */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px] p-2 bg-stone-950 rounded-2xl border border-stone-800">
              {Array.from({ length: 365 }, (_, i) => i + 1).map((day) => {
                const isDone = progress.completedDays.includes(day);
                const isToday = day === todayDayOfYear;
                const isCurrentSelected = day === selectedDay;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedDay(day);
                      setViewMode('today');
                    }}
                    title={`اليوم ${day}: ${isDone ? 'مكتمل' : 'غير مكتمل'}`}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 hover:bg-emerald-400 shadow-xs shadow-emerald-500/20'
                        : isToday
                        ? 'bg-amber-500/40 border border-amber-400 animate-pulse'
                        : 'bg-stone-900 border border-stone-800/80 hover:bg-stone-800'
                    } ${isCurrentSelected ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-950' : ''}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
            <span>إجمالي أيام السنة: 365 يوماً مقسمة على 52 أسبوعاً</span>
            <span className="text-amber-400 font-bold">
              نسبة التقدم الكلية: {percentage}% ({totalCompleted} / 365)
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MONTHLY PROGRESS BARS (12 MONTHS) */}
      {/* ========================================================================= */}
      {viewMode === 'months' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300">
            متابعة دقيقة لكل شهر من شهور السنة مع بيان عدد الأيام المنجزة ونسبة كل شهر:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MONTHS_METADATA.map((m) => {
              // Calculate start day and end day for this month
              let startDay = 1;
              for (let i = 0; i < m.month - 1; i++) {
                startDay += MONTHS_METADATA[i].days;
              }
              const endDay = startDay + m.days - 1;

              // Count completed days in this month
              const monthDone = progress.completedDays.filter(
                (d) => d >= startDay && d <= endDay
              ).length;
              const monthPct = Math.round((monthDone / m.days) * 100);

              return (
                <div
                  key={m.month}
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedDay(startDay);
                    setViewMode('today');
                  }}
                  className="p-5 rounded-2xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-600/40 transition cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">
                      شهر {m.month}: {m.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {monthDone} / {m.days}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-400 line-clamp-1">{m.theme}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${monthPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{monthPct}% مكتمل</span>
                    <span className="text-amber-400 hover:underline">عرض قراءات الشهر ←</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CONSECRATION MILESTONES & BADGES */}
      {/* ========================================================================= */}
      {viewMode === 'badges' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
            <span>أوسمة وتتويجات الأمانة في القراءة السنوية لنفس المكرس والخادم الأمين:</span>
            <span className="text-amber-400 font-bold">{unlockedBadgesCount} أوسمة مكتسبة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  b.unlocked
                    ? 'bg-gradient-to-b from-amber-950/40 to-stone-900 border-amber-500/50 shadow-lg'
                    : 'bg-stone-900/40 border-stone-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{b.icon}</span>
                  {b.unlocked ? (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600">
                      مكتسب بنعمة الله ✓
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 font-bold">
                      متبقي {Math.max(0, b.requiredDays - totalCompleted)} يوم
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-spiritual font-bold text-sm text-stone-100">{b.title}</h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{b.description}</p>
                </div>

                <div className="text-[10px] text-amber-400 font-mono">
                  المطلوب: {b.requiredDays} يوماً
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
