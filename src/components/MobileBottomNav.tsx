import React, { memo } from 'react';
import { AppView } from '../types';
import { soundManager } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import {
  Home,
  BookOpen,
  Heart,
  HelpCircle,
  Compass,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenMobileMenu: () => void;
  onOpenSpiritualGuide?: () => void;
  onOpenDirectory?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = memo(({
  currentView,
  onNavigate,
  onOpenMobileMenu,
  onOpenSpiritualGuide,
  onOpenDirectory,
}) => {
  const { t, dir } = useLanguage();

  const handleNavClick = (view: AppView) => {
    soundManager.playTick();
    onNavigate(view);
  };

  const handleGuideClick = () => {
    soundManager.playTick();
    if (onOpenSpiritualGuide) {
      onOpenSpiritualGuide();
    }
  };

  const handleDirectoryClick = () => {
    soundManager.playTick();
    if (onOpenDirectory) {
      onOpenDirectory();
    } else {
      onOpenMobileMenu();
    }
  };

  return (
    <nav
      aria-label="Navigation"
      dir={dir}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-amber-600/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-all"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      <div className="flex items-center justify-around px-1 py-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer select-none min-h-[48px] touch-manipulation ${
            currentView === 'home'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div
            className={`w-9 h-7 flex items-center justify-center rounded-xl transition ${
              currentView === 'home' ? 'bg-amber-500/20 shadow-xs' : ''
            }`}
          >
            <Home className={`w-5 h-5 transition-transform ${currentView === 'home' ? 'scale-110 text-amber-400' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {t('navHome')}
          </span>
        </button>

        {/* 2. Library */}
        <button
          onClick={() => handleNavClick('library')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer select-none min-h-[48px] touch-manipulation ${
            currentView === 'library'
              ? 'text-amber-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div
            className={`w-9 h-7 flex items-center justify-center rounded-xl transition ${
              currentView === 'library' ? 'bg-amber-500/20 shadow-xs' : ''
            }`}
          >
            <BookOpen className={`w-5 h-5 transition-transform ${currentView === 'library' ? 'scale-110 text-amber-400' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {t('navLibrary')}
          </span>
        </button>

        {/* 3. Closet / Spiritual Life */}
        <button
          onClick={() => handleNavClick('spiritual_life')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer select-none min-h-[48px] touch-manipulation ${
            currentView === 'spiritual_life' || currentView === 'prayer_fortress'
              ? 'text-rose-400 font-bold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <div
            className={`w-9 h-7 flex items-center justify-center rounded-xl transition ${
              currentView === 'spiritual_life' || currentView === 'prayer_fortress' ? 'bg-rose-500/20 shadow-xs' : ''
            }`}
          >
            <Heart className={`w-5 h-5 transition-transform ${currentView === 'spiritual_life' || currentView === 'prayer_fortress' ? 'scale-110 text-rose-400' : ''}`} />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            {t('navSpiritualLife')}
          </span>
        </button>

        {/* 4. Spiritual Guide */}
        <button
          onClick={handleGuideClick}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-400 hover:text-cyan-300 transition cursor-pointer select-none min-h-[48px] touch-manipulation"
        >
          <div className="w-9 h-7 flex items-center justify-center rounded-xl bg-cyan-950/60 border border-cyan-800/60">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap text-cyan-300">
            {t('navGuide')}
          </span>
        </button>

        {/* 5. Directory & More */}
        <button
          onClick={handleDirectoryClick}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-400 hover:text-amber-300 transition cursor-pointer select-none min-h-[48px] touch-manipulation"
        >
          <div className="w-9 h-7 flex items-center justify-center rounded-xl bg-stone-900 border border-amber-600/40">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap text-amber-300 font-bold">
            {t('navDirectory')}
          </span>
        </button>
      </div>
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';
