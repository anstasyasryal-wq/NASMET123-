import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { User, Stage, Announcement } from '../types';
import { soundManager } from '../utils/audio';
import { getOrRefreshDailyMessage } from '../utils/heavenlyHistory';
import type { WheelSection } from './FortuneWheel';
import { ConsecrationProgressBar } from './ConsecrationProgressBar';
import { useLanguage } from '../context/LanguageContext';

const FortuneWheel = lazy(() => import('./FortuneWheel').then(m => ({ default: m.FortuneWheel })));
const ConsecrationTree = lazy(() => import('./ConsecrationTree').then(m => ({ default: m.ConsecrationTree })));
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
  Download,
  Share2,
  Smartphone,
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
  const { language, t, dir, isRTL } = useLanguage();
  const [showExtendedExploration, setShowExtendedExploration] = useState(false);
  const [selectedSection, setSelectedSection] = useState<WheelSection | null>(null);
  const [dailyRecord] = useState(() => getOrRefreshDailyMessage(false));
  const dailyMsg = dailyRecord.message;

  // Retrieve last reading progress from storage (lightweight without heavy books import)
  const lastActiveReading = useMemo(() => {
    try {
      if (typeof window === 'undefined') return null;
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const progressMap: Record<string, BookProgress> =
        parsed && typeof parsed === 'object' && parsed.progress ? parsed.progress : {};

      let bestBookId: string | null = null;
      let bestProgress: BookProgress | null = null;
      let latestTime = 0;

      for (const [bId, prog] of Object.entries(progressMap)) {
        if (prog && typeof prog === 'object' && (prog as any).lastReadAt) {
          const t = new Date((prog as any).lastReadAt).getTime();
          if (t > latestTime) {
            latestTime = t;
            bestBookId = bId;
            bestProgress = prog as BookProgress;
          }
        }
      }

      if (!bestBookId || !bestProgress) return null;

      const bookTitles: Record<string, { title: string; author: string }> = {
        'book-1': { title: 'تجسد الكلمة (De Incarnatione Verbi Dei)', author: 'القديس أثناسيوس الرسولي' },
        'book-2': { title: 'رسائل القديس إغناطيوس الأنطاكي', author: 'القديس إغناطيوس' },
        'book-3': { title: 'الرسالة إلى أهل روما وبوليكاربوس', author: 'القديس بوليكاربوس' },
        'book-4': { title: 'الديداخي (تعليم الرسل الاثني عشر)', author: 'الآباء الرسل' },
      };

      const info = bookTitles[bestBookId] || { title: 'كتاب كنسي موثق', author: 'تراث الآباء' };
      return {
        id: bestBookId,
        title: info.title,
        author: info.author,
        progress: bestProgress,
      };
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
        name: language === 'ar' ? 'المسابقة الرسمية ومراحل التقييم' : 'Official Competition & Stages',
        shortName: language === 'ar' ? 'المسابقات الرسمية' : 'Official Contest',
        line1: language === 'ar' ? 'المسابقات' : 'Official',
        line2: language === 'ar' ? 'الرسمية' : 'Contests',
        icon: '🏆',
        color: '#9a6700',
        badge: language === 'ar' ? 'المسابقة الكبرى' : 'Grand Contest',
        description: language === 'ar'
          ? 'ست مراحل إلكترونية متدرجة مع بنك أسئلة مركزي وتصنيف لحظي وتتويج شرفي.'
          : 'Six progressive digital stages with central question bank and live leaderboard.',
        verse: 'كُلُّ مَنْ يُجَاهِدُ يَضْبُطُ نَفْسَهُ فِي كُلِّ شَيْءٍ.',
        verseRef: '1 كورنثوس 9: 25',
        patristicQuote: 'إن الجهاد الروحي لا يُقاس بكثرة المجهود الظاهر، بل بنقاوة القلب والأمانة لله.',
        patristicSaint: 'القديس أنطونيوس الكبير',
        onOpen: () => onNavigateToCompetitions(),
        items: [],
      },
      {
        id: 'spiritual_life',
        name: language === 'ar' ? 'الحياة الروحية وصلاة المخدع' : 'Spiritual Life & Closet Prayer',
        shortName: language === 'ar' ? 'الحياة الروحية' : 'Spiritual Life',
        line1: language === 'ar' ? 'الحياة' : 'Spiritual',
        line2: language === 'ar' ? 'الروحية' : 'Life',
        icon: '☀️',
        color: '#047857',
        badge: language === 'ar' ? 'خطة سنوية ومخدع' : 'Annual Plan',
        description: language === 'ar'
          ? 'خطة قراءة الكتاب المقدس والآباء السنوية، مخدع الصلاة، ومسبحة صلاة يسوع.'
          : 'Annual Bible & Patristics reading plan, closet prayer, and Jesus prayer.',
        verse: 'وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ.',
        verseRef: 'متى 6: 6',
        patristicQuote: 'الصلاة هي نسيم الروح وتنفس الحياة الأبدية.',
        patristicSaint: 'القديس يوحنا ذهبي الفم',
        onOpen: () => onNavigateToSpiritualLife?.(),
        items: [],
      },
      {
        id: 'library',
        name: language === 'ar' ? 'مكتبة الكتب ومراجع الآباء' : 'Knowledge Library & Patristics',
        shortName: language === 'ar' ? 'المكتبة المعرفية' : 'Knowledge Library',
        line1: language === 'ar' ? 'المكتبة' : 'Knowledge',
        line2: language === 'ar' ? 'المعرفية' : 'Library',
        icon: '📚',
        color: '#78350f',
        badge: language === 'ar' ? '36 كتاباً كاملاً' : '36 Books',
        description: language === 'ar'
          ? 'مكتبة رقمية متكاملة للكتب والوثائق الكنسية، ومعرض الأيقونات وسير القديسين.'
          : 'Full digital repository of church books, icon gallery, and saints biographies.',
        verse: 'إِلَى أَنْ أَجِيءَ اعْكُفْ عَلَى الْقِرَاءَةِ وَالْوَعْظِ وَالتَّعْلِيمِ.',
        verseRef: '1 تيموثاوس 4: 13',
        patristicQuote: 'اجعل من أقوال الآباء مصباحاً لخطواتك في هذا العالم.',
        patristicSaint: 'مار إسحق السرياني',
        onOpen: () => onNavigateToLibrary?.(),
        items: [],
      },
      {
        id: 'monastic_oasis',
        name: language === 'ar' ? 'دستور التكريس وواحة السكون الروحي' : 'Consecration Constitution & Oasis',
        shortName: language === 'ar' ? 'دستور التكريس' : 'Constitution',
        line1: language === 'ar' ? 'دستور' : 'Desert',
        line2: language === 'ar' ? 'التكريس' : 'Oasis',
        icon: '🕯️',
        color: '#b45309',
        badge: language === 'ar' ? 'مشغل ألحان' : 'Chants Player',
        description: language === 'ar'
          ? 'ركائز المكرس الـ 7، مشغل ألحان هادئة، ميزان فحص الضمير، وميثاق تجديد النذر.'
          : 'The 7 pillars of consecration, meditative chants, and conscience examination.',
        verse: 'فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ.',
        verseRef: 'إشعياء 30: 15',
        patristicQuote: 'الهدوء والسكون هما مبدأ نقاوة النفس.',
        patristicSaint: 'القديس باسيليوس الكبير',
        onOpen: () => onNavigateToMonasticOasis?.(),
        items: [],
      },
    ],
    [
      language,
      onNavigateToCompetitions,
      onNavigateToSpiritualLife,
      onNavigateToLibrary,
      onNavigateToMonasticOasis,
    ]
  );

  return (
    <div className={`space-y-6 pb-12 animate-fade-in font-sans ${isRTL ? 'text-right' : 'text-left'}`} dir={dir}>
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
                  {t('appTitle')}
                </span>
                <h1 className="font-spiritual text-xl sm:text-2xl font-black text-amber-100">
                  {currentUser
                    ? `${t('userGreetingPrefix')} ${currentUser.vocation || t('blessedOne')} ${currentUser.name}`
                    : t('welcomeGreeting')}
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
              <span>{t('directoryNav')}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-spiritual max-w-2xl">
            {t('homeHeroSubtitle')}
          </p>

          {/* Gentle Suggestion of the Day (غير إلزامي) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('dailyWhisper')}</span>
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
              <span>{t('meditateWithGuide')}</span>
              <ChevronLeft className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* PWA Mobile Install & Share Ribbon */}
      <section className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 p-3 sm:p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Smartphone className="w-5 h-5 text-amber-400" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-amber-100">
                {language === 'ar' ? 'تثبيت ومشاركة تطبيق «حسب قلب الله»' : 'Install & Share "After God\'s Heart"'}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              {language === 'ar' 
                ? 'ثبّت التطبيق على شاشة هاتفك الرئيسية ليعمل بدون إنترنت كأي تطبيق أصلي، وشاركه للبركة.'
                : 'Install the app directly on your phone home screen for offline access and share with others.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              window.dispatchEvent(new Event('show-install-prompt'));
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-950" />
            <span>{t('installApp')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playTick();
              window.dispatchEvent(new Event('show-share-modal'));
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 font-bold text-xs transition active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{t('share')}</span>
          </button>
        </div>
      </section>

      {/* Consecration Progress Bar (شريط تقدم التكريس والمسار الروحي) */}
      <ConsecrationProgressBar
        onOpenConsecrationManual={onNavigateToConsecratedManual}
        onOpenSpiritualLife={onNavigateToSpiritualLife}
      />

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
                <span>{t('heavenlyMessageCard')}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {language === 'ar' ? 'رسالة اليوم' : 'Daily Card'}
              </span>
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
              <span>{t('readMore')}</span>
              <ChevronLeft className={`w-3.5 h-3.5 ${!isRTL ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </div>

        {/* 2. شجرة النمو الروحي */}
        <div
          onClick={() => {
            soundManager.playTick();
            setShowExtendedExploration(true);
            setTimeout(() => {
              const el = document.getElementById('consecration-tree-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-stone-900 to-stone-950 border border-emerald-600/40 hover:border-emerald-400 transition cursor-pointer shadow-xl flex flex-col justify-between gap-4 group relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-600/40 flex items-center gap-1">
                <span>🌳</span>
                <span>{t('spiritualTreeCard')}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {currentUser ? `${currentUser.totalScore || 0} ${t('points')}` : (language === 'ar' ? 'مستوى البداية' : 'Start Level')}
              </span>
            </div>
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-emerald-100">
              {language === 'ar' ? 'مسيرة النضج والجهاد الروحي' : 'Spiritual Growth & Devotion'}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {language === 'ar'
                ? 'تتبع نموك الروحي، فضائلك، ومستواك في طريق التكريس والثبات في المسيح.'
                : 'Track your spiritual virtues, growth milestones, and consecration path in Christ.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-900/40 text-[11px] text-emerald-300 font-bold relative z-10">
            <span>🌿 {language === 'ar' ? 'إثمار روحي متجدد' : 'Spiritual Fruits'}</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>{language === 'ar' ? 'استعرض الشجرة' : 'View Tree'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 ${!isRTL ? 'rotate-180' : ''}`} />
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
                <span>{t('consecratedConstitutionCard')}</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                {language === 'ar' ? 'المرجع الأساسي' : 'Core Manual'}
              </span>
            </div>
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-amber-100">
              {language === 'ar' ? 'مبادئ الحياة مع الله' : 'Principles of Life with God'}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {language === 'ar'
                ? 'تذكير يومي بهدف التكريس ومبادئ الحياة الروحية والجهاد النسكي في الكنيسة.'
                : 'Daily reminder of consecration vows, spiritual disciplines, and holy service.'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-amber-900/40 text-[11px] text-amber-300 font-bold relative z-10">
            <span>⚖️ {language === 'ar' ? 'معايير التكريس' : 'Standards'}</span>
            <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
              <span>{language === 'ar' ? 'فتح الدستور' : 'Open Constitution'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 ${!isRTL ? 'rotate-180' : ''}`} />
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
                  <span>{language === 'ar' ? 'متابعة آخر قراءة' : 'Resume Reading'}</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  {language === 'ar' ? `الفصل ${(lastActiveReading.progress.chapterIdx || 0) + 1}` : `Chapter ${(lastActiveReading.progress.chapterIdx || 0) + 1}`}
                </span>
              </div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 truncate">
                {lastActiveReading.title}
              </h3>
              <p className="text-xs text-stone-400 line-clamp-1">
                {language === 'ar' ? `بقلم: ${lastActiveReading.author}` : `By: ${lastActiveReading.author}`}
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
              <span>{language === 'ar' ? 'استئناف القراءة من موضعك 📖' : 'Continue Reading 📖'}</span>
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition shadow-lg flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                  {t('library')}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">{language === 'ar' ? '36 كتاباً كاملاً' : '36 Books'}</span>
              </div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                {language === 'ar' ? 'مكتبة الآباء والكتب الموثقة' : 'Authentic Patristic Library'}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {language === 'ar'
                  ? 'اقرأ نصوص الآباء الرسوليين الكاملة: الديداخي، رسائل إغناطيوس، وبوليكاربوس، وبستان الرهبان.'
                  : 'Read the complete Apostolic Fathers: Didache, Ignatius, Polycarp, and Desert Paradise.'}
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
              <span>{language === 'ar' ? 'فتح المكتبة الكنسية 📚' : 'Open Church Library 📚'}</span>
            </button>
          </div>
        )}

        {/* Right Card: Next Step in Official Competition or Prayer */}
        <div className="p-5 rounded-3xl bg-stone-900 border border-amber-600/40 hover:border-amber-400 transition shadow-lg flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                {t('competitions')}
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {currentUser ? `${currentUser.totalScore || 0} ${t('points')}` : (language === 'ar' ? '6 مراحل إلكترونية' : '6 Digital Stages')}
              </span>
            </div>
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
              {nextStage ? nextStage.title : (language === 'ar' ? 'المسابقة الكبرى للتكريس' : 'Grand Consecration Contest')}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
              {nextStage ? nextStage.subtitle : (language === 'ar' ? 'اختبر معلوماتك في العقيدة، الكتاب المقدس، والآبائيات.' : 'Test your knowledge in theology, scriptures, and patristics.')}
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
              <span>
                {currentUser
                  ? (language === 'ar' ? 'متابعة المرحلة التالية 🏆' : 'Next Stage 🏆')
                  : (language === 'ar' ? 'بدء المسابقة الرسمية 🏆' : 'Start Contest 🏆')}
              </span>
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                onNavigateToLeaderboard();
              }}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition cursor-pointer"
              title={t('leaderboard')}
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
                {language === 'ar' ? 'رفيقك للتأمل والمشورة' : 'Your Companion for Guidance'}
              </span>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-cyan-100">
                {t('spiritualFather')}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'ar'
                  ? 'هل تشعر بالحيرة أو الفتور أو ترغب في إجابة لاهوتية آبائية؟ اطرح سؤالك واستنر بأقوال الكنيسة.'
                  : 'Feeling perplexed or seeking patristic wisdom? Reflect and gain guidance rooted in Church heritage.'}
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-black text-xs transition shrink-0 flex items-center gap-1.5 shadow-md">
            <span>{language === 'ar' ? 'ابدأ الحوار الآن' : 'Start Now'}</span>
            <ChevronLeft className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>

      {/* 4. The 4 Main Pillars Grid (الأعمدة الأساسية الميسرة) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
            {language === 'ar' ? 'أبواب التطبيق الرئيسية' : 'Primary App Pillars'}
          </h2>
          <button
            onClick={() => {
              soundManager.playTick();
              if (onOpenDirectory) onOpenDirectory();
            }}
            className="text-xs text-amber-400 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض الدليل الكامل (24+ قسماً)' : 'View Directory (24+ Sections)'}</span>
            <ChevronLeft className={`w-4 h-4 ${!isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Pillar 1: Library */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToLibrary?.();
            }}
            className={`p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-amber-900/40 border border-amber-600/30 flex items-center justify-center text-amber-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-amber-300">
                {t('library')}
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                {language === 'ar' ? '36 كتاباً كاملاً وتفاسير العهدين وأقوال الآباء.' : '36 authentic books, patristics and exegesis.'}
              </p>
            </div>
            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <span>{language === 'ar' ? 'تصفح الكتب' : 'Browse'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
            </span>
          </div>

          {/* Pillar 2: Spiritual Journey */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToSpiritualLife?.();
            }}
            className={`p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-rose-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-rose-900/40 border border-rose-600/30 flex items-center justify-center text-rose-300">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-rose-300">
                {t('mySpiritualJourney')}
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                {language === 'ar' ? 'صلاة المخدع، مسبحة يسوع، وإعداد الاعتراف.' : 'Closet prayer, Jesus prayer beads, confession.'}
              </p>
            </div>
            <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
              <span>{language === 'ar' ? 'ادخل المخدع' : 'Enter'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
            </span>
          </div>

          {/* Pillar 3: Prayer Fortress */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToPrayerFortress?.();
            }}
            className={`p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-600/30 flex items-center justify-center text-emerald-300">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-emerald-300">
                {t('prayerFortressTitle')}
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                {language === 'ar' ? 'مزامير الأجبية الساعية والصلوات الموجهة.' : 'Hourly Agpeya prayers, Psalms, and devotions.'}
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span>{language === 'ar' ? 'افتح الحصن' : 'Open Fortress'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
            </span>
          </div>

          {/* Pillar 4: Games & Monastic Puzzle */}
          <div
            onClick={() => {
              soundManager.playTick();
              onNavigateToMonasticPuzzle?.();
            }}
            className={`p-4 rounded-2xl bg-stone-900 border border-stone-800 hover:border-purple-500/50 transition cursor-pointer group flex flex-col justify-between gap-3 shadow-md ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-600/30 flex items-center justify-center text-purple-300">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-purple-300">
                {language === 'ar' ? 'ألعاب وبازل الصعود' : 'Ladder of Ascent Games'}
              </h3>
              <p className="text-[11px] text-stone-400 line-clamp-2">
                {language === 'ar' ? 'بازل الصعود الرهباني، فوازير البستان وتحديات البرية.' : 'Monastic ladder puzzles and spiritual challenges.'}
              </p>
            </div>
            <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
              <span>{language === 'ar' ? 'العب الآن 🧩' : 'Play Now 🧩'}</span>
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
            </span>
          </div>
        </div>
      </section>

      {/* 5. Clean Collapsible Section for Extended Exploration & Fortune Wheel */}
      <section id="consecration-tree-section" className="pt-2">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-amber-100 flex items-center gap-2">
              <span>{language === 'ar' ? 'عجلة الاستكشاف وشجرة التكريس' : 'Consecration Wheel & Growth Tree'}</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600/30 px-2 py-0.5 rounded-full font-mono">
                {language === 'ar' ? 'تفاعلي' : 'Interactive'}
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              {language === 'ar'
                ? 'تصفح التوزيع الدائري للمحاور أو استعرض شجرة التكريس التفاعلية.'
                : 'Spin through the pillars or view the interactive spiritual tree.'}
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              setShowExtendedExploration((prev) => !prev);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            {showExtendedExploration
              ? (language === 'ar' ? 'طي العجلة ▲' : 'Collapse Wheel ▲')
              : (language === 'ar' ? 'استعراض الشجرة والعجلة ▼' : 'Expand Tree & Wheel ▼')}
          </button>
        </div>

        {showExtendedExploration && (
          <Suspense fallback={
            <div className="py-12 flex flex-col items-center justify-center space-y-2 text-stone-400">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin" />
              <span className="text-xs font-spiritual text-amber-300">جاري إعداد الشجرة وعجلة الاستكشاف...</span>
            </div>
          }>
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
          </Suspense>
        )}
      </section>
    </div>
  );
});

HomeView.displayName = 'HomeView';
