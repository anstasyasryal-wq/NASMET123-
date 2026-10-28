import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Heart, ChevronLeft, CheckCircle2, Calendar, Clock, Sparkles, Award } from 'lucide-react';
import { ScheduledPrayerReminders } from './ScheduledPrayerReminders';
import { AnnualReadingTracker } from './AnnualReadingTracker';
import { SpiritualMaturityTests } from './SpiritualMaturityTests';
import { ConsecrationTree } from './ConsecrationTree';
import { JesusPrayerRosary } from './JesusPrayerRosary';

interface SpiritualLifeViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onOpenSpiritualGuide: () => void;
  onBackToHome: () => void;
  onNavigateToPrayerFortress?: () => void;
}

export const SpiritualLifeView: React.FC<SpiritualLifeViewProps> = ({
  currentUser,
  onOpenLogin,
  onOpenSpiritualGuide,
  onBackToHome,
  onNavigateToPrayerFortress,
}) => {
  const [activeTab, setActiveTab] = useState<'annual_plan' | 'jesus_rosary' | 'maturity_tests' | 'scheduled_prayers' | 'starter_days' | 'consecration_tree'>('annual_plan');
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2]);

  const toggleDay = (day: number) => {
    soundManager.playTick();
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const planDays = [
    {
      day: 1,
      title: 'اليوم الأول: هدوء المخدع وبدء المسيرة',
      reading: 'مزمور 1 + إنجيل متى 5: 1-12',
      meditation: '«طُوبَى لِلأَنْقِيَاءِ الْقَلْبِ، لأَنَّهُمْ يُعَايِنُونَ اللهَ». ابدأ يومك بثلاث دقائق سكون كامل.',
    },
    {
      day: 2,
      title: 'اليوم الثاني: سر الإفراز وحراسة الفكر',
      reading: 'مزمور 23 + رسالة فيلبي 4: 4-9',
      meditation: '«الرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ». سلّم مخاوفك ليد الراعي الصالح.',
    },
    {
      day: 3,
      title: 'اليوم الثالث: محبة الله الفياضة والغفران',
      reading: 'مزمور 103 + 1 يوحنا 4: 7-21',
      meditation: '«نَحْنُ نُحِبُّهُ لأَنَّهُ هُوَ أَحَبَّنَا أَوَّلاً». صلّ اليوم من أجل كل من أساء إليك.',
    },
    {
      day: 4,
      title: 'اليوم الرابع: خدمة الوداعة والاتضاع',
      reading: 'مزمور 131 + إنجيل يوحنا 13: 1-17',
      meditation: '«تَعَلَّمُوا مِنِّي، لأَنِّي وَدِيعٌ وَمُتَوَاضِعُ الْقَلْبِ، فَتَجِدُوا رَاحَةً لِنُفُوسِكُمْ».',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-emerald-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-emerald-400" />
          <span>مخدع الصلاة وخطة القراءة اليومية والسنوية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          ☀️ الحياة الروحية وصلاة المخدع
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          برنامج متكامل للمكرسين يضم خطة القراءة السنوية الشاملة (365 يوماً)، اختبارات النضج الروحي التفاعلية، ومنبهات صلوات الأجبية.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900/90 rounded-2xl border border-amber-800/40 overflow-x-auto text-xs font-bold scrollbar-none shadow-md">
        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('annual_plan');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'annual_plan'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-300" />
          <span>خطة القراءة السنوية (365 يوماً)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('jesus_rosary');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'jesus_rosary'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <span className="text-base">📿</span>
          <span>مسبحة صلاة يسوع (الاهتزاز اللمسي)</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('maturity_tests');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'maturity_tests'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Award className="w-4 h-4 text-teal-300" />
          <span>اختبارات النضج الروحي التفاعلية</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('scheduled_prayers');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'scheduled_prayers'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>منبهات صلوات الأجبية والسواعي</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('starter_days');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'starter_days'
              ? 'bg-gradient-to-r from-stone-700 to-stone-800 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-stone-300" />
          <span>محطات البداية السريعة</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('consecration_tree');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'consecration_tree'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <span className="text-base">🌳</span>
          <span>شجرة التكريس والثمار</span>
        </button>
      </div>

      {/* Tab 1: Annual Reading Tracker */}
      {activeTab === 'annual_plan' && (
        <AnnualReadingTracker currentUser={currentUser} onOpenLogin={onOpenLogin} />
      )}

      {/* Tab: Jesus Prayer Rosary with Haptic Feedback */}
      {activeTab === 'jesus_rosary' && (
        <JesusPrayerRosary />
      )}

      {/* Tab 2: Maturity Tests */}
      {activeTab === 'maturity_tests' && (
        <SpiritualMaturityTests currentUser={currentUser} />
      )}

      {/* Tab 3: Scheduled Prayers */}
      {activeTab === 'scheduled_prayers' && (
        <div className="space-y-6">
          {onNavigateToPrayerFortress && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 border-2 border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/30 text-amber-300 flex items-center justify-center text-2xl border border-amber-500/40 shrink-0">
                  🛡️
                </div>
                <div>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                    حصن الصلاة اليومي (مزامير وصلوات طقسية حية)
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    اقتراح مزمور وصلاة قصيرة بحسب ساعات الكنيسة السبع وطقس الأيام، مع مسبحة صلاة يسوع ودروع الطوارئ.
                  </p>
                </div>
              </div>
              <button
                onClick={onNavigateToPrayerFortress}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0"
              >
                دخول حصن الصلاة اليومي ←
              </button>
            </div>
          )}
          <ScheduledPrayerReminders currentUser={currentUser} />
        </div>
      )}

      {/* Tab 4: Starter Days */}
      {activeTab === 'starter_days' && (
        <div className="space-y-4">
        {planDays.map((item) => {
          const isDone = completedDays.includes(item.day);
          return (
            <div
              key={item.day}
              className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                isDone
                  ? 'bg-stone-900/90 border-emerald-500/60 shadow-md'
                  : 'bg-stone-900/60 border-stone-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 font-mono">
                    اليوم {item.day}
                  </span>
                  {isDone && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600">
                      مكتمل بنعمة الله
                    </span>
                  )}
                </div>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-stone-100">
                  {item.title}
                </h3>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-amber-200 font-semibold">
                  📖 القراءة: {item.reading}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {item.meditation}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-end">
                <button
                  onClick={() => toggleDay(item.day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'أتممت القراءة' : 'تحديد كمكتمل'}</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Tab 5: Consecration Tree */}
      {activeTab === 'consecration_tree' && (
        <ConsecrationTree currentUser={currentUser} />
      )}
    </div>
  );
};
