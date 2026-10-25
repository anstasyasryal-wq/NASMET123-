import React, { useState, useMemo, useCallback } from 'react';
import { User, Stage, Announcement } from '../types';
import { soundManager } from '../utils/audio';
import { AUTHENTIC_COPTIC_BOOKS, BookItem } from '../data/authenticCopticBooks';
import { getOrRefreshDailyMessage } from '../utils/heavenlyHistory';
import { FortuneWheel, WheelSection } from './FortuneWheel';
import { ConsecrationTree } from './ConsecrationTree';
import {
  Compass,
  BookOpen,
  Heart,
  Trophy,
  Sparkles,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  Search,
  Shield,
  Layers,
  Flame,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Gamepad2,
  Brain,
} from 'lucide-react';

interface BookProgress {
  chapterIdx: number;
  scrollTop: number;
  lastReadAt: string;
}

const READ_STORAGE_KEY = 'mokarasa_library_read_books_v2';

interface HomeViewProps {
  currentUser: User | null;
  stages: Stage[];
  announcements: Announcement[];
  onStartStage: (stageId: number) => void;
  onOpenLogin: () => void;
  onOpenMyRank: () => void;
  onOpenRules: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToDioceses: () => void;
  onNavigateToSupervisor: () => void;
  onNavigateToParticipants: () => void;
  onNavigateToCompetitions: () => void;
  onOpenSpiritualGuide: () => void;
  onNavigateToSpiritualLife?: () => void;
  onNavigateToBiblicalStudy?: () => void;
  onNavigateToPersonalSpace?: () => void;
  onNavigateToLibrary?: () => void;
  onNavigateToWorkshops?: () => void;
  onNavigateToCreativeLab?: () => void;
  onNavigateToStudyTools?: () => void;
  onNavigateToMonasticOasis?: () => void;
  onOpenEmergencyModal?: (situation: 'distress' | 'boredom' | 'lukewarmness' | 'anger') => void;
  onNavigateToSpiritualGames?: () => void;
  onOpenHeavenlyMessage?: () => void;
  onOpenSpiritualJournal?: () => void;
  onOpenIconGallery?: () => void;
  onOpenSaintsGallery?: () => void;
  onNavigateToSpiritualFather?: () => void;
  onNavigateToConsecratedManual?: () => void;
  onOpenSaintsStickers?: () => void;
  onNavigateToPrayerFortress?: () => void;
  onOpenRetreat?: () => void;
  onNavigateToMonasticPuzzle?: () => void;
  onOpenDirectory?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = React.memo(({
  currentUser,
  stages,
  announcements,
  onStartStage,
  onOpenLogin,
  onOpenMyRank,
  onOpenRules,
  onNavigateToLeaderboard,
  onNavigateToDioceses,
  onNavigateToSupervisor,
  onNavigateToParticipants,
  onNavigateToCompetitions,
  onOpenSpiritualGuide,
  onNavigateToSpiritualLife,
  onNavigateToBiblicalStudy,
  onNavigateToPersonalSpace,
  onNavigateToLibrary,
  onNavigateToWorkshops,
  onNavigateToCreativeLab,
  onNavigateToStudyTools,
  onNavigateToMonasticOasis,
  onOpenEmergencyModal,
  onNavigateToSpiritualGames,
  onOpenHeavenlyMessage,
  onOpenSpiritualJournal,
  onOpenIconGallery,
  onOpenSaintsGallery,
  onNavigateToSpiritualFather,
  onNavigateToConsecratedManual,
  onOpenSaintsStickers,
  onNavigateToPrayerFortress,
  onOpenRetreat,
  onNavigateToMonasticPuzzle,
  onOpenDirectory,
}) => {
  const [showExtendedExploration, setShowExtendedExploration] = useState(false);
  const [selectedSection, setSelectedSection] = useState<WheelSection | null>(null);
  const [dailyRecord] = useState(() => getOrRefreshDailyMessage(false));
  const dailyMsg = dailyRecord.message;

  // Retrieve last reading progress from storage
  const lastActiveReading = useMemo(() => {
    try {
      if (typeof window === 'undefined') return null;
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const progressMap: Record<string, BookProgress> =
        parsed && typeof parsed === 'object' && parsed.progress ? parsed.progress : {};

      let bestBook: { book: BookItem; progress: BookProgress } | null = null;
      let latestTime = 0;

      for (const book of AUTHENTIC_COPTIC_BOOKS) {
        if (!book) continue;
        const prog = progressMap[book.id];
        if (prog && prog.lastReadAt) {
          const t = new Date(prog.lastReadAt).getTime();
          if (t > latestTime) {
            latestTime = t;
            bestBook = { book, progress: prog };
          }
        }
      }
      return bestBook;
    } catch {
      return null;
    }
  }, []);

  // Current stage info for resume
  const nextStage = useMemo(() => {
    if (!currentUser) return stages[0] || null;
    const currentId = currentUser.currentStageId || 1;
    return stages.find((s) => s.id === currentId) || stages[0] || null;
  }, [currentUser, stages]);

  const handleSelectSection = useCallback((sec: WheelSection) => {
    setSelectedSection(sec);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedSection(null);
  }, []);

  const wheelSections: WheelSection[] = useMemo(
    () => [
      {
        id: 'competitions',
        name: 'المسابقة الرسمية ومراحل التقييم',
        shortName: 'المسابقات الرسمية',
        line1: 'المسابقات',
        line2: 'الرسمية',
        icon: '🏆',
        color: '#9a6700',
        badge: 'المسابقة الكبرى',
        description: 'ست مراحل إلكترونية متدرجة مع بنك أسئلة مركزي وتصنيف لحظي وتتويج شرفي.',
        verse: 'كُلُّ مَنْ يُجَاهِدُ يَضْبُطُ نَفْسَهُ فِي كُلِّ شَيْءٍ.',
        verseRef: '1 كورنثوس 9: 25',
        patristicQuote: 'إن الجهاد الروحي لا يُقاس بكثرة المجهود الظاهر، بل بنقاوة القلب والأمانة لله.',
        patristicSaint: 'القديس أنطونيوس الكبير',
        onOpen: () => onNavigateToCompetitions(),
        items: [],
      },
      {
        id: 'spiritual_life',
        name: 'الحياة الروحية وصلاة المخدع',
        shortName: 'الحياة الروحية',
        line1: 'الحياة',
        line2: 'الروحية',
        icon: '☀️',
        color: '#047857',
        badge: 'خطة سنوية ومخدع',
        description: 'خطة قراءة الكتاب المقدس والآباء السنوية، مخدع الصلاة، ومسبحة صلاة يسوع.',
        verse: 'وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ.',
        verseRef: 'متى 6: 6',
        patristicQuote: 'الصلاة هي نسيم الروح وتنفس الحياة الأبدية.',
        patristicSaint: 'القديس يوحنا ذهبي الفم',
        onOpen: () => onNavigateToSpiritualLife?.(),
        items: [],
      },
      {
        id: 'library',
        name: 'مكتبة الكتب ومراجع الآباء',
        shortName: 'المكتبة المعرفية',
        line1: 'المكتبة',
        line2: 'المعرفية',
        icon: '📚',
        color: '#78350f',
        badge: '36 كتاباً كاملاً',
        description: 'مكتبة رقمية متكاملة للكتب والوثائق الكنسية، ومعرض الأيقونات وسير القديسين.',
        verse: 'إِلَى أَنْ أَجِيءَ اعْكُفْ عَلَى الْقِرَاءَةِ وَالْوَعْظِ وَالتَّعْلِيمِ.',
        verseRef: '1 تيموثاوس 4: 13',
        patristicQuote: 'اجعل من أقوال الآباء مصباحاً لخطواتك في هذا العالم.',
        patristicSaint: 'مار إسحق السرياني',
        onOpen: () => onNavigateToLibrary?.(),
        items: [],
      },
      {
        id: 'monastic_oasis',
        name: 'دستور التكريس وواحة السكون الروحي',
        shortName: 'دستور التكريس',
        line1: 'دستور',
        line2: 'التكريس',
        icon: '🕯️',
        color: '#b45309',
        badge: 'مشغل ألحان',
        description: 'ركائز المكرس الـ 7، مشغل ألحان هادئة، ميزان فحص الضمير، وميثاق تجديد النذر.',
        verse: 'فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ.',
        verseRef: 'إشعياء 30: 15',
        patristicQuote: 'الهدوء والسكون هما مبدأ نقاوة النفس.',
        patristicSaint: 'القديس باسيليوس الكبير',
        onOpen: () => onNavigateToMonasticOasis?.(),
        items: [],
      },
    ],
    [
      onNavigateToCompetitions,
      onNavigateToSpiritualLife,
      onNavigateToLibrary,
      onNavigateToMonasticOasis,
    ]
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-right font-sans" dir="rtl">
      {/* 1. Calm Spiritual Header & Greeting */}
      <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900 border border-amber-600/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner shrink-0">
                ✝️
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-400 tracking-wider font-mono">
                  تطبيق «حسب قلب الله»
                </span>
                <h1 className="font-spiritual text-xl sm:text-2xl font-black text-amber-100">
                  {currentUser
                    ? `سلام ونعمة يا ${currentUser.vocation || 'مبارك'} ${currentUser.name}`
                    : 'سلام لك ونعمة في المسيح يسوع'}
                </h1>
              </div>
            </div>

            {/* Quick Directory Button */}
            <button
              onClick={() => {
                soundManager.playTick();
                if (onOpenDirectory) onOpenDirectory();
              }}
              className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/50 text-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>الدليل الشامل والبحث 🧭</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-spiritual max-w-2xl">
            مساحتك الروحية اليومية الهادئة: قراءات الآباء، صلاة المخدع، التقييم الروحي، ومسابقات التكريس في ضوء كلمة الله.
          </p>

          {/* Gentle Suggestion of the Day (غير إلزامي) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>همسة اليوم الروحية</span>
              </span>
              <p className="text-xs text-amber-100 font-medium italic">
                «فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ» (إشعياء 30: 15)
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playTick();
                onOpenSpiritualGuide();
              }}
              className="text-xs text-amber-300 hover:text-white font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              <span>تأمل مع المرشد الروحي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Three Prominent Required Cards (Heavenly Message, Growth Tree, Consecrated Constitution) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. رسالة من أبوك السماوي */}
        <div
          onClick={() => {
            soundManager.playTick();
            if (onOpenHeavenlyMessage) onOpenHeavenlyMessage();
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/70 via-stone-900 to-amber-950/50 border-2 border-amber-500/40 hover:border-amber-400 transition cursor-pointer shadow-xl flex flex-col justify-between gap-4 group relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <span>🕊️</span>
                <span>رسالة من أبوك السماوي</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">رسالة اليوم</span>
            </div>
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-amber-100">
              {dailyMsg.salutation}
            </h3>
            <p className="text-xs text-stone-200 line-clamp-3 leading-relaxed font-medium">
              «{dailyMsg.message}»
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-900/40 text-[11px] text-amber-300 font-bold relative z-10">
            <span className="font-serif">{dailyMsg.verseRef}</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>اقرأ بالتفصيل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 2. شجرة النمو الروحي */}
        <div
          onClick={() => {
            soundManager.playTick();
            if (onNavigateToConsecratedManual) onNavigateToConsecratedManual();
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-stone-900 to-stone-950 border border-emerald-600/40 hover:border-emerald-400 transition cursor-pointer shadow-xl flex flex-col justify-between gap-4 group relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-600/40 flex items-center gap-1">
                <span>🌳</span>
                <span>شجرة النمو الروحي</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {currentUser ? `${currentUser.totalScore || 0} نقطة` : 'مستوى البداية'}
              </span>
            </div>
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-emerald-100">
              مسيرة النضج والجهاد الروحي
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              تتبع نموك الروحي، فضائلك، ومستواك في طريق التكريس والثبات في المسيح.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-[11px] text-emerald-300 font-bold relative z-10">
            <span>🌿 إثمار روحي متجدد</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>استعرض الشجرة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* 3. دستور حياة المكرس */}
        <div
          onClick={() => {
            soundManager.playTick();
            if (onNavigateToConsecratedManual) onNavigateToConsecratedManual();
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950/50 to-stone-950 border border-amber-600/40 hover:border-amber-400 transition cursor-pointer shadow-xl flex flex-col justify-between gap-4 group relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40 flex items-center gap-1">
                <span>📜</span>
                <span>دستور حياة المكرس</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">المرجع الأساسي</span>
            </div>
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-amber-100">
              مبادئ الحياة مع الله
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              تذكير يومي بهدف التكريس ومبادئ الحياة الروحية والجهاد النسكي في الكنيسة.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-900/40 text-[11px] text-amber-300 font-bold relative z-10">
            <span>⚖️ معايير التكريس</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>فتح الدستور</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* 2. Primary Action / Resume Previous Activity Card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Card: Resume Last Book Reading or Start Library */}
        {lastActiveReading ? (
          <div className="p-5 rounded-3xl bg-stone-900 border border-amber-600/40 hover:border-amber-400 transition shadow-lg flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-600/30 flex items-center gap-1">
                  <Bookmark className="w-3 h-3" />
                  <span>متابعة آخر قراءة</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  الفصل {(lastActiveReading.progress.chapterIdx || 0) + 1} من {lastActiveReading.book.chapters?.length || 1}
                </span>
              </div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 truncate">
                {lastActiveReading.book.title}
              </h3>
              <p className="text-xs text-stone-400 line-clamp-1">
                بقلم: {lastActiveReading.book.author}
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playTick();
                onNavigateToLibrary?.();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>استئناف القراءة من موضعك 📖</span>
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition shadow-lg flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                  المكتبة والآباء
                </span>
                <span className="text-[11px] text-stone-400 font-mono">36 كتاباً كاملاً</span>
              </div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                مكتبة الآباء والكتب الموثقة
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                اقرأ نصوص الآباء الرسوليين الكاملة: الديداخي، رسائل إغناطيوس، وبوليكاربوس، وبستان الرهبان.
              </p>
            </div>

            <button
              onClick={() => {
                soundManager.playTick();
                onNavigateToLibrary?.();
              }}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 hover:text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-stone-700"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>فتح المكتبة الكنسية 📚</span>
            </button>
          </div>
        )}

        {/* Right Card: Next Step in Official Competition or Prayer */}
        <div className="p-5 rounded-3xl bg-stone-900 border border-amber-600/40 hover:border-amber-400 transition shadow-lg flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                المسابقات والمراحل
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {currentUser ? `النقاط: ${currentUser.totalScore} نقطة` : '6 مراحل إلكترونية'}
              </span>
            </div>
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
              {nextStage ? nextStage.title : 'المسابقة الكبرى للتكريس'}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
              {nextStage ? nextStage.subtitle : 'اختبر معلوماتك في العقيدة، الكتاب المقدس، والآبائيات.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playTick();
                if (nextStage) {
                  onStartStage(nextStage.id);
                } else {
                  onNavigateToCompetitions();
                }
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Trophy className="w-4 h-4" />
              <span>{currentUser ? 'متابعة المرحلة التالية 🏆' : 'بدء المسابقة الرسمية 🏆'}</span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                onNavigateToLeaderboard();
              }}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition cursor-pointer"
              title="لوحة الصدارة"
            >
              🥇
            </button>
          </div>
        </div>
      </section>

      {/* 3. Dedicated Spiritual Guide Banner (المرشد الروحي) */}
      <section
        onClick={() => {
          soundManager.playTick();
          onOpenSpiritualGuide();
        }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-stone-900 to-stone-950 border border-cyan-500/40 hover:border-cyan-400 transition cursor-pointer shadow-lg group relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-3xl group-hover:scale-105 transition shadow-inner shrink-0">
              🕊️
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-300 font-mono tracking-wider">
                رفيقك للتأمل والمشورة
              </span>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-cyan-100">
                المرشد الروحي والتأمل الآبائي
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                هل تشعر بالحيرة أو الفتور أو ترغب في إجابة لاهوتية آبائية؟ اطرح سؤالك واستنر بأقوال الكنيسة.
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-black text-xs transition shrink-0 flex items-center gap-1.5 shadow-md">
            <span>ابدأ الحوار الآن</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. The 4 Main Pillars Grid (الأعمدة الأساسية الميسرة) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
            أبواب التطبيق الرئيسية
          </h2>
          <button
            onClick={() => {
              soundManager.playTick();
              if (onOpenDirectory) onOpenDirectory();
            }}
            className="text-xs text-amber-400 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>عرض الدليل الكامل (24+ قسماً)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: Library */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToLibrary?.();
            }}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 text-right shadow-md"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-amber-900/40 border border-amber-600/30 flex items-center justify-center text-amber-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-amber-300">
                المكتبة والمراجع
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                36 كتاباً كاملاً وتفاسير العهدين وأقوال الآباء.
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <span>تصفح الكتب</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Pillar 2: Spiritual Journey */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToSpiritualLife?.();
            }}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-rose-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 text-right shadow-md"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-rose-900/40 border border-rose-600/30 flex items-center justify-center text-rose-300">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-rose-300">
                رحلتي الروحية
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                صلاة المخدع، مسبحة يسوع، وإعداد الاعتراف.
              </p>
            </div>
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
              <span>ادخل المخدع</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Pillar 3: Prayer Fortress */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToPrayerFortress?.();
            }}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 text-right shadow-md"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-emerald-300">
                حصن الصلاة اليومي
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                مزامير الأجبية الساعية والصلوات الموجهة.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span>افتح الحصن</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Pillar 4: Games & Monastic Puzzle */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToMonasticPuzzle?.();
            }}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-purple-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 text-right shadow-md"
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-600/30 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-purple-300">
                ألعاب وبازل الصعود
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                بازل الصعود الرهباني، فوازير البستان وتحديات البرية.
              </p>
            </div>
            <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
              <span>العب الآن 🧩</span>
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Clean Collapsible Section for Extended Exploration & Fortune Wheel */}
      <section className="pt-2">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
              <span>عجلة الاستكشاف وشجرة التكريس</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600/30 px-2 py-0.5 rounded-full font-mono">
                اختياري
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              تصفح التوزيع الدائري للمحاور أو استعرض شجرة التكريس التفاعلية.
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              setShowExtendedExploration((prev) => !prev);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            {showExtendedExploration ? 'طي العجلة ▲' : 'استعراض العجلة ▼'}
          </button>
        </div>

        {showExtendedExploration && (
          <div className="mt-4 space-y-6 animate-fade-in">
            {/* Daily Spiritual Consecration Tree */}
            <ConsecrationTree
              currentUser={currentUser}
              onOpenRetreat={onOpenRetreat}
              onNavigateToSpiritualLife={onNavigateToSpiritualLife}
              onNavigateToPersonalSpace={onNavigateToPersonalSpace}
            />

            {/* Main Wheel */}
            <FortuneWheel
              sections={wheelSections}
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
              onReset={handleReset}
            />
          </div>
        )}
      </section>
    </div>
  );
});

HomeView.displayName = 'HomeView';
