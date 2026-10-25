import React, { useState, useEffect, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Clock,
  ArrowRight,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Shield,
} from 'lucide-react';

interface MonasticMazeGameProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface ItemPos {
  r: number;
  c: number;
  name: string;
  icon: string;
  collected: boolean;
}

export const MonasticMazeGame: React.FC<MonasticMazeGameProps> = ({ onBack, onSuccess }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [gridSize, setGridSize] = useState<number>(9);
  const [maze, setMaze] = useState<number[][]>([]); // 1: wall, 0: path
  const [playerPos, setPlayerPos] = useState<{ r: number; c: number }>({ r: 1, c: 1 });
  const [goalPos, setGoalPos] = useState<{ r: number; c: number }>({ r: 7, c: 7 });
  const [items, setItems] = useState<ItemPos[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Generate Maze with DFS
  const generateMaze = useCallback((size: number) => {
    // 1: wall, 0: path
    const grid: number[][] = Array.from({ length: size }, () => Array(size).fill(1));

    // Carve paths with randomized DFS
    const carve = (r: number, c: number) => {
      grid[r][c] = 0;
      const dirs = [
        [0, 2],
        [0, -2],
        [2, 0],
        [-2, 0],
      ].sort(() => Math.random() - 0.5);

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr > 0 && nr < size - 1 && nc > 0 && nc < size - 1 && grid[nr][nc] === 1) {
          grid[r + dr / 2][c + dc / 2] = 0;
          carve(nr, nc);
        }
      }
    };

    carve(1, 1);

    // Set Start & Goal
    grid[1][1] = 0;
    const endR = size - 2;
    const endC = size - 2;
    grid[endR][endC] = 0;

    // Place 3 virtues on path
    const pathCells: { r: number; c: number }[] = [];
    for (let r = 1; r < size - 1; r++) {
      for (let c = 1; c < size - 1; c++) {
        if (grid[r][c] === 0 && !(r === 1 && c === 1) && !(r === endR && c === endC)) {
          pathCells.push({ r, c });
        }
      }
    }
    pathCells.sort(() => Math.random() - 0.5);

    const virtues: ItemPos[] = [
      { r: pathCells[0]?.r || 3, c: pathCells[0]?.c || 3, name: 'صليب الصلاة', icon: '✝️', collected: false },
      { r: pathCells[1]?.r || 5, c: pathCells[1]?.c || 5, name: 'قنديل الاستنارة', icon: '🪔', collected: false },
      { r: pathCells[2]?.r || 7, c: pathCells[2]?.c || 3, name: 'مخطوطة الحكمة', icon: '📜', collected: false },
    ];

    setGridSize(size);
    setMaze(grid);
    setPlayerPos({ r: 1, c: 1 });
    setGoalPos({ r: endR, c: endC });
    setItems(virtues);
    setSteps(0);
    setTimer(0);
    setIsWin(false);
  }, []);

  useEffect(() => {
    const size = level === 1 ? 9 : level === 2 ? 13 : 17;
    generateMaze(size);
  }, [level, generateMaze]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (!isWin) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWin]);

  const playSfx = (type: 'step' | 'collect' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'step') soundManager.playTick();
      if (type === 'collect') soundManager.playCorrect();
      if (type === 'win') soundManager.playCelebration();
    } catch {}
  };

  // Move Player
  const movePlayer = useCallback(
    (dr: number, dc: number) => {
      if (isWin) return;
      const nr = playerPos.r + dr;
      const nc = playerPos.c + dc;

      if (nr < 0 || nr >= gridSize || nc < 0 || nc >= gridSize) return;
      if (maze[nr][nc] === 1) return; // Wall

      playSfx('step');
      setSteps((s) => s + 1);
      setPlayerPos({ r: nr, c: nc });

      // Check item collection
      setItems((prev) =>
        prev.map((item) => {
          if (!item.collected && item.r === nr && item.c === nc) {
            playSfx('collect');
            return { ...item, collected: true };
          }
          return item;
        })
      );

      // Check Win (Must reach goal and have collected all 3 items)
      if (nr === goalPos.r && nc === goalPos.c) {
        setIsWin(true);
        playSfx('win');
        try {
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
        } catch {}
        onSuccess(level * 120);
      }
    },
    [playerPos, gridSize, maze, isWin, goalPos, level, onSuccess]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        movePlayer(1, 0);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const collectedCount = items.filter((it) => it.collected).length;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            🏜️
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              متاهة واحة البرية (Monastic Oasis Maze)
            </h2>
            <p className="text-xs text-stone-400">
              وجّه الراهب 🚶‍♂️ عبر دروب الصحراء، واجمع الفضائل الثلاث في طريقك للوصول إلى الدير الأثري ⛪.
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
              {lvl === 1 ? 'مبتدئ (9×9)' : lvl === 2 ? 'متوسط (13×13)' : 'خبير (17×17)'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => generateMaze(gridSize)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>توليد متاهة جديدة</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-stone-300">
          <div>الوقت: <span className="font-bold text-amber-400">{timer} ثانية</span></div>
          <div>الخطوات: <span className="font-bold text-amber-400">{steps}</span></div>
          <div>الفضائل: <span className="font-bold text-emerald-400">{collectedCount}/3</span></div>
        </div>
      </div>

      {/* Maze Grid Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Maze Board (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900 p-4 sm:p-6 rounded-3xl border border-stone-800 shadow-2xl flex items-center justify-center">
          <div
            className="grid gap-0.5 sm:gap-1 p-2 sm:p-3 bg-stone-950 rounded-2xl border-2 border-amber-600/50 shadow-inner w-full max-w-[420px] aspect-square"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
            }}
          >
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isWall = cell === 1;
                const isPlayer = playerPos.r === r && playerPos.c === c;
                const isGoal = goalPos.r === r && goalPos.c === c;
                const item = items.find((it) => it.r === r && it.c === c && !it.collected);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`rounded-[4px] sm:rounded-md flex items-center justify-center transition-all aspect-square select-none ${
                      isWall
                        ? 'bg-amber-950/80 border border-amber-900/60 shadow-inner'
                        : isPlayer
                        ? 'bg-amber-500 border border-amber-300 ring-2 ring-amber-400/50 shadow-md z-10'
                        : isGoal
                        ? 'bg-emerald-950 border border-emerald-400 ring-2 ring-emerald-500/40 animate-pulse'
                        : 'bg-stone-900/40 border border-stone-800/40'
                    }`}
                  >
                    {isPlayer ? (
                      <span className="text-sm sm:text-base animate-bounce">🚶‍♂️</span>
                    ) : isGoal ? (
                      <span className="text-sm sm:text-base">⛪</span>
                    ) : item ? (
                      <span className="text-xs sm:text-sm animate-pulse">{item.icon}</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Controls & Virtues Checklist (4 cols) */}
        <div className="lg:col-span-4 bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          {/* Virtues */}
          <div className="space-y-2">
            <h4 className="font-spiritual text-xs font-bold text-amber-200">
              الفضائل المطلوبة قبل دخول الدير:
            </h4>
            <div className="space-y-1.5">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                    it.collected
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{it.collected ? '✅' : it.icon}</span>
                    <span>{it.name}</span>
                  </div>
                  <span className="text-[10px] font-mono">{it.collected ? 'تم الجمع' : 'في الطريق'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* On-screen Touch D-Pad for Mobile */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <p className="text-[11px] text-stone-400 text-center font-bold">
              لوحة التحكم باللمس (أو الأسهم):
            </p>
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => movePlayer(-1, 0)}
                className="w-14 h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 flex items-center justify-center text-amber-300 text-xl shadow-md cursor-pointer"
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => movePlayer(0, -1)}
                  className="w-14 h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 flex items-center justify-center text-amber-300 text-xl shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => movePlayer(1, 0)}
                  className="w-14 h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 flex items-center justify-center text-amber-300 text-xl shadow-md cursor-pointer"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() => movePlayer(0, 1)}
                  className="w-14 h-14 rounded-2xl bg-stone-800 hover:bg-stone-700 active:scale-95 border border-stone-700 flex items-center justify-center text-amber-300 text-xl shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Win Banner */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-stone-900 to-amber-950/90 border-2 border-emerald-500 text-center space-y-4 shadow-2xl"
          >
            <div className="flex justify-center gap-1 text-amber-400 text-2xl">
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
              <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-emerald-200 font-spiritual">
              🎉 مبارك! وصلت إلى باب الدير الأثري بسلام
            </h3>
            <p className="text-xs text-stone-300">
              اجتزت متاهة البرية بنجاح وجمعت الفضائل خلال {steps} خطوة و {timer} ثانية، ونلت مكافأة التكريس!
            </p>
            <div className="flex gap-2 justify-center pt-1">
              {level < 3 && (
                <button
                  type="button"
                  onClick={() => setLevel((l) => (l + 1) as any)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
                >
                  الانتقال للمستوى {level + 1} ➔
                </button>
              )}
              <button
                type="button"
                onClick={() => generateMaze(gridSize)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer"
              >
                إعادة اللعب
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonasticMazeGame;
