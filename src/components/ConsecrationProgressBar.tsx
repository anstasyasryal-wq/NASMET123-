import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../utils/audio';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Heart,
  Layers,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';

interface DailyTask {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'spiritual' | 'ecclesiastical' | 'practical';
  points: number;
}

interface StudyModule {
  id: string;
  titleAr: string;
  titleEn: string;
  category: 'ecclesiastical';
  subTrackAr: string;
  subTrackEn: string;
  totalLessons: number;
  completedLessons: number;
}

const DEFAULT_DAILY_TASKS: DailyTask[] = [
  {
    id: 'task_agpeya_morning',
    titleAr: '🌅 صلاة باكر من الأجبية القبطية بمخافة وخضوع',
    titleEn: '🌅 Morning Agpeya Prayer with reverence',
    category: 'spiritual',
    points: 15,
  },
  {
    id: 'task_bible_reading',
    titleAr: '📖 قراءة وتأمل في إصحاحين من الكتاب المقدس (العهد القديم والجديد)',
    titleEn: '📖 Reading & meditating on 2 Bible chapters',
    category: 'spiritual',
    points: 20,
  },
  {
    id: 'task_jesus_prayer',
    titleAr: '🕊️ ترديد صلاة يسوع السهمية 50 مرة («يا ربي يسوع المسيح ارحمني»)',
    titleEn: '🕊️ Reciting Jesus Arrow Prayer 50 times',
    category: 'spiritual',
    points: 15,
  },
  {
    id: 'task_patristic_study',
    titleAr: '📚 قراءة 15 دقيقة في كتاب آبائي (تجسد الكلمة أو بستان الرهبان)',
    titleEn: '📚 15 minutes of Patristics reading',
    category: 'ecclesiastical',
    points: 20,
  },
  {
    id: 'task_evening_examination',
    titleAr: '🕯️ صلاة النوم والغروب مع فحص الضمير وتحديد التوبة اليومية',
    titleEn: '🕯️ Compline prayer with daily conscience examination',
    category: 'spiritual',
    points: 15,
  },
  {
    id: 'task_act_of_mercy',
    titleAr: '🤝 تقديم عمل رحمة أو خدمة افتقاد وسؤال عن مخدوم',
    titleEn: '🤝 Performing an act of mercy or pastoral outreach',
    category: 'practical',
    points: 15,
  },
];

const INITIAL_MODULES: StudyModule[] = [
  {
    id: 'mod_patrology',
    titleAr: 'علم الآبائيات (الباترولوجي)',
    titleEn: 'Patrology & Apostolic Fathers',
    category: 'ecclesiastical',
    subTrackAr: 'العلوم الكنسية',
    subTrackEn: 'Ecclesiastical Studies',
    totalLessons: 8,
    completedLessons: 6,
  },
  {
    id: 'mod_liturgics',
    titleAr: 'الليتورجيا والطقس القبطي',
    titleEn: 'Coptic Liturgics & Rituals',
    category: 'ecclesiastical',
    subTrackAr: 'العلوم الكنسية',
    subTrackEn: 'Ecclesiastical Studies',
    totalLessons: 10,
    completedLessons: 7,
  },
  {
    id: 'mod_dogmatics',
    titleAr: 'اللاهوت العقيدي والمقارن',
    titleEn: 'Dogmatic & Comparative Theology',
    category: 'ecclesiastical',
    subTrackAr: 'العلوم الكنسية',
    subTrackEn: 'Ecclesiastical Studies',
    totalLessons: 6,
    completedLessons: 4,
  },
  {
    id: 'mod_church_history',
    titleAr: 'تاريخ الكنيسة والمجامع المسكونية',
    titleEn: 'Church History & Ecumenical Councils',
    category: 'ecclesiastical',
    subTrackAr: 'العلوم الكنسية',
    subTrackEn: 'Ecclesiastical Studies',
    totalLessons: 8,
    completedLessons: 5,
  },
];

const STORAGE_KEY = 'mokarasa_consecration_progress_v2';

export const ConsecrationProgressBar: React.FC<{
  onOpenConsecrationManual?: () => void;
  onOpenSpiritualLife?: () => void;
}> = ({ onOpenConsecrationManual, onOpenSpiritualLife }) => {
  const { language, isRTL } = useLanguage();
  const isAr = language === 'ar';

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      if (typeof window === 'undefined') return ['task_agpeya_morning', 'task_bible_reading'];
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedTaskIds)) return parsed.completedTaskIds;
      }
    } catch {
      // fallback
    }
    return ['task_agpeya_morning', 'task_bible_reading'];
  });

  const [modules, setModules] = useState<StudyModule[]>(() => {
    try {
      if (typeof window === 'undefined') return INITIAL_MODULES;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.modules)) return parsed.modules;
      }
    } catch {
      // fallback
    }
    return INITIAL_MODULES;
  });

  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'curriculum' | 'ranks'>('daily');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedTaskIds,
          modules,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {
      // ignore
    }
  }, [completedTaskIds, modules]);

  // Toggle Daily Task
  const toggleTask = useCallback((taskId: string) => {
    soundManager.playTick();
    setCompletedTaskIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  }, []);

  // Increment/Decrement module lesson completed
  const updateModuleLesson = useCallback((moduleId: string, delta: number) => {
    soundManager.playTick();
    setModules((prev) =>
      prev.map((mod) => {
        if (mod.id === moduleId) {
          const nextVal = Math.max(0, Math.min(mod.totalLessons, mod.completedLessons + delta));
          return { ...mod, completedLessons: nextVal };
        }
        return mod;
      })
    );
  }, []);

  // Reset Daily Tasks
  const resetDailyTasks = useCallback(() => {
    soundManager.playTick();
    setCompletedTaskIds([]);
  }, []);

  // Calculate percentages
  const dailyTotalPoints = useMemo(
    () => DEFAULT_DAILY_TASKS.reduce((acc, task) => acc + task.points, 0),
    []
  );

  const dailyEarnedPoints = useMemo(() => {
    return DEFAULT_DAILY_TASKS.reduce((acc, task) => {
      return completedTaskIds.includes(task.id) ? acc + task.points : acc;
    }, 0);
  }, [completedTaskIds]);

  const dailyPercentage = useMemo(() => {
    if (dailyTotalPoints === 0) return 0;
    return Math.round((dailyEarnedPoints / dailyTotalPoints) * 100);
  }, [dailyEarnedPoints, dailyTotalPoints]);

  const curriculumStats = useMemo(() => {
    const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
    const completedLessons = modules.reduce((acc, m) => acc + m.completedLessons, 0);
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { totalLessons, completedLessons, percentage };
  }, [modules]);

  const spiritualDepthPercentage = useMemo(() => {
    // Computed based on spiritual category tasks + baseline consistency
    const spiritualTasks = DEFAULT_DAILY_TASKS.filter((t) => t.category === 'spiritual');
    const completedSpiritual = spiritualTasks.filter((t) => completedTaskIds.includes(t.id)).length;
    const taskRatio = spiritualTasks.length > 0 ? completedSpiritual / spiritualTasks.length : 0;
    // Combine base consistency (80%) + active daily contribution (20%)
    return Math.round(70 + taskRatio * 30);
  }, [completedTaskIds]);

  // Overall Consecration Score
  const overallConsecrationScore = useMemo(() => {
    const dailyWeight = 0.35;
    const curriculumWeight = 0.45;
    const spiritualWeight = 0.20;

    const weighted =
      dailyPercentage * dailyWeight +
      curriculumStats.percentage * curriculumWeight +
      spiritualDepthPercentage * spiritualWeight;

    return Math.min(100, Math.max(0, Math.round(weighted)));
  }, [dailyPercentage, curriculumStats.percentage, spiritualDepthPercentage]);

  // Current Level / Stage Badge
  const consecrationStage = useMemo(() => {
    if (overallConsecrationScore >= 90) {
      return {
        titleAr: 'مرحلة المكرس الثابت في المسيح',
        titleEn: 'Steadfast Consecrated Servant Stage',
        badgeAr: 'الدرجة الممتازة 🏆',
        badgeEn: 'Highest Honor 🏆',
        color: 'from-amber-500 via-amber-400 to-yellow-300',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-300',
        icon: '👑',
        nextMilestoneAr: 'الثبات حتى النهاية ونوال الإكليل',
        nextMilestoneEn: 'Perseverance unto the eternal crown',
      };
    } else if (overallConsecrationScore >= 70) {
      return {
        titleAr: 'مرحلة التلمذة والعمق الروحي',
        titleEn: 'Discipleship & Spiritual Depth Stage',
        badgeAr: 'مكرس ممتلئ بالنعمة 🕊️',
        badgeEn: 'Grace-Filled Consecrated 🕊️',
        color: 'from-amber-600 via-amber-500 to-amber-400',
        borderColor: 'border-amber-500/80',
        textColor: 'text-amber-300',
        icon: '✝️',
        nextMilestoneAr: 'الانتقال لدرجة الثبات الكامل (90%)',
        nextMilestoneEn: 'Reaching Full Steadfastness (90%)',
      };
    } else if (overallConsecrationScore >= 40) {
      return {
        titleAr: 'مرحلة النمو وبداية التكريس',
        titleEn: 'Growth & Early Consecration Stage',
        badgeAr: 'تلميذ المكرسين 🌿',
        badgeEn: 'Consecrated Disciple 🌿',
        color: 'from-amber-700 via-amber-600 to-amber-500',
        borderColor: 'border-amber-600/60',
        textColor: 'text-amber-200',
        icon: '🌱',
        nextMilestoneAr: 'الارتقاء إلى مرحلة العمق الروحي (70%)',
        nextMilestoneEn: 'Advancing to Spiritual Depth Stage (70%)',
      };
    } else {
      return {
        titleAr: 'مرحلة البداية المباركة والدعوة',
        titleEn: 'Blessed Beginning & Calling Stage',
        badgeAr: 'طالب التكريس 🕯️',
        badgeEn: 'Consecration Aspirant 🕯️',
        color: 'from-stone-600 via-amber-700 to-amber-600',
        borderColor: 'border-amber-600/40',
        textColor: 'text-amber-400',
        icon: '🕯️',
        nextMilestoneAr: 'إكمال 40% للوصول لمرحلة النمو',
        nextMilestoneEn: 'Reaching 40% to enter Growth Stage',
      };
    }
  }, [overallConsecrationScore]);

  return (
    <section className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Decorative Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header & Primary Progress Bar */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{isAr ? 'شريط تقدم التكريس والمسار الروحي' : 'Consecration Path Progress'}</span>
              </span>
              <span className="text-[11px] font-mono font-bold bg-stone-800 text-amber-300 border border-amber-600/30 px-2 py-0.5 rounded-full">
                {consecrationStage.badgeAr}
              </span>
            </div>

            <h2 className="font-spiritual text-lg sm:text-xl font-black text-amber-100 flex items-center gap-2 pt-1">
              <span>{consecrationStage.icon}</span>
              <span>{consecrationStage.titleAr}</span>
            </h2>
            <p className="text-xs text-stone-300">
              {isAr
                ? 'مقياس إلكتروني متكامل لمتابعة دراسة المناهج الكنسية، العبادة اليومية، والالتزام بالدستور.'
                : 'Integrated tracker for church curricula, daily worship, and consecration tasks.'}
            </p>
          </div>

          {/* Overall Percentage Badge */}
          <div className="flex flex-col items-end justify-center bg-stone-950/80 border border-amber-500/40 rounded-2xl p-3 shadow-inner shrink-0 min-w-[120px]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">
              {isAr ? 'نسبة الإنجاز الكلي' : 'Overall Score'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 tabular-nums">
                {overallConsecrationScore}%
              </span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-medium pt-0.5">
              {consecrationStage.nextMilestoneAr}
            </span>
          </div>
        </div>

        {/* Dynamic Main Consecration Progress Track */}
        <div className="space-y-2 pt-1">
          <div className="relative w-full h-5 bg-stone-950/90 rounded-full border border-amber-500/40 p-0.5 shadow-inner overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${consecrationStage.color} transition-all duration-700 ease-out relative`}
              style={{ width: `${overallConsecrationScore}%` }}
            >
              {/* Shimmer Light Effect */}
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Progress Markers */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-0.5">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block" />
              <span>{isAr ? 'البداية (0%)' : 'Start (0%)'}</span>
            </span>
            <span className="hidden sm:inline text-stone-400">
              {isAr ? '40% - مرحلة النمو' : '40% - Growth'}
            </span>
            <span className="text-amber-400 font-bold">
              {isAr ? '70% - العمق الكنسي' : '70% - Depth'}
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <span>{isAr ? '100% - الثبات' : '100% - Crown'}</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three Main Pillars Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10 pt-1">
        {/* Track A: العلوم الكنسية واللاهوتية */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-amber-600/30 hover:border-amber-500/60 transition shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-spiritual text-xs sm:text-sm font-bold text-amber-100">
                  {isAr ? 'العلوم الكنسية واللاهوت' : 'Ecclesiastical Studies'}
                </h3>
                <p className="text-[10px] text-stone-400">
                  {isAr ? 'الباترولوجي، الطقس، واللاهوت' : 'Patrology & Liturgics'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/30 tabular-nums">
              {curriculumStats.percentage}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2.5 bg-stone-900 rounded-full border border-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                style={{ width: `${curriculumStats.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>{isAr ? 'دروس مكتملة:' : 'Completed Lessons:'}</span>
              <span className="font-mono text-amber-200 font-bold tabular-nums">
                {curriculumStats.completedLessons} / {curriculumStats.totalLessons}
              </span>
            </div>
          </div>
        </div>

        {/* Track B: العمق الروحي والعبادة */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-emerald-600/30 hover:border-emerald-500/60 transition shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-spiritual text-xs sm:text-sm font-bold text-emerald-100">
                  {isAr ? 'العمق الروحي والعبادة' : 'Spiritual Worship'}
                </h3>
                <p className="text-[10px] text-stone-400">
                  {isAr ? 'الأجبية، الكتاب، والمخدع' : 'Agpeya & Closet Prayer'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/30 tabular-nums">
              {spiritualDepthPercentage}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2.5 bg-stone-900 rounded-full border border-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${spiritualDepthPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>{isAr ? 'مستوى المواظبة:' : 'Devotion Level:'}</span>
              <span className="font-mono text-emerald-200 font-bold tabular-nums">
                {isAr ? 'عالي الثبات 🕊️' : 'High Steadfastness'}
              </span>
            </div>
          </div>
        </div>

        {/* Track C: المهام اليومية والالتزام */}
        <div className="p-4 rounded-2xl bg-stone-950/70 border border-amber-500/30 hover:border-amber-400/60 transition shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-spiritual text-xs sm:text-sm font-bold text-amber-100">
                  {isAr ? 'المهام اليومية والالتزام' : 'Daily Consecration Tasks'}
                </h3>
                <p className="text-[10px] text-stone-400">
                  {isAr ? 'التداريب اليومية الستة' : '6 Daily Disciplines'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 tabular-nums">
              {dailyPercentage}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2.5 bg-stone-900 rounded-full border border-stone-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${dailyPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-stone-400">
              <span>{isAr ? 'مهام اليوم المنجزة:' : 'Today Tasks:'}</span>
              <span className="font-mono text-amber-200 font-bold tabular-nums">
                {completedTaskIds.length} / {DEFAULT_DAILY_TASKS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Toggle Section for Detailed Tasks & Modules */}
      <div className="relative z-10 pt-2 border-t border-amber-900/30">
        <button
          onClick={() => {
            soundManager.playTick();
            setShowDetails((prev) => !prev);
          }}
          className="w-full py-2.5 px-4 rounded-2xl bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>
              {showDetails
                ? isAr
                  ? 'إخفاء تفاصيل المهام والمناهج اليومية'
                  : 'Hide Tasks & Curriculum Details'
                : isAr
                ? 'عرض وتحديث تفاصيل المهام والمناهج اليومية 📝'
                : 'Show & Update Daily Tasks & Modules 📝'}
            </span>
          </div>
          {showDetails ? (
            <ChevronUp className="w-4 h-4 text-amber-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {showDetails && (
          <div className="mt-4 p-4 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-4 animate-fade-in">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab('daily');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'daily'
                    ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                    : 'text-stone-400 hover:text-amber-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'المهام اليومية (6)' : 'Daily Tasks'}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab('curriculum');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'curriculum'
                    ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                    : 'text-stone-400 hover:text-amber-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'المناهج والدروس' : 'Modules'}</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab('ranks');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ranks'
                    ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                    : 'text-stone-400 hover:text-amber-300'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'شجرة الرتب' : 'Ranks'}</span>
              </button>
            </div>

            {/* TAB 1: Daily Tasks Check-offs */}
            {activeTab === 'daily' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span>
                    {isAr
                      ? 'اختر المهام التي أنجزتها اليوم لتحديث شريط التقدم:'
                      : 'Check tasks completed today:'}
                  </span>
                  <button
                    onClick={resetDailyTasks}
                    className="text-[11px] text-amber-400 hover:text-amber-200 flex items-center gap-1 transition cursor-pointer font-bold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isAr ? 'إعادة ضبط اليوم' : 'Reset Day'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEFAULT_DAILY_TASKS.map((task) => {
                    const isDone = completedTaskIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                          isDone
                            ? 'bg-amber-950/40 border-amber-500/60 text-amber-100'
                            : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition ${
                            isDone
                              ? 'bg-amber-500 border-amber-400 text-stone-950'
                              : 'border-stone-600 bg-stone-950'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <div className="space-y-0.5">
                          <p
                            className={`text-xs font-semibold leading-snug ${
                              isDone ? 'line-through opacity-90' : ''
                            }`}
                          >
                            {isAr ? task.titleAr : task.titleEn}
                          </p>
                          <span className="text-[10px] text-amber-400 font-mono font-bold">
                            +{task.points} {isAr ? 'نقاط جهاد' : 'pts'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Curriculum Modules */}
            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                <p className="text-xs text-stone-300">
                  {isAr
                    ? 'تابع إنجازك في دروس العلوم الكنسية والآبائيات:'
                    : 'Track completed lessons in church studies:'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-amber-100">
                          {isAr ? mod.titleAr : mod.titleEn}
                        </h4>
                        <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-600/30">
                          {mod.completedLessons} / {mod.totalLessons} {isAr ? 'دروس' : 'lessons'}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-stone-950 rounded-full border border-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{
                            width: `${Math.round((mod.completedLessons / mod.totalLessons) * 100)}%`,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-stone-400">
                          {isAr ? 'تعديل الدروس:' : 'Adjust:'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateModuleLesson(mod.id, -1)}
                            disabled={mod.completedLessons <= 0}
                            className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 text-xs font-bold hover:bg-stone-700 disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateModuleLesson(mod.id, 1)}
                            disabled={mod.completedLessons >= mod.totalLessons}
                            className="px-2 py-0.5 rounded bg-amber-600 text-stone-950 text-xs font-bold hover:bg-amber-500 disabled:opacity-30 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Consecration Ranks & Vows */}
            {activeTab === 'ranks' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المستوى 1: طالب التكريس' : 'Level 1: Aspirant'}</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {isAr ? '0% - 39% (بداية النية والانضباط)' : '0% - 39% Initial discipline'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المستوى 2: تلميذ النمو' : 'Level 2: Disciple'}</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {isAr ? '40% - 69% (التعمق في الكتب والصلوات)' : '40% - 69% Deepening study'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-200 text-xs font-bold">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'المستوى 3: المكرس الثابت' : 'Level 3: Steadfast'}</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      {isAr ? '70% - 100% (الأمانة في الدستور والخدمة)' : '70% - 100% Faithful service'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {onOpenConsecrationManual && (
                    <button
                      onClick={() => {
                        soundManager.playTick();
                        onOpenConsecrationManual();
                      }}
                      className="text-xs text-amber-300 hover:text-amber-100 font-bold underline cursor-pointer"
                    >
                      {isAr ? 'عرض دستور حياة المكرس كاملاً 📜' : 'Open Consecration Constitution 📜'}
                    </button>
                  )}

                  {onOpenSpiritualLife && (
                    <button
                      onClick={() => {
                        soundManager.playTick();
                        onOpenSpiritualLife();
                      }}
                      className="text-xs text-emerald-300 hover:text-emerald-100 font-bold underline cursor-pointer"
                    >
                      {isAr ? 'الانتقال إلى خطة الحياة الروحية 🕊️' : 'Go to Spiritual Plan 🕊️'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
