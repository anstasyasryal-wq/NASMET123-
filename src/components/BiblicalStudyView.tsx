import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  Search,
  ChevronLeft,
  Layers,
  Bookmark,
  Sparkles,
  X,
  Copy,
  Check,
  Quote,
  Type,
} from 'lucide-react';

interface BiblicalStudyItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  patristic: string;
  keyVerse: string;
  verseRef: string;
  detailedAnalysis: string[];
  patristicExegesis: string;
  practicalReflection: string;
}

interface BiblicalStudyViewProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

const STUDIES_DATA: BiblicalStudyItem[] = [
  {
    id: 'study-1',
    title: 'دراسة سفر التكوين: البدايات، الشفرة الجينية، والتصميم الإلهي',
    category: 'العهد القديم والعلوم',
    summary: 'تحليل دقيق لأيام الخليقة، تناغم الطبيعة، والإتقان البيولوجي الذي يسبح بحكمة الخالق الأزلي.',
    patristic: 'القديس باسيليوس الكبير (عظات الهكساميرون - الأيام الستة)',
    keyVerse: '«فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ».',
    verseRef: 'تكوين 1: 1',
    detailedAnalysis: [
      'الخلق من العدم (Ex Nihilo): تأكيد لاهوتي حاسم بأن المادة لم تكن أزلية، بل أوجدها أمر الكلمة الإلهي.',
      'التناسق البيولوجي: الدقة المعجزة في الشفرة الوراثية وتوازن النظم البيئية يعكسان عناية إلهية واعية وليست صدفة عشوائية.',
      'الإنسان تاج الخليقة: خلق الإنسان على صورة الله يمنحه كرامة فريدة ومسؤولية وكالة أمينة على الأرض.',
    ],
    patristicExegesis:
      '«حينما ترى حركة الكواكب وجمال الزروع وتناسق أعضاء الكائن الحي، لا تمجد الطبيعة الصماء، بل اسجد بحرارة للصانع الحكيم الذي نظم كل شيء بوزن ومكيال». — القديس باسيليوس الكبير',
    practicalReflection:
      'كلما ازداد علمك بالكون والحياة، ازداد خشوعك أمام عظمة الخالق وسكون مخدعك أمامه.',
  },
  {
    id: 'study-2',
    title: 'رسالة رومية وإنجيل النعمة والتحرير',
    category: 'رسائل بولس الرسول',
    summary: 'شرح مفهوم التبرير المجاني بدم المسيح، والارتباط بين آدم الأول وآدم الأخير في الجسد والروح.',
    patristic: 'القديس يوحنا ذهبي الفم (شرح رسالة رومية)',
    keyVerse: '«مُتَبَرِّرِينَ مَجَّانًا بِنِعْمَتِهِ بِالْفِدَاءِ الَّذِي بِيَسُوعَ الْمَسِيحِ».',
    verseRef: 'رومية 3: 24',
    detailedAnalysis: [
      'عجز الناموس عن التبرير: كشف الناموس للخطية دون القدرة على شفاء الطبيعة الساقطة.',
      'بر الله بالإيمان: الفداء بدم الصليب هو المصدر الوحيد لتبرير الإنسان ومصالحته مع الآب.',
      'الحياة بالروح: ناموس روح الحياة في المسيح يسوع أعتقنا من ناموس الخطية والموت.',
    ],
    patristicExegesis:
      '«النعمة لم تنتظر أن نكون مستحقين لكي تفيض علينا، بل سكبت ذاتها ونحن بعد خطاة لكي تصنع منا قديسين وأبناء للملكوت». — القديس يوحنا ذهبي الفم',
    practicalReflection:
      'عش حياتك اليوم ليس تحت وطأة الخوف، بل في ملء الحرية المجيدة لأولاد الله الذين افتُدوا بالدم الثمين.',
  },
  {
    id: 'study-3',
    title: 'لاهوت التجسد والفداء في إنجيل القديس يوحنا',
    category: 'الأناجيل واللاهوت',
    summary: '«فِي الْبَدْءِ كَانَ الْكَلِمَةُ» - دراسة نصية في الأزلية وتجسد كلمة الله لخلاص الإنسان وتجديد طبيعته.',
    patristic: 'القديس أثناسيوس الرسولي والقديس كيرلس الكبير',
    keyVerse: '«وَالْكَلِمَةُ صَارَ جَسَدًا وَحَلَّ بَيْنَنَا، وَرَأَيْنَا مَجْدَهُ، مَجْدًا كَمَا لِوَحِيدٍ مِنَ الآبِ، مَمْلُوءًا نِعْمَةً وَحَقًّا».',
    verseRef: 'يوحنا 1: 14',
    detailedAnalysis: [
      'اللوغوس الأزلي: لاهوت المسيح القائم من قبل كل الدهور مع الآب.',
      'سر التجسد: اتحاد اللاهوت بالناسوت بغير اختلاط ولا امتزاج ولا تغيير.',
      'تجديد الخلقة وتأله الإنسان بالنعمة: صار الله إنساناً لكي يشركنا في طبيعته الفائقة.',
    ],
    patristicExegesis:
      '«لم يتخذ الكلمة جسداً لكي يظهر فقط كشبح، بل اتخذ طبيعتنا البشرية بكاملها لكي يقدسها ويشفيها من الفساد الذي أصابها». — القديس كيرلس الكبير',
    practicalReflection:
      'تذكر دائماً أن جسدك وطاقتك مقدسان، لأن رب المجد تنازل واتخذ جسداً بشرياً حقيقياً.',
  },
  {
    id: 'study-4',
    title: 'المزامير وسكون القلب في صلوات الأجبية',
    category: 'الصلوات والأسفار الشعرية',
    summary: 'كيف تتحول كلمات داود النبي إلى نبض شخصي في صلاة الساعة الثالثة، السادسة، وصلوات الغروب والنوم.',
    patristic: 'الأنبا شنودة رئيس المتوحدين والقديس كاسيان',
    keyVerse: '«سَبْعَ مَرَّاتٍ فِي النَّهَارِ سَبَّحْتُكَ عَلَى أَحْكَامِ عَدْلِكَ».',
    verseRef: 'مزمور 119: 164',
    detailedAnalysis: [
      'صلوات السواعي: ارتباط كل ساعة بحدث خلاصي (الباكر بالقيامة، الثالثة بالروح القدس، السادسة بالصليب، التاسعة بالموت المحيي).',
      'حراسة الفكر بالمزامير: تكرار كلمات داود النبي يطرد الأفكار المشوشة ويملأ النفس سكينة.',
      'روح البكاء والتوبة: المزامير تعلّم النفس كيف تبكي بخجل مقدس أمام عرش الرحمة.',
    ],
    patristicExegesis:
      '«المزمور هو هدوء النفس، وعربون السلام، ومسكن اضطراب الأفكار والريح العاصفة التي تهب على القلب». — القديس باسيليوس الكبير',
    practicalReflection:
      'لا تتلُ المزامير على عجل كواجب ثقيل، بل تذوق كل مزمور كرسالة شخصية موجهة من فم الله إلى قلبك.',
  },
];

export const BiblicalStudyView: React.FC<BiblicalStudyViewProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<BiblicalStudyItem | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const { themeMode, setThemeMode, getReadingContainerClass, getReadingTextClass, openFontModal } = useReadingTheme();
  const { language, t, dir, isRTL } = useLanguage();

  const filtered = STUDIES_DATA.filter(
    (s) =>
      s.title.includes(searchTerm) ||
      s.summary.includes(searchTerm) ||
      s.category.includes(searchTerm) ||
      s.patristic.includes(searchTerm)
  );

  const handleOpenStudy = (st: BiblicalStudyItem) => {
    soundManager.playTick();
    setSelectedStudy(st);
  };

  const handleCopyStudy = (st: BiblicalStudyItem) => {
    soundManager.playTick();
    const text = `«${st.title}»\n${st.keyVerse} (${st.verseRef})\n${language === 'ar' ? 'المرجع الآبائي' : 'Patristic Reference'}: ${st.patristic}\n${st.patristicExegesis}\n— ${t('appTitle')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={dir}>
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('backToHome')}</span>
        </button>
      </div>

      <div className={`rounded-3xl p-6 sm:p-8 border shadow-xl space-y-4 ${getReadingContainerClass()}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'ar' ? 'منصة الدراسة والعلوم الكنسية والآباء' : 'Ecclesiastical Studies & Patristics Platform'}</span>
          </div>

          {/* Auto Eye-Comfort Theme & Font Selector */}
          <div className="flex items-center gap-1.5 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 text-xs font-bold flex-wrap">
            <span className="text-[11px] text-amber-300 px-1.5">{t('readingModeTitle')}</span>
            <button
              onClick={() => setThemeMode('light')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${themeMode === 'light' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'}`}
            >
              ☀️ {t('day')}
            </button>
            <button
              onClick={() => setThemeMode('night')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${themeMode === 'night' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'}`}
            >
              🌙 {t('night')}
            </button>
            <button
              onClick={() => setThemeMode('auto')}
              className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer ${themeMode === 'auto' ? 'bg-emerald-600 text-white' : 'text-stone-400 hover:text-stone-200'}`}
              title="تعديل تلقائي للإضاءة وراحة العين"
            >
              <span>👁️</span>
              <span>{t('autoMode')}</span>
            </button>
            <button
              onClick={openFontModal}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition cursor-pointer flex items-center gap-1"
              title={t('eyeComfortFonts')}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'نوع الخط 🔤' : 'Font 🔤'}</span>
            </button>
          </div>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📜 {language === 'ar' ? 'مدارج الفهم والتعليم الكنسي الآبائي' : 'Patristic Exegesis & Church Studies'}
        </h1>
        <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${getReadingTextClass()}`}>
          {language === 'ar'
            ? 'دراسات كتابية ولاهوتية رصينة تربط نصوص الكتاب المقدس بأقوال الآباء، مع إبراز التوافق الباهر بين العلم المعاصر والوحي الإلهي.'
            : 'Profound biblical and theological studies connecting Holy Scripture with the Church Fathers, illustrating harmony between true science and divine revelation.'}
        </p>

        <div className="pt-2">
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في الدراسات والتفاسير الآبائية...' : 'Search studies and patristic exegesis...'}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((st) => (
          <div
            key={st.id}
            onClick={() => handleOpenStudy(st)}
            className="p-5 rounded-2xl bg-stone-900 border border-amber-600/30 hover:border-amber-400 transition space-y-3 shadow-md flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/40 inline-block">
                {st.category}
              </span>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 group-hover:text-amber-300 transition">
                {st.title}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {st.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-amber-400 font-semibold truncate max-w-[80%]">
                📚 {st.patristic}
              </span>
              <span className="text-amber-400 group-hover:translate-x-[-2px] transition transform">
                ←
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* STUDY DETAIL MODAL */}
      {selectedStudy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-right">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">
                    {selectedStudy.category}
                  </span>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                    {selectedStudy.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyStudy(selectedStudy)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="نسخ ملخص الدراسة"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-stone-950">
              {/* Key Verse Box */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>الآية المركزية للدراسة:</span>
                </span>
                <p className="font-spiritual text-sm sm:text-base text-amber-100 font-semibold leading-relaxed">
                  {selectedStudy.keyVerse}
                </p>
                <span className="text-[10px] text-amber-300/80 block font-mono">
                  — {selectedStudy.verseRef}
                </span>
              </div>

              {/* Analysis Points */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>عناصر التحليل اللاهوتي والكتابي:</span>
                </h4>
                <div className="space-y-2">
                  {selectedStudy.detailedAnalysis.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-xs sm:text-sm text-stone-200 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patristic Exegesis */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-amber-400" />
                  <span>الشرح الآبائي المعتمد:</span>
                </h4>
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs sm:text-sm text-stone-300 italic leading-relaxed">
                  {selectedStudy.patristicExegesis}
                </div>
              </div>

              {/* Practical Reflection */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400">
                  🌱 التطبيق الروحي للمكرس:
                </span>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {selectedStudy.practicalReflection}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
