import React, { useState } from 'react';
import { User, ConsecrationVocation } from '../types';
import { setCurrentUser } from '../utils/competitionEngine';
import { soundManager } from '../utils/audio';
import { X, User as UserIcon, Shield, Check } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [vocation, setVocation] = useState<ConsecrationVocation>('مكرسة');
  const [diocese, setDiocese] = useState('إيبارشية المعادي وتوابعها');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundManager.playCorrect();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      vocation,
      diocese,
      totalScore: 0,
      currentStageId: 1,
      role: 'participant',
      completedStages: [],
      stageScores: {},
    };

    setCurrentUser(newUser);
    onSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="w-full max-w-md p-5 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/70 shadow-2xl text-stone-100 space-y-5 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪪</span>
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              بطاقة هوية المكرس / المشارك
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">
              الاسم الكامل (أو الاسم الكنسي الرهباني):
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: تاسوني سارة / أبونا أنطونيوس"
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">
              طبيعة الرتبة / الدعوة التكريسية:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['كاهن', 'مكرسة', 'راهب', 'راهبة'] as ConsecrationVocation[]).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setVocation(v)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition border min-h-[42px] touch-manipulation cursor-pointer ${
                    vocation === v
                      ? 'bg-amber-600 text-white border-amber-300 shadow-xs'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">
              الإيبارشية أو الدير التابع له:
            </label>
            <input
              type="text"
              value={diocese}
              onChange={(e) => setDiocese(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-sm outline-none"
            />
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px] touch-manipulation"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد وتسجيل البطاقة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundManager.playCorrect();
                const guestUser: User = {
                  id: `guest_${Date.now()}`,
                  name: 'مشارك مبارك (زائر)',
                  vocation,
                  diocese: diocese || 'كنيسة عامة - زائر مبارك',
                  totalScore: 0,
                  currentStageId: 1,
                  role: 'guest',
                  completedStages: [],
                  stageScores: {},
                };
                setCurrentUser(guestUser);
                onSuccess(guestUser);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[42px] touch-manipulation"
            >
              <span>🕊️</span>
              <span>دخول سريع كزائر (بدون تسجيل)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
