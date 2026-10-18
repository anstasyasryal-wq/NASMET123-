import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { MonasticAudioPlayer } from './MonasticAudioPlayer';
import confetti from 'canvas-confetti';
import {
  Compass,
  ChevronLeft,
  Sparkles,
  RotateCw,
  Flame,
  Check,
  Shield,
  Heart,
  Scroll,
  Feather,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  Send,
  Printer,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MonasticOasisProps {
  currentUser?: User | null;
  onBackToHome: () => void;
  onNavigateToManual?: () => void;
}

export const MonasticOasis: React.FC<MonasticOasisProps> = ({ currentUser, onBackToHome, onNavigateToManual }) => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'examen' | 'covenant' | 'dispensary' | 'virtues' | 'retreat_eval'>('pillars');

  // --- 1. PILLARS OF CONSECRATION ---
  const [expandedPillar, setExpandedPillar] = useState<number | null>(1);

  const pillars = [
    {
      id: 1,
      title: 'نقاوة القصد وخفاء المخدع',
      latinTitle: 'Puritas Cordis & Vita Abscondita',
      subtitle: 'أن يكون الله وحده هو المحرك والدافع والغاية لكل خدمة وعمل سري.',
      verse: '«وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ وَأَغْلِقْ بَابَكَ، وَصَلِّ إِلَى أَبِيكَ الَّذِي فِي الْخَفَاءِ. فَأَبُوكَ الَّذِي يَرَى فِي الْخَفَاءِ يُجَازِيكَ عَلاَنِيَةً».',
      verseRef: 'متى 6: 6',
      patristicQuote: '«الخادم الذي يطلب مديح الناس ويشتهي أن تُعرف أعماله يشبه مزارعاً تعب طوال الصيف في بذر حقله، ثم ألقى فيه ناراً بيده فأحرقه كله».',
      patristicSaint: 'القديس يوحنا ذهبي الفم',
      signs: [
        'الفرح الصامت بالخدمات الخفية التي لا يعلم عنها أحد سوى الله.',
        'عدم التأثر بالمديح أو الذم؛ فكلاهما هواء لا يغير مكانتك أمام المسيح.',
        'استمرار حرارة الصلاة في الخلوة بنفس القوة والنشاط كما في أمام الناس.',
      ],
      danger: 'حرب المجد الباطل (حب الظهور واشتهاء الثناء والاعتراف بالجميل).',
      exercise: 'اختر اليوم خدمة أو عملاً صالحاً وافعله في خفاء تام دون أن تخبر به أقرب المقربين إليك.',
    },
    {
      id: 2,
      title: 'التجرد وبساطة العيش (الفقر الاختياري)',
      latinTitle: 'Paupertas Evangelica & Simplicitas',
      subtitle: 'التحرر من قيد الأشياء والترفع عن المناصب ليكون المسيح هو الغنى الحقيقي الوحيد.',
      verse: '«الرَّبُّ نَصِيبُ قِسْمَتِي وَكَأْسِي. أَنْتَ قَابِضُ قُرْعَتِي. حِبَالٌ وَقَعَتْ لِي فِي النُّعَمَاءِ، فَالْمِيرَاثُ حَسَنٌ عِنْدِي».',
      verseRef: 'مزمور 16: 5-6',
      patristicQuote: '«التجرد الحقيقي ليس مجرد فراغ اليد من المال، بل فراغ القلب من التعلق بالزائلات. فالذي امتلأ قلبه بنور المسيح لا يجد مكاناً لمحبة العالم».',
      patristicSaint: 'مار إسحق السرياني',
      signs: [
        'القناعة التامة بما هو متاح دون تطلع للرفاهيات أو مقارنة مع المعيشة المادية للآخرين.',
        'الشعور بالحرية الداخلية وعدم القلق بشأن الغد واحتياجاته.',
        'استخدام موارد العالم كأدوات عابرة لملكوت الله دون تملك.',
      ],
      danger: 'حرب الاقتناء والهم المادي تحت مسمى «تأمين المستقبل وتدبير الضروريات».',
      exercise: 'تخلَّ اليوم عن غرض فائض عن حاجتك وقدمه لمن هو في أمس الحاجة إليه بنية الشكر.',
    },
    {
      id: 3,
      title: 'الطاعة الإنجيلية والتسليم الكامل',
      latinTitle: 'Oboedientia & Abnegatio Voluntatis',
      subtitle: 'كسر الإرادة الذاتية وقبول مشيئة الله بقلب وديع وشاكر بلا تذمر.',
      verse: '«لأَصْنَعَ مَشِيئَتَكَ يَا إِلهِي سُرِرْتُ، وَنَامُوسُكَ فِي وَسَطِ أَحْشَائِي».',
      verseRef: 'مزمور 40: 8',
      patristicQuote: '«من يقطع مشيئته الذاتية من أجل الله، ينزع شوكة الاضطراب من قلبه، ويسكن فيه سلام الله الذي يفوق كل عقل».',
      patristicSaint: 'القديس دوروثيؤس',
      signs: [
        'المرونة التامة عند تغيير الخطط الشخصية لصالح مشيئة الله وخدمة الإخوة.',
        'الخضوع في مخافة المسيح لآباء الاعتراف والمرشدين الروحيين.',
        'غياب روح العناد والإصرار على الرأي الشخصي في التدبير المشترك.',
      ],
      danger: 'حرب الاستقلال الذاتي والاعتداد بالرأي الخاص والاستعلاء على المشورة.',
      exercise: 'تنازل اليوم طواعية عن تفضيل شخصي لك في أمر عائلي أو خدمي لصالح غيرك بفرح ووداعة.',
    },
    {
      id: 4,
      title: 'الصلاة الدائمة والسهر القلبي (الهيزيكيا)',
      latinTitle: 'Oratio Continua & Vigilantia Cordis',
      subtitle: 'حراسة باب الحواس وربط نبضات القلب باسم يسوع المسيح دون انقطاع.',
      verse: '«صَلُّوا بِلاَ انْقِطَاعٍ. اشْكُرُوا فِي كُلِّ شَيْءٍ، لأَنَّ هذِهِ هِيَ مَشِيئَةُ اللهِ فِي الْمَسِيحِ يَسُوعَ مِنْ جِهَتِكُمْ».',
      verseRef: '1 تسالونيكي 5: 17-18',
      patristicQuote: '«اجعل اسم يسوع يتنفس مع أنفاسك ويدك تعمل وعقلك يترنم، فستجد قلايتك وسكونك في كل مكان تسير فيه».',
      patristicSaint: 'القديس يوحنا الدرجي',
      signs: [
        'استدعاء اسم يسوع فورياً عند التعرض لأي ضغط أو تجربة أو فكر غريب.',
        'تذوق عذوبة المزامير وصلوات الأجبية دون ملل أو رغبة في الإسراع لإنهائها.',
        'حفظ اللسان من الفضول وأخبار الناس التي تبدد سكينة الروح.',
      ],
      danger: 'حرب التشتت والثرثرة الذهنية والروتين الجاف في تلاوة الصلوات.',
      exercise: 'خصص 15 دقيقة في منتصف يومك لصمت تام مع تكرار صلاة يسوع: «يا ربي يسوع المسيح، ارحمني أنا الخاطئ».',
    },
    {
      id: 5,
      title: 'الاتضاع وانسحاق الروح',
      latinTitle: 'Humilitas & Cordis Contritio',
      subtitle: 'معرفة حقيقة الضعف الذاتي واعتبار النفس خادماً للجميع وآخر الكل.',
      verse: '«ذَبَائِحُ اللهِ هِيَ رُوحٌ مُنْكَسِرَةٌ. الْقَلْبُ الْمُنْكَسِرُ وَالْمُنْسَحِقُ يَا اَللهُ لاَ تَحْتَقِرُهُ».',
      verseRef: 'مزمور 51: 17',
      patristicQuote: '«الاتضاع هو رداء اللاهوت الذي تسربل به الفادي حين غسل أرجل تلاميذه؛ فمن لبسه صار محصناً ضد جميع سهام العدو الملتهبة».',
      patristicSaint: 'القديس أنطونيوس الكبير',
      signs: [
        'سرعة الاعتذار وطلب الصفح حتى لو كنت غير مخطئ ظاهرياً.',
        'الفرح الحقيقي برؤية الآخرين يتقدمون ويتفوقون في مواهبهم وأعمالهم.',
        'تقبل التوبيخ والملاحظات بروح الشكر دون دفاع تبريري.',
      ],
      danger: 'حرب الكبرياء الخفي والتكبر الروحي ومقارنة النفس مع الخطاة.',
      exercise: 'حين تشعر بأي رغبة في تبرير نفسك اليوم، اصمت في داخلك وقل: «يا رب، اغفر لي ضعفي، وبارك إخوتي».',
    },
    {
      id: 6,
      title: 'المحبة الباذلة وسعة القلب للجميع',
      latinTitle: 'Caritas Sacrificans & Amplitudo Cordis',
      subtitle: 'حمل ضعفات الآخرين وغسل أرجل المتعبين دون إدانة أو تمييز.',
      verse: '«بِهذَا يَعْرِفُ الْجَمِيعُ أَنَّكُمْ تَلاَمِيذِي: إِنْ كَانَ لَكُمْ حُبٌّ بَعْضًا لِبَعْضٍ».',
      verseRef: 'يوحنا 13: 35',
      patristicQuote: '«سعة القلب هي أن تبكي مع الباكين وتفرح مع الفرحين، وأن تصلي بحرقة من أجل أعدائك ومضايقيك كما تصلي من أجل نفسك وأولادك».',
      patristicSaint: 'القديس مكاريوس الكبير',
      signs: [
        'الستر التام على أخطاء الآخرين وعدم تداول عثرات الخدام أو المخدومين.',
        'الاستعداد لتحمل المشقة وتكلفة الخدمة من الوقت والصحة والمال بفرح.',
        'النظرة الممتلئة بالرجاء لكل إنسان ضال أو بعيد عن الكنيسة.',
      ],
      danger: 'حرب التحزب وضيق الأفق والفتور تجاه معاناة الآخرين.',
      exercise: 'صلّ اليوم بالاسم من أجل 3 أشخاص أساءوا إليك أو تشعر بصعوبة في التعامل معهم.',
    },
    {
      id: 7,
      title: 'الإفراز والتمييز الروحي (Diakrisis)',
      latinTitle: 'Discretio Spirituum (Diakrisis)',
      subtitle: 'ميزان الذهب الروحي لمعرفة صوت الله، وحراسة المسيرة من الإفراط والتفريط.',
      verse: '«وَأَمَّا الرُّوحِيُّ فَيَحْكُمُ فِي كُلِّ شَيْءٍ، وَهُوَ لاَ يُحْكَمُ فِيهِ مِنْ أَحَدٍ».',
      verseRef: '1 كورنثوس 2: 15',
      patristicQuote: '«الإفراز هو عين النفس وقائد الفضائل كلها؛ فبدون الإفراز تتحول الفضيلة إلى رذيلة بالكبرياء أو التهور أو التواني».',
      patristicSaint: 'القديس يوحنا كاسيان',
      signs: [
        'القدرة على كشف حيل العدو التي تأتي متنكرة في ثوب بر وصلاح مصطنع.',
        'معرفة متى يتكلم المكرس ومتى يصمت، ومتى يرفق ومتى يحزم بوداعة.',
        'الرجوع الدائم لميزان الكتاب المقدس وأقوال الآباء والمشورة الحكيمة.',
      ],
      danger: 'حرب التطرف الروحي (الحماسة الزائدة المؤدية للانهيار السريع أو اليأس).',
      exercise: 'قبل أي قرار في خدمتك أو علاقاتك اليوم، توقف لثوانٍ وصلّ: «يارب، علمني مشيئتك وأعطني روح الإفراز».',
    },
  ];

  // --- 2. DAILY CONSECRATED EXAMEN ---
  const examenQuestions = [
    {
      id: 'q1',
      text: 'هل كان دافعي الوحيد في الخدمة والعمل هو مجد الله وحده دون رغبة خفية في الظهور أو مديح الناس؟',
      category: 'نقاوة القصد',
    },
    {
      id: 'q2',
      text: 'هل حَرَستُ حواسي ولساني من الغيبة والانتقاد والمزاح غير اللائق والفضول؟',
      category: 'حراسة الحواس',
    },
    {
      id: 'q3',
      text: 'هل تمسكت بصلوات المخدع وقراءة الإنجيل بقلب حاضر وشوق، وليس كأداء واجب روتيني؟',
      category: 'أمانة المخدع',
    },
    {
      id: 'q4',
      text: 'هل عاملت من أخطأ في حقي بروح المغفرة والستر، وامتنعت تماماً عن إدانة أي إنسان في فكري؟',
      category: 'المحبة والستر',
    },
    {
      id: 'q5',
      text: 'هل مارست الوداعة والاتضاع في معاملاتي، وفرحت بنجاح إخوتي دون حسد أو مقارنة؟',
      category: 'الاتضاع والوداعة',
    },
    {
      id: 'q6',
      text: 'هل سلمت أموري وقلقي ليد الله بالشكر والرضا، متقبلاً كل الظروف المعاكسة بسلام؟',
      category: 'التسليم الإلهي',
    },
    {
      id: 'q7',
      text: 'هل كنت أميناً في وقتي ووزناتي وافتقادي لمن هم في عهدتي دون توانٍ أو كسل؟',
      category: 'الأمانة في الوكالة',
    },
  ];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examenSubmitted, setExamenSubmitted] = useState(false);

  const handleScoreChange = (qId: string, score: number) => {
    soundManager.playTick();
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  const calculateTotal = () => {
    return Object.values(answers).reduce((acc, curr) => acc + curr, 0);
  };

  const getExamenDiagnosis = () => {
    const total = calculateTotal();
    const maxScore = examenQuestions.length * 5;
    const percentage = Math.round((total / maxScore) * 100);

    if (percentage >= 85) {
      return {
        title: 'قامتك الروحية اليوم: سكون ونعمة منسكبة',
        statusColor: 'text-emerald-400',
        advice: 'اشكر الله على هذه النعمة، واحرص على البقاء في حضن التواضع، فالشجرة المثمرة تنحني للأرض بأغصانها.',
        patristicRemedy: '«كلما ارتفعت في الفضيلة، ألصق وجهك بالتراب متذكراً أن الفضل كله للنعمة الإلهية المعينة». — القديس أنطونيوس',
      };
    } else if (percentage >= 60) {
      return {
        title: 'قامتك الروحية اليوم: جهاد أمين وسط حروب ومشاغل',
        statusColor: 'text-amber-400',
        advice: 'أنت في مسار جهاد حقيقي؛ راجع النقاط الأقل تقييماً اليوم، وسكب في مخدعك صلاة توبة وتجديد للقوة.',
        patristicRemedy: '«إن تعثرت في الطريق فلا تقف متحسراً، بل قم سريعاً بدموع الرجاء؛ فالله لا يطلب منا كمالاً ملائكياً بل أمانة الجهاد المستمر». — مار إسحق السرياني',
      };
    } else {
      return {
        title: 'قامتك الروحية اليوم: احتياج عاجل لتجديد العهد والخلوة',
        statusColor: 'text-rose-400',
        advice: 'النفس متعبة ومشتتة بهموم الخدمة والعالم. توقف فوراً الليلة عن أي انشغالات واقضِ نصف ساعة أمام المصلوب لتسترد سلامك.',
        patristicRemedy: '«حين تبرد المحبة في داخلك، اقترب من أتون الصليب لتلتهب بناره من جديد؛ فليس شيء يحيي النفس المائتة مثل النظر إلى جراحات الفادي». — القديس يوحنا ذهبي الفم',
      };
    }
  };

  // --- 3. CONSECRATION COVENANT ---
  const [consecratorName, setConsecratorName] = useState(currentUser?.name || '');
  const [covenantVerse, setCovenantVerse] = useState('«مَعَ الْمَسِيحِ صُلِبْتُ، فَأَحْيَا لاَ أَنَا، بَلِ الْمَسِيحُ يَحْيَا فِيَّ» (غلاطية 2: 20)');
  const [covenantDate] = useState(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [covenantSigned, setCovenantSigned] = useState(false);
  const [copiedCovenant, setCopiedCovenant] = useState(false);

  const handleSignCovenant = () => {
    soundManager.playVictory();
    setCovenantSigned(true);
  };

  const handleCopyCovenant = () => {
    const text = `📜 ميثاق تجديد التكريس القلبي ليكون حسب قلب الله\n\nأنا العبد الخادم / الخادمة: ${consecratorName || 'ابن المسيح'}\nالتاريخ المبارك: ${covenantDate}\n\n«أجدد اليوم عهدي ونذري أمام الثالوث القدوس، واهباً قلبي وفكري وحواسي وجسدي للمسيح يسوع ربنا، طالباً أن أعيش خادماً متجرداً ومكرساً بحق، لا أطلب مجدي بل مجد اسمه القدوس، حاسباً نفسي خادماً بطالاً في كرمه المبارك».\n\nالآية الحاكمة لتكريسي:\n${covenantVerse}\n\n✝️ مشروع «حسب قلب الله»`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCovenant(true);
      setTimeout(() => setCopiedCovenant(false), 2000);
    }
  };

  // --- 4. CONSECRATED SPIRITUAL DISPENSARY ---
  const [selectedRemedy, setSelectedRemedy] = useState<number>(0);

  const remedies = [
    {
      id: 0,
      condition: 'الجفاف والبرود الروحي في المخدع (Spiritual Dryness)',
      diagnosis: 'حين تنضب مشاعر التعزية وتتحول الصلاة إلى صخرة صامتة تشعر فيها بالغياب الإلهي.',
      rootCause: 'إما تدريب إلهي للنفس لتنتقل من محبة تعزيات الله إلى محبة إله التعزيات، أو تسرب فكر كبرياء خفي يحتاج لتوبة.',
      verses: [
        '«لِمَاذَا أَنْتِ مُنْحَنِيَةٌ يَا نَفْسِي؟ وَلِمَاذَا تَئِنِّينَ فِيَّ؟ ارْجِي اللهَ، لأَنِّي بَعْدُ أَحْمَدُهُ» (مزمور 42: 11)',
        '«نَفْسِي تَتْبَعُكَ، يَمِينُكَ تَعْضُدُنِي» (مزمور 63: 8)',
      ],
      fathersRemedy: '«إذا جفت دموعك وصارت صلاتك كأنها في صحراء قاحلة، فاثبت في مكانك ولا تبرح؛ فالصلاة في وقت الجفاف بأمانة تعدل ألف صلاة في أوقات الفرح الروحي السهل». — القديس يوحنا الدرجي',
      practicalAction: 'ردد المزامير بلسانك وبصوت مسموع بهدوء دون انتظار مشاعر عاطفية، واشكر الله على نقاوة إيمانك التي لا تعتمد على الإحساس.',
    },
    {
      id: 1,
      condition: 'فتور ما بعد النجاح وإتمام الخدمة الكنسية (Post-Success Slump)',
      diagnosis: 'الشعور بالفراغ أو الكسل أو الهبوط الروحي الحاد فور انتهاء مؤتمر، نهضة، أو مشروع خدمي ناجح.',
      rootCause: 'العدو يستغل إجهاد الجسد ليزرع التراخي، مع تسلل خفي للشعور بالاستحقاق والراحة المغلوطة.',
      verses: [
        '«كَذلِكَ أَنْتُمْ أَيْضًا، مَتَى فَعَلْتُمْ كُلَّ مَا أُمِرْتُمْ بِهِ فَقُولُوا: إِنَّنَا عَبِيدٌ بَطَّالُونَ، لأَنَّنَا إِنَّمَا عَمِلْنَا مَا كَانَ يَجِبُ عَلَيْنَا» (لوقا 17: 10)',
        '«فَإِذًا مَنْ يَظُنُّ أَنَّهُ قَائِمٌ، فَلْيَنْظُرْ أَنْ لاَ يَسْقُطَ» (1 كورنثوس 10: 12)',
      ],
      fathersRemedy: '«بعد كل جهاد روحي مظفر، الجأ سريعاً إلى حصن المخدع كجندي عائد من معركة، والقِ إكليلك عند أقدام الفادي قبل أن تلمسه يد الكبرياء». — القديس أنطونيوس',
      practicalAction: 'اقضِ أول 24 ساعة بعد أي نجاح خدمي في مراجعة هادئة وتقبيل الصليب دون تصفح صور النشاط أو متابعة تعليقات المديح.',
    },
    {
      id: 2,
      condition: 'حرب المقارنة والغيرة في حقل الخدمة (Comparison & Envy)',
      diagnosis: 'تسلل الضيق حين يُمدح خادم آخر، أو محاولة إثبات أنك أكثر بذلاً وتضحية وتأثيراً من زملائك.',
      rootCause: 'المجد الباطل واعتبار الخدمة ملكية شخصية أو ساحة للتنافس بدلاً من كونها جسداً واحداً للمسيح.',
      verses: [
        '«لاَ شَيْئًا بِتَحَزُّبٍ أَوْ بِعُجْبٍ، بَلْ بِتَوَاضُعٍ، حَاسِبِينَ بَعْضُكُمُ الْبَعْضَ أَفْضَلَ مِنْ أَنْفُسِهِمْ» (فيلبي 2: 3)',
        '«مَنْ هُوَ بُولُسُ؟ وَمَنْ هُوَ أَبُلُّوسُ؟ بَلْ خَادِمَانِ آمَنْتُمْ بِوَاسِطَتِهِمَا... أَنَا غَرَسْتُ وَأَبُلُّوسُ سَقَى، لكِنَّ اللهَ كَانَ يُنْمِي» (1 كورنثوس 3: 5-6)',
      ],
      fathersRemedy: '«إذا أردت أن تخنق حية الغيرة، فامدح من تحارَب منه أمام الناس، وصلّ من أجله في مخدعك أن يزيده الله نعمة فوق نعمته». — القديس يوحنا كاسيان',
      practicalAction: 'بادر اليوم بإرسال رسالة تشجيع صادقة لخادم زميل لك واذكر فضائله ومواهبه بكل محبة.',
    },
    {
      id: 3,
      condition: 'الإحباط لقلة الثمار الظاهرة وجحود المخدومين (Unfruitfulness & Ingratitude)',
      diagnosis: 'الشعور بأن تعبك يضيع سدى، وأن المخدومين لا يستجيبون أو يقابلون إحسانك بالإساءة والبرود.',
      rootCause: 'النظر إلى الثمار بالعين البشرية العاجلة، ونسيان أن الله يكافئ على الأمانة في المحبة لا على الإحصائيات.',
      verses: [
        '«فَلاَ نَفْشَلْ فِي عَمَلِ الْخَيْرِ لأَنَّنَا سَنَحْصُدُ فِي وَقْتِهِ إِنْ كُنَّا لاَ نَكِلُّ» (غلاطية 6: 9)',
        '«وَأَمَّا أَنَا فَقُلْتُ: عَبَثًا تَعِبْتُ، بَاطِلاً وَفَارِغًا أَفْنَيْتُ قُدْرَتِي. لكِنَّ حَقِّي عِنْدَ الرَّبِّ، وَعَمَلِي عِنْدَ إِلهِي» (إشعياء 49: 4)',
      ],
      fathersRemedy: '«لا تبكِ إن لم ترَ ثمرة زرعك اليوم؛ فالزارع يلقي الحبة في الطين المظلم وينتظر بصبر المطر المبكر والمتأخر؛ أجرتك مضمونة عند الرب مهما كانت النتيجة». — القديس مكاريوس',
      practicalAction: 'تذكر أن داود قاد شعبه بعدما خدم سنوات طويلة في رعاية غنمات قليلة في برية قاحلة؛ واصل خدمتك بإخلاص من أجل محبة المسيح فقط.',
    },
    {
      id: 4,
      condition: 'التوتر بين متطلبات الخدمة وخلوة المخدع (Martha vs Mary Tension)',
      diagnosis: 'الارتباك الشديد وضيق الوقت حتى تصبح الخدمة عائقاً عن لقاء المسيح وسماع صوته.',
      rootCause: 'تحول النشاط إلى صنم، ونسيان أن الخدمة هي فيض شبع المخدع، ولا يمكن لفاقد الشيء أن يعطيه.',
      verses: [
        '«مَرْثَا، مَرْثَا، أَنْتِ تَهْتَمِّينَ وَتَضْطَرِبِينَ لأَجْلِ أُمُورٍ كَثِيرَةٍ، وَلكِنَّ الْحَاجَةَ إِلَى وَاحِدٍ. فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ الَّذِي لَنْ يُنْزَعَ مِنْهَا» (لوقا 10: 41-42)',
        '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ» (إشعياء 30: 15)',
      ],
      fathersRemedy: '«إن لم تجلس أولاً عند أقدام الفادي وتتشبع برائحة كلمته، فكل ما تقدمه للناس سيكون كلاماً جافاً بلا روح حياة». — القديس باسيليوس الكبير',
      practicalAction: 'ضع خطاً فاصلاً غير قابل للتفاوض: لا خروج لأي خدمة قبل قضاء نصف ساعة على الأقل مع الأجبية والإنجيل صباحاً.',
    },
  ];

  // --- 5. DESERT FATHERS VIRTUES POOL ---
  const monasticVirtues = [
    {
      title: 'فضيلة الصمت والهدوء المقدس (Hesychia)',
      quote: '«صمت اللسان يولد هدوء القلب، وفي سكون القلب ينطق روح الله».',
      saint: 'القديس أرسانيوس معلم أولاد الملوك',
      practice: 'خصص 10 دقائق صمت تام دون تصفح أي جهاز أو هاتف، وتأمل في حضور الله معك.',
      icon: '🕯️',
    },
    {
      title: 'فضيلة الاتضاع وانسحاق القلب المستمر',
      quote: '«رأيت فخاخ الشرير مبثوثة على الأرض كلها، فقلت متنهداً: من ينجو منها؟ فسمعت صوتاً يقول: المتواضعون».',
      saint: 'القديس أنطونيوس الكبير',
      practice: 'بادر اليوم بطلب السماح أو تقديم كلمة شكر رقيقة لشخص اختلفت معه، معتبراً نفسك أصغر الكل.',
      icon: '🌾',
    },
    {
      title: 'فضيلة الإفراز والتمييز الروحي (Diakrisis)',
      quote: '«الإفراز هو عين النفس وسراجها، به يُميز المكرس بين صوت النعمة وخداع العدو المتنكر».',
      saint: 'القديس الأنبا باخوميوس أب الشركة',
      practice: 'استشر مرشدك الروحي أو ارجع إلى وصية الإنجيل قبل أن تقطع في أي قرار كنسي أو شخصي.',
      icon: '⚖️',
    },
    {
      title: 'فضيلة الصلاة الدائمة باسم يسوع',
      quote: '«حين تذكر اسم يسوع القدوس في قلبك، تهرب الشياطين وتفيض ينابيع التعزية والقداسة».',
      saint: 'القديس مقاريوس الكبير',
      practice: 'ردد صلاة يسوع: «يا ربي يسوع المسيح، ابن الله، ارحمني أنا الخاطئ» مع كل شهيق وزفير في هدوء الليل.',
      icon: '🕊️',
    },
    {
      title: 'فضيلة التجرد والفقر الاختياري',
      quote: '«الذي لا يملك شيئاً في العالم يملك العالم كله، لأن الله بذاته هو ميراثه الأبدي».',
      saint: 'القديس إيسيذوروس قس الإسقيط',
      practice: 'تخلص اليوم من أي ملبس أو مقتنى زائد لا تستخدمه وقدمه لمحتاج باسم المسيح.',
      icon: '🤲',
    },
    {
      title: 'فضيلة عدم الإدانة والستر على الإخوة',
      quote: '«من نظر إلى خطاياه الخاصة، لم يجد وقتاً ولا رغبة ليتأمل في خطايا وسقطات الآخرين».',
      saint: 'القديس الأنبا موسى الأسود',
      practice: 'إذا سمعت اليوم أي حديث فيه ذم أو انتقاد لأحد الخدام، غيّر الموضوع بحكمة أو اذكر حسنة له.',
      icon: '🛡️',
    },
  ];

  const [currentVirtueIndex, setCurrentVirtueIndex] = useState(0);

  const handleNextVirtue = () => {
    soundManager.playTick();
    setCurrentVirtueIndex((prev) => (prev + 1) % monasticVirtues.length);
  };

  const activeVirtue = monasticVirtues[currentVirtueIndex];

  // --- 6. RETREAT EVALUATION & PERSONAL REFLECTION ---
  interface RetreatEvaluation {
    id: string;
    date: string;
    calmnessScore: number;
    innerGrowthScore: number;
    prayerDepthScore: number;
    notes: string;
  }

  const RETREAT_STORAGE_KEY = 'mokarasa_retreat_evaluations_v1';
  const [calmnessScore, setCalmnessScore] = useState<number>(5);
  const [innerGrowthScore, setInnerGrowthScore] = useState<number>(5);
  const [prayerDepthScore, setPrayerDepthScore] = useState<number>(5);
  const [retreatNotes, setRetreatNotes] = useState<string>('');
  const [savedRetreatEvals, setSavedRetreatEvals] = useState<RetreatEvaluation[]>(() => {
    try {
      const saved = localStorage.getItem(RETREAT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'eval-demo',
          date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
          calmnessScore: 5,
          innerGrowthScore: 5,
          prayerDepthScore: 4,
          notes: 'خلوة مباركة شعرت فيها بسلام عميق وتهدئة للأفكار المشتتة بفضل صلاة المخدع والهدوء.',
        }
      ];
    } catch {
      return [];
    }
  });

  const handleSaveRetreatEval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retreatNotes.trim()) return;

    soundManager.playCorrect();
    const newEval: RetreatEvaluation = {
      id: `eval_${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      calmnessScore,
      innerGrowthScore,
      prayerDepthScore,
      notes: retreatNotes.trim(),
    };

    const updated = [newEval, ...savedRetreatEvals];
    setSavedRetreatEvals(updated);
    try {
      localStorage.setItem(RETREAT_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setRetreatNotes('');
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
  };

  const handleDeleteRetreatEval = (id: string) => {
    soundManager.playTick();
    const updated = savedRetreatEvals.filter((item) => item.id !== id);
    setSavedRetreatEvals(updated);
    try {
      localStorage.setItem(RETREAT_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-right" dir="rtl">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>

        <div className="text-xs text-amber-400 font-spiritual font-semibold">
          ✝️ مكرسون ليكونوا حسب قلب الله
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-[#1c140d] to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-500/50 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-500/40 text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>دستور وركائز التكريس والواحة الرهبانية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100 tracking-wide">
          🕯️ دليل ودستور المكرس | ليكون حسب قلب الله
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          المرجع الروحي الشامل لكل نفس نذرت قلبها للمسيح؛ ركائز التكريس الإنجيلي، محاسبة النفس اليومية بالميزان، ميثاق تجديد العهد، وصيدلية الآباء للحروب الروحية.
        </p>
      </div>

      {/* Quick Bridge to Consecrated Manual */}
      {onNavigateToManual && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border-2 border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-right shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div className="space-y-0.5">
              <h4 className="font-spiritual text-sm font-bold text-amber-200">
                مرجع المكرس الكنسي الكامل | كيف تعيش حسب قلب الله
              </h4>
              <p className="text-xs text-stone-300">
                دستور قلب داود (السمات الـ ٧)، كانون اليوم المتزن، موسوعة حروب التكريس وترياق الآباء، والوصايا العشر.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToManual}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shrink-0 transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>فتح المرجع الشامل</span>
            <span>←</span>
          </button>
        </div>
      )}

      {/* Interactive Monastic Audio Player */}
      <MonasticAudioPlayer />

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-stone-900/90 rounded-2xl border border-amber-800/40 overflow-x-auto text-xs font-bold scrollbar-none shadow-md">
        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('pillars');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'pillars'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-300" />
          <span>ركائز التكريس الـ ٧</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('examen');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'examen'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>محاسبة النفس اليومية</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('covenant');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'covenant'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Scroll className="w-4 h-4 text-amber-300" />
          <span>ميثاق تجديد التكريس</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('dispensary');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'dispensary'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-amber-300" />
          <span>صيدلية المكرس الروحية</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('virtues');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'virtues'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>بستان فضائل الآباء</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('retreat_eval');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'retreat_eval'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Heart className="w-4 h-4 text-amber-300" />
          <span>تقييم الخلوة والنمو الداخلي</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: THE 7 PILLARS OF CONSECRATION */}
      {/* ========================================================================= */}
      {activeTab === 'pillars' && (
        <div className="space-y-4">
          <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
            <span className="font-semibold text-amber-200">
              «وَجَدْتُ دَاوُدَ بْنَ يَسَّى رَجُلاً حَسَبَ قَلْبِي، الَّذِي سَيَصْنَعُ كُلَّ مَشِيئَتِي» (أعمال 13: 22)
            </span>
            <span className="text-amber-400 font-mono text-[11px]">7 ركائز جوهرية</span>
          </div>

          <div className="space-y-3">
            {pillars.map((p) => {
              const isExpanded = expandedPillar === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-gradient-to-b from-stone-900 via-[#1a1612] to-stone-900 border-amber-500/50 shadow-xl'
                      : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/40'
                  }`}
                >
                  <div
                    onClick={() => {
                      soundManager.playTick();
                      setExpandedPillar(isExpanded ? null : p.id);
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-500/40">
                        {p.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-spiritual font-bold text-base sm:text-lg text-amber-100">
                            {p.title}
                          </h3>
                          <span className="hidden sm:inline text-[11px] text-stone-400 font-mono italic">
                            ({p.latinTitle})
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 line-clamp-1">{p.subtitle}</p>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-amber-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-amber-900/30 space-y-5 animate-fade-in">
                      {/* Scripture Verse */}
                      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] font-bold text-amber-400 block">📖 الأساس الكتابي:</span>
                        <p className="text-sm font-serif text-amber-100 font-semibold leading-relaxed">
                          {p.verse}
                        </p>
                        <span className="text-xs text-amber-400/80 block text-left font-bold">
                          — {p.verseRef}
                        </span>
                      </div>

                      {/* Patristic Quote */}
                      <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-300 block">🕯️ صوت الآباء:</span>
                        <p className="text-xs sm:text-sm text-amber-200/90 font-spiritual italic leading-relaxed">
                          {p.patristicQuote}
                        </p>
                        <span className="text-xs text-amber-400 font-spiritual block text-left font-semibold">
                          — {p.patristicSaint}
                        </span>
                      </div>

                      {/* Signs & Danger */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-600/30 space-y-2">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>علامات وجود الفضيلة في قلب المكرس:</span>
                          </span>
                          <ul className="space-y-1 text-stone-300 list-disc list-inside">
                            {p.signs.map((s, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-600/30 space-y-2">
                          <span className="font-bold text-rose-400 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>الفخ المعاكس (حرب العدو):</span>
                          </span>
                          <p className="text-stone-300 leading-relaxed">{p.danger}</p>
                          <div className="pt-2 border-t border-rose-900/40">
                            <span className="font-bold text-amber-300 block mb-1">
                              💡 تدريب عملي لليوم:
                            </span>
                            <p className="text-amber-100/90 leading-relaxed">{p.exercise}</p>
                          </div>
                        </div>
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
      {/* TAB 2: DAILY CONSECRATED EXAMEN */}
      {/* ========================================================================= */}
      {activeTab === 'examen' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 p-5 border border-amber-600/40 space-y-2 text-right">
            <h3 className="font-spiritual font-bold text-lg text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>ميزان محاسبة النفس اليومية للمكرس</span>
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              اجلس في مخدعك قبل النوم، واختبر ضميرك بأمانة أمام ديان القلوب العادل. قيّم يومك في كل سؤال من 1 (ضعيف جداً) إلى 5 (أمين بنعمة الله).
            </p>
          </div>

          <div className="space-y-4">
            {examenQuestions.map((q, idx) => {
              const currentScore = answers[q.id] || 0;
              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-3 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-800/40">
                      {q.category}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">سؤال {idx + 1} من 7</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed">
                    {q.text}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-stone-400">تقييم الأمانة:</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleScoreChange(q.id, score)}
                          className={`w-8 h-8 rounded-xl font-bold text-xs transition cursor-pointer border ${
                            currentScore === score
                              ? 'bg-amber-500 text-stone-950 border-amber-300 scale-105 shadow-md shadow-amber-500/20'
                              : 'bg-stone-950 text-stone-300 border-stone-800 hover:bg-stone-800'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnosis & Submission */}
          <div className="p-6 rounded-3xl bg-stone-900 border-2 border-amber-600/40 text-center space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div className="text-right">
                <span className="text-xs text-stone-400 block">مجموع درجات فحص الضمير:</span>
                <span className="text-2xl font-black text-amber-300 font-mono">
                  {calculateTotal()} / {examenQuestions.length * 5}
                </span>
              </div>

              <button
                onClick={() => {
                  soundManager.playVictory();
                  setExamenSubmitted(true);
                }}
                disabled={Object.keys(answers).length < examenQuestions.length}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-40"
              >
                {Object.keys(answers).length < examenQuestions.length
                  ? `أجب على باقي الأسئلة (${Object.keys(answers).length} من 7)`
                  : 'اعتماد الفحص واستخراج الروشتة الآبائية'}
              </button>
            </div>

            {examenSubmitted && (
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30 text-right space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕯️</span>
                  <h4 className={`text-sm sm:text-base font-bold ${getExamenDiagnosis().statusColor}`}>
                    {getExamenDiagnosis().title}
                  </h4>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {getExamenDiagnosis().advice}
                </p>
                <div className="p-3.5 rounded-xl bg-stone-900 border border-amber-600/30 text-xs font-spiritual text-amber-200 italic leading-relaxed">
                  {getExamenDiagnosis().patristicRemedy}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: COVENANT OF CONSECRATION RENEWAL */}
      {/* ========================================================================= */}
      {activeTab === 'covenant' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-gradient-to-b from-[#241a12] via-[#1b140e] to-stone-950 border-2 border-amber-500/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-right">
            <div className="absolute top-4 left-4 text-7xl select-none opacity-5 font-serif">✝️</div>

            <div className="text-center space-y-2 mb-8 border-b border-amber-800/40 pb-6">
              <span className="text-xs font-bold text-amber-400 tracking-widest block font-spiritual">
                باسم الآب والابن والروح القدس، الإله الواحد. آمين.
              </span>
              <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-200">
                📜 وثيقة وميثاق تجديد التكريس القلبي
              </h2>
              <p className="text-xs text-stone-400">
                صلوات ومناجاة المكرس في مخدعه السري لتجديد عهده مع المسيح
              </p>
            </div>

            {/* Input Controls */}
            {!covenantSigned ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    اسم المكرس / الخادم المبارك:
                  </label>
                  <input
                    type="text"
                    value={consecratorName}
                    onChange={(e) => setConsecratorName(e.target.value)}
                    placeholder="اكتب اسمك للميثاق..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    الآية والشاهد الحاكم لتكريسك:
                  </label>
                  <input
                    type="text"
                    value={covenantVerse}
                    onChange={(e) => setCovenantVerse(e.target.value)}
                    placeholder="اكتب آيتك المفضلة..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-400 font-serif"
                  />
                </div>

                <button
                  onClick={handleSignCovenant}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-600/20 transition cursor-pointer"
                >
                  توقيع وإشهار الميثاق أمام مذبح القلب
                </button>
              </div>
            ) : (
              /* Signed Beautiful Certificate */
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#2a1f16] to-[#1a140f] border border-amber-400/40 shadow-inner space-y-6 text-stone-100 font-spiritual">
                <div className="text-center space-y-1">
                  <span className="text-[11px] text-amber-400 tracking-wider">مشروع «حسب قلب الله»</span>
                  <h3 className="text-xl sm:text-2xl font-black text-amber-200">
                    ميثاق الأمانة حتى الموت
                  </h3>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-justify text-amber-50">
                  «أنا العبد الخادم / الخادمة <strong className="text-amber-300 font-bold">{consecratorName || 'ابن المسيح'}</strong>، أقف اليوم برهبة وانسحاق أمام عرش نعمتك الفائقة، معترفاً بضعفي البشري وعظمة أمانتك الإلهية. أجدد اليوم، في يوم <strong className="text-amber-300">{covenantDate}</strong>، نذري وتكريسي القلبي لك وحدك يا سيدي ومخلصي يسوع المسيح.
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-justify text-amber-50">
                  أهبك فكري فلا يفكر إلا في مجدك، ولساني فلا ينطق إلا بالحق والحمد، وقلبي فلا يخفق إلا بحبك ورعاية خرافك. متجرداً من كل مديح بشري أو مناصب زائلة، معتبراً نفسي خادماً بطالاً لا يستحق موطئ قدم في بيتك. أعني بنعمتك لأكون خادماً حسب قلبك، أميناً حتى النفس الأخير».
                </p>

                <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-600/40 text-center space-y-1">
                  <span className="text-xs text-amber-400 font-bold block">شعار الميثاق:</span>
                  <span className="text-sm sm:text-base font-serif font-bold text-amber-200">
                    {covenantVerse}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-amber-800/40 text-xs text-amber-400 font-bold gap-2">
                  <span>توقيع المكرس بالقلب: {consecratorName || 'عبد المسيح'}</span>
                  <span>التاريخ: {covenantDate}</span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-4">
                  <button
                    onClick={handleCopyCovenant}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    {copiedCovenant ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم نسخ نص الميثاق</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>نسخ الميثاق للمذكرة</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCovenantSigned(false)}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-bold transition cursor-pointer"
                  >
                    تعديل البيانات
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONSECRATED SPIRITUAL DISPENSARY */}
      {/* ========================================================================= */}
      {activeTab === 'dispensary' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-stone-900 to-amber-950/40 p-5 border border-amber-600/40 space-y-1 text-right">
            <h3 className="font-spiritual font-bold text-lg text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>صيدلية المكرس وميزان الإفراز في الأزمات الروحية</span>
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              ترياق شافي وتوجيهات أبوية دقيقة لأصعب الحروب والتحديات التي يمر بها خدام ومكرسو الكنيسة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {remedies.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => {
                  soundManager.playTick();
                  setSelectedRemedy(idx);
                }}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  selectedRemedy === idx
                    ? 'bg-amber-600/20 border-amber-400 text-amber-100 shadow-md'
                    : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold">حالة {idx + 1}</span>
                  <h4 className="text-xs font-bold leading-normal">{r.condition}</h4>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Diagnosis & Remedy Card */}
          {remedies[selectedRemedy] && (
            <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/40 space-y-5 animate-fade-in text-right">
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1">
                  تشخيص الحالة الروحية:
                </span>
                <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                  {remedies[selectedRemedy].condition}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                  {remedies[selectedRemedy].diagnosis}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-1">
                <span className="font-bold text-rose-400 block">الجذر الروحي الخفي:</span>
                <p className="leading-relaxed">{remedies[selectedRemedy].rootCause}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/30 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">📖 آيات التثبيت والشفاء:</span>
                <ul className="space-y-1.5 text-xs font-serif text-amber-100 leading-relaxed">
                  {remedies[selectedRemedy].verses.map((v, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-amber-500/30 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 block">🕯️ ترياق الآباء الشافي:</span>
                <p className="text-xs sm:text-sm font-spiritual text-amber-200 italic leading-relaxed">
                  {remedies[selectedRemedy].fathersRemedy}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/30 text-xs space-y-1">
                <span className="font-bold text-emerald-400 block">💡 التطبيق العملي للتعافي:</span>
                <p className="text-stone-200 leading-relaxed">
                  {remedies[selectedRemedy].practicalAction}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DESERT FATHERS VIRTUES POOL */}
      {/* ========================================================================= */}
      {activeTab === 'virtues' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/60 shadow-xl space-y-6 text-right">
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>فضائل وتداريب شيوخ البرية:</span>
            </span>
            <button
              onClick={handleNextVirtue}
              className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>فضيلة أخرى ({currentVirtueIndex + 1} من {monasticVirtues.length})</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeVirtue.icon}</span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                {activeVirtue.title}
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-stone-950 border border-amber-600/30 text-amber-200 font-spiritual text-base sm:text-lg leading-relaxed italic">
              {activeVirtue.quote}
            </div>
            <span className="text-xs font-semibold text-amber-400 block font-spiritual">
              — {activeVirtue.saint}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-600/40 space-y-1.5 text-xs">
            <span className="font-bold text-emerald-400 block">💡 التدريب العملي للمكرس:</span>
            <p className="text-stone-200 leading-relaxed">{activeVirtue.practice}</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RETREAT EVALUATION & PERSONAL REFLECTION */}
      {/* ========================================================================= */}
      {activeTab === 'retreat_eval' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/60 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>تقييم تجربة الخلوة الروحية والنمو الداخلي:</span>
              </span>
              <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                سجل ثمار الخلوة والسكون القلبي
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            قيّم تجربتك الروحية اليوم من حيث الهدوء، السلام، وعمق الصلاة، واكتب ملاحظاتك الشخصية عما اكتسبته من نعمة ونمو داخلي ليظل شاهداً على عمل النعمة في حياتك.
          </p>

          <form onSubmit={handleSaveRetreatEval} className="space-y-5 bg-stone-950 p-6 rounded-3xl border border-stone-800">
            {/* Sliders / Score Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Calmness */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>هدوء المخدع والسكينة</span>
                  <span className="text-amber-400 font-mono text-sm">{calmnessScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={calmnessScore}
                  onChange={(e) => setCalmnessScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>مشتت</span>
                  <span>هادئ جداً</span>
                </div>
              </div>

              {/* Inner Growth */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>النمو الداخلي والسلام</span>
                  <span className="text-amber-400 font-mono text-sm">{innerGrowthScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={innerGrowthScore}
                  onChange={(e) => setInnerGrowthScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>ضعيف</span>
                  <span>عميق ومثمر</span>
                </div>
              </div>

              {/* Prayer Depth */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>عمق الصلاة والتأمل</span>
                  <span className="text-amber-400 font-mono text-sm">{prayerDepthScore} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={prayerDepthScore}
                  onChange={(e) => setPrayerDepthScore(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>جاف</span>
                  <span>منسكب بحرارة</span>
                </div>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-200 block">
                ملاحظاتك الشخصية وثمار الخلوة (ماذا اكتسبت من هدوء ونمو داخلي اليوم؟):
              </label>
              <textarea
                rows={4}
                value={retreatNotes}
                onChange={(e) => setRetreatNotes(e.target.value)}
                placeholder="اكتب هنا تأملاتك، شعورك بالسلام الداخلي، الآيات التي مست قلبك، والدروس الروحية المستفادة من الخلوة..."
                required
                className="w-full p-4 rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>حفظ تقييم وثمار الخلوة</span>
              </button>
            </div>
          </form>

          {/* History of Saved Evaluations */}
          <div className="space-y-3 pt-2">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              📖 سجل خلواتك وتأملاتك المحفوظة ({savedRetreatEvals.length})
            </h3>

            <div className="space-y-3">
              {savedRetreatEvals.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono border-b border-stone-800 pb-2">
                      <span className="text-amber-400 font-bold">{item.date}</span>
                      <div className="flex items-center gap-3">
                        <span>الهدوء: {item.calmnessScore}/5</span>
                        <span>النمو: {item.innerGrowthScore}/5</span>
                        <span>الصلاة: {item.prayerDepthScore}/5</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual">
                      {item.notes}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteRetreatEval(item.id)}
                      className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer"
                    >
                      حذف التقييم
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
