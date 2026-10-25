import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { Sparkles, Award, Heart, CheckCircle2, ChevronDown, ChevronUp, Flame, BookOpen, SunMedium, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConsecrationTreeProps {
  currentUser: User | null;
  onOpenRetreat?: () => void;
  onNavigateToSpiritualLife?: () => void;
  onNavigateToPersonalSpace?: () => void;
}

interface DailyTask {
  id: string;
  title: string;
  titleEn: string;
  points: number;
  icon: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ConsecrationTree: React.FC<ConsecrationTreeProps> = ({
  currentUser,
  onOpenRetreat,
  onNavigateToSpiritualLife,
  onNavigateToPersonalSpace,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const todayKey = new Date().toISOString().slice(0, 10);

  // Load completed tasks for today from localStorage
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`mokarasa_daily_tasks_${todayKey}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {};
  });

  const [bonusPoints, setBonusPoints] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mokarasa_consecration_bonus');
        return saved ? parseInt(saved, 10) || 0 : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [justCelebrated, setJustCelebrated] = useState<string | null>(null);

  const dailyTasks: DailyTask[] = [
    {
      id: 'scripture',
      title: 'قراءة الإصحاح اليومي والتأمل الروحي',
      titleEn: 'Daily Scripture Reading & Contemplation',
      points: 20,
      icon: '📖',
      desc: isEn ? 'Deep reflection on the Word of God' : 'غذاء الروح اليومي من كلمة الله الحية',
    },
    {
      id: 'agpeya',
      title: 'صلوات الأجبية ومزامير السواعي',
      titleEn: 'Agpeya Prayers & Psalms of the Hours',
      points: 25,
      icon: '✝️',
      desc: isEn ? 'Hourly prayer and thanksgiving' : 'شكر ومناجاة بالسواعي الكنسية المقدسة',
      actionLabel: isEn ? 'Prayer Fortress' : 'حصن الصلاة',
      onAction: onNavigateToSpiritualLife,
    },
    {
      id: 'jesus_prayer',
      title: 'مسبحة صلاة يسوع (يا ربي يسوع المسيح ارحمني)',
      titleEn: 'The Jesus Prayer (Lord Jesus Christ have mercy on me)',
      points: 15,
      icon: '📿',
      desc: isEn ? 'Heart devotion and repetition of the Holy Name' : 'حفظ الفكر ونقاوة القلب بمناجاة المخلص',
      actionLabel: isEn ? 'Personal Space' : 'مسبحة المخدع',
      onAction: onNavigateToPersonalSpace,
    },
    {
      id: 'virtue',
      title: 'عمل رحمة / فضيلة المحبة اليومية',
      titleEn: 'Act of Mercy / Daily Virtue Action',
      points: 20,
      icon: '🤍',
      desc: isEn ? 'Extending love and assistance to someone in need' : 'بذل وعطاء ومحبة عملية نحو القريب',
      actionLabel: isEn ? 'Virtue Jar' : 'حصالة الفضائل',
      onAction: onNavigateToSpiritualLife,
    },
    {
      id: 'retreat',
      title: 'خلوة صامتة ومحاسبة النفس перед النوم',
      titleEn: 'Silent Retreat & Evening Self-Reflection',
      points: 20,
      icon: '🕯️',
      desc: isEn ? 'Quiet moments away from noise with the Lord' : 'إشعال شمعة الصمت وسكون القلب أمام المذبح',
      actionLabel: isEn ? 'Start Retreat' : 'ابدأ الخلوة 🕯️',
      onAction: onOpenRetreat,
    },
  ];

  const toggleTask = (taskId: string, points: number) => {
    setCompletedTasks((prev) => {
      const isDone = !prev[taskId];
      const updated = { ...prev, [taskId]: isDone };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`mokarasa_daily_tasks_${todayKey}`, JSON.stringify(updated));
        
        // Adjust bonus points
        const change = isDone ? points : -points;
        const newBonus = Math.max(0, bonusPoints + change);
        setBonusPoints(newBonus);
        localStorage.setItem('mokarasa_consecration_bonus', String(newBonus));
      }
      if (isDone) {
        setJustCelebrated(taskId);
        setTimeout(() => setJustCelebrated(null), 2500);
      }
      return updated;
    });
  };

  const completedCount = dailyTasks.filter((t) => completedTasks[t.id]).length;
  const isAllCompleted = completedCount === dailyTasks.length;

  const baseScore = currentUser?.totalScore || 350;
  const totalEffectiveScore = baseScore + bonusPoints;

  // 5 Stages of growth
  const stage = totalEffectiveScore >= 900 ? 5 : totalEffectiveScore >= 650 ? 4 : totalEffectiveScore >= 450 ? 3 : totalEffectiveScore >= 250 ? 2 : 1;

  const stageInfo = [
    {
      level: 1,
      title: 'بذرة التكريس والجهاد الأولى',
      titleEn: 'Seed of Consecration',
      desc: 'بداية السعي نحو المخدع وخطوات التوبة الأولى والمواظبة',
      descEn: 'The initial spark of repentance, altar devotion, and sincere prayer.',
      emoji: '🌱',
      color: 'from-amber-600 to-emerald-600',
    },
    {
      level: 2,
      title: 'براعم النعمة والصلوات',
      titleEn: 'Buds of Grace & Prayers',
      desc: 'الالتزام بصلوات الأجبية وقراءة الكلمة المقدسة بانتظام',
      descEn: 'Diligence in daily liturgical hours, psalms, and reading the Gospel.',
      emoji: '🌿',
      color: 'from-emerald-600 to-teal-500',
    },
    {
      level: 3,
      title: 'شجرة الفضائل النامية',
      titleEn: 'Flourishing Tree of Virtues',
      desc: 'المثابرة في حصالة الفضائل والجهاد المتواصل لحراسة الفكر',
      descEn: 'Active practice of virtues, guarding thoughts, and serving others.',
      emoji: '🌳',
      color: 'from-teal-600 to-emerald-500',
    },
    {
      level: 4,
      title: 'شجرة المحبة المزهرة بالثمار',
      titleEn: 'Blossoming Tree of Divine Love',
      desc: 'الشركة الحية مع الله وعمق التأمل الإنجيلي ومحبة الجميع',
      descEn: 'Deep communion with Christ, biblical meditation, and boundless charity.',
      emoji: '🌸',
      color: 'from-amber-500 to-pink-500',
    },
    {
      level: 5,
      title: 'دوحة التكريس وثمار الروح',
      titleEn: 'Fruitful Grove of Consecration',
      desc: 'نضج روحي راسخ وامتلاء دائم بثمار الروح القدس وسلام المسيح',
      descEn: 'Spiritual maturity, continuous inner peace, and abundance of the Holy Spirit fruits.',
      emoji: '🌲✨',
      color: 'from-emerald-500 to-amber-400',
    },
  ];

  const currentStage = stageInfo[stage - 1];
  const progressPct = Math.min(100, Math.round((totalEffectiveScore / 1000) * 100));

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900/95 via-[#1a1612] to-emerald-950/80 border border-amber-600/30 p-4 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Golden halo glow in background */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-stone-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-2xl shadow-lg shrink-0">
            {currentStage.emoji}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isEn ? 'Spiritual Growth Tree' : 'شجرة التكريس والثمار'}</span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-600/40">
                {isEn ? `Stage ${currentStage.level}/5` : `المستوى ${currentStage.level} من 5`}
              </span>
            </div>
            <h2 className="font-spiritual text-lg sm:text-2xl font-bold text-amber-100 flex items-center gap-2 truncate">
              <span>{isEn ? currentStage.titleEn : currentStage.title}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-2 sm:line-clamp-none">
              {isEn ? currentStage.descEn : currentStage.desc}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800/60">
          <div className="text-right sm:text-right">
            <div className="text-[10px] sm:text-xs text-stone-400">{isEn ? 'Consecration Points' : 'نقاط التكريس'}</div>
            <div className="text-lg sm:text-xl font-mono font-extrabold text-amber-300 leading-none">
              {totalEffectiveScore} <span className="text-xs font-normal text-amber-400/80">{isEn ? 'pts' : 'نقطة'}</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs"
            title={isExpanded ? (isEn ? 'Collapse' : 'طي التفاصيل') : (isEn ? 'Expand' : 'عرض التفاصيل')}
          >
            <span>{isExpanded ? (isEn ? 'Hide' : 'إخفاء') : (isEn ? 'Daily Goals' : 'إنجاز اليوم')}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress to next level bar */}
      <div className="mt-4 space-y-1.5 relative z-10">
        <div className="flex justify-between text-[11px] text-stone-400 font-mono">
          <span>{isEn ? `Growth Progress: ${progressPct}%` : `مستوى النمو الثمري: ${progressPct}%`}</span>
          <span>{totalEffectiveScore} / 1000</span>
        </div>
        <div className="w-full bg-stone-950/80 rounded-full h-3 p-0.5 border border-stone-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${currentStage.color} shadow-[0_0_12px_rgba(16,185,129,0.5)]`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-5 space-y-6 relative z-10 overflow-hidden"
          >
            {/* Visual Tree Centerpiece */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-stone-950/70 rounded-2xl border border-stone-800/80 p-5">
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-l border-stone-800">
                <motion.div
                  animate={{ scale: [1, 1.06, 1], y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-6xl sm:text-7xl filter drop-shadow-[0_0_24px_rgba(16,185,129,0.45)] mb-2"
                >
                  {currentStage.emoji}
                </motion.div>
                <div className="font-spiritual text-base font-bold text-amber-200">
                  {isEn ? currentStage.titleEn : currentStage.title}
                </div>
                <div className="text-[11px] text-stone-400 max-w-xs mt-1">
                  «فَيَكُونُ كَشَجَرَةٍ مَغْرُوسَةٍ عِنْدَ مَجَارِي الْمِيَاهِ، الَّتِي تُعْطِي ثَمَرَهَا فِي أَوَانِهِ»
                  <div className="text-[10px] text-amber-400/80 mt-0.5 font-mono">(مزمور 1: 3)</div>
                </div>
              </div>

              {/* Daily Spiritual Goals Section */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-stone-200">
                      {isEn ? "Today's Spiritual Accomplishments" : 'إنجازاتي الروحية لليوم (الجهاد اليومي)'}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-600/40 text-emerald-300">
                    {completedCount} / {dailyTasks.length} {isEn ? 'Completed' : 'مكتمل'}
                  </span>
                </div>

                {isAllCompleted && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-amber-900/60 via-emerald-900/60 to-amber-900/60 border border-amber-500/50 text-center text-xs text-amber-200 font-bold shadow-lg"
                  >
                    🎉 {isEn ? 'Blessed are you! You have completed all today’s spiritual milestones by God’s grace!' : 'مبارك أنت يا مجاهد المسيح! أتممت كافة إنجازات اليوم الروحي بنعمة الله 🌿✨'}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-2">
                  {dailyTasks.map((task) => {
                    const isDone = !!completedTasks[task.id];
                    const isJustDone = justCelebrated === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-950/30 border-emerald-600/40 text-stone-200'
                            : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 text-stone-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id, task.points)}
                          className="flex items-center gap-3 text-right flex-1 cursor-pointer select-none"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                : 'border border-stone-700 group-hover:border-stone-500 text-transparent'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{task.icon}</span>
                              <span
                                className={`text-xs sm:text-sm font-semibold transition-all ${
                                  isDone ? 'line-through text-stone-400' : 'text-stone-100'
                                }`}
                              >
                                {isEn ? task.titleEn : task.title}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-400 mt-0.5">{task.desc}</div>
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          {task.onAction && (
                            <button
                              type="button"
                              onClick={task.onAction}
                              className="hidden sm:inline-flex text-[11px] px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition cursor-pointer"
                            >
                              {task.actionLabel}
                            </button>
                          )}
                          <span
                            className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${
                              isDone
                                ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600/30'
                                : 'bg-stone-800/80 text-amber-400/80 border border-stone-700'
                            }`}
                          >
                            +{task.points}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Spiritual Jumps */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800/60">
              <span className="text-xs text-stone-400 font-spiritual">
                {isEn ? 'Daily Spiritual Shortcuts:' : 'محطات التغذية الروحية السريعة:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {onOpenRetreat && (
                  <button
                    onClick={onOpenRetreat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-200 text-xs font-bold transition cursor-pointer"
                  >
                    <span>🕯️</span>
                    <span>{isEn ? 'Silent Retreat' : 'الخلوة الصامتة'}</span>
                  </button>
                )}
                {onNavigateToSpiritualLife && (
                  <button
                    onClick={onNavigateToSpiritualLife}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-700/60 border border-stone-700 text-stone-200 text-xs font-semibold transition cursor-pointer"
                  >
                    <span>🏺</span>
                    <span>{isEn ? 'Virtue Jar' : 'حصالة الفضائل'}</span>
                  </button>
                )}
                {onNavigateToPersonalSpace && (
                  <button
                    onClick={onNavigateToPersonalSpace}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-700/60 border border-stone-700 text-stone-200 text-xs font-semibold transition cursor-pointer"
                  >
                    <span>📿</span>
                    <span>{isEn ? 'Jesus Prayer' : 'صلاة يسوع'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
