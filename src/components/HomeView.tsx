import React, { useState } from 'react';
import { User, Stage, Announcement } from '../types';
import { FortuneWheel, WheelSection } from './FortuneWheel';
import { ConsecrationTree } from './ConsecrationTree';

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
}) => {
  const [selectedSection, setSelectedSection] = useState<WheelSection | null>(null);

  const handleSelectSection = React.useCallback((sec: WheelSection) => {
    setSelectedSection(sec);
  }, []);

  const handleReset = React.useCallback(() => {
    setSelectedSection(null);
  }, []);

  const wheelSections: WheelSection[] = React.useMemo(() => [
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
      verse: 'كُلُّ مَنْ يُجَاهِدُ يَضْبُطُ نَفْسَهُ فِي كُلِّ شَيْءٍ. أَمَّا أُولئِكَ فَلِكَيْ يَنَالُوا إِكْلِيلًا يَفْنَى، وَأَمَّا نَحْنُ فَإِكْلِيلًا لاَ يَفْنَى.',
      verseRef: '1 كورنثوس 9: 25',
      patristicQuote: 'إن الجهاد الروحي لا يُقاس بكثرة المجهود الظاهر، بل بنقاوة القلب والأمانة لله حتى النفس الأخير.',
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
      description: 'خطة قراءة الكتاب المقدس والآباء السنوية (365 يوماً)، مخدع الصلاة، ومسبحة صلاة يسوع.',
      verse: 'وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ وَأَغْلِقْ بَابَكَ، وَصَلِّ إِلَى أَبِيكَ الَّذِي فِي الْخَفَاءِ.',
      verseRef: 'متى 6: 6',
      patristicQuote: 'الصلاة هي نسيم الروح وتنفس الحياة الأبدية، وبدونها يموت القلب روحياً كما يموت الجسد بلا هواء.',
      patristicSaint: 'القديس يوحنا ذهبي الفم',
      onOpen: () => onNavigateToSpiritualLife?.(),
      items: [],
    },
    {
      id: 'biblical_study',
      name: 'الدراسة الكتابية المعمقة والآباء',
      shortName: 'الدراسة والآباء',
      line1: 'الدراسة',
      line2: 'والآباء',
      icon: '📖',
      color: '#1d4ed8',
      description: 'دراسات لاهوتية وكتابية رصينة تربط نصوص الكتاب المقدس بأقوال الآباء وتفاسيرهم.',
      verse: 'فَتِّشُوا الْكُتُبَ لأَنَّكُمْ تَظُنُّونَ أَنَّ لَكُمْ فِيهَا حَيَاةً أَبَدِيَّةً. وَهِيَ الَّتِي تَشْهَدُ لِي.',
      verseRef: 'يوحنا 5: 39',
      patristicQuote: 'قراءة الكتب المقدسة تُنير العقل وتطرد ظلمة الجهل، وهي السور المنيع ضد سهام الشرير.',
      patristicSaint: 'القديس أثناسيوس الرسولي',
      onOpen: () => onNavigateToBiblicalStudy?.(),
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
      badge: 'جديد ومحدث',
      description: 'مكتبة رقمية متكاملة للكتب والوثائق الكنسية، ومعرض الأيقونات وسير قديسي الشرق والغرب.',
      verse: 'إِلَى أَنْ أَجِيءَ اعْكُفْ عَلَى الْقِرَاءَةِ وَالْوَعْظِ وَالتَّعْلِيمِ.',
      verseRef: '1 تيموثاوس 4: 13',
      patristicQuote: 'اجعل من أقوال الآباء مصباحاً لخطواتك، فالذي يسير بنورهم لا يضل في برية هذا العالم.',
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
      description: 'ركائز المكرس الـ 7، مشغل ألحان وترانيم هادئة، ميزان فحص الضمير، وميثاق تجديد النذر.',
      verse: 'فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ.',
      verseRef: 'إشعياء 30: 15',
      patristicQuote: 'الهدوء والسكون هما مبدأ نقاوة النفس، ففيهما يصمت اللسان ليتكلم القلب مع الله في خفاء.',
      patristicSaint: 'القديس باسيليوس الكبير',
      onOpen: () => onNavigateToMonasticOasis?.(),
      items: [],
    },
    {
      id: 'workshops',
      name: 'ورش العمل والتدريب الكنسي',
      shortName: 'ورش العمل',
      line1: 'ورش',
      line2: 'العمل',
      icon: '🎓',
      color: '#4338ca',
      description: '10 ورش عمل عملية متكاملة لتطوير مهارات الخدمة، إعداد العظات، والافتقاد.',
      verse: 'وَالَّذِي سَمِعْتَهُ مِنِّي بِشُهُودٍ كَثِيرِينَ، أَوْدِعْهُ أُنَاسًا أُمَنَاءَ، يَكُونُونَ أَكْفَاءً أَنْ يُعَلِّمُوا آخَرِينَ أَيْضًا.',
      verseRef: '2 تيموثاوس 2: 2',
      patristicQuote: 'الخادم الحقيقي هو من يخدم بالقدوة الصالحة الصامتة قبل الكلمة المنطوقة، وبالمحبة الباذلة.',
      patristicSaint: 'القديس غريغوريوس الثيؤلوغوس',
      onOpen: () => onNavigateToWorkshops?.(),
      items: [],
    },
    {
      id: 'creative_lab',
      name: 'مختبر الإبداع والتأملات الروحية',
      shortName: 'مختبر الإبداع',
      line1: 'مختبر',
      line2: 'الإبداع',
      icon: '✨',
      color: '#be185d',
      description: 'إعداد وحفظ مسودات العظات والخواطر والترانيم وألعاب التحدي والتمييز.',
      verse: 'فَاضَ قَلْبِي بِكَلاَمٍ صَالِحٍ. أُخْبِرُ أَنَا بِإِنْشَائِي لِلْمَلِكِ. لِسَانِي قَلَمُ كَاتِبٍ مَاهِرٍ.',
      verseRef: 'مزمور 45: 1',
      patristicQuote: 'الروح القدس هو قيثارة النفس، وحين تلمس نعمته أوتار القلب تنطق بألحان السماء وترانيم الشكر.',
      patristicSaint: 'مار إفرام السرياني',
      onOpen: () => onNavigateToCreativeLab?.(),
      items: [],
    },
    {
      id: 'study_tools',
      name: 'أدوات الدراسة والبحث والتدريب',
      shortName: 'أدوات البحث',
      line1: 'أدوات',
      line2: 'البحث',
      icon: '🔍',
      color: '#0f766e',
      description: 'الاختبار الفردي مع شهادات تقدير، مسابقة الفرق، وتحدي السرعة وبنك الأسئلة.',
      verse: 'الْقَلْبُ الْفَهِيمُ يَقْتَنِي مَعْرِفَةً، وَأُذُنُ الْحُكَمَاءِ تَطْلُبُ عِلْمًا.',
      verseRef: 'أمثال 18: 15',
      patristicQuote: 'المعرفة بدون محبة تنفخ، ولكن المعرفة الممزوجة بالاتضاع وطلب الحق تقود إلى عرش النعمة.',
      patristicSaint: 'القديس يوحنا كاسيان',
      onOpen: () => onNavigateToStudyTools?.(),
      items: [],
    },
    {
      id: 'spiritual_games',
      name: 'واحة الألعاب وتحديات البرية',
      shortName: 'الألعاب الروحية',
      line1: 'الألعاب',
      line2: 'الروحية',
      icon: '🎮',
      color: '#6b21a8',
      description: 'رحلة الراهب في البرية، بازل الأيقونات، رنين الدف، وفوازير البستان مع مستويات صعوبة.',
      verse: 'حِينَئِذٍ امْتَلأَتْ أَفْوَاهُنَا ضَحِكًا، وَأَلْسِنَتُنَا تَرَنُّمًا. حِينَئِذٍ قَالُوا بَيْنَ الأُمَمِ: إِنَّ الرَّبَّ قَدْ عَظَّمَ الْعَمَلَ مَعَ هؤُلاَءِ.',
      verseRef: 'مزمور 126: 2',
      patristicQuote: 'الفرح الروحي النقي هو طعام الملائكة وسلاح باهر يطرد روح الضجر والملل من قلب المجاهد.',
      patristicSaint: 'القديس مقاريوس الكبير',
      onOpen: () => onNavigateToSpiritualGames?.(),
      items: [],
    },
    {
      id: 'emergency_rescue',
      name: 'خطط التدخل والإنقاذ السريع',
      shortName: 'خطط الإنقاذ',
      line1: 'خطط',
      line2: 'الإنقاذ',
      icon: '🛡️',
      color: '#b91c1c',
      badge: 'إسعاف روحي',
      description: 'خطط تدخل سريع وشواهد تعزية في أوقات الضيقة، الفتور الروحي، وحروب التجربة.',
      verse: 'اللهُ لَنَا مَلْجَأٌ وَقُوَّةٌ، عَوْنًا فِي الضِّيقَاتِ وُجِدَ شَدِيدًا.',
      verseRef: 'مزمور 46: 1',
      patristicQuote: 'إذا هاجمتك أمواج التجربة والضيقة، لا تنظر إلى قوة الريح بل إلى يد المخلص الممدودة لتنقذك.',
      patristicSaint: 'القديس يوحنا الدرجي',
      onOpen: () => onOpenEmergencyModal?.('distress'),
      items: [],
    },
    {
      id: 'personal_space',
      name: 'الفضاء الشخصي ومذكرات المخدع',
      shortName: 'المساحة الشخصية',
      line1: 'المساحة',
      line2: 'الشخصية',
      icon: '📝',
      color: '#0369a1',
      badge: 'جديد ومحدث',
      description: 'المجلة الروحية، صندوق رسائل أبيك السماوي (٦٨+ رسالة)، وحبل صلاة يسوع لمناجاة القلب.',
      verse: 'اخْتَبِرْنِي يَا اَللهُ وَاعْرِفْ قَلْبِي. امْتَحِنِّي وَاعْرِفْ أَفْكَارِي. وَانْظُرْ إِنْ كَانَ فِيَّ طَرِيقٌ بَاطِلٌ، وَاهْدِنِي طَرِيقًا أَبَدِيًّا.',
      verseRef: 'مزمور 139: 23-24',
      patristicQuote: 'حاسب نفسك كل مساء قبل أن يباغتك النوم، واكتب خطاياك بدموع التوبة أمام ديان المسكونة الرحيم.',
      patristicSaint: 'القديس الأنبا موسى الأسود',
      onOpen: () => onNavigateToPersonalSpace?.(),
      items: [],
    },
    {
      id: 'spiritual_father',
      name: 'قسم أبوي الروحي وإعداد الاعتراف',
      shortName: 'أبوي الروحي',
      line1: 'أبوي',
      line2: 'الروحي',
      icon: '🛡️',
      color: '#475569',
      badge: 'إعداد الاعتراف',
      description: 'سجل نقاط جلسة الاعتراف القادمة، نصائح أب الاعتراف المحفوظة، ودليل الإعداد للتوبة.',
      verse: 'طَاعَةُ مُرْشِدِيكُمْ وَالْخُضُوعُ لَهُمْ، لأَنَّهُمْ يَسْهَرُونَ لأَجْلِ نُفُوسِكُمْ كَأَنَّهُمْ سَيُوَفُّونَ حِسَابًا.',
      verseRef: 'عبرانيين 13: 17',
      patristicQuote: 'من له أب روحي يستشيره في كل أموره، فقد استريح من حيل إبليس، لأن السلام يسكن في المشورة المتواضعة.',
      patristicSaint: 'القديس قيصريوس أريلة',
      onOpen: () => onNavigateToSpiritualFather?.(),
      items: [],
    },
    {
      id: 'leaderboard',
      name: 'لوحة الشرف والصدارة والتميز',
      shortName: 'لوحة الصدارة',
      line1: 'لوحة',
      line2: 'الصدارة',
      icon: '🥇',
      color: '#334155',
      description: 'متابعة ترتيب المشاركين والإيبارشيات في المسابقة وحفل التتويج الشرفي.',
      verse: 'وَالْفَاهِمُونَ يُضِيئُونَ كَضِيَاءِ الْجَلَدِ، وَالَّذِينَ رَدُّوا كَثِيرِينَ إِلَى الْبِرِّ كَالْكَوَاكِبِ إِلَى أَبَدِ الدُّهُورِ.',
      verseRef: 'دانيال 12: 3',
      patristicQuote: 'المجد الباطل يزول، أما الإكليل الروحي المعد من يد الرب فهو باقٍ مع القديسين في ملكوت النور الأبدي.',
      patristicSaint: 'الشهيد كبريانوس القرطاجي',
      onOpen: () => onNavigateToLeaderboard(),
      items: [],
    },
  ], [
    onNavigateToCompetitions,
    onNavigateToSpiritualLife,
    onNavigateToBiblicalStudy,
    onNavigateToLibrary,
    onNavigateToWorkshops,
    onNavigateToCreativeLab,
    onNavigateToStudyTools,
    onNavigateToMonasticOasis,
    onNavigateToSpiritualGames,
    onNavigateToPersonalSpace,
    onNavigateToSpiritualFather,
    onNavigateToLeaderboard,
  ]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-right">
      {/* Monastic Puzzle App Launch Banner */}
      <div 
        onClick={() => onNavigateToMonasticPuzzle?.()}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 border-2 border-amber-500/60 shadow-xl cursor-pointer hover:scale-[1.01] transition group relative overflow-hidden text-white"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/30 border border-amber-400/60 flex items-center justify-center text-3xl shadow-inner group-hover:rotate-6 transition">
              🧩✨
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-300 font-mono tracking-wider">لعبة تفاعلية جديدة</span>
              <h2 className="font-spiritual text-lg sm:text-xl font-black text-amber-100">
                حسب قلب الله للمكرسين (ألعاب البازل والتنسك)
              </h2>
              <p className="text-xs text-amber-200/80 leading-relaxed font-spiritual">
                المستويات الثلاثة: باب التخلي، بازل السكون (3×3)، وهرم النمو الروحي + مفتاح الروح وأقوال الآباء.
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg transition shrink-0 flex items-center gap-2">
            <span>ابدأ اللعب الآن</span>
            <span>➔</span>
          </button>
        </div>
      </div>

      {/* Daily Spiritual Consecration Tree */}
      <ConsecrationTree
        currentUser={currentUser}
        onOpenRetreat={onOpenRetreat}
        onNavigateToSpiritualLife={onNavigateToSpiritualLife}
        onNavigateToPersonalSpace={onNavigateToPersonalSpace}
      />

      {/* Main Wheel & Exploration Sections */}
      <FortuneWheel
        sections={wheelSections}
        selectedSection={selectedSection}
        onSelectSection={handleSelectSection}
        onReset={handleReset}
      />
    </div>
  );
});

HomeView.displayName = 'HomeView';
