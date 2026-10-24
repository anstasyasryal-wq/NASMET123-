import React, { memo } from 'react';
import { Sparkles, X, Heart, Flower2, Compass, Sun, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';
import gardenBgImage from '../assets/images/spiritual_garden_welcome_1792857164705.jpg';

interface WelcomeSplashModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeSplashModal: React.FC<WelcomeSplashModalProps> = memo(({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleStartJourney = () => {
    soundManager.playCorrect();
    onClose();
  };

  const handleSkip = () => {
    soundManager.playTick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fade-in select-none" dir="rtl">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh] text-right">
        
        {/* Background Image Header with Morning Light & Garden */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <img
            src={gardenBgImage}
            alt="حديقتك مع الله - مدخل روحي"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          <div className="absolute inset-0 bg-amber-950/20 mix-blend-overlay" />

          {/* Close / Skip top corner button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-900 border border-amber-500/30 text-amber-200 text-xs font-bold transition flex items-center gap-1 backdrop-blur-md cursor-pointer active:scale-95"
            title="تخطّي الترحيب"
          >
            <span>تخطّي الترحيب</span>
            <X className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Header Title Badge */}
          <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md shadow-md">
                <Flower2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>حديقتك مع الله 🌿</span>
              </div>
              <h2 className="font-spiritual font-black text-2xl sm:text-3xl text-amber-100 tracking-wide drop-shadow-md">
                حسب قلب الله
              </h2>
            </div>
            <div className="hidden sm:block text-left text-[11px] text-amber-200/80 font-mono">
              لننمو في المحبة ونعيش بالقرب منه
            </div>
          </div>
        </div>

        {/* Scrollable Message Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 text-stone-200 text-xs sm:text-sm leading-relaxed font-spiritual bg-stone-950">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-3 shadow-inner">
            <p className="text-amber-100 font-bold text-sm sm:text-base leading-snug flex items-center gap-2">
              <span>أهلًا بيك في حسب قلب الله</span>
              <span className="text-amber-400">🤍</span>
            </p>

            <p className="text-stone-300 leading-relaxed">
              تخيّل إن حياتك الروحية حديقة جميلة، زرع الله فيها بذورًا ثمينة… بذور المحبة، والإيمان، والسلام، والرجاء.
            </p>

            <p className="text-stone-300 leading-relaxed">
              ومع زحمة الحياة، وكثرة المسؤوليات، والانشغال، والتجارب اللي بنمر بيها، ممكن بعض الأزهار تذبل، وبعض الأغصان تتشابك، وننسى نهتم بأجزاء مهمة في علاقتنا بربنا وبالناس وبنفسنا.
            </p>

            <p className="text-stone-300 leading-relaxed">
              لكن ده مش معناه إن الحكاية انتهت، ولا إنك لازم تكون كامل علشان تبدأ من جديد.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 font-bold space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 text-sm">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>دعوة النعمة الإلهية</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              ربنا مش مستني منك حديقة مثالية… هو بيدعوك تمشي معاه، وتسمح لنعمته ترعى اللي جواك. 🌿
            </p>
          </div>

          <div className="space-y-3 text-stone-300 leading-relaxed px-1">
            <p>
              رحلتك هنا مش سباق علشان تبقى أفضل من غيرك، ولا قائمة طويلة من الواجبات اللي لازم تخلصها.
            </p>

            <p>
              دي مساحة تساعدك تقرّب من ربنا بمحبة، وتفهم نفسك في نوره، وتنمّي فضائلك، وتتعلم تحوّل إيمانك إلى حياة… في صلاتك، وكلامك، وعلاقاتك، وخدمتك، وتفاصيل يومك الصغيرة.
            </p>

            <p>
              مش لازم تغيّر كل حاجة مرة واحدة. ابدأ بخطوة صغيرة، بصلاة صادقة، بمحبة تقدمها، أو بفضيلة تحاول تعيشها.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-semibold space-y-2">
            <p className="leading-relaxed">
              ومع كل خطوة، افتكر إنك مش ماشي لوحدك… وإن النمو الروحي رحلة نعيشها مع ربنا، يومًا بعد يوم. 🤍
            </p>
            <div className="pt-2 border-t border-amber-700/30 text-amber-300 font-bold text-center">
              «أهلًا بيك في رحلتك… حسب قلب الله — لننمو في المحبة، ونعيش بالقرب منه.»
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-4 sm:p-5 bg-stone-900 border-t border-amber-600/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={handleStartJourney}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-amber-600/25 transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-stone-950" />
            <span>نبدأ رحلتنا مع ربنا 🌿</span>
          </button>

          <button
            onClick={handleSkip}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            تخطّي الترحيب
          </button>
        </div>

      </div>
    </div>
  );
});

WelcomeSplashModal.displayName = 'WelcomeSplashModal';
export default WelcomeSplashModal;

