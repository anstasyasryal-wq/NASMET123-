import React, { useState } from 'react';
import { WorldSecret } from '../../types/nesmaCipher';
import { NESMA_CIPHER_SECRETS, hasAllThreeSecrets, GRAND_CIPHER_SECRET } from '../../data/nesmaCipherSecrets';
import {
  Sparkles,
  Award,
  X,
  Lock,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  Compass,
  Crown,
} from 'lucide-react';

interface CipherRelicsCabinetModalProps {
  isOpen: boolean;
  discoveredSecretIds: string[];
  completedCount: number;
  onClose: () => void;
  onOpenSecretChallenge: (secret: WorldSecret) => void;
  onOpenGrandSecret?: () => void;
  isGrandSecretUnlocked?: boolean;
}

export const CipherRelicsCabinetModal: React.FC<CipherRelicsCabinetModalProps> = ({
  isOpen,
  discoveredSecretIds,
  completedCount,
  onClose,
  onOpenSecretChallenge,
  onOpenGrandSecret,
  isGrandSecretUnlocked = false,
}) => {
  const [selectedSecret, setSelectedSecret] = useState<WorldSecret | null>(
    NESMA_CIPHER_SECRETS[0]
  );

  if (!isOpen) return null;

  const allSecretsGathered = hasAllThreeSecrets(discoveredSecretIds);
  const isStage30Done = completedCount >= 30;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in text-right font-sans"
      dir="rtl"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-stone-950 via-[#191512] to-stone-950 border-2 border-amber-500/50 p-6 sm:p-7 shadow-2xl space-y-6 text-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer border border-stone-800"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-stone-800 pb-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 text-2xl shadow-inner">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                المقتنيات المكتشفة ({discoveredSecretIds.length} من 3)
              </span>
              {isGrandSecretUnlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-200 border border-amber-400/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>السر الأعظم مكتمل</span>
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-100 mt-0.5">
              خزانة أسرار ومقتنيات «شفرة نسمة»
            </h2>
          </div>
        </div>

        {/* Grand Secret Culmination Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#211a14] via-[#241728] to-[#161d22] border border-amber-400/40 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{GRAND_CIPHER_SECRET.badgeSymbol}</span>
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  {GRAND_CIPHER_SECRET.titleAr}
                </span>
                <span className="text-[11px] text-stone-300 font-serif">
                  {isGrandSecretUnlocked
                    ? 'العهد الجامع للرفق والحدود وفضاء المراقبة محفوظ ومكتمل.'
                    : allSecretsGathered && isStage30Done
                    ? 'أسرار العوالم الثلاثة مكتملة! التحدي والعهد الأعظم بانتظاركِ.'
                    : allSecretsGathered
                    ? '3/3 أسرار جُمعت! يتجلى السر الأعظم عند إتمام المحطة 30.'
                    : `اجمعي أسرار العوالم الثلاثة لفتح خيط السر الأعظم (${discoveredSecretIds.length} من 3).`}
                </span>
              </div>
            </div>

            {allSecretsGathered && isStage30Done && onOpenGrandSecret && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGrandSecret();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition cursor-pointer shadow flex items-center gap-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGrandSecretUnlocked ? 'مراجعة الكشف' : 'فك السر الأعظم'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Secrets Selection Grid (3 World Relics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NESMA_CIPHER_SECRETS.map((secret) => {
            const isDiscovered = discoveredSecretIds.includes(secret.id);
            const isAvailable = completedCount >= secret.minCompletedStages;
            const isSelected = selectedSecret?.id === secret.id;

            return (
              <button
                key={secret.id}
                onClick={() => setSelectedSecret(secret)}
                className={`p-3.5 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                    : 'bg-stone-900/70 border-stone-800 hover:border-amber-700/50 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-1 rounded-xl bg-stone-950 border border-stone-800">
                    {isDiscovered ? secret.relicIcon : secret.icon}
                  </span>
                  <span className="text-xs">
                    {isDiscovered ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>مقتنى</span>
                      </span>
                    ) : isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>إشارة متاحة</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-stone-500 font-bold bg-stone-950 px-2 py-0.5 rounded-full border border-stone-800">
                        <Lock className="w-3 h-3" />
                        <span>مخفي</span>
                      </span>
                    )}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 block font-mono">
                    {secret.worldNameAr}
                  </span>
                  <span className="text-xs font-extrabold line-clamp-1 block">
                    {isDiscovered ? secret.relicNameAr : secret.titleAr}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Secret Detail Showcase */}
        {selectedSecret && (
          <div className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-4">
            {discoveredSecretIds.includes(selectedSecret.id) ? (
              /* Already Discovered Showcase */
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      ✨ مقتنى مكتمل في خزانتكِ:
                    </span>
                    <h3 className="text-lg font-black text-amber-100">
                      «{selectedSecret.relicNameAr}»
                    </h3>
                  </div>
                  <span className="text-3xl p-2 rounded-2xl bg-stone-950 border border-emerald-500/40">
                    {selectedSecret.relicIcon}
                  </span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <span className="text-amber-300 font-bold block flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>الكشف القصصي المحفوظ:</span>
                  </span>
                  <p className="text-stone-200 leading-relaxed font-serif p-3.5 rounded-xl bg-stone-950/80 border border-stone-800">
                    {selectedSecret.narrativeRevelationAr}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/40 space-y-1 text-xs">
                  <span className="text-emerald-300 font-bold block">
                    💡 البصيرة النفسية:
                  </span>
                  <p className="text-emerald-100 font-spiritual leading-relaxed">
                    {selectedSecret.practicalWisdomAr}
                  </p>
                </div>
              </div>
            ) : completedCount >= selectedSecret.minCompletedStages ? (
              /* Available for Discovery */
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>الإشارة ظهرت في معالم البيئة الحية:</span>
                  </span>
                  <h3 className="text-lg font-black text-amber-100">
                    {selectedSecret.titleAr}
                  </h3>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed p-3.5 rounded-xl bg-stone-950/80 border border-amber-600/30 font-serif">
                  {selectedSecret.clueHintAr}
                </p>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSecretChallenge(selectedSecret);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>فحص الإشارة وفك الشفرة السرية 🔍</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Still Hidden Behind Environmental Fog/Illumination */
              <div className="space-y-3 text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-950 text-stone-500 flex items-center justify-center text-xl border border-stone-800">
                  🔒
                </div>
                <h4 className="text-sm font-bold text-stone-300">
                  هذا السر محجوب بحجب الطبيعة حالياً
                </h4>
                <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                  شرط الظهور: {selectedSecret.discoveryConditionAr} (أنجزتِ حالياً {completedCount} مرحلة).
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
