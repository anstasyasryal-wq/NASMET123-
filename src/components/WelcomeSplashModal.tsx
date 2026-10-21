import React, { useState, memo, useEffect } from 'react';
import { Sparkles, Heart, Shield, X, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const spiritualMessages = [
  {
    verse: "اِثْبُتُوا فِيَّ وَأَنَا فِيكُمْ. كَمَا أَنَّ الْغُصْنَ لَا يَقْدِرُ أَنْ يَأْتِيَ بِثَمَرٍ ذَاتِهِ إِنْ لَمْ يَثْبُتْ فِي الْكَسْنَةِ، كَذَلِكَ أَنْتُمْ أَيْضاً إِنْ لَمْ تَثْبُتُوا فِيَّ.",
    reference: "يوحنا 15: 4",
    theme: "ثبات وفرح",
    icon: "🕊️"
  },
  {
    verse: "فَرِحِينَ فِي الرَّجَاءِ، صَابِرِينَ فِي الضِّيقِ، مُواظِبِينَ عَلَى الصَّلاَةِ.",
    reference: "رومية 12: 12",
    theme: "سلام وتسبيح",
    icon: "🌟"
  },
  {
    verse: "الرَّبُّ نُورِي وَخَلاَصِي مِمَّنْ أَخَافُ؟ الرَّبُّ حِصْنُ حَيَاتِي مِمَّنْ أَرْتَعِبُ؟",
    reference: "مزمور 27: 1",
    theme: "طمأنينة وحماية",
    icon: "🛡️"
  },
  {
    verse: "ذُوقُوا وَانْظُرُوا مَا أَطْيَبَ الرَّبَّ! طُوبَى لِلرَّجُلِ الْمُتَوَكِّلِ عَلَيْهِ.",
    reference: "مزمور 34: 8",
    theme: "محبة إلهية",
    icon: "❤️"
  },
  {
    verse: "كُلُّ اشْتِيَاقِي هُوَ نَحْوَكَ يَا رب، وَنَفْسِي تَعْطَشُ إِلَيْكَ فِي أَرْضٍ نَاشِفَةٍ.",
    reference: "تأملات روحية",
    theme: "شوق للمخدع",
    icon: "✝️"
  }
];

export const WelcomeSplashModal: React.FC<WelcomeSplashModalProps> = memo(({
  isOpen,
  onClose,
}) => {
  const [randomMessage, setRandomMessage] = useState(spiritualMessages[0]);

  useEffect(() => {
    if (isOpen) {
      soundManager.playCorrect();
      const randomIndex = Math.floor(Math.random() * spiritualMessages.length);
      setRandomMessage(spiritualMessages[randomIndex]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/90 border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] p-6 sm:p-8 text-right overflow-hidden">
        
        {/* Decorative glowing background elements */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playTick();
            onClose();
          }}
          className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 items-center justify-center shadow-xl shadow-amber-600/30 text-3xl mb-3 animate-bounce">
            {randomMessage.icon}
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
            ✨ رسالة روحية مشرقة ليومك
          </div>
          <h2 className="font-spiritual font-black text-2xl sm:text-3xl text-amber-100 tracking-wide">
            حسب قلب الله
          </h2>
          <p className="text-amber-300/80 text-xs sm:text-sm mt-1">
            بوابة التكريس والعلوم الكنسية والتقييم الروحي المبهج
          </p>
        </div>

        {/* Daily Spiritual Quote Card */}
        <div className="bg-stone-950/80 border border-amber-500/30 rounded-2xl p-5 sm:p-6 mb-6 shadow-inner relative">
          <div className="absolute top-3 left-3 text-amber-500/20 text-4xl font-serif">“</div>
          <p className="font-spiritual text-amber-100 text-base sm:text-lg leading-relaxed text-center mb-3">
            {randomMessage.verse}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
            <span>{randomMessage.reference}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">{randomMessage.theme}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            soundManager.playCorrect();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-base shadow-xl shadow-amber-600/30 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>ابدأ رحلتك الروحية المبهجة</span>
        </button>

        <p className="text-center text-[10px] text-stone-400 mt-4">
          لتكن أيامكم مملوءة بالفرح السماوي والنعمة الإلهية
        </p>

      </div>
    </div>
  );
});

WelcomeSplashModal.displayName = 'WelcomeSplashModal';
export default WelcomeSplashModal;
