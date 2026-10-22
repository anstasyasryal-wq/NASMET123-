import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Bell,
  BellRing,
  Clock,
  Volume2,
  Sparkles,
  Check,
  Play,
  Sun,
  Moon,
  BookOpen,
  VolumeX,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PrayerReminderSetting {
  id: string;
  title: string;
  time: string; // "HH:MM"
  enabled: boolean;
  tone: 'coptic_bell' | 'agpeya_chime' | 'psalmody_flute' | 'harp_david';
  toneLabel: string;
  icon: string;
}

const DEFAULT_REMINDERS: PrayerReminderSetting[] = [
  {
    id: 'morning_prayer',
    title: 'صلاة باكر وقراءة إنجيل الصباح',
    time: '06:30',
    enabled: true,
    tone: 'coptic_bell',
    toneLabel: '🔔 ناقوس الكنيسة القبطية الهادئ',
    icon: '🌅',
  },
  {
    id: 'midday_psalms',
    title: 'صلاة الساعة السادسة ومزامير نصف النهار',
    time: '12:00',
    enabled: false,
    tone: 'agpeya_chime',
    toneLabel: '🕯️ رنين الأجبية والمخدع',
    icon: '☀️',
  },
  {
    id: 'evening_reflection',
    title: 'صلاة النوم ومحاسبة النفس الإنجيلية',
    time: '21:30',
    enabled: true,
    tone: 'harp_david',
    toneLabel: '🎻 قيثارة داود التأملية',
    icon: '🌙',
  },
];

const TONE_OPTIONS = [
  { id: 'coptic_bell', label: '🔔 ناقوس الكنيسة القبطية الهادئ', desc: 'نغمات رصينة لنداء الصلاة واليقظة الروحية' },
  { id: 'agpeya_chime', label: '🕯️ رنين الأجبية والمخدع', desc: 'رنين أوتار هادئ يدعو للخشوع وسكون المخدع' },
  { id: 'psalmody_flute', label: '🕊️ نغمة مزمار التسبيح', desc: 'نغمات هوائية لطيفة مهدئة للتأمل في كلمة الله' },
  { id: 'harp_david', label: '🎻 قيثارة داود التأملية', desc: 'ألحان داودية عذبة تبعث السلام في القلب' },
];

const STORAGE_KEY = 'mokarasa_prayer_reminders_v1';

export const ScheduledPrayerReminders: React.FC<{ currentUser?: User | null }> = ({ currentUser }) => {
  const [reminders, setReminders] = useState<PrayerReminderSetting[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_REMINDERS;
    try {
      const key = STORAGE_KEY + '_' + (currentUser?.id || 'guest');
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_REMINDERS;
  });

  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const lastTriggeredMinuteRef = useRef<string>('');

  // Save to storage
  const saveSettings = (newSettings: PrayerReminderSetting[]) => {
    setReminders(newSettings);
    if (typeof window !== 'undefined') {
      try {
        const key = STORAGE_KEY + '_' + (currentUser?.id || 'guest');
        localStorage.setItem(key, JSON.stringify(newSettings));
      } catch {
        // ignore
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const handleToggle = (id: string) => {
    soundManager.playTick();
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const nextEnabled = !r.enabled;
        if (nextEnabled) {
          requestNotificationPermission();
        }
        return { ...r, enabled: nextEnabled };
      }
      return r;
    });
    saveSettings(updated);
  };

  const handleTimeChange = (id: string, newTime: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, time: newTime } : r));
    saveSettings(updated);
  };

  const handleToneChange = (id: string, newTone: PrayerReminderSetting['tone']) => {
    const selectedOption = TONE_OPTIONS.find((t) => t.id === newTone);
    const updated = reminders.map((r) =>
      r.id === id
        ? {
            ...r,
            tone: newTone,
            toneLabel: selectedOption ? selectedOption.label : r.toneLabel,
          }
        : r
    );
    saveSettings(updated);
    // Play sample
    soundManager.playChurchTone(newTone);
  };

  const handlePreviewTone = (tone: string) => {
    soundManager.playChurchTone(tone);
  };

  // Background ticker checking time every 15 seconds
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      if (lastTriggeredMinuteRef.current === currentTimeStr) {
        return; // already triggered this minute
      }

      reminders.forEach((reminder) => {
        if (reminder.enabled && reminder.time === currentTimeStr) {
          lastTriggeredMinuteRef.current = currentTimeStr;
          // Trigger tone
          soundManager.playChurchTone(reminder.tone);
          setActiveAlert(`حان الآن موعد: ${reminder.title}`);
          confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });

          // Fire native browser notification if permitted
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('حسب قلب الله - موعد الصلاة', {
                body: `حان الآن موعد: ${reminder.title}. استعد لسكون المخدع والشركة مع الله ✝️`,
                icon: '/icons/icon-192.png',
              });
            } catch {
              // ignore
            }
          }

          // Auto dismiss banner after 12 seconds
          setTimeout(() => {
            setActiveAlert(null);
          }, 12000);
        }
      });
    };

    const interval = setInterval(checkSchedule, 30000);
    checkSchedule(); // initial check
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-[#1c1914] to-amber-950/80 border border-amber-600/40 p-6 sm:p-8 shadow-2xl space-y-6 text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-600/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 relative shadow-inner">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>تنبيهات المخدع والأجبية</span>
            </div>
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              🔔 التنبيهات الصوتية المجدولة للصلاة وقراءة الإنجيل
            </h3>
            <p className="text-xs text-stone-300">
              حدد مواعيد صلواتك وقراءاتك اليومية مع اختيار نغمات كنسية هادئة تعينك على التيقظ وسكون القلب.
            </p>
          </div>
        </div>
      </div>

      {/* Active Alert Banner */}
      {activeAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-spiritual font-bold text-sm shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 animate-spin" />
            <span>{activeAlert}</span>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="px-3 py-1 rounded-xl bg-black/30 hover:bg-black/50 text-xs transition"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
              r.enabled
                ? 'bg-stone-950/90 border-amber-500/60 shadow-lg'
                : 'bg-stone-950/40 border-stone-800 opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl p-2 rounded-xl bg-stone-900 border border-stone-800">
                  {r.icon}
                </span>

                {/* Toggle switch */}
                <button
                  onClick={() => handleToggle(r.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    r.enabled ? 'bg-amber-600' : 'bg-stone-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      r.enabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <h4 className="font-spiritual text-sm font-bold text-amber-100">
                  {r.title}
                </h4>
                <span className="text-[10px] text-stone-400">
                  {r.enabled ? 'التنبيه نشط يومياً' : 'التنبيه متوقف'}
                </span>
              </div>

              {/* Time Picker */}
              <div className="space-y-1">
                <label className="text-[11px] text-stone-300 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>وقت التنبيه</span>
                </label>
                <input
                  type="time"
                  value={r.time}
                  disabled={!r.enabled}
                  onChange={(e) => handleTimeChange(r.id, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-200 font-mono text-sm focus:border-amber-400 outline-none disabled:opacity-50"
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-1">
                <label className="text-[11px] text-stone-300 font-semibold flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>النغمة الكنسية المختارة</span>
                </label>
                <select
                  value={r.tone}
                  disabled={!r.enabled}
                  onChange={(e) =>
                    handleToneChange(r.id, e.target.value as PrayerReminderSetting['tone'])
                  }
                  className="w-full px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:border-amber-400 outline-none disabled:opacity-50"
                >
                  {TONE_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview Tone Button */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
              <span className="text-[10px] text-stone-400">معاينة الصوت:</span>
              <button
                type="button"
                onClick={() => handlePreviewTone(r.tone)}
                className="px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/40 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Play className="w-3 h-3 fill-amber-300" />
                <span>تجربة النغمة</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
