import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Shuffle,
  Undo2,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface TripleTileMatchGameProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface TileItem {
  uid: string;
  symbolId: string;
  name: string;
  icon: string;
  color: string;
  layer: number;
  row: number;
  col: number;
  isBlocked?: boolean;
}

const TILE_SYMBOLS = [
  { id: 'cross', name: 'الصليب القبطي', icon: '✝️', color: 'from-amber-700 to-amber-900 border-amber-500' },
  { id: 'lamp', name: 'قنديل الزيت', icon: '🪔', color: 'from-yellow-700 to-yellow-900 border-yellow-500' },
  { id: 'dove', name: 'حمامة السلام', icon: '🕊️', color: 'from-sky-700 to-sky-900 border-sky-400' },
  { id: 'censer', name: 'المجمرة والبخور', icon: '💨', color: 'from-purple-800 to-purple-950 border-purple-500' },
  { id: 'fish', name: 'سمكة الإيمان', icon: '🐟', color: 'from-teal-700 to-teal-900 border-teal-400' },
  { id: 'grapes', name: 'عنقود الكرمة', icon: '🍇', color: 'from-rose-800 to-rose-950 border-rose-500' },
  { id: 'gospel', name: 'الإنجيل المقدس', icon: '📖', color: 'from-amber-800 to-stone-900 border-amber-400' },
  { id: 'palm', name: 'سعف النخيل', icon: '🌿', color: 'from-emerald-700 to-emerald-950 border-emerald-500' },
];

const MAX_DOCK_CAPACITY = 7;

export const TripleTileMatchGame: React.FC<TripleTileMatchGameProps> = ({ onBack, onSuccess }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [boardTiles, setBoardTiles] = useState<TileItem[]>([]);
  const [dock, setDock] = useState<TileItem[]>([]);
  const [history, setHistory] = useState<{ board: TileItem[]; dock: TileItem[] }[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combos, setCombos] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Generate Board for Level
  const initLevel = useCallback((lvl: 1 | 2 | 3) => {
    // Determine symbol count and triplet sets based on level
    const symbolCount = lvl === 1 ? 4 : lvl === 2 ? 6 : 8;
    const tripletsPerSymbol = lvl === 1 ? 2 : lvl === 2 ? 3 : 4; // Total = 4*3*2 = 24 tiles (lvl 1), 6*3*3 = 54 (lvl 2)

    const chosenSymbols = TILE_SYMBOLS.slice(0, symbolCount);
    const pool: { symbolId: string; name: string; icon: string; color: string }[] = [];

    chosenSymbols.forEach((sym) => {
      for (let t = 0; t < tripletsPerSymbol * 3; t++) {
        pool.push({
          symbolId: sym.id,
          name: sym.name,
          icon: sym.icon,
          color: sym.color,
        });
      }
    });

    // Shuffle pool
    pool.sort(() => Math.random() - 0.5);

    // Place into layers (multi-tiered stack)
    const tiles: TileItem[] = [];
    const maxLayers = lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
    const gridRows = lvl === 1 ? 4 : 5;
    const gridCols = lvl === 1 ? 4 : 5;

    let poolIdx = 0;
    for (let layer = 0; layer < maxLayers && poolIdx < pool.length; layer++) {
      const itemsInThisLayer = Math.min(pool.length - poolIdx, 8 + layer * 4);
      for (let i = 0; i < itemsInThisLayer && poolIdx < pool.length; i++) {
        const item = pool[poolIdx++];
        const row = Math.floor(Math.random() * gridRows);
        const col = Math.floor(Math.random() * gridCols);
        tiles.push({
          uid: `${layer}-${row}-${col}-${poolIdx}-${Date.now()}`,
          symbolId: item.symbolId,
          name: item.name,
          icon: item.icon,
          color: item.color,
          layer,
          row,
          col,
        });
      }
    }

    setBoardTiles(tiles);
    setDock([]);
    setHistory([]);
    setIsGameOver(false);
    setIsWin(false);
    setCombos(0);
  }, []);

  useEffect(() => {
    initLevel(level);
  }, [level, initLevel]);

  // Check if tile is blocked by any higher layer tile covering its spot
  const isTileBlocked = useCallback(
    (tile: TileItem, allTiles: TileItem[]) => {
      return allTiles.some(
        (other) =>
          other.uid !== tile.uid &&
          other.layer > tile.layer &&
          Math.abs(other.row - tile.row) <= 0.6 &&
          Math.abs(other.col - tile.col) <= 0.6
      );
    },
    []
  );

  // Play Sound
  const playSfx = (type: 'tap' | 'match' | 'lose' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'tap') soundManager.playTick();
      if (type === 'match') soundManager.playCorrect();
      if (type === 'win') soundManager.playCelebration();
    } catch {}
  };

  // Handle clicking a tile on the board
  const handleTileClick = (tile: TileItem) => {
    if (isTileBlocked(tile, boardTiles) || isGameOver || isWin) return;
    if (dock.length >= MAX_DOCK_CAPACITY) return;

    playSfx('tap');

    // Save history for undo
    setHistory((prev) => [...prev.slice(-3), { board: boardTiles, dock }]);

    // Move to dock
    const remainingBoard = boardTiles.filter((t) => t.uid !== tile.uid);
    const newDock = [...dock, tile];

    // Check for 3 matching symbols in dock
    const counts: Record<string, number> = {};
    newDock.forEach((t) => {
      counts[t.symbolId] = (counts[t.symbolId] || 0) + 1;
    });

    let matchedSymbol: string | null = null;
    for (const [sym, count] of Object.entries(counts)) {
      if (count >= 3) {
        matchedSymbol = sym;
        break;
      }
    }

    if (matchedSymbol) {
      // Eliminate the 3 matching tiles with delay
      setTimeout(() => {
        playSfx('match');
        setCombos((c) => c + 1);
        setScore((s) => s + 30 * (combos + 1));

        setDock((currentDock) => {
          let removed = 0;
          return currentDock.filter((t) => {
            if (t.symbolId === matchedSymbol && removed < 3) {
              removed++;
              return false;
            }
            return true;
          });
        });
      }, 180);
    }

    setBoardTiles(remainingBoard);
    setDock(newDock);

    // Check win condition
    if (remainingBoard.length === 0) {
      setTimeout(() => {
        setIsWin(true);
        playSfx('win');
        try {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        } catch {}
        onSuccess(level * 100);
      }, 350);
    } else if (newDock.length >= MAX_DOCK_CAPACITY && !matchedSymbol) {
      setIsGameOver(true);
      playSfx('lose');
    }
  };

  // Undo last action
  const handleUndo = () => {
    if (history.length === 0) return;
    playSfx('tap');
    const last = history[history.length - 1];
    setBoardTiles(last.board);
    setDock(last.dock);
    setHistory((h) => h.slice(0, -1));
    setIsGameOver(false);
  };

  // Shuffle remaining board tiles
  const handleShuffle = () => {
    playSfx('tap');
    setBoardTiles((current) => {
      const positions = current.map((t) => ({ layer: t.layer, row: t.row, col: t.col }));
      positions.sort(() => Math.random() - 0.5);
      return current.map((t, idx) => ({
        ...t,
        layer: positions[idx].layer,
        row: positions[idx].row,
        col: positions[idx].col,
      }));
    });
  };

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            🧩
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              مطابقة الرموز الثلاثية (Triple Tile Match)
            </h2>
            <p className="text-xs text-stone-400">
              انقر على الرموز المتاحة لنقلها إلى الشريط السفلي. اجمع 3 رموز متطابقة لتفجيرها وإخلاء اللوحة.
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
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمركز</span>
          </button>
        </div>
      </div>

      {/* Control & Difficulty Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold">المستوى:</span>
          {([1, 2, 3] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                level === lvl
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {lvl === 1 ? 'مبتدئ' : lvl === 2 ? 'متوسط' : 'خبير'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white disabled:opacity-40 transition cursor-pointer font-bold"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>تراجع ({history.length})</span>
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer font-bold"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>خلط المتبقي</span>
          </button>

          <button
            type="button"
            onClick={() => initLevel(level)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة اللعب</span>
          </button>
        </div>

        <div className="flex items-center gap-4 font-mono text-stone-300">
          <div>النقاط: <span className="font-bold text-amber-400">{score}</span></div>
          <div>المتبقي: <span className="font-bold text-amber-300">{boardTiles.length}</span></div>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="relative min-h-[360px] sm:min-h-[420px] bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-stone-800 rounded-3xl p-6 sm:p-8 flex items-center justify-center shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Board Tiles Container */}
        <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
          <AnimatePresence>
            {boardTiles.map((tile) => {
              const blocked = isTileBlocked(tile, boardTiles);
              // Calculate positioning
              const leftPercent = (tile.col / 4.5) * 82 + 5;
              const topPercent = (tile.row / 4.5) * 82 + 5;
              const zIndex = tile.layer * 10 + 5;

              return (
                <motion.button
                  key={tile.uid}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => handleTileClick(tile)}
                  disabled={blocked}
                  style={{
                    position: 'absolute',
                    top: `${topPercent}%`,
                    left: `${leftPercent}%`,
                    zIndex,
                  }}
                  className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 shadow-2xl transition duration-150 flex flex-col items-center justify-center select-none ${
                    blocked
                      ? 'bg-stone-950/85 border-stone-800 opacity-60 filter brightness-50 cursor-not-allowed'
                      : 'bg-gradient-to-b from-stone-800 to-stone-950 border-amber-500/80 hover:border-amber-400 hover:-translate-y-1 hover:shadow-amber-500/20 cursor-pointer ring-1 ring-amber-500/30'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-md">{tile.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-amber-200/90 font-spiritual truncate max-w-[90%] mt-0.5">
                    {tile.name}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Win Banner Overlay */}
        {isWin && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-50 text-center"
          >
            <div className="max-w-md w-full bg-stone-900 border-2 border-emerald-500 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex justify-center gap-1 text-amber-400 text-2xl">
                <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300 font-spiritual">
                🎉 انتصار باهر! تم إخلاء اللوحة بالكامل
              </h3>
              <p className="text-xs text-stone-300">
                أكملت المستوى بنجاح وحققت {score} نقطة ونلت مكافأة التكريس!
              </p>
              <div className="flex gap-2 justify-center pt-2">
                {level < 3 && (
                  <button
                    type="button"
                    onClick={() => setLevel((l) => (l + 1) as any)}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    الانتقال للمستوى {level + 1} ➔
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => initLevel(level)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer"
                >
                  إعادة هذا المستوى
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Over Banner Overlay */}
        {isGameOver && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-50 text-center"
          >
            <div className="max-w-md w-full bg-stone-900 border-2 border-rose-500/80 rounded-3xl p-6 space-y-4 shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="text-xl font-bold text-rose-300 font-spiritual">
                امتلأ شريط التجميع!
              </h3>
              <p className="text-xs text-stone-300">
                وصلت السعة القصوى (7 خانات) دون إتمام ثلاثية متطابقة. يمكنك التراجع عن آخر حركة أو المحاولة مجدداً.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  تراجع عن آخر حركة
                </button>
                <button
                  type="button"
                  onClick={() => initLevel(level)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer"
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Holding Dock (7 slots) */}
      <div className="bg-stone-950 p-4 sm:p-5 rounded-3xl border-2 border-amber-600/40 shadow-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-spiritual font-bold text-amber-200 px-1">
          <span>شريط التجميع (الحد الأقصى: 7 خانات)</span>
          <span className="text-[11px] text-stone-400 font-sans">
            {dock.length} / {MAX_DOCK_CAPACITY}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 p-2 rounded-2xl bg-stone-900/90 border border-stone-800 min-h-[72px] sm:min-h-[84px] items-center">
          {Array.from({ length: MAX_DOCK_CAPACITY }).map((_, idx) => {
            const tile = dock[idx];
            return (
              <div
                key={idx}
                className={`aspect-[4/5] rounded-xl border-2 flex flex-col items-center justify-center transition ${
                  tile
                    ? 'bg-gradient-to-b from-stone-800 to-stone-950 border-amber-400/90 shadow-md ring-1 ring-amber-400/30'
                    : 'border-dashed border-stone-800 bg-stone-950/40'
                }`}
              >
                {tile && (
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center text-center select-none"
                  >
                    <span className="text-xl sm:text-2xl">{tile.icon}</span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-amber-300 font-spiritual truncate max-w-[90%]">
                      {tile.name}
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripleTileMatchGame;
