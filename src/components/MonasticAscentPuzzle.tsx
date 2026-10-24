import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
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
  HelpCircle,
  Brain,
  Check,
  Play,
  Clock,
  Compass,
} from 'lucide-react';

interface MonasticAscentPuzzleProps {
  onBack: () => void;
}

type PuzzleMode = 'jigsaw' | 'spot_diff' | 'logic_riddles' | 'virtues_pyramid';

export const MonasticAscentPuzzle: React.FC<MonasticAscentPuzzleProps> = ({ onBack }) => {
  const [activeMode, setActiveMode] = useState<PuzzleMode>('jigsaw');
  const [score, setScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('monastic_puzzle_score') || '0', 10);
  });

  // Jigsaw Puzzle State (3x3, 4x4, 5x5)
  const [jigsawGridSize, setJigsawGridSize] = useState<3 | 4 | 5>(3);
  const [jigsawTiles, setJigsawTiles] = useState<number[]>([]);
  const [isJigsawSolved, setIsJigsawSolved] = useState<boolean>(false);
  const [jigsawMoves, setJigsawMoves] = useState<number>(0);
  const [jigsawTimer, setJigsawTimer] = useState<number>(0);
  const [isJigsawRunning, setIsJigsawRunning] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Spot the Difference / Hidden Details State
  const [hiddenItems, setHiddenItems] = useState([
    { id: 1, name: 'الصليب الخشبي الصامت', found: false, x: 25, y: 40 },
    { id: 2, name: 'قنديل الزيت المضيء', found: false, x: 70, y: 30 },
    { id: 3, name: 'مخطوطة الأجبية المفتوحة', found: false, x: 50, y: 75 },
    { id: 4, name: 'مسبحة صلاة يسوع', found: false, x: 15, y: 80 },
  ]);
  const [spotSuccess, setSpotSuccess] = useState<boolean>(false);

  // Logical & Pattern Puzzles State
  const [logicRiddles, setLogicRiddles] = useState([
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
      hint: 'الحراسة اليقظة للباب الداخلي.',
    },
  ]);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  // Virtues & Pyramid State
  const [pyramidSteps, setPyramidSteps] = useState([
    { id: 'p3', title: 'النقاوة الداخلية', defaultPos: 2 },
    { id: 'p1', title: 'السكوت والصمت', defaultPos: 0 },
    { id: 'p4', title: 'المحبة الإلهية الكاملة', defaultPos: 3 },
    { id: 'p2', title: 'الصلاة المخدعية الخاشعة', defaultPos: 1 },
  ]);
  const [selectedPyramidId, setSelectedPyramidId] = useState<string | null>(null);

  // Initialize Jigsaw Tiles
  useEffect(() => {
    initJigsaw(3);
  }, []);

  // Timer effect for Jigsaw
  useEffect(() => {
    let interval: any;
    if (isJigsawRunning && !isJigsawSolved) {
      interval = setInterval(() => {
        setJigsawTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isJigsawRunning, isJigsawSolved]);

  const initJigsaw = (size: 3 | 4 | 5) => {
    setJigsawGridSize(size);
    const total = size * size;
    const arr = Array.from({ length: total }, (_, i) => i);
    // Shuffle ensuring it's not solved initially
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

    // Swap with first tile or adjacent
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
      const added = 150;
      const newScore = score + added;
      setScore(newScore);
      localStorage.setItem('monastic_puzzle_score', String(newScore));
      alert(`✨ مبروك! لقد أكملت بازل تركيب الأيقونة بنجاح في ${jigsawTimer} ثانية و ${jigsawMoves + 1} حركة! (+150 نقطة)`);
    }
  };

  const handleSpotItem = (id: number) => {
    soundManager.playCorrect();
    const updated = hiddenItems.map((item) => (item.id === id ? { ...item, found: true } : item));
    setHiddenItems(updated);

    if (updated.every((i) => i.found)) {
      setSpotSuccess(true);
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
      const added = 100;
      const newScore = score + added;
      setScore(newScore);
      localStorage.setItem('monastic_puzzle_score', String(newScore));
      soundManager.playCorrect();
    }
  };

  const handleAnswerRiddle = (riddleId: number, optionIdx: number) => {
    soundManager.playTick();
    const updated = logicRiddles.map((r) => {
      if (r.id === riddleId) {
        const isCorrect = optionIdx === r.correctAnswer;
        if (isCorrect) soundManager.playCorrect();
        else soundManager.playWrong();
        return { ...r, selectedIndex: optionIdx, solved: isCorrect };
      }
      return r;
    });
    setLogicRiddles(updated);

    if (updated.every((r) => r.solved)) {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch {}
      const added = 120;
      const newScore = score + added;
      setScore(newScore);
      localStorage.setItem('monastic_puzzle_score', String(newScore));
    }
  };

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
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
        const added = 100;
        const newScore = score + added;
        setScore(newScore);
        localStorage.setItem('monastic_puzzle_score', String(newScore));
        alert('✨ رائع جداً! لقد رتبت هرم التدرج الروحي للفضائل بشكل صحيح.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECE1] text-[#1E293B] p-3 sm:p-6 font-sans selection:bg-amber-300 selection:text-amber-900" dir="rtl">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-white/90 backdrop-blur-md border border-amber-600/30 rounded-2xl p-4 shadow-md mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-lg">
            🧩
          </div>
          <div>
            <h1 className="font-spiritual text-lg sm:text-xl font-black text-amber-950">
              أسرار الألغاز والتنسك الروحي
            </h1>
            <p className="text-xs text-amber-800">
              بازل الأيقونات، اكتشاف التفاصيل، والألغاز المنطقية للروح
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>النقاط: {score}</span>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { id: 'jigsaw', title: 'بازل الأيقونة (Jigsaw)', icon: Grid },
            { id: 'spot_diff', title: 'اكتشاف الأسرار الخفية', icon: Eye },
            { id: 'logic_riddles', title: 'الألغاز المنطقية والآبائية', icon: Brain },
            { id: 'virtues_pyramid', title: 'هرم الفضائل الروحي', icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playTick();
                  setActiveMode(tab.id as any);
                }}
                className={`p-3.5 rounded-2xl border transition flex flex-col items-center justify-center text-center gap-2 cursor-pointer select-none ${
                  isActive
                    ? 'bg-amber-600 text-white border-amber-400 shadow-lg scale-105'
                    : 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300/60 shadow-sm'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold font-spiritual truncate w-full">
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* MODE 1: JIGSAW PUZZLE */}
        {activeMode === 'jigsaw' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-600/30 shadow-xl space-y-6 animate-fade-in text-right">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-800/20 pb-4">
              <div>
                <h3 className="font-spiritual text-lg font-bold text-amber-950">
                  🖼️ لعبة تركيب الأيقونة (Jigsaw Puzzle)
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  قم بترتيب القطع لإعادة بناء الأيقونة القبطية المباركة. انقر على أي قطعتين لتبديل أماكتهما.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700">المستوى:</span>
                {([3, 4, 5] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => initJigsaw(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      jigsawGridSize === sz
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {sz}×{sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 font-mono">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>الوقت: {jigsawTimer} ثانية</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>الحركات: {jigsawMoves}</span>
              </div>
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 transition cursor-pointer"
              >
                معاينة الأيقونة الأصلية
              </button>
            </div>

            {/* Jigsaw Grid Board */}
            <div className="flex justify-center py-4">
              <div
                className="grid gap-2 p-4 bg-stone-900 rounded-2xl shadow-inner max-w-md w-full aspect-square"
                style={{
                  gridTemplateColumns: `repeat(${jigsawGridSize}, minmax(0, 1fr))`,
                }}
              >
                {jigsawTiles.map((tileVal, idx) => {
                  const isCorrectPos = tileVal === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleTileSwap(idx)}
                      className={`relative rounded-xl font-mono text-lg font-bold flex flex-col items-center justify-center transition-all cursor-pointer select-none aspect-square shadow-md ${
                        isJigsawSolved
                          ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                          : isCorrectPos
                          ? 'bg-amber-800/80 text-amber-200 border border-amber-600'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                      }`}
                    >
                      <span className="text-2xl mb-1">✝️</span>
                      <span className="text-xs bg-stone-950 px-2 py-0.5 rounded-full text-amber-400">
                        قطعة #{tileVal + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {isJigsawSolved && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center font-spiritual text-base animate-bounce">
                🎉 هنيئاً لك! تم إتمام البزْل بنجاح ونلت البركة والنقاط!
              </div>
            )}
          </div>
        )}

        {/* MODE 2: SPOT THE DIFFERENCE / HIDDEN DETAILS */}
        {activeMode === 'spot_diff' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-600/30 shadow-xl space-y-6 animate-fade-in text-right">
            <div className="border-b border-amber-800/20 pb-4">
              <h3 className="font-spiritual text-lg font-bold text-amber-950">
                🔍 اكتشاف الأسرار والتفاصيل الخفية في القلاية
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                تأمل أيقونة القلاية الصحراوية واكتشف العناصر والأسرار المخفية بالضغط عليها بدقة.
              </p>
            </div>

            <div className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 border-2 border-amber-600/40 overflow-hidden shadow-2xl flex items-center justify-center p-6">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Center visual background */}
              <div className="text-center z-10 space-y-2 pointer-events-none">
                <span className="text-6xl">🏜️🕊️</span>
                <p className="text-xs text-amber-200 font-spiritual">قلاية الأنبا أنطونيوس في الجبل الداخلي</p>
              </div>

              {/* Interactive Hotspots */}
              {hiddenItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSpotItem(item.id)}
                  style={{ top: `${item.y}%`, right: `${item.x}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl transition cursor-pointer flex items-center gap-1.5 shadow-lg ${
                    item.found
                      ? 'bg-emerald-600 text-white scale-110 border-2 border-emerald-300'
                      : 'bg-amber-600/80 hover:bg-amber-500 text-white animate-pulse border-2 border-amber-300'
                  }`}
                  title={item.name}
                >
                  <span className="text-xs font-bold">{item.found ? '✓' : '❓'}</span>
                  <span className="text-[11px] font-bold">{item.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-spiritual text-sm font-bold text-amber-950">العناصر المطلوب اكتشافها:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {hiddenItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                      item.found
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                        : 'bg-stone-50 border-stone-300 text-stone-700'
                    }`}
                  >
                    <span>{item.found ? '✅' : '⏳'}</span>
                    <span className="font-bold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {spotSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-900 text-center font-spiritual text-base">
                ✨ ممتاز! لقد اكتشفت كافة الأسرار والتفاصيل المخفية بنجاح! (+100 نقطة)
              </div>
            )}
          </div>
        )}

        {/* MODE 3: LOGICAL RIDDLES */}
        {activeMode === 'logic_riddles' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-600/30 shadow-xl space-y-6 animate-fade-in text-right">
            <div className="border-b border-amber-800/20 pb-4">
              <h3 className="font-spiritual text-lg font-bold text-amber-950">
                🧠 الألغاز المنطقية والآبائية
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                أجب عن الأسئلة الفكرية والروحية مستعيناً بالتأمل والإرشاد الآبائي.
              </p>
            </div>

            <div className="space-y-6">
              {logicRiddles.map((riddle) => (
                <div
                  key={riddle.id}
                  className={`p-5 rounded-2xl border space-y-4 ${
                    riddle.solved ? 'bg-emerald-50/50 border-emerald-400' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-spiritual text-sm sm:text-base font-bold text-amber-950 leading-relaxed">
                      {riddle.id}. {riddle.question}
                    </h4>
                    {riddle.solved && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {riddle.options.map((option, optIdx) => {
                      const isSelected = riddle.selectedIndex === optIdx;
                      const isCorrect = optIdx === riddle.correctAnswer;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerRiddle(riddle.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs font-bold text-right transition cursor-pointer flex items-center justify-between ${
                            riddle.solved && isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                              : isSelected && !riddle.solved
                              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                              : 'bg-white hover:bg-amber-50 text-stone-800 border-stone-300'
                          }`}
                        >
                          <span>{option}</span>
                          {riddle.solved && isCorrect && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>

                  {activeHintIndex === riddle.id ? (
                    <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-xs text-amber-900 font-spiritual">
                      💡 <strong>تلميح:</strong> {riddle.hint}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveHintIndex(riddle.id)}
                      className="text-xs text-amber-700 hover:text-amber-800 underline cursor-pointer font-bold"
                    >
                      عرض تلميح إرشادي
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 4: VIRTUES PYRAMID */}
        {activeMode === 'virtues_pyramid' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-600/30 shadow-xl space-y-6 animate-fade-in text-right">
            <div className="border-b border-amber-800/20 pb-4">
              <h3 className="font-spiritual text-lg font-bold text-amber-950">
                🔺 هرم التدرج الروحي (رتب الفضائل من القاعدة إلى القمة)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
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
                        : 'bg-gradient-to-r from-stone-900 to-amber-950 text-amber-100 border-amber-500/30 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 font-mono text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </div>
                    <span className="text-xs bg-stone-950/60 px-2.5 py-1 rounded-lg text-amber-300">
                      انقر للتبديل
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl animate-fade-in">
            <h3 className="font-spiritual text-lg font-bold text-amber-950">معاينة الأيقونة الأصلية</h3>
            <div className="w-48 h-48 mx-auto rounded-2xl bg-amber-900 text-white flex flex-col items-center justify-center text-4xl shadow-lg">
              <span>✝️</span>
              <span className="text-xs font-spiritual mt-2 text-amber-200">أيقونة القديسين الأبدية</span>
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
  );
};
