import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  LITURGICAL_HOURS_DATA,
  LiturgicalHourPrayer,
  getCurrentLiturgicalHour,
  LITURGICAL_DAYS_THEMES,
  EMERGENCY_ARROW_SHIELDS,
  EmergencyArrowShield,
  PrayerFortressAlertSetting,
  DEFAULT_FORTRESS_ALERTS,
} from '../data/prayerFortressData';
import {
  Shield,
  ChevronLeft,
  Clock,
  Bell,
  BellRing,
  Volume2,
  Sparkles,
  BookOpen,
  Heart,
  Copy,
  Check,
  Share2,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Flame,
  Award,
  Calendar,
  PenTool,
  Bookmark,
  VolumeX,
  Play,
  Pause,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DailyPrayerFortressProps {
  currentUser?: User | null;
  onBackToHome: () => void;
  onNavigateToSpiritualFather?: () => void;
  onNavigateToConsecratedManual?: () => void;
}

export const DailyPrayerFortress: React.FC<DailyPrayerFortressProps> = ({
  currentUser,
  onBackToHome,
  onNavigateToSpiritualFather,
  onNavigateToConsecratedManual,
}) => {
  // Liturgical State
  const [selectedHour, setSelectedHour] = useState<LiturgicalHourPrayer>(() => getCurrentLiturgicalHour());
  const [activeTab, setActiveTab] = useState<'church_hour' | 'alerts_scheduler' | 'arrow_rosary' | 'emergency_shields' | 'fortress_journal'>('church_hour');
  
  // Real-time clock for church detection
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  });

  // Liturgical Day of week
  const todayDayIndex = new Date().getDay();
  const dayLiturgicalTheme = LITURGICAL_DAYS_THEMES[todayDayIndex] || LITURGICAL_DAYS_THEMES[0];

  // Copied toast state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Completed hours today
  const [completedHours, setCompletedHours] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`mokarasa_fortress_completed_${todayStr}_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fortress Streak
  const [fortressStreak, setFortressStreak] = useState<number>(() => {
    if (typeof window === 'undefined') return 3;
    try {
      const saved = localStorage.getItem(`mokarasa_fortress_streak_${currentUser?.id || 'guest'}`);
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Fortress Journal Note
  const [journalNote, setJournalNote] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      return localStorage.getItem(`mokarasa_fortress_note_${todayStr}_${currentUser?.id || 'guest'}`) || '';
    } catch {
      return '';
    }
  });
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // Alert Settings
  const [alerts, setAlerts] = useState<PrayerFortressAlertSetting[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_FORTRESS_ALERTS;
    try {
      const saved = localStorage.getItem(`mokarasa_fortress_alerts_${currentUser?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : DEFAULT_FORTRESS_ALERTS;
    } catch {
      return DEFAULT_FORTRESS_ALERTS;
    }
  });

  // Browser Notification Status
  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // In-app Alert Modal
  const [activeAlarmTrigger, setActiveAlarmTrigger] = useState<PrayerFortressAlertSetting | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  // Arrow Prayer Rosary State
  const [rosaryCount, setRosaryCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`mokarasa_rosary_count_${todayStr}_${currentUser?.id || 'guest'}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [rosaryTarget, setRosaryTarget] = useState<number>(33);
  const [selectedArrowPrayer, setSelectedArrowPrayer] = useState<string>(
    '«يا ربي يسوع المسيح، ابن الله الحي، ارحمني أنا الخاطئ»'
  );

  // Background Ambient Sound State
  const [ambientPlaying, setAmbientPlaying] = useState(false);
  const ambientIntervalRef = useRef<any>(null);

  // Tick clock every minute to keep church hour fresh & check alerts
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentMinutes(mins);

      // Check alert times
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hh}:${mm}`;

      if (timeStr !== lastTriggeredMinuteRef.current) {
        // Find matching active alert
        const matched = alerts.find((a) => a.enabled && a.time === timeStr);
        if (matched) {
          lastTriggeredMinuteRef.current = timeStr;
          triggerAlert(matched);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alerts]);

  const triggerAlert = (alert: PrayerFortressAlertSetting) => {
    // Play selected church tone
    soundManager.playChurchTone(alert.tone);
    setActiveAlarmTrigger(alert);

    // Browser Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`🛡️ حصن الصلاة اليومي: ${alert.hourTitle}`, {
          body: `حان وقت الصلاة والمزمور المقترح في حصنك الروحي لتثبيت مسيرتك.`,
          icon: '/favicon.ico',
        });
      } catch {
        // Ignore notification errors
      }
    }
  };

  const handleRequestNotificationPermission = async () => {
    soundManager.playTick();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          soundManager.playVictory();
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
        }
      } catch {
        // Ignore
      }
    }
  };

  const handleToggleAlert = (id: string) => {
    soundManager.playTick();
    const updated = alerts.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    setAlerts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mokarasa_fortress_alerts_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleUpdateAlertTime = (id: string, newTime: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, time: newTime } : a));
    setAlerts(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mokarasa_fortress_alerts_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleUpdateAlertTone = (id: string, tone: PrayerFortressAlertSetting['tone'], label: string) => {
    soundManager.playTick();
    const updated = alerts.map((a) => (a.id === id ? { ...a, tone, toneLabel: label } : a));
    setAlerts(updated);
    soundManager.playChurchTone(tone);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`mokarasa_fortress_alerts_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
      } catch {}
    }
  };

  const handleTestTone = (tone: string) => {
    soundManager.playChurchTone(tone);
  };

  const handleCompleteHour = (hourId: string) => {
    soundManager.playVictory();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    const todayStr = new Date().toISOString().slice(0, 10);
    const updated = Array.from(new Set([...completedHours, hourId]));
    setCompletedHours(updated);
    
    // Increment streak if first completion today
    if (completedHours.length === 0) {
      const nextStreak = fortressStreak + 1;
      setFortressStreak(nextStreak);
      localStorage.setItem(`mokarasa_fortress_streak_${currentUser?.id || 'guest'}`, String(nextStreak));
    }

    try {
      localStorage.setItem(`mokarasa_fortress_completed_${todayStr}_${currentUser?.id || 'guest'}`, JSON.stringify(updated));
    } catch {}
  };

  const handleCopy = async (key: string, text: string) => {
    soundManager.playTick();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleShare = async (title: string, text: string) => {
    soundManager.playVictory();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
      }
    }
    // Fallback to clipboard
    handleCopy('psalm_and_prayer', text);
  };

  const handleSaveNote = () => {
    soundManager.playCorrect();
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`mokarasa_fortress_note_${todayStr}_${currentUser?.id || 'guest'}`, journalNote);
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 2500);
    } catch {}
  };

  // Rosary bead click
  const handleRosaryClick = () => {
    soundManager.playTick();
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {}
    }
    const next = rosaryCount + 1;
    setRosaryCount(next);
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`mokarasa_rosary_count_${todayStr}_${currentUser?.id || 'guest'}`, String(next));
    } catch {}

    if (next % rosaryTarget === 0) {
      soundManager.playVictory();
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleResetRosary = () => {
    soundManager.playTick();
    setRosaryCount(0);
    const todayStr = new Date().toISOString().slice(0, 10);
    try {
      localStorage.setItem(`mokarasa_rosary_count_${todayStr}_${currentUser?.id || 'guest'}`, '0');
    } catch {}
  };

  // Ambient sound player
  const toggleAmbientSound = () => {
    soundManager.playTick();
    if (ambientPlaying) {
      setAmbientPlaying(false);
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    } else {
      setAmbientPlaying(true);
      soundManager.playHarpOfDavid();
      ambientIntervalRef.current = setInterval(() => {
        soundManager.playHarpOfDavid();
      }, 7000);
    }
  };

  useEffect(() => {
    return () => {
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    };
  }, []);

  const currentLiturgicalHourNow = getCurrentLiturgicalHour();
  const isSelectedCurrentNow = selectedHour.id === currentLiturgicalHourNow.id;
  const isSelectedCompleted = completedHours.includes(selectedHour.id);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-fade-in text-right" dir="rtl">
      {/* Top Navigation & Return */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Ambient Harp toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              ambientPlaying
                ? 'bg-amber-600 text-white border-amber-500 shadow-sm animate-pulse'
                : 'bg-stone-900/90 text-amber-300 border-amber-800/40 hover:bg-stone-800'
            }`}
            title="أنغام قيثارة داود الهادئة للتأمل والمناجاة"
          >
            {ambientPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ambientPlaying ? 'أنغام القيثارة تعمل ♫' : 'تشغيل أنغام القيثارة'}</span>
          </button>

          {/* Streak Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>ثبات الحصن: {fortressStreak} أيام</span>
          </div>
        </div>
      </div>

      {/* Hero Fortress Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-950 via-[#1c140d] to-stone-950 border-2 border-amber-500/60 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Background Decorative Cross Pattern */}
        <div className="absolute top-0 left-0 p-8 opacity-5 text-amber-400 select-none pointer-events-none text-9xl font-spiritual">
          ✝
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>رفيق المكرس الروحي في كل ساعة</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-200/90 bg-stone-900/80 px-3 py-1 rounded-xl border border-amber-800/40">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>الساعة الكنسية الحالية:</span>
              <strong className="text-amber-300">{currentLiturgicalHourNow.title}</strong>
            </div>
          </div>

          <div>
            <h1 className="font-spiritual text-2xl sm:text-4xl font-extrabold text-amber-100 flex items-center gap-3">
              <span>🛡️ حِصْنُ الصَّلاَةِ اليَوْمِيِّ</span>
              <span className="text-xs sm:text-sm font-sans font-normal px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                مزامير وصلوات طقسية حية
              </span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
              اقتراح روحي دقيق لمزمور وصلاة قصيرة وتدريب مكرس ينبثق من جدول الكنيسة وساعاتها السبع، مع منبهات ذكية توقظ قلبك، ومسبحة السهام الروحية لحفظ مسيرتك.
            </p>
          </div>

          {/* Liturgical Day Highlight */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-stone-900/90 to-amber-950/60 border border-amber-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-200">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">{dayLiturgicalTheme.dayName}: </span>
                <span className="text-stone-300">{dayLiturgicalTheme.ecclesiasticalTheme}</span>
              </div>
            </div>
            <div className="text-[11px] text-amber-400/90 font-medium bg-amber-950/70 px-2.5 py-1 rounded-lg border border-amber-600/30 shrink-0">
              {dayLiturgicalTheme.specialPsalmSuggestion}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900/95 rounded-2xl border border-amber-800/40 overflow-x-auto text-xs font-bold scrollbar-none shadow-md">
        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('church_hour');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'church_hour'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-300" />
          <span>مزمور وصلاة الساعة الكنسية</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('alerts_scheduler');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'alerts_scheduler'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <BellRing className="w-4 h-4 text-amber-300" />
          <span>منبه الحصن ومواقيت التنبيه</span>
          {alerts.filter((a) => a.enabled).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('arrow_rosary');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'arrow_rosary'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>مسبحة صلاة يسوع السهمية</span>
          {rosaryCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px]">
              {rosaryCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('emergency_shields');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'emergency_shields'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-300" />
          <span>دروع الطوارئ والسهام السريعة</span>
        </button>

        <button
          onClick={() => {
            soundManager.playTick();
            setActiveTab('fortress_journal');
          }}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 cursor-pointer ${
            activeTab === 'fortress_journal'
              ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
              : 'text-stone-300 hover:bg-stone-800'
          }`}
        >
          <Bookmark className="w-4 h-4 text-amber-300" />
          <span>سجل الثبات ونبضات المخدع</span>
        </button>
      </div>

      {/* TAB 1: Canonical Hours & Dynamic Prayer Suggestion */}
      {activeTab === 'church_hour' && (
        <div className="space-y-6">
          {/* Canonical Hours Selector Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 font-bold px-1">
              <span>اختر ساعة كنسية لتصفح حصنها، أو اختر التلقائي حسب الوقت الفعلي:</span>
              <button
                onClick={() => {
                  soundManager.playTick();
                  setSelectedHour(getCurrentLiturgicalHour());
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition cursor-pointer border ${
                  isSelectedCurrentNow
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>العودة للساعة الحالية الآن</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {LITURGICAL_HOURS_DATA.map((h) => {
                const isCurrent = h.id === currentLiturgicalHourNow.id;
                const isSelected = h.id === selectedHour.id;
                const isDone = completedHours.includes(h.id);

                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      soundManager.playTick();
                      setSelectedHour(h);
                    }}
                    className={`p-3 rounded-2xl border text-right transition cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-900/60 via-stone-900 to-stone-950 border-amber-400 shadow-lg ring-1 ring-amber-400'
                        : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/60 hover:bg-stone-800/80'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-1.5 left-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xl">{h.icon}</span>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>

                    <div className="mt-2">
                      <div className="text-xs font-bold text-amber-100 truncate">
                        {h.title.split('(')[0]}
                      </div>
                      <div className="text-[10px] text-amber-400/80 flex items-center justify-between mt-0.5">
                        <span>{h.typicalTime}</span>
                        {isCurrent && <span className="text-[9px] text-emerald-300 font-bold">الآن</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Liturgical Hour Prayer & Psalm Card */}
          <div className="rounded-3xl bg-stone-950/90 border-2 border-amber-600/50 p-6 sm:p-8 space-y-6 shadow-xl relative">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedHour.icon}</span>
                  <div>
                    <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
                      <span>{selectedHour.title}</span>
                      {isSelectedCurrentNow && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          الساعة الآن
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-amber-300/80">{selectedHour.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => soundManager.playChurchTone('coptic_bell')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-700/40 text-amber-300 text-xs font-bold transition cursor-pointer"
                  title="استماع لناقوس الكنيسة لهذه الساعة"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>ناقوس الساعة</span>
                </button>

                <button
                  onClick={() =>
                    handleCopy(
                      'psalm_and_prayer',
                      `🛡️ حصن الصلاة اليومي - ${selectedHour.title}\n\n📖 المزمور المقترح: ${selectedHour.suggestedPsalmTitle}\n${selectedHour.suggestedPsalmText}\n\n🕊️ الصلاة القصيرة:\n${selectedHour.shortPrayer}\n\n⚓ آية التثبيت: ${selectedHour.anchorVerse} (${selectedHour.anchorVerseRef})\n\n📜 حكمة الآباء (${selectedHour.patristicSaint}):\n${selectedHour.patristicCompanionQuote}\n\n✝️ تطبيق «حسب قلب الله»`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
                  title="نسخ نص الحصن"
                >
                  {copiedKey === 'psalm_and_prayer' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{copiedKey === 'psalm_and_prayer' ? 'تم النسخ!' : 'نسخ'}</span>
                </button>

                <button
                  onClick={() =>
                    handleShare(
                      `حصن الصلاة اليومي - ${selectedHour.title}`,
                      `🛡️ حصن الصلاة اليومي - ${selectedHour.title}\n\n📖 المزمور المقترح: ${selectedHour.suggestedPsalmTitle}\n${selectedHour.suggestedPsalmText}\n\n🕊️ الصلاة القصيرة:\n${selectedHour.shortPrayer}\n\n⚓ آية التثبيت: ${selectedHour.anchorVerse} (${selectedHour.anchorVerseRef})\n\n📜 حكمة الآباء (${selectedHour.patristicSaint}):\n${selectedHour.patristicCompanionQuote}\n\n✝️ تطبيق «حسب قلب الله»`
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-600/40 text-amber-300 text-xs font-bold transition cursor-pointer"
                  title="مشاركة صلاة ومزمور هذه الساعة"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>مشاركة</span>
                </button>

                <button
                  onClick={() => handleCompleteHour(selectedHour.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
                    isSelectedCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSelectedCompleted ? 'أتممت صلاة الحصن ✓' : 'أتممت الصلاة الآن'}</span>
                </button>
              </div>
            </div>

            {/* Theological Theme */}
            <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300">🌿 المعنى اللاهوتي والكنسي للحصن: </strong>
              {selectedHour.theologicalTheme}
            </div>

            {/* Section 1: The Suggested Psalm */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                    📖
                  </div>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
                    المزمور الكنسي المقترح للحصن
                  </h3>
                </div>
                <span className="text-[11px] text-amber-400/80 bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                  {selectedHour.psalmReference}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/90 border border-amber-700/40 space-y-3">
                <div className="text-xs font-bold text-amber-300">{selectedHour.suggestedPsalmTitle}</div>
                <p className="font-spiritual text-sm sm:text-base text-stone-100 leading-loose tracking-wide selection:bg-amber-600/40">
                  {selectedHour.suggestedPsalmText}
                </p>
              </div>
            </div>

            {/* Section 2: The Short Prayer Tailored for the Consecrated */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  🕊️
                </div>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-emerald-200">
                  الصلاة القصيرة المنبعثة من قلب المكرس
                </h3>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-600/40 space-y-2">
                <p className="font-spiritual text-sm sm:text-base text-emerald-100 leading-relaxed italic">
                  {selectedHour.shortPrayer}
                </p>
              </div>
            </div>

            {/* Section 3: Anchor Verse & Patristic Quote */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Anchor Verse */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>آية التثبيت الروحي</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual">
                  {selectedHour.anchorVerse}
                </p>
                <div className="text-[11px] text-amber-400/70 text-left font-mono">
                  {selectedHour.anchorVerseRef}
                </div>
              </div>

              {/* Patristic Quote */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>حكمة الآباء القديسين</span>
                  </div>
                  <span className="text-[11px] text-amber-400/80">{selectedHour.patristicSaint}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                  {selectedHour.patristicCompanionQuote}
                </p>
              </div>
            </div>

            {/* Section 4: Consecrated Practical Exercise */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-stone-900 border border-amber-500/40 flex items-start gap-3">
              <span className="text-2xl shrink-0">🎯</span>
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-300">التدريب الروحي العملي لهذه الساعة:</div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {selectedHour.consecratedExercise}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Alerts & Reminder Scheduler */}
      {activeTab === 'alerts_scheduler' && (
        <div className="space-y-6">
          {/* Notification Permission Card */}
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/50 to-stone-900 border-2 border-amber-500/50 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-spiritual text-lg font-bold text-amber-100">
                  تنبيهات الحصن على الهاتف والمتصفح
                </h3>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-xl">
                فعّل إشعارات المتصفح ليتلقى هاتفك أو حاسوبك تنبيهاً مقدساً في موعد صلاة الحصن، حتى لو كان التطبيق مغلقاً أو في الخلفية.
              </p>
              <div className="text-[11px] text-stone-400">
                حالة الإشعارات الحالية:
                <span
                  className={`mr-1 font-bold ${
                    notificationPermission === 'granted'
                      ? 'text-emerald-400'
                      : notificationPermission === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {notificationPermission === 'granted'
                    ? 'مفعّلة بنجاح ✓'
                    : notificationPermission === 'denied'
                    ? 'محظورة من إعدادات المتصفح'
                    : 'في انتظار الإذن'}
                </span>
              </div>
            </div>

            <button
              onClick={handleRequestNotificationPermission}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-md ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-700/50 text-emerald-200 border border-emerald-500/50'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
              }`}
            >
              <BellRing className="w-4 h-4" />
              <span>{notificationPermission === 'granted' ? 'الإشعارات مفعلة ✓' : 'السماح بالإشعارات الآن'}</span>
            </button>
          </div>

          {/* Quick Schedule Helper Info */}
          <div className="text-xs text-stone-300 bg-stone-900/80 p-4 rounded-2xl border border-stone-800 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-200">كيف يعمل منبه الحصن؟ </strong>
              يمكنك تخصيص موعد دقيق لكل ساعة صلاة (ساعة ودقيقة)، واختيار النغمة الكنسية المحببة لقلبك. عند حلول الوقت يُطلق التطبيق رنين الناقوس أو الأجبية مع نص المزمور المقترح.
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-2xl border p-4 sm:p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  alert.enabled
                    ? 'bg-stone-950 border-amber-600/60 shadow-md'
                    : 'bg-stone-950/50 border-stone-800/80 opacity-75'
                }`}
              >
                {/* Alert Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${
                      alert.enabled
                        ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                        : 'bg-stone-900 text-stone-500 border-stone-800'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-100">{alert.name}</span>
                      <span className="text-[10px] text-amber-400/80 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                        {alert.hourTitle}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">{alert.toneLabel}</div>
                  </div>
                </div>

                {/* Time & Tone Configuration */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  {/* Time Input */}
                  <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-700">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <input
                      type="time"
                      value={alert.time}
                      onChange={(e) => handleUpdateAlertTime(alert.id, e.target.value)}
                      className="bg-transparent text-amber-200 font-mono text-sm font-bold focus:outline-none cursor-pointer"
                    />
                  </div>

                  {/* Tone Selector */}
                  <select
                    value={alert.tone}
                    onChange={(e) => {
                      const tone = e.target.value as PrayerFortressAlertSetting['tone'];
                      const labels: Record<string, string> = {
                        coptic_bell: '🔔 ناقوس الكنيسة القبطية الهادئ',
                        agpeya_chime: '🕯️ رنين الأجبية والمخدع',
                        psalmody_flute: '🕊️ نغمة مزمار التسبيح',
                        harp_david: '🎻 قيثارة داود التأملية',
                      };
                      handleUpdateAlertTone(alert.id, tone, labels[tone]);
                    }}
                    className="bg-stone-900 text-stone-200 text-xs rounded-xl px-2.5 py-2 border border-stone-700 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="coptic_bell">🔔 ناقوس الكنيسة القبطية</option>
                    <option value="agpeya_chime">🕯️ رنين الأجبية والمخدع</option>
                    <option value="psalmody_flute">🕊️ نغمة مزمار التسبيح</option>
                    <option value="harp_david">🎻 قيثارة داود التأملية</option>
                  </select>

                  {/* Test Tone Button */}
                  <button
                    onClick={() => handleTestTone(alert.tone)}
                    className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 transition cursor-pointer"
                    title="تجربة النغمة"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>

                  {/* Enable / Disable Switch */}
                  <button
                    onClick={() => handleToggleAlert(alert.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      alert.enabled
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    {alert.enabled ? 'مفعّل ✓' : 'معطّل'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Jesus Arrow Prayer Rosary */}
      {activeTab === 'arrow_rosary' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-stone-950 border-2 border-amber-600/50 p-6 sm:p-8 space-y-6 shadow-xl text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-3xl">🕊️</span>
              <h2 className="font-spiritual text-2xl font-bold text-amber-100">
                مسبحة الصلاة السهمية لحراسة الفكر
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                تدريب المكرس اليومي على ترديد صلاة يسوع أو الصلاة السهمية المختارة مع كل نقرة؛ ليكون اسم المخلص حصناً منيعاً يدفع كل تشتت وقلق.
              </p>
            </div>

            {/* Prayer Selector */}
            <div className="max-w-lg mx-auto flex flex-wrap justify-center gap-2">
              {[
                '«يا ربي يسوع المسيح، ابن الله الحي، ارحمني أنا الخاطئ»',
                '«يا مخلصي الصالح، كن لي حصناً ومعيناً وسنداً»',
                '«بصليبك المحيي يا سيدي، احرس حواسي وقلبي»',
                '«يا نور العالم، أشرق في ظلمة نفسي وطهرني»',
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playTick();
                    setSelectedArrowPrayer(p);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-spiritual transition cursor-pointer border ${
                    selectedArrowPrayer === p
                      ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-xs'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Target Selector */}
            <div className="flex items-center justify-center gap-2 text-xs">
              <span className="text-stone-400">الهدف اليومي:</span>
              {[33, 50, 100].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    soundManager.playTick();
                    setRosaryTarget(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer border ${
                    rosaryTarget === t
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-stone-900 text-stone-400 border-stone-800'
                  }`}
                >
                  {t} حبة
                </button>
              ))}
            </div>

            {/* Interactive Bead Button */}
            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div
                onClick={handleRosaryClick}
                className="w-44 h-44 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-white shadow-2xl flex flex-col items-center justify-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-200 border-4 border-amber-300/40 relative select-none group"
              >
                <div className="text-4xl font-extrabold font-mono tracking-tight drop-shadow-md">
                  {rosaryCount}
                </div>
                <div className="text-xs text-amber-100 font-medium mt-1">
                  انقر للصلاة
                </div>
                <div className="text-[10px] text-amber-200/80">
                  هدف: {rosaryTarget} حبة
                </div>

                {/* Bead Ring Pulse */}
                <span className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:animate-ping opacity-25" />
              </div>

              <div className="max-w-md p-3 rounded-2xl bg-stone-900 border border-stone-800 text-amber-200 font-spiritual text-sm">
                {selectedArrowPrayer}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleResetRosary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs transition cursor-pointer border border-stone-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط العداد</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Emergency Arrow Shields */}
      {activeTab === 'emergency_shields' && (
        <div className="space-y-4">
          <div className="text-xs text-stone-300 bg-stone-900/80 p-4 rounded-2xl border border-stone-800 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-200">دروع الطوارئ والسهام السريعة: </strong>
              تدابير سريعة مجهزة لكل حالة يمر بها المكرس في نهار خدمته؛ لتنتشل النفس فوراً وتردها إلى سلام المسيح وستره.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMERGENCY_ARROW_SHIELDS.map((shield) => (
              <div
                key={shield.id}
                className="rounded-2xl bg-stone-950 border border-amber-600/40 p-5 space-y-3.5 shadow-md hover:border-amber-500 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{shield.icon}</span>
                    <h3 className="font-bold text-sm sm:text-base text-amber-100">{shield.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleCopy(
                          shield.id,
                          `🛡️ ${shield.title}\n\n🕊️ الصلاة: ${shield.shortPrayer}\n📖 الآية: ${shield.psalmAnchor} (${shield.psalmAnchorRef})\n🩺 الإرشاد: ${shield.spiritualDirective}\n\n✝️ تطبيق «حسب قلب الله»`
                        )
                      }
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-amber-300 border border-stone-800 transition cursor-pointer"
                      title="نسخ درع الطوارئ"
                    >
                      {copiedKey === shield.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleShare(
                          `درع طوارئ روحي: ${shield.title}`,
                          `🛡️ ${shield.title}\n\n🕊️ الصلاة: ${shield.shortPrayer}\n📖 الآية: ${shield.psalmAnchor} (${shield.psalmAnchorRef})\n🩺 الإرشاد: ${shield.spiritualDirective}\n\n✝️ تطبيق «حسب قلب الله»`
                        )
                      }
                      className="p-1.5 rounded-lg bg-stone-900 text-amber-400 hover:text-amber-200 border border-amber-600/30 transition cursor-pointer"
                      title="مشاركة درع الطوارئ"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-stone-400 bg-stone-900/70 p-2 rounded-xl">
                  {shield.situation}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/30 space-y-1">
                  <div className="text-[11px] font-bold text-amber-300">الصلاة السريعة:</div>
                  <p className="font-spiritual text-xs sm:text-sm text-stone-100 italic">
                    {shield.shortPrayer}
                  </p>
                </div>

                <div className="text-xs text-stone-300 font-spiritual bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                  <span className="text-amber-400 font-bold">سند المزمور: </span>
                  {shield.psalmAnchor}
                </div>

                <div className="text-[11px] text-amber-300/90 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">🩺 الإجراء الروحي:</span>
                  <span>{shield.spiritualDirective}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Fortress Journal & Personal Notes */}
      {activeTab === 'fortress_journal' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-stone-950 border-2 border-amber-600/50 p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-400" />
                <h2 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-100">
                  سجل الثبات ونبضات المخدع
                </h2>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                سجل سري ومحمي في مخدعك لتدوين ما كلمه الله لقلبك اليوم أثناء تلاوة المزمور وحصن الصلاة.
              </p>
            </div>

            {/* Today's Completion Summary */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>صلوات الساعات المكتملة اليوم: </span>
                <strong className="text-amber-300">{completedHours.length} من 7 ساعات</strong>
              </div>

              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>أيام الثبات المتتالية: </span>
                <strong className="text-amber-300">{fortressStreak} أيام</strong>
              </div>
            </div>

            {/* Journal Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-300">
                ماذا قال لك الرب في صلاة اليوم؟ (تدوينة المخدع الخاصة)
              </label>
              <textarea
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="اكتب هنا ما لمسه قلبك في مزمور اليوم أو عهد قطعته أمام الله..."
                rows={5}
                className="w-full bg-stone-900 border border-stone-700 rounded-2xl p-4 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleSaveNote}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isNoteSaved ? 'تم حفظ النبضة بنجاح ✓' : 'حفظ نبضة اليوم في المخدع'}</span>
              </button>

              {isNoteSaved && (
                <span className="text-xs text-emerald-400 font-bold animate-fade-in">
                  تم حفظ الملاحظة محلياً بأمان!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* In-App Alarm Popup Modal when Alarm Triggers */}
      {activeAlarmTrigger && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-gradient-to-b from-stone-950 via-[#1c140d] to-stone-950 border-2 border-amber-400 p-6 space-y-4 text-center shadow-2xl animate-scale-up">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center text-3xl border-2 border-amber-400 animate-bounce">
              🔔
            </div>

            <div className="space-y-1">
              <h3 className="font-spiritual text-xl font-bold text-amber-100">
                {activeAlarmTrigger.name}
              </h3>
              <p className="text-xs text-amber-300">{activeAlarmTrigger.hourTitle}</p>
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              حان موعد الصلاة والمزمور المقترح في جدول كنيستك لتثبيت مسيرة تكريسك وحفظ سلام قلبك.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  soundManager.playCorrect();
                  setActiveAlarmTrigger(null);
                  setActiveTab('church_hour');
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-md hover:from-amber-500 hover:to-amber-600 cursor-pointer"
              >
                تلاوة المزمور والصلاة الآن
              </button>

              <button
                onClick={() => {
                  soundManager.playTick();
                  setActiveAlarmTrigger(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-900 text-stone-300 hover:text-white border border-stone-800 text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
