import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { JigsawPuzzleEngine } from './JigsawPuzzleEngine';
import { TripleTileMatchGame } from './games/TripleTileMatchGame';
import { CopticMemoryGame } from './games/CopticMemoryGame';
import { SpotDifferencesGame } from './games/SpotDifferencesGame';
import { MonasticMazeGame } from './games/MonasticMazeGame';
import { ReactionFocusGame } from './games/ReactionFocusGame';
import {
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
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
  Volume2,
  VolumeX,
  Search,
} from 'lucide-react';

interface MonasticAscentPuzzleProps {
  onBack: () => void;
}

type GameId =
  | 'hub'
  | 'jigsaw'
  | 'triple_match'
  | 'memory_match'
  | 'spot_diff'
  | 'maze'
  | 'reaction'
  | 'riddles'
  | 'code_breaker';

interface GameStats {
  score: number;
  completedGames: string[];
  bestTimes: Record<string, number>;
}

const STORAGE_KEY = 'mokarasa_games_hub_state_v3';

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
      const updatedCompleted =
        gameIdCompleted && !prev.completedGames.includes(gameIdCompleted)
          ? [...prev.completedGames, gameIdCompleted]
          : prev.completedGames;
      const nextState = { ...prev, score: updatedScore, completedGames: updatedCompleted };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        // Also sync to global consecration bonus
        const curBonus = parseInt(localStorage.getItem('mokarasa_consecration_bonus') || '0', 10);
        localStorage.setItem('mokarasa_consecration_bonus', String(curBonus + newScoreAdd));
      } catch {}
      return nextState;
    });
  };

  // ==================== RIDDLES GAME STATE ====================
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
            saveStats(50, 'riddles');
          }
          return { ...r, selectedIndex: optIdx, solved: correct };
        }
        return r;
      })
    );
  };

  // ==================== CODE BREAKER GAME STATE ====================
  const targetCode = [3, 7, 1]; // Mystery spiritual code: الثالوث القدوس، أسرار الكنيسة الـ 7، الإله الواحد
  const [codeGuess, setCodeGuess] = useState<number[]>([1, 1, 1]);
  const [codeAttempts, setCodeAttempts] = useState<number>(0);
  const [codeClues, setCodeClues] = useState<string[]>([]);
  const [codeSolved, setCodeSolved] = useState<boolean>(false);

  const checkCode = () => {
    soundManager.playTick();
    const attempts = codeAttempts + 1;
    setCodeAttempts(attempts);

    let exact = 0;
    let contains = 0;

    codeGuess.forEach((digit, idx) => {
      if (digit === targetCode[idx]) exact++;
      else if (targetCode.includes(digit)) contains++;
    });

    if (exact === 3) {
      setCodeSolved(true);
      soundManager.playCelebration();
      try {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      } catch {}
      saveStats(150, 'code_breaker');
      setCodeClues((prev) => [
        `🎉 عبقري! الرمز الروحي الصحيح هو [3 - 7 - 1] (الثالوث القدوس، أسرار الكنيسة الـ 7، الإله الواحد).`,
        ...prev,
      ]);
    } else {
      setCodeClues((prev) => [
        `محاولة #${attempts}: ${codeGuess.join(' - ')} ➔ ${exact} رقم في موضعه السليم، و ${contains} رقم موجود لكن في غير موضعه.`,
        ...prev,
      ]);
    }
  };

  // Available Games Registry
  const ALL_GAMES = [
    {
      id: 'jigsaw',
      title: 'تركيب الأيقونات (Coptic Jigsaw)',
      desc: 'إعادة بناء أيقونات مارجرجس والعذراء وضابط الكل والأنبا أنطونيوس بقطع متطابقة وثلاثة مستويات',
      emoji: '🖼️',
      badge: 'تركيب وبصري',
      points: 150,
      highlight: true,
    },
    {
      id: 'triple_match',
      title: 'مطابقة الرموز الثلاثية (Triple Match)',
      desc: 'آلية مطابقة حديثة مع طبقات مكدسة وشريط تجميع ذكي وخواص تراجع وخلط لإخلاء اللوحة',
      emoji: '🧩',
      badge: 'ذكاء وتكتيك',
      points: 200,
      highlight: true,
    },
    {
      id: 'memory_match',
      title: 'الذاكرة البصرية (Coptic Memory)',
      desc: 'اقلب البطاقات ثلاثية الأبعاد لاكتشاف أزواج القديسين والرموز الكنسية في أقل وقت وحركات',
      emoji: '🃏',
      badge: 'تركيز وذاكرة',
      points: 120,
      highlight: true,
    },
    {
      id: 'spot_diff',
      title: 'اكتشاف الفروق الخمسة (Spot Diff)',
      desc: 'مقارنة مشهدين تفاعليين لاكتشاف 5 فروق دقيقة في قلاية الراهب وأيقونة مارجرجس مع تلميحات',
      emoji: '🔍',
      badge: 'قوة ملاحظة',
      points: 150,
      highlight: true,
    },
    {
      id: 'maze',
      title: 'متاهة واحة البرية (Monastic Maze)',
      desc: 'وجّه الراهب عبر مسارات صحراوية متعرجة واجمع الفضائل الثلاث للوصول إلى باب الدير الأثري',
      emoji: '🏜️',
      badge: 'مغامرة ومسارات',
      points: 180,
      highlight: true,
    },
    {
      id: 'reaction',
      title: 'سرعة البديهة والتركيز (Focus Quest)',
      desc: 'تحدي سريع ومثير مدته 30 ثانية للنقر على الفضائل وتجنب المشتتات والكسل مع متتالية مضاعفة',
      emoji: '⚡',
      badge: 'سرعة ورد فعل',
      points: 150,
      highlight: true,
    },
    {
      id: 'riddles',
      title: 'حكمة الآباء والألغاز الفكرية',
      desc: 'ألغاز كتابية وآبائية من التراث القبطي الأصيل لاختبار العمق والفهم الروحي السليم',
      emoji: '📖',
      badge: 'حكمة ومعرفة',
      points: 100,
      highlight: false,
    },
    {
      id: 'code_breaker',
      title: 'شفرة الأسرار المقدسة (Code Breaker)',
      desc: 'لغز استنتاج الأرقام الروحية الثلاثة الخفية عبر مؤشرات الدقة والاستدلال المنطقي',
      emoji: '🔐',
      badge: 'استنتاج ومنطق',
      points: 150,
      highlight: false,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 pb-24">
      {/* ==================== HUB SCREEN ==================== */}
      {activeGame === 'hub' && (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
          {/* Top Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-950 border-2 border-amber-600/40 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-right max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>مركز الألعاب والترفيه الروحي التفاعلي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-100 font-spiritual">
                ألعاب ترفيهية ذكية بآليات حديثة
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                استمتع بتركيب الأيقونات الأصلية، ومطابقة الرموز الثلاثية، وبطاقات الذاكرة ثلاثية الأبعاد، ومتاهة البرية، وسرعة البديهة في بيئة مبهجة تجمع بين المتعة الراقية والعمق القبطي.
              </p>
            </div>

            {/* Overall Score Badge */}
            <div className="flex sm:flex-col gap-3 z-10 w-full sm:w-auto shrink-0">
              <div className="px-5 py-3 rounded-2xl bg-stone-950/90 border border-amber-500/40 text-center font-mono shadow-lg flex-1 sm:flex-initial">
                <span className="text-[10px] text-stone-400 block font-sans">النقاط التراكمية</span>
                <span className="text-2xl font-black text-amber-400">{stats.score}</span>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-stone-950/90 border border-amber-500/40 text-center font-mono shadow-lg flex-1 sm:flex-initial">
                <span className="text-[10px] text-stone-400 block font-sans">الألعاب المكتملة</span>
                <span className="text-2xl font-black text-emerald-400">
                  {stats.completedGames.length} / {ALL_GAMES.length}
                </span>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-spiritual text-lg font-bold text-amber-200 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                <span>اختر اللعبة وابدأ التحدي مباشرة</span>
              </h3>
              <span className="text-xs text-stone-400">{ALL_GAMES.length} ألعاب ترفيهية متكاملة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ALL_GAMES.map((game) => {
                const isCompleted = stats.completedGames.includes(game.id);
                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      soundManager.playTick();
                      setActiveGame(game.id as GameId);
                    }}
                    className={`group relative rounded-3xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden border ${
                      game.highlight
                        ? 'bg-gradient-to-b from-stone-900 to-stone-950 border-amber-600/40 hover:border-amber-400'
                        : 'bg-stone-900 border-stone-800 hover:border-amber-500/50'
                    }`}
                  >
                    <div className="space-y-3 z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-3 rounded-2xl bg-stone-950 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                          {game.emoji}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                            {game.badge}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                              ✓ منجزة
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-spiritual text-base font-bold text-amber-100 group-hover:text-amber-300 transition">
                          {game.title}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-3">
                          {game.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-amber-400 font-bold z-10">
                      <span>العب الآن (+{game.points} نقطة)</span>
                      <span className="group-hover:-translate-x-1.5 transition-transform">←</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* ==================== 1. JIGSAW PUZZLE ENGINE ==================== */}
      {activeGame === 'jigsaw' && (
        <JigsawPuzzleEngine
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'jigsaw')}
        />
      )}

      {/* ==================== 2. TRIPLE TILE MATCH GAME ==================== */}
      {activeGame === 'triple_match' && (
        <TripleTileMatchGame
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'triple_match')}
        />
      )}

      {/* ==================== 3. COPTIC MEMORY MATCH GAME ==================== */}
      {activeGame === 'memory_match' && (
        <CopticMemoryGame
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'memory_match')}
        />
      )}

      {/* ==================== 4. SPOT THE DIFFERENCES GAME ==================== */}
      {activeGame === 'spot_diff' && (
        <SpotDifferencesGame
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'spot_diff')}
        />
      )}

      {/* ==================== 5. MONASTIC OASIS MAZE GAME ==================== */}
      {activeGame === 'maze' && (
        <MonasticMazeGame
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'maze')}
        />
      )}

      {/* ==================== 6. REACTION FOCUS QUEST GAME ==================== */}
      {activeGame === 'reaction' && (
        <ReactionFocusGame
          onBack={() => setActiveGame('hub')}
          onSuccess={(pts) => saveStats(pts, 'reaction')}
        />
      )}

      {/* ==================== 7. PATRISTIC RIDDLES GAME ==================== */}
      {activeGame === 'riddles' && (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6 animate-fade-in text-right">
          <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-4 rounded-3xl shadow-xl">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                📖 حكمة الآباء والألغاز الروحية
              </h3>
              <p className="text-xs text-stone-400">
                أجب عن الأسئلة الفكرية والروحية مستعيناً بالتأمل والإرشاد الآبائي.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveGame('hub')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمركز</span>
            </button>
          </div>

          <div className="space-y-4">
            {riddles.map((riddle) => (
              <div
                key={riddle.id}
                className={`p-5 rounded-2xl border space-y-4 shadow-xl ${
                  riddle.solved ? 'bg-emerald-950/40 border-emerald-500/60' : 'bg-stone-900 border-stone-800'
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
                    let btnStyle = 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500';
                    if (riddle.solved && isCorrect) {
                      btnStyle = 'bg-emerald-900/80 border-emerald-400 text-emerald-100 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    }
                    return (
                      <button
                        key={optIdx}
                        type="button"
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
                    type="button"
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

      {/* ==================== 8. CODE BREAKER GAME ==================== */}
      {activeGame === 'code_breaker' && (
        <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6 animate-fade-in text-right">
          <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-4 rounded-3xl shadow-xl">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-200">
                🔐 رحلة الشيفرة المقدسة (Code Breaker)
              </h3>
              <p className="text-xs text-stone-400">
                استنتج الأرقام الثلاثة الخفية (من 0 إلى 9) مستعيناً بمؤشرات الدقة في كل محاولة.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveGame('hub')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للمركز</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-6 text-center">
            <div className="flex justify-center gap-4 py-4">
              {[0, 1, 2].map((pos) => (
                <div key={pos} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setCodeGuess((prev) => {
                        const next = [...prev];
                        next[pos] = (next[pos] + 1) % 10;
                        return next;
                      });
                    }}
                    className="w-16 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                  >
                    ▲
                  </button>
                  <div className="w-16 h-20 rounded-2xl bg-stone-950 border-2 border-amber-500/60 flex items-center justify-center text-4xl font-mono font-bold text-amber-200 shadow-inner">
                    {codeGuess[pos]}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playTick();
                      setCodeGuess((prev) => {
                        const next = [...prev];
                        next[pos] = (next[pos] - 1 + 10) % 10;
                        return next;
                      });
                    }}
                    className="w-16 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold flex items-center justify-center cursor-pointer"
                  >
                    ▼
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={checkCode}
              disabled={codeSolved}
              className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm shadow-lg transition cursor-pointer"
            >
              فحص وتحقق من الشيفرة ➔
            </button>

            {/* Clues log */}
            {codeClues.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-stone-800 text-right max-h-60 overflow-y-auto">
                <span className="text-xs font-bold text-amber-300">سجل المحاولات والمؤشرات:</span>
                {codeClues.map((clue, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300"
                  >
                    {clue}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonasticAscentPuzzle;
