/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Heart,
  Shield,
  RotateCcw,
  Check,
  Award,
  Sun,
  Flame,
} from 'lucide-react';
import { LITURGICAL_HOURS_DATA } from '../data/prayerFortressData';

interface HesychiaPathViewProps {
  currentUser?: User | null;
  onBackToHome: () => void;
  onOpenPrayerFortress?: () => void;
  onOpenRosary?: () => void;
  onOpenLibrary?: () => void;
}

const STORAGE_KEY = 'mokarasa_hesychia_path_progress_v1';

export const HesychiaPathView: React.FC<HesychiaPathViewProps> = ({
  currentUser,
  onBackToHome,
  onOpenPrayerFortress,
  onOpenRosary,
  onOpenLibrary,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  
  // Progress state for steps: 0: Welcome, 1: Prayer, 2: Scripture/Contemplation, 3: Jesus Prayer, 4: Evening/Thanksgiving
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Completed status for each step today
  const [stepCompleted, setStepCompleted] = useState<Record<number, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY}_${todayStr}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  // Notes or reflection for step 4
  const [eveningReflection, setEveningReflection] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(`${STORAGE_KEY}_note_${todayStr}`) || '';
      } catch {}
    }
    return '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`${STORAGE_KEY}_${todayStr}`, JSON.stringify(stepCompleted));
      } catch {}
    }
  }, [stepCompleted, todayStr]);

  const handleCompleteStep = (stepIdx: number) => {
    soundManager.playCorrect();
    const updated = { ...stepCompleted, [stepIdx]: true };
    setStepCompleted(updated);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    try {
      localStorage.setItem(`${STORAGE_KEY}_note_${todayStr}`, eveningReflection);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const totalSteps = 5;
  const completedCount = Object.values(stepCompleted).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in text-right font-sans" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-800/30">
        <button
          onClick={() => {
            soundManager.playTick();
            onBackToHome();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية</span>
        </button>

        <div className="text-xs text-amber-400 font-spiritual font-semibold flex items-center gap-1.5">
          <span>🌿 مسار ممشى السكون اليومي</span>
        </div>
      </div>

      {/* Hero Header & Progress */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-[#1c140d] to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-500/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>قانون اليوم الروحي الاختياري</span>
            </div>
            <h1 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100">
              🕯️ ممشى السكون والهدوء الداخلي
            </h1>
          </div>

          <div className="bg-stone-950/80 px-4 py-2.5 rounded-2xl border border-amber-500/30 text-center">
            <span className="text-[10px] text-stone-400 block">إنجاز اليوم</span>
            <span className="text-sm font-bold text-amber-300 font-mono">{completedCount} من {totalSteps} خطوات ({progressPercent}%)</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          تجربة روحية اختيارية تنظّم يومك بهدوء بين الصلاة، التأمل في الكلمة، صلاة يسوع، وقفة الشكر المسائية؛ دون إجبار ودون ضغوط، لتظل روحك في حضرة الآب السماوي.
        </p>

        {/* Step Tabs Header */}
        <div className="grid grid-cols-5 gap-1.5 pt-2">
          {[
            { id: 0, title: 'البداية' },
            { id: 1, title: 'الصلاة' },
            { id: 2, title: 'التأمل' },
            { id: 3, title: 'صلاة يسوع' },
            { id: 4, title: 'الشكر' },
          ].map((st) => {
            const isSelected = currentStep === st.id;
            const isDone = stepCompleted[st.id];
            return (
              <button
                key={st.id}
                onClick={() => {
                  soundManager.playTick();
                  setCurrentStep(st.id);
                }}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex flex-col items-center gap-1 border ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                    : isDone
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/40'
                    : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{st.id + 1}</span>
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <span className="hidden sm:inline truncate max-w-full">{st.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-6">
        
        {/* STEP 0: Welcome */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">الخطوة الأولى من ٥</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                ✨ أهلاً بك في ممشى السكون والهدوء
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                «في الهدوء والطُمأنينة تكون قوتكم» (إشعياء ٣٠: ١٥). هذا المسار مصمم ليكون واحة هادئة تتنقل فيها بين محطات الصلاة والكلمة دون استعجال.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <h4 className="font-spiritual text-sm font-bold text-amber-200">إرشادات هادئة للمسار:</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-300 list-disc list-inside">
                <li>لا يوجد وقت محدد أو إجبار على إنهاء كل الخطوات دفعة واحدة.</li>
                <li>يمكنك تخطي أي خطوة والانتقال للمحطة التالية متى شئت.</li>
                <li>يتم حفظ تقدمك تلقائياً على جهازك المحلي بكل أمان.</li>
                <li>الهدف ليس إنجاز مهام، بل الدخول في سكينة الحضور الإلهي.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <span className="text-xs text-stone-400">ابدأ رحلتك اليومية بهدوء</span>
              <button
                onClick={() => {
                  if (!stepCompleted[0]) handleCompleteStep(0);
                  soundManager.playTick();
                  setCurrentStep(1);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>ابدأ محطة الصلاة</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Prayer */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">الخطوة الثانية من ٥</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                🙏 صلاة السكون الصباحية أو المسائية
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                اختر صلاة هادئة من حصن الأجبية أو افتح حصن الصلاة الكامل لتخصيص وقتك مع المزمور المناسب لساعتك الحالية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400">مزمور مختيار للسكون (مزمور ٢٣):</span>
                <p className="font-spiritual text-sm sm:text-base text-stone-200 leading-relaxed italic">
                  «الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ. فِي مَرَاعٍ خُضْرٍ يُرْبِضُنِي. إِلَى مِيَاهِ الرَّاحَةِ يُورِدُنِي. يَرُدُّ نَفْسِي. يَهْدِينِي إِلَى سُبُلِ الْبِرِّ من أجلِ اسْمِهِ.»
                </p>
              </div>

              {onOpenPrayerFortress && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      onOpenPrayerFortress();
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 font-bold text-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>فتح حصن الأجبية والصلوات الكاملة 🛡️</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setCurrentStep(0);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs hover:bg-stone-700 transition cursor-pointer"
              >
                السابق
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCompleteStep(1)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    stepCompleted[1]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-600/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{stepCompleted[1] ? 'تم إتمام الصلاة' : 'تأكيد إتمام الصلاة'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playTick();
                    setCurrentStep(2);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>التأمل الكتابي</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Scripture & Contemplation */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">الخطوة الثالثة من ٥</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                📖 كلمة وتأمل هادئ
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                اقرأ آية اليوم وتأمل في عمق حضور الله ومعيته في حياتك اليومية، أو تصفح المكتبة الكنسية لمزيد من القراءة.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3 text-right">
              <span className="text-[11px] font-bold text-amber-400 block">تأمل الآباء اليومي:</span>
              <p className="font-spiritual text-sm sm:text-base text-amber-100 leading-relaxed">
                «اجعل قلبك هادئاً كصفحة بحيرة صافية، لكي تنعكس عليها شمس بركات الله دون تشويش أو اضطراب.»
              </p>
              <span className="text-[11px] text-stone-400 block">— من بستان الآباء الرهبان</span>

              {onOpenLibrary && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      onOpenLibrary();
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 font-bold text-xs transition cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    <span>تصفح المكتبة والكتب الكاملة 📚</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setCurrentStep(1);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs hover:bg-stone-700 transition cursor-pointer"
              >
                السابق
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCompleteStep(2)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    stepCompleted[2]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-600/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{stepCompleted[2] ? 'تم إتمام التأمل' : 'تأكيد إتمام التأمل'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playTick();
                    setCurrentStep(3);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>محطة صلاة يسوع</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Jesus Prayer */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">الخطوة الرابعة من ٥</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                📿 مسبحة صلاة يسوع والهيزيكيا
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                اربط أنفاسك باسم رب المجد يسوع: «يا ربي يسوع المسيح، ارحمني أنا الخاطئ». يمكنك الانتقال إلى المسبحة التفاعلية الحقيقية بضغطة زر.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-600/20 border-2 border-amber-500/40 mx-auto flex items-center justify-center text-2xl text-amber-300 shadow-inner">
                📿
              </div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                «يَا رَبِّي يَسُوعَ الْمَسِيحِ، ارْحَمْنِي أَنَا الْخَاطِئ»
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                الصلاة الدائمة في القلب تطرد أفكار الاضطراب وتملأ الكيان كله بسلام المسيح الفائق.
              </p>

              {onOpenRosary && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      onOpenRosary();
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer inline-flex items-center gap-2 shadow-md"
                  >
                    <span>فتح المسبحة التفاعلية الكاملة 📿</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setCurrentStep(2);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs hover:bg-stone-700 transition cursor-pointer"
              >
                السابق
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCompleteStep(3)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    stepCompleted[3]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-600/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{stepCompleted[3] ? 'تم إتمام صلاة يسوع' : 'تأكيد إتمام صلاة يسوع'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playTick();
                    setCurrentStep(4);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <span>محطة الشكر والختام</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Evening / Thanksgiving Reflection */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 font-mono">الخطوة الخامسة والأخيرة</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                🌅 وقفة الشكر ومراجعة اليوم
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                سجل باختصار نعمة واحدة شكرت الله عليها اليوم، أو اترك خاطرة هادئة لنفسك قبل النوم أو نهاية خلوتك. (ملاحظة: هذه الخاطرة خاصة جداً وتُحفظ محلياً على جهازك فقط).
              </p>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-4">
              <textarea
                rows={4}
                value={eveningReflection}
                onChange={(e) => setEveningReflection(e.target.value)}
                placeholder="اكتب هنا مظاهر معونة الله اليوم، أو شكراً قلبياً وسط الظروف..."
                className="w-full p-4 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed font-spiritual"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>حفظ الخاطرة محلياً</span>
                </button>
              </div>
            </form>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                onClick={() => {
                  soundManager.playTick();
                  setCurrentStep(3);
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-200 font-bold text-xs hover:bg-stone-700 transition cursor-pointer"
              >
                السابق
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCompleteStep(4)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                    stepCompleted[4]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-600/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{stepCompleted[4] ? 'تم إتمام الختام' : 'تأكيد إتمام خطوة الشكر'}</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playTick();
                    onBackToHome();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  إنهاء العودة للرئيسية 🏠
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
