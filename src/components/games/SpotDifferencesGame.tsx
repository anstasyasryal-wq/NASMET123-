import React, { useState, useCallback } from 'react';
import { soundManager } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  HelpCircle,
  Volume2,
  VolumeX,
  Eye,
} from 'lucide-react';

interface SpotDifferencesGameProps {
  onBack: () => void;
  onSuccess: (points: number) => void;
}

interface DifferenceItem {
  id: number;
  name: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  radiusPercent: number;
  hint: string;
  found: boolean;
}

interface SceneItem {
  id: string;
  title: string;
  subtitle: string;
  imageA: string;
  imageB: string;
  differences: DifferenceItem[];
}

const SCENES: SceneItem[] = [
  {
    id: 'monk_cell',
    title: 'قلاية الراهب وبستان النخيل',
    subtitle: 'ابحث عن 5 فروق دقيقة بين المشهدين في معالم القلاية والبرية',
    imageA: '/images/icons/st_antony.jpg',
    imageB: '/images/icons/st_antony.jpg', // We render visual overlays on Image B!
    differences: [
      { id: 1, name: 'الصليب الخشبي في يد الأنبا أنطونيوس', xPercent: 68, yPercent: 28, radiusPercent: 8, hint: 'تأمل في قمة الصليب الخشبي الذي يمسكه القديس', found: false },
      { id: 2, name: 'مخطوطة الصلاة والعهد', xPercent: 48, yPercent: 62, radiusPercent: 8, hint: 'انظر إلى الكلمات المكتوبة على المخطوطة الجلدية', found: false },
      { id: 3, name: 'قبة الدير الأثري بالخلفية', xPercent: 25, yPercent: 48, radiusPercent: 7, hint: 'لاحظ الصليب أعلى قبة قلاية الدير في الأفق', found: false },
      { id: 4, name: 'هالة النور الذهبية حول الرأس', xPercent: 52, yPercent: 18, radiusPercent: 7, hint: 'تفحص نقوش الهالة النورانية المحيطة بالقلنسوة', found: false },
      { id: 5, name: 'سعف نخلة الواحة على اليمين', xPercent: 82, yPercent: 55, radiusPercent: 7, hint: 'انظر إلى جذع وسعف نخلة البرية في يمين اللوحة', found: false },
    ],
  },
  {
    id: 'st_george_battle',
    title: 'أيقونة الشهيد مارجرجس والتنين',
    subtitle: 'اكتشف 5 فروق بين المشهدين في درع الفارس وراية النصر',
    imageA: '/images/icons/st_george.jpg',
    imageB: '/images/icons/st_george.jpg',
    differences: [
      { id: 1, name: 'راية الصليب أعلى الحربة', xPercent: 32, yPercent: 21, radiusPercent: 8, hint: 'انظر إلى الراية البيضاء ذات الصليب الأحمر', found: false },
      { id: 2, name: 'سرج الحصان الأبيض والزخارف', xPercent: 46, yPercent: 58, radiusPercent: 8, hint: 'تفحص نقوش ولجام الحصان الأبيض', found: false },
      { id: 3, name: 'تاج القلعة في الأفق البعيد', xPercent: 76, yPercent: 44, radiusPercent: 7, hint: 'لاحظ نافذة برج القلعة الحصينة في الخلفية', found: false },
      { id: 4, name: 'عين التنين المكسور', xPercent: 62, yPercent: 82, radiusPercent: 8, hint: 'دقق في رأس وجناح التنين عند أقدام الفرس', found: false },
      { id: 5, name: 'الصليب الذهبي على الهالة النورانية', xPercent: 51, yPercent: 22, radiusPercent: 7, hint: 'تفحص الزخرفة الدائرية المحيطة بهالة الشهيد', found: false },
    ],
  },
];

export const SpotDifferencesGame: React.FC<SpotDifferencesGameProps> = ({ onBack, onSuccess }) => {
  const [sceneIdx, setSceneIdx] = useState<number>(0);
  const [scenesData, setScenesData] = useState<SceneItem[]>(SCENES);
  const [activeHintId, setActiveHintId] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isWin, setIsWin] = useState<boolean>(false);

  const currentScene = scenesData[sceneIdx] || scenesData[0];
  const foundCount = currentScene.differences.filter((d) => d.found).length;
  const totalCount = currentScene.differences.length;

  const playSfx = (type: 'ding' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (type === 'ding') soundManager.playCorrect();
      if (type === 'win') soundManager.playCelebration();
    } catch {}
  };

  // Handle click on image
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check hitboxes
    let hitDifference: DifferenceItem | null = null;
    for (const diff of currentScene.differences) {
      if (diff.found) continue;
      const dx = clickX - diff.xPercent;
      const dy = clickY - diff.yPercent;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= diff.radiusPercent + 3) {
        hitDifference = diff;
        break;
      }
    }

    if (hitDifference) {
      playSfx('ding');
      const updatedScenes = [...scenesData];
      const targetScene = updatedScenes[sceneIdx];
      targetScene.differences = targetScene.differences.map((d) =>
        d.id === hitDifference!.id ? { ...d, found: true } : d
      );
      setScenesData(updatedScenes);
      setActiveHintId(null);

      // Check win
      if (targetScene.differences.every((d) => d.found)) {
        setIsWin(true);
        playSfx('win');
        try {
          confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 } });
        } catch {}
        onSuccess(150);
      }
    }
  };

  const handleResetScene = () => {
    const updated = [...scenesData];
    updated[sceneIdx].differences = updated[sceneIdx].differences.map((d) => ({ ...d, found: false }));
    setScenesData(updated);
    setIsWin(false);
    setActiveHintId(null);
  };

  const showHint = () => {
    const unfound = currentScene.differences.find((d) => !d.found);
    if (unfound) {
      setActiveHintId(unfound.id);
      setTimeout(() => setActiveHintId(null), 3500);
    }
  };

  return (
    <div dir="rtl" className="max-w-5xl mx-auto space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 border border-amber-600/30 p-4 sm:p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-md">
            🔍
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 font-spiritual">
              اكتشاف الفروق الخمسة (Spot the Differences)
            </h2>
            <p className="text-xs text-stone-400">
              دقق النظر في الصورتين وانقر على أي اختلاف تكتشفه مباشرة في أي من اللوحتين.
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

      {/* Control & Scene Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-400 font-bold">المشهد:</span>
          {SCENES.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => {
                setSceneIdx(idx);
                setIsWin(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                sceneIdx === idx
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {sc.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={showHint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>تلميح ذكي</span>
          </button>
          <button
            type="button"
            onClick={handleResetScene}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition cursor-pointer font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة اللعب</span>
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-stone-300">
          <span className="font-bold text-amber-400">الفروق المكتشفة: {foundCount} من {totalCount}</span>
        </div>
      </div>

      {/* Dual Image Comparison Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Image: Image A */}
        <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-spiritual font-bold text-amber-200">
            <span>اللوحة (أ): المشهد الأصلي</span>
            <span className="text-stone-400 text-[11px] font-sans">اضغط هنا أو على اللوحة الأخرى</span>
          </div>
          <div
            onClick={handleImageClick}
            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-800 hover:border-amber-500/50 transition cursor-crosshair shadow-inner bg-stone-950 select-none"
          >
            <img src={currentScene.imageA} alt="لوحة أ" className="w-full h-full object-cover pointer-events-none" />

            {/* Found Markers on Image A */}
            {currentScene.differences.map((diff) => (
              diff.found && (
                <div
                  key={`marker-a-${diff.id}`}
                  style={{
                    position: 'absolute',
                    top: `${diff.yPercent}%`,
                    left: `${diff.xPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${diff.radiusPercent * 2.2}%`,
                    height: `${diff.radiusPercent * 2.2}%`,
                  }}
                  className="rounded-full border-2 border-emerald-400 bg-emerald-500/25 ring-4 ring-emerald-500/20 animate-pulse pointer-events-none flex items-center justify-center text-white text-xs font-bold"
                >
                  ✓
                </div>
              )
            ))}

            {/* Hint Pulse */}
            {activeHintId !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: `${currentScene.differences.find((d) => d.id === activeHintId)?.yPercent}%`,
                  left: `${currentScene.differences.find((d) => d.id === activeHintId)?.xPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-400/30 ring-8 ring-amber-400/20 animate-ping pointer-events-none"
              />
            )}
          </div>
        </div>

        {/* Right Image: Image B with Alterations */}
        <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-spiritual font-bold text-amber-200">
            <span>اللوحة (ب): المشهد المعدّل</span>
            <span className="text-stone-400 text-[11px] font-sans">دقق في الفروق الدقيقة</span>
          </div>
          <div
            onClick={handleImageClick}
            className="relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-800 hover:border-amber-500/50 transition cursor-crosshair shadow-inner bg-stone-950 select-none"
          >
            <img src={currentScene.imageB} alt="لوحة ب" className="w-full h-full object-cover pointer-events-none" />

            {/* Visual Differences Simulated on Image B */}
            {/* Diff 1 modification overlay */}
            <div
              style={{
                position: 'absolute',
                top: `${currentScene.differences[0].yPercent}%`,
                left: `${currentScene.differences[0].xPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-7 h-7 rounded-full bg-amber-600/70 backdrop-blur-[1px] border border-amber-300 pointer-events-none flex items-center justify-center text-[10px]"
            >
              ✦
            </div>

            {/* Diff 2 modification overlay */}
            <div
              style={{
                position: 'absolute',
                top: `${currentScene.differences[1].yPercent}%`,
                left: `${currentScene.differences[1].xPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-8 h-8 rounded-full bg-stone-900/80 border border-stone-500 pointer-events-none flex items-center justify-center text-[9px] text-amber-300"
            >
              📜
            </div>

            {/* Diff 3 modification overlay */}
            <div
              style={{
                position: 'absolute',
                top: `${currentScene.differences[2].yPercent}%`,
                left: `${currentScene.differences[2].xPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="w-6 h-6 rounded-full bg-emerald-800/80 border border-emerald-400 pointer-events-none flex items-center justify-center text-[9px]"
            >
              ⭐
            </div>

            {/* Found Markers on Image B */}
            {currentScene.differences.map((diff) => (
              diff.found && (
                <div
                  key={`marker-b-${diff.id}`}
                  style={{
                    position: 'absolute',
                    top: `${diff.yPercent}%`,
                    left: `${diff.xPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${diff.radiusPercent * 2.2}%`,
                    height: `${diff.radiusPercent * 2.2}%`,
                  }}
                  className="rounded-full border-2 border-emerald-400 bg-emerald-500/25 ring-4 ring-emerald-500/20 animate-pulse pointer-events-none flex items-center justify-center text-white text-xs font-bold"
                >
                  ✓
                </div>
              )
            ))}

            {/* Hint Pulse */}
            {activeHintId !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: `${currentScene.differences.find((d) => d.id === activeHintId)?.yPercent}%`,
                  left: `${currentScene.differences.find((d) => d.id === activeHintId)?.xPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-400/30 ring-8 ring-amber-400/20 animate-ping pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Discovered Items Checklist */}
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl space-y-3">
        <h4 className="font-spiritual text-sm font-bold text-amber-200">
          قائمة الفروق في {currentScene.title}:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {currentScene.differences.map((diff, i) => (
            <div
              key={diff.id}
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 transition ${
                diff.found
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-stone-950 border-stone-800 text-stone-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{diff.found ? '✅' : '⏳'}</span>
                <span>{diff.found ? diff.name : `فرق خفي رقم ${i + 1}`}</span>
              </div>
              {diff.found && <span className="text-[10px] text-emerald-400 font-mono">+30 نقطة</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Victory Banner */}
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
              🎉 عبقري! اكتشفت جميع الفروق الخمسة بنجاح
            </h3>
            <p className="text-xs text-stone-300">
              قوة ملاحظتك وبصرك الروحي الثاقب مكنتك من حل اللغز ونلت 150 نقطة بركة!
            </p>
            <div className="flex gap-2 justify-center pt-1">
              <button
                type="button"
                onClick={() => {
                  const nextScene = (sceneIdx + 1) % SCENES.length;
                  setSceneIdx(nextScene);
                  setIsWin(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-md"
              >
                الانتقال للمشهد التالي ➔
              </button>
              <button
                type="button"
                onClick={handleResetScene}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 transition cursor-pointer"
              >
                إعادة هذا المشهد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpotDifferencesGame;
