/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Dna,
  Sparkles,
  Info,
  CheckCircle2,
  Atom,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Activity,
  Microscope,
} from 'lucide-react';

interface ParameterState {
  polymeraseAccuracy: number; // 90 to 100%
  mutationToleration: number; // 1 to 10
  chiralityPurity: number; // 50% (racemic) to 100% (homochiral)
}

export const BioTheologyLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mitochondria' | 'fine_tuning' | 'scripture_matrix'>('mitochondria');

  // Fine-tuning simulation state
  const [params, setParams] = useState<ParameterState>({
    polymeraseAccuracy: 99.9,
    mutationToleration: 3,
    chiralityPurity: 100,
  });

  const [activeMitoNode, setActiveMitoNode] = useState<number>(0);

  // Mitochondrial lineage stages
  const mitoStages = [
    {
      id: 0,
      title: 'الأصل البشري الواحد (ميتوكوندريا حواء)',
      biblicalRef: '«وَدَعَا آدَمُ اسْمَ امْرَأَتِهِ "حَوَّاءَ"، لأَنَّهَا أُمُّ كُلِّ حَيٍّ» (تكوين 3: 20)',
      scientificFact:
        'يثبت علم الجينات الحديث أن جميع البشر المعاصرين حول الأرض يحملون حمضاً نووياً ميتوكوندرياً (mtDNA) مشتقاً حصرياً من جهة الأم لسلف أنثوي مشترك واحد (Mitochondrial Eve).',
      patristicInsight:
        '«خلق الله البشرية كلها من أصل واحد ليغرس فينا روح الإخوة والمحبة الجامعة، فلا يتعالى جنس على جنس ولا شعب على شعب». — القديس يوحنا ذهبي الفم',
      marker: 'L-Haplogroup Root',
      icon: '🧬',
    },
    {
      id: 1,
      title: 'وراثة الأمومة غير المختلطة (Maternal Inheritance)',
      biblicalRef: '«مِنْ دَمٍ وَاحِدٍ صَنَعَ كُلَّ أُمَّةٍ مِنَ النَّاسِ يَسْكُنُونَ عَلَى كُلِّ وَجْهِ الأَرْضِ» (أعمال 17: 26)',
      scientificFact:
        'الميتوكوندريا تنتقل من الأم فقط إلى الأبناء دون إعادة اتحاد جيني (Recombination)، مما يحافظ على التوقيع الوراثي ثابتاً عبر القرون كختم إلهي لا يمحى.',
      patristicInsight:
        '«العلم الحقيقي خادم للإيمان؛ فكلما غاص الإنسان في أسرار الخلية، وجد توقيع يد الخالق مطبوعاً على أدق تفاصيلها». — القديس غريغوريوس النيسي',
      marker: 'mtDNA Circular Ring',
      icon: '🌿',
    },
    {
      id: 2,
      title: 'معدل الطفرات وساعة الجينات الجزيئية',
      biblicalRef: '«بِكَلِمَةِ الرَّبِّ صُنِعَتِ السَّمَاوَاتُ، وَبِنَسَمَةِ فِيهِ كُلُّ جُنُودِهَا» (مزمور 33: 6)',
      scientificFact:
        'تشير دراسات معدل التطفير الفعلي في mtDNA إلى عمر بشري حديث ينسجم تماماً مع الرؤية الكتابية لنشأة البشرية، ويدحض افتراضات التطور العشوائي غير الموجه.',
      patristicInsight:
        '«لم يترك الله العالم لصدفة عمياء، بل ضبط كل ناموس بحكمة فائقة، لتشهد الخلائق لمنشئها في كل زمان». — القديس باسيليوس الكبير',
      marker: 'Molecular Clock',
      icon: '⏳',
    },
  ];

  // Calculate life viability score based on parameters
  const isViable =
    params.polymeraseAccuracy >= 99.5 &&
    params.chiralityPurity >= 98 &&
    params.mutationToleration <= 4;

  const viabilityScore = Math.max(
    0,
    Math.round(
      (params.polymeraseAccuracy / 100) * 40 +
        (params.chiralityPurity / 100) * 40 +
        ((10 - params.mutationToleration) / 10) * 20
    )
  );

  const resetFineTuning = () => {
    soundManager.playTick();
    setParams({
      polymeraseAccuracy: 99.9,
      mutationToleration: 3,
      chiralityPurity: 100,
    });
  };

  const handleTestDesign = () => {
    if (isViable) {
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      soundManager.playTick();
    }
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 border border-emerald-600/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-emerald-400" />
              <span>مختبر التناغم العلمي واللاهوتي</span>
            </span>
            <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100">
              🧬 الشفرة الوراثية والتصميم الخالق
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              محاكاة تفاعلية تجمع بين دقة علم الجينات المعاصر (DNA) وشهادة الكتاب المقدس وآباء الكنيسة
              على التصميم الحكيم والإتقان المعجز.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🔬
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900/90 rounded-2xl border border-stone-800 text-xs font-bold shadow-md overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('mitochondria');
          }}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'mitochondria'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Dna className="w-4 h-4 text-emerald-400" />
          <span>ميتوكوندريا حواء والأصل الواحد</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('fine_tuning');
          }}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'fine_tuning'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Atom className="w-4 h-4 text-amber-400" />
          <span>محاكي الضبط الدقيق للخلية</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('scripture_matrix');
          }}
          className={`px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'scripture_matrix'
              ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>مصفوفة الآيات والشهادات الآبائية</span>
        </button>
      </div>

      {/* TAB 1: MITOCHONDRIAL EVE SIMULATOR */}
      {activeTab === 'mitochondria' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-7 rounded-3xl bg-stone-900 border border-stone-800 space-y-4">
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <span>🧬</span>
              <span>شجرة الأنساب الميتوكوندرية (Mitochondrial Lineage Tree)</span>
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              اضغط على كل محطة لاستكشاف كيف يلتقي العلم الحديث مع كلمة الله في إثبات وحدة الأصل البشري:
            </p>

            {/* Interactive Timeline Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {mitoStages.map((stg) => (
                <button
                  key={stg.id}
                  onClick={() => {
                    soundManager.playTick();
                    setActiveMitoNode(stg.id);
                  }}
                  className={`p-4 rounded-2xl text-right transition border cursor-pointer flex flex-col justify-between gap-3 ${
                    activeMitoNode === stg.id
                      ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/50 scale-[1.02]'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{stg.icon}</span>
                    <span className="text-[10px] font-mono font-bold bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                      {stg.marker}
                    </span>
                  </div>
                  <strong className="text-xs sm:text-sm font-bold block text-amber-200">
                    {stg.title}
                  </strong>
                </button>
              ))}
            </div>

            {/* Active Node Detail Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-stone-950 border border-emerald-600/30 space-y-4 shadow-xl animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  الشاهد الكتابي والتوثيق اللاهوتي:
                </span>
                <p className="font-spiritual text-sm sm:text-base font-bold text-amber-100 leading-relaxed">
                  {mitoStages[activeMitoNode].biblicalRef}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>الحقيقة البيولوجية المثبتة علمياً:</span>
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {mitoStages[activeMitoNode].scientificFact}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/30 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>الرؤية الآبائية العميقة:</span>
                </span>
                <p className="text-xs text-amber-100 italic leading-relaxed">
                  {mitoStages[activeMitoNode].patristicInsight}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CELLULAR FINE-TUNING SIMULATOR */}
      {activeTab === 'fine_tuning' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 sm:p-7 rounded-3xl bg-stone-900 border border-stone-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                  تجربة ضبط ثوابت الخلية الحية (Fine-Tuning Interactive Simulator)
                </h3>
                <p className="text-xs text-stone-300">
                  جرّب تغيير ثوابت نسخ الحمض النووي (DNA) لتكتشف استحالة قيام الحياة دون تصميم إلهي فائق:
                </p>
              </div>
              <button
                onClick={resetFineTuning}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="إعادة التعيين للقيم الإلهية الطبيعية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
            </div>

            {/* Slider 1: Polymerase Fidelity */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">
                  دقة إنزيم البوليميراز في تدقيق الشفرة الوراثية (DNA Polymerase Fidelity):
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {params.polymeraseAccuracy}%
                </span>
              </div>
              <input
                type="range"
                min="90"
                max="100"
                step="0.1"
                value={params.polymeraseAccuracy}
                onChange={(e) =>
                  setParams({ ...params, polymeraseAccuracy: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-stone-400">
                في الطبيعة، يمتلك إنزيم البوليميراز خاصية قراءة تصحيحية فورية بنسبة تفوق ٩٩.٩٪، وأي خلل
                طفيف يؤدي لتراكم طفرات مدمرة تقضي على الكائن الحي في أول جيل.
              </p>
            </div>

            {/* Slider 2: Homochirality */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">
                  النقاء التناظري للأحماض الأمينية (Homochirality - أحماض يسارية L-form):
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {params.chiralityPurity}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={params.chiralityPurity}
                onChange={(e) =>
                  setParams({ ...params, chiralityPurity: parseInt(e.target.value, 10) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-stone-400">
                جميع بروتينات الكائنات الحية تتكون حصرياً من أحماض أمينية ذات دوران يساري (L-amino acids).
                في التفاعلات العشوائية في المختبر تخرج بنسبة ٥٠/٥٠، وهو ما يمنع تماماً تكوّن البروتينات
                الحية دون صانع مدبّر.
              </p>
            </div>

            {/* Slider 3: Mutation Rate */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-200">
                  معدل التطفير الإشعاعي المسموح (Radiation Mutation Rate):
                </span>
                <span className="font-mono font-bold text-sky-400">
                  {params.mutationToleration} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={params.mutationToleration}
                onChange={(e) =>
                  setParams({ ...params, mutationToleration: parseInt(e.target.value, 10) })
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-stone-400">
                أنظمة إصلاح الحمض النووي (DNA Repair Systems) تعمل بآلية معقدة تشبه فرق إطفاء مبرمجة لحفظ سلامة الجينوم البشري.
              </p>
            </div>

            {/* Results Display */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isViable
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
                  : 'bg-rose-950/60 border-rose-500/60 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{isViable ? '✅' : '⚠️'}</span>
                  <strong className="text-sm">
                    {isViable
                      ? 'النظام الحيوي مستقر وقابل للحياة (شهدت الخلية بتصميم الخالق)'
                      : 'فشل النظام الحيوي وانحلال البروتينات (مستحيل نشوء الحياة عشوائياً)'}
                  </strong>
                </div>
                <span className="font-mono font-bold text-xs bg-stone-950 px-3 py-1 rounded-full border border-stone-800">
                  مؤشر الإتقان: {viabilityScore}%
                </span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {isViable
                  ? '«عَظِيمَةٌ هِيَ أَعْمَالُ الرَّبِّ، مَفْحُوصَةٌ عِنْدَ كُلِّ الْمَسْرُورِينَ بِهَا» (مزمور 111: 2). هذا الضبط الدقيق المتناهي برهان قاطع على وجود عقل إلهي حكيم خلق الحياة وقوّم أركانها.'
                  : 'تغيير طفيف في الثوابت يؤدي إلى موت الخلية وتفتت سلاسل البروتين في ثوانٍ، مما يؤكد أن الصدفة العشوائية لا يمكن أن تخلق كائناً حياً واحداً.'}
              </p>
              <button
                type="button"
                onClick={handleTestDesign}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer active:scale-95"
              >
                تأكيد النتيجة وإضافة نقاط معرفة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCRIPTURE & PATRISTIC HARMONY MATRIX */}
      {activeTab === 'scripture_matrix' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>📖</span>
                <span>مزمور 139: 13-16 والنسيج الجنيني</span>
              </span>
              <p className="font-spiritual text-xs text-amber-100 font-bold leading-relaxed">
                «لأَنَّكَ أَنْتَ اقْتَنَيْتَ كُلْيَتَيَّ. نَسَجْتَنِي فِي بَطْنِ أُمِّي. أَعْتَرِفُ لَكَ لأَنِّي قَدِ امْتَزْتُ عَجَبًا.
                عَجِيبَةٌ هِيَ أَعْمَالُكَ.. رَأَتْ عَيْنَاكَ أَعْضَائِي، وَفِي سِفْرِكَ كُلُّهَا كُتِبَتْ».
              </p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                التعبير النبوي «نسجتني» و«في سفرك كلها كتبت» يطابق بدقة متناهية مفهوم الشفرة الرقمية
                المكتوبة بالحروف الأربعة (A, T, C, G) التي تقرأ وتترجم إلى أنسجة وأعضاء في بطن الأم.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <span>📜</span>
                <span>القديس باسيليوس (عظات الأيام الستة)</span>
              </span>
              <p className="font-spiritual text-xs text-emerald-100 italic leading-relaxed">
                «إن كلمة الله التي قالت في البدء: "لتُخرج الأرض".. لم تكن كلمة عابرة، بل صارت ناموساً
                طبيعياً مستقراً في باطن المادة، يعطي البذور قدرتها على الإنبات وحفظ نوعها جيلاً بعد جيل».
              </p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                هذا التفسير الآبائي العميق للناموس المستقر في البذرة هو بذاته تعريف الحمض النووي (DNA)
                الذي يحفظ هوية كل كائن حي من الانحلال.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
