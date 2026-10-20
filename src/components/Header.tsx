import React, { useState } from 'react';
import { User, AppView } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { useHymnsAudio } from '../context/HymnsAudioContext';
import {
  Trophy,
  Volume2,
  VolumeX,
  User as UserIcon,
  BookOpen,
  Home,
  Menu,
  X,
  Sparkles,
  Heart,
  ScrollText,
  Moon,
  Sun,
  Gamepad2,
  HelpCircle,
  Compass,
  Users,
  Calendar,
  Headphones,
  ShieldCheck,
  Shield,
  Coins,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  onOpenLogin: () => void;
  onOpenRules: () => void;
  onOpenSpiritualGuide: () => void;
  onOpenReadingSettings?: () => void;
  onOpenHeavenlyMessage?: () => void;
  onOpenSaintsStickers?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRules,
  onOpenSpiritualGuide,
  onOpenHeavenlyMessage,
  onOpenSaintsStickers,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isNightMode, toggleNightMode } = useReadingTheme();
  const { isPlaying, openPlayerModal, currentOccasion } = useHymnsAudio();

  const toggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const navLinks = [
    { view: 'home' as AppView, label: 'الرئيسية (العجلة)', icon: Home },
    { view: 'prayer_fortress' as AppView, label: 'حصن الصلاة اليومي', icon: Shield },
    { view: 'virtue_jar' as AppView, label: 'حصالة الفضائل', icon: Coins },
    { view: 'consecrated_manual' as AppView, label: 'مرجع المكرس', icon: ScrollText },
    { view: 'spiritual_father' as AppView, label: 'أبوي الروحي وإعداد الاعتراف', icon: ShieldCheck },
    { view: 'monastic_oasis' as AppView, label: 'دستور المكرس', icon: Compass },
    { view: 'spiritual_life' as AppView, label: 'الحياة الروحية', icon: Heart },
    { view: 'library' as AppView, label: 'المكتبة والآباء', icon: BookOpen },
    { view: 'collective_challenges' as AppView, label: 'التحديات', icon: Users },
    { view: 'spiritual_calendar' as AppView, label: 'التقويم', icon: Calendar },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
        isNightMode
          ? 'bg-[#181614]/95 border-[#383229] text-[#e0d8cb]'
          : 'bg-stone-950/95 border-amber-600/30 text-stone-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none text-right"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition font-bold text-xl">
            ✝️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-spiritual font-black text-lg sm:text-xl tracking-wide text-amber-100">
                حسب قلب الله
              </span>
            </div>
            <p className="text-[10px] text-amber-400/80 hidden sm:block">
              بوابة التكريس والعلوم الكنسية والتقييم الروحي
            </p>
          </div>
        </div>

        {/* Desktop Quick Nav & Dropdown */}
        <nav className="hidden lg:flex items-center gap-1.5 relative">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              currentView === 'home'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية (العجلة)</span>
          </button>

          {/* Dropdown Menu for All Sections */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-600/30"
            >
              <span>أقسام التطبيق والخدمات</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-stone-950 border border-amber-600/40 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-fade-in text-right">
                <div className="text-[10px] font-bold text-amber-400/80 px-3 py-1 border-b border-stone-800 mb-1">
                  الخدمات الروحية والمكتسبات
                </div>
                {navLinks.slice(1).map((l) => {
                  const IconComponent = l.icon;
                  return (
                    <button
                      key={l.view}
                      onClick={() => {
                        onNavigate(l.view);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 text-right ${
                        currentView === l.view
                          ? 'bg-amber-600 text-white'
                          : 'text-stone-200 hover:bg-stone-900 hover:text-amber-200'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{l.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Daily Prayer Fortress Button */}
          <button
            onClick={() => onNavigate('prayer_fortress')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs transition cursor-pointer group ${
              currentView === 'prayer_fortress'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-gradient-to-r from-amber-600/20 via-stone-900 to-amber-700/20 hover:from-amber-600/30 text-amber-200 border-amber-500/40'
            }`}
            title="حصن الصلاة اليومي: مزمور وصلاة قصيرة حسب جدول الكنيسة مع المنبه"
          >
            <span className="text-sm group-hover:scale-125 transition-transform duration-200">🛡️</span>
            <span className="hidden md:inline">حصن الصلاة اليومي</span>
            <span className="md:hidden">حصن الصلاة</span>
          </button>

          {/* Spiritual Guide Button */}
          <button
            onClick={onOpenSpiritualGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/20 via-sky-600/30 to-sky-700/20 hover:from-sky-500/30 hover:to-sky-600/40 border border-sky-400/50 text-sky-200 text-xs font-bold shadow-sm transition cursor-pointer group"
            title="المرشد الروحي التفاعلي"
          >
            <span className="text-sm group-hover:scale-125 transition-transform duration-200">🛡️</span>
            <span className="hidden md:inline">المرشد الروحي</span>
            <span className="md:hidden">المرشد</span>
          </button>

          {/* Heavenly Message Button */}
          <button
            onClick={onOpenHeavenlyMessage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/30 to-amber-700/20 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-400/50 text-amber-200 text-xs font-bold shadow-sm transition cursor-pointer group"
            title="رسالة خاصة من أبيك السماوي بالحظ أو القرعة"
          >
            <span className="text-sm group-hover:scale-125 transition-transform duration-200">💌</span>
            <span className="hidden md:inline">رسالة من أبيك السماوي</span>
            <span className="md:hidden">رسالة اليوم</span>
          </button>

          {/* Saints Stickers Button */}
          {onOpenSaintsStickers && (
            <button
              onClick={onOpenSaintsStickers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/20 via-amber-600/30 to-amber-700/20 hover:from-yellow-500/30 hover:to-amber-600/40 border border-amber-400/50 text-amber-200 text-xs font-bold shadow-sm transition cursor-pointer group"
              title="استكر قديس اليوم والتنبيه على الفضائل (الشرق والغرب وكنائس العالم)"
            >
              <span className="text-sm group-hover:scale-125 transition-transform duration-200">🌟</span>
              <span className="hidden md:inline">استكر قديس اليوم</span>
              <span className="md:hidden">استكر القديس</span>
            </button>
          )}

          {/* Hymns & Chants Audio Player Button */}
          <button
            onClick={openPlayerModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold shadow-xs transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-600/30 border-amber-400 text-amber-200 animate-pulse'
                : 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-amber-400'
            }`}
            title="مشغل الترانيم والألحان الكنسية والتأملية"
          >
            <span className="text-sm">{currentOccasion.icon}</span>
            <Headphones className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">{isPlaying ? 'الترانيم تعمل ♫' : 'مشغل الترانيم'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition cursor-pointer"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleNightMode}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 transition cursor-pointer"
            title="تبديل وضع القراءة"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Rules / Guide */}
          <button
            onClick={onOpenRules}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>الدليل</span>
          </button>

          {/* User Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'تسجيل البطاقة'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-800 p-4 space-y-3 bg-stone-950 animate-fade-in text-right">
          <button
            onClick={() => {
              onOpenHeavenlyMessage?.();
              setMobileMenuOpen(false);
            }}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-amber-700/30 border border-amber-400/40 text-amber-200 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <span>💌</span>
            <span>رسالة من أبيك السماوي (اسحب رسالتك اليوم)</span>
          </button>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((l) => (
              <button
                key={l.view}
                onClick={() => {
                  onNavigate(l.view);
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-xl text-xs font-bold text-right transition flex items-center gap-2 ${
                  currentView === l.view
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-900 text-stone-200 hover:bg-stone-800'
                }`}
              >
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
