import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  RotateCcw,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
  Shuffle,
  Volume2,
  VolumeX,
  Layers,
  HelpCircle,
  Award,
} from 'lucide-react';

interface JigsawPuzzleEngineProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

export interface PuzzleIconItem {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  themeColor: string;
  era: string;
}

export const PUZZLE_ICONS: PuzzleIconItem[] = [
  {
    id: 'st_george',
    title: 'أيقونة الشهيد العظيم مارجرجس',
    subtitle: 'أمير الشهداء يمتطي الجواد الأبيض ويصرع التنين',
    imageSrc: '/images/icons/st_george.jpg',
    themeColor: '#059669',
    era: 'القرن الرابع الميلادي',
  },
  {
    id: 'virgin_mary',
    title: 'أيقونة العذراء والدة الإله',
    subtitle: 'القديسة مريم تحمل السيد المسيح بهالة النور الذهبية',
    imageSrc: '/images/icons/virgin_mary.jpg',
    themeColor: '#b45309',
    era: 'تراث مجمع أفسس 431 م',
  },
  {
    id: 'pantocrator',
    title: 'أيقونة السيد المسيح ضابط الكل',
    subtitle: 'المخلص الجالس على العرش يرفع يد البركة وبيده الإنجيل',
    imageSrc: '/images/icons/pantocrator.jpg',
    themeColor: '#1d4ed8',
    era: 'المدرسة القبطية البيزنطية',
  },
  {
    id: 'st_antony',
    title: 'أيقونة القديس الأنبا أنطونيوس',
    subtitle: 'أب الرهبان وكوكب البرية في جبل القلزم بالبحر الأحمر',
    imageSrc: '/images/icons/st_antony.jpg',
    themeColor: '#d97706',
    era: 'القرن الرابع الميلادي',
  },
];

export interface PieceSlot {
  id: number;
  correctRow: number;
  correctCol: number;
  correctIndex: number;
}

export interface PieceData {
  id: number;
  correctIndex: number;
  correctRow: number;
  correctCol: number;
}

export const JigsawPuzzleEngine: React.FC<JigsawPuzzleEngineProps> = ({ onBack, onSuccess }) => {
  const [selectedIconIdx, setSelectedIconIdx] = useState<number>(0);
  const [gridSize, setGridSize] = useState<3 | 4 | 5>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Puzzle Board State
  const [slots, setSlots] = useState<(PieceData | null)[]>([]);
  const [pool, setPool] = useState<PieceData[]>([]);
  const [selectedPoolPieceId, setSelectedPoolPieceId] = useState<number | null>(null);

  // Gameplay State
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showGhostGuide, setShowGhostGuide] = useState<boolean>(false);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const activeIcon = PUZZLE_ICONS[selectedIconIdx] || PUZZLE_ICONS[0];
  const totalPieces = gridSize * gridSize;

  // Initialize or re-shuffle puzzle
  const initPuzzle = useCallback((size: 3 | 4 | 5, iconIdx: number) => {
    const total = size * size;
    const allPieces: PieceData[] = [];

    for (let i = 0; i < total; i++) {
      allPieces.push({
        id: i,
        correctIndex: i,
        correctRow: Math.floor(i / size),
        correctCol: i % size,
      });
    }

    // Shuffle pool pieces
    const shuffled = [...allPieces].sort(() => Math.random() - 0.5);

    setSlots(Array(total).fill(null));
    setPool(shuffled);
    setSelectedPoolPieceId(null);
    setIsSolved(false);
    setMoves(0);
    setTimerSeconds(0);
    setIsRunning(true);
  }, []);

  // On grid size or icon change
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);

    // Preload image
    const img = new Image();
    img.src = activeIcon.imageSrc;
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
      initPuzzle(gridSize, selectedIconIdx);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
      initPuzzle(gridSize, selectedIconIdx);
    };
  }, [gridSize, selectedIconIdx, activeIcon.imageSrc, initPuzzle]);

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && !isSolved && imageLoaded) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isSolved, imageLoaded]);

  // Play sound helper
  const playSfx = (type: 'tick' | 'place' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'tick') soundManager.playTick();
      else if (type === 'place') soundManager.playTick();
      else if (type === 'win') soundManager.playCorrect();
    } catch {
      // ignore
    }
  };

  // Calculate accuracy %
  const accuracy = useMemo(() => {
    if (slots.length === 0) return 0;
    const correctCount = slots.filter((p, idx) => p !== null && p.correctIndex === idx).length;
    return Math.round((correctCount / totalPieces) * 100);
  }, [slots, totalPieces]);

  // Handle selecting a piece from the pool
  const handleSelectPoolPiece = (piece: PieceData) => {
    playSfx('tick');
    if (selectedPoolPieceId === piece.id) {
      setSelectedPoolPieceId(null);
    } else {
      setSelectedPoolPieceId(piece.id);
    }
  };

  // Handle placing the selected piece into a slot
  const handlePlaceInSlot = (slotIdx: number) => {
    if (isSolved) return;

    // If no piece is selected from pool, check if slot already has a piece
    if (selectedPoolPieceId === null) {
      const existingInSlot = slots[slotIdx];
      if (existingInSlot) {
        // Return piece back to pool
        handleReturnPieceToPool(slotIdx);
      }
      return;
    }

    const piece = pool.find((p) => p.id === selectedPoolPieceId);
    if (!piece) return;

    playSfx('place');
    setMoves((m) => m + 1);

    const newSlots = [...slots];
    const targetSlotPiece = newSlots[slotIdx];

    const newPool = pool.filter((p) => p.id !== selectedPoolPieceId);
    if (targetSlotPiece) {
      // Swap out back to pool
      newPool.push(targetSlotPiece);
    }

    newSlots[slotIdx] = piece;
    setSlots(newSlots);
    setPool(newPool);
    setSelectedPoolPieceId(null);

    // Check victory condition
    const isWin = newSlots.every((s, idx) => s !== null && s.correctIndex === idx);
    if (isWin) {
      setIsSolved(true);
      setIsRunning(false);
      playSfx('win');
      try {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981', '#3b82f6'],
        });
      } catch {}
      const points = gridSize === 3 ? 100 : gridSize === 4 ? 200 : 350;
      onSuccess(points);
    }
  };

  // Return a placed piece from board to pool
  const handleReturnPieceToPool = (slotIdx: number) => {
    const piece = slots[slotIdx];
    if (!piece || isSolved) return;

    playSfx('tick');
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setPool((prev) => [...prev, piece]);
    if (selectedPoolPieceId === piece.id) {
      setSelectedPoolPieceId(null);
    }
  };

  // Automatically solve (Developer / Hint / Demonstration tool)
  const handleSolveHint = () => {
    playSfx('tick');
    // Find the first empty or wrongly placed slot
    const wrongSlotIdx = slots.findIndex((s, idx) => s === null || s.correctIndex !== idx);
    if (wrongSlotIdx === -1) return;

    // Find the correct piece for this slot
    const correctPieceInPool = pool.find((p) => p.correctIndex === wrongSlotIdx);
    if (correctPieceInPool) {
      setSelectedPoolPieceId(correctPieceInPool.id);
      handlePlaceInSlot(wrongSlotIdx);
    } else {
      // Piece is in another slot, swap it
      const currentSlotOfPiece = slots.findIndex((s) => s?.correctIndex === wrongSlotIdx);
      if (currentSlotOfPiece !== -1) {
        handleReturnPieceToPool(currentSlotOfPiece);
      }
    }
  };

  // Calculate background position for a piece
  const getPieceBackgroundStyle = (piece: PieceData) => {
    const colPercent = (piece.correctCol / (gridSize - 1)) * 100;
    const rowPercent = (piece.correctRow / (gridSize - 1)) * 100;
    return {
      backgroundImage: `url(${activeIcon.imageSrc})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${colPercent}% ${rowPercent}%`,
      backgroundRepeat: 'no-repeat',
    };
  };

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div dir="rtl" className="max-w-5xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Top Header / Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            🖼️
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              تركيب الأيقونات القبطية (Coptic Jigsaw)
            </h2>
            <p className="text-xs text-stone-400">
              اختر أيقونة أصلية، ركّب قطع الصورة المتحركة وطابقها بدقة حتى تكتمل اللوحة بالكامل.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لمركز الألعاب</span>
          </button>
        </div>
      </div>

      {/* Icon Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PUZZLE_ICONS.map((icon, idx) => {
          const isSelected = selectedIconIdx === idx;
          return (
            <button
              key={icon.id}
              type="button"
              onClick={() => {
                if (selectedIconIdx !== idx) {
                  playSfx('tick');
                  setSelectedIconIdx(idx);
                }
              }}
              className={`p-3 rounded-2xl border text-right transition cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                  : 'bg-stone-900 border-stone-800 hover:border-amber-500/50 text-stone-300'
              }`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-700 bg-stone-950 shadow-inner">
                <img
                  src={icon.imageSrc}
                  alt={icon.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback visual indicator
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-100 truncate">{icon.title}</p>
                <p className="text-[10px] text-amber-400/80 truncate">{icon.era}</p>
              </div>
              {isSelected && (
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Control Bar: Difficulty, Stats, Previews */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs">
        {/* Difficulty Selection */}
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold">المستوى:</span>
          {([3, 4, 5] as const).map((sz) => {
            const isCurrent = gridSize === sz;
            const labels = { 3: 'سهل (3×3)', 4: 'متوسط (4×4)', 5: 'متقدم (5×5)' };
            return (
              <button
                key={sz}
                type="button"
                onClick={() => {
                  if (gridSize !== sz) {
                    playSfx('tick');
                    setGridSize(sz);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {labels[sz]}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Preview & Ghost */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGhostGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer font-bold ${
              showGhostGuide
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="إظهار صورة إرشادية خفيفة خلف لوحة التركيب"
          >
            {showGhostGuide ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showGhostGuide ? 'إخفاء الإرشاد' : 'إرشاد شفاف'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFullPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 font-bold transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة الأصل</span>
          </button>

          <button
            type="button"
            onClick={() => initPuzzle(gridSize, selectedIconIdx)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-bold transition cursor-pointer"
            title="إعادة خلط القطع"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة خلط</span>
          </button>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 text-stone-300 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{formatTime(timerSeconds)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>الحركات: {moves}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <span>الاكتمال: {accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Target Assembly Board (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="font-spiritual text-base font-bold text-amber-200">
                لوحة التركيب والتجميع ({gridSize}×{gridSize} = {totalPieces} قطعة)
              </h3>
              <p className="text-[11px] text-stone-400">
                اختر قطعة من المخزن على اليسار، ثم اضغط على المربع المناسب في هذه اللوحة لتثبيتها.
              </p>
            </div>
            {isSolved && (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                مكتملة بنجاح!
              </span>
            )}
          </div>

          {/* Board Grid Container */}
          <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-2xl overflow-hidden border-2 border-amber-600/40 bg-stone-950 shadow-inner">
            {/* Optional Ghost Guide Background */}
            {showGhostGuide && (
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `url(${activeIcon.imageSrc})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}

            {/* Slots Grid */}
            <div
              className="absolute inset-0 grid gap-1 p-1.5"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
              }}
            >
              {slots.map((piece, slotIdx) => {
                const isCorrect = piece !== null && piece.correctIndex === slotIdx;
                const isSelected = selectedPoolPieceId !== null;

                return (
                  <div
                    key={slotIdx}
                    onClick={() => handlePlaceInSlot(slotIdx)}
                    className={`relative rounded-xl overflow-hidden transition cursor-pointer flex items-center justify-center select-none ${
                      piece === null
                        ? 'border border-dashed border-stone-700/80 hover:border-amber-400/90 bg-stone-900/60 hover:bg-amber-500/10'
                        : isCorrect
                        ? 'ring-2 ring-emerald-500 border-emerald-400 shadow-md'
                        : 'ring-1 ring-amber-500/70 border-amber-600'
                    }`}
                  >
                    {piece === null ? (
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-stone-600 group-hover:text-amber-300">
                        #{slotIdx + 1}
                      </span>
                    ) : (
                      <div
                        className="w-full h-full transform transition duration-200"
                        style={getPieceBackgroundStyle(piece)}
                      >
                        {/* Lock badge on correct match */}
                        {isCorrect && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500/90 text-stone-950 flex items-center justify-center text-[10px] shadow">
                            ✓
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Instructions & Hint */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2">
            <span>💡 نصيحة: للرجوع بقطعة من اللوحة إلى المخزن، اضغط عليها مباشرة.</span>
            <button
              type="button"
              onClick={handleSolveHint}
              className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
            >
              مساعدة خطوة واحدة (تلميح)
            </button>
          </div>
        </div>

        {/* Right: Pool of Available Shuffled Pieces (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-stone-900 border border-stone-800 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
              <h3 className="font-spiritual text-base font-bold text-amber-200">
                مخزن القطع ({pool.length} قطعة متبقية)
              </h3>
              <button
                type="button"
                onClick={() => setPool((p) => [...p].sort(() => Math.random() - 0.5))}
                className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>إعادة ترتيب</span>
              </button>
            </div>

            {selectedPoolPieceId !== null && (
              <div className="p-3 mb-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-spiritual flex items-center gap-2 animate-pulse">
                <span>🎯</span>
                <span>تم تحديد قطعة! الآن اضغط على مكانها المستهدف في اللوحة.</span>
              </div>
            )}

            {pool.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="font-spiritual text-sm font-bold text-emerald-300">
                  ممتاز! تم نقل جميع القطع إلى اللوحة المستهدفة.
                </p>
                <p className="text-xs text-stone-400">
                  تأكد من مطابقة جميع القطع مع الأصل لإعلان الفوز.
                </p>
              </div>
            ) : (
              <div
                className="grid gap-2 p-3 bg-stone-950 rounded-2xl border border-stone-800 max-h-[440px] overflow-y-auto"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(75px, 1fr))',
                }}
              >
                {pool.map((piece) => {
                  const isSelected = selectedPoolPieceId === piece.id;
                  return (
                    <button
                      key={piece.id}
                      type="button"
                      onClick={() => handleSelectPoolPiece(piece)}
                      className={`relative aspect-square rounded-xl overflow-hidden transition cursor-pointer shadow-md transform ${
                        isSelected
                          ? 'ring-4 ring-amber-400 border-2 border-white scale-105 z-10'
                          : 'border border-stone-700 hover:border-amber-400 hover:scale-102'
                      }`}
                    >
                      <div className="w-full h-full" style={getPieceBackgroundStyle(piece)} />
                      <div className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/60 text-[9px] font-mono text-stone-300">
                        #{piece.id + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Victory Card */}
          {isSolved && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-amber-950/80 border border-emerald-500/60 text-center space-y-3 animate-fade-in shadow-xl">
              <div className="flex justify-center gap-1 text-amber-400 text-xl">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <h4 className="font-spiritual text-base font-bold text-emerald-200">
                🎉 مبارك! تم تركيب الأيقونة بالكامل بنجاح
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed">
                أنجزت بازل «{activeIcon.title}» في {formatTime(timerSeconds)} وخلال {moves} حركة!
                نلت بركة مضاعفة ونقاط تفوق تم تسجيلها برصيدك.
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const nextIconIdx = (selectedIconIdx + 1) % PUZZLE_ICONS.length;
                    setSelectedIconIdx(nextIconIdx);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md cursor-pointer"
                >
                  الانتقال للأيقونة التالية ➔
                </button>
                <button
                  type="button"
                  onClick={() => initPuzzle(gridSize, selectedIconIdx)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition cursor-pointer"
                >
                  إعادة اللعب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-stone-900 border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="space-y-1">
                <h3 className="font-spiritual text-lg font-bold text-amber-300">
                  {activeIcon.title}
                </h3>
                <p className="text-xs text-stone-400">{activeIcon.subtitle}</p>
              </div>

              <div className="w-72 h-72 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl bg-stone-950">
                <img
                  src={activeIcon.imageSrc}
                  alt={activeIcon.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-amber-200/90 font-spiritual">
                تأمل في تفاصيل الأيقونة وألوانها وهالاتها النورانية قبل مواصلة التركيب.
              </p>

              <button
                type="button"
                onClick={() => setShowFullPreview(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
              >
                إغلاق والعودة للتركيب
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JigsawPuzzleEngine;
