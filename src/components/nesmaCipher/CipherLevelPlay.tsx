import React, { useState, useEffect } from 'react';
import { NesmaCipherStage, PsychologicalQuote } from '../../types/nesmaCipher';
import { PSYCHOLOGICAL_QUOTES } from '../../data/nesmaCipherData';
import { markStageCompleted, loadCipherProgress } from '../../utils/nesmaCipherStorage';
import { hasAllThreeSecrets, GRAND_CIPHER_SECRET } from '../../data/nesmaCipherSecrets';
import { CipherGrandSecretModal } from './CipherGrandSecretModal';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Star,
  Award,
  BookOpen,
  ArrowRight,
  Sun,
  Flame,
  Volume2,
  Crown,
} from 'lucide-react';

interface CipherLevelPlayProps {
  stage: NesmaCipherStage;
  onBackToMap: () => void;
  onNextStage?: (nextStageId: number) => void;
  onOpenJournal?: () => void;
}

export const CipherLevelPlay: React.FC<CipherLevelPlayProps> = ({
  stage,
  onBackToMap,
  onNextStage,
  onOpenJournal,
}) => {
  // Gameplay states
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintCount, setHintCount] = useState<number>(0);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [isGrandSecretModalOpen, setIsGrandSecretModalOpen] = useState<boolean>(false);
  const [playerProgress, setPlayerProgress] = useState(loadCipherProgress());

  // PUZZLE 1: Image Puzzle (Stage 1 / 6 / 18 / 25)
  // 3x3 Grid of 9 tiles (represented by 0 to 8)
  const initialTiles = [1, 4, 2, 0, 7, 5, 3, 6, 8]; // Shuffled
  const [tiles, setTiles] = useState<number[]>(initialTiles);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(null);

  // PUZZLE 2: Letters Box (Stage 2 / 11 / 19 / 26)
  const availableLetters = stage.puzzleConfig?.scrambledLetters || ['ل', 'أ', 'ح', 'م', 'ت'];
  const targetWord = stage.puzzleConfig?.targetWord || 'أحل';
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  // PUZZLE 3: Sentence Order (Stage 3 / 16 / 29)
  const initialWords = stage.puzzleConfig?.shuffledWords || ['النهارده', 'مش لازم', 'كل حاجة', 'أحل'];
  const correctOrder = stage.puzzleConfig?.correctOrder || ['مش لازم', 'أحل', 'كل حاجة', 'النهارده'];
  const [currentSentenceWords, setCurrentSentenceWords] = useState<string[]>(initialWords);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  // PUZZLE 4: Breathing Flow (Stage 7 / 15 / 21)
  const [breathCycles, setBreathCycles] = useState<number>(0);
  const targetBreaths = 3;
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // PUZZLE 5: Generic Synthesis / Light Reflection (Stage 10 / 20 / 30)
  const [dialAngle, setDialAngle] = useState<number>(0);
  const [alignedMirrors, setAlignedMirrors] = useState<boolean[]>([false, false, false]);
  const [libraryPillars, setLibraryPillars] = useState<boolean[]>([false, false, false]);
  const [placedCrownJewels, setPlacedCrownJewels] = useState<number[]>([]);
  const [synthesisFeedback, setSynthesisFeedback] = useState<string>('');

  // Associated Quote (if completed)
  const associatedQuote = PSYCHOLOGICAL_QUOTES.find((q) => q.id === stage.quoteId);

  // Reset state when stage changes
  useEffect(() => {
    setIsSolved(false);
    setShowHint(false);
    setHintCount(0);
    setEarnedStars(3);
    setTiles([1, 4, 2, 0, 7, 5, 3, 6, 8]);
    setSelectedTileIndex(null);
    setSelectedLetters([]);
    setCurrentSentenceWords(stage.puzzleConfig?.shuffledWords || ['النهارده', 'مش لازم', 'كل حاجة', 'أحل']);
    setBreathCycles(0);
    setDialAngle(0);
    setAlignedMirrors([false, false, false]);
    setLibraryPillars([false, false, false]);
    setPlacedCrownJewels([]);
    setSynthesisFeedback('');
  }, [stage.id]);

  // Breathing timer
  useEffect(() => {
    if (stage.puzzleType !== 'breathing_flow' || isSolved) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        // Completed one cycle
        setBreathCycles((c) => {
          const next = c + 1;
          if (next >= targetBreaths && !isSolved) {
            handleCompleteStage();
          }
          return next;
        });
        return 'inhale';
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [stage.puzzleType, isSolved]);

  // Handle stage completion
  const handleCompleteStage = () => {
    if (isSolved) return;
    soundManager.playVictory();
    confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
    setIsSolved(true);

    const stars = hintCount > 0 ? 2 : 3;
    setEarnedStars(stars);
    const updated = markStageCompleted(stage.id, stars, 120);
    setPlayerProgress(updated);
  };

  // --- Handlers for Image Puzzle ---
  const handleTileClick = (index: number) => {
    soundManager.playTick();
    if (selectedTileIndex === null) {
      setSelectedTileIndex(index);
    } else {
      // Swap tiles
      const next = [...tiles];
      const temp = next[selectedTileIndex];
      next[selectedTileIndex] = next[index];
      next[index] = temp;
      setTiles(next);
      setSelectedTileIndex(null);

      // Check if solved (0, 1, 2, 3, 4, 5, 6, 7, 8)
      const solved = next.every((val, i) => val === i);
      if (solved) {
        handleCompleteStage();
      }
    }
  };

  // --- Handlers for Letters Box ---
  const handleAddLetter = (char: string) => {
    soundManager.playTick();
    const next = [...selectedLetters, char];
    setSelectedLetters(next);
    if (next.join('') === targetWord) {
      handleCompleteStage();
    }
  };

  const handleRemoveLastLetter = () => {
    soundManager.playTick();
    setSelectedLetters((prev) => prev.slice(0, -1));
  };

  const handleClearLetters = () => {
    soundManager.playTick();
    setSelectedLetters([]);
  };

  // --- Handlers for Sentence Order ---
  const handleWordClick = (index: number) => {
    soundManager.playTick();
    if (selectedWordIndex === null) {
      setSelectedWordIndex(index);
    } else {
      // Swap words
      const next = [...currentSentenceWords];
      const temp = next[selectedWordIndex];
      next[selectedWordIndex] = next[index];
      next[index] = temp;
      setCurrentSentenceWords(next);
      setSelectedWordIndex(null);

      // Check if matched correct order
      const matches = next.every((w, i) => w === correctOrder[i]);
      if (matches) {
        handleCompleteStage();
      }
    }
  };

  // --- Handlers for Dial / Synthesis ---
  const handleRotateDial = () => {
    soundManager.playTick();
    const nextAngle = (dialAngle + 45) % 360;
    setDialAngle(nextAngle);
    if (nextAngle === 180 || nextAngle === 0) {
      handleCompleteStage();
    }
  };

  const handleToggleMirror = (mIndex: number) => {
    soundManager.playTick();
    const next = [...alignedMirrors];
    next[mIndex] = !next[mIndex];
    setAlignedMirrors(next);
    if (next.every((val) => val === true)) {
      handleCompleteStage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-fade-in text-right font-sans" dir="rtl">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة لخريطة المغامرة</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-bold">
            {stage.worldNameAr}
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold font-mono">
            المرحلة {stage.stageNumber} من 30
          </span>
        </div>
      </div>

      {/* Main Stage Banner & Narrative Context */}
      <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-[#1a140f] to-stone-950 border-2 border-amber-600/50 p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-stone-900 border border-amber-500/30 shadow-md">
              {stage.icon}
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-100">
                {stage.titleAr}
              </h2>
              <p className="text-xs text-amber-300 font-serif mt-0.5">
                {stage.subtitleAr}
              </p>
            </div>
          </div>

          {/* Stars display */}
          <div className="flex items-center gap-1 text-amber-400 bg-stone-900/80 px-2.5 py-1 rounded-xl border border-stone-800">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-3.5 h-3.5 ${
                  idx < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Narrative Context Card */}
        <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>السياق القصصي والمشهد الحاضر:</span>
          </div>
          <p className="text-stone-200 leading-relaxed font-serif">
            {stage.narrativeIntroAr}
          </p>
        </div>

        {/* Companion 'بوصلة نسمة' Greeting & Optional Hint */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/40 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span>🕊️ همسة «بوصلة نسمة»:</span>
            </div>
            {!showHint && !isSolved && (
              <button
                onClick={() => {
                  soundManager.playTick();
                  setShowHint(true);
                  setHintCount((c) => c + 1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-600/40 text-amber-300 text-[11px] font-bold cursor-pointer transition"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>طلب تلميح لطيف</span>
              </button>
            )}
          </div>

          <p className="font-spiritual text-xs sm:text-sm text-amber-100 italic leading-relaxed">
            «{stage.companionDialogue.intro}»
          </p>

          {showHint && (
            <div className="p-3 rounded-xl bg-stone-900 border border-amber-600/30 text-amber-200 text-xs animate-fade-in flex items-start gap-2">
              <span className="text-amber-400 font-bold">💡 تلميح:</span>
              <span>{stage.companionDialogue.hint}</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE PUZZLE ARENA */}
      {/* ========================================================================= */}
      {!isSolved ? (
        <div className="rounded-3xl bg-stone-950 border-2 border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-xs text-stone-400">
            <span className="font-bold text-amber-200">
              {stage.puzzleType === 'image_puzzle'
                ? '🧩 بازل تحرر الأفكار: اضغطي على قطعتين للتبديل بينهما حتى يكتمل المشهد'
                : stage.puzzleType === 'letters_box'
                ? '🔤 صندوق الحروف: اختاري الحروف لتكوين الكلمة التي تعيد تنظيم الطاقة'
                : stage.puzzleType === 'sentence_order'
                ? '📜 ترتيب العبارة: اضغطي على كلمتين للتبديل بين ترتيبهما الصحيح'
                : stage.puzzleType === 'breathing_flow'
                ? '💧 واحة التنفس: خذي أنفاساً واعية متناغمة مع الدائرة الهادئة'
                : '✨ تحدي التركيز: اضبطي المؤشرات لتوجيه النور'}
            </span>
          </div>

          {/* 1. IMAGE PUZZLE 3x3 */}
          {stage.puzzleType === 'image_puzzle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto p-3 rounded-2xl bg-stone-900 border border-amber-600/30 shadow-inner">
                {tiles.map((tileVal, idx) => {
                  const isSelected = selectedTileIndex === idx;
                  const isCorrectPos = tileVal === idx;

                  // Aesthetic tile styling representing fragments of garden/butterflies
                  const symbols = ['🦋', '🌸', '🍃', '☀️', '💧', '🌿', '✨', '🌱', '🕊️'];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleTileClick(idx)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-2xl transition-all duration-200 border-2 cursor-pointer relative shadow-sm ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-400 scale-105'
                          : isCorrectPos
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                          : 'bg-stone-950 hover:bg-stone-800 border-stone-800 text-stone-300'
                      }`}
                    >
                      <span>{symbols[tileVal]}</span>
                      <span className="text-[9px] font-mono opacity-50 absolute bottom-1">
                        #{tileVal + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs text-stone-400">
                {selectedTileIndex !== null
                  ? 'تم تحديد القطعة الأولى.. الآن اختاري القطعة التي تريدين تبديلها معها.'
                  : 'اضغطي على أي قطعة لبدء التبديل.'}
              </div>
            </div>
          )}

          {/* 2. LETTERS BOX */}
          {stage.puzzleType === 'letters_box' && (
            <div className="space-y-6 max-w-md mx-auto text-center">
              {/* Target answer display slots */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-stone-900 border border-stone-800 min-h-[70px]">
                {selectedLetters.length === 0 ? (
                  <span className="text-xs text-stone-500">
                    اضغطي على الحروف بالأسفل لتكوين الكلمة...
                  </span>
                ) : (
                  selectedLetters.map((char, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 font-bold text-xl flex items-center justify-center shadow-md animate-scale-up"
                    >
                      {char}
                    </span>
                  ))
                )}
              </div>

              {/* Scrambled Available Letters */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {availableLetters.map((char, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => handleAddLetter(char)}
                    className="w-12 h-12 rounded-xl bg-stone-900 hover:bg-amber-600 hover:text-white border border-stone-700 text-amber-200 font-bold text-xl transition cursor-pointer shadow-md"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRemoveLastLetter}
                  disabled={selectedLetters.length === 0}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  مسح الحرف الأخير
                </button>
                <button
                  onClick={handleClearLetters}
                  disabled={selectedLetters.length === 0}
                  className="px-4 py-2 rounded-xl bg-stone-900 text-stone-400 hover:text-white border border-stone-700 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>
          )}

          {/* 3. SENTENCE ORDER */}
          {stage.puzzleType === 'sentence_order' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentSentenceWords.map((word, wIdx) => {
                  const isSelected = selectedWordIndex === wIdx;
                  const isCorrectPlace = word === correctOrder[wIdx];

                  return (
                    <button
                      key={wIdx}
                      onClick={() => handleWordClick(wIdx)}
                      className={`p-3.5 rounded-2xl border-2 transition-all font-bold text-xs sm:text-sm text-center cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-400 scale-105'
                          : isCorrectPlace
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                          : 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-200'
                      }`}
                    >
                      <span>{word}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-xs text-stone-400">
                {selectedWordIndex !== null
                  ? 'تم اختيار الكلمة.. اضغطي على الكلمة الأخرى للتبديل معها.'
                  : 'رتبي الكلمات لتشكيل المبدأ المتصالح مع طاقتك الحقيقية.'}
              </div>
            </div>
          )}

          {/* 4. BREATHING FLOW */}
          {stage.puzzleType === 'breathing_flow' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div
                  className={`w-36 h-36 rounded-full border-4 border-amber-400 flex items-center justify-center transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'scale-125 bg-amber-500/20 shadow-2xl shadow-amber-500/30'
                      : breathPhase === 'hold'
                      ? 'scale-125 bg-amber-500/30'
                      : 'scale-90 bg-stone-900/60'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-2xl">💧</span>
                    <div className="text-xs font-bold text-amber-200">
                      {breathPhase === 'inhale'
                        ? 'شهيق هادئ...'
                        : breathPhase === 'hold'
                        ? 'سكون واحتواء...'
                        : 'زفير ممتد ومريح...'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-stone-300 font-bold">
                أكملتِ {breathCycles} من {targetBreaths} دورات تنفس واعية
              </div>
            </div>
          )}

          {/* 5. STAGE 10: GARDEN MAJOR STATION (3-MIRROR LIGHT SYNTHESIS) */}
          {stage.stageNumber === 10 && (
            <div className="space-y-6 text-center max-w-md mx-auto">
              <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 space-y-4">
                <div className="text-4xl">☀️</div>
                <h4 className="text-sm font-bold text-amber-200">
                  توجيه أشعة الشمس نحو العدسة المركزية لبرج البدايات
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  اضغطي على العدسات الثلاث لضبط زاوية كل مرآة حتى يرتد النور كاملاً نحو مدخل مكتبة الأسرار:
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {[
                    'عدسة تفتيت الضباب',
                    'عدسة الخطوة الواعية',
                    'عدسة السكينة والصبر',
                  ].map((label, mIdx) => {
                    const isLit = alignedMirrors[mIdx];
                    return (
                      <button
                        key={mIdx}
                        onClick={() => {
                          soundManager.playTick();
                          const next = [...alignedMirrors];
                          next[mIdx] = !next[mIdx];
                          setAlignedMirrors(next);
                          setSynthesisFeedback('');
                        }}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                          isLit
                            ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md font-bold'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-amber-700/50'
                        }`}
                      >
                        <span className="text-xl">{isLit ? '🔆' : '🪞'}</span>
                        <span className="text-[10px]">{label}</span>
                        <span className="text-[9px] font-mono opacity-80">
                          {isLit ? 'مضبوطة ✓' : 'غير موجهة'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {synthesisFeedback && (
                  <div className="text-xs text-rose-300 font-bold bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 animate-fade-in">
                    {synthesisFeedback}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (alignedMirrors.every(Boolean)) {
                    handleCompleteStage();
                  } else {
                    soundManager.playTick();
                    setSynthesisFeedback('وجهي كافة العدسات الثلاث نحو المركز ليرتد النور كاملاً ويضيء البرج!');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                إطلاق شعاع إشراق الحديقة ☀️
              </button>
            </div>
          )}

          {/* 6. STAGE 20: LIBRARY MAJOR STATION (3 PILLARS OF EMOTIONAL WISDOM) */}
          {stage.stageNumber === 20 && (
            <div className="space-y-6 text-center max-w-md mx-auto">
              <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 space-y-4">
                <div className="text-4xl">🏰</div>
                <h4 className="text-sm font-bold text-amber-200">
                  تثبيت أركان الحكمة الثلاثة في قاعة النور
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  فعّلي الركائز الثلاث التي تعلمتِها في مكتبة الأسرار لفتح السلم الرخامي نحو كهف التفكير:
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    { title: 'ركيزة تسمية المشاعر', desc: '«مشاعري إشارات ترشدني وليست أوامر»' },
                    { title: 'ركيزة الحدود السليمة', desc: '«حدودي ليست جدراناً للخصام بل مساحات آمنة»' },
                    { title: 'ركيزة الاستحقاق الأصيل', desc: '«قيمتي جوهرية لا تتأثر بالمقارنة الخارجية»' },
                  ].map((pillar, pIdx) => {
                    const isSet = libraryPillars[pIdx];
                    return (
                      <button
                        key={pIdx}
                        onClick={() => {
                          soundManager.playTick();
                          const next = [...libraryPillars];
                          next[pIdx] = !next[pIdx];
                          setLibraryPillars(next);
                          setSynthesisFeedback('');
                        }}
                        className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-2 transition cursor-pointer ${
                          isSet
                            ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow-sm ring-1 ring-amber-400'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-amber-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-amber-300">{pillar.title}</div>
                          <div className="text-[11px] text-stone-300 font-serif">{pillar.desc}</div>
                        </div>
                        <span className="text-xl shrink-0">{isSet ? '🕯️' : '⚪'}</span>
                      </button>
                    );
                  })}
                </div>

                {synthesisFeedback && (
                  <div className="text-xs text-rose-300 font-bold bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 animate-fade-in">
                    {synthesisFeedback}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (libraryPillars.every(Boolean)) {
                    handleCompleteStage();
                  } else {
                    soundManager.playTick();
                    setSynthesisFeedback('ثبّتي الأركان الثلاثة جميعها لإنارة قاعة النور وافتتاح درج الكهف!');
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                تتويج حكمة المكتبة وإنارة البرج 🕯️
              </button>
            </div>
          )}

          {/* 7. STAGE 30: GRAND FINALE (CROWNING WITH 5 JEWELS OF TRUE AWARENESS) */}
          {stage.stageNumber === 30 && (
            <div className="space-y-6 text-center max-w-lg mx-auto">
              <div className="p-6 rounded-3xl bg-gradient-to-b from-stone-900 via-purple-950/40 to-stone-900 border-2 border-amber-400 space-y-4 shadow-xl">
                <div className="text-5xl animate-bounce">👑</div>
                <h4 className="text-base font-extrabold text-amber-100">
                  شرفة السكينة وتتويج قلادة الوعي الحقيقي
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  رتّبي الجواهر الخمس التي جمعتِها عبر العوالم الثلاثة لتتويج رحلتكِ بقلادة الوعي التام:
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    { id: 1, name: 'جوهرة تفتيت الكمالية', quote: 'مش لازم أحل كل حاجة النهارده' },
                    { id: 2, name: 'جوهرة التنظيم الانفعالي', quote: 'مشاعري إشارات ترشدني' },
                    { id: 3, name: 'جوهرة الحدود الآمنة', quote: 'حدودي مساحات آمنة ليبقى عطائي نقياً' },
                    { id: 4, name: 'جوهرة فك الارتباط', quote: 'أنا لست أفكاري؛ أنا الفضاء الواسع الهادئ' },
                    { id: 5, name: 'جوهرة التعاطف الذاتي', quote: 'أعامل نفسي كصديق حبيب يحتاج إلى رفق' },
                  ].map((jewel) => {
                    const isPlaced = placedCrownJewels.includes(jewel.id);
                    return (
                      <button
                        key={jewel.id}
                        onClick={() => {
                          soundManager.playTick();
                          setPlacedCrownJewels((prev) =>
                            prev.includes(jewel.id)
                              ? prev.filter((id) => id !== jewel.id)
                              : [...prev, jewel.id]
                          );
                          setSynthesisFeedback('');
                        }}
                        className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-3 transition cursor-pointer ${
                          isPlaced
                            ? 'bg-gradient-to-r from-amber-500/30 to-purple-500/30 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:border-amber-700/50'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-amber-300">{jewel.name}</div>
                          <div className="text-[11px] text-stone-300 font-spiritual italic">«{jewel.quote}»</div>
                        </div>
                        <span className="text-xl shrink-0">{isPlaced ? '💎' : '⚪'}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-mono text-amber-400 font-bold">
                  الجواهر الموضوعة: {placedCrownJewels.length} من 5
                </div>

                {synthesisFeedback && (
                  <div className="text-xs text-rose-300 font-bold bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 animate-fade-in">
                    {synthesisFeedback}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (placedCrownJewels.length === 5) {
                    handleCompleteStage();
                  } else {
                    soundManager.playTick();
                    setSynthesisFeedback('ضعي الجواهر الخمس جميعها في موضعها لإتمام قلادة الوعي الحقيقي!');
                  }
                }}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/30 transition cursor-pointer"
              >
                تتويج شفرة نسمة بالكامل 👑
              </button>
            </div>
          )}

          {/* 8. OTHER DIAL / MAZE / PATTERN PUZZLES */}
          {stage.stageNumber !== 10 &&
            stage.stageNumber !== 20 &&
            stage.stageNumber !== 30 &&
            stage.puzzleType !== 'image_puzzle' &&
            stage.puzzleType !== 'letters_box' &&
            stage.puzzleType !== 'sentence_order' &&
            stage.puzzleType !== 'breathing_flow' && (
              <div className="space-y-6 text-center max-w-sm mx-auto">
                <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 space-y-4">
                  <div className="text-4xl animate-spin-slow">🧭</div>
                  <p className="text-xs text-stone-300">
                    أديري البوصلة لضبط زاوية الرسوخ النفسي وتثبيت الاتجاه السليم:
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleRotateDial}
                      className="px-5 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-850 text-amber-300 border border-stone-800 text-xs font-bold transition cursor-pointer flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <span>تدوير المؤشر ({dialAngle}°)</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCompleteStage}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer"
                >
                  تأكيد اتجاه السكينة
                </button>
              </div>
            )}
        </div>
      ) : (
        /* ========================================================================= */
        /* STAGE SOLVED VICTORY & NARRATIVE OUTRO CARD */
        /* ========================================================================= */
        <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-[#1c1811] to-stone-950 border-3 border-amber-400 p-6 sm:p-9 space-y-6 shadow-2xl animate-scale-up">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-3xl border border-amber-400 shadow-lg animate-bounce">
              ✨
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-amber-100">
              اكتملت المحطة بنجاح وسلام!
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-amber-400">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${
                    idx < earnedStars ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Narrative Outro Result */}
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-emerald-500/40 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>النتيجة القصصية والأثر في البيئة:</span>
            </div>
            <p className="text-stone-100 leading-relaxed font-serif">
              {stage.narrativeOutroAr}
            </p>
          </div>

          {/* Companion Celebration Dialogue */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 space-y-1.5 text-xs sm:text-sm">
            <span className="text-amber-300 font-bold block">🕊️ احتفال «بوصلة نسمة»:</span>
            <p className="text-amber-100 font-spiritual italic leading-relaxed">
              «{stage.companionDialogue.celebration}»
            </p>
          </div>

          {/* Discovered Quote Fragment Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 via-stone-900 to-amber-900/40 border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">السر المكتشف لدربك:</span>
              <strong className="text-amber-300 text-sm font-spiritual">
                «{stage.quotePartAr}»
              </strong>
            </div>

            <div className="text-[11px] text-stone-300 bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
              {stage.scientificReferenceAr}
            </div>
          </div>

          {/* STAGE 30 FINALE: GRAND SECRET WEAVING (PHASE 8) */}
          {stage.stageNumber === 30 && (
            <div className="pt-2">
              {hasAllThreeSecrets(playerProgress.discoveredSecrets || []) ? (
                /* All 3 Secrets Discovered: Optional Grand Challenge Available */
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#241b14] via-[#21162a] to-[#12161f] border-2 border-amber-400/80 shadow-2xl space-y-4 text-right">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl p-2 rounded-2xl bg-stone-950 border border-amber-400/40">
                        🕊️
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono">
                            {GRAND_CIPHER_SECRET.badgeSymbol}
                          </span>
                          {playerProgress.unlockedGrandSecret ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              السر الأعظم مكتمل
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                              تحدٍّ اختياري متاح
                            </span>
                          )}
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-amber-100 mt-0.5">
                          {GRAND_CIPHER_SECRET.titleAr}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif">
                    لقد جمعتِ أسرار العوالم الثلاثة: ندى البدايات 💧، مخطوطة الحدود 📜، وبلورة المراقب 💎.
                    {playerProgress.unlockedGrandSecret
                      ? ' العهد الجامع محفوظ في خزانتكِ، ويمكنكِ مراجعة المشهد والتأمل في أي وقت.'
                      : ' يتجلى أمامكِ الآن تحدٍّ استنتاجي إضافي لربط الخيوط الثلاثة واكتشاف الحقيقة الشاملة والعهد الموحد.'}
                  </p>

                  <button
                    onClick={() => setIsGrandSecretModalOpen(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 fill-stone-950" />
                    <span>
                      {playerProgress.unlockedGrandSecret
                        ? 'مراجعة كشف السر الأعظم والعهد المكتمل 🕊️'
                        : 'خوض تحدي السر الأعظم: ما الذي يجمع الخيوط الثلاثة؟ ✨'}
                    </span>
                  </button>
                </div>
              ) : (
                /* Secrets Incomplete: Base game finishes smoothly, gentle guidance shown */
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1.5 text-xs text-right">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>السر الأعظم ينتظر اكتمال الخيوط الثلاثة:</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-serif">
                    أنجزتِ محطات الرحلة الثلاثين بنجاح! جمعتِ حتى الآن (
                    <strong className="text-amber-300 font-bold">
                      {playerProgress.discoveredSecrets?.length || 0} من 3
                    </strong>
                    ) من أسرار العوالم. يمكنكِ العودة إلى خريطة المغامرة في أي وقت لاستكشاف باقي الأسرار وخوض التحدي الختامي.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800">
            <button
              onClick={onBackToMap}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs transition cursor-pointer border border-stone-800"
            >
              العودة لخريطة المغامرة
            </button>

            <div className="flex items-center gap-2">
              {onOpenJournal && (
                <button
                  onClick={onOpenJournal}
                  className="px-4 py-2.5 rounded-xl bg-amber-900/70 hover:bg-amber-800 text-amber-200 font-bold text-xs transition cursor-pointer border border-amber-600/40"
                >
                  دفتر المقولات
                </button>
              )}

              {stage.stageNumber < 30 && onNextStage && (
                <button
                  onClick={() => onNextStage(stage.id + 1)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>المحطة التالية ({stage.stageNumber + 1})</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grand Secret Modal */}
      <CipherGrandSecretModal
        isOpen={isGrandSecretModalOpen}
        onClose={() => setIsGrandSecretModalOpen(false)}
        isAlreadyUnlocked={Boolean(playerProgress.unlockedGrandSecret)}
        onUnlocked={() => {
          setPlayerProgress(loadCipherProgress());
        }}
      />
    </div>
  );
};
