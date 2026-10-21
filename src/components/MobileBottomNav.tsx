import React, { memo } from 'react';
import { AppView } from '../types';
import { soundManager } from '../utils/audio';
import {
  Compass,
  Trophy,
  Shield,
  BookOpen,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = memo(({
  currentView,
  onNavigate,
  onOpenMobileMenu,
}) => {
  const handleNavClick = (view: AppView) => {
    soundManager.playTick();
    onNavigate(view);
  };

  const handleMenuClick = () => {
    soundManager.playTick();
    onOpenMobileMenu();
  };

  const tabs: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'العجلة', icon: Compass },
    { id: 'competitions_hub', label: 'المسابقات', icon: Trophy },
    { id: 'prayer_fortress', label: 'حصن الصلاة', icon: Shield },
    { id: 'library', label: 'المكتبة', icon: BookOpen },
  ];

  return (
    <nav
      aria-label="التنقل السفلي للموبايل"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-amber-600/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-all"
      style={{
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0.5rem))',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition cursor-pointer select-none min-h-[48px] touch-manipulation ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div
                className={`w-9 h-7 flex items-center justify-center rounded-xl transition ${
                  isActive ? 'bg-amber-500/20 shadow-xs' : ''
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-amber-400' : ''}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / Menu Drawer Button */}
        <button
          onClick={handleMenuClick}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-400 hover:text-stone-200 transition cursor-pointer select-none min-h-[48px] touch-manipulation"
        >
          <div className="w-9 h-7 flex items-center justify-center rounded-xl bg-stone-900 border border-stone-800">
            <Menu className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            المزيد
          </span>
        </button>
      </div>
    </nav>
  );
});

MobileBottomNav.displayName = 'MobileBottomNav';
