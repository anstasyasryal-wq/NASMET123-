/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Scale,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ScenarioOption {
  id: string;
  text: string;
  isDiscernmentPath: boolean;
  verdictType: 'wise' | 'harsh' | 'lax';
  patristicRuling: string;
  patristicFather: string;
  spiritualImpact: string;
}

interface DiscernmentScenario {
  id: string;
  title: string;
  category: string;
  situation: string;
  biblicalRoot: string;
  options: ScenarioOption[];
}

const SCENARIOS: DiscernmentScenario[] = [
  {
    id: 'sc-1',
    title: 'حرب الفتور وجفاف الدموع في صلاة منتصف الليل',
    category: 'صلاة المخدع',
    situation:
      'تقف في قلايتك أو مخدعك لتصلي صلاة نصف الليل، لكنك تشعر بثقل شديد وجفاف كامل في قلبك وغياب أي تأثر روحي، مع إلحاح جسدي قوي للخلود إلى النوم.',
    biblicalRoot: '«أَهكَذَا مَا قَدَرْتُمْ أَنْ تَسْهَرُوا مَعِي سَاعَةً وَاحِدَةً؟» (متى 26: 40)',
    options: [
      {
        id: 'opt-1',
        text: 'إغلاق الأجبية فوراً والنوم بحجة أن الصلاة بلا مشاعر لا يقبلها الله.',
        isDiscernmentPath: false,
        verdictType: 'lax',
        patristicRuling:
          '«من يترك الصلاة حين تجف مشاعره، يسقط في فخ العدو؛ فالصلاة في وقت الجفاف تثبت أمانتك أمام الله وتزن أضعاف الصلاة في وقت التعزية».',
        patristicFather: 'مار إسحق السرياني',
        spiritualImpact: 'استسلام للخمول الروحي وفقدان فضيلة الصبر والأمانة.',
      },
      {
        id: 'opt-2',
        text: 'الاستمرار في الوقوف بأمانة، وتلاوة المزامير ببطء مع صلاة يسوع طلباً للمعونة دون اشتراط تعزيات حسية.',
        isDiscernmentPath: true,
        verdictType: 'wise',
        patristicRuling:
          '«إن لم تكن لك دموع، فقدم لله صلاة الإرادة؛ فالأمانة في وقت القحط هي ذبيحة حب حقيقية تفرح قلب الفادي».',
        patristicFather: 'القديس يوحنا الدرجي (سلم الفضائل)',
        spiritualImpact: 'نضج روحي عميق، وغلبة على تقلبات المشاعر، وتثبيت لنذر التكريس.',
      },
      {
        id: 'opt-3',
        text: 'إجبار الجسد على مطانيات عنيفة حتى الإنهاك الشديد كعقوبة قاسية للنفس.',
        isDiscernmentPath: false,
        verdictType: 'harsh',
        patristicRuling:
          '«التطرف في قهر الجسد بغير إرشاد روحي يورث كبرياءً خفياً أو يكسر قوى الجسد فيعجز عن الصلاة نهائياً. الإفراز يزن الأمور بميزان الوداعة».',
        patristicFather: 'الأنبا بيمين من آباء البرية',
        spiritualImpact: 'جهاد جسدي بغير تمييز قد يقود إلى الإنهاك أو اليأس.',
      },
    ],
  },
  {
    id: 'sc-2',
    title: 'مواجهة مديح المخدومين وإغراء الذات بالكرامة',
    category: 'حراسة القلب والخدمة',
    situation:
      'بعد إلقاء عظة روحية مؤثرة أو إتمام خدمة مباركة، بدأ المخدومون في الإشادة بك وامتداح حكمتك وفصاحتك ورتبتك، وشعرت بحركة خفية من الرضا الذاتي وحب الظهور.',
    biblicalRoot: '«كَذلِكَ أَنْتُمْ أَيْضًا، مَتَى فَعَلْتُمْ كُلَّ مَا أُمِرْتُمْ بِهِ فَقُولُوا: إِنَّنَا عَبِيدٌ بَطَّالُونَ» (لوقا 17: 10)',
    options: [
      {
        id: 'opt-1',
        text: 'التفاعل مع المديح والاسترسال في الحديث عنه أمام الآخرين بحجة إظهار نجاح الخدمة.',
        isDiscernmentPath: false,
        verdictType: 'lax',
        patristicRuling:
          '«حب المجد الباطل لص يسرق كنوز الفضائل في وضح النهار بغير أن يشعر صاحبه».',
        patristicFather: 'القديس باسيليوس الكبير',
        spiritualImpact: 'ضياع أجر الخدمة السماوي وسقوط في فخ العجب بالذات.',
      },
      {
        id: 'opt-2',
        text: 'تحويل المجد سراً للمسيح في القلب، وشكر المخدومين بلطف واقتضاب، ثم الانفراد في المخدع لطلب الستر والاتضاع.',
        isDiscernmentPath: true,
        verdictType: 'wise',
        patristicRuling:
          '«إذا امتدحك الناس، فاذكر خطاياك الخفية التي سترها الله برحمته، لتبتلع ريح المديح بحرارة التوبة».',
        patristicFather: 'القديس يوحنا ذهبي الفم',
        spiritualImpact: 'حراسة الكنز الداخلي وتكريس النصرة لمجد اسم الله وحده.',
      },
      {
        id: 'opt-3',
        text: 'توبيخ المخدومين بعنف علني وإظهار الغضب الشديد لكي يُعرف أنك زاهد في المديح.',
        isDiscernmentPath: false,
        verdictType: 'harsh',
        patristicRuling:
          '«الذي يهرب من المديح بصخب وغضب يطلب مديحاً أعظم بالاتضاع الزائف؛ فالاتضاع الحقيقي هادئ ووديع».',
        patristicFather: 'القديس مكاريوس الكبير',
        spiritualImpact: 'اتضاع ظاهري مصطنع يعثر المخدومين ولا يبني السلام.',
      },
    ],
  },
  {
    id: 'sc-3',
    title: 'حفظ سلام القلب عند الإساءة العلنية في الخدمة',
    category: 'العلاقات والمحبة',
    situation:
      'خلال اجتماع خدمة أو ترتيب كنسي، قام أحد الخدام أو المكرسين بتوجيه نقد جارح واتهام باطل لك أمام الجميع بغير وجه حق.',
    biblicalRoot: '«لاَ تُجَازُوا أَحَدًا عَنْ شَرّ بِشَرّ. مُعْتَنِينَ بِأُمُورٍ حَسَنَةٍ قُدَّامَ جَمِيعِ النَّاسِ» (رومية 12: 17)',
    options: [
      {
        id: 'opt-1',
        text: 'الصمت الهادئ في تلك اللحظة مع الصلاة سراً من أجله، ثم معاتبة الأخ على انفراد بمحبة ووداعة لإزالة العثرة.',
        isDiscernmentPath: true,
        verdictType: 'wise',
        patristicRuling:
          '«بالصمت تمتص لهيب الغضب، وبالمعاتبة الهادئة في الخفاء تكسب أخاك وتحفظ ناموس المسيح».',
        patristicFather: 'الأنبا أنطونيوس كوكب البرية',
        spiritualImpact: 'انتصار المحبة الإنجيلية، وستر الخلاف، واقتناء سلام يفوق العقل.',
      },
      {
        id: 'opt-2',
        text: 'الرد الفوري الصارم وإحراجه أمام الحاضرين للدفاع عن هيبة التكريس والكرامة الشخصية.',
        isDiscernmentPath: false,
        verdictType: 'harsh',
        patristicRuling:
          '«من يجيب الغضب بالغضب يشبه من يطفئ النار بالزيت؛ فالكرامة الحقيقية للمكرس هي احتمال الإهانة كالمسيح».',
        patristicFather: 'القديس يوحنا كاسيان',
        spiritualImpact: 'إشعال نار الخصام وتحطيم شهادة الخدمة في عيون المخدومين.',
      },
      {
        id: 'opt-3',
        text: 'مقاطعته بالكلية وإضمار الغيظ والبغضة في القلب دون كلام أو صلاة.',
        isDiscernmentPath: false,
        verdictType: 'lax',
        patristicRuling:
          '«السكوت الخارجي مع بغضة القلب هو سم قاتل للنفس؛ فالصوم والصلوات باطلة إن لم نغفر لإخوتنا».',
        patristicFather: 'القديس أفرام السرياني',
        spiritualImpact: 'جرح عميق في الحياة الروحية وحجاب يمنع استجابة الصلاة.',
      },
    ],
  },
];

export const SpiritualDiscernmentSimulator: React.FC = () => {
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [discernmentScore, setDiscernmentScore] = useState<number>(0);
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);

  const scenario = SCENARIOS[currentScenarioIdx];
  const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return; // prevent multiple taps
    soundManager.playTick();
    setSelectedOptionId(optId);
    setShowResult(true);

    const opt = scenario.options.find((o) => o.id === optId);
    if (opt?.isDiscernmentPath) {
      soundManager.playCorrect();
      setDiscernmentScore((prev) => prev + 25);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }

    if (!completedScenarios.includes(scenario.id)) {
      setCompletedScenarios([...completedScenarios, scenario.id]);
    }
  };

  const handleNextScenario = () => {
    soundManager.playTick();
    if (currentScenarioIdx < SCENARIOS.length - 1) {
      setCurrentScenarioIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowResult(false);
    } else {
      // Completed all
      setCurrentScenarioIdx(0);
      setSelectedOptionId(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    soundManager.playTick();
    setCurrentScenarioIdx(0);
    setSelectedOptionId(null);
    setShowResult(false);
    setDiscernmentScore(0);
    setCompletedScenarios([]);
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 border border-amber-600/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>تاج الفضائل وحكمة الآباء</span>
            </span>
            <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100">
              ⚖️ ميزان الإفراز والتمييز الروحي للمكرس
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              «الإفراز هو عين النفس وسراجها» (مار إسحق السرياني). محاكاة لمواقف مخدعية ورعوية حية
              تدرب المكرس على روح الحكمة وتجنب التطرف أو التراخي.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/80 p-3 rounded-2xl border border-stone-800 text-center shrink-0">
            <div>
              <span className="text-[10px] text-stone-400 block">نقاط الإفراز</span>
              <span className="font-mono text-base font-bold text-amber-400">{discernmentScore}</span>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <div>
              <span className="text-[10px] text-stone-400 block">المواقف المنجزة</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                {completedScenarios.length} / {SCENARIOS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-stone-800 space-y-6 shadow-2xl relative">
        {/* Scenario Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              الموقف {currentScenarioIdx + 1} من {SCENARIOS.length}
            </span>
            <span className="text-xs text-stone-400 font-bold">{scenario.category}</span>
          </div>
          <span className="font-spiritual text-xs text-stone-400 font-serif">
            {scenario.biblicalRoot}
          </span>
        </div>

        {/* The Dilemma Narrative */}
        <div className="p-5 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-2">
          <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
            {scenario.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
            {scenario.situation}
          </p>
        </div>

        {/* The 3 Branching Options */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-amber-300 block">
            كيف تتصرف بحسب روح التكريس الإنجيلي والإفراز؟ (اختر مساراً):
          </span>

          <div className="space-y-2.5">
            {scenario.options.map((opt, i) => {
              const isSelected = selectedOptionId === opt.id;
              let btnStyle = 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/50';

              if (showResult) {
                if (opt.isDiscernmentPath) {
                  btnStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/70 border-rose-500 text-rose-100 shadow-md';
                } else {
                  btnStyle = 'bg-stone-950/40 border-stone-800 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-2xl border text-right transition cursor-pointer flex items-start gap-3 touch-manipulation ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-stone-900 border border-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-xs sm:text-sm font-bold leading-relaxed flex-1">
                    {opt.text}
                  </span>
                  {showResult && opt.isDiscernmentPath && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mr-1" />
                  )}
                  {showResult && isSelected && !opt.isDiscernmentPath && (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mr-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Card (Revealed after choice) */}
        {showResult && selectedOption && (
          <div
            className={`p-5 rounded-2xl border space-y-3 animate-fade-in ${
              selectedOption.isDiscernmentPath
                ? 'bg-emerald-950/40 border-emerald-500/60'
                : 'bg-amber-950/30 border-amber-600/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <strong
                className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  selectedOption.isDiscernmentPath ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {selectedOption.isDiscernmentPath
                  ? '✨ مسار الإفراز المتزن المبارك (+25 نقطة إفراز)'
                  : '⚠️ مسار غير متزن (يحتاج تمييز روحي أدق)'}
              </strong>
              <span className="text-[11px] text-stone-400 font-bold">
                حكم الآباء: {selectedOption.patristicFather}
              </span>
            </div>

            <p className="font-spiritual text-xs sm:text-sm text-stone-200 italic leading-relaxed">
              «{selectedOption.patristicRuling}»
            </p>

            <div className="text-[11px] text-stone-300 bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
              <strong>الأثر الروحي:</strong> {selectedOption.spiritualImpact}
            </div>

            {/* Next Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={handleNextScenario}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{currentScenarioIdx < SCENARIOS.length - 1 ? 'الموقف التالي ➔' : 'إعادة استعراض المواقف 🔄'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
