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
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

interface CopticMemoryGameProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface CardItem {
  uid: string;
  pairId: number;
  title: string;
  badge: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { id: 1, title: 'مارجرجس', badge: 'أمير الشهداء', icon: '⚔️' },
  { id: 2, title: 'العذراء مريم', badge: 'والدة الإله', icon: '🕊️' },
  { id: 3, title: 'الأنبا أنطونيوس', badge: 'أب الرهبان', icon: '🏔️' },
  { id: 4, title: 'الأنبا موسى الأسود', badge: 'قوي الإيمان', icon: '🛡️' },
  { id: 5, title: 'رئيس الملائكة ميخائيل', badge: 'قائد الأجناد', icon: '👑' },
  { id: 6, title: 'مارمرقس الرسول', badge: 'كاروز الديار', icon: '🦁' },
  { id: 7, title: 'الأنبا بيشوي', badge: 'الرجل الكامل', icon: '🕯️' },
  { id: 8, title: 'الشهيد أبو سيفين', badge: 'فيلوباتير', icon: '🗡️' },
  { id: 9, title: 'الأنبا كاراس السائح', badge: 'سائح البرية', icon: '🏜️' },
  { id: 10, title: 'القديس أثناسيوس', badge: 'حامي الإيمان', icon: '📜' },
];

export const CopticMemoryGame: React.FC<CopticMemoryGameProps> = ({ onBack, onSuccess }) => {
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isWin, setIsWin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Initialize Cards for Level
  const initCards = useCallback((lvl: 1 | 2 | 3) => {
    const pairCount = lvl === 1 ? 6 : lvl === 2 ? 8 : 10;
    const selectedPairs = MEMORY_PAIRS.slice(0, pairCount);

    const deck: CardItem[] = [];
    selectedPairs.forEach((pair) => {
      deck.push({
        uid: `${pair.id}-a`,
        pairId: pair.id,
        title: pair.title,
        badge: pair.badge,
        icon: pair.icon,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        uid: `${pair.id}-b`,
        pairId: pair.id,
        title: pair.title,
        badge: pair.badge,
        icon: pair.icon,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setIsWin(false);
    setIsRunning(true);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    initCards(level);
  }, [level, initCards]);

  // Timer loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && !isWin) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isWin]);

  const playSfx = (type: 'flip' | 'match' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'flip') soundManager.playTick();
      if (type === 'match') soundManager.playCorrect();
      if (type === 'win') soundManager.playCelebration();
    } catch {}
  };

  // Card Click
  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched || isWin) return;

    playSfx('flip');

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsChecking(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        setTimeout(() => {
          playSfx('match');
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsChecking(false);

          // Check Win
          if (newCards.every((c) => c.isMatched)) {
            setIsWin(true);
            setIsRunning(false);
            playSfx('win');
            try {
              confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
            } catch {}
            onSuccess(level * 80);
          }
        }, 300);
      } else {
        // Not matched, flip back after brief pause
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const matchedPairsCount = cards.filter((c) => c.isMatched).length / 2;
  const totalPairsCount = cards.length / 2;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            🃏
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              الذاكرة البصرية وبطاقات القديسين
            </h2>
            <p className="text-xs text-stone-400">
              اقلب البطاقات واكتشف الأزواج المتطابقة من القديسين والرموز الكنسية بأقل عدد حركات.
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

      {/* Control Bar */}
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
              {lvl === 1 ? 'سهل (12 بطاقة)' : lvl === 2 ? 'متوسط (16 بطاقة)' : 'متقدم (20 بطاقة)'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => initCards(level)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة الخلط</span>
        </button>

        <div className="flex items-center gap-4 font-mono text-stone-300">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{timer} ثانية</span>
          </div>
          <div>الحركات: <span className="font-bold text-amber-400">{moves}</span></div>
          <div>الأزواج: <span className="font-bold text-emerald-400">{matchedPairsCount}/{totalPairsCount}</span></div>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className="grid gap-3 sm:gap-4 p-4 sm:p-6 bg-stone-900 border-2 border-stone-800 rounded-3xl shadow-2xl justify-center"
        style={{
          gridTemplateColumns:
            level === 1
              ? 'repeat(4, minmax(70px, 1fr))'
              : level === 2
              ? 'repeat(4, minmax(70px, 1fr))'
              : 'repeat(5, minmax(65px, 1fr))',
        }}
      >
        {cards.map((card, idx) => {
          const isOpen = card.isFlipped || card.isMatched;
          return (
            <div
              key={card.uid}
              onClick={() => handleCardClick(idx)}
              className="aspect-[3/4] cursor-pointer select-none perspective-500"
            >
              <motion.div
                className="w-full h-full relative rounded-2xl transition-transform duration-300 transform-style-3d shadow-lg"
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Back of Card (Cross Pattern) */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 border-2 border-amber-600/60 flex flex-col items-center justify-center p-2 text-center shadow-md hover:border-amber-400 transition">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-lg mb-1">
                    ✝️
                  </div>
                  <span className="text-[10px] font-spiritual font-bold text-amber-300/80">
                    حسب قلب الله
                  </span>
                </div>

                {/* Front of Card (Saint & Symbol) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 flex flex-col items-center justify-between p-2.5 text-center shadow-xl ${
                    card.isMatched
                      ? 'bg-gradient-to-b from-emerald-950 to-stone-950 border-emerald-400 ring-2 ring-emerald-500/40'
                      : 'bg-gradient-to-b from-stone-800 to-stone-950 border-amber-500'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-md mt-1">{card.icon}</span>
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-spiritual font-bold text-amber-200 leading-tight">
                      {card.title}
                    </p>
                    <p className="text-[9px] text-stone-400 truncate max-w-full">
                      {card.badge}
                    </p>
                  </div>
                  {card.isMatched && (
                    <div className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500">
                      ✓ متطابق
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Win Modal */}
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
              🎉 مبارك! أكملت مطابقة بطاقات الذاكرة بالكامل
            </h3>
            <p className="text-xs text-stone-300">
              أنهيت المستوى في {timer} ثانية وبـ {moves} حركة فقط! نلت وسام قوة الذاكرة ونقاط بركة إضافية.
            </p>
            <div className="flex gap-2 justify-center pt-1">
              {level < 3 && (
                <button
                  type="button"
                  onClick={() => setLevel((l) => (l + 1) as any)}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
                >
                  الانتقال للمستوى التالي ➔
                </button>
              )}
              <button
                type="button"
                onClick={() => initCards(level)}
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

export default CopticMemoryGame;
