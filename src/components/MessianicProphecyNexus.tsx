/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronLeft,
  BookOpen,
  ArrowRightLeft,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Award,
  Layers,
} from 'lucide-react';

interface ProphecyNode {
  id: string;
  category: 'birth' | 'passion' | 'resurrection' | 'priesthood';
  categoryLabel: string;
  otBook: string;
  otVerse: string;
  otText: string;
  ntBook: string;
  ntVerse: string;
  ntText: string;
  hebrewTerm: string;
  greekTerm: string;
  patristicExegesis: string;
  patristicSaint: string;
  consecrationLesson: string;
}

const PROPHECIES_DATA: ProphecyNode[] = [
  {
    id: 'prop-1',
    category: 'birth',
    categoryLabel: 'التجسد والميلاد العذري',
    otBook: 'سفر إشعياء النبي (حوالي 730 ق.م)',
    otVerse: 'إشعياء 7: 14',
    otText: '«وَلكِنْ يُعْطِيكُمُ السَّيِّدُ نَفْسُهُ آيَةً: هَا الْعَذْرَاءُ تَحْبَلُ وَتَلِدُ ابْنًا وَتَدْعُو اسْمَهُ عِمَّانُوئِيلَ».',
    ntBook: 'إنجيل القديس متى',
    ntVerse: 'متى 1: 22-23',
    ntText: '«وَهذَا كُلُّهُ كَانَ لِكَيْ يَتِمَّ مَا قِيلَ مِنَ الرَّبِّ بِالنَّبِيِّ الْقَائِلِ: هُوَذَا الْعَذْرَاءُ تَحْبَلُ وَتَلِدُ ابْنًا، وَيَدْعُونَ اسْمَهُ عِمَّانُوئِيلَ».',
    hebrewTerm: 'עַלְמָה (Almah - العذراء البتول الخالصة)',
    greekTerm: 'Παρθένος (Parthenos)',
    patristicExegesis: '«حبلت العذراء بغير زرع بشر لكي تلد المخلص الذي يجدد الطبيعة البشرية ويحررها من سلطان الفساد الموروث».',
    patristicSaint: 'القديس أثناسيوس الرسولي (تجسد الكلمة)',
    consecrationLesson: 'دعوة المكرس لحفظ بتولية الفكر والقلب ليكون مسكناً طاهراً لحضور المسيح المستمر.',
  },
  {
    id: 'prop-2',
    category: 'birth',
    categoryLabel: 'التجسد والميلاد العذري',
    otBook: 'سفر ميخا النبي (حوالي 700 ق.م)',
    otVerse: 'ميخا 5: 2',
    otText: '«أَمَّا أَنْتِ يَا بَيْتَ لَحْمِ أَفْرَاتَةَ، وَأَنْتِ صَغِيرَةٌ أَنْ تَكُونِي بَيْنَ أُلُوفِ يَهُوذَا، فَمِنْكِ يَخْرُجُ لِي الَّذِي يَكُونُ مُتَسَلِّطًا عَلَى إِسْرَائِيلَ، وَمَخَارِجُهُ مُنْذُ الْقَدِيمِ، مُنْذُ أَيَّامِ الأَزَلِ».',
    ntBook: 'إنجيل القديس متى',
    ntVerse: 'متى 2: 5-6',
    ntText: '«فَقَالُوا لَهُ: فِي بَيْتِ لَحْمِ الْيَهُودِيَّةِ. لأَنَّهُ هكَذَا مَكْتُوبٌ بِالنَّبِيِّ: وَأَنْتِ يَا بَيْتَ لَحْمِ أَرْضَ يَهُوذَا لَسْتِ الصُّغْرَى...».',
    hebrewTerm: 'מִקֶּדֶם מִימֵי עוֹלָם (منذ الأزل الأزلي)',
    greekTerm: 'Ἐξόδοι ἀπ᾽ ἀρχῆς (مخارجه منذ البدء)',
    patristicExegesis: '«جمع النبي بين ولادتين: ولادة زمنية في بيت لحم الوديعة، وولادة أزلية فائقة من الآب قبل كل الدهور».',
    patristicSaint: 'القديس يوحنا ذهبي الفم',
    consecrationLesson: 'اختيار الأماكن البسيطة والمتضعة؛ فالله يفيض مجده في المواضع الخفية بعيداً عن كبرياء القصور.',
  },
  {
    id: 'prop-3',
    category: 'passion',
    categoryLabel: 'الفداء والصليب والآلام',
    otBook: 'مزامير داود النبي (حوالي 1000 ق.م)',
    otVerse: 'مزمور 22: 16-18',
    otText: '«ثَقَبُوا يَدَيَّ وَرِجْلَيَّ. أُحْصِي كُلَّ عِظَامِي. وَهُمْ يَنْظُرُونَ وَيَتَفَرَّسُونَ فِيَّ. يَقْسِمُونَ ثِيَابِي بَيْنَهُمْ، وَعَلَى لِبَاسِي يَقْتَرِعُونَ».',
    ntBook: 'إنجيل القديس يوحنا',
    ntVerse: 'يوحنا 19: 23-24',
    ntText: '«ثُمَّ إِنَّ الْعَسْكَرَ لَمَّا كَانُوا قَدْ صَلَبُوا يَسُوعَ، أَخَذُوا ثِيَابَهُ وَجَعَلُوهَا أَرْبَعَةَ أَقْسَامٍ... لِكَيْ يَتِمَّ الْكِتَابُ الْقَائِلُ: اقْتَسَمُوا ثِيَابِي بَيْنَهُمْ».',
    hebrewTerm: 'כָּאֲרִי יָדַי וְרַגְלָי (ثقبوا يدي ورجلي)',
    greekTerm: 'Ὤρυξαν χεῖράς μου (ثقبوا يدي)',
    patristicExegesis: '«كتب داود بالروح تفاصيل الصلب الروماني قبل أن يخترع الرومان عقوبة الصلب بمئات السنين، لكي لا يشك أحد أن الصليب كان بتدبير إلهي مسبق».',
    patristicSaint: 'القديس كيرلس الأورشليمي',
    consecrationLesson: 'تحمّل جراحات الخدمة وأتعاب الصليب بفرح، عالمين أن كل ألم للمسيح يعقبه فجر مجد لا يزول.',
  },
  {
    id: 'prop-4',
    category: 'passion',
    categoryLabel: 'الفداء والصليب والآلام',
    otBook: 'سفر إشعياء النبي (العبد المتألم)',
    otVerse: 'إشعياء 53: 5',
    otText: '«وَهُوَ مَجْرُوحٌ لأَجْلِ مَعَاصِينَا، مَسْحُوقٌ لأَجْلِ آثامِنَا. تَأْدِيبُ سَلاَمِنَا عَلَيْهِ، وَبِحُبُرِهِ شُفِينَا».',
    ntBook: 'رسالة بطرس الرسول الأولى',
    ntVerse: '1 بطرس 2: 24',
    ntText: '«الَّذِي حَمَلَ هُوَ نَفْسُهُ خَطَايَانَا فِي جَسَدِهِ عَلَى الْخَشَبَةِ، لِكَيْ نَمُوتَ عَنِ الْخَطَايَا فَنَحْيَا لِلْبِرِّ. الَّذِي بِجَلْدَتِهِ شُفِيتُمْ».',
    hebrewTerm: 'בַּחֲבֻרָתוֹ נִרְפָּא־לָנוּ (بجراحه شُفينا)',
    greekTerm: 'Μώλωπι ἰάθητε (بحبره شفيتم)',
    patristicExegesis: '«لم يكن موته عن عجز، بل بذل نفسه حباً؛ حمل جراحاتنا ليمنحنا بره وسلامه الفائق».',
    patristicSaint: 'القديس كيرلس الكبير',
    consecrationLesson: 'المكرس الحقيقي يحمل أثقال المخدومين في مخدعه ويشفع بالدموع عن الساقطين والمجروحين.',
  },
  {
    id: 'prop-5',
    category: 'resurrection',
    categoryLabel: 'القيامة والفداء والمجد',
    otBook: 'مزامير داود النبي',
    otVerse: 'مزمور 16: 10',
    otText: '«لأَنَّكَ لَنْ تَتْرُكَ نَفْسِي فِي الْهَاوِيَةِ. لَنْ تَدَعَ تَقِيَّكَ يَرَى فَسَادًا».',
    ntBook: 'سفر أعمال الرسل',
    ntVerse: 'أعمال 2: 31-32',
    ntText: '«سَبَقَ فَرَأَى وَتَكَلَّمَ عَنْ قِيَامَةِ الْمَسِيحِ، أَنَّهُ لَمْ تُتْرَكْ نَفْسُهُ فِي الْهَاوِيَةِ وَلاَ رَأَى جَسَدُهُ فَسَادًا. فَيَسُوعُ هذَا أَقَامَهُ اللهُ، وَنَحْنُ جَمِيعًا شُهُودٌ لِذلِكَ».',
    hebrewTerm: 'לֹא תִתֵּן חֲסִידְךָ לִרְאוֹת שָׁחַת (لن تدع صفيك يرى فساداً)',
    greekTerm: 'Οὐδὲ ἰδεῖν διαφθοράν (لا يرى انحلالاً)',
    patristicExegesis: '«حطم جسد القيامة شوكة الموت، فصار الجسد غير قابل للفساد وأعطانا عربون قيامة الأجساد في اليوم الأخير».',
    patristicSaint: 'القديس غريغوريوس النيصي',
    consecrationLesson: 'العيش في قوة القيامة ورجاء الأبدية، فلا يرهب المكرس ضيقاً أو اضطهاداً أو موتاً.',
  },
  {
    id: 'prop-6',
    category: 'priesthood',
    categoryLabel: 'الكهنوت والملكوت والشفاعة',
    otBook: 'مزامير داود النبي',
    otVerse: 'مزمور 110: 4',
    otText: '«أَقْسَمَ الرَّبُّ وَلَنْ يَنْدَمَ: أَنْتَ كَاهِنٌ إِلَى الأَبَدِ عَلَى رُتْبَةِ مَلْكِي صَادَقَ».',
    ntBook: 'الرسالة إلى العبرانيين',
    ntVerse: 'عبرانيين 7: 17، 24-25',
    ntText: '«لأَنَّهُ يَشْهَدُ أَنَّكَ كَاهِنٌ إِلَى الأَبَدِ عَلَى رُتْبَةِ مَلْكِي صَادِقَ... فَمِنْ ثَمَّ يَقْدِرُ أَنْ يُخَلِّصَ أَيْضًا إِلَى التَّمَامِ الَّذِينَ يَتَقَدَّمُونَ بِهِ إِلَى اللهِ، إِذْ هُوَ حَيٌّ فِي كُلِّ حِينٍ لِيَشْفَعَ فِيهِمْ».',
    hebrewTerm: 'עַל־דִּבְרָתִי מַלְכִּי־צֶדֶק (على رتبة ملكي صادق)',
    greekTerm: 'Κατὰ τὴν τάξιν Μελχισεδέκ',
    patristicExegesis: '«كهنوت المسيح كهنوت أزلي بالخبز والخمر، قائم على قوة حياة لا تزول، وشفاعته الكفارية دائمة أمام الآب».',
    patristicSaint: 'القديس يوحنا ذهبي الفم',
    consecrationLesson: 'الكهنوت والتكريس ليسا سلطة بشرية، بل مشاركة في ذبيحة الحب والشفاعة الدائمة عن الكنيسة.',
  },
];

export const MessianicProphecyNexus: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'birth' | 'passion' | 'resurrection' | 'priesthood'>('all');
  const [selectedProphecyId, setSelectedProphecyId] = useState<string>('prop-1');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredProphecies =
    activeCategory === 'all'
      ? PROPHECIES_DATA
      : PROPHECIES_DATA.filter((p) => p.category === activeCategory);

  const activeProphecy =
    PROPHECIES_DATA.find((p) => p.id === selectedProphecyId) || PROPHECIES_DATA[0];

  const handleSelect = (id: string) => {
    soundManager.playTick();
    setSelectedProphecyId(id);
  };

  const handleCopyStudy = async () => {
    soundManager.playTick();
    const text = `✝️ نبوة مسيانية وتحقيقها في العهد الجديد:\nالعهد القديم: ${activeProphecy.otText} (${activeProphecy.otVerse})\n\nالعهد الجديد: ${activeProphecy.ntText} (${activeProphecy.ntVerse})\n\nتفسير الآباء: «${activeProphecy.patristicExegesis}» — ${activeProphecy.patristicSaint}\n\nتطبيق «حسب قلب الله»: ais-pre-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-indigo-950 border border-amber-600/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>شبكة اللاهوت النبوي التفاعلية</span>
            </span>
            <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100">
              ✨ شبكة خيوط النور النبوية
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              استكشف الترابط المعجز بين نبوات العهد القديم وتحقيقها في المسيح يسوع بالأناجيل ورسائل
              العهد الجديد مع الدقة اللغوية والأبعاد الآبائية.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner shrink-0">
            📜
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900/90 rounded-2xl border border-stone-800 text-xs font-bold shadow-md overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'كافة النبوات (الكل)' },
          { id: 'birth', label: 'الميلاد والتجسد' },
          { id: 'passion', label: 'الصليب والآلام' },
          { id: 'resurrection', label: 'القيامة والمجد' },
          { id: 'priesthood', label: 'الكهنوت والشفاعة' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundManager.playTick();
              setActiveCategory(cat.id as 'all' | 'birth' | 'passion' | 'resurrection' | 'priesthood');
            }}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Constellation Node Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredProphecies.map((p) => {
          const isSelected = p.id === selectedProphecyId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between gap-2 min-h-[90px] cursor-pointer touch-manipulation ${
                isSelected
                  ? 'bg-amber-950/70 border-amber-400 text-amber-100 shadow-lg shadow-amber-950/50 scale-[1.03]'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 font-mono">
                  {p.otVerse.split(' ')[0]}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-amber-400 animate-ping' : 'bg-stone-700'
                  }`}
                />
              </div>
              <strong className="text-xs font-bold line-clamp-2 text-stone-200">
                {p.categoryLabel}
              </strong>
              <span className="text-[10px] text-stone-500 truncate">{p.ntVerse}</span>
            </button>
          );
        })}
      </div>

      {/* Main Comparative Glowing Nexus Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-600/40 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              {activeProphecy.categoryLabel}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {activeProphecy.otVerse} ➔ {activeProphecy.ntVerse}
            </span>
          </div>

          <button
            onClick={handleCopyStudy}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ الدراسة'}</span>
          </button>
        </div>

        {/* Visual Dual Nexus Columns (OT Prophecy vs NT Fulfillment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {/* Middle Linking Badge (Desktop) */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-600 border-2 border-amber-300 text-stone-950 items-center justify-center text-sm shadow-xl z-10 font-bold">
            ⚡
          </div>

          {/* Left Column: Old Testament Prophecy */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                <span>📜</span>
                <span>العهد القديم (النبوة والظل)</span>
              </span>
              <span className="text-[11px] font-bold text-stone-400">{activeProphecy.otBook}</span>
            </div>
            <p className="font-spiritual text-sm sm:text-base font-bold text-amber-100 leading-relaxed">
              {activeProphecy.otText}
            </p>
            <div className="text-[11px] text-stone-400 font-mono bg-stone-900/80 p-2 rounded-xl border border-stone-800">
              الأصل العبري: <span className="text-amber-300 font-bold">{activeProphecy.hebrewTerm}</span>
            </div>
          </div>

          {/* Right Column: New Testament Fulfillment */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                <span>✨</span>
                <span>العهد الجديد (التحقيق والمجد)</span>
              </span>
              <span className="text-[11px] font-bold text-stone-400">{activeProphecy.ntBook}</span>
            </div>
            <p className="font-spiritual text-sm sm:text-base font-bold text-emerald-100 leading-relaxed">
              {activeProphecy.ntText}
            </p>
            <div className="text-[11px] text-stone-400 font-mono bg-stone-900/80 p-2 rounded-xl border border-stone-800">
              الأصل اليوناني: <span className="text-emerald-300 font-bold">{activeProphecy.greekTerm}</span>
            </div>
          </div>
        </div>

        {/* Patristic Exegesis Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>الاستنارة والتفسير الآبائي:</span>
            </span>
            <span className="text-[11px] font-bold text-amber-400">{activeProphecy.patristicSaint}</span>
          </div>
          <p className="font-spiritual text-xs sm:text-sm text-stone-200 italic leading-relaxed">
            «{activeProphecy.patristicExegesis}»
          </p>
        </div>

        {/* Practical Consecration Lesson */}
        <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm shrink-0">
            ✝️
          </div>
          <div>
            <span className="text-[10px] text-stone-400 block">رسالة المخدع للمكرس:</span>
            <p className="text-xs font-bold text-amber-100 leading-relaxed">
              {activeProphecy.consecrationLesson}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
