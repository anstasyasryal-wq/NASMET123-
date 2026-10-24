import React, { useState, useEffect } from 'react';
import {
  NESMA_CIPHER_STAGES,
  PSYCHOLOGICAL_QUOTES,
  getStagesByWorld,
} from '../../data/nesmaCipherData';
import {
  NESMA_CIPHER_SECRETS,
  getSecretByWorld,
} from '../../data/nesmaCipherSecrets';
import {
  loadCipherProgress,
} from '../../utils/nesmaCipherStorage';
import { NesmaCipherStage, CipherWorldId, CipherProgress, WorldSecret } from '../../types/nesmaCipher';
import { CipherSecretDiscoveryModal } from './CipherSecretDiscoveryModal';
import { CipherRelicsCabinetModal } from './CipherRelicsCabinetModal';
import { CipherGrandSecretModal } from './CipherGrandSecretModal';
import {
  Compass,
  Star,
  Lock,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Sun,
  Flame,
  Info,
  X,
  Play,
  RotateCcw,
  Crown,
} from 'lucide-react';

interface CipherMapProps {
  onSelectStage: (stage: NesmaCipherStage) => void;
  onOpenJournal?: () => void;
  onBackToHome?: () => void;
}

export const CipherMap: React.FC<CipherMapProps> = ({
  onSelectStage,
  onOpenJournal,
  onBackToHome,
}) => {
  const [progress, setProgress] = useState<CipherProgress>(() => loadCipherProgress());
  const [selectedWorld, setSelectedWorld] = useState<CipherWorldId>('garden_of_beginnings');
  const [previewStage, setPreviewStage] = useState<NesmaCipherStage | null>(null);
  const [selectedSecretForDiscovery, setSelectedSecretForDiscovery] = useState<WorldSecret | null>(null);
  const [isRelicsCabinetOpen, setIsRelicsCabinetOpen] = useState<boolean>(false);
  const [isGrandSecretModalOpen, setIsGrandSecretModalOpen] = useState<boolean>(false);

  // Sync progress if updated
  useEffect(() => {
    setProgress(loadCipherProgress());
  }, []);

  // Compute stats
  const completedCount = progress.completedLevels.length;
  const totalStars = Object.values(progress.stars).reduce<number>((acc, val) => acc + (Number(val) || 0), 0);
  const maxPossibleStars = 30 * 3;

  // World progress counters
  const world1Stages = getStagesByWorld('garden_of_beginnings');
  const world2Stages = getStagesByWorld('library_of_secrets');
  const world3Stages = getStagesByWorld('cave_of_reflection');

  const world1Done = world1Stages.filter((s) => progress.completedLevels.includes(s.id)).length;
  const world2Done = world2Stages.filter((s) => progress.completedLevels.includes(s.id)).length;
  const world3Done = world3Stages.filter((s) => progress.completedLevels.includes(s.id)).length;

  // Environment dynamic state
  const fogOpacity = Math.max(0, 1 - world1Done * 0.1);
  const libraryIllumination = Math.min(100, world2Done * 10);
  const caveGlowIntensity = Math.min(100, world3Done * 10);

  // Active world stages
  const activeStages =
    selectedWorld === 'garden_of_beginnings'
      ? world1Stages
      : selectedWorld === 'library_of_secrets'
      ? world2Stages
      : world3Stages;

  // Secret of current world
  const currentWorldSecret = getSecretByWorld(selectedWorld);
  const isSecretDiscovered = currentWorldSecret
    ? progress.discoveredSecrets.includes(currentWorldSecret.id)
    : false;
  const isSecretClueReady = currentWorldSecret
    ? completedCount >= currentWorldSecret.minCompletedStages
    : false;

  const isWorldUnlocked = (worldId: CipherWorldId): boolean => {
    if (worldId === 'garden_of_beginnings') return true;
    if (worldId === 'library_of_secrets') return world1Done >= 10;
    if (worldId === 'cave_of_reflection') return world2Done >= 10;
    return false;
  };

  const handleStageClick = (stage: NesmaCipherStage) => {
    const isCompleted = progress.completedLevels.includes(stage.id);
    const isCurrent = stage.id === progress.currentLevel || (stage.id === 1 && progress.currentLevel === 0);
    const isUnlocked = isCompleted || isCurrent || stage.id <= progress.currentLevel;

    if (isUnlocked) {
      setPreviewStage(stage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in text-right font-sans" dir="rtl">
      {/* Top Navigation & Game Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Relics and Secrets Cabinet Button */}
          <button
            onClick={() => setIsRelicsCabinetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/50 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>خزانة المقتنيات ({progress.discoveredSecrets.length}/3)</span>
          </button>

          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600/50 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>دفتر البصيرة ({progress.discoveredQuotes.length}/5)</span>
            </button>
          )}

          {/* Total score badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>النقاط: {progress.score}</span>
          </div>
        </div>
      </div>

      {/* Main Banner: Nesma's Compass Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-[#192219] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Soft atmospheric gradient */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>مغامرة الوعي والسكينة النفسية</span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-300 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-amber-600/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-mono font-bold">{totalStars}</span>
                <span className="text-stone-400">/{maxPossibleStars}</span>
              </div>
              <div className="text-emerald-300 bg-stone-900/80 px-2.5 py-1 rounded-lg border border-emerald-600/30 font-bold">
                المراحل: {completedCount} من 30
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 flex items-center gap-2.5">
              <span>🌿 خَرِيطَةُ مَغَامَرَةِ «شَفْرَةِ نَسْمَة»</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              رحلة واعية عبر ثلاثة عوالم داخلية: تفكيك الضباب والكمالية في حديقة البدايات، ترتيب المشاعر والحدود في مكتبة الأسرار، واكتشاف فضاء الذات الهادئة في كهف التفكير.
            </p>
          </div>

          {/* Living World State Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* World 1 Pill */}
            <div
              className={`p-3 rounded-2xl border transition text-xs space-y-1 ${
                selectedWorld === 'garden_of_beginnings'
                  ? 'bg-emerald-900/50 border-emerald-400 text-emerald-100 shadow-md ring-1 ring-emerald-400'
                  : 'bg-stone-900/80 border-stone-800 text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>🌱 حديقة البدايات</span>
                <span>{world1Done}/10</span>
              </div>
              <div className="text-[11px] text-emerald-300/80">
                {world1Done >= 10 ? 'مشرقة ومزهرة بالكامل ☀️' : `الضباب يتراجع: ${Math.round((1 - fogOpacity) * 100)}%`}
              </div>
            </div>

            {/* World 2 Pill */}
            <div
              className={`p-3 rounded-2xl border transition text-xs space-y-1 ${
                selectedWorld === 'library_of_secrets'
                  ? 'bg-amber-900/50 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400'
                  : 'bg-stone-900/80 border-stone-800 text-stone-300'
              } ${!isWorldUnlocked('library_of_secrets') ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>📚 مكتبة الأسرار</span>
                <span>{world2Done}/10</span>
              </div>
              <div className="text-[11px] text-amber-300/80">
                {!isWorldUnlocked('library_of_secrets')
                  ? 'مقفلة (أكمل الحديقة)'
                  : world2Done >= 10
                  ? 'الأروقة منيرة بالكامل 🕯️'
                  : `إضاءة الأروقة: ${libraryIllumination}%`}
              </div>
            </div>

            {/* World 3 Pill */}
            <div
              className={`p-3 rounded-2xl border transition text-xs space-y-1 ${
                selectedWorld === 'cave_of_reflection'
                  ? 'bg-purple-900/50 border-purple-400 text-purple-100 shadow-md ring-1 ring-purple-400'
                  : 'bg-stone-900/80 border-stone-800 text-stone-300'
              } ${!isWorldUnlocked('cave_of_reflection') ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>🪨 كهف التفكير</span>
                <span>{world3Done}/10</span>
              </div>
              <div className="text-[11px] text-purple-300/80">
                {!isWorldUnlocked('cave_of_reflection')
                  ? 'مقفل (أكمل المكتبة)'
                  : world3Done >= 10
                  ? 'البلورات تشع بالحكمة 👑'
                  : `توهج البلورات: ${caveGlowIntensity}%`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVING WORLD TRANSFORMATION PANEL (PHASE 4 DYNAMIC ENVIRONMENT) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-stone-900/90 border border-stone-800 p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>معالم البيئة الحية المتحولة بإنجازاتكِ الفعلية:</span>
          </div>
          <span className="text-[11px] text-stone-400">
            تتغير البيئة وتتفتح عناصرها تلقائياً مع كل مرحلة مجتازة
          </span>
        </div>

        {/* Dynamic environment elements for Garden of Beginnings */}
        {selectedWorld === 'garden_of_beginnings' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(1)
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🦋</span>
              <div>
                <span className="block font-bold">رفيف الفراشات</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(1) ? 'تلاشت أعباء الحقيبة' : 'مقفل (مرحلة 1)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(2)
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🪷</span>
              <div>
                <span className="block font-bold">زهرة اللوتس</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(2) ? 'تفتحت في حوض السكينة' : 'مقفل (مرحلة 2)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(3)
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🌿</span>
              <div>
                <span className="block font-bold">بوابة اللبلاب</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(3) ? 'انفتحت نحو العمق' : 'مقفل (مرحلة 3)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(7)
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">💧</span>
              <div>
                <span className="block font-bold">مرآة البحيرة</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(7) ? 'استقر سطح الماء كمرآة' : 'مقفل (مرحلة 7)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition sm:col-span-2 ${
                world1Done >= 10
                  ? 'bg-gradient-to-r from-amber-950/50 to-emerald-950/60 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">☀️</span>
              <div>
                <span className="block font-bold">شمس الحديقة المشرقة بالكامل</span>
                <span className="text-[10px]">
                  {world1Done >= 10
                    ? 'اكتمل إشراق الفصل الأول وتم فتح بوابات مكتبة الأسرار بنجاح!'
                    : `أكملي 10 مراحل لإشراق الحديقة بالكامل (${world1Done}/10)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic environment elements for Library of Secrets */}
        {selectedWorld === 'library_of_secrets' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(11)
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🕯️</span>
              <div>
                <span className="block font-bold">مصابيح الردهة</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(11) ? 'أضيئت رفوف الأصوات' : 'مقفل (مرحلة 11)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(15)
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🕯️</span>
              <div>
                <span className="block font-bold">شمعة السكون</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(15) ? 'ثبتت في قلب العاصفة' : 'مقفل (مرحلة 15)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(16)
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🚪</span>
              <div>
                <span className="block font-bold">بوابة الحدود الواعية</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(16) ? 'مشرعة نحو الأمان' : 'مقفل (مرحلة 16)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(18)
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🪴</span>
              <div>
                <span className="block font-bold">شرفة الزهور المعلقة</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(18) ? 'مروية بالعناية الذاتية' : 'مقفل (مرحلة 18)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition sm:col-span-2 ${
                world2Done >= 10
                  ? 'bg-gradient-to-r from-amber-950/60 to-purple-950/60 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🏰</span>
              <div>
                <span className="block font-bold">قاعة النور والبرج الفلكي</span>
                <span className="text-[10px]">
                  {world2Done >= 10
                    ? 'أروقة المكتبة منارة بالكامل ودرج كهف التفكير أصبح مكشوفاً!'
                    : `أكملي 10 مراحل لإنارة المكتبة بالكامل (${world2Done}/10)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic environment elements for Cave of Reflection */}
        {selectedWorld === 'cave_of_reflection' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(21)
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">💎</span>
              <div>
                <span className="block font-bold">بلورات الصدى</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(21) ? 'تشع بنور الذات المراقبة' : 'مقفل (مرحلة 21)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(25)
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🌌</span>
              <div>
                <span className="block font-bold">نافذة النجوم الكونية</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(25) ? 'تفيض بسكينة السماء' : 'مقفل (مرحلة 25)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(26)
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🔥</span>
              <div>
                <span className="block font-bold">موقد الدفء الذاتي</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(26) ? 'يشتعل بلطف التعاطف' : 'مقفل (مرحلة 26)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                progress.completedLevels.includes(28)
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">🌿</span>
              <div>
                <span className="block font-bold">واحة الزمرد والامتنان</span>
                <span className="text-[10px] text-stone-400">
                  {progress.completedLevels.includes(28) ? 'نقية تروي القلب' : 'مقفل (مرحلة 28)'}
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition sm:col-span-2 ${
                world3Done >= 10
                  ? 'bg-gradient-to-r from-purple-950/70 via-amber-950/60 to-emerald-950/70 border-amber-300 text-amber-200 shadow-xl ring-2 ring-amber-400 animate-pulse'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <span className="text-xl">👑</span>
              <div>
                <span className="block font-bold">شرفة السكينة وقلادة الوعي الحقيقي</span>
                <span className="text-[10px]">
                  {world3Done >= 10
                    ? 'مبارك تتويج شفرة نسمة بالكامل! حديقة البصيرة مزهرة معكِ دوماً.'
                    : `أكملي 10 مراحل لبلوغ شرفة السكينة وتتويج الرحلة (${world3Done}/10)`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Secret Clue Showcase for Active World */}
        {currentWorldSecret && (
          <div className="pt-2 border-t border-stone-800">
            <div
              className={`p-3.5 rounded-2xl border transition flex flex-wrap items-center justify-between gap-3 ${
                isSecretDiscovered
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-md'
                  : isSecretClueReady
                  ? 'bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-amber-400 text-amber-100 shadow-lg ring-1 ring-amber-400/80 animate-pulse'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1.5 rounded-xl bg-stone-950 border border-stone-800 shrink-0">
                  {isSecretDiscovered ? currentWorldSecret.relicIcon : currentWorldSecret.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-200">
                      {currentWorldSecret.titleAr}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 text-stone-300 font-mono border border-stone-800">
                      رمز السر: {currentWorldSecret.badgeSymbol}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-300 mt-0.5 max-w-lg leading-relaxed">
                    {isSecretDiscovered
                      ? `تم اكتشاف السر واقتناء: «${currentWorldSecret.relicNameAr}» ✨`
                      : isSecretClueReady
                      ? currentWorldSecret.clueHintAr
                      : `إشارة سرية غامضة محجوبة بحجب الطبيعة (تتطلب إتمام ${currentWorldSecret.minCompletedStages} مرحلة على الأقل)`}
                  </p>
                </div>
              </div>

              <div>
                {isSecretDiscovered ? (
                  <button
                    onClick={() => setSelectedSecretForDiscovery(currentWorldSecret)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold transition cursor-pointer border border-emerald-600/40 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                    <span>عرض المقتنى والكشف</span>
                  </button>
                ) : isSecretClueReady ? (
                  <button
                    onClick={() => setSelectedSecretForDiscovery(currentWorldSecret)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 text-xs font-extrabold shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>فحص الإشارة وفك اللغز 🔍</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-stone-950 text-stone-500 text-xs border border-stone-800">
                    <Lock className="w-3.5 h-3.5" />
                    <span>محجوب ({completedCount}/{currentWorldSecret.minCompletedStages})</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* WINDING ADVENTURE PATH CANVAS / MAP */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-stone-950/90 border-2 border-stone-800 p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[600px]">
        {/* Dynamic environment overlay for World 1 */}
        {selectedWorld === 'garden_of_beginnings' && fogOpacity > 0 && (
          <div
            className="absolute inset-0 bg-stone-200/5 backdrop-blur-[1px] pointer-events-none transition-opacity duration-1000 z-0"
            style={{ opacity: fogOpacity * 0.4 }}
            title="ضباب الصباح يغطي أجزاء من الحديقة"
          />
        )}

        {/* Header of Active World */}
        <div className="relative z-10 flex items-center justify-between border-b border-stone-800 pb-4 mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2">
              <span>{activeStages[0]?.worldNameAr}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-stone-900 text-stone-300 border border-stone-800">
                10 محطات وعي
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {selectedWorld === 'garden_of_beginnings'
                ? 'تفتيت الضباب خطوة بخطوة وإعادة شحن السكينة في الطبيعة'
                : selectedWorld === 'library_of_secrets'
                ? 'فرز الأصوات القديمة وتثبيت الحدود الواعية مع الذات والآخرين'
                : 'التعرف على الذات كفضاء رحب واستعادة التعاطف الذاتي الكامل'}
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-amber-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
            {activeStages.filter((s) => progress.completedLevels.includes(s.id)).length} / 10 مكتملة
          </div>
        </div>

        {/* Serpentine Vertical Winding Path Nodes */}
        <div className="relative z-10 max-w-lg mx-auto py-4 space-y-6">
          {activeStages.map((stage, idx) => {
            const isCompleted = progress.completedLevels.includes(stage.id);
            const isCurrent =
              stage.id === progress.currentLevel ||
              (stage.id === 1 && !progress.completedLevels.includes(1));
            const isLocked = !isCompleted && !isCurrent && stage.id > progress.currentLevel;
            const stars = progress.stars[stage.id] || (isCompleted ? 3 : 0);
            const isMilestone = stage.stageNumber === 10 || stage.stageNumber === 20 || stage.stageNumber === 30;

            // Serpentine horizontal offset
            // Alternates: center, slightly right, center, slightly left
            const offsetClasses =
              idx % 4 === 0
                ? 'sm:translate-x-0'
                : idx % 4 === 1
                ? 'sm:-translate-x-12'
                : idx % 4 === 2
                ? 'sm:translate-x-0'
                : 'sm:translate-x-12';

            return (
              <div key={stage.id} className="relative flex flex-col items-center">
                {/* Connecting Path Stem line between stages */}
                {idx > 0 && (
                  <div
                    className={`w-1 h-8 rounded-full -mt-6 mb-1 transition-all duration-500 ${
                      isCompleted || isCurrent
                        ? 'bg-gradient-to-b from-amber-400 to-emerald-500 shadow-sm shadow-amber-400/30'
                        : 'bg-stone-800'
                    }`}
                  />
                )}

                {/* Milestone Banner (Stages 10, 20, 30) */}
                {isMilestone && (
                  <div className="mb-2 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>المحطة الكبرى وتتويج الفصل</span>
                  </div>
                )}

                {/* Interactive Stage Node Button */}
                <button
                  onClick={() => handleStageClick(stage)}
                  disabled={isLocked}
                  className={`group relative flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 w-full max-w-sm ${offsetClasses} ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-950/90 via-stone-900 to-emerald-950/80 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400 scale-[1.03] cursor-pointer'
                      : isCompleted
                      ? 'bg-stone-900/90 border-emerald-500/70 hover:border-emerald-400 hover:bg-stone-850 shadow-md cursor-pointer'
                      : 'bg-stone-950/80 border-stone-800 text-stone-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Icon & Stage Number Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border relative transition ${
                      isCurrent
                        ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md animate-bounce-subtle'
                        : isCompleted
                        ? 'bg-emerald-900/60 text-emerald-200 border-emerald-500/50'
                        : 'bg-stone-900 text-stone-600 border-stone-800'
                    }`}
                  >
                    <span>{stage.icon}</span>

                    {/* Stage number small badge */}
                    <span
                      className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center border ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950 border-amber-200 shadow'
                          : isCompleted
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      {stage.stageNumber}
                    </span>
                  </div>

                  {/* Stage Text Information */}
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`font-bold text-sm truncate ${
                          isCurrent
                            ? 'text-amber-100 font-extrabold'
                            : isCompleted
                            ? 'text-stone-100'
                            : 'text-stone-400'
                        }`}
                      >
                        {stage.titleAr}
                      </h4>

                      {/* Status Icon */}
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold shrink-0">
                          الآن
                        </span>
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-stone-400 truncate mt-0.5">
                      {stage.subtitleAr}
                    </p>

                    {/* Stars rating or Lock message */}
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-stone-800/60 text-[10px]">
                      {isCompleted ? (
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 3 }).map((_, sIdx) => (
                            <Star
                              key={sIdx}
                              className={`w-3 h-3 ${
                                sIdx < stars ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                              }`}
                            />
                          ))}
                          <span className="font-mono text-stone-300 mr-1">مكتملة</span>
                        </div>
                      ) : isCurrent ? (
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Play className="w-3 h-3 fill-amber-300" />
                          <span>جاهزة للانطلاق</span>
                        </span>
                      ) : (
                        <span className="text-stone-500 font-serif">مقفلة حتى إتمام السابقة</span>
                      )}

                      <span className="text-[10px] text-stone-400 font-mono">
                        {stage.puzzleType === 'image_puzzle'
                          ? 'بازل الصور'
                          : stage.puzzleType === 'letters_box'
                          ? 'صندوق الحروف'
                          : stage.puzzleType === 'sentence_order'
                          ? 'ترتيب العبارة'
                          : stage.puzzleType === 'breathing_flow'
                          ? 'تنفس واعي'
                          : stage.puzzleType === 'maze'
                          ? 'متاهة الضوء'
                          : 'لغز تركيبي'}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STAGE PREVIEW MODAL / LAUNCH DRAWER */}
      {/* ========================================================================= */}
      {previewStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
          <div className="w-full max-w-lg rounded-3xl bg-gradient-to-b from-stone-950 via-[#1c1610] to-stone-950 border-2 border-amber-500/70 p-6 sm:p-7 shadow-2xl text-stone-100 space-y-4 animate-scale-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-2xl flex items-center justify-center shadow-md">
                  {previewStage.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      المرحلة {previewStage.stageNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                      {previewStage.worldNameAr}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-amber-100 mt-0.5">
                    {previewStage.titleAr}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setPreviewStage(null)}
                className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Narrative Intro Context */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Compass className="w-3.5 h-3.5" />
                <span>السياق القصصي للمرحلة:</span>
              </div>
              <p className="text-stone-300 leading-relaxed font-serif">
                {previewStage.narrativeIntroAr}
              </p>
            </div>

            {/* Companion 'بوصلة نسمة' Greeting */}
            <div className="space-y-1 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <span>🕊️ بوصلة نسمة تهمس لكِ:</span>
              </div>
              <p className="text-amber-100 font-spiritual italic leading-relaxed">
                «{previewStage.companionDialogue.intro}»
              </p>
            </div>

            {/* Psychological concept preview */}
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 text-[11px] text-stone-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-emerald-300 font-bold">المفهوم النفسي: </span>
                {previewStage.psychologicalConceptAr}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPreviewStage(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition cursor-pointer border border-stone-800"
              >
                إغلاق
              </button>

              <button
                onClick={() => {
                  const s = previewStage;
                  setPreviewStage(null);
                  onSelectStage(s);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-stone-950" />
                <span>دخول اللغز والمسيرة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Discovery & Puzzle Modal */}
      <CipherSecretDiscoveryModal
        secret={selectedSecretForDiscovery}
        isOpen={Boolean(selectedSecretForDiscovery)}
        isAlreadyDiscovered={
          selectedSecretForDiscovery
            ? progress.discoveredSecrets.includes(selectedSecretForDiscovery.id)
            : false
        }
        onClose={() => setSelectedSecretForDiscovery(null)}
        onDiscovered={() => {
          setProgress(loadCipherProgress());
        }}
      />

      {/* Relics and Secrets Cabinet Modal */}
      <CipherRelicsCabinetModal
        isOpen={isRelicsCabinetOpen}
        discoveredSecretIds={progress.discoveredSecrets}
        completedCount={completedCount}
        onClose={() => setIsRelicsCabinetOpen(false)}
        onOpenSecretChallenge={(secret) => {
          setSelectedSecretForDiscovery(secret);
        }}
        onOpenGrandSecret={() => {
          setIsGrandSecretModalOpen(true);
        }}
        isGrandSecretUnlocked={Boolean(progress.unlockedGrandSecret)}
      />

      {/* Grand Secret Modal */}
      <CipherGrandSecretModal
        isOpen={isGrandSecretModalOpen}
        onClose={() => setIsGrandSecretModalOpen(false)}
        isAlreadyUnlocked={Boolean(progress.unlockedGrandSecret)}
        onUnlocked={() => {
          setProgress(loadCipherProgress());
        }}
      />
    </div>
  );
};
