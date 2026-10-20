import React, { useState, useId, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Compass,
  ChevronLeft,
  Flame,
  MousePointerClick,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  Quote,
  Star,
  Zap,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export interface WheelSection {
  id: string;
  name: string;
  shortName: string;
  line1?: string;
  line2?: string;
  icon: string;
  color: string;
  description: string;
  verse?: string;
  verseRef?: string;
  patristicQuote?: string;
  patristicSaint?: string;
  onOpen: () => void;
  badge?: string;
  category?: 'competitions' | 'spiritual' | 'library' | 'community';
  items?: { title: string; subtitle: string; onClick?: () => void }[];
}

interface FortuneWheelProps {
  sections: WheelSection[];
  selectedSection: WheelSection | null;
  onSelectSection?: (section: WheelSection) => void;
  onReset?: () => void;
}

// Helper: polar coordinates to cartesian (0 degrees = 12 o'clock, clockwise)
function polarToCartesian(radius: number, angleInDegrees: number) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad),
  };
}

// Helper: generate SVG slice wedge path
function getSectorPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
  const p1 = polarToCartesian(outerR, startAngle);
  const p2 = polarToCartesian(outerR, endAngle);
  const p3 = polarToCartesian(innerR, endAngle);
  const p4 = polarToCartesian(innerR, startAngle);

  return `M ${p4.x} ${p4.y} L ${p1.x} ${p1.y} A ${outerR} ${outerR} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y} Z`;
}

export const FortuneWheel: React.FC<FortuneWheelProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  onReset,
}) => {
  const [spinDegree, setSpinDegree] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isDirectAligning, setIsDirectAligning] = useState<boolean>(false);
  const [hoveredSection, setHoveredSection] = useState<WheelSection | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [spinSpeedMode, setSpinSpeedMode] = useState<'normal' | 'fast' | 'blessed'>('normal');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mokarasa_wheel_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [visitedToday, setVisitedToday] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mokarasa_visited_sections_today');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ angle: number; time: number; hasMoved: boolean } | null>(null);
  const filterId = useId();

  const totalSections = sections.length || 12;
  const sectorAngle = 360 / totalSections;

  const toggleFavorite = (secId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(secId) ? prev.filter((id) => id !== secId) : [...prev, secId];
      try {
        localStorage.setItem('mokarasa_wheel_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
    soundManager.playTick();
  };

  const markVisited = (secId: string) => {
    setVisitedToday((prev) => {
      if (prev.includes(secId)) return prev;
      const next = [...prev, secId];
      try {
        localStorage.setItem('mokarasa_visited_sections_today', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const triggerDeceleratingTicks = () => {
    const tickDelays = [
      50, 110, 180, 260, 350, 450, 560, 680, 820, 980,
      1160, 1370, 1610, 1890, 2210, 2580, 3000, 3400,
    ];
    tickDelays.forEach((delay) => {
      setTimeout(() => {
        soundManager.playTick();
      }, delay);
    });
  };

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#10b981', '#38bdf8'],
      });
    } catch {}
  };

  const handleSpinWheel = (targetIndexOverride?: number) => {
    if (isSpinning || sections.length === 0) return;
    setIsSpinning(true);
    setIsDirectAligning(false);
    soundManager.playTick();
    triggerDeceleratingTicks();

    const targetIndex =
      targetIndexOverride !== undefined
        ? targetIndexOverride
        : Math.floor(Math.random() * sections.length);

    const targetLandingAngle = (360 - (targetIndex * sectorAngle)) % 360;
    const currentMod = ((spinDegree % 360) + 360) % 360;
    let diff = targetLandingAngle - currentMod;
    if (diff <= 0) diff += 360;

    const spins = spinSpeedMode === 'fast' ? 4 : spinSpeedMode === 'blessed' ? 8 : 6;
    const duration = spinSpeedMode === 'fast' ? 2.5 : spinSpeedMode === 'blessed' ? 4.5 : 3.8;

    const newDegree = spinDegree + spins * 360 + diff;
    setSpinDegree(newDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = sections[targetIndex];
      markVisited(chosen.id);
      if (typeof onSelectSection === 'function') {
        onSelectSection(chosen);
      }
      soundManager.playVictory();
      triggerCelebrationConfetti();
    }, duration * 1000);
  };

  const handleDirectSelect = (sec: WheelSection, idx: number) => {
    if (isSpinning) return;
    soundManager.playTick();

    const targetLandingAngle = (360 - (idx * sectorAngle)) % 360;
    const currentMod = ((spinDegree % 360) + 360) % 360;
    let diff = targetLandingAngle - currentMod;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    setIsDirectAligning(true);
    setSpinDegree((prev) => prev + diff);

    setTimeout(() => {
      setIsDirectAligning(false);
      markVisited(sec.id);
      if (typeof onSelectSection === 'function') {
        onSelectSection(sec);
      }
    }, 450);
  };

  const getAngleFromEvent = (e: React.PointerEvent) => {
    if (!wheelContainerRef.current) return 0;
    const rect = wheelContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    return Math.atan2(y, x) * (180 / Math.PI);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning) return;
    const angle = getAngleFromEvent(e);
    dragStartRef.current = { angle, time: Date.now(), hasMoved: false };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || isSpinning) return;
    const currentAngle = getAngleFromEvent(e);
    const delta = Math.abs(currentAngle - dragStartRef.current.angle);
    if (delta > 8) {
      dragStartRef.current.hasMoved = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const { angle, time, hasMoved } = dragStartRef.current;
    dragStartRef.current = null;

    if (hasMoved && !isSpinning) {
      const endAngle = getAngleFromEvent(e);
      const elapsed = Math.max(50, Date.now() - time);
      let angleDiff = endAngle - angle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      const velocity = Math.abs(angleDiff) / elapsed;
      if (velocity > 0.15) {
        handleSpinWheel();
      }
    }
  };

  const handleResetWheel = () => {
    if (typeof onReset === 'function') {
      onReset();
    }
  };

  const handleCopyBlessing = (sec: WheelSection) => {
    const textToCopy = `✦ بركة من قسم: «${sec.name}» ✦\n\n📖 آية اليوم:\n«${sec.verse || ''}»\n${sec.verseRef ? `— ${sec.verseRef}` : ''}\n\n🕊️ همسة آبائية:\n«${sec.patristicQuote || ''}»\n${sec.patristicSaint ? `— ${sec.patristicSaint}` : ''}\n\nتطبيق حسب قلب الله`;
    navigator.clipboard?.writeText(textToCopy);
    soundManager.playCorrect();
    setCopiedToast('تم نسخ بركة وآية اليوم بنجاح!');
    setTimeout(() => setCopiedToast(null), 3000);
  };

  // Filter sections if activeCategoryFilter is applied
  const filteredSections = sections.filter((sec) => {
    if (activeCategoryFilter === 'all') return true;
    if (activeCategoryFilter === 'favorites') return favorites.includes(sec.id);
    return sec.category === activeCategoryFilter;
  });

  return (
    <div className="rounded-3xl bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-12 border-2 border-amber-500/80 shadow-[0_0_60px_rgba(245,158,11,0.25)] relative overflow-hidden text-center space-y-8 my-4">
      {copiedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-900 text-emerald-100 text-xs font-bold px-6 py-3 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Radiant Background Glow & Decorative Auras */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="max-w-2xl mx-auto space-y-3 relative z-10">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/90 border border-amber-500/60 text-amber-300 text-xs font-bold shadow-lg">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>عجلة الأقسام الروحية التفاعلية • حسب قلب الله</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/90 border border-amber-600/40 text-stone-300 text-xs shadow-md">
            <span>🌿 المكتسبات اليومية:</span>
            <strong className="text-amber-400">{visitedToday.length}</strong>
            <span>من {sections.length}</span>
          </div>
        </div>

        <h2 className="font-spiritual text-3xl sm:text-4xl font-bold text-amber-100 tracking-wide drop-shadow-md">
          عجلة البركة والجهاد الروحي
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
          اسحب العجلة بيدك، انقر فوق أي قسم، أو اضغط على «يلا نلف!» لدوران روحاني مبارك يختار لك وجهتك اليومية.
        </p>

        {/* Speed and Mode Selector Pills */}
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          <span className="text-[11px] text-stone-400 font-bold ml-1">نمط الدوران:</span>
          <button
            onClick={() => setSpinSpeedMode('normal')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              spinSpeedMode === 'normal'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            عادي (3.8 ثوانٍ)
          </button>
          <button
            onClick={() => setSpinSpeedMode('fast')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              spinSpeedMode === 'fast'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            سريع (2.5 ثوانٍ)
          </button>
          <button
            onClick={() => setSpinSpeedMode('blessed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              spinSpeedMode === 'blessed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            مبارك متأنٍ (4.5 ثوانٍ)
          </button>
        </div>
      </div>

      {/* Main Wheel View with Majestic Glow Frame */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 py-4">
        <div
          ref={wheelContainerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing group"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-400/10 to-amber-600/20 blur-xl group-hover:scale-105 transition duration-500 pointer-events-none" />

          {/* Top Golden Fixed Pointer */}
          <div
            className={`absolute -top-3 z-40 transition-transform duration-150 ${
              isSpinning ? 'animate-bounce-subtle scale-110' : ''
            }`}
          >
            <svg width="48" height="52" viewBox="0 0 44 48" className="filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)]">
              <defs>
                <linearGradient id={`${filterId}-pointerGrad`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>
              <polygon points="6,4 38,4 22,46" fill={`url(#${filterId}-pointerGrad)`} stroke="#78350f" strokeWidth="2" />
              <circle
                cx="22"
                cy="16"
                r="6"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="1.5"
                className={isSpinning ? 'animate-pulse' : ''}
              />
            </svg>
          </div>

          {/* Rotating Wheel Container */}
          <div
            className="w-full h-full rounded-full relative flex items-center justify-center shadow-2xl"
            style={{
              transform: `rotate(${spinDegree}deg)`,
              transition: isSpinning
                ? `transform ${spinSpeedMode === 'fast' ? 2.5 : spinSpeedMode === 'blessed' ? 4.5 : 3.8}s cubic-bezier(0.12, 0.85, 0.2, 1)`
                : isDirectAligning
                ? 'transform 0.45s ease-out'
                : 'none',
            }}
          >
            <svg
              viewBox="-220 -220 440 440"
              className="w-full h-full filter drop-shadow-[0_0_40px_rgba(217,119,6,0.4)]"
            >
              <defs>
                <radialGradient id={`${filterId}-rim`} cx="50%" cy="50%" r="50%">
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="92%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>
                <radialGradient id={`${filterId}-centerHub`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#292524" />
                  <stop offset="70%" stopColor="#1c1917" />
                  <stop offset="100%" stopColor="#451a03" />
                </radialGradient>
              </defs>

              <circle cx="0" cy="0" r="210" fill="none" stroke={`url(#${filterId}-rim)`} strokeWidth="14" />
              <circle cx="0" cy="0" r="202" fill="none" stroke="#78350f" strokeWidth="2.5" />

              {/* Sectors */}
              {sections.map((sec, idx) => {
                const startAngle = idx * sectorAngle - sectorAngle / 2;
                const endAngle = idx * sectorAngle + sectorAngle / 2;
                const midAngle = idx * sectorAngle;
                const isSelected = selectedSection?.id === sec.id;
                const isHovered = hoveredSection?.id === sec.id;
                const pathData = getSectorPath(startAngle, endAngle, 200, 46);

                return (
                  <g
                    key={sec.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectSelect(sec, idx);
                    }}
                    onMouseEnter={() => setHoveredSection(sec)}
                    onMouseLeave={() => setHoveredSection(null)}
                    className="cursor-pointer transition-opacity duration-200"
                    style={{ opacity: isSpinning ? 0.95 : 1 }}
                  >
                    <path
                      d={pathData}
                      fill={sec.color}
                      stroke={isSelected ? '#fde047' : '#f59e0b'}
                      strokeWidth={isSelected ? '4' : '1.5'}
                      className="transition-all duration-200"
                      style={{
                        filter: isHovered || isSelected ? 'brightness(1.25)' : 'none',
                      }}
                    />

                    <g transform={`rotate(${midAngle})`}>
                      <text
                        x="0"
                        y="-160"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="22"
                        className="select-none pointer-events-none"
                      >
                        {sec.icon}
                      </text>

                      <text
                        x="0"
                        y="-118"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#ffffff"
                        fontWeight="800"
                        fontSize="11.5"
                        className="select-none pointer-events-none font-spiritual"
                        style={{
                          filter: 'drop-shadow(0px 1px 4px rgba(0,0,0,0.95))',
                        }}
                      >
                        {sec.line1 && sec.line2 ? (
                          <>
                            <tspan x="0" dy="-7">
                              {sec.line1}
                            </tspan>
                            <tspan x="0" dy="14">
                              {sec.line2}
                            </tspan>
                          </>
                        ) : (
                          <tspan x="0" dy="0">
                            {sec.shortName || sec.name}
                          </tspan>
                        )}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Decorative Rim Studs */}
              {sections.map((_, idx) => {
                const angle = idx * sectorAngle;
                const pos = polarToCartesian(210, angle);
                return (
                  <circle
                    key={`stud-${idx}`}
                    cx={pos.x}
                    cy={pos.y}
                    r="3.5"
                    fill="#fef08a"
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Center Decorative Hub */}
              <circle
                cx="0"
                cy="0"
                r="46"
                fill={`url(#${filterId}-centerHub)`}
                stroke="#f59e0b"
                strokeWidth="4"
                className="cursor-pointer hover:scale-105 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpinWheel();
                }}
              />
              <circle
                cx="0"
                cy="0"
                r="40"
                fill="none"
                stroke="#78350f"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text
                x="0"
                y="-6"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="20"
                className="select-none pointer-events-none"
              >
                ✝️
              </text>
              <text
                x="0"
                y="16"
                textAnchor="middle"
                dominantBaseline="central"
                fill="#fde047"
                fontWeight="900"
                fontSize="11"
                className="select-none pointer-events-none font-spiritual tracking-wide"
              >
                تدوير
              </text>
            </svg>
          </div>
        </div>

        {/* Hover / Status Quick Tooltip */}
        <div className="min-h-[2.5rem] flex items-center justify-center">
          {isSpinning ? (
            <div className="px-5 py-2 rounded-2xl bg-amber-950/90 border border-amber-500/60 text-amber-300 text-xs font-bold animate-pulse shadow-lg flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-spin" />
              <span>جاري دوران العجلة بالبركة والتوقف عند القسم المناسب...</span>
            </div>
          ) : hoveredSection ? (
            <div className="px-5 py-2 rounded-2xl bg-amber-950/95 border border-amber-400 text-amber-200 text-xs font-bold shadow-md flex items-center gap-2">
              <span>✨ انقر لاختيار:</span>
              <strong className="text-white">{hoveredSection.name}</strong>
            </div>
          ) : (
            <div className="text-xs text-stone-400 flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/60 border border-stone-800">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
              <span>اضغط على أي ضلع لاختياره، أو اسحب العجلة بيدك، أو اضغط زر التدوير</span>
            </div>
          )}
        </div>

        {/* Spin Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => handleSpinWheel()}
            disabled={isSpinning}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-base sm:text-lg shadow-[0_10px_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition cursor-pointer disabled:opacity-50 flex items-center gap-3 border border-amber-200"
          >
            <Sparkles className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'العجلة تدور الآن...' : 'يلا نلف! (تدوير العجلة)'}</span>
          </button>
        </div>
      </div>

      {/* RESULT CARD */}
      {selectedSection && (
        <div className="relative z-10 max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-stone-900/95 border-2 border-amber-400/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-5 animate-fade-in text-right">
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>✦ القسم المختار بركة اليوم ✦</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyBlessing(selectedSection)}
                className="text-xs text-stone-300 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700 shadow-xs"
                title="نسخ الآية والهمسة الآبائية"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>نسخ البركة</span>
              </button>
              <button
                onClick={handleResetWheel}
                className="text-xs text-stone-300 hover:text-amber-300 font-bold flex items-center gap-1 transition cursor-pointer px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>اختيار آخر</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0 mt-0.5">
              {selectedSection.icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                  {selectedSection.name}
                </h3>
                {selectedSection.badge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedSection.badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {selectedSection.description}
              </p>
            </div>
          </div>

          {(selectedSection.verse || selectedSection.patristicQuote) && (
            <div className="rounded-2xl bg-gradient-to-r from-stone-950 via-amber-950/60 to-stone-950 border border-amber-500/40 p-4 space-y-3 shadow-inner">
              {selectedSection.verse && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>آية مباركة للقسم:</span>
                  </div>
                  <p className="font-spiritual text-xs sm:text-sm text-amber-100/90 leading-relaxed font-semibold">
                    «{selectedSection.verse}»
                  </p>
                  {selectedSection.verseRef && (
                    <span className="text-[10px] text-amber-300/80 block font-mono">
                      — {selectedSection.verseRef}
                    </span>
                  )}
                </div>
              )}

              {selectedSection.patristicQuote && (
                <div className="space-y-1 pt-2 border-t border-amber-900/50">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                    <Quote className="w-3.5 h-3.5" />
                    <span>همسة آبائية:</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed italic">
                    «{selectedSection.patristicQuote}»
                  </p>
                  {selectedSection.patristicSaint && (
                    <span className="text-[10px] text-amber-300/80 block font-semibold">
                      — {selectedSection.patristicSaint}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub-items and Shortcuts */}
          {selectedSection.items && selectedSection.items.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-amber-900/50">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>الميزات والمكونات المحدثة داخل هذا القسم:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSection.items.map((sub, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={sub.onClick || selectedSection.onOpen}
                    className="p-3 rounded-2xl bg-stone-950/80 hover:bg-amber-950/50 border border-stone-800 hover:border-amber-500/60 text-right transition cursor-pointer flex flex-col justify-between group shadow-xs"
                  >
                    <span className="text-xs font-bold text-amber-200 group-hover:text-amber-100 flex items-center justify-between">
                      <span>{sub.title}</span>
                      <ChevronLeft className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition transform group-hover:-translate-x-0.5" />
                    </span>
                    <span className="text-[10px] text-stone-400 truncate mt-1">{sub.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
            <button
              onClick={selectedSection.onOpen}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer border border-amber-400/60"
            >
              <span>افتح القسم الآن</span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetWheel}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-stone-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة التدوير / اختيار آخر</span>
            </button>
          </div>
        </div>
      )}

      {/* DIRECT SELECTION CHIPS & FILTER TABS */}
      <div className="relative z-10 pt-6 border-t border-amber-900/40 text-right space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">أقسام العجلة والمكتسبات الروحية:</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                activeCategoryFilter === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              الكل ({sections.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('favorites')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                activeCategoryFilter === 'favorites'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 text-stone-400 hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 text-amber-400" />
              <span>المفضلة ({favorites.length})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredSections.map((sec) => {
            const originalIdx = sections.findIndex((s) => s.id === sec.id);
            const isSelected = selectedSection?.id === sec.id;
            const isVisited = visitedToday.includes(sec.id);
            const isFav = favorites.includes(sec.id);

            return (
              <div
                key={sec.id}
                className={`p-3 rounded-2xl text-right text-xs transition flex items-center justify-between gap-2 border group ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-300 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-stone-200 border-stone-800 hover:border-amber-600/50'
                }`}
              >
                <button
                  onClick={() => handleDirectSelect(sec, originalIdx)}
                  disabled={isSpinning}
                  className="flex items-center gap-2.5 truncate cursor-pointer flex-1 text-right"
                >
                  <span className="text-lg shrink-0">{sec.icon}</span>
                  <div className="truncate">
                    <span className="truncate font-spiritual text-xs font-bold block">
                      {sec.shortName || sec.name}
                    </span>
                    {sec.badge && (
                      <span className="text-[9px] text-amber-300/80 truncate block">{sec.badge}</span>
                    )}
                  </div>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => toggleFavorite(sec.id, e)}
                    className="p-1 rounded-lg text-stone-400 hover:text-amber-400 transition"
                    title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  {isVisited && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" title="تمت زيارته اليوم" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
