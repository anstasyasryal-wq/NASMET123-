import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, RotateCcw, Clock, Eye, CheckCircle2, ArrowRight } from 'lucide-react';

interface JigsawPuzzleEngineProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface PieceData {
  id: number;
  correctIndex: number;
  currentSlotIndex: number;
  imgUrl: string;
}

const COPTIC_ICONS_SVG = [
  {
    id: 'pantocrator',
    title: 'السيد المسيح ضابط الكل',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23064e3b"/><stop offset="50%" stop-color="%23022c22"/><stop offset="100%" stop-color="%2378350f"/></linearGradient><radialGradient id="halo" cx="50%" cy="40%" r="40%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="70%" stop-color="%23b45309"/><stop offset="100%" stop-color="%23064e3b"/></radialGradient></defs><rect width="500" height="500" fill="url(%23bg)"/><circle cx="250" cy="220" r="140" fill="url(%23halo)"/><circle cx="250" cy="220" r="120" fill="%23d97706" opacity="0.4"/><path d="M180 340 C180 280 320 280 320 340 L360 480 L140 480 Z" fill="%2392400e"/><path d="M210 170 Q250 130 290 170 Q305 225 250 260 Q195 225 210 170" fill="%23fef3c7"/><circle cx="230" cy="200" r="5" fill="%231c1917"/><circle cx="270" cy="200" r="5" fill="%231c1917"/><path d="M240 235 Q250 245 260 235" stroke="%2378350f" stroke-width="4" fill="none"/><text x="250" y="60" font-size="32" fill="%23fbbf24" font-family="serif" text-anchor="middle" font-weight="bold">Ο ΏΝ</text></svg>`,
  },
  {
    id: 'theotokos',
    title: 'السيدة العذراء والدة الإله',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237f1d1d"/><stop offset="50%" stop-color="%23451a03"/><stop offset="100%" stop-color="%23064e3b"/></linearGradient><radialGradient id="halo2" cx="50%" cy="40%" r="45%"><stop offset="0%" stop-color="%23fbbf24"/><stop offset="70%" stop-color="%23b45309"/><stop offset="100%" stop-color="%237f1d1d"/></radialGradient></defs><rect width="500" height="500" fill="url(%23bg2)"/><circle cx="250" cy="215" r="145" fill="url(%23halo2)"/><path d="M160 330 C160 260 340 260 340 330 L380 480 L120 480 Z" fill="%237c2d12"/><circle cx="250" cy="200" r="95" fill="%23fef3c7"/><rect x="215" y="235" width="70" height="90" fill="%23b45309" rx="12"/><text x="250" y="55" font-size="30" fill="%23fde68a" font-family="serif" text-anchor="middle" font-weight="bold">ΜΗΡ ΘΥ</text></svg>`,
  },
];

export const JigsawPuzzleEngine: React.FC<JigsawPuzzleEngineProps> = ({ onBack, onSuccess }) => {
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [selectedIconIdx, setSelectedIconIdx] = useState<number>(0);
  const [pieces, setPieces] = useState<PieceData[]>([]);
  const [slots, setSlots] = useState<(PieceData | null)[]>([]);
  const [poolPieces, setPoolPieces] = useState<PieceData[]>([]);
  const [selectedPoolPieceId, setSelectedPoolPieceId] = useState<number | null>(null);

  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fullImageUrl, setFullImageUrl] = useState<string>('');

  // Slice image using HTML5 Canvas
  useEffect(() => {
    setIsLoading(true);
    const svgString = COPTIC_ICONS_SVG[selectedIconIdx].svg;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setFullImageUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = 500;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const totalPieces = gridSize * gridSize;
      const pieceSize = size / gridSize;
      const newPieces: PieceData[] = [];

      for (let i = 0; i < totalPieces; i++) {
        const r = Math.floor(i / gridSize);
        const c = i % gridSize;

        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceSize;
        pieceCanvas.height = pieceSize;
        const pCtx = pieceCanvas.getContext('2d');
        if (pCtx) {
          pCtx.drawImage(
            canvas,
            c * pieceSize,
            r * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );
        }

        newPieces.push({
          id: i,
          correctIndex: i,
          currentSlotIndex: -1,
          imgUrl: pieceCanvas.toDataURL(),
        });
      }

      // Shuffle pieces for the pool
      const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
      setPieces(newPieces);
      setPoolPieces(shuffled);
      setSlots(Array(totalPieces).fill(null));
      setIsSolved(false);
      setMoves(0);
      setTimer(0);
      setIsRunning(true);
      setIsLoading(false);
    };

    img.src = url;
  }, [gridSize, selectedIconIdx]);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isRunning && !isSolved) {
      interval = setInterval(() => setTimer((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);

  // Handle clicking pool piece to select or place in first empty slot
  const handleSelectPoolPiece = (piece: PieceData) => {
    soundManager.playTick();
    setSelectedPoolPieceId(piece.id);
  };

  // Handle placing selected pool piece into a target slot
  const handlePlaceInSlot = (slotIdx: number) => {
    if (selectedPoolPieceId === null) return;
    soundManager.playTick();
    setMoves((m) => m + 1);

    const piece = poolPieces.find((p) => p.id === selectedPoolPieceId);
    if (!piece) return;

    const newSlots = [...slots];
    const existingInSlot = newSlots[slotIdx];

    // Remove from pool
    const newPool = poolPieces.filter((p) => p.id !== selectedPoolPieceId);
    if (existingInSlot) {
      newPool.push(existingInSlot);
    }

    newSlots[slotIdx] = piece;
    setSlots(newSlots);
    setPoolPieces(newPool);
    setSelectedPoolPieceId(null);

    // Check if solved
    if (newSlots.every((s, idx) => s !== null && s.correctIndex === idx)) {
      setIsSolved(true);
      setIsRunning(false);
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
      } catch {}
      onSuccess(150);
    }
  };

  // Return piece from slot back to pool
  const handleReturnToPool = (slotIdx: number) => {
    soundManager.playTick();
    const piece = slots[slotIdx];
    if (!piece) return;

    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);
    setPoolPieces([...poolPieces, piece]);
  };

  return (
    <div className="min-h-screen bg-[#022C22] text-stone-100 p-4 sm:p-6 font-sans selection:bg-amber-400 selection:text-amber-950" dir="rtl">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between bg-stone-900/90 backdrop-blur-md border border-amber-600/40 rounded-3xl p-4 sm:p-5 shadow-2xl mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center text-2xl shadow-lg border border-amber-400">
            🧩
          </div>
          <div>
            <h1 className="font-spiritual text-lg sm:text-xl font-bold text-amber-200">
              محرك تركيب الأيقونات المتقدم (Jigsaw Engine)
            </h1>
            <p className="text-xs text-stone-300">
              تقطيع بصري حقيقي عبر HTML5 Canvas مع سحب وإفلات وتثبيت ذكي
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمركز</span>
        </button>
      </div>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between bg-stone-900 p-4 rounded-3xl border border-stone-800 gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-400">اختر الأيقونة:</span>
            {COPTIC_ICONS_SVG.map((icon, idx) => (
              <button
                key={icon.id}
                onClick={() => setSelectedIconIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedIconIdx === idx ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {icon.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-stone-400">المستوى:</span>
            {([3, 4] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setGridSize(sz)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  gridSize === sz ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {sz}×{sz}
              </button>
            ))}
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500/30 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة الأصل</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>الوقت: {timer} ثانية</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-500" />
            <span>الحركات: {moves}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-amber-300 font-spiritual">جاري تقطيع الصورة ورسم القطع بالـ Canvas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Target Puzzle Board */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4">
              <h3 className="font-spiritual text-sm font-bold text-amber-200">لوحة التركيب المستهدفة:</h3>
              <div
                className="grid gap-1.5 p-3 bg-stone-950 rounded-2xl shadow-inner w-full aspect-square border-2 border-amber-600/40"
                style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
              >
                {slots.map((piece, slotIdx) => {
                  const isCorrectMatch = piece !== null && piece.correctIndex === slotIdx;
                  return (
                    <div
                      key={slotIdx}
                      onClick={() => handlePlaceInSlot(slotIdx)}
                      onDoubleClick={() => handleReturnToPool(slotIdx)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer flex items-center justify-center ${
                        piece === null
                          ? 'border-dashed border-stone-700 bg-stone-900/60 hover:border-amber-500 text-stone-500 text-xs font-mono'
                          : isCorrectMatch
                          ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-md'
                          : 'border-amber-500/80'
                      }`}
                    >
                      {piece === null ? (
                        <span>#{slotIdx + 1}</span>
                      ) : (
                        <motion.img
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={piece.imgUrl}
                          alt={`قطعة ${slotIdx}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-stone-400 text-center">
                انقر على قطعة من القطع المتاحة أدناه، ثم انقر على الفراغ المناسب في اللوحة لوضعها.
              </p>
            </div>

            {/* Available Pieces Pool */}
            <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-spiritual text-sm font-bold text-amber-200 mb-3">القطع المتاحة للتركيب:</h3>
                {poolPieces.length === 0 ? (
                  <div className="py-12 text-center text-emerald-400 font-spiritual font-bold text-sm">
                    ✨ تم استخدام كافة القطع في اللوحة!
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-stone-950 rounded-2xl border border-stone-800 max-h-[320px] overflow-y-auto">
                    {poolPieces.map((piece) => {
                      const isSelected = selectedPoolPieceId === piece.id;
                      return (
                        <motion.button
                          key={piece.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelectPoolPiece(piece)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition cursor-pointer shadow-md ${
                            isSelected ? 'border-amber-400 ring-4 ring-amber-500/40 scale-105' : 'border-stone-700 hover:border-amber-500'
                          }`}
                        >
                          <img src={piece.imgUrl} alt="قطعة بازل" className="w-full h-full object-cover" />
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedPoolPieceId !== null && (
                <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500 text-amber-200 text-xs text-center font-spiritual animate-pulse">
                  🎯 تم اختيار القطعة! انقر الآن على المربع الفارغ المناسب في لوحة التركيب.
                </div>
              )}

              {isSolved && (
                <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center font-spiritual text-sm animate-bounce">
                  🎉 هنيئاً لك! تم إتمام تركيب الصورة بالكامل بنجاح ونلت 150 نقطة بركة!
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-stone-900 border border-amber-600 rounded-3xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                {COPTIC_ICONS_SVG[selectedIconIdx].title}
              </h3>
              <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500">
                <img src={fullImageUrl} alt="الأيقونة الأصلية" className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-500 transition cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
