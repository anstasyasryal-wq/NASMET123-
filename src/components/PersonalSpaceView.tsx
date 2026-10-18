import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Lock, ChevronLeft, Plus, Check, Heart, Sparkles, BookOpen } from 'lucide-react';

interface PersonalSpaceViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
  onOpenHeavenlyMessage?: () => void;
  onOpenSpiritualJournal?: () => void;
}

export const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
  onOpenHeavenlyMessage,
  onOpenSpiritualJournal,
}) => {
  const [rosaryCount, setRosaryCount] = useState(0);
  const [notes, setNotes] = useState([
    'تأمل اليوم: المحبة تتأنى وترفق ولا تحسد.',
    'صلاة خاصة من أجل سلام الكنيسة وافتقاد المرضى والضعفاء.',
  ]);
  const [newNote, setNewNote] = useState('');

  const handleRosaryClick = () => {
    soundManager.playTick();
    setRosaryCount((prev) => (prev >= 33 ? 0 : prev + 1));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    soundManager.playCorrect();
    setNotes((prev) => [newNote.trim(), ...prev]);
    setNewNote('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
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
          مساحة آمنة وخاصة بك لحفظ طلبات صلاتك، وتأملاتك الفردية، وحبل صلاة يسوع الإلكتروني.
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
        <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 text-center space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 block mb-1">
              حبل صلاة يسوع (33 عقدة)
            </span>
            <p className="text-xs text-stone-400 font-spiritual">
              «يا ربي يسوع المسيح، ارحمني أنا الخاطئ»
            </p>
          </div>

          <div
            onClick={handleRosaryClick}
            className="w-32 h-32 rounded-full border-4 border-amber-400 bg-stone-950 flex flex-col items-center justify-center mx-auto cursor-pointer hover:scale-105 active:scale-95 transition shadow-xl"
          >
            <span className="text-3xl font-black text-amber-300 font-mono">
              {rosaryCount}
            </span>
            <span className="text-[10px] text-stone-400 font-bold">من 33</span>
          </div>

          <p className="text-[11px] text-stone-400">
            اضغط الدائرة مع كل تلاوة لصلاة يسوع
          </p>
        </div>

        {/* Notes & Diary */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4">
          <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-200">
            مذكرات المخدع والطلبات الخاصة
          </h3>

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
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </button>
          </form>

          <div className="space-y-2">
            {notes.map((n, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 flex items-start gap-2"
              >
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="leading-relaxed">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
