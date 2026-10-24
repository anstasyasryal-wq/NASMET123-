import React, { useState } from 'react';
import { GRAND_CIPHER_SECRET } from '../../data/nesmaCipherSecrets';
import { unlockGrandSecret } from '../../utils/nesmaCipherStorage';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  X,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Heart,
  Shield,
  Eye,
  Crown,
} from 'lucide-react';

interface CipherGrandSecretModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
  isAlreadyUnlocked?: boolean;
}

export const CipherGrandSecretModal: React.FC<CipherGrandSecretModalProps> = ({
  isOpen,
  onClose,
  onUnlocked,
  isAlreadyUnlocked = false,
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    GRAND_CIPHER_SECRET.threads[0].id
  );
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSolved, setHasSolved] = useState<boolean>(isAlreadyUnlocked);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'puzzle' | 'revelation'>(
    isAlreadyUnlocked ? 'revelation' : 'puzzle'
  );

  if (!isOpen) return null;

  const activeThread =
    GRAND_CIPHER_SECRET.threads.find((t) => t.id === selectedThreadId) ||
    GRAND_CIPHER_SECRET.threads[0];

  const handleSelectOption = (optionId: string) => {
    soundManager.playTick();
    setSelectedOptionId(optionId);
    setErrorMessage(null);
  };

  const handleSubmitDeduction = () => {
    if (!selectedOptionId) {
      soundManager.playWrong();
      setErrorMessage('يرجى اختيار الاستنتاج الذي ترينه يجمع الخيوط الثلاثة أولاً.');
      return;
    }

    const chosen = GRAND_CIPHER_SECRET.weavingChallenge.options.find(
      (o) => o.id === selectedOptionId
    );

    if (chosen?.isCorrect) {
      soundManager.playVictory();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#8b5cf6', '#e0e7ff'],
      });

      unlockGrandSecret();
      setHasSolved(true);
      setViewMode('revelation');
      setErrorMessage(null);
      if (onUnlocked) {
        onUnlocked();
      }
    } else {
      soundManager.playWrong();
      setErrorMessage(
        chosen?.feedbackAr ||
          'هذا الاستنتاج غير متطابق مع تكامل الأسرار الثلاثة. تأملي كيف يدعم الرفق والحدود والمراقبة بعضها البعض.'
      );
    }
  };

  const handleResetChallenge = () => {
    soundManager.playTick();
    setSelectedOptionId(null);
    setErrorMessage(null);
    setViewMode('puzzle');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in text-right font-sans"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-stone-950 via-[#1a1612] to-[#120f18] border-2 border-amber-400/60 p-6 sm:p-8 shadow-2xl space-y-6 text-stone-200 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer border border-stone-800"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-stone-800 pb-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-400/50 text-2xl shadow-inner">
            🕊️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30 font-mono">
                {GRAND_CIPHER_SECRET.badgeSymbol} تتويج أسرار العوالم الثلاثة
              </span>
              {isAlreadyUnlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  مكتشف في الخزانة
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-100 mt-1">
              {GRAND_CIPHER_SECRET.titleAr}
            </h2>
          </div>
        </div>

        {/* Mode Toggle (if already solved) */}
        {hasSolved && (
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs font-bold">
            <button
              onClick={() => setViewMode('revelation')}
              className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                viewMode === 'revelation'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>الكشف والعهد الأعظم</span>
            </button>
            <button
              onClick={() => setViewMode('puzzle')}
              className={`flex-1 py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                viewMode === 'puzzle'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>مراجعة نول الخيوط والاستنتاج</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 1: THE WEAVING CHALLENGE & DEDUCTION */}
        {/* ========================================================================= */}
        {viewMode === 'puzzle' && (
          <div className="space-y-6">
            {/* Context Subtitle */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-serif">
              لقد اجتزتِ عوالم الرحلة وجمعتِ أسرارها الثلاثة. اضغطي على كل خيط لمعاينة
              جوهره، ثم استنتجي الحقيقة الشاملة التي تؤلف بينها:
            </p>

            {/* The 3 Relic Threads Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {GRAND_CIPHER_SECRET.threads.map((thread) => {
                const isSelected = selectedThreadId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedThreadId(thread.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/70 to-stone-900 border-amber-400 text-amber-100 ring-1 ring-amber-400 shadow-md'
                        : 'bg-stone-900/70 border-stone-800 hover:border-amber-700/50 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-1.5 rounded-xl bg-stone-950 border border-stone-800">
                        {thread.symbol}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {thread.worldNameAr}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-xs font-black block">
                        {thread.relicNameAr}
                      </span>
                      <span className="text-[11px] text-amber-300/90 block leading-tight">
                        «{thread.truthCoreAr}»
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Thread Essence Focus Box */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>بصيرة {activeThread.relicNameAr}:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif">
                {activeThread.revelationAr}
              </p>
            </div>

            {/* Deductive Synthesis Question */}
            <div className="p-5 rounded-2xl bg-stone-950 border border-purple-500/30 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] text-purple-300 font-bold block flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>تحدي الاستنتاج والربط:</span>
                </span>
                <p className="text-xs sm:text-sm text-stone-200 font-bold leading-relaxed">
                  {GRAND_CIPHER_SECRET.weavingChallenge.deductionQuestionAr}
                </p>
              </div>

              {/* Deduction Radio/Button Options */}
              <div className="space-y-2.5 pt-2">
                {GRAND_CIPHER_SECRET.weavingChallenge.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      className={`w-full p-3.5 rounded-2xl border text-right transition cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-400 text-amber-100 ring-1 ring-amber-400'
                          : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 text-stone-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 flex items-center justify-center border ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400 text-stone-950'
                            : 'border-stone-600 bg-stone-950'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                      </div>
                      <span className="text-xs sm:text-sm leading-relaxed font-serif">
                        {option.textAr}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Error / Hint Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-200 leading-relaxed animate-shake">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 text-xs font-bold transition cursor-pointer border border-stone-800"
              >
                إغلاق مؤقتاً
              </button>

              <button
                onClick={handleSubmitDeduction}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-600/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>تأكيد الربط وفك السر الأعظم ✨</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW MODE 2: CULMINATING NARRATIVE SCENE & GRAND COVENANT */}
        {/* ========================================================================= */}
        {viewMode === 'revelation' && (
          <div className="space-y-6 text-center animate-fade-in">
            {/* Relic Showcase */}
            <div className="space-y-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-emerald-500/20 text-amber-300 flex items-center justify-center text-4xl border-2 border-amber-400/60 shadow-xl animate-pulse">
                {GRAND_CIPHER_SECRET.relicIcon}
              </div>
              <span className="text-xs font-bold text-amber-400 block font-mono">
                تكاملت الخيوط الثلاثة بنجاح
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-100">
                «{GRAND_CIPHER_SECRET.relicNameAr}»
              </h3>
            </div>

            {/* Warm, Non-Preachy Narrative Scene */}
            <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 border border-amber-500/40 text-right space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الكشف المكتمل: ما الذي يجمع الخيوط الثلاثة؟</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-serif">
                {GRAND_CIPHER_SECRET.unifiedRevelationAr}
              </p>
            </div>

            {/* The 3 Synthesized Pillars Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-right">
              <div className="p-3 rounded-2xl bg-stone-950 border border-cyan-500/30 space-y-1">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" /> 💧 الرفق بالنفس
                </span>
                <p className="text-[11px] text-stone-300">التربة الخصبة للبدء دون قسوة أو شتات.</p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-amber-500/30 space-y-1">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> 📜 حكمة الحدود
                </span>
                <p className="text-[11px] text-stone-300">السياج الآمن لصون المحبة ونقاء العطاء.</p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-purple-500/30 space-y-1">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> 💎 فضاء المراقبة
                </span>
                <p className="text-[11px] text-stone-300">الأفق الواسع الذي يشهد العواصف بسلام.</p>
              </div>
            </div>

            {/* Grand Covenant */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-amber-950/60 border border-amber-400/50 space-y-1.5 text-center">
              <span className="text-[11px] text-amber-300 font-bold block">
                🕊️ العهد الداخلي المستدام:
              </span>
              <p className="text-xs sm:text-sm font-spiritual text-amber-100 leading-relaxed font-bold">
                {GRAND_CIPHER_SECRET.grandCovenantAr}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
              <button
                onClick={handleResetChallenge}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-300 text-xs font-bold transition cursor-pointer border border-stone-800 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>إعادة قراءة الاستنتاج</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>حفظ في خزانة المقتنيات والعودة للخريطة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
