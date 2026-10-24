import React from 'react';
import { PSYCHOLOGICAL_QUOTES } from '../../data/nesmaCipherData';
import { loadCipherProgress } from '../../utils/nesmaCipherStorage';
import { PsychologicalQuote } from '../../types/nesmaCipher';
import { BookOpen, X, Sparkles, Award, CheckCircle2, Lock, Compass, Heart } from 'lucide-react';

interface NesmaCipherJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NesmaCipherJournal: React.FC<NesmaCipherJournalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const progress = loadCipherProgress();
  const completedStages = progress.completedLevels;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans text-right" dir="rtl">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-gradient-to-b from-stone-950 via-[#1a140e] to-stone-950 border-2 border-amber-500/70 p-6 sm:p-8 shadow-2xl text-stone-100 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-2xl flex items-center justify-center text-amber-300 shadow-md">
              📖
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
                <span>دَفْتَرُ البَصِيرَةِ والمَقُولَاتِ النَّفْسِيَّةِ</span>
              </h2>
              <p className="text-xs text-amber-300 font-serif mt-0.5">
                خلاصة مهارات الوعي والسكينة المكتسبة من مغامرة «شفرة نسمة»
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px]">المقولات المكتملة:</span>
            <span className="text-amber-300 font-bold font-mono text-base">
              {PSYCHOLOGICAL_QUOTES.filter((q) =>
                q.targetStageIds.every((id) => completedStages.includes(id))
              ).length}{' '}
              <span className="text-xs text-stone-500 font-normal">من 5 مقولات</span>
            </span>
          </div>

          <div>
            <span className="text-stone-400 block text-[11px]">المراحل المنجزة:</span>
            <span className="text-emerald-400 font-bold font-mono text-base">
              {completedStages.length}{' '}
              <span className="text-xs text-stone-500 font-normal">من 30 مرحلة</span>
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-stone-400 block text-[11px]">الرصيد التراكمي:</span>
            <span className="text-amber-400 font-bold font-mono text-base">
              {progress.score} نقطة
            </span>
          </div>
        </div>

        {/* Psychological Quotes List */}
        <div className="space-y-4">
          {PSYCHOLOGICAL_QUOTES.map((quote) => {
            const completedInQuote = quote.targetStageIds.filter((id) =>
              completedStages.includes(id)
            ).length;
            const isFullyUnlocked = completedInQuote === quote.targetStageIds.length;
            const isPartiallyUnlocked = completedInQuote > 0;

            return (
              <div
                key={quote.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  isFullyUnlocked
                    ? 'bg-gradient-to-br from-amber-950/60 via-stone-900 to-stone-950 border-amber-400/80 shadow-lg ring-1 ring-amber-400/30'
                    : isPartiallyUnlocked
                    ? 'bg-stone-900/90 border-stone-700'
                    : 'bg-stone-950/60 border-stone-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      المقولة {quote.id} ({quote.scientificFramework})
                    </span>
                    <span className="text-stone-400 text-[11px]">{quote.domainAr}</span>
                  </div>

                  {isFullyUnlocked ? (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>مكتملة ومستقرة</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-500 font-mono">
                      {completedInQuote} / {quote.targetStageIds.length} جزء مكتمل
                    </span>
                  )}
                </div>

                {/* Quote Text */}
                {isFullyUnlocked ? (
                  <div className="p-3.5 rounded-xl bg-stone-950/80 border border-amber-600/30">
                    <p className="font-spiritual text-base sm:text-lg text-amber-100 font-bold leading-relaxed">
                      «{quote.fullQuoteAr}»
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-800 text-stone-500 italic text-xs flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>تكتمل هذه المقولة بإنهاء مراحل {quote.targetStageIds[0]} إلى {quote.targetStageIds[quote.targetStageIds.length - 1]}...</span>
                  </div>
                )}

                {/* School and Practical Reflection */}
                {isFullyUnlocked && (
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="text-stone-400 text-[11px]">
                      <strong className="text-amber-400">المرجع العلمي: </strong>
                      {quote.authorOrSchoolAr}
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-600/30 text-stone-200">
                      <strong className="text-emerald-300">💡 التطبيق العملي للسكينة: </strong>
                      {quote.practicalReflectionAr}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition cursor-pointer border border-stone-800"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
