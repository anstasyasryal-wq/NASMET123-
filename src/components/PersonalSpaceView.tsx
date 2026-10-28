import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Lock, ChevronLeft, Plus, Check, Heart, Sparkles, BookOpen, Trash2, RotateCcw, Award, Download, Upload, ShieldCheck } from 'lucide-react';

interface PersonalSpaceViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
  onOpenHeavenlyMessage?: () => void;
  onOpenSpiritualJournal?: () => void;
}

const STORAGE_NOTES_KEY = 'mokarasa_personal_notes_v1';
const STORAGE_ROSARY_TOTAL_KEY = 'mokarasa_rosary_lifetime_total';

export const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
  onOpenHeavenlyMessage,
  onOpenSpiritualJournal,
}) => {
  const [targetKnots, setTargetKnots] = useState<33 | 50 | 100>(33);
  const [rosaryCount, setRosaryCount] = useState<number>(0);
  const [completedLaps, setCompletedLaps] = useState<number>(0);
  const [lifetimeTotal, setLifetimeTotal] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_ROSARY_TOTAL_KEY);
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  const [notes, setNotes] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_NOTES_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      'تأمل اليوم: المحبة تتأنى وترفق ولا تحسد.',
      'صلاة خاصة من أجل سلام الكنيسة وافتقاد المرضى والضعفاء وسلام العالم.',
    ];
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const handleRosaryClick = () => {
    soundManager.playTick();
    const nextCount = rosaryCount + 1;
    const newTotal = lifetimeTotal + 1;
    setLifetimeTotal(newTotal);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ROSARY_TOTAL_KEY, String(newTotal));
    }

    if (nextCount >= targetKnots) {
      soundManager.playCorrect();
      setRosaryCount(0);
      setCompletedLaps((prev) => prev + 1);
      
      // Add bonus consecration points
      if (typeof window !== 'undefined') {
        const curBonus = parseInt(localStorage.getItem('mokarasa_consecration_bonus') || '0', 10);
        const added = targetKnots === 100 ? 30 : targetKnots === 50 ? 20 : 15;
        localStorage.setItem('mokarasa_consecration_bonus', String(curBonus + added));
      }
      
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setRosaryCount(nextCount);
    }
  };

  const handleResetRosary = () => {
    soundManager.playTick();
    setRosaryCount(0);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    soundManager.playCorrect();
    setNotes((prev) => [newNote.trim(), ...prev]);
    setNewNote('');
  };

  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const handleExportBackup = () => {
    soundManager.playCorrect();
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: currentUser,
      notes,
      lifetimeRosary: lifetimeTotal,
      consecrationBonus: typeof window !== 'undefined' ? localStorage.getItem('mokarasa_consecration_bonus') || '0' : '0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `حسب_قلب_الله_نسخة_احتياطية_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('تم حفظ وتنزيل النسخة الاحتياطية بنجاح 📁');
    setTimeout(() => setBackupMessage(null), 3500);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.notes && Array.isArray(parsed.notes)) {
          setNotes(parsed.notes);
          localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(parsed.notes));
        }
        if (parsed.lifetimeRosary !== undefined) {
          setLifetimeTotal(Number(parsed.lifetimeRosary));
          localStorage.setItem(STORAGE_ROSARY_TOTAL_KEY, String(parsed.lifetimeRosary));
        }
        if (parsed.consecrationBonus) {
          localStorage.setItem('mokarasa_consecration_bonus', String(parsed.consecrationBonus));
        }
        soundManager.playCorrect();
        setBackupMessage('تمت استعادة البيانات الروحية بنجاح! ✝️');
        setTimeout(() => setBackupMessage(null), 4000);
      } catch {
        setBackupMessage('ملف النسخة الاحتياطية غير صالح.');
        setTimeout(() => setBackupMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteNote = (idx: number) => {
    soundManager.playTick();
    setNotes((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right" dir="rtl">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-stone-900 to-amber-950 text-stone-100 p-6 sm:p-8 border border-sky-600/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-900/60 border border-sky-600/40 text-sky-300 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-sky-400" />
          <span>المساحة الشخصية ومذكرات المخدع السرية</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📝 الفضاء الشخصي وسجل مخدعي
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مساحة آمنة وخاصة بك لحفظ طلبات صلاتك، وتأملاتك الفردية، وحبل صلاة يسوع الإلكتروني مع إمكانية ضبط عدد العقد وحساب الأدوار التراكمية.
        </p>
      </div>

      {/* Spiritual Journal Banner */}
      {onOpenSpiritualJournal && (
        <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border border-amber-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📖</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                المجلة الروحية ومذكرات المخدع المفصلة
              </h4>
              <p className="text-xs text-stone-300">
                سجل تأملاتك اليومية وتدريباتك الشخصية وحفظها في مساحتك الخاصة للرجوع إليها لاحقاً.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSpiritualJournal}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>افتح المجلة الروحية</span>
          </button>
        </div>
      )}

      {/* Heavenly Father's Message Card */}
      {onOpenHeavenlyMessage && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-500/40 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">💌</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                صندوق رسائل أبيك السماوي (٣٦٦ رسالة بعدد أيام السنة بدون تكرار)
              </h4>
              <p className="text-xs text-stone-300">
                رسالة فريدة ومباركة لكل يوم من أيام السنة، مع إمكانية سحب رسائل بالقرعة وحفظ المفضلة.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHeavenlyMessage}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>اسحب رسالتك الآن</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rosary Counter */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 text-center space-y-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400">
                مسبحة صلاة يسوع
              </span>
              <button
                onClick={handleResetRosary}
                className="text-[10px] text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                title="تصفير الدورة الحالية"
              >
                <RotateCcw className="w-3 h-3" />
                <span>تصفير</span>
              </button>
            </div>

            {/* Target knot selector */}
            <div className="flex items-center justify-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800 mb-2">
              {([33, 50, 100] as const).map((knots) => (
                <button
                  key={knots}
                  onClick={() => {
                    soundManager.playTick();
                    setTargetKnots(knots);
                    setRosaryCount(0);
                  }}
                  className={`flex-1 py-1 text-[11px] rounded-lg font-bold transition cursor-pointer ${
                    targetKnots === knots
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {knots} عقدة
                </button>
              ))}
            </div>

            <p className="text-xs text-amber-200/90 font-spiritual leading-relaxed">
              «يا ربي يسوع المسيح، ارحمني أنا الخاطئ»
            </p>
          </div>

          <div
            onClick={handleRosaryClick}
            className="w-32 h-32 rounded-full border-4 border-amber-400 bg-gradient-to-b from-stone-900 to-stone-950 flex flex-col items-center justify-center mx-auto cursor-pointer hover:scale-105 active:scale-95 transition shadow-2xl select-none"
          >
            <span className="text-3xl font-black text-amber-300 font-mono">
              {rosaryCount}
            </span>
            <span className="text-[10px] text-stone-400 font-bold">من {targetKnots}</span>
          </div>

          <div className="space-y-1 border-t border-stone-800 pt-3">
            <div className="flex justify-between text-[11px] text-stone-300">
              <span>الأدوار المكتملة اليوم:</span>
              <span className="font-mono font-bold text-emerald-400">{completedLaps}</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-300">
              <span>إجمالي التلاوات:</span>
              <span className="font-mono font-bold text-amber-300">{lifetimeTotal}</span>
            </div>
            <p className="text-[10px] text-stone-400 pt-1">
              اضغط الدائرة مع كل تلاوة لصلاة يسوع
            </p>
          </div>
        </div>

        {/* Notes & Diary */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
              مذكرات المخدع والطلبات الخاصة
            </h3>
            <span className="text-[11px] text-stone-400 font-mono">
              {notes.length} مدونة محفوظة
            </span>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="اكتب تأملاً أو طلبة صلاة جديدة..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {notes.map((n, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 flex items-start justify-between gap-3 group hover:border-stone-700 transition"
              >
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span className="leading-relaxed">{n}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteNote(i)}
                  className="text-stone-500 hover:text-rose-400 p-1 rounded-lg transition cursor-pointer shrink-0"
                  title="حذف المدونة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Backup & Restore Data Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-spiritual text-sm sm:text-base font-bold text-amber-200">
              النسخ الاحتياطي وحفظ بيانات المخدع
            </h3>
          </div>
          {backupMessage && (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-xl animate-fade-in">
              {backupMessage}
            </span>
          )}
        </div>
        <p className="text-xs text-stone-300 leading-relaxed">
          يمكنك تصدير نسخة احتياطية من جميع مذكراتك الشخصية، وإحصائيات المسبحة، ومسار التكريس إلى ملف خاص بك للرجوع إليه أو نقله لهاتف آخر بأمان.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-stone-950" />
            <span>تصدير نسخة احتياطية (ملف JSON)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-xs transition flex items-center gap-2 cursor-pointer active:scale-95">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>استعادة من نسخة احتياطية</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
