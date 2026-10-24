import React, { useState, useEffect } from 'react';
import { WorldSecret } from '../../types/nesmaCipher';
import { unlockSecret } from '../../utils/nesmaCipherStorage';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  X,
  BookOpen,
  RotateCcw,
  Award,
  ArrowRight,
  Shield,
  Lock,
} from 'lucide-react';

export interface CipherSecretModalProps {
  secret: WorldSecret | null;
  isOpen: boolean;
  isAlreadyDiscovered: boolean;
  onClose: () => void;
  onDiscovered: (secretId: string) => void;
}

export const CipherSecretModal: React.FC<CipherSecretModalProps> = ({
  secret,
  isOpen,
  isAlreadyDiscovered,
  onClose,
  onDiscovered,
}) => {
  // Common states
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | null>(null);

  // Puzzle 1 State: order_marks (Garden)
  const [orderedMarkIds, setOrderedMarkIds] = useState<string[]>([]);

  // Puzzle 2 State: connect_parchment (Library)
  const [selectedFragmentId, setSelectedFragmentId] = useState<string | null>(null);

  // Puzzle 3 State: sequence_pattern (Cave)
  const [selectedSequenceIds, setSelectedSequenceIds] = useState<string[]>([]);

  // Reset when opened or secret changes
  useEffect(() => {
    if (isOpen) {
      if (isAlreadyDiscovered) {
        setIsRevealed(true);
      } else {
        setIsRevealed(false);
      }
      setShowHint(false);
      setFeedbackMessage('');
      setFeedbackType(null);
      setOrderedMarkIds([]);
      setSelectedFragmentId(null);
      setSelectedSequenceIds([]);
    }
  }, [isOpen, isAlreadyDiscovered, secret]);

  if (!isOpen || !secret) return null;

  // Handle successful solve
  const handleSolveSuccess = () => {
    soundManager.playVictory();
    confetti({ particleCount: 55, spread: 70, origin: { y: 0.55 } });
    setIsRevealed(true);
    setFeedbackType('success');
    setFeedbackMessage(secret.interactiveChallenge.correctExplanationAr);

    // Save strictly upon puzzle completion!
    unlockSecret(secret.id);
    onDiscovered(secret.id);
  };

  // 1. Garden Puzzle Verification (order_marks)
  const handleVerifyGardenMarks = () => {
    soundManager.playTick();
    const correctOrder = secret.interactiveChallenge.correctOrderIds || ['mark_dew', 'mark_sprout'];
    if (orderedMarkIds.length < correctOrder.length) {
      setFeedbackType('error');
      setFeedbackMessage('يرجى تحديد العلامتين بالترتيب لاكتمال الدرب.');
      return;
    }

    const isMatch = orderedMarkIds.every((id, idx) => id === correctOrder[idx]);
    if (isMatch) {
      handleSolveSuccess();
    } else {
      setFeedbackType('error');
      setFeedbackMessage('الترتيب غير دقيق.. تأملي: هل يرتوي البرعم أولاً أم تتجمع قطرة الندى؟ أعيدي المحاولة.');
    }
  };

  const handleToggleGardenMark = (markId: string) => {
    soundManager.playTick();
    setFeedbackMessage('');
    if (orderedMarkIds.includes(markId)) {
      setOrderedMarkIds(orderedMarkIds.filter((id) => id !== markId));
    } else {
      setOrderedMarkIds([...orderedMarkIds, markId]);
    }
  };

  // 2. Library Puzzle Verification (connect_parchment)
  const handleVerifyLibraryParchment = () => {
    soundManager.playTick();
    if (!selectedFragmentId) {
      setFeedbackType('error');
      setFeedbackMessage('اختاري شطر المخطوطة المناسب الذي يكمل المعنى.');
      return;
    }

    const fragment = secret.interactiveChallenge.fragmentsToConnect?.find(
      (f) => f.id === selectedFragmentId
    );
    if (fragment && fragment.isCorrect) {
      handleSolveSuccess();
    } else {
      setFeedbackType('error');
      setFeedbackMessage('هذا الشطر لا ينسجم مع جوهر الحدود السليمة.. تأملي معنى استدامة العطاء وحاولي ثانية.');
    }
  };

  // 3. Cave Puzzle Verification (sequence_pattern)
  const handleVerifyCaveSequence = () => {
    soundManager.playTick();
    const correctSeq = secret.interactiveChallenge.correctSequenceIds || [
      'sym_dew',
      'sym_parchment',
      'sym_observer',
    ];

    if (selectedSequenceIds.length < correctSeq.length) {
      setFeedbackType('error');
      setFeedbackMessage(`يرجى اختيار الرموز الثلاثة بالترتيب (اخترتِ ${selectedSequenceIds.length} من 3).`);
      return;
    }

    const isMatch = selectedSequenceIds.every((id, idx) => id === correctSeq[idx]);
    if (isMatch) {
      handleSolveSuccess();
    } else {
      setFeedbackType('error');
      setFeedbackMessage('التسلسل لا يتوافق مع نمط الرحلة.. تذكري الترتيب: الحديقة أولاً، ثم المكتبة، ثم الكهف.');
    }
  };

  const handleToggleCaveSymbol = (symId: string) => {
    soundManager.playTick();
    setFeedbackMessage('');
    if (selectedSequenceIds.includes(symId)) {
      setSelectedSequenceIds(selectedSequenceIds.filter((id) => id !== symId));
    } else {
      if (selectedSequenceIds.length < 3) {
        setSelectedSequenceIds([...selectedSequenceIds, symId]);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in text-right font-sans"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-stone-950 via-[#181411] to-stone-950 border-2 border-amber-500/50 p-6 sm:p-7 shadow-2xl space-y-5 text-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button - does NOT unlock secret */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer border border-stone-800"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 border-b border-stone-800 pb-4 pr-1">
          <div className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-stone-900 border border-amber-500/40 shadow-inner">
            {isRevealed ? secret.relicIcon : secret.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold font-mono">
                {secret.worldNameAr}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-stone-900 text-stone-300 font-bold border border-stone-800">
                رمز السر: {secret.badgeSymbol}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-amber-100 mt-1">
              {secret.titleAr}
            </h3>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PHASE 1: EXPLORATION & MINI-PUZZLE (BEFORE SOLVING) */}
        {/* ========================================================================= */}
        {!isRevealed ? (
          <div className="space-y-4">
            {/* Clue description */}
            <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>الإشارة المكتشفة في معالم البيئة الحية:</span>
              </div>
              <p className="text-stone-300 leading-relaxed font-serif">
                {secret.clueHintAr}
              </p>
            </div>

            {/* Prompt & Optional Hint Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-amber-200">
                {secret.interactiveChallenge.promptAr}
              </span>
              {!showHint && (
                <button
                  onClick={() => {
                    soundManager.playTick();
                    setShowHint(true);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-850 text-amber-300 border border-amber-600/30 text-[11px] font-bold cursor-pointer transition shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>تلميح اختياري</span>
                </button>
              )}
            </div>

            {/* Optional Hint Card */}
            {showHint && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs animate-fade-in flex items-start gap-2">
                <span className="font-bold text-amber-400 shrink-0">💡 تلميح:</span>
                <p className="leading-relaxed">{secret.interactiveChallenge.hintAr}</p>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 1. GARDEN PUZZLE: ORDER MARKS */}
            {/* ------------------------------------------------------------- */}
            {secret.puzzleType === 'order_marks' && (
              <div className="space-y-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <p className="text-[11px] text-stone-400">
                  اضغطي على العلامات لتحديد تسلسلها (1 ثم 2):
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {secret.interactiveChallenge.marksToOrder?.map((mark) => {
                    const orderIdx = orderedMarkIds.indexOf(mark.id);
                    const isSelected = orderIdx !== -1;

                    return (
                      <button
                        key={mark.id}
                        onClick={() => handleToggleGardenMark(mark.id)}
                        className={`p-3.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 relative ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-300 font-bold shadow-md'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-700/60'
                        }`}
                      >
                        <span className="text-2xl">{mark.symbol}</span>
                        <span className="text-xs font-bold">{mark.labelAr}</span>
                        {isSelected && (
                          <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-stone-950 text-amber-300 text-[10px] font-mono font-bold flex items-center justify-center">
                            {orderIdx + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {orderedMarkIds.length > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-amber-300 pt-1">
                    <span>التسلسل المختار: {orderedMarkIds.length} من 2</span>
                    <button
                      onClick={() => setOrderedMarkIds([])}
                      className="text-stone-400 hover:text-stone-200 underline cursor-pointer"
                    >
                      إعادة الضبط
                    </button>
                  </div>
                )}

                <button
                  onClick={handleVerifyGardenMarks}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  تأكيد تسلسل ندى البدايات 💧
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. LIBRARY PUZZLE: CONNECT PARCHMENT FRAGMENTS */}
            {/* ------------------------------------------------------------- */}
            {secret.puzzleType === 'connect_parchment' && (
              <div className="space-y-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                {/* Ancient Lead Parchment */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border border-amber-500/40 text-center">
                  <span className="text-[10px] text-stone-400 block mb-1">شطر المخطوطة المكتشف:</span>
                  <div className="text-sm font-spiritual text-amber-200 font-bold">
                    {secret.interactiveChallenge.parchmentLeadAr}
                  </div>
                </div>

                <p className="text-[11px] text-stone-400">
                  اختاري الشطر الذي يكمل المخطوطة بمنطق الحدود الواعية:
                </p>

                <div className="space-y-2">
                  {secret.interactiveChallenge.fragmentsToConnect?.map((frag) => {
                    const isSelected = selectedFragmentId === frag.id;
                    return (
                      <button
                        key={frag.id}
                        onClick={() => {
                          soundManager.playTick();
                          setSelectedFragmentId(frag.id);
                          setFeedbackMessage('');
                        }}
                        className={`w-full p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-amber-950/70 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-700/50'
                        }`}
                      >
                        <span className="text-xs font-spiritual leading-relaxed">
                          {frag.textAr}
                        </span>
                        <span className="text-lg shrink-0">{frag.symbol}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleVerifyLibraryParchment}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  وصل شطري المخطوطة وفك السر 📜
                </button>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. CAVE PUZZLE: SEQUENCE PATTERN */}
            {/* ------------------------------------------------------------- */}
            {secret.puzzleType === 'sequence_pattern' && (
              <div className="space-y-3 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
                <p className="text-[11px] text-stone-400">
                  اضغطي على الرموز الثلاثة لترتيب مسار نمو الوعي (من البداية إلى الكهف):
                </p>

                <div className="space-y-2">
                  {secret.interactiveChallenge.patternSymbols?.map((sym) => {
                    const orderIdx = selectedSequenceIds.indexOf(sym.id);
                    const isSelected = orderIdx !== -1;

                    return (
                      <button
                        key={sym.id}
                        onClick={() => handleToggleCaveSymbol(sym.id)}
                        className={`w-full p-3 rounded-xl border text-right transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-purple-950/70 border-purple-400 text-purple-100 shadow-md ring-1 ring-purple-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-purple-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl p-1 rounded-lg bg-stone-900 border border-stone-800">
                            {sym.symbol}
                          </span>
                          <div>
                            <span className="text-xs font-bold block">{sym.nameAr}</span>
                            <span className="text-[10px] text-stone-400">{sym.originWorldAr}</span>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="w-6 h-6 rounded-full bg-purple-500 text-stone-950 text-xs font-bold font-mono flex items-center justify-center">
                            {orderIdx + 1}
                          </span>
                        ) : (
                          <span className="text-stone-600 text-xs font-mono">○</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSequenceIds.length > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-purple-300 pt-1">
                    <span>الرموز المرتبة: {selectedSequenceIds.length} من 3</span>
                    <button
                      onClick={() => setSelectedSequenceIds([])}
                      className="text-stone-400 hover:text-stone-200 underline cursor-pointer"
                    >
                      إعادة الضبط
                    </button>
                  </div>
                )}

                <button
                  onClick={handleVerifyCaveSequence}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  إيقاظ تردد بلورة المراقب الصامت 🔮
                </button>
              </div>
            )}

            {/* Feedback Message Banner */}
            {feedbackMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-bold animate-fade-in ${
                  feedbackType === 'error'
                    ? 'bg-rose-950/50 border border-rose-800/40 text-rose-300'
                    : 'bg-emerald-950/50 border border-emerald-800/40 text-emerald-300'
                }`}
              >
                {feedbackMessage}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* PHASE 2: REVELATION & RELIC ACQUIRED (SAVED IN STORAGE) */
          /* ========================================================================= */
          <div className="space-y-5 animate-scale-up">
            {/* Relic Banner */}
            <div className="text-center p-5 rounded-3xl bg-gradient-to-br from-amber-950/50 via-stone-900 to-emerald-950/50 border-2 border-amber-400/80 space-y-2 shadow-inner">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400 text-3xl flex items-center justify-center shadow-lg animate-bounce">
                {secret.relicIcon}
              </div>
              <span className="text-[10px] text-amber-400 font-bold block">
                مقتنى سري خاص أُضيف لخزانتكِ الدائمة:
              </span>
              <h4 className="text-lg font-black text-amber-100">
                «{secret.relicNameAr}»
              </h4>
            </div>

            {/* Narrative Story Revelation */}
            <div className="p-4 rounded-2xl bg-stone-900/95 border border-stone-800 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>الكشف القصصي المكتشف:</span>
              </div>
              <p className="text-stone-200 leading-relaxed font-serif">
                {secret.narrativeRevelationAr}
              </p>
            </div>

            {/* Practical Psychological Wisdom */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>البصيرة النفسية المستفادة:</span>
              </div>
              <p className="text-emerald-100 font-spiritual leading-relaxed">
                {secret.practicalWisdomAr}
              </p>
            </div>

            {/* Close / Return Button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-850 text-amber-200 font-extrabold text-xs transition border border-stone-800 cursor-pointer shadow-md"
              >
                ضم المقتنى إلى الخزانة والعودة للخريطة ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
