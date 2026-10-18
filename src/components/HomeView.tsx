import React, { useState } from 'react';
import { User, Stage, Announcement } from '../types';
import { FortuneWheel, WheelSection } from './FortuneWheel';
import { getOrRefreshDailyMessage, formatRemainingTime } from '../utils/heavenlyHistory';
import { Sparkles, Heart, Clock, ShieldCheck, ScrollText, Compass, Shield } from 'lucide-react';
import { useHymnsAudio } from '../context/HymnsAudioContext';

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
}

export const HomeView: React.FC<HomeViewProps> = ({
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
}) => {
  const [selectedSection, setSelectedSection] = useState<WheelSection | null>(null);
  const { message: dailyMessage, timeRemainingMs } = getOrRefreshDailyMessage(false);
  const { openPlayerModal } = useHymnsAudio();

  const wheelSections: WheelSection[] = [
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
      items: [
        {
          title: 'المراحل الست الرسمية',
          subtitle: 'اختبارات إلكترونية تفاعلية متدرجة الصعوبة',
          onClick: () => onNavigateToCompetitions(),
        },
        {
          title: 'لوحة الصدارة والتتويج',
          subtitle: 'ترتيب المتسابقين والإيبارشيات لحظياً',
          onClick: () => onNavigateToLeaderboard(),
        },
      ],
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
      items: [
        {
          title: '🛡️ حصن الصلاة اليومي | رفيق مسيرة المكرس',
          subtitle: 'مزمور وصلاة قصيرة حسب ساعات الكنيسة والطقس مع المنبه الذكي',
          onClick: () => (onNavigateToPrayerFortress ? onNavigateToPrayerFortress() : onNavigateToSpiritualLife?.()),
        },
        {
          title: 'متتبع خطة القراءة السنوية (365 يوماً)',
          subtitle: 'متابعة بصرية سنوية مع أوسمة وتأملات مخدعية',
          onClick: () => onNavigateToSpiritualLife?.(),
        },
        {
          title: 'صلوات المخدع والأجبية',
          subtitle: 'أوقات الصلاة والهدوء الروحي اليومي',
          onClick: () => onNavigateToSpiritualLife?.(),
        },
      ],
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
      items: [
        {
          title: 'أبحاث اللاهوت وتفسير العهدين',
          subtitle: 'دراسة النصوص مع شواهد كنسية موثقة',
          onClick: () => onNavigateToBiblicalStudy?.(),
        },
      ],
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
      items: [
        {
          title: 'سير الآباء والقديسين (الشرق والغرب)',
          subtitle: 'موسوعة لآباء وقديسي الكنيسة الجامعة مع أقوالهم',
          onClick: () => onOpenSaintsGallery ? onOpenSaintsGallery() : onNavigateToLibrary?.(),
        },
        {
          title: 'معرض الأيقونات الكنسية التفاعلي',
          subtitle: 'الشرح الروحي واللاهوتي والتاريخي للأيقونات',
          onClick: () => onOpenIconGallery ? onOpenIconGallery() : onNavigateToLibrary?.(),
        },
        {
          title: 'مستودع الكتب والمراجع والأبحاث',
          subtitle: 'تراث الكنيسة وأبحاث الوراثة والعلوم وقارئ الفصول',
          onClick: () => onNavigateToLibrary?.(),
        },
      ],
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
      items: [
        {
          title: '📖 مرجع ودستور المكرس | كيف تعيش حسب قلب الله',
          subtitle: 'دستور قلب داود (السمات الـ ٧)، كانون اليوم المتزن، موسوعة الحروب، والوصايا الذهبية',
          onClick: () => (onNavigateToConsecratedManual ? onNavigateToConsecratedManual() : onNavigateToMonasticOasis?.()),
        },
        {
          title: 'مشغل الترانيم والألحان الكنسية والتأملية',
          subtitle: 'قوائم مخصصة لكل مناسبة روحية (المخدع، الصوم، القيامة، التكريس، كيهك، التعزية)',
          onClick: () => openPlayerModal(),
        },
        {
          title: 'ركائز التكريس الـ ٧ الإنجيلية',
          subtitle: 'دستور المكرس ليكون قلبه حسب قلب الله',
          onClick: () => onNavigateToMonasticOasis?.(),
        },
        {
          title: 'ميزان فحص الضمير وصيدلية الآباء',
          subtitle: 'محاسبة النفس وعلاج الجفاف والفتور الروحي',
          onClick: () => onNavigateToMonasticOasis?.(),
        },
      ],
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
      items: [
        {
          title: 'ورش إعداد وتدبير الخدمة والوعظ',
          subtitle: 'حقائب تدريبية موجهة للمكرسين والخدام',
          onClick: () => onNavigateToWorkshops?.(),
        },
      ],
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
      items: [
        {
          title: 'خطة الإنقاذ في الضيقة والحزن',
          subtitle: 'آيات تعزية وطمأنينة فورية للقلب المتألم',
          onClick: () => onOpenEmergencyModal?.('distress'),
        },
        {
          title: 'علاج الفتور والبرود الروحي',
          subtitle: 'خطوات عملية لاستعادة حرارة المخدع الأولى',
          onClick: () => onOpenEmergencyModal?.('lukewarmness'),
        },
      ],
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
      items: [
        {
          title: 'المجلة الروحية ومذكرات المخدع',
          subtitle: 'سجل تأملاتك وتدريباتك اليومية الشخصية للرجوع إليها',
          onClick: () => onOpenSpiritualJournal ? onOpenSpiritualJournal() : onNavigateToPersonalSpace?.(),
        },
        {
          title: 'صندوق رسائل أبيك السماوي (٦٨+ رسالة)',
          subtitle: 'اسحب رسالتك اليومية بالحظ مع منع التكرار 24 ساعة',
          onClick: () => onOpenHeavenlyMessage ? onOpenHeavenlyMessage() : onNavigateToPersonalSpace?.(),
        },
        {
          title: 'حبل صلاة يسوع الإلكتروني (33 عقدة)',
          subtitle: '«يا ربي يسوع المسيح، ارحمني أنا الخاطئ»',
          onClick: () => onNavigateToPersonalSpace?.(),
        },
      ],
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
      items: [
        {
          title: 'نقاط جلسة الاعتراف القادمة',
          subtitle: 'سجل ما أود مناقشته وعرضه على أب الاعتراف',
          onClick: () => onNavigateToSpiritualFather?.(),
        },
        {
          title: 'نصائح وإرشادات أبوي الروحي',
          subtitle: 'حفظ واسترجاع الوصايا والإرشادات الروحية',
          onClick: () => onNavigateToSpiritualFather?.(),
        },
      ],
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
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-right">
      <FortuneWheel
        sections={wheelSections}
        selectedSection={selectedSection}
        onSelectSection={(sec) => setSelectedSection(sec)}
        onReset={() => setSelectedSection(null)}
      />

      {/* Heavenly Father's Message Card */}
      {onOpenHeavenlyMessage && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border border-amber-500/40 p-5 sm:p-7 shadow-xl relative overflow-hidden text-right">
          <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                💌
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-spiritual font-black text-amber-200">
                    رسالة من أبيك السماوي (بالحظ والقرعة)
                  </h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>غير مكررة لمدة 24 ساعة</span>
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                    ٦٨+ رسالة بركة
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 line-clamp-2 max-w-2xl leading-relaxed">
                  «{dailyMessage.message}»
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-amber-400 font-serif font-semibold">
                    — {dailyMessage.verseRef} ({dailyMessage.categoryLabel})
                  </span>
                  <span className="text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>تتجدد تلقائياً بعد: {formatRemainingTime(timeRemainingMs)}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onOpenHeavenlyMessage}
                className="w-full md:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>اسحب رسالتك الروحية الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saints Stickers Highlight Card */}
      {onOpenSaintsStickers && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#1b140d] to-stone-900 border-2 border-amber-500/50 p-5 sm:p-7 shadow-xl relative overflow-hidden text-right">
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                🌟
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-spiritual font-black text-amber-200">
                    استكر قديس اليوم والتنبيه على الفضائل (الشرق والغرب)
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    ١٨+ قديس من كل التقاليد
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    رسالة وتدريب يومي
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  قديسو الشرق الأرثوذكسي، الغرب اللاتيني، التراث السلتي والسرياني، والتراث الجامع — اسحب استكر قديس اليوم، وتأمل في رسالته وتنبيهه على الفضيلة في مخدعك.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-400 font-mono">
                  <span>🕊️ أنطونيوس وأغسطينوس</span>
                  <span>•</span>
                  <span>🌿 فرنسيس وتريزا وباتريك</span>
                  <span>•</span>
                  <span>💧 مار إسحق وبندكتوس وسلوان</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onOpenSaintsStickers}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <span>🌟</span>
                <span>سحب استكر قديس اليوم والألبوم</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Prayer Fortress Highlight Card */}
      {onNavigateToPrayerFortress && (
        <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-[#1c140d] to-stone-950 border-2 border-amber-500/60 p-5 sm:p-7 shadow-xl relative overflow-hidden text-right">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-600/20 shrink-0">
                🛡️
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-spiritual font-black text-amber-200">
                    حصن الصلاة اليومي | رفيق مسيرة المكرس
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    جدول الساعات الكنسية والطقس
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    منبهات ذكية ومسبحة سهام
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  تلقَّ في كل ساعة مزموراً كنسياً مقترحاً مع صلاة مخدعية قصيرة تنبثق من طقس كنيستك وساعاتها السبع، مع إمكانية ضبط منبه الحصن الصوتي ليكون رفيقاً روحياً دائماً في مسيرتك.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-400 font-mono">
                  <span>🔔 ٧ ساعات أجبية طقسية</span>
                  <span>•</span>
                  <span>⏰ منبهات بألحان الكنيسة</span>
                  <span>•</span>
                  <span>📿 مسبحة صلاة يسوع</span>
                  <span>•</span>
                  <span>🌊 دروع الطوارئ الروحية</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onNavigateToPrayerFortress}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>دخول حصن الصلاة وتحديد التنبيه</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consecrated Manual Highlight Card */}
      {onNavigateToConsecratedManual && (
        <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-2 border-amber-500/50 p-5 sm:p-7 shadow-xl relative overflow-hidden text-right">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                📜
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-spiritual font-black text-amber-200">
                    مرجع المكرس الكنسي | كيف تعيش حسب قلب الله
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    دستور المكرس ودليل الآباء
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي» — الدليل الشامل لسمات قلب داود الـ ٧، كانون اليوم المتزن، موسوعة حروب التكريس الكبرى، والوصايا الذهبية العشر.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-400/90 font-mono">
                  <span>✨ ٧ سمات إنجيلية</span>
                  <span>•</span>
                  <span>⏱️ كانون اليوم المتزن</span>
                  <span>•</span>
                  <span>🛡️ ٧ حروب كبرى وترياق الآباء</span>
                  <span>•</span>
                  <span>📜 ١٠ وصايا ذهبية</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={onNavigateToConsecratedManual}
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <ScrollText className="w-4 h-4" />
                <span>تصفح مرجع ودستور المكرس الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
