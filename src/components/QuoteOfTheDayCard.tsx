import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Sparkles,
  Quote,
  Share2,
  Copy,
  Check,
  RotateCw,
  Bookmark,
  Heart,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface FatherQuote {
  id: string;
  saint: string;
  title: string;
  quote: string;
  source: string;
  theme: string;
}

const DAILY_QUOTES: FatherQuote[] = [
  {
    id: 'q-1',
    saint: 'القديس أنطونيوس الكبير',
    title: 'أب الرهبان',
    quote: '«الذي يستر خطايا أخيه، يستتر الله عن خطاياه في يوم الدينونة. ومن لا يدن أحداً، لن يدان».',
    source: 'بستان الرهبان والأقوال',
    theme: 'المحبة وعدم الإدانة',
  },
  {
    id: 'q-2',
    saint: 'القديس أغسطينوس الهيبوني',
    title: 'معلم الكنيسة الجامعة',
    quote: '«صنعتنا يا رب لأجلك، ولسان حال قلبنا يظل قلقاً غير مستريح حتى يجد راحته فيك وحدك».',
    source: 'الاعترافات',
    theme: 'الشوق الإلهي',
  },
  {
    id: 'q-3',
    saint: 'القديس يوحنا ذهبي الفم',
    title: 'بطريرك القسطنطينية',
    quote: '«الصلاة هي الميناء الهادئ في العواصف، والكنز الذي لا ينفد، ورمز السلام الفائق الذي يفوق كل عقل».',
    source: 'شرح صلاة المخدع',
    theme: 'قوة الصلاة',
  },
  {
    id: 'q-4',
    saint: 'مار إسحق السرياني',
    title: 'أسقف نينوى',
    quote: '«القلب المتواضع يسكن فيه الله كملك في قصر من نور، وكل من اقترب منه يكتوي بنار محبته الإلهية».',
    source: 'المقالات الروحية',
    theme: 'الاتضاع والسكينة',
  },
  {
    id: 'q-5',
    saint: 'القديسة تيريز الأبيلية',
    title: 'معلمة الكنيسة',
    quote: '«لا يزعجك شيء ولا يخيفك شيء، كل شيء يزول والله لا يتغير؛ والصبر بالصلاة ينال كل شيء».',
    source: 'القلعة الداخلية',
    theme: 'الثقة بالله',
  },
  {
    id: 'q-6',
    saint: 'القديس أثناسيوس الرسولي',
    title: 'حامي الإيمان',
    quote: '«صار الكلمة انساناً لكي يصير الإنسان إلهاً بالنعمة، ولكي يرفع طبيعتنا الساقطة إلى مجد سماواته».',
    source: 'تجسد الكلمة',
    theme: 'التجسد والفداء',
  },
];

interface QuoteOfTheDayCardProps {
  currentUser?: User | null;
}

export const QuoteOfTheDayCard: React.FC<QuoteOfTheDayCardProps> = ({ currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // Deterministic daily index based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff) % DAILY_QUOTES.length;
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const currentQuote = DAILY_QUOTES[currentIndex];

  const handleNextQuote = () => {
    soundManager.playTick();
    setCurrentIndex((prev) => (prev + 1) % DAILY_QUOTES.length);
  };

  const handleCopyQuote = async () => {
    soundManager.playCorrect();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });

    const text = `📜 اقتباس أبوي مبارك:\n\n${currentQuote.quote}\n\n— ${currentQuote.saint} (${currentQuote.title})\nالمصدر: ${currentQuote.source}\n\n✝️ مشروع «حسب قلب الله»`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err: any) {
        console.error('Clipboard write failed:', err);
      }
    }
  };

  const handleShareWhatsApp = () => {
    soundManager.playVictory();
    const text = encodeURIComponent(
      `📜 اقتباس أبوي مبارك اليوم:\n\n${currentQuote.quote}\n\n— ${currentQuote.saint} (${currentQuote.title})\nالمصدر: ${currentQuote.source}\n\n✝️ مشروع «حسب قلب الله»`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-[#1e1712] to-amber-950/80 border border-amber-500/50 p-6 sm:p-8 shadow-2xl space-y-5 text-right relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-amber-600/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-wider">
              {currentQuote.theme}
            </span>
            <h3 className="font-spiritual text-lg font-bold text-amber-100">
              📜 اقتباس اليوم من أقوال الآباء
            </h3>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-800 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          title="اقتباس آخر"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">اقتباس عشوائي</span>
        </button>
      </div>

      {/* Quote Display Card */}
      <div className="p-6 rounded-2xl bg-stone-950/80 border border-amber-600/30 shadow-inner space-y-4 relative">
        <div className="absolute top-3 left-4 text-amber-500/10 font-serif text-6xl select-none pointer-events-none">
          “
        </div>

        <p className="font-spiritual text-base sm:text-lg text-amber-100/95 leading-relaxed italic relative z-10">
          {currentQuote.quote}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
          <div>
            <strong className="text-amber-300 font-spiritual text-sm block">
              {currentQuote.saint}
            </strong>
            <span className="text-stone-400 text-[11px]">{currentQuote.title}</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/40 text-amber-300 text-[10px] font-mono">
            {currentQuote.source}
          </span>
        </div>
      </div>

      {/* Action Buttons for Sharing */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyQuote}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'تم النسخ بنجاح' : 'نسخ النص'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-600/40 text-emerald-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>مشاركة عبر واتساب</span>
          </button>
        </div>

        <span className="text-[10px] text-stone-400 italic">
          💡 شارك حكمة الآباء لتعزيز التعليم الروحي في كل مكان.
        </span>
      </div>
    </div>
  );
};
