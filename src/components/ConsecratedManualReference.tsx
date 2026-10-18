import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Compass,
  ChevronLeft,
  Sparkles,
  Shield,
  Heart,
  Scroll,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Search,
  Filter,
  ArrowRight,
  Bookmark,
  Sun,
  Moon,
  Feather,
  Printer,
  Scale,
  FileCheck,
  Library,
  BookMarked,
  Cross,
} from 'lucide-react';

interface ConsecratedManualReferenceProps {
  currentUser?: User | null;
  onBackToHome: () => void;
  onNavigateToOasis?: () => void;
  onNavigateToSpiritualFather?: () => void;
  onNavigateToPrayerFortress?: () => void;
}

export const ConsecratedManualReference: React.FC<ConsecratedManualReferenceProps> = ({
  currentUser,
  onBackToHome,
  onNavigateToOasis,
  onNavigateToSpiritualFather,
  onNavigateToPrayerFortress,
}) => {
  const [activeSection, setActiveSection] = useState<
    | 'david_heart'
    | 'daily_rhythm'
    | 'warfare_guide'
    | 'consecrated_prayers'
    | 'diakrisis_discernment'
    | 'golden_directives'
    | 'vows_milestones'
    | 'patristic_canon'
    | 'emergency_first_aid'
  >('david_heart');

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [selectedPillarId, setSelectedPillarId] = useState<number>(1);

  // Daily Rhythm Tracker state
  const [dailyChecklist, setDailyChecklist] = useState<Record<string, boolean>>({
    morning_prayer: false,
    agpeya_day: false,
    bible_study: false,
    patristic_reading: false,
    consecrated_service: false,
    manual_humble_work: false,
    hesychia_silence: false,
    evening_examen: false,
  });

  const toggleDailyItem = (key: string) => {
    soundManager.playTick();
    setDailyChecklist((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const completedCount = Object.values(next).filter(Boolean).length;
      if (completedCount === Object.keys(next).length) {
        soundManager.playVictory();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
      }
      return next;
    });
  };

  const completedRhythmCount = Object.values(dailyChecklist).filter(Boolean).length;
  const rhythmPercentage = Math.round((completedRhythmCount / Object.keys(dailyChecklist).length) * 100);

  // 1. SEVEN CHARACTERISTICS OF A HEART AFTER GOD'S HEART (قلب داود)
  const davidHeartPillars = [
    {
      id: 1,
      title: '١. التوبة الفورية الخالية من الأعذار والانسحاق أمام صوت الحق',
      subtitle: 'حين وبخه ناثان بكلمة «أَنْتَ هُوَ الرَّجُلُ!»، لم يبرر ولم ينتقم، بل سقط باكياً: «أَخْطَأْتُ إِلَى الرَّبِّ».',
      verse: '«أَخْطَأْتُ إِلَى الرَّبِّ. فَقَالَ نَاثَانُ لِدَاوُدَ: الرَّبُّ أَيْضًا قَدْ نَقَلَ عَنْكَ خَطِيَّتَكَ. لاَ تَمُوتُ» (2 صموئيل 12: 13)',
      patristicInsight: '«لم يقل داود: الظروف أجبرتني، أو التعب أوهنني، بل حمّل نفسه المسئولية كاملة بلا رتوش. هذه هي علامة القلب الذي يطلبه الله: صدق الانسحاق وسرعة الرجوع».',
      patristicSaint: 'القديس يوحنا ذهبي الفم',
      consecratedApplication: 'المكرس الحقيقي لا يدافع عن نفسه إذا نُبّه لتقصير أو خطأ في خدمته، بل يسبق ويقول: «أخطأت، سامحوني وصلوا لأجلي»، فيتحول الخطأ إلى نبع اتضاع يرفع النفس.',
      dangerToAvoid: 'حرب تبرير الأخطاء والغيرة من المنبهين والاعتداد بالكرامة الكنسية.',
    },
    {
      id: 2,
      title: '٢. حراسة نقاوة اليد ورفض الانتقام الذاتي والبر الشخصي',
      subtitle: 'وقع شاول الملك في يده مرتين في المغارة والبرية، وألحّ عليه رجاله ليقتله، لكنه قطع طرف جبته فقط وبكى قلبه ندماً.',
      verse: '«حَاشَا لِي مِنْ قِبَلِ الرَّبِّ أَنْ أَعْمَلَ هذَا الأَمْرَ بِسَيِّدِي، بِمَسِيحِ الرَّبِّ، فَأَمُدَّ يَدِي إِلَيْهِ، لأَنَّهُ مَسِيحُ الرَّبِّ هُوَ» (1 صموئيل 24: 6)',
      patristicInsight: '«الذي ينتقم لنفسه يُقصي يد الله عن الدفاع عنه؛ أما الذي يستر على مضايقيه ويخشى مسّ مسحاء الرب، يضع الله على عاتقه نصره وتزكيته».',
      patristicSaint: 'مار إسحق السرياني',
      consecratedApplication: 'حتى لو هوجم المكرس أو عومل بظلم أو قسوة من زملائه أو رؤسائه في الكنيسة، لا يستغل المنابر أو المجالس للرد والتشهير، بل يترك الأمر للقاضي العادل ويسعى للسلام.',
      dangerToAvoid: 'تصفية الحسابات تحت ستار الدفاع عن الحق والغيرة العقائدية المغلوطة.',
    },
    {
      id: 3,
      title: '٣. العشق الروحي للعبادة والتسبيح الدائم (روح المزامير)',
      subtitle: '«سَبْعَ مَرَّاتٍ فِي النَّهَارِ سَبَّحْتُكَ عَلَى أَحْكَامِ عَدْلِكَ»، و«فِي نِصْفِ اللَّيْلِ أَقُومُ لأَحْمَدَكَ».',
      verse: '«وَاحِدَةً سَأَلْتُ مِنَ الرَّبِّ وَإِيَّاهَا أَلْتَمِسُ: أَنْ أَسْكُنَ فِي بَيْتِ الرَّبِّ كُلَّ أَيَّامِ حَيَاتِي، لِكَيْ أَنْظُرَ إِلَى جَمَالِ الرَّبِّ، وَأَتَفَرَّسَ فِي هَيْكَلِهِ» (مزمور 27: 4)',
      patristicInsight: '«داود لم يكن يصلي ليقضي فرضاً، بل كان يترنم كعصفور وجد عشه في هيكل الله. صلاته كانت شبعاً ونَفَساً لا يطيق انقطاعه».',
      patristicSaint: 'القديس أثناسيوس الرسولي',
      consecratedApplication: 'المكرس لا يجعل صلاة الأجبية والتسبيح روتيناً مفروضاً، بل ينتظر ساعات المخدع والقداس كما ينتظر العطشان ينابيع المياه الحية.',
      dangerToAvoid: 'الروتين الجاف والسرعة في تلاوة المزامير لإنهاء الفرض الروحي.',
    },
    {
      id: 4,
      title: '٤. التواضع وكسر الكرامة الزمنية والجهل بالذات (الرقص أمام التابوت)',
      subtitle: 'خلع ثياب الملك ولبس أفوداً من كتان ورقص بكل قوته فرحاً بحضور الله، ولم يبالِ بتهكم ميكال ابنة شاول.',
      verse: '«فَقَالَ دَاوُدُ لِمِيكَالَ: إِنَّمَا أَمَامَ الرَّبِّ... وَإِنِّي أَتَصَاغَرُ دُونَ هذَا، وَأَكُونُ وَضِيعًا فِي عَيْنَيْ نَفْسِي» (2 صموئيل 6: 21-22)',
      patristicInsight: '«الكبرياء يحسب الكرامة الأرضية والظهور المهيب، أما الحب المكرس فينسى النفس ويتصاغر حتى التراب لكي يتمجد سيده وحده».',
      patristicSaint: 'القديس باسيليوس الكبير',
      consecratedApplication: 'المكرس يفرح بالخدمات المتواضعة الصامتة (تنظيف الكنيسة، خدمة المرضى، الجلوس مع المنبوذين) بلا اهتمام بالمناصب أو المظاهر الإكليريكية الفاخرة.',
      dangerToAvoid: 'حب الظهور في الصفوف الأولى والضيق إذا لم يُقدَّم في المحافل والمناسبات.',
    },
    {
      id: 5,
      title: '٥. الغيرة المقدسة لاسم الله وحده لا للكرامة الشخصية (مواجهة جليات)',
      subtitle: 'لم يتحرك داود بدافع الشهرة أو إثبات الذات، بل لأن جليات «عيّر صفوف الله الحي»، فواجهه باسم رب الجنود لا بسيف وترس.',
      verse: '«أَنْتَ تَأْتِي إِلَيَّ بِسَيْفٍ وَبِرُمْحٍ وَبِتُرْسٍ، وَأَنَا آتِي إِلَيْكَ بِاسْمِ رَبِّ الْجُنُودِ إِلهِ صُفُوفِ إِسْرَائِيلَ الَّذِينَ عَيَّرْتَهُمْ» (1 صموئيل 17: 45)',
      patristicInsight: '«الغيرة التي حسب قلب الله لا تبحث عن تصفيق الجماهير ولا تتغذى على مدح الرؤساء، بل تلتهب ناراً حين يُهان اسم المسيح أو تُهمل النفوس المشتراة بدمه».',
      patristicSaint: 'القديس يوحنا كاسيان',
      consecratedApplication: 'يقف المكرس بثبات وبوداعة أمام تيارات العصر والإغراءات والتشكيك، متسلحاً بقوة الصلاة وكلمة الإنجيل وسيرة الآباء، لا بالجدل العقيم.',
      dangerToAvoid: 'الغيرة الحسودة التي تحارب الخدام الناجحين تحت دعوى الحفاظ على النظام.',
    },
    {
      id: 6,
      title: '٦. قبول التأديب الإلهي واحتضان الصليب دون تذمر (موقف شمعي بن جيرا)',
      subtitle: 'حين سبّه شمعي بن جيرا ورماه بالحجارة وأراد أبيشاي قتله، قال داود بوداعة: «دَعُوهُ يَسُبَّ، لأَنَّ الرَّبَّ قَالَ لَهُ... لَعَلَّ الرَّبَّ يَنْظُرُ إِلَى مَذَلَّتِي وَيُكَافِئُنِي خَيْرًا».',
      verse: '«دَعُوهُ يَسُبَّ لأَنَّ الرَّبَّ قَالَ لَهُ. لَعَلَّ الرَّبَّ يَنْظُرُ إِلَى مَذَلَّتِي، وَيُكَافِئُنِي الرَّبُّ خَيْرًا عِوَضَ مَسَبَّتِهِ هذَا الْيَوْمَ» (2 صموئيل 16: 11-12)',
      patristicInsight: '«المكرس العظيم ليس هو من لا يتعرض للتجارب والإهانات، بل من يبتلع المرارة كدواء إلهي لتنقية شوائب النفس، فيتحول الحجر المرمي عليه إلى حجر زاوية في بنائه الروحي».',
      patristicSaint: 'القديس دوروثيؤس غزة',
      consecratedApplication: 'حين يمر المكرس بضائقة أو اتهام باطل أو جفاء من الرعية، لا يتذمر ولا يشكو للناس، بل يسجد أمام الصليب طالباً رحمة الله وتنقية النفس.',
      dangerToAvoid: 'التبرم والتذمر ولعب دور الضحية ومطالبة الكنيسة برد الاعتبار البشري.',
    },
    {
      id: 7,
      title: '٧. المشورة الإلهية والاسترشاد الدائم قبل كل خطوة (أأصعد يا رب؟)',
      subtitle: 'في كل معركة وقرار مصيري، كان داود يستدعي الأبياثار الكاهن ويطلب الإفود ليسأل الرب: «أَأَصْعَدُ؟ أَأَلْحَقُ هذَا الْجَيْشَ؟»، ولم يتكل قط على حكمته الحربية.',
      verse: '«فَسَأَلَ دَاوُدُ مِنَ الرَّبِّ قَائِلاً: أَأَصْعَدُ إِلَى إِحْدَى مَدَائِنِ يَهُوذَا؟ فَقَالَ لَهُ الرَّبُّ: اصْعَدْ. فَقَالَ دَاوُدُ: إِلَى أَيْنَ أَصْعَدُ؟ فَقَالَ: إِلَى حَبْرُونَ» (2 صموئيل 2: 1)',
      patristicInsight: '«من يسير برأيه الخاص يسقط سريعاً في فخاخ الظنون، أما من يسأل الرب ويخضع لمشورة المرشد الروحي، فخطواته محفوظة في نور المعرفة الإلهية».',
      patristicSaint: 'القديس أنطونيوس الكبير',
      consecratedApplication: 'لا يخطو المكرس خطوة في مشروع خدمي أو نقلة في حياته دون صلاة مسبوقة بدموع في المخدع، ومراجعة أمينة مع أب اعترافه ومرشده الروحي.',
      dangerToAvoid: 'الاعتداد بالذكاء البشري والإدارة التكنوقراطية الجافة دون الرجوع لصوت الروح القدس.',
    },
  ];

  // 2. DAILY CANONICAL RHYTHM FOR THE CONSECRATED SOUL
  const rhythmSchedule = [
    {
      time: '٠٥:٠٠ ص - ٠٧:٠٠ ص',
      title: 'ساعة الفجر وباكر: ركن المخدع والندى الإلهي',
      icon: '🌅',
      focus: 'الصمت المقدس، صلاة باكر من الأجبية، صلاة يسوع، وقراءة سفر المزامير بتمهل.',
      goldenRule: '«لا تبدأ يومك بالاطلاع على الرسائل أو الأخبار؛ دع الكلمة الإلهية تكون هي أول طعام يتذوقه عقلك».',
    },
    {
      time: '٠٧:٠٠ ص - ٠٩:٠٠ ص',
      title: 'ركن القداس الإلهي والشركة المقدسة',
      icon: '🍞',
      focus: 'المشاركة الواعية في الإفخارستيا، استدعاء روح التوبة والانسحاق أمام المذبح المقدس.',
      goldenRule: '«قف أمام المذبح كشخص يرى السماء مفتوحة، واحمل في قلبك كل المتألمين والخطاة في طلبتك».',
    },
    {
      time: '٠٩:٣٠ ص - ١٢:٠٠ ظ',
      title: 'ركن الدرس اللاهوتي والآبائي (Lectio Divina)',
      icon: '📖',
      focus: 'دراسة العهدين بشروح الآباء الأولين، قراءة التاريخ الكنسي، واللاهوت العقيدي والدفاعي.',
      goldenRule: '«الخادم الذي لا يقرأ بانتظام يجف ينبوعه سريعاً ويبدأ في تكرار كلام بلا روح ولا عمق».',
    },
    {
      time: '١٢:٠٠ ظ - ٠٥:٠٠ م',
      title: 'ركن الخدمة الميدانية والعمل اليدوي الباذل',
      icon: '🤝',
      focus: 'الافتقاد، خدمة الفقراء والمرضى، التدبير الكنسي، والعمل اليدوي المنظم بنقاء قصد.',
      goldenRule: '«اخدم كمن يغسل أرجل المسيح في شخص إخوته الأصاغر؛ ولا تطلب أجراً سوى رضاه».',
    },
    {
      time: '٠٥:٠٠ م - ٠٧:٠٠ م',
      title: 'ركن صلاة الغروب والهدوء واسترجاع السلام',
      icon: '🌇',
      focus: 'صلاة الغروب والنوم، قطع حبال التشتت اليومية، وفصل الذهن عن مشاكل الرعية.',
      goldenRule: '«سلم كل ما زرعته اليوم ليد الله العلي، وتذكر أنك لست المخلص بل خادم المخلص».',
    },
    {
      time: '٠٩:٠٠ م - ١٠:٣٠ م',
      title: 'ركن فحص الضمير المسائي وصلاة نصف الليل',
      icon: '🕯️',
      focus: 'محاسبة النفس على حركات القلب والفكر واللسان، صلاة نصف الليل، ورش المخدع بدموع الرجاء.',
      goldenRule: '«نم كمن ينام في حضن الآب السماوي، مستعداً للقاء الرب في أي لحظة».',
    },
  ];

  // 3. ENCYCLOPEDIA OF SPIRITUAL WARFARE
  const warfareCompendium = [
    {
      id: 'warfare_1',
      title: 'حرب أزمة الدعوة والشك في الطريق (Crisis of Vocation)',
      symptoms: 'الشعور بالندم على ترك العالم، التساؤل المؤلم: «هل كان اختياري للتكريس صواباً أم وهماً؟»، مقارنة النفس مع أقران حققوا ثروات ومناصب.',
      verse: '«لَيْسَ أَحَدٌ يَضَعُ يَدَهُ عَلَى الْمِحْرَاثِ وَيَنْظُرُ إِلَى الْوَرَاءِ يَصْلُحُ لِمَلَكُوتِ اللهِ» (لوقا 9: 62)',
      fathersRemedy: '«حين يهاجمك فكر الشك في دعوتك، تذكر الحرارة الأولى التي اشتعل بها قلبك يوم سجدت أمام المصلوب واهباً حياتك له. العدو يشتهي أن يسلبك إكليلك حين يقترب النصر». — القديس أنطونيوس الكبير',
      practicalPrescription: 'افتح مذكرات خلوتك الأولى واقرأ الآية التي دعاك الله بها. اذهب لأب اعترافك فوراً ولا تناقش هذا الفكر بمفردك في الليل.',
    },
    {
      id: 'warfare_2',
      title: 'حرب الاعتياد على المقدسات وجفاف المذبح (Desensitization to the Sacred)',
      symptoms: 'أداء الطقوس والأسرار بلا رهبة، مسّ الأواني المقدسة وكأنها أدوات عادية، تلاوة الصلوات باللسان مع غياب كامل للقلب.',
      verse: '«مَلْعُونٌ مَنْ يَعْمَلُ عَمَلَ الرَّبِّ بِرَخَاوَةٍ» (إرميا 48: 10)',
      fathersRemedy: '«ويل للمكرس الذي يألف الهيكل حتى يفقد خوف الله فيه! قف أمام المذبح مرتعداً كمن يقف بين الكاروبيم والسيرافيم الذين يغطون وجوههم من بهاء المجد». — القديس يوحنا ذهبي الفم',
      practicalPrescription: 'الزم الصمت التام لـ ١٠ دقائق داخل الهيكل أو قلايتك قبل بدء أي خدمة، وتأمل في جراحات الحمل المذبوح لأجلك.',
    },
    {
      id: 'warfare_3',
      title: 'حرب المقارنة الإكليريكية والشعور بالتهميش (Ecclesiastical Jealousy & Comparison)',
      symptoms: 'الحزن لترقية زميل أو مديحه أمام الشعب، الشعور بأنك أحق منه بالمناصب أو التقدير، صعوبة الصلاة بنقاء من أجل من يتقدم عليك.',
      verse: '«لاَ شَيْئًا بِتَحَزُّبٍ أَوْ بِعُجْبٍ، بَلْ بِتَوَاضُعٍ، حَاسِبِينَ بَعْضُكُمُ الْبَعْضَ أَفْضَلَ مِنْ أَنْفُسِهِمْ» (فيلبي 2: 3)',
      fathersRemedy: '«إذا أردت أن تذبح حية الحسد في مهدها، فكن أول من يهنئ أخاك المكرس ويثني عليه أمام الناس، وصلّ من أجله في مخدعك أن يزيده الله نعمة». — القديس يوحنا كاسيان',
      practicalPrescription: 'صم يوماً وقدم قرباناً بنية نجاح الخادم الذي تشعر بالغيرة منه، وسترى كيف يسكب الروح القدس سلاماً فائقاً في صدرك.',
    },
    {
      id: 'warfare_4',
      title: 'حرب التوتر بين خدمة المائدة وسكون المخدع (Martha vs Mary Tension)',
      symptoms: 'الانهماك في الاجتماعات والميزانيات وإدارة المنشآت الكنسية حتى لا يتبقى وقت للمخدع والهدوء والاعتراف.',
      verse: '«مَرْثَا، مَرْثَا، أَنْتِ تَهْتَمِّينَ وَتَضْطَرِبِينَ لأَجْلِ أُمُورٍ كَثِيرَةٍ، وَلكِنَّ الْحَاجَةَ إِلَى وَاحِدٍ» (لوقا 10: 41-42)',
      fathersRemedy: '«الخدمة التي لا تتغذى من ينبوع المخدع هي ماء ملوث يمرض الشاربين بدلاً من أن يرويهم. لا تخدم الناس بكلام فارغ من مسحة الروح». — مار إسحق السرياني',
      practicalPrescription: 'ضع قانوناً حديدياً: إذا لم تصلِ مزاميرك وإنجيلك الصباحي، اعتذر عن المواعيد الإدارية حتى تروي نفسك أولاً.',
    },
    {
      id: 'warfare_5',
      title: 'حرب الوحشة والوحدة المظلمة vs الخلوة المقدسة (Loneliness vs Solitude)',
      symptoms: 'الشعور بالغربة والوحشة القاتلة حين ينتهي النشاط وينفضّ الناس، ومحاولة ملء الفراغ بمكالمات هاتفية لا طائل منها أو تصفح الإنترنت لساعات.',
      verse: '«أَنَا لَسْتُ وَحْدِي لأَنَّ الآبَ مَعِي» (يوحنا 16: 32)',
      fathersRemedy: '«الفرق بين الوحدة المظلمة والخلوة المنيرة هو حضور المسيح؛ فالوحدة تطلب الناس لتتغذى عليهم، أما الخلوة فتترك الناس لترتمي في أحضان الحبيب السماوي». — القديس مكاريوس الكبير',
      practicalPrescription: 'أغلق هاتفك تماماً كل ليلة في الساعة التاسعة مساءً، وأشعل شمعة وتأمل في أيقونة المصلوب مكرراً: «يا ربي يسوع، أنت كفايتي وفرحي».',
    },
    {
      id: 'warfare_6',
      title: 'حرب الإحباط لقلة الثمار وجحود المخدومين (Fruitlessness & Ingratitude)',
      symptoms: 'الشعور باليأس لأن الشباب أو الرعية لا يتغيرون بعد سنوات من البذل، أو لأنهم يقابلون محبة الخادم بالإساءة والتنمر.',
      verse: '«عَبَثًا تَعِبْتُ، بَاطِلاً وَفَارِغًا أَفْنَيْتُ قُدْرَتِي. لكِنَّ حَقِّي عِنْدَ الرَّبِّ، وَعَمَلِي عِنْدَ إِلهِي» (إشعياء 49: 4)',
      fathersRemedy: '«الله لن يسألك في يوم الدينونة: كم نفساً خلصت؟ بل: هل خدمت بأمانة ومحبة وصبر حتى النفس الأخير؟ الثمر عمل النعمة، أما البذار فتعبك». — القديس دوروثيؤس',
      practicalPrescription: 'أعد قائمة بأسماء المتعبين من المخدومين وضعها على مذبح الصلاة كل صباح دون أن تعاتبهم بمرارة.',
    },
  ];

  // 4. CONSECRATED SECRET PRAYERS (صلوات ومناجاة المكرس السرية)
  const consecratedPrayers = [
    {
      id: 'p1',
      title: 'صلاة قبل الدخول إلى الهيكل المقدس أو بدء الخدمة',
      subtitle: 'صلاة الخشوع وانسحاق الروح عند عتبة الأقداس',
      text: '«أيها الرب الإله، فاحص القلوب والكلى، الذي يسجد له الشاروبيم برعدة، أنظر إلى ضعفي ونجاستي ولا تطردني من أمام بهاء قدسك. طهر شفتي بجمرة مذبحك المقدس، واغسل قلبي بدمك الطاهر، لكي أقف أمامك لا بدينونة، بل بروح وداعة وانسحاق، خادماً لأسرارك المقدسة، حاملاً كل نفس متعبة بين يدي رأفتك... لأن لك المجد والكرامة مع أبيك الصالح والروح القدس، الآن وكل أوان وإلى دهر الدهور. آمين».',
      author: 'من صلوات الآباء القديسين في سر الإفخارستيا',
    },
    {
      id: 'p2',
      title: 'صلاة عند ارتداء الثياب الكنسية أو التكريسية (التونية / الإسكيم)',
      subtitle: 'تذكار خلع الإنسان العتيق والتسربل ببر المسيح',
      text: '«لتفرح نفسي بالرب، لأنه ألبسني ثياب الخلاص، وكساني رداء البر، كعريس يتزين بعمامته، وكعروس تتحلى بحليها. يا ربي يسوع المسيح، كما أستر جسدي الترابي بهذا الثوب الطاهر، استر عيوبي وسقطاتي برداء لاهوتك، واجعل حياتي نوراً هادياً لكل من يراني، لا أطلب مجداً لنفسي، بل أن يتمجد اسمك القدوس في كل كلمة وعمل وسكون. آمين».',
      author: 'طقس وتقليد الكنيسة القبطية الأرثوذكسية',
    },
    {
      id: 'p3',
      title: 'صلاة المكرس من أجل الرعية والمخدومين والمتعبين بالاسم',
      subtitle: 'حمل النفوس على الصدر كلوحة رئيس الكهنة',
      text: '«أيها الراعي الصالح، الذي وضع نفسه عن الخراف، ها أنا أضع بين يديك كل نفس أوكلتني عليها في هذه الخدمة. أذكر يا رب المرضى واشفهم، والحيارى وأرشدهم، والمنكسرين وعزهم، والبعيدين وردهم إلى حضنك. إن كنت أنا عاجزاً وقليل الحيلة، فيدك قادرة ولم تقصر عن الخلاص. لا تسمح أن يهلك أحد بسبب ضعفي أو عثرتي أو إهمالي، بل خلصنا جميعاً واجمعنا في ملكوتك الأبدي. آمين».',
      author: 'من وحي صلاة شفاعة الرعاة',
    },
    {
      id: 'p4',
      title: 'صلاة في المخدع عند المساء وهدوء القلاية',
      subtitle: 'تسليم اليوم وأتعابه للمخلص الحبيب',
      text: '«انقضى النهار يا سيدي، وحل المساء، وأنا أقف أمامك معترفاً بتقصيري وشايداً بجودك. كل خير عملته اليوم فهو من نعمتك وحدك، وكل نقص فهو من جهلي وضعفي. ها أنا أضع ثقل الخدمة وتعب الساعات عند قدميك المثقوبتين. أعطني نوماً هادئاً محروساً بملائكتك، ونقِّ حواسي وأفكاري من خيالات الباطل، لكي إذا قمت في باكر، أسبحك بقلب نقي وفكر منير. آمين».',
      author: 'من تراث السكونية الرهبانية (Hesychia)',
    },
  ];

  // 5. DIAKRISIS & DISCERNMENT MATRIX (ميزان الإفراز والتمييز الروحي والكنسي)
  const diakrisisComparisons = [
    {
      graceVoice: 'صوت الروح القدس والنعمة',
      graceDesc: 'يأتي بهدوء وسلام عميق يملأ القلب طمأنينة حتى وسط الصعوبات، ويقود دائماً إلى الاتضاع وإنكار الذات ومحبة الإخوة.',
      enemyVoice: 'صوت الذات أو فخ العدو المتنكر',
      enemyDesc: 'يأتي باضطراب واستعجال وتشويش، يغذي حب الظهور وإثبات النفس والتذمر، ويزرع ريبة وشكاً في المرشدين والإخوة.',
    },
    {
      graceVoice: 'الغيرة المقدسة الحقيقية',
      graceDesc: 'تلتهب ناراً لخلاص النفوس ومجد الله، وتصاحبها دموع الوداعة والشفقة على الخطاة والحرص الشديد على وحدة الكنيسة.',
      enemyVoice: 'التعصب الأعمى والحسد الحزبي',
      enemyDesc: 'تبحث عن الانتصار في الجدال والتشهير بالمخالفين، وتفرح بكشف عثرات الآخرين تحت ستار "حماية العقيدة والنظام".',
    },
    {
      graceVoice: 'الاتضاع الإنجيلي وانسحاق القلب',
      graceDesc: 'معرفة حقيقية بالنفس تملأ القلب شجاعة ورجاءً في نعمة المسيح، مع استعداد لخدمة أصغر إنسان بفرح حقيقي.',
      enemyVoice: 'صغر النفس واليأس والهروب',
      enemyDesc: 'ترك الخدمة والانسحاب بسبب الخوف من الفشل أو جرح الكرامة، مصحوباً باللوم الدائم للظروف وللآخرين.',
    },
    {
      graceVoice: 'الحزم الرعوي الأبوي الشافي',
      graceDesc: 'كلمة حق تنطق بوداعة ومحبة باذلة لإنقاذ النفس من الضياع، كطبيب يبتر العضو الفاسد بدموع الشفقة والألم.',
      enemyVoice: 'القسوة والتعالي الإداري',
      enemyDesc: 'إملاء الأوامر بعنف وسلطوية لإظهار النفوذ والسيطرة، دون استعداد لتحمل تكلفة إصلاح الضعفاء أو معاناتهم.',
    },
  ];

  // 6. THE 10 GOLDEN CONSECRATION DIRECTIVES
  const goldenDirectives = [
    {
      number: '١',
      title: 'اجعل المخدع قبل المذبح، والصلوات قبل الأنشطة',
      desc: 'فالذي لا يقف طويلاً أمام الله في الخفاء لن يثبت أمامه أحد في العلن.',
    },
    {
      number: '٢',
      title: 'لا تمد يدك إلى مجد الله ولا تختلس مدح الناس لنفسك',
      desc: 'المجد الباطل لص يسرق بركات السنين في ثوانٍ معدودة؛ إذا مدحك الناس فقل سراً: «المجد لك يا رب، أنا عبد بطال».',
    },
    {
      number: '٣',
      title: 'استر على ضعف إخوتك المكرسين كما تستر على عينك',
      desc: 'من يشهر بأخيه أو يسعى لإسقاطه ليظهر هو، سقط من عين الله حتى لو أقام موتى.',
    },
    {
      number: '٤',
      title: 'حافظ على بساطة العيش وتجرد القلب من اقتناء الزائلات',
      desc: 'كلما ثقلت أحمالك المادية في العالم، عجزت أجنحة روحك عن التحليق في سماء النعمة.',
    },
    {
      number: '٥',
      title: 'كن حكيماً كالحيات ووديعاً كالحمام في معاملة الناس',
      desc: 'لا تخلط بين المحبة والتساهل، ولا بين الحزم والقسوة؛ وليكن ميزانك دائماً هو الإفراز الروحي.',
    },
    {
      number: '٦',
      title: 'اجعل الكتاب المقدس وكتب الآباء خبزك اليومي الذي لا ينقطع',
      desc: 'المكرس الذي لا يقرأ هو شجرة بلا جذور، تقتلعها أول عاصفة فكرية أو بدعة معاصرة.',
    },
    {
      number: '٧',
      title: 'لا تقدم خطوة في حياتك أو خدمتك بلا إرشاد أب اعترافك',
      desc: 'الذي يقود نفسه يقوده الشيطان وهو يظن أنه يسير في طريق الفضيلة والقداسة.',
    },
    {
      number: '٨',
      title: 'احذر فضول العين والأذن وثرثرة وسائل التواصل',
      desc: 'الإنترنت المفتوح بلا ضابط هو ثقب في قاع سفينة التكريس يُغرق الروح في وحل التشتت والشهوات.',
    },
    {
      number: '٩',
      title: 'أحب الجميع بالتساوي، ولا تقصر قلبك على فئة مرفهة أو محبوبة',
      desc: 'المسيح افتقد العشارين والسامرية والبرص؛ فليكن لك نفس القلب المفتوح للمجروحين والمنكسرين.',
    },
    {
      number: '١٠',
      title: 'عش كل يوم كأنه يومك الأخير على الأرض',
      desc: 'ضع الموت والدينونة أمام عينيك دائماً، فتبطل محبة العالم وتهرب الأفكار الردية ويسكنك سلام الأبدية.',
    },
  ];

  // 7. VOWS RENEWAL & MILESTONES STATE
  const [vowName, setVowName] = useState(currentUser?.name || 'خادم مكرس للمسيح');
  const [vowVocation, setVowVocation] = useState<string>(currentUser?.vocation || 'مكرسة');
  const [vowDiocese, setVowDiocese] = useState(currentUser?.diocese || 'إيبارشية / دير كنسي');
  const [vowVerse, setVowVerse] = useState('«مَعَ الْمَسِيحِ صُلِبْتُ، فَأَحْيَا لاَ أَنَا، بَلِ الْمَسِيحُ يَحْيَا فِيَّ» (غلاطية 2: 20)');
  const [vowDate] = useState(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [isVowSigned, setIsVowSigned] = useState(false);

  const handleSignVow = () => {
    soundManager.playVictory();
    setIsVowSigned(true);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  // 8. PATRISTIC CANON - THE 20 GOLDEN VOLUMES
  const patristicVolumes = [
    {
      category: 'الحياة الرهبانية والتكريس',
      title: 'بستان الرهبان (أقوال الآباء شيوخ البرية)',
      author: 'آباء برية الإسقيط ونتريا',
      coreTheme: 'أصول حياة السكون، التواضع، حراسة الفكر، والجهاد ضد الشياطين.',
    },
    {
      category: 'الحياة الرهبانية والتكريس',
      title: 'رسائل القديس أنطونيوس الكبير',
      author: 'القديس أنطونيوس أب الرهبان',
      coreTheme: 'معرفة النفس، مواجهة حيل إبليس، وعمل الروح القدس في التطهير.',
    },
    {
      category: 'الحياة الرهبانية والتكريس',
      title: 'سلم الفضائل الإلهية',
      author: 'القديس يوحنا الدرجي',
      coreTheme: '٣٠ درجة متدرجة للارتقاء الروحي من التوبة حتى قمة المحبة والإفراز.',
    },
    {
      category: 'اللاهوت والعقيدة',
      title: 'تجسد الكلمة (De Incarnatione)',
      author: 'القديس أثناسيوس الرسولي',
      coreTheme: 'قضية الفداء والخلاص، حتمية التجسد الإلهي، وهزيمة الموت بالقيامة.',
    },
    {
      category: 'اللاهوت والعقيدة',
      title: 'الرسائل الفصحية ودفاعيات الإيمان',
      author: 'القديس كيرلس الكبير (عمود الدين)',
      coreTheme: 'وحدة طبيعة الكلمة المتجسد وحراسة لاهوت الفداء الأرثوذكسي.',
    },
    {
      category: 'الرعاية والكهنوت والخدمة',
      title: 'كتاب الكهنوت (De Sacerdotio)',
      author: 'القديس يوحنا ذهبي الفم',
      coreTheme: 'قداسة ورهبة الخدمة الكهنوتية، أمانة الكلمة، وخطر المجد الباطل.',
    },
    {
      category: 'الرعاية والكهنوت والخدمة',
      title: 'المناظرات والمؤسسات الرهبانية',
      author: 'القديس يوحنا كاسيان',
      coreTheme: 'تحليل الأفكار الشريرة الثمانية وسبل قهرها بقوة النعمة الإلهية.',
    },
    {
      category: 'الصلاة والسكون والتأمل',
      title: 'مقالات مار إسحق السرياني النسكية',
      author: 'مار إسحق السرياني أسقف نينوى',
      coreTheme: 'سكون الهيزيكيا، الصلاة النقية، والدموع الروحية الفائضة بالمحبة.',
    },
  ];

  // 9. EMERGENCY FIRST AID KITS
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);

  const emergencyKits = [
    {
      id: 'anger',
      label: 'غضب مفاجئ في الاجتماع أو مع زميل',
      icon: '🔥',
      color: 'from-rose-900 to-rose-950',
      action: 'اصمت تماماً فوراً، ضع لسانك في سقف حلقك، وقل سراً ثلاث مرات: «يا ربي يسوع المسيح، اعطني وداعة قلبك واغفر لي ولمن أغضبني». لا تتخذ أي قرار وأنت منفعل.',
      verse: '«لِيَكُنْ كُلُّ إِنْسَانٍ مُسْرِعًا فِي الاسْتِمَاعِ، مُبْطِئًا فِي التَّكَلُّمِ، مُبْطِئًا فِي الْغَضَبِ» (يعقوب 1: 19)',
    },
    {
      id: 'despair',
      label: 'شعور بثقل الفشل والفتور الروحي الحاد',
      icon: '🌧️',
      color: 'from-amber-900 to-stone-900',
      action: 'اركع فوراً على ركبتيك في مخدعك، واقرأ مزمور 51 (ارحمني يا الله) بدموع وبصوت مسموع. تذكر أن النعمة لا تيأس منك حتى لو سقطت سبع مرات.',
      verse: '«لاَ تَشْمَتِي بِي يَا عَدُوَّتِي، إِذَا سَقَطْتُ أَقُومُ. إِذَا جَلَسْتُ فِي الظُّلْمَةِ فَالرَّبُّ نُورٌ لِي» (ميخا 7: 8)',
    },
    {
      id: 'pride',
      label: 'نشوة المديح وخطر الكبرياء بعد نجاح خدمة',
      icon: '👑',
      color: 'from-purple-900 to-stone-900',
      action: 'انزل في خفاء واغسل حذاء أحد الإخوة أو قم بعمل خدمة وضيعة لا يراها أحد. قل لنفسك: «أنت تراب ورماد، والفضل كله للدم المسفوك على الصليب».',
      verse: '«كَذلِكَ أَنْتُمْ أَيْضًا، مَتَى فَعَلْتُمْ كُلَّ مَا أُمِرْتُمْ بِهِ فَقُولُوا: إِنَّنَا عَبِيدٌ بَطَّالُونَ» (لوقا 17: 10)',
    },
    {
      id: 'temptation',
      label: 'هجوم فكر دنس أو شهوة عابرة للعين',
      icon: '⚡',
      color: 'from-red-950 to-stone-900',
      action: 'اهرب فوراً من المكان، غير وضعك الجسدي، اغسل وجهك بالماء البارد، واصرخ باسم يسوع المسيح بصوت مسموع عدة مرات؛ فرائحة اسم يسوع تحرق سهام العدو.',
      verse: '«اُهْرُبْ لِحَيَاتِكَ. لاَ تَنْظُرْ إِلَى وَرَائِكَ، وَلاَ تَقِفْ فِي كُلِّ الدَّائِرَةِ» (تكوين 19: 17)',
    },
    {
      id: 'injustice',
      label: 'إهانة علنية أو ظلم واتهام كاذب',
      icon: '🛡️',
      color: 'from-emerald-950 to-stone-900',
      action: 'تذكر شمعي بن جيرا وهو يسب داود، وتذكر المسيح الصامت أمام بيلاطس. قل: «طوباكم إذا عيروكم وطردوكم وقالوا عليكم كل كلمة شريرة من أجلي كاذبين».',
      verse: '«إِذْ شُتِمَ لَمْ يَكُنْ يَشْتِمُ عِوَضًا، وَإِذْ تَأَلَّمَ لَمْ يَكُنْ يُهَدِّدُ بَلْ كَانَ يُسَلِّمُ لِمَنْ يَقْضِي بِعَدْل» (1 بطرس 2: 23)',
    },
  ];

  const filteredWarfares = warfareCompendium.filter(
    (w) =>
      w.title.includes(searchQuery) ||
      w.symptoms.includes(searchQuery) ||
      w.fathersRemedy.includes(searchQuery)
  );

  const handleCopySection = (title: string, content: string) => {
    soundManager.playVictory();
    const textToCopy = `📖 مرجع المكرس | حسب قلب الله\n\n📌 ${title}\n\n${content}\n\n✝️ تطبيق «حسب قلب الله» - مرجع التكريس والحياة الكنسية`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-fade-in text-right" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للرئيسية والعجلة</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateToPrayerFortress && (
            <button
              onClick={onNavigateToPrayerFortress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-700/30 hover:from-amber-600/50 hover:to-amber-700/50 text-amber-200 border border-amber-500/50 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>حصن الصلاة اليومي</span>
            </button>
          )}

          {onNavigateToSpiritualFather && (
            <button
              onClick={onNavigateToSpiritualFather}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 text-xs font-bold transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>أبوي الروحي</span>
            </button>
          )}

          {onNavigateToOasis && (
            <button
              onClick={onNavigateToOasis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 text-xs font-bold transition cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>واحة السكون</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-amber-950/90 to-stone-950 text-stone-100 p-6 sm:p-9 border-2 border-amber-500/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-bold">
            <Scroll className="w-4 h-4 text-amber-400" />
            <span>الدستور الآبائي المرجعي الشامل للمكرس</span>
          </div>

          <div className="text-xs text-amber-200/90 font-mono bg-stone-900/80 px-3 py-1 rounded-xl border border-stone-800 flex items-center gap-1.5">
            <span>✨ «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي»</span>
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h1 className="font-spiritual text-2xl sm:text-4xl font-black text-amber-100 tracking-wide leading-tight">
            📖 مرجع المكرس الكنسي | كيف تعيش حسب قلب الله
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            الدليل العملي والروحي الموثق لكل مكرس، كاهن، راهب، راهبة، مكرسة، أو خادم أمين يريد أن ينبض قلبه بقلب المسيح، من خلال دستور قلب داود، كانون اليوم المتزن، موسوعة الحروب الروحية، والوصايا الذهبية لحياة النذر والتكريس.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 pt-3 overflow-x-auto text-xs font-bold scrollbar-none relative z-10">
          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('david_heart');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'david_heart'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-300" />
            <span>دستور قلب داود</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('daily_rhythm');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'daily_rhythm'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-300" />
            <span>كانون اليوم المتزن</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('warfare_guide');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'warfare_guide'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span>موسوعة حروب المكرس</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('consecrated_prayers');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'consecrated_prayers'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>صلوات ومناجاة المكرس</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('diakrisis_discernment');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'diakrisis_discernment'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-300" />
            <span>ميزان الإفراز والتمييز</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('golden_directives');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'golden_directives'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>الوصايا الذهبية العشر</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('vows_milestones');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'vows_milestones'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-300" />
            <span>ميثاق تجديد العهد</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('patristic_canon');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'patristic_canon'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Library className="w-4 h-4 text-amber-300" />
            <span>مراجع المكرس الذهبية</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveSection('emergency_first_aid');
            }}
            className={`px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
              activeSection === 'emergency_first_aid'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-300" />
            <span>صيدلية التدخل السريع</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DAVID'S HEART */}
      {/* ========================================================================= */}
      {activeSection === 'david_heart' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-600/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                🌿 لماذا كان داود رجلاً حسب قلب الله؟
              </h3>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                لم يكن داود معصوماً من الخطأ والضعف، لكن قلبه كان ناطقاً بالانسحاق الحقيقي، غيوراً على مجد الله، عاشقاً للصلوات، رافضاً للانتقام الذاتي. تأمل في الركائز السبع وطبقها في يومك:
              </p>
            </div>
            <div className="shrink-0">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
                ٧ سمات إنجيلية
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {davidHeartPillars.map((pillar) => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedPillarId(isSelected ? 0 : pillar.id);
                  }}
                  className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer space-y-4 ${
                    isSelected
                      ? 'bg-gradient-to-b from-stone-900 via-[#18140f] to-stone-900 border-amber-500/60 shadow-xl'
                      : 'bg-stone-900/70 border-stone-800 hover:border-amber-700/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                        <span>{pillar.title}</span>
                      </h4>
                      <p className="text-xs text-amber-300/90 leading-relaxed font-serif">
                        {pillar.subtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopySection(pillar.title, `${pillar.verse}\n\n${pillar.patristicInsight}\n\nتطبيق المكرس: ${pillar.consecratedApplication}`);
                      }}
                      title="نسخ هذه الركيزة"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isSelected && (
                    <div className="space-y-4 pt-3 border-t border-stone-800 animate-fade-in text-xs sm:text-sm">
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 font-spiritual leading-relaxed">
                        {pillar.verse}
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                          <Feather className="w-4 h-4" />
                          <span>رؤية وتأمل الآباء:</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed italic">
                          «{pillar.patristicInsight}»
                        </p>
                        <span className="text-[11px] text-amber-400/80 font-serif block text-left font-bold">
                          — {pillar.patristicSaint}
                        </span>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-900/40 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تطبيق عملي في حياة المكرس المعاصر:</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed">
                          {pillar.consecratedApplication}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex items-center gap-2 text-rose-300 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                        <span><strong>الحرب المضادة التي يجب الحذر منها:</strong> {pillar.dangerToAvoid}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DAILY CANONICAL RHYTHM */}
      {/* ========================================================================= */}
      {activeSection === 'daily_rhythm' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                  <span>⏱️ كانون اليوم المكرس المتزن وميزان الأركان الأربعة</span>
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  المكرس الحقيقي يحيا بتوازن دقيق بين: الصلاة (Oratio)، الدراسة (Studium)، الخدمة (Servitium)، والسكون (Hesychia).
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <span className="text-xs text-stone-400 block">نسبة التوازن اليوم:</span>
                  <span className="text-base font-bold text-amber-300">{rhythmPercentage}%</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-amber-500/50 flex items-center justify-center font-bold text-amber-400 text-sm">
                  {completedRhythmCount}/8
                </div>
              </div>
            </div>

            <div className="w-full h-2.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
                style={{ width: `${rhythmPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {[
                { key: 'morning_prayer', label: 'مخدع الفجر وصلوات باكر' },
                { key: 'agpeya_day', label: 'أجبية النهار (الثالثة، السادسة، التاسعة)' },
                { key: 'bible_study', label: 'دراسة الكتاب المقدس المعمقة' },
                { key: 'patristic_reading', label: 'قراءة في تراث الآباء والعلوم الكنسية' },
                { key: 'consecrated_service', label: 'خدمة باذلة وافتقاد للمتعبين' },
                { key: 'manual_humble_work', label: 'عمل يدوي متواضع وتدبير الكنيسة' },
                { key: 'hesychia_silence', label: 'فترة صمت وهدوء بدون شاشات' },
                { key: 'evening_examen', label: 'محاسبة النفس وصلاة نصف الليل' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleDailyItem(item.key)}
                  className={`p-3 rounded-2xl border text-right transition flex items-start gap-2.5 cursor-pointer text-xs ${
                    dailyChecklist[item.key]
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {dailyChecklist[item.key] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-md border border-stone-700 bg-stone-900" />
                    )}
                  </div>
                  <span className={dailyChecklist[item.key] ? 'line-through opacity-80' : ''}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-spiritual text-base font-bold text-stone-200">
              📅 جدول الساعات المباركة لليوم المكرس النموذجي:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rhythmSchedule.map((slot, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-700/40 transition shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <span className="text-base">{slot.icon}</span>
                      <span>{slot.time}</span>
                    </span>
                  </div>

                  <h4 className="font-spiritual text-base font-bold text-amber-100">
                    {slot.title}
                  </h4>

                  <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                    {slot.focus}
                  </p>

                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/30 text-[11px] text-amber-300 font-serif leading-relaxed">
                    💡 <strong>القاعدة الذهبية:</strong> {slot.goldenRule}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SPIRITUAL WARFARE ENCYCLOPEDIA */}
      {/* ========================================================================= */}
      {activeSection === 'warfare_guide' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 border border-amber-600/40 shadow-md">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في حروب المكرس: الشك في الدعوة، الكبرياء، المقارنة، الفتور، الجفاف..."
              className="w-full bg-transparent text-stone-100 text-xs sm:text-sm outline-none placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-200 text-xs font-bold"
              >
                مسح
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredWarfares.map((warfare) => (
              <div
                key={warfare.id}
                className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-4 text-right"
              >
                <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <h4 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>{warfare.title}</span>
                    </h4>
                  </div>

                  <button
                    onClick={() =>
                      handleCopySection(
                        warfare.title,
                        `الأعراض: ${warfare.symptoms}\n\nالشاهد: ${warfare.verse}\n\nترياق الآباء: ${warfare.fathersRemedy}\n\nالتدريب الحاسم: ${warfare.practicalPrescription}`
                      )
                    }
                    className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 text-xs transition cursor-pointer"
                    title="نسخ هذه الوصفة الروحية"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/30 space-y-1">
                  <span className="text-[11px] font-bold text-rose-300 block">
                    ⚠️ أعراض وتجليات هذه الحرب في قلب المكرس:
                  </span>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {warfare.symptoms}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 font-spiritual text-xs sm:text-sm">
                  {warfare.verse}
                </div>

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5" />
                    <span>ترياق ووصية الآباء:</span>
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic font-serif">
                    {warfare.fathersRemedy}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-600/30 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>الروشتة والتدريب العملي الحاسم:</span>
                  </span>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                    {warfare.practicalPrescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: CONSECRATED SECRET PRAYERS */}
      {/* ========================================================================= */}
      {activeSection === 'consecrated_prayers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border border-amber-600/40 shadow-xl space-y-2">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>صلوات ومناجاة المكرس السرية في المخدع وعتبة الهيكل</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              صلوات مقتبسة من أقدس طقوس وروحانية الآباء الأولين، لتكون عوناً للمكرس حين يقف وحده أمام الله في خفاء القلاية والمذبح.
            </p>
          </div>

          <div className="space-y-4">
            {consecratedPrayers.map((prayer) => (
              <div
                key={prayer.id}
                className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-4"
              >
                <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <h4 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                      {prayer.title}
                    </h4>
                    <p className="text-xs text-amber-400/90 font-serif">{prayer.subtitle}</p>
                  </div>
                  <button
                    onClick={() => handleCopySection(prayer.title, `${prayer.text}\n\n${prayer.author}`)}
                    className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-amber-300 text-xs transition cursor-pointer"
                    title="نسخ نص الصلاة"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 text-stone-200 text-xs sm:text-sm leading-relaxed font-spiritual space-y-2">
                  <p>{prayer.text}</p>
                  <span className="text-[11px] text-amber-400/80 font-mono block text-left">
                    — {prayer.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: DIAKRISIS - DISCERNMENT MATRIX */}
      {/* ========================================================================= */}
      {activeSection === 'diakrisis_discernment' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                ميزان الإفراز والتمييز الكنسي (Diakrisis)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
              قال القديس أنطونيوس: «الإفراز هو قائد كل الفضائل ورأسها». كيف يميز المكرس بين صوت الروح القدس وصوت الذات أو خداع العدو المتنكر؟
            </p>
          </div>

          <div className="space-y-4">
            {diakrisisComparisons.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-md"
              >
                {/* Grace voice */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-600/40 space-y-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{item.graceVoice}</span>
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">{item.graceDesc}</p>
                </div>

                {/* Counterfeit voice */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-600/40 space-y-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{item.enemyVoice}</span>
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed">{item.enemyDesc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 4-Step Discernment Process */}
          <div className="p-6 rounded-3xl bg-stone-950 border border-amber-600/30 space-y-3">
            <h4 className="font-spiritual text-base font-bold text-amber-200">
              🧭 خطوات الفحص الأربع قبل اتخاذ أي قرار في الخدمة والتكريس:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="font-bold text-amber-400">١. اختبار الصلاة والصمت:</span>
                <p className="text-stone-300">هل صليت عليه في مخدعك بهدوء دون استعجال بشري؟</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="font-bold text-amber-400">٢. اختبار نقاوة القصد:</span>
                <p className="text-stone-300">هل دافعك هو مجد الله فقط أم فيه شائبة لإثبات الذات؟</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="font-bold text-amber-400">٣. اختبار السلام الداخلي:</span>
                <p className="text-stone-300">هل يملأ قلبك سلام المسيح العميق أم اضطراب وتشويش؟</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-1">
                <span className="font-bold text-amber-400">٤. اختبار المشورة والإرشاد:</span>
                <p className="text-stone-300">هل باركه أب اعترافك ومرشدك الروحي بروح المحبة؟</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: THE 10 GOLDEN DIRECTIVES */}
      {/* ========================================================================= */}
      {activeSection === 'golden_directives' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border border-amber-600/40 shadow-xl space-y-2">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              📜 ميثاق الوصايا الذهبية العشر لحياة التكريس
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              دستور الآباء لحفظ هوية المكرس من الذوبان في ضغوط الخدمة المعاصرة، لتكون خدمته دائماً حسب قلب الله لا حسب مقاييس العالم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goldenDirectives.map((directive) => (
              <div
                key={directive.number}
                className="p-5 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-md space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                      {directive.number}
                    </div>
                    <h4 className="font-spiritual text-base font-bold text-amber-100">
                      {directive.title}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
                    {directive.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: VOWS RENEWAL & CERTIFICATE */}
      {/* ========================================================================= */}
      {activeSection === 'vows_milestones' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-4">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <span>ميثاق تجديد التكريس السنوي والشهادة الروحية</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300">
              سجل بيانات تكريسك وجدد نذرك القلبي أمام الرب، مع إمكانية طباعة أو حفظ شهادة العهد المباركة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs text-stone-400">اسم المكرس / الخادم:</label>
                <input
                  type="text"
                  value={vowName}
                  onChange={(e) => setVowName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-400">الصفة أو الرتبة:</label>
                <input
                  type="text"
                  value={vowVocation}
                  onChange={(e) => setVowVocation(e.target.value)}
                  placeholder="كاهن / مكرسة / راهب / راهبة..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-stone-400">الإيبارشية / الدير:</label>
                <input
                  type="text"
                  value={vowDiocese}
                  onChange={(e) => setVowDiocese(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Printable Consecration Certificate Preview */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1c160e] via-[#15120c] to-[#1c160e] border-4 border-amber-600/70 shadow-2xl space-y-6 text-center relative overflow-hidden">
            <div className="text-4xl text-amber-400">✝️</div>

            <div className="space-y-1">
              <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-200 tracking-wide">
                ميثاق تجديد عهد التكريس القلبي
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                «مُكَرَّسُونَ لِنَكُونَ حَسَبَ قَلْبِ اللهِ»
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4 text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual bg-stone-950/60 p-6 rounded-2xl border border-amber-600/30">
              <p>
                أمام عرش النعمة الإلهية وتحت حماية الصليب المقدس، أجدد أنا الخادم المكرس:
              </p>
              <h3 className="text-xl font-bold text-amber-300 font-serif">
                {vowName} ({vowVocation} — {vowDiocese})
              </h3>
              <p>
                نذري القلبي للمسيح يسوع فاديَّ، واهباً جسدي وفكري وحواسي وإرادتي لخدمة كرمه المقدس، متجرداً من المجد الباطل، ساعياً لأن أكون خادماً وديعاً وأميناً حتى النفس الأخير.
              </p>
              <div className="p-3 rounded-xl bg-amber-950/40 text-amber-200 text-xs font-serif italic border border-amber-700/40">
                {vowVerse}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto pt-4 text-xs text-amber-400/80 font-mono border-t border-amber-800/40">
              <span>تاريخ التجديد: {vowDate}</span>
              <span className="font-spiritual font-bold text-sm text-amber-200">
                {isVowSigned ? '✓ تم التوقيع والعهد بالروح' : 'بانتظار إعلان التوقيع'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSignVow}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>أعلن تجديد نذري وتوقيع الميثاق</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>طباعة الشهادة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: PATRISTIC CANON - THE GOLDEN VOLUMES */}
      {/* ========================================================================= */}
      {activeSection === 'patristic_canon' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-xl space-y-2">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
              <Library className="w-5 h-5 text-amber-400" />
              <span>مكتبة مراجع المكرس الذهبية في التراث الكنسي</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              المصادر الآبائية واللاهوتية التي لا غنى عنها لأي مكرس لتأسيس العقل والروح على صخرة التعليم الكنسي الأرثوذكسي الأصيل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patristicVolumes.map((vol, index) => (
              <div
                key={index}
                className="p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-md space-y-3 flex flex-col justify-between hover:border-amber-700/50 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/40 px-2.5 py-0.5 rounded-full font-bold">
                      {vol.category}
                    </span>
                    <BookMarked className="w-4 h-4 text-amber-400" />
                  </div>

                  <h4 className="font-spiritual text-base font-bold text-amber-100">
                    {vol.title}
                  </h4>
                  <span className="text-xs text-amber-400 font-serif block">
                    — {vol.author}
                  </span>

                  <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                    {vol.coreTheme}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: EMERGENCY FIRST AID KITS */}
      {/* ========================================================================= */}
      {activeSection === 'emergency_first_aid' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-2xl bg-stone-900 border border-amber-600/30 space-y-1">
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <span>🚨 صيدلية التدخل السريع للمكرس في ساحة الحرب</span>
            </h3>
            <p className="text-xs text-stone-400">
              اختر الحالة الطارئة التي تواجهك الآن لتتلقى تدخلاً روحياً كتابياً وآبائياً عاجلاً:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {emergencyKits.map((kit) => (
              <button
                key={kit.id}
                onClick={() => {
                  soundManager.playTick();
                  setSelectedEmergency(selectedEmergency === kit.id ? null : kit.id);
                }}
                className={`p-4 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between gap-3 ${
                  selectedEmergency === kit.id
                    ? 'bg-amber-600 text-white shadow-lg border-amber-400'
                    : 'bg-stone-900 border-stone-800 text-stone-200 hover:border-amber-700/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{kit.icon}</span>
                  <span className="text-xs font-bold">{kit.label}</span>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${selectedEmergency === kit.id ? 'rotate-90' : ''}`} />
              </button>
            ))}
          </div>

          {selectedEmergency && (
            <div className="p-6 rounded-3xl bg-gradient-to-b from-stone-950 to-stone-900 border-2 border-amber-500 shadow-2xl space-y-4 animate-fade-in">
              {(() => {
                const currentKit = emergencyKits.find((k) => k.id === selectedEmergency);
                if (!currentKit) return null;
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{currentKit.icon}</span>
                        <h4 className="font-spiritual text-lg font-bold text-amber-200">
                          {currentKit.label}
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                        تدخل فوري
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-amber-200 font-spiritual text-xs sm:text-sm leading-relaxed">
                      {currentKit.verse}
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 block">
                        🩺 ماذا تفعل بالظبط في هذه الدقيقة:
                      </span>
                      <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-semibold">
                        {currentKit.action}
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSelectedEmergency(null)}
                        className="px-6 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold"
                      >
                        إغلاق الوصفة
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Global Copy feedback alert */}
      {copiedText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-amber-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>تم نسخ النص المرجعي بنجاح للحفظ أو المشاركة!</span>
        </div>
      )}
    </div>
  );
};
