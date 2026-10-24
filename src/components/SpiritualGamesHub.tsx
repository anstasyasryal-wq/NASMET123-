import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  ChevronLeft,
  Trophy,
  Sparkles,
  RotateCw,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Puzzle,
  Brain,
  Check,
  RotateCcw,
  Compass,
  Flame,
  Volume2,
  Shield,
  Heart,
  Sun,
  Moon,
  Award,
} from 'lucide-react';

interface SpiritualGamesHubProps {
  currentUser: User | null;
  onBackToHome: () => void;
}

type GameMode = 'wilderness_journey' | 'coptic_def_rhythm' | 'riddles' | 'pillars_puzzle' | 'patristic_match' | 'monastic_ascent';

export const SpiritualGamesHub: React.FC<SpiritualGamesHubProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('wilderness_journey');
  const [gameScore, setGameScore] = useState<number>(0);

  // Sync points to user consecration bonus
  const addPoints = (pts: number) => {
    setGameScore((prev) => prev + pts);
    if (typeof window !== 'undefined') {
      const curBonus = parseInt(localStorage.getItem('mokarasa_consecration_bonus') || '0', 10);
      localStorage.setItem('mokarasa_consecration_bonus', String(curBonus + pts));
    }
  };

  // Monastic Ascent Levels State
  const [ascentLevel, setAscentLevel] = useState<number>(1);
  const [level1Solved, setLevel1Solved] = useState<boolean>(false);
  const [level2Solved, setLevel2Solved] = useState<boolean>(false);
  const [level3Solved, setLevel3Solved] = useState<boolean>(false);
  const [level4Solved, setLevel4Solved] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('spiritual_games_monastic_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.level1) setLevel1Solved(true);
        if (parsed.level2) setLevel2Solved(true);
        if (parsed.level3) setLevel3Solved(true);
        if (parsed.level4) setLevel4Solved(true);
      } catch {}
    }
  }, []);

  const saveAscentProgress = (l1: boolean, l2: boolean, l3: boolean, l4: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'spiritual_games_monastic_progress',
        JSON.stringify({ level1: l1, level2: l2, level3: l3, level4: l4 })
      );
    }
  };

  const [renunciationItems, setRenunciationItems] = useState([
    { id: '1', text: 'الصلاة المستمرة ولجج المخدع', type: 'spiritual' },
    { id: '2', text: 'السكوت وطاعة الشيخ الروحي', type: 'spiritual' },
    { id: '3', text: 'طموحات العالم المادية والمالية', type: 'worldly' },
    { id: '4', text: 'الانشغال المفرط بمديح الناس والخدمة الخارجية', type: 'worldly' },
    { id: '5', text: 'التواضع وانسحاق القلب', type: 'spiritual' },
    { id: '6', text: 'جمع المقتنيات والتعلق بالأرضيات', type: 'worldly' },
  ]);

  const [cellNoiseItems, setCellNoiseItems] = useState([
    { id: 'n1', text: 'القلق على الغد وضجيج الأفكار', isNoise: true, cleared: false },
    { id: 'n2', text: 'سلام المخدع وهدوء الروح', isNoise: false, cleared: false },
    { id: 'n3', text: 'الغضب وتذكر الإساءات القديمة', isNoise: true, cleared: false },
    { id: 'n4', text: 'تسابيح الليل الصامتة بحب', isNoise: false, cleared: false },
    { id: 'n5', text: 'الشهوات العالمية المشتعلة', isNoise: true, cleared: false },
    { id: 'n6', text: 'تأمل الصليب الإلهي بخشوع', isNoise: false, cleared: false },
  ]);

  const [discernmentItems, setDiscernmentItems] = useState([
    { id: 'd1', thought: 'فكرة تقود للاتضاع والتوكل على الله', isGodly: true, solved: false },
    { id: 'd2', thought: 'فكرة تغذي الكبرياء وتدفع لإدانة الآخرين', isGodly: false, solved: false },
    { id: 'd3', thought: 'رغبة في الخدمة الخفية بفرح وانسحاق', isGodly: true, solved: false },
    { id: 'd4', thought: 'شكوى وتذمر من ضيق الطريق والظروف', isGodly: false, solved: false },
  ]);

  // Level 4 State: Tasting the Word (Memory & Matching Verses/Sayings with Saints)
  const [level4Challenges, setLevel4Challenges] = useState([
    {
      id: 1,
      quote: '«من عرف ضعفه فقد بلغ قمة المعرفة ونال تواضع القديسين.»',
      saint: 'القديس مار إسحق السرياني',
      options: ['القديس أنطونيوس الكبير', 'القديس مار إسحق السرياني', 'البابا شنودة الثالث', 'الأنبا باخوميوس'],
      selected: null as string | null,
      correct: false,
    },
    {
      id: 2,
      quote: '«الصلوات هي سور القلاية وهي السلاح الأقوى ضد حروب الشياطين.»',
      saint: 'القديس أنطونيوس الكبير',
      options: ['القديس أنطونيوس الكبير', 'القديس مار إسحق السرياني', 'البابا شنودة الثالث', 'الأنبا باخوميوس'],
      selected: null as string | null,
      correct: false,
    },
    {
      id: 3,
      quote: '«المحبة الحقيقية لا تسقط أبدًا، وهي الرباط الكامل بين النفوس المكرسة.»',
      saint: 'البابا شنودة الثالث',
      options: ['القديس أنطونيوس الكبير', 'القديس مار إسحق السرياني', 'البابا شنودة الثالث', 'الأنبا باخوميوس'],
      selected: null as string | null,
      correct: false,
    },
    {
      id: 4,
      quote: '«بالصمت والهدوء والجهاد الروحي ينفتح بصر النفس الداخلي لرؤية النور الإلهي.»',
      saint: 'الأنبا باخوميوس',
      options: ['القديس أنطونيوس الكبير', 'القديس مار إسحق السرياني', 'البابا شنودة الثالث', 'الأنبا باخوميوس'],
      selected: null as string | null,
      correct: false,
    },
  ]);

  const handleLevel4Select = (challengeId: number, chosenSaint: string) => {
    soundManager.playTick();
    const updated = level4Challenges.map((c) => {
      if (c.id === challengeId) {
        const isCorrect = chosenSaint === c.saint;
        if (isCorrect) soundManager.playCorrect();
        else soundManager.playWrong();
        return { ...c, selected: chosenSaint, correct: isCorrect };
      }
      return c;
    });
    setLevel4Challenges(updated);
  };

  const [showQuoteRewardModal, setShowQuoteRewardModal] = useState<boolean>(false);
  const [earnedQuote, setEarnedQuote] = useState<{ quote: string; author: string; levelTitle: string } | null>(null);

  const triggerQuoteReward = (lvl: number) => {
    const quotes = {
      1: {
        quote: '«التخلي الحقيقي ليس ترك الأشياء المادية فحسب، بل هو خلع الإنسان العتيق وإلباس الإنسان الجديد المخلوق بحسب الله.»',
        author: 'القديس أنطونيوس الكبير',
        levelTitle: 'المستوى الأول: باب التخلي',
      },
      2: {
        quote: '«الزم قلايتك فإن القلاية تعلم الإنسان كل شيء، وجلس القلاية تحافظ على الإنسان من كل خطية.»',
        author: 'القديس مار إسحق السرياني',
        levelTitle: 'المستوى الثاني: سكون القلاية',
      },
      3: {
        quote: '«التمييز الروحي هو سراج النفس وعينها، وبدون الإفراز تضل حتى أجساد النساك في طرق البرية.»',
        author: 'البابا أثناسيوس الرسولي',
        levelTitle: 'المستوى الثالث: حرب الأفكار',
      },
      4: {
        quote: '«تذوقوا وانظروا ما أطيب الرب... كلمة الله الحية هي السراج المنير للقلب المتكريس.»',
        author: 'القديس أغسطينوس',
        levelTitle: 'المستوى الرابع: تذوق الكلمة وعمق المعرفة',
      },
    };
    setEarnedQuote(quotes[lvl as keyof typeof quotes]);
    setShowQuoteRewardModal(true);
    addPoints(60);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  const saveQuoteToDailyMeditations = (quoteText: string, author: string) => {
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('mokarasa_daily_meditations') || '[]');
        const newItem = {
          id: Date.now(),
          quote: quoteText,
          author: author,
          date: new Date().toLocaleDateString('ar-EG'),
        };
        localStorage.setItem('mokarasa_daily_meditations', JSON.stringify([newItem, ...existing]));
        soundManager.playCorrect();
        alert('✨ تم حفظ القول المبارك بنجاح في تأملاتك اليومية بنجاح!');
      } catch {}
    }
  };

  // =========================================================================
  // 1. GAME: رحلة الراهب في البرية (Monk's Wilderness Journey)
  // =========================================================================
  interface JourneyStep {
    id: number;
    title: string;
    stageName: string;
    narrative: string;
    icon: string;
    choices: {
      text: string;
      outcome: string;
      peaceChange: number;
      humilityChange: number;
      patienceChange: number;
      points: number;
      isIdeal: boolean;
    }[];
  }

  const JOURNEY_STEPS: JourneyStep[] = [
    {
      id: 1,
      stageName: 'المحطة الأولى: النداء والخروج إلى البرية',
      title: 'ترك ضجيج المدينة وأسوار العالم',
      icon: '🏜️',
      narrative: 'تركت وراءك صخب الشوارع وهموم الغنى الزائل، وانطلقت نحو تخوم برية شيهيت حيث لا تسمع إلا صفير الريح. يقف أمامك طريقان: طريق وادي النخيل السهل القريب من القوافل، وطريق الكثبان الرملية الوعرة المؤدي للمغائر القديمة. ماذا تختار؟',
      choices: [
        {
          text: 'سلوك طريق الوادي السهل الآمن القريب من الناس لتجنب المشقة.',
          outcome: 'سلكت طريقاً سهلاً لكن أصوات القوافل ورنين التجارة شغلت فكرك عن الصلاة، ففقدت بعض هدوء المخدع.',
          peaceChange: -10,
          humilityChange: 0,
          patienceChange: -5,
          points: 10,
          isIdeal: false,
        },
        {
          text: 'سلوك طريق الكثبان الرملية الوعرة متسلحاً بالمزامير وطلب معونة الله.',
          outcome: 'تعب جسدك في الرمال لكن قلبك اشتعل بحلاوة اسم يسوع ونعمة الوحدة المقدسة.',
          peaceChange: 20,
          humilityChange: 15,
          patienceChange: 20,
          points: 30,
          isIdeal: true,
        },
      ],
    },
    {
      id: 2,
      stageName: 'المحطة الثانية: هجير الظهيرة وعطش النفس',
      title: 'امتحان الظمأ في قلب الصحراء',
      icon: '☀️',
      narrative: 'اشتدت شمس الظهيرة وجفّ حلقك تماماً وقَرُبت جرتك الصغيرة من النفاد. وفجأة لمح بصرك بئراً مهجورة يلتف حولها بعض المسافرين المتفاخرين بأنسابهم.',
      choices: [
        {
          text: 'التقدم والتفاخر بينهم بأنك راهب زاهد وتطلب الماء بحجة نسكك.',
          outcome: 'سقطت في فخ المجد الباطل! نلت الماء لكنك خسرت نقاوة قصد التواضع.',
          peaceChange: -15,
          humilityChange: -25,
          patienceChange: 0,
          points: 5,
          isIdeal: false,
        },
        {
          text: 'الانتظار بهدوء في مؤخرة الجمع، وتناول القليل بشكر وتواضع دون أن يعرف أحد من أنت.',
          outcome: 'شربت الماء ببركة الاتضاع، وشهد صمتك لنعمة المسيح الخفية في داخلك.',
          peaceChange: 25,
          humilityChange: 25,
          patienceChange: 20,
          points: 35,
          isIdeal: true,
        },
      ],
    },
    {
      id: 3,
      stageName: 'المحطة الثالثة: حيلة المجد الباطل',
      title: 'سراب الشهرة ومديح الناس',
      icon: '✨',
      narrative: 'مرّت بك جماعة من الزائرين وعلموا بسعيك للرهبنة، فبدأوا يكيلون لك المديح قائلين: «يا لك من قديس عظيم وشاب ملائكي زهد الدنيا!».',
      choices: [
        {
          text: 'الاستماع للمديح والإعجاب بالكلمات والتحدث عن فضائلك وصومك.',
          outcome: 'تسلل سم الكبرياء الخفي إلى القلب، وسرق السارق تعب جهادك في لحظة غفلة.',
          peaceChange: -20,
          humilityChange: -30,
          patienceChange: -10,
          points: 5,
          isIdeal: false,
        },
        {
          text: 'تذكر خطاياك السابقة والقول في نفسك: «أنا تراب ورماد وخاطئ»، والاعتذار والانصراف بصمت.',
          outcome: 'خزيت الشياطين ونجوت من فخ الصياد ببركة فضيلة انسحاق الروح!',
          peaceChange: 30,
          humilityChange: 30,
          patienceChange: 20,
          points: 40,
          isIdeal: true,
        },
      ],
    },
    {
      id: 4,
      stageName: 'المحطة الرابعة: وحشة الليل وزئير الضباع',
      title: 'حرب الخوف وحراسة المخدع',
      icon: '🌙',
      narrative: 'أرخى الليل سدوله في البرية الموحشة، وسمعت أصوات وحوش كاسرة وأصوات خيالات غريبة تزرع الرعب في أوصالك.',
      choices: [
        {
          text: 'الارتعاب والندم على الخروج للبرية ومحاولة الهرب ركضاً في الظلام.',
          outcome: 'تعثرت قدمك في الصخور وسيطر الخوف عليك حتى كدت تفقد بصيرتك.',
          peaceChange: -25,
          humilityChange: -10,
          patienceChange: -20,
          points: 10,
          isIdeal: false,
        },
        {
          text: 'رسم علامة الصليب المحيي والترتيل بمزمور «الساكن في ستر العلي» حتى استقر السلام في قلبك.',
          outcome: 'تحولت ظلمة البرية إلى محراب نور سماوي، وهربت الوحوش أمام سلطان صليب الفادي!',
          peaceChange: 35,
          humilityChange: 20,
          patienceChange: 30,
          points: 45,
          isIdeal: true,
        },
      ],
    },
    {
      id: 5,
      stageName: 'المحطة الخامسة: بلوغ قلاية الأنبا باخوميوس',
      title: 'ميناء الخلاص واللقاء بالآباء القديسين',
      icon: '⛪',
      narrative: 'مع انبثاق خيوط فجر اليوم التالي، لاحت لك قلالي الآباء وصوت تسبيح باكر يرتفع كالبخور الذكي، واستقبلك الشيخ الوقور بفرح وحضن أبوي.',
      choices: [
        {
          text: 'السجود أمامه بانسحاق وطلب صلواته وإرشاده للمسيرة الروحية.',
          outcome: 'باركتك السماء، ونلت إكليل الأمانة في جهاد البرية واستقر في داخلك فرح الروح القدس!',
          peaceChange: 40,
          humilityChange: 35,
          patienceChange: 35,
          points: 60,
          isIdeal: true,
        },
      ],
    },
  ];

  const [journeyStepIdx, setJourneyStepIdx] = useState<number>(0);
  const [journeyFeedback, setJourneyFeedback] = useState<string | null>(null);
  const [journeyStats, setJourneyStats] = useState({ peace: 60, humility: 60, patience: 60 });
  const [isJourneyComplete, setIsJourneyComplete] = useState<boolean>(false);

  const handleMakeJourneyChoice = (choice: JourneyStep['choices'][0]) => {
    soundManager.playCorrect();
    addPoints(choice.points);
    setJourneyStats((prev) => ({
      peace: Math.min(100, Math.max(10, prev.peace + choice.peaceChange)),
      humility: Math.min(100, Math.max(10, prev.humility + choice.humilityChange)),
      patience: Math.min(100, Math.max(10, prev.patience + choice.patienceChange)),
    }));
    setJourneyFeedback(choice.outcome);

    if (journeyStepIdx + 1 >= JOURNEY_STEPS.length) {
      setIsJourneyComplete(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleNextJourneyStep = () => {
    soundManager.playTick();
    setJourneyFeedback(null);
    if (journeyStepIdx + 1 < JOURNEY_STEPS.length) {
      setJourneyStepIdx((prev) => prev + 1);
    }
  };

  const handleRestartJourney = () => {
    soundManager.playTick();
    setJourneyStepIdx(0);
    setJourneyFeedback(null);
    setJourneyStats({ peace: 60, humility: 60, patience: 60 });
    setIsJourneyComplete(false);
  };

  // =========================================================================
  // 2. GAME: رنين الدف والألحان الكنسية (Coptic Def Rhythm)
  // =========================================================================
  const [defBeatsCount, setDefBeatsCount] = useState<number>(0);
  const [defCombo, setDefCombo] = useState<number>(0);
  const [defMaxCombo, setDefMaxCombo] = useState<number>(0);
  const [activeDefTune, setActiveDefTune] = useState<'joyful' | 'fast' | 'festive'>('joyful');
  const [beatPulse, setBeatPulse] = useState<boolean>(false);

  const TUNE_INFO = {
    joyful: { name: 'الطقس الفرايحي (الفرح القيامي)', bpm: 90, desc: 'ضربات متوازنة وهادئة ترن في القلب بالسلام' },
    fast: { name: 'الطقس الشعانيني والمناسبات', bpm: 120, desc: 'إيقاع بهيج وسريع يملأ الروح بالتسبيح' },
    festive: { name: 'الطقس الكيهكي والتمجيد', bpm: 75, desc: 'نغمات متأنية تتيح التأمل والخشوع' },
  };

  const handleHitDef = () => {
    soundManager.playTick();
    soundManager.playChurchTone('coptic_bell');
    setBeatPulse(true);
    setTimeout(() => setBeatPulse(false), 200);

    const newBeats = defBeatsCount + 1;
    const newCombo = defCombo + 1;
    setDefBeatsCount(newBeats);
    setDefCombo(newCombo);
    if (newCombo > defMaxCombo) setDefMaxCombo(newCombo);

    // Every 10 combos award points
    if (newCombo % 10 === 0) {
      soundManager.playCorrect();
      addPoints(25);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      } catch {}
    }
  };

  // =========================================================================
  // 3. GAME: فوازير بستان الرهبان مع مستويات الصعوبة
  // =========================================================================
  type RiddleLevel = 'beginner' | 'advanced' | 'elder';
  const [riddleLevel, setRiddleLevel] = useState<RiddleLevel>('beginner');

  const RIDDLES_DATA = [
    // Beginner
    {
      level: 'beginner',
      q: 'أنا لستُ ملاكاً ولا نبياً، لكنني ألبستُ ملوكاً وأطعتُ شيوخاً في البرية، اسمي يحمل رتبة التواضع في بستان الرهبان. فمن أكون؟',
      hint: 'ابحث في فضيلة الطاعة التامة للشيخ الروحي في أديرة وادي النطرون.',
      a: 'الراهب التلميذ المطيع للشيخ المتضع',
      source: 'بستان الرهبان - أقوال الشيوخ',
    },
    {
      level: 'beginner',
      q: 'كنيسة بلا سقف، ومحراب في الهواء الطلق، وبطرس وبولس لم يبنوا جدراناً بل قلوباً مسبحة في مغارة مصرية. أين أكون؟',
      hint: 'منطقة الرهبنة الأولى التي نزل إليها القديس مكاريوس الكبير.',
      a: 'مغارات وقلايات وادي النطرون وجبل نتريا',
      source: 'تاريخ الرهبنة القبطية في مصر',
    },
    {
      level: 'beginner',
      q: 'سفينة بلا مجاديف خاضت بحر العالم دون أن تغرق، لأن قبطانها المصلوب كان يمسك بزمام الدفة. ما هي؟',
      hint: 'فلك النجاة الروحي الذي أسسه المسيح بدمه الطاهر.',
      a: 'كنيسة العهد الجديد المقدسة',
      source: 'تأملات الآباء الأوائل',
    },
    {
      level: 'beginner',
      q: 'أنا كتاب تاريخي حي كُتب في المنفى عن حياة راهب مصري، فصار سبباً في توبة وإلهام الآلاف حول العالم. ما اسمي؟',
      hint: 'كتبه البابا أثناسيوس الرسولي وترجم للاتينية.',
      a: 'سيرة القديس أنطونيوس (Vita Antonii)',
      source: 'تاريخ الكنيسة - القديس أثناسيوس',
    },

    // Advanced
    {
      level: 'advanced',
      q: 'أنا سر بيولوجي مدهش يحمل تتابعاً رقمياً دقيقاً في نواة خلاياك، يشهد بأنك مخلوق لست من عبث بل بتصميم فائق الجمال والهارموني. فمن أكون؟',
      hint: 'يتكون من 4 قواعد نيتروجينية (A, T, C, G) ويشهد لعظمة الصانع.',
      a: 'شريط الحمض النووي (DNA) والشفرة الوراثية',
      source: 'علم الوراثة والتصميم الخالق في ضوء المزامير',
    },
    {
      level: 'advanced',
      q: 'سلاح خفي ليس فيه حديد ولا نار، إذا استعمله الراهب انطفأت كل نيران الغضب والشهوة وهربت الشياطين مرعوبة، ما هو؟',
      hint: 'فضيلة الاتضاع وطلب الرحمة بالركوع والتوبة.',
      a: 'انسحاق القلب وصلاة يسوع والتواضع',
      source: 'مار إسحق السرياني - الميامر الروحية',
    },
    {
      level: 'advanced',
      q: 'صانع سلال وُلد في رومية وكان معلماً لأولاد الملوك، فلما سمع صوت النعمة هرب إلى شيهيت وصار يبكي حتى تساقطت رموش عينيه من خشوع الصلاة. من هو؟',
      hint: 'اشتهر بعبارة: «اهرب، واسكت، واسكن».',
      a: 'القديس أرسانيوس معلم أولاد الملوك',
      source: 'سير الآباء وبستان الرهبان',
    },
    {
      level: 'advanced',
      q: 'أنا فضيلة أجمع بين الصيام والصلاة والعمل اليدوي، سمّاني القديس أنطونيوس «سراج النفس وعينها» لأنني أحمي الراهب من الإفراط يميناً أو يساراً. فما أنا؟',
      hint: 'تعرف باليونانية باسم Diakrisis.',
      a: 'فضيلة الإفراز والتمييز الروحي',
      source: 'مناظرات القديس يوحنا كاسيان',
    },

    // Elder (حكيم شيهيت)
    {
      level: 'elder',
      q: 'لص وقاطع طريق مرعب تاب بالدموع، وصار أباً لخمسمائة راهب وأعظم شهيد للوداعة والتواضع في برية مصر. من هو؟',
      hint: 'لقب بالقوي، واستشهد عندما رفض حمل السلاح قائلاً: «من أخذ بالسيف بالسيف يهلك».',
      a: 'القديس الأنبا موسى الأسود القوي',
      source: 'تاريخ شيوخ البرية',
    },
    {
      level: 'elder',
      q: 'شجرة مقدسة جذورها في الصليب وثمارها في المائدة الإفخارستية، أوراقها شفاء للأمم ونسيمها الروح القدس. ما هي؟',
      hint: 'شجرة الحياة المزروعة في الفردوس وكنيسة النعمة.',
      a: 'شجرة الحياة والمذبح المقدس وجسد الرب ودمه',
      source: 'تأملات الآباء السريان والقبط',
    },
    {
      level: 'elder',
      q: 'أنا المجمع المسكوني الذي ثبت لقب «ثيؤطوكوس» (والدة الإله) للقديسة العذراء مريم وردّ كبرياء نسطور. أين ومتى عُقدت؟',
      hint: 'قاده البابا كيرلس عمود الدين عام 431 ميلادية.',
      a: 'مجمع أفسس المسكوني الأول (431م)',
      source: 'تاريخ المجامع المسكونية للكنيسة القبطية',
    },
    {
      level: 'elder',
      q: 'جبل نزل عليه السكون فصار أعظم من قصور أباطرة روما، فيه توحد القديس أنبا بولا أول السواح لأكثر من تسعين عاماً لا يرى وجهاً بشرياً إلا وجه الله. أين هو؟',
      hint: 'يقع في البرية الشرقية بالقرب من البحر الأحمر.',
      a: 'برية وجبل القديس أنبا بولا بالبحر الأحمر',
      source: 'تاريخ السواح وبراري مصر',
    },
  ];

  const filteredRiddles = RIDDLES_DATA.filter((r) => r.level === riddleLevel);
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState<number>(0);
  const [showRiddleHint, setShowRiddleHint] = useState<boolean>(false);
  const [showRiddleSolution, setShowRiddleSolution] = useState<boolean>(false);

  const curRiddle = filteredRiddles[currentRiddleIdx] || filteredRiddles[0];

  const handleNextRiddle = () => {
    soundManager.playTick();
    setShowRiddleHint(false);
    setShowRiddleSolution(false);
    setCurrentRiddleIdx((prev) => (prev + 1) % filteredRiddles.length);
  };

  const handleRevealSolution = () => {
    soundManager.playCorrect();
    setShowRiddleSolution(true);
    addPoints(25);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // =========================================================================
  // 4. GAME: بازل ركائز التكريس الـ ٧
  // =========================================================================
  const CORRECT_PILLARS = [
    { id: 1, text: '1. الطاعة الإنجيلية وتسليم المشيئة' },
    { id: 2, text: '2. التجرد والفقر الاختياري' },
    { id: 3, text: '3. العفة والبتولية ونقاوة القلب' },
    { id: 4, text: '4. الصلاة الدائمة وهذيذ المزامير' },
    { id: 5, text: '5. المحبة الباذلة وخدمة الإخوة' },
    { id: 6, text: '6. التواضع وانسحاق الفكر' },
    { id: 7, text: '7. حمل الصليب والفرح الروحي' },
  ];

  const [shuffledPillars, setShuffledPillars] = useState(() =>
    [...CORRECT_PILLARS].sort(() => Math.random() - 0.5)
  );
  const [puzzleSolved, setPuzzleSolved] = useState<boolean>(false);

  const movePillar = (index: number, direction: 'up' | 'down') => {
    soundManager.playTick();
    const newItems = [...shuffledPillars];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setShuffledPillars(newItems);

    const isNowSolved = newItems.every((item, i) => item.id === i + 1);
    if (isNowSolved) {
      soundManager.playCorrect();
      setPuzzleSolved(true);
      addPoints(50);
      try {
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const resetPuzzle = () => {
    soundManager.playTick();
    setShuffledPillars([...CORRECT_PILLARS].sort(() => Math.random() - 0.5));
    setPuzzleSolved(false);
  };

  // =========================================================================
  // 5. GAME: مطابقة أقوال الآباء (Multi-Round Patristic Match)
  // =========================================================================
  const ALL_PATRISTIC_ROUNDS = [
    [
      { saint: 'القديس أثناسيوس الرسولي', quote: '«صار الله إنساناً لكي يصير الإنسان إلهاً بالنعمة»' },
      { saint: 'القديس أنطونيوس الكبير', quote: '«رأيت فخاخ الشرير مبثوثة على الأرض، فقلت: من ينجو منها؟ فقيل لي: المتواضعون»' },
      { saint: 'القديس يوحنا ذهبي الفم', quote: '«الصلاة هي ينبوع البركات، وبلسم الجراح، وميناء السلام الهادئ»' },
      { saint: 'مار إسحق السرياني', quote: '«القلب النقي هو الذي يشتعل بمحبة الخليقة كلها حتى الأعداء»' },
    ],
    [
      { saint: 'القديس باسيليوس الكبير', quote: '«الهدوء والسكون هما مبدأ نقاوة النفس، ففيهما يصمت اللسان ليتكلم القلب»' },
      { saint: 'القديس كيرلس عمود الدين', quote: '«المسيح واحد هو الرب نفسه، تجسد وتأنس لخلاصنا دون أن يفقد لاهوته»' },
      { saint: 'القديس الأنبا موسى الأسود', quote: '«إن حفظت لسانك يا أخي يُوهب لك من الله سكون القلب وحراسة الفكر»' },
      { saint: 'القديس يوحنا الدرجي', quote: '«الصلاة في حقيقتها هي اتحاد الإنسان بالله وسور منيع ضد سهام التجارب»' },
    ],
    [
      { saint: 'القديس مكاريوس الكبير', quote: '«كن كالميت الذي لا يغضب إن أهانوه ولا ينتفخ إن مدحوه، فتخلص»' },
      { saint: 'القديس باخوميوس أب الشركة', quote: '«المحبة المشتركة واحتمال ضعف الإخوة هما أقدس نسك يقبله الله»' },
      { saint: 'القديس أرسانيوس المعلم', quote: '«كثيراً ما تكلمت فندمت، أما عن الصمت فما ندمت قط»' },
      { saint: 'مار إفرام السرياني', quote: '«دموع التوبة تنظف عيون القلب لتعاين مجد الرب غير المنظور»' },
    ],
  ];

  const [patristicRound, setPatristicRound] = useState<number>(0);
  const currentMatchCards = ALL_PATRISTIC_ROUNDS[patristicRound];
  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

  const handleMatchSaint = (saintIdx: number) => {
    if (selectedQuoteIdx === null) return;
    soundManager.playTick();
    if (selectedQuoteIdx === saintIdx) {
      soundManager.playCorrect();
      const updated = [...matchedPairs, saintIdx];
      setMatchedPairs(updated);
      setSelectedQuoteIdx(null);
      addPoints(30);

      if (updated.length === currentMatchCards.length) {
        try {
          confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
        } catch {}
      }
    } else {
      soundManager.playWrong();
      setSelectedQuoteIdx(null);
    }
  };

  const handleNextMatchRound = () => {
    soundManager.playTick();
    setSelectedQuoteIdx(null);
    setMatchedPairs([]);
    setPatristicRound((prev) => (prev + 1) % ALL_PATRISTIC_ROUNDS.length);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right" dir="rtl">
      {/* Top Header Back */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية وشجرة التكريس</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-purple-600/40 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/40 text-purple-300 text-xs font-semibold">
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>الألعاب الروحية وتحديات البرية الـ ٥</span>
          </div>
          <div className="flex items-center gap-2 bg-stone-900/90 px-3.5 py-1.5 rounded-xl border border-amber-500/40 shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 font-mono">
              نقاط الألعاب: {gameScore} 🏅
            </span>
          </div>
        </div>

        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100 relative z-10">
          🎮 واحة الألعاب الروحية ومغامرات البرية
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl relative z-10">
          ألعاب تفاعلية، مغامرة رحلة الراهب بالقرارات، تحدي رنين الدف والألحان، بازل ركائز التكريس، وفوازير بستان الرهبان بمستويات صعوبة.
        </p>

        {/* Game Mode Switcher Bar */}
        <div className="flex items-center gap-2 pt-3 overflow-x-auto pb-1 scrollbar-none relative z-10">
          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('wilderness_journey');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'wilderness_journey'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <span>🧭</span>
            <span>رحلة الراهب في البرية</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('coptic_def_rhythm');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'coptic_def_rhythm'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <span>🥁</span>
            <span>رنين الدف والألحان</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('riddles');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'riddles'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>فوازير بستان الرهبان</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('pillars_puzzle');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'pillars_puzzle'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>بازل ركائز التكريس</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('patristic_match');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'patristic_match'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>مطابقة أقوال الآباء</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              setActiveGame('monastic_ascent');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeGame === 'monastic_ascent'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 border border-stone-800'
            }`}
          >
            <span>📜</span>
            <span>حسب قلب الله للمكرسين (المستويات الـ ٣)</span>
          </button>
        </div>
      </div>

      {/* 1. GAME: رحلة الراهب في البرية */}
      {activeGame === 'wilderness_journey' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-2xl space-y-6 text-right animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div>
              <div className="text-xs font-bold text-amber-400 font-mono mb-1">
                المرحلة {journeyStepIdx + 1} من {JOURNEY_STEPS.length}
              </div>
              <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2">
                <span>{JOURNEY_STEPS[journeyStepIdx].icon}</span>
                <span>{JOURNEY_STEPS[journeyStepIdx].stageName}</span>
              </h3>
            </div>

            {/* Spiritual Stats Bars */}
            <div className="flex items-center gap-3 bg-stone-950/80 p-2 rounded-2xl border border-stone-800 text-[11px]">
              <div className="text-center">
                <span className="text-stone-400 block text-[10px]">السلام</span>
                <span className="font-bold text-sky-400 font-mono">{journeyStats.peace}%</span>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div className="text-center">
                <span className="text-stone-400 block text-[10px]">التواضع</span>
                <span className="font-bold text-emerald-400 font-mono">{journeyStats.humility}%</span>
              </div>
              <div className="w-px h-6 bg-stone-800" />
              <div className="text-center">
                <span className="text-stone-400 block text-[10px]">الصبر</span>
                <span className="font-bold text-amber-400 font-mono">{journeyStats.patience}%</span>
              </div>
            </div>
          </div>

          {!isJourneyComplete ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-stone-950/80 border border-amber-900/30 space-y-3">
                <h4 className="text-sm font-bold text-amber-200">
                  {JOURNEY_STEPS[journeyStepIdx].title}
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-spiritual">
                  {JOURNEY_STEPS[journeyStepIdx].narrative}
                </p>
              </div>

              {journeyFeedback ? (
                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 space-y-4 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-300 mb-1">نتيجة قرارك الروحي:</h5>
                      <p className="text-xs text-stone-200 leading-relaxed">{journeyFeedback}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextJourneyStep}
                    className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer shadow-md"
                  >
                    متابعة المسيرة نحو المحطة التالية ➔
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-300 block">
                    ما هو قرارك الروحي أمام هذا الموقف؟
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {JOURNEY_STEPS[journeyStepIdx].choices.map((choice, i) => (
                      <button
                        key={i}
                        onClick={() => handleMakeJourneyChoice(choice)}
                        className="text-right p-4 rounded-2xl bg-stone-950/70 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/50 text-xs sm:text-sm text-stone-200 transition cursor-pointer leading-relaxed group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-amber-600/20 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                            {i + 1}
                          </span>
                          <span>{choice.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-emerald-950/80 to-amber-950/80 border border-amber-500/60 text-center space-y-4 shadow-2xl animate-fade-in">
              <span className="text-5xl">👑🕊️</span>
              <h3 className="font-spiritual text-xl font-bold text-amber-100">
                طوباك يا مجاهد المسيح! أتممت رحلة البرية بسلام وأمانة
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                بلغت قلاية السكون وتلقيت بركة آباء البرية بعد أن تغلبت على العطش والمجد الباطل والخوف الليلي بفضائل الصليب والتواضع.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartJourney}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>بدء رحلة جديدة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. GAME: رنين الدف والألحان الكنسية */}
      {activeGame === 'coptic_def_rhythm' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800 pb-4 text-right">
            <div>
              <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 flex items-center gap-2 justify-center sm:justify-start">
                <span>🥁</span>
                <span>تحدي رنين الدف والتسبيح الكنسي</span>
              </h3>
              <p className="text-xs text-stone-400">
                اضغط على الدف مع كل ضربة تسبيح لتحافظ على الإيقاع التناغمي للألحان القبطية وتربح النقاط.
              </p>
            </div>

            {/* Tune Selector */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800">
              {(['joyful', 'fast', 'festive'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    soundManager.playTick();
                    setActiveDefTune(t);
                    setDefCombo(0);
                  }}
                  className={`px-3 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${
                    activeDefTune === t
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {TUNE_INFO[t].name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-6 py-4">
            <div className="flex items-center justify-around text-xs font-mono">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px]">الضربات</span>
                <span className="text-lg font-bold text-amber-300">{defBeatsCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px]">الكومبو المتتالي</span>
                <span className="text-lg font-bold text-emerald-400">{defCombo}🔥</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800">
                <span className="text-stone-400 block text-[10px]">أعلى كومبو</span>
                <span className="text-lg font-bold text-purple-400">{defMaxCombo}</span>
              </div>
            </div>

            {/* Visual Interactive Def Cymbals */}
            <div className="relative py-8 flex items-center justify-center">
              <div
                onClick={handleHitDef}
                className={`w-44 h-44 rounded-full border-4 border-amber-500 bg-gradient-to-br from-amber-700/40 via-stone-950 to-amber-900/60 flex flex-col items-center justify-center cursor-pointer transition-all duration-100 shadow-[0_0_40px_rgba(245,158,11,0.3)] select-none active:scale-90 ${
                  beatPulse ? 'scale-105 border-yellow-300 ring-8 ring-amber-400/30' : ''
                }`}
              >
                <span className="text-5xl select-none mb-1">🥁</span>
                <span className="font-spiritual text-xs font-bold text-amber-200 select-none">
                  انقر لرنين الدف
                </span>
                <span className="text-[10px] text-amber-400/80 font-mono select-none">
                  {TUNE_INFO[activeDefTune].name}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400">
              {TUNE_INFO[activeDefTune].desc} • كل 10 ضربات متتالية تمنحك +25 نقطة!
            </p>
          </div>
        </div>
      )}

      {/* 3. GAME: فوازير بستان الرهبان */}
      {activeGame === 'riddles' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          {/* Difficulty Level Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-300">مستوى الصعوبة:</span>
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                {(['beginner', 'advanced', 'elder'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      soundManager.playTick();
                      setRiddleLevel(lvl);
                      setCurrentRiddleIdx(0);
                      setShowRiddleHint(false);
                      setShowRiddleSolution(false);
                    }}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      riddleLevel === lvl
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {lvl === 'beginner' ? 'نسيم البرية (مبتدئ)' : lvl === 'advanced' ? 'أعماق شيهيت (متقدم)' : 'حكيم الشيوخ (خبير)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-mono">
                اللغز {currentRiddleIdx + 1} من {filteredRiddles.length}
              </span>
              <button
                onClick={handleNextRiddle}
                className="text-xs text-stone-300 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>اللغز التالي</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100 leading-relaxed p-4 rounded-2xl bg-stone-950/70 border border-stone-800">
              «{curRiddle.q}»
            </h3>

            {/* Hint Box */}
            {showRiddleHint && !showRiddleSolution && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 space-y-1 animate-fade-in">
                <span className="font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>تلميح روحي:</span>
                </span>
                <p className="leading-relaxed text-stone-300">{curRiddle.hint}</p>
              </div>
            )}

            {/* Solution Box */}
            {showRiddleSolution ? (
              <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>الإجابة النموذجية: {curRiddle.a}</span>
                </div>
                <span className="text-[11px] text-amber-300 font-mono block">
                  📚 المصدر والمرجع: {curRiddle.source}
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleRevealSolution}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  كشف الإجابة والحل (+25 نقطة)
                </button>
                {!showRiddleHint && (
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setShowRiddleHint(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs transition cursor-pointer border border-stone-700 flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>طلب تلميح</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. GAME: بازل ركائز التكريس الـ ٧ */}
      {activeGame === 'pillars_puzzle' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-spiritual text-base font-bold text-amber-100">
                🧩 بازل ترتيب ركائز التكريس الـ ٧ الإنجيلية
              </h3>
              <p className="text-xs text-stone-400">
                استخدم أسهم الرفع والخفض لإعادة ترتيب ركائز المكرس بترتيبها الصحيح من 1 إلى 7.
              </p>
            </div>
            <button
              onClick={resetPuzzle}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة خلط</span>
            </button>
          </div>

          {puzzleSolved && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center justify-between animate-fade-in">
              <span>🎉 رائع جداً! رتبت ركائز التكريس الـ ٧ بالترتيب السليم تماماً (+50 نقطة).</span>
              <button
                onClick={resetPuzzle}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          <div className="space-y-2">
            {shuffledPillars.map((pillar, idx) => {
              const isCorrectPos = pillar.id === idx + 1;
              return (
                <div
                  key={pillar.id}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isCorrectPos
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
                      : 'bg-stone-950 border-stone-800 text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-spiritual font-bold">
                      {pillar.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => movePillar(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => movePillar(idx, 'down')}
                      disabled={idx === shuffledPillars.length - 1}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. GAME: مطابقة أقوال الآباء */}
      {activeGame === 'patristic_match' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-spiritual text-base font-bold text-amber-100">
                🧠 مطابقة أقوال الآباء وقديسي الكنيسة (الجولة {patristicRound + 1} من {ALL_PATRISTIC_ROUNDS.length})
              </h3>
              <p className="text-xs text-stone-400">
                اختر أولاً القول الآبائي من العمود الأيمن، ثم انقر على القديس القائل في العمود الأيسر.
              </p>
            </div>
            <button
              onClick={handleNextMatchRound}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>الجولة التالية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quotes Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 block mb-1">
                العمود 1: الأقوال والدرر الآبائية
              </span>
              {currentMatchCards.map((item, idx) => {
                const isMatched = matchedPairs.includes(idx);
                const isSelected = selectedQuoteIdx === idx;
                return (
                  <button
                    key={idx}
                    disabled={isMatched}
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedQuoteIdx(idx);
                    }}
                    className={`w-full text-right p-3.5 rounded-2xl border text-xs leading-relaxed transition cursor-pointer select-none ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300 opacity-60'
                        : isSelected
                        ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-stone-950 border-stone-800 text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    {item.quote}
                  </button>
                );
              })}
            </div>

            {/* Saints Column */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 block mb-1">
                العمود 2: قديسو الشرق والغرب
              </span>
              {currentMatchCards.map((item, idx) => {
                const isMatched = matchedPairs.includes(idx);
                return (
                  <button
                    key={idx}
                    disabled={isMatched || selectedQuoteIdx === null}
                    onClick={() => handleMatchSaint(idx)}
                    className={`w-full text-right p-3.5 rounded-2xl border text-xs font-bold transition select-none ${
                      isMatched
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : selectedQuoteIdx !== null
                        ? 'bg-stone-950 border-amber-500/50 hover:bg-amber-950/50 text-amber-100 cursor-pointer animate-pulse'
                        : 'bg-stone-950 border-stone-800 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.saint}</span>
                      {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. GAME: حسب قلب الله للمكرسين (3 Levels & Quote Reveal) */}
      {activeGame === 'monastic_ascent' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-2xl space-y-6 text-right animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 font-mono">تطبيق التكريس الروحي والتصعد</span>
              <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                📜 حسب قلب الله للمكرسين (مستويات الصعود الروحي)
              </h3>
            </div>
            {/* Level switch buttons */}
            <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 flex-wrap">
              <button
                onClick={() => { soundManager.playTick(); setAscentLevel(1); }}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition cursor-pointer ${ascentLevel === 1 ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                1. باب التخلي {level1Solved && '✅'}
              </button>
              <button
                onClick={() => { soundManager.playTick(); setAscentLevel(2); }}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition cursor-pointer ${ascentLevel === 2 ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                2. سكون القلاية {level2Solved && '✅'}
              </button>
              <button
                onClick={() => { soundManager.playTick(); setAscentLevel(3); }}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition cursor-pointer ${ascentLevel === 3 ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                3. حرب الأفكار {level3Solved && '✅'}
              </button>
              <button
                onClick={() => { soundManager.playTick(); setAscentLevel(4); }}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition cursor-pointer ${ascentLevel === 4 ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'}`}
              >
                4. تذوق الكلمة {level4Solved && '✅'}
              </button>
            </div>
          </div>

          {/* LEVEL 1: باب التخلي */}
          {ascentLevel === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-200">المستوى الأول: باب التخلي (فرز القيم الروحية والعالمية)</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-spiritual">
                  انقر على العناصر لتمييزها وفصل القيم الروحية المقدسة عن طموحات العالم المادية لفتح باب التخلي والتجرد.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renunciationItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-stone-200 font-spiritual">{item.text}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.type === 'spiritual' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-red-950 text-red-300 border border-red-600/40'}`}>
                        {item.type === 'spiritual' ? '✨ روحي مقدّس' : '🌍 مادي عالمي'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {!level1Solved ? (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setLevel1Solved(true);
                      saveAscentProgress(true, level2Solved, level3Solved, level4Solved);
                      triggerQuoteReward(1);
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    تأكيد الفرز وفتح باب التخلي ➔
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center text-xs text-emerald-200 font-bold">
                  ✨ تم اجتياز مستوى باب التخلي بنجاح بالبركة ونلت درر آباء البرية!
                </div>
              )}
            </div>
          )}

          {/* LEVEL 2: سكون القلاية */}
          {ascentLevel === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-200">المستوى الثاني: سكون القلاية (إزالة أفكار الضجيج والقلق)</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-spiritual">
                  انقر على الأفكار المزعجة والضوضاء لتصفيتها وإزالتها، محتفظاً بالسلام الداخلي وتسابيح المخدع الصامتة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cellNoiseItems.map((item) => (
                  <button
                    key={item.id}
                    disabled={item.cleared}
                    onClick={() => {
                      soundManager.playTick();
                      setCellNoiseItems((prev) =>
                        prev.map((it) => (it.id === item.id ? { ...it, cleared: true } : it))
                      );
                      const remainingNoise = cellNoiseItems.filter((it) => it.isNoise && it.id !== item.id && !it.cleared);
                      if (item.isNoise && remainingNoise.length === 0) {
                        setLevel2Solved(true);
                        saveAscentProgress(level1Solved, true, level3Solved, level4Solved);
                        triggerQuoteReward(2);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-right transition cursor-pointer flex items-center justify-between ${
                      item.cleared
                        ? 'bg-stone-950/40 border-stone-800 text-stone-500 opacity-50 line-through'
                        : item.isNoise
                        ? 'bg-red-950/40 border-red-800/60 hover:bg-red-900/50 text-red-200'
                        : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-spiritual">{item.text}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-900">
                      {item.isNoise ? '🗑️ انقر للتصفية' : '🕊️ سلام'}
                    </span>
                  </button>
                ))}
              </div>

              {level2Solved && (
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center text-xs text-emerald-200 font-bold">
                  ✨ تم تنقية القلاية وإشعال سراج السكون بنجاح!
                </div>
              )}
            </div>
          )}

          {/* LEVEL 3: حرب الأفكار */}
          {ascentLevel === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-200">المستوى الثالث: حرب الأفكار (تمييز الأفكار بحسب الآباء)</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-spiritual">
                  افحص الأفكار الآتية وميز بين ما يقود للاتضاع ومحبة الله وما يقود للكبرياء والتذمر بحسب مبادئ التمييز الروحي (Diakrisis).
                </p>
              </div>

              <div className="space-y-3">
                {discernmentItems.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm text-stone-200 font-spiritual">{item.thought}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${item.isGodly ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' : 'bg-amber-950 text-amber-300 border border-amber-600/40'}`}>
                        {item.isGodly ? '✨ فكرة بارة ومقبدة' : '⚠️ فكرة تحتاج لرفض'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {!level3Solved ? (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setLevel3Solved(true);
                      saveAscentProgress(level1Solved, level2Solved, true, level4Solved);
                      triggerQuoteReward(3);
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    إتمام معركة الأفكار ونيل الإكليل ➔
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center text-xs text-emerald-200 font-bold">
                  👑 تهانينا! لقد تغلبت على حروب الأفكار ونلت بركة شيوخ البرية!
                </div>
              )}
            </div>
          )}

          {/* LEVEL 4: تذوق الكلمة */}
          {ascentLevel === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-200">المستوى الرابع: تذوق الكلمة (مطابقة الأقوال الروحية بالآباء القديسين)</h4>
                <p className="text-xs text-stone-300 leading-relaxed font-spiritual">
                  اختر القائل الصحيح لكل قول روحي أو آية مباركة لتعميق معرفتك بالتراث الآبائي.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {level4Challenges.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl border transition space-y-3 ${
                      c.correct ? 'bg-emerald-950/60 border-emerald-500/50' : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-spiritual font-bold text-stone-200 leading-relaxed">
                      {c.quote}
                    </p>
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-400 block">اختر القائل الصحيح:</span>
                      <div className="grid grid-cols-2 gap-2">
                        {c.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleLevel4Select(c.id, opt)}
                            className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                              c.selected === opt
                                ? opt === c.saint
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-rose-600 text-white shadow-md'
                                : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    {c.correct && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold pt-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>إجابة صحيحة بارك الله في بصيرتك!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {level4Challenges.every((c) => c.correct) && !level4Solved && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      setLevel4Solved(true);
                      saveAscentProgress(level1Solved, level2Solved, level3Solved, true);
                      triggerQuoteReward(4);
                    }}
                    className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
                  >
                    👑 تأكيد إتمام المستوى الرابع ونيل إكليل تذوق الكلمة ➔
                  </button>
                </div>
              )}

              {level4Solved && (
                <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-center text-xs text-emerald-200 font-bold">
                  🎉 هنيئًا لك! لقد أكملت المستوى الرابع 'تذوق الكلمة' وحفظت تقدمك في النظام بنجاح!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* REWARD MONASTIC QUOTE MODAL */}
      {showQuoteRewardModal && earnedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" dir="rtl">
          <div className="max-w-md w-full bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <span className="text-4xl">📜✨</span>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 font-mono block">{earnedQuote.levelTitle}</span>
              <h3 className="font-spiritual text-lg font-bold text-amber-100">درر الآباء القديسين</h3>
            </div>

            <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/40 text-stone-200 text-sm sm:text-base font-spiritual leading-relaxed shadow-inner">
              {earnedQuote.quote}
            </div>

            <span className="text-xs text-amber-300 font-bold block">
              — {earnedQuote.author}
            </span>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                onClick={() => {
                  saveQuoteToDailyMeditations(earnedQuote.quote, earnedQuote.author);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>📖 حفظ في التأملات اليومية</span>
              </button>
              <button
                onClick={() => setShowQuoteRewardModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition cursor-pointer"
              >
                إغلاق البركة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
