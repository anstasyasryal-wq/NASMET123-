import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ImageLoader } from './ImageLoader';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  ArrowRight,
  Flame,
  BookOpen,
  Grid,
  RefreshCw,
  Eye,
  Brain,
  Check,
  Play,
  Clock,
  Compass,
  Gamepad2,
  Trophy,
  Star,
  RotateCcw,
  Zap,
  HelpCircle,
  Layers,
  Heart,
  Shield,
  Search,
} from 'lucide-react';

interface MonasticAscentPuzzleProps {
  onBack: () => void;
}

type GameId = 'hub' | 'jigsaw' | 'spot_diff' | 'riddles' | 'pyramid' | 'code_breaker' | 'memory_match' | 'word_quest' | 'story_sequence';

interface GameStats {
  score: number;
  completedGames: string[];
  bestTimes: Record<string, number>;
}

const STORAGE_KEY = 'mokarasa_games_hub_state_v2';

export const MonasticAscentPuzzle: React.FC<MonasticAscentPuzzleProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<GameId>('hub');
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { score: 0, completedGames: [], bestTimes: {} };
    } catch {
      return { score: 0, completedGames: [], bestTimes: {} };
    }
  });

  const saveStats = (newScoreAdd: number, gameIdCompleted?: string) => {
    setStats((prev) => {
      const updatedScore = prev.score + newScoreAdd;
      const updatedCompleted = gameIdCompleted && !prev.completedGames.includes(gameIdCompleted)
        ? [...prev.completedGames, gameIdCompleted]
        : prev.completedGames;
      const nextState = { ...prev, score: updatedScore, completedGames: updatedCompleted };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
      } catch {}
      return nextState;
    });
  };

  // ==================== 1. JIGSAW PUZZLE STATE ====================
  const [jigsawGridSize, setJigsawGridSize] = useState<3 | 4 | 5>(3);
  const [jigsawTiles, setJigsawTiles] = useState<number[]>([]);
  const [isJigsawSolved, setIsJigsawSolved] = useState<boolean>(false);
  const [jigsawMoves, setJigsawMoves] = useState<number>(0);
  const [jigsawTimer, setJigsawTimer] = useState<number>(0);
  const [isJigsawRunning, setIsJigsawRunning] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    initJigsaw(3);
  }, []);

  useEffect(() => {
    let interval: any;
    if (activeGame === 'jigsaw' && isJigsawRunning && !isJigsawSolved) {
      interval = setInterval(() => setJigsawTimer((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, isJigsawRunning, isJigsawSolved]);

  const initJigsaw = (size: 3 | 4 | 5) => {
    setJigsawGridSize(size);
    const total = size * size;
    const arr = Array.from({ length: total }, (_, i) => i);
    let shuffled = [...arr];
    do {
      shuffled.sort(() => Math.random() - 0.5);
    } while (shuffled.every((val, idx) => val === idx));
    setJigsawTiles(shuffled);
    setIsJigsawSolved(false);
    setJigsawMoves(0);
    setJigsawTimer(0);
    setIsJigsawRunning(true);
    soundManager.playTick();
  };

  const handleTileSwap = (index: number) => {
    soundManager.playTick();
    if (!isJigsawRunning) setIsJigsawRunning(true);
    const newTiles = [...jigsawTiles];
    const temp = newTiles[0];
    newTiles[0] = newTiles[index];
    newTiles[index] = temp;
    setJigsawTiles(newTiles);
    setJigsawMoves((prev) => prev + 1);

    const winning = Array.from({ length: jigsawGridSize * jigsawGridSize }, (_, i) => i);
    if (newTiles.every((val, idx) => val === winning[idx])) {
      setIsJigsawSolved(true);
      setIsJigsawRunning(false);
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch {}
      saveStats(150, 'jigsaw');
    }
  };

  // ==================== 2. SPOT THE DIFFERENCE STATE ====================
  const [hiddenItems, setHiddenItems] = useState([
    { id: 1, name: 'الصليب الخشبي الصامت', found: false, x: 25, y: 40 },
    { id: 2, name: 'قنديل الزيت المضيء', found: false, x: 70, y: 30 },
    { id: 3, name: 'مخطوطة الأجبية المفتوحة', found: false, x: 50, y: 75 },
    { id: 4, name: 'مسبحة صلاة يسوع', found: false, x: 15, y: 80 },
  ]);

  const handleSpotItem = (id: number) => {
    soundManager.playTick();
    const updated = hiddenItems.map((item) => (item.id === id ? { ...item, found: true } : item));
    setHiddenItems(updated);
    if (updated.every((it) => it.found)) {
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 120, spread: 80 });
      } catch {}
      saveStats(100, 'spot_diff');
    }
  };

  const resetSpotDiff = () => {
    setHiddenItems(hiddenItems.map((it) => ({ ...it, found: false })));
    soundManager.playTick();
  };

  // ==================== 3. RIDDLES STATE ====================
  const [riddles, setRiddles] = useState([
    {
      id: 1,
      question: 'إذا كانت الصلاة هي مفتاح السماء، والسكوت هو سور النفس، فما هو الأساس الذي يقوم عليه البناء الروحي بأكمله؟',
      options: ['التواضع وانسحاق القلب', 'كثرة الكلام والمعرفة', 'البحث عن مديح الناس', 'الاهتمام بالأمور المادية'],
      correctAnswer: 0,
      selectedIndex: null as number | null,
      solved: false,
      hint: 'ابحث عن الفضيلة التي وصفها الآباء بأنها أساس كل الفضائل ومحط نِعم الله.',
    },
    {
      id: 2,
      question: 'تأمل التسلسل الروحي الآتي: صمت ➔ هدوء ➔ صلاة خاشعة ➔ ؟ ما هي الخطوة التالية المباشرة؟',
      options: ['الغضب وسرعة الانفعال', 'نقاوة القلب ومعاينة الله', 'التشتت والقلق', 'الانشغال بأخبار العالم'],
      correctAnswer: 1,
      selectedIndex: null as number | null,
      solved: false,
      hint: 'الغاية النهائية للجهاد الروحي هي رؤية الله بقلب طاهر نقي.',
    },
    {
      id: 3,
      question: 'أي من الوصايا التالية اعتبرها القديس أنطونيوس الكبير الحصن المنيع لحراسة الفكر ضد حروب الشياطين؟',
      options: ['الهروب من الصمت تماماً', 'مراقبة الأفكار وإمساك الحواس', 'الاعتماد على الذات فقط', 'التسليم للمشتتات'],
      correctAnswer: 1,
      selectedIndex: null as number | null,
      solved: false,
      hint: 'الحراسة اليقظة للباب الداخلي والأفكار الصاعدة.',
    },
  ]);
  const [activeHintId, setActiveHintId] = useState<number | null>(null);

  const handleAnswerRiddle = (riddleId: number, optIdx: number) => {
    soundManager.playTick();
    setRiddles((prev) =>
      prev.map((r) => {
        if (r.id === riddleId) {
          const correct = optIdx === r.correctAnswer;
          if (correct && !r.solved) {
            soundManager.playCorrect();
            try {
              confetti({ particleCount: 80, spread: 60 });
            } catch {}
            saveStats(50, `riddle_${r.id}`);
          }
          return { ...r, selectedIndex: optIdx, solved: correct };
        }
        return r;
      })
    );
  };

  // ==================== 4. VIRTUES PYRAMID STATE ====================
  const [pyramidSteps, setPyramidSteps] = useState([
    { id: 'p3', title: 'النقاوة الداخلية' },
    { id: 'p1', title: 'السكوت والصمت' },
    { id: 'p4', title: 'المحبة الإلهية الكاملة' },
    { id: 'p2', title: 'الصلاة المخدعية الخاشعة' },
  ]);
  const [selectedPyramidId, setSelectedPyramidId] = useState<string | null>(null);

  const handlePyramidClick = (id: string) => {
    soundManager.playTick();
    if (!selectedPyramidId) {
      setSelectedPyramidId(id);
    } else {
      const idx1 = pyramidSteps.findIndex((s) => s.id === selectedPyramidId);
      const idx2 = pyramidSteps.findIndex((s) => s.id === id);
      const newSteps = [...pyramidSteps];
      const temp = newSteps[idx1];
      newSteps[idx1] = newSteps[idx2];
      newSteps[idx2] = temp;
      setPyramidSteps(newSteps);
      setSelectedPyramidId(null);

      if (
        newSteps[0].id === 'p1' &&
        newSteps[1].id === 'p2' &&
        newSteps[2].id === 'p3' &&
        newSteps[3].id === 'p4'
      ) {
        soundManager.playCorrect();
        try {
          confetti({ particleCount: 100, spread: 70 });
        } catch {}
        saveStats(100, 'pyramid');
      }
    }
  };

  // ==================== 5. CODE BREAKER (رحلة الشيفرة) ====================
  const [codeSecret] = useState<string[]>(['✝️', '🕊️', '🌿', '🕯️']);
  const [codeGuesses, setCodeGuesses] = useState<string[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>(['✝️', '✝️', '✝️', '✝️']);
  const [codeSolved, setCodeSolved] = useState<boolean>(false);
  const symbolOptions = ['✝️', '🕊️', '🌿', '🕯️', '👑', '📖'];

  const handleMakeCodeGuess = () => {
    soundManager.playTick();
    const newGuesses = [...codeGuesses, currentGuess];
    setCodeGuesses(newGuesses);
    if (currentGuess.every((sym, i) => sym === codeSecret[i])) {
      setCodeSolved(true);
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 130, spread: 80 });
      } catch {}
      saveStats(120, 'code_breaker');
    }
  };

  // ==================== 6. MEMORY MATCH (الذاكرة المقدسة) ====================
  const symbolsPool = ['✝️', '🕊️', '🌿', '🕯️', '👑', '📖'];
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; symbol: string; flipped: boolean; matched: boolean }>>(() => {
    const deck = [...symbolsPool, ...symbolsPool]
      .sort(() => Math.random() - 0.5)
      .map((sym, idx) => ({ id: idx, symbol: sym, flipped: false, matched: false }));
    return deck;
  });
  const [firstFlippedCard, setFirstFlippedCard] = useState<number | null>(null);

  const handleCardClick = (id: number) => {
    soundManager.playTick();
    const card = memoryCards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const updated = memoryCards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    setMemoryCards(updated);

    if (firstFlippedCard === null) {
      setFirstFlippedCard(id);
    } else {
      const firstCard = memoryCards.find((c) => c.id === firstFlippedCard);
      if (firstCard && firstCard.symbol === card.symbol) {
        // Match
        soundManager.playCorrect();
        setMemoryCards((prev) => prev.map((c) => (c.id === id || c.id === firstFlippedCard ? { ...c, matched: true } : c)));
        setFirstFlippedCard(null);
        if (memoryCards.filter((c) => !c.matched).length <= 2) {
          try {
            confetti({ particleCount: 150, spread: 90 });
          } catch {}
          saveStats(130, 'memory_match');
        }
      } else {
        // Mismatch
        setTimeout(() => {
          setMemoryCards((prev) => prev.map((c) => (c.id === id || c.id === firstFlippedCard ? { ...c, flipped: false } : c)));
          setFirstFlippedCard(null);
        }, 800);
      }
    }
  };

  // ==================== 7. WORD QUEST (تحدّي الكلمات) ====================
  const wordStages = [
    { scrambled: 'ة ا ل ص ل ا', correct: 'الصلاة', hint: 'صلة الإنسان بالله وسر الحياة الروحية' },
    { scrambled: 'ة ب و ت', correct: 'التوبة', hint: 'الرجوع إلى حضن الآب السماوي' },
    { scrambled: 'ع و ا ت ض ت', correct: 'التواضع', hint: 'أساس كل الفضائل وتاج الجهاد' },
  ];
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [wordInput, setWordInput] = useState('');
  const [wordSolved, setWordSolved] = useState(false);

  const handleCheckWord = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playTick();
    if (wordInput.trim() === wordStages[currentWordIdx].correct) {
      setWordSolved(true);
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {}
      saveStats(80, `word_${currentWordIdx}`);
    } else {
      alert('❌ الكلمة غير صحيحة، حاول مرة أخرى.');
    }
  };

  // ==================== 8. STORY SEQUENCE (رتّب الحكاية) ====================
  const [storyCards, setStoryCards] = useState([
    { id: 's3', text: 'تأسيس الكرازة في مصر على يد مارمرقس الرسولي', correctPos: 2 },
    { id: 's1', text: 'خروج شعب الله من ارض مصر بقيادة موسى النبي', correctPos: 0 },
    { id: 's2', text: 'تجسد الكلمة الإلهي وولادة السيد المسيح في بيت لحم', correctPos: 1 },
    { id: 's4', text: 'انطلاق الرهبنة القبطية للبرية على يد الأنبا أنطونيوس', correctPos: 3 },
  ]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [storySolved, setStorySolved] = useState(false);

  const handleStoryCardClick = (id: string) => {
    soundManager.playTick();
    if (!selectedStoryId) {
      setSelectedStoryId(id);
    } else {
      const idx1 = storyCards.findIndex((c) => c.id === selectedStoryId);
      const idx2 = storyCards.findIndex((c) => c.id === id);
      const newCards = [...storyCards];
      const temp = newCards[idx1];
      newCards[idx1] = newCards[idx2];
      newCards[idx2] = temp;
      setStoryCards(newCards);
      setSelectedStoryId(null);

      if (newCards[0].id === 's1' && newCards[1].id === 's2' && newCards[2].id === 's3' && newCards[3].id === 's4') {
        setStorySolved(true);
        soundManager.playCorrect();
        try {
          confetti({ particleCount: 120, spread: 80 });
        } catch {}
        saveStats(110, 'story_sequence');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#022C22] text-stone-100 p-3 sm:p-6 font-sans selection:bg-amber-400 selection:text-amber-950" dir="rtl">
      {/* Top Navigation & Score Header */}
      <div className="max-w-5xl mx-auto flex items-center justify-between bg-stone-900/90 backdrop-blur-md border border-amber-600/40 rounded-3xl p-4 sm:p-5 shadow-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-lg border border-amber-400">
            🎮
          </div>
          <div>
            <h1 className="font-spiritual text-lg sm:text-xl font-bold text-amber-200">
              مركز ألعاب التنسك والألغاز المقدسة
            </h1>
            <p className="text-xs text-stone-300">
              تجارب تفاعلية غنية بالمعرفة والجهاد الروحي والأيقونات القبطية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center gap-2 shadow-inner">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>النقاط الكلية: {stats.score}</span>
          </div>
          {activeGame !== 'hub' && (
            <button
              onClick={() => {
                soundManager.playTick();
                setActiveGame('hub');
              }}
              className="px-4 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرئيسية</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl bg-stone-950 hover:bg-stone-900 text-amber-400 font-bold text-xs shadow transition cursor-pointer border border-stone-800 flex items-center gap-1.5"
          >
            <span>خروج للتطبيق</span>
          </button>
        </div>
      </div>

      {/* MAIN HUB VIEW */}
      {activeGame === 'hub' && (
        <main className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
          {/* Featured Banner */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-stone-900 to-amber-950 border border-amber-600/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 z-15 text-right max-w-xl">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold inline-block">
                ✨ الألعاب الأكثر تميزاً
              </span>
              <h2 className="font-spiritual text-2xl sm:text-3xl font-black text-amber-100">
                اختبر عقلك وروحك في مسابقات البركة
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                اجمع النقاط، وتدرج في سلم الفضائل، واكتشف الأسرار الخفية في بيئة ترتكز على التراث القبطي الأرثوذكسي العريق.
              </p>
            </div>
            <div className="flex flex-col gap-2 z-10 w-full sm:w-auto">
              <div className="px-4 py-3 rounded-2xl bg-stone-950/80 border border-amber-500/30 text-center font-mono">
                <span className="text-stone-400 text-[10px] block">الألعاب المكتملة</span>
                <span className="text-amber-400 text-lg font-bold">{stats.completedGames.length} / 8</span>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="space-y-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-amber-400" />
              <span>قائمة الألعاب والتحديات المقدسة</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'jigsaw', title: 'تركيب الأيقونة (Jigsaw)', desc: 'إعادة بناء الأيقونات القبطية بقطع تفاعلية ومستويات متعددة', emoji: '🧩', badge: 'تركيز وبصري' },
                { id: 'spot_diff', title: 'أسرار القلاية الصحراوية', desc: 'اكتشاف العناصر والمقتنيات المخفية بدقة داخل المشهد', emoji: '🔍', badge: 'استكشاف وتأمل' },
                { id: 'riddles', title: 'حكمة الآباء والألغاز', desc: 'أسئلة وتحديات من أقوال الآبا ء وتراث الكنيسة', emoji: '📖', badge: 'معرفة وعقيدة' },
                { id: 'pyramid', title: 'سلّم الفضائل الروحي', desc: 'ترتيب خطوات التدرج الروحي تصاعدياً', emoji: '🔺', badge: 'جهاد وسلوك' },
                { id: 'code_breaker', title: 'رحلة الشيفرة المقدسة', desc: 'استنتاج الرمز الروحي المخفي خلال محاولات محسوبة', emoji: '🔐', badge: 'منطق واستنتاج' },
                { id: 'memory_match', title: 'الذاكرة المقدسة للأيقونات', desc: 'مطابقة أزواج الأيقونات والرموز بتشويق', emoji: '🃏', badge: 'ذاكرة وتناغم' },
                { id: 'word_quest', title: 'تحدّي كلمات النعمة', desc: 'تركيب واكتشاف المفردات الروحية العربية السليمة', emoji: '✍️', badge: 'لغة ومعنى' },
                { id: 'story_sequence', title: 'رتّب الحكاية التاريخية', desc: 'ترتيب المحطات والمراطة الكتابية والتاريخية', emoji: '📜', badge: 'تاريخ وتسلسل' },
              ].map((game) => {
                const isCompleted = stats.completedGames.includes(game.id);
                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      soundManager.playTick();
                      setActiveGame(game.id as GameId);
                    }}
                    className="group relative rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/60 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
                    <div className="space-y-3 z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-3 rounded-2xl bg-stone-950 border border-amber-500/20 shadow-inner">
                          {game.emoji}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                            {game.badge}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                              ✓ مكتملة
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-spiritual text-base font-bold text-amber-100 group-hover:text-amber-300 transition">
                          {game.title}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          {game.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-amber-400 font-bold z-10">
                      <span>ابدأ التحدي</span>
                      <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* GAME 1: JIGSAW PUZZLE */}
      {activeGame === 'jigsaw' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                🧩 لعبة تركيب الأيقونة (Jigsaw Puzzle)
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                قم بترتيب القطع لإعادة بناء الأيقونة القبطية المباركة. انقر لتبديل الأماكن.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-300">المستوى:</span>
              {([3, 4, 5] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => initJigsaw(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    jigsawGridSize === sz ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {sz}×{sz}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs text-amber-300 font-mono">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>الوقت: {jigsawTimer} ثانية</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              <span>الحركات: {jigsawMoves}</span>
            </div>
            <button
              onClick={() => setShowPreviewModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 transition cursor-pointer"
            >
              معاينة الأيقونة
            </button>
          </div>

          <div className="flex justify-center py-4">
            <div
              className="grid gap-2 p-4 bg-stone-950 rounded-2xl shadow-inner max-w-md w-full aspect-square border border-stone-800"
              style={{ gridTemplateColumns: `repeat(${jigsawGridSize}, minmax(0, 1fr))` }}
            >
              {jigsawTiles.map((tileVal, idx) => {
                const isCorrect = tileVal === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTileSwap(idx)}
                    className={`relative rounded-xl font-mono text-base font-bold flex flex-col items-center justify-center transition-all cursor-pointer select-none aspect-square shadow-md ${
                      isJigsawSolved
                        ? 'bg-emerald-700 text-white border-2 border-emerald-400'
                        : isCorrect
                        ? 'bg-amber-900/60 text-amber-200 border border-amber-600'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">✝️</span>
                    <span className="text-[10px] bg-stone-950 px-2 py-0.5 rounded-full text-amber-400">
                      قطعة #{tileVal + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {isJigsawSolved && (
            <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center font-spiritual text-base animate-bounce">
              🎉 هنيئاً لك! تم إتمام البزْل بنجاح ونلت 150 نقطة بركة!
            </div>
          )}

          {showPreviewModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-stone-900 border border-amber-600 rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl animate-fade-in" dir="rtl">
                <h3 className="font-spiritual text-lg font-bold text-amber-200">معاينة الأيقونة الأصلية</h3>
                <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500">
                  <ImageLoader alt="الأيقونة القبطية الأصلية" fallbackEmoji="✝️" fallbackText="أيقونة القديسين الأبدية" />
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition cursor-pointer"
                >
                  العودة للبزْل
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: SPOT THE DIFFERENCE / HIDDEN OBJECTS */}
      {activeGame === 'spot_diff' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                🔍 اكتشاف الأسرار والتفاصيل الخفية في القلاية
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                تأمل أيقونة القلاية واكتشف العناصر المخفية بالضغط عليها بدقة.
              </p>
            </div>
            <button
              onClick={resetSpotDiff}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
            >
              إعادة الخلط
            </button>
          </div>

          <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-amber-950 via-stone-950 to-stone-900 border-2 border-amber-600/40 overflow-hidden shadow-2xl flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="text-center z-10 space-y-2 pointer-events-none">
              <span className="text-6xl">🏜️🕊️</span>
              <p className="text-xs text-amber-200 font-spiritual">قلاية الأنبا أنطونيوس في الجبل الداخلي</p>
            </div>

            {hiddenItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSpotItem(item.id)}
                style={{ top: `${item.y}%`, right: `${item.x}%` }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-lg ${
                  item.found
                    ? 'bg-emerald-600 text-white scale-110 border-2 border-emerald-300'
                    : 'bg-amber-600/90 hover:bg-amber-500 text-white animate-pulse border-2 border-amber-300'
                }`}
              >
                <span className="text-xs font-bold">{item.found ? '✓' : '❓'}</span>
                <span className="text-[11px] font-bold">{item.name}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hiddenItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                  item.found ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                <span>{item.found ? '✅' : '⏳'}</span>
                <span className="font-bold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME 3: RIDDLES */}
      {activeGame === 'riddles' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              📖 حكمة الآباء والألغاز الروحية
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              أجب عن الأسئلة الفكرية والروحية مستعيناً بالتأمل والإرشاد الآبائي.
            </p>
          </div>

          <div className="space-y-6">
            {riddles.map((riddle) => (
              <div
                key={riddle.id}
                className={`p-5 rounded-2xl border space-y-4 ${
                  riddle.solved ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-stone-950 border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-spiritual text-sm sm:text-base font-bold text-amber-100 leading-relaxed">
                    {riddle.id}. {riddle.question}
                  </h4>
                  {riddle.solved && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {riddle.options.map((opt, optIdx) => {
                    const isSelected = riddle.selectedIndex === optIdx;
                    const isCorrect = optIdx === riddle.correctAnswer;
                    let btnStyle = 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-500';
                    if (riddle.solved && isCorrect) {
                      btnStyle = 'bg-emerald-900/80 border-emerald-400 text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    }
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleAnswerRiddle(riddle.id, optIdx)}
                        className={`p-3.5 rounded-xl border text-xs font-bold transition cursor-pointer text-right flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        <span className="w-5 h-5 rounded-full border border-stone-700 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(1575 + optIdx)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeHintId === riddle.id ? (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-600/50 text-xs text-amber-200 font-spiritual">
                    💡 <strong>تلميح:</strong> {riddle.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveHintId(riddle.id)}
                    className="text-xs text-amber-400 hover:text-amber-300 underline cursor-pointer font-bold"
                  >
                    عرض تلميح إرشادي
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAME 4: VIRTUES PYRAMID */}
      {activeGame === 'pyramid' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              🔺 سلّم التدرج الروحي (رتب الفضائل من القاعدة إلى القمة)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              انقر على خطوتين لتبديل مكانيهما وترتيب الهرم الروحي بالترتيب التصاعدي الصحيح.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3 py-4">
            {pyramidSteps.map((step, idx) => {
              const isSelected = selectedPyramidId === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => handlePyramidClick(step.id)}
                  className={`w-full p-4 rounded-2xl border text-sm font-bold font-spiritual transition cursor-pointer flex items-center justify-between shadow-md ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 scale-105'
                      : 'bg-gradient-to-r from-stone-950 to-amber-950 text-amber-100 border-amber-500/30 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-mono text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <span className="text-xs bg-stone-900 px-2.5 py-1 rounded-lg text-amber-300">
                    انقر للتبديل
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* GAME 5: CODE BREAKER */}
      {activeGame === 'code_breaker' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              🔐 رحلة الشيفرة المقدسة (Code Breaker)
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              استنتج التسلسل الروحي المخفي من الرموز الأربعة خلال المحاولات المتاحة.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-3 py-4">
              {currentGuess.map((sym, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-stone-950 border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-inner">
                  {sym}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              {symbolOptions.map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    soundManager.playTick();
                    const next = [...currentGuess];
                    const firstIdx = next.findIndex((s) => s === '✝️');
                    if (firstIdx !== -1) next[firstIdx] = sym;
                    else next[0] = sym;
                    setCurrentGuess(next);
                  }}
                  className="w-12 h-12 rounded-xl bg-stone-800 hover:bg-stone-700 text-xl flex items-center justify-center border border-stone-700 cursor-pointer"
                >
                  {sym}
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleMakeCodeGuess}
                className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                تحقق من الشيفرة
              </button>
            </div>

            {codeSolved && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center font-spiritual">
                ✨ هنيئاً! لقد فككت الشيفرة الروحية بنجاح ونلت 120 نقطة!
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 6: MEMORY MATCH */}
      {activeGame === 'memory_match' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              🃏 الذاكرة المقدسة للأيقونات والرموز
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              طابق الأزواج المتشابهة باختبار ذاكرتك في أقل عدد من المحاولات.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto py-4">
            {memoryCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`h-20 rounded-2xl border flex items-center justify-center text-3xl transition-all cursor-pointer ${
                  card.flipped || card.matched
                    ? 'bg-amber-950/80 border-amber-500 shadow-inner'
                    : 'bg-stone-950 hover:bg-stone-800 border-stone-800'
                }`}
              >
                {card.flipped || card.matched ? card.symbol : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GAME 7: WORD QUEST */}
      {activeGame === 'word_quest' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              ✍️ تحدّي كلمات النعمة والمفردات الروحية
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              رتب الحروف المبعثرة لتكوين الكلمة الروحية الصحيحة.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-5 py-6 text-center">
            <div className="p-6 rounded-3xl bg-stone-950 border border-amber-500/30 space-y-3">
              <span className="text-3xl sm:text-4xl font-mono tracking-widest text-amber-300 font-bold block">
                {wordStages[currentWordIdx].scrambled}
              </span>
              <p className="text-xs text-stone-400 font-spiritual">
                💡 <strong>التلميح:</strong> {wordStages[currentWordIdx].hint}
              </p>
            </div>

            <form onSubmit={handleCheckWord} className="space-y-3">
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="اكتب الكلمة الصحيحة هنا..."
                className="w-full px-4 py-3 rounded-2xl bg-stone-950 border border-stone-800 text-stone-100 text-sm text-center focus:border-amber-400 outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                تحقق من الكلمة
              </button>
            </form>

            {wordSolved && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 font-spiritual">
                ✨ إجابة صحيحة! بوركت جهودك.
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 8: STORY SEQUENCE */}
      {activeGame === 'story_sequence' && (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/40 shadow-2xl space-y-6 animate-fade-in text-right">
          <div className="border-b border-stone-800 pb-4">
            <h3 className="font-spiritual text-lg font-bold text-amber-200">
              📜 رتّب الحكاية والمحطات التاريخية
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              انقر على أي بطاقتين لتبديل مكانيهما حتى يصبح الترتيب الزمني صحيحاً من البداية للنهاية.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-3 py-4">
            {storyCards.map((card, idx) => {
              const isSelected = selectedStoryId === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => handleStoryCardClick(card.id)}
                  className={`w-full p-4 rounded-2xl border text-xs sm:text-sm font-bold font-spiritual transition cursor-pointer flex items-center justify-between shadow-md ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 scale-105'
                      : 'bg-stone-950 text-stone-200 border-stone-800 hover:border-amber-600/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-mono text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span>{card.text}</span>
                  </div>
                  <span className="text-[10px] bg-stone-900 px-2 py-1 rounded-lg text-amber-300">
                    تبديل
                  </span>
                </button>
              );
            })}

            {storySolved && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center font-spiritual">
                🎉 ممتاز! تم ترتيب المحطات التاريخية بشكل صحيح تماماً! (+110 نقاط)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
