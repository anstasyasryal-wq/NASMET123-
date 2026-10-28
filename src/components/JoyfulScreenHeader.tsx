import React, { memo } from 'react';
import { Home, Sparkles, Share2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { motion } from 'framer-motion';

interface JoyfulScreenHeaderProps {
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  onBackToHome: () => void;
}

export const JoyfulScreenHeader: React.FC<JoyfulScreenHeaderProps> = memo(({
  title,
  subtitle,
  icon,
  badge,
  onBackToHome,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-900/80 border border-amber-500/40 shadow-2xl relative overflow-hidden text-right"
    >
      {/* Background glow & decorative elements */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-10 -bottom-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-600/30 text-2xl sm:text-3xl shrink-0"
          >
            {icon}
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {badge}
              </span>
              <span className="text-amber-400/80 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                شاشة مستقلة ومرحبة
              </span>
            </div>
            <h1 className="font-spiritual font-black text-xl sm:text-2xl text-amber-100 tracking-wide">
              {title}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => {
              soundManager.playTick();
              window.dispatchEvent(new Event('show-share-modal'));
            }}
            className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
            title="مشاركة التطبيق والرابط العام"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>مشاركة</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTick();
              onBackToHome();
            }}
            className="px-4 py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-600/40 text-xs font-bold flex items-center gap-2 shadow-md transition cursor-pointer active:scale-95"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
});

JoyfulScreenHeader.displayName = 'JoyfulScreenHeader';
