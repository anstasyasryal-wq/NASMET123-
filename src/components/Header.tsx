import React, { useState, memo } from 'react';
import { User, AppView } from '../types';
import { soundManager } from '../utils/audio';
import { useReadingTheme } from '../context/ReadingThemeContext';
import { useHymnsAudio } from '../context/HymnsAudioContext';
import { useLanguage } from '../context/LanguageContext';
import { prefetchView } from '../utils/preloadManager';
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
  Download,
  Share2,
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
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
  onOpenSilentRetreat?: () => void;
  onOpenWelcomeGarden?: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  currentView,
  currentUser,
  onNavigate,
  onOpenLogin,
  onOpenRules,
  onOpenSpiritualGuide,
  onOpenHeavenlyMessage,
  onOpenSaintsStickers,
  mobileMenuOpen: externalMobileMenuOpen,
  onToggleMobileMenu: externalToggleMobileMenu,
  onCloseMobileMenu: externalCloseMobileMenu,
  onOpenSilentRetreat,
  onOpenWelcomeGarden,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isNightMode, toggleNightMode } = useReadingTheme();
  const { isPlaying, openPlayerModal, currentOccasion } = useHymnsAudio();
  const { language, toggleLanguage } = useLanguage();

  const isMobileMenuOpen = externalMobileMenuOpen !== undefined ? externalMobileMenuOpen : internalMobileMenuOpen;

  const toggleMobileMenu = () => {
    soundManager.playTick();
    if (externalToggleMobileMenu) {
      externalToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen((prev) => !prev);
    }
  };

  const closeMobileMenu = () => {
    if (externalCloseMobileMenu) {
      externalCloseMobileMenu();
    } else {
      setInternalMobileMenuOpen(false);
    }
  };

  const toggleSound = () => {
    const nextState = soundManager.toggleMute();
    setIsMuted(nextState);
  };

  const navLinks = [
    { view: 'home' as AppView, label: 'الرئيسية (العجلة)', icon: Home, badge: 'المركز' },
    { view: 'competitions_hub' as AppView, label: 'المسابقات والمراحل', icon: Trophy, badge: 'المسابقة' },
    { view: 'prayer_fortress' as AppView, label: 'حصن الصلاة اليومي', icon: Shield, badge: 'يومي' },
    { view: 'virtue_jar' as AppView, label: 'حصالة الفضائل', icon: Coins, badge: 'تفاعلي' },
    { view: 'consecrated_manual' as AppView, label: 'مرجع المكرس', icon: ScrollText, badge: 'وثائقي' },
    { view: 'spiritual_father' as AppView, label: 'أبوي الروحي وإعداد الاعتراف', icon: ShieldCheck, badge: 'إرشاد' },
    { view: 'monastic_oasis' as AppView, label: 'دستور المكرس', icon: Compass, badge: 'نسكي' },
    { view: 'spiritual_life' as AppView, label: 'الحياة الروحية', icon: Heart, badge: 'مخدع' },
    { view: 'library' as AppView, label: 'المكتبة والآباء', icon: BookOpen, badge: 'مراجع' },
    { view: 'collective_challenges' as AppView, label: 'التحديات الجماعية', icon: Users, badge: 'مشاركات' },
    { view: 'spiritual_calendar' as AppView, label: 'التقويم الكنسي', icon: Calendar, badge: 'طقسي' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
        isNightMode
          ? 'bg-[#181614]/95 border-[#383229] text-[#e0d8cb]'
          : 'bg-stone-950/95 border-amber-600/30 text-stone-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div
          onClick={() => {
            onNavigate('home');
            closeMobileMenu();
          }}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none text-right shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-md shadow-amber-600/20 group-hover:scale-105 transition font-bold text-base sm:text-xl shrink-0">
            ✝️
          </div>
          <div className="min-w-0">
            <span className="font-spiritual font-black text-sm min-[380px]:text-base sm:text-xl tracking-wide text-amber-100 block truncate">
              حسب قلب الله
            </span>
            <p className="text-[9px] text-amber-400/80 hidden sm:block truncate">
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
                      onMouseEnter={() => prefetchView(l.view)}
                      onTouchStart={() => prefetchView(l.view)}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2.5 text-right cursor-pointer ${
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

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Consecration Tree & Daily Milestones Shortcut */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center justify-center gap-1.5 h-9 px-2.5 sm:h-10 sm:px-3 rounded-xl border text-xs font-bold shadow-xs transition cursor-pointer shrink-0 group ${
              currentView === 'home'
                ? 'bg-emerald-800/60 text-emerald-200 border-emerald-500'
                : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-600/40'
            }`}
            title="شجرة التكريس والإنجاز اليومي"
          >
            <span className="text-sm">🌳</span>
            <span className="hidden md:inline">شجرة التكريس</span>
          </button>

          {/* Daily Prayer Fortress Button - Desktop only */}
          <button
            onClick={() => onNavigate('prayer_fortress')}
            onMouseEnter={() => prefetchView('prayer_fortress')}
            onTouchStart={() => prefetchView('prayer_fortress')}
            className={`hidden lg:flex items-center gap-1.5 h-10 px-3 rounded-xl border text-xs font-bold shadow-xs transition cursor-pointer shrink-0 group ${
              currentView === 'prayer_fortress'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-gradient-to-r from-amber-600/20 via-stone-900 to-amber-700/20 hover:from-amber-600/30 text-amber-200 border-amber-500/40'
            }`}
            title="حصن الصلاة اليومي"
          >
            <span className="text-sm">🛡️</span>
            <span>حصن الصلاة</span>
          </button>

          {/* Spiritual Guide Button - Large screen only */}
          <button
            onClick={onOpenSpiritualGuide}
            className="hidden xl:flex items-center gap-1.5 h-10 px-3 rounded-xl bg-gradient-to-r from-sky-500/20 via-sky-600/30 to-sky-700/20 hover:from-sky-500/30 text-sky-200 border border-sky-400/50 text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            title="المرشد الروحي"
          >
            <span>🛡️</span>
            <span>المرشد الروحي</span>
          </button>

          {/* Hymns & Chants Audio Player Button */}
          <button
            onClick={openPlayerModal}
            className={`relative flex items-center justify-center w-9 h-9 sm:w-auto sm:px-3 sm:h-10 rounded-xl border text-xs font-bold transition cursor-pointer shrink-0 touch-manipulation active:scale-95 ${
              isPlaying
                ? 'bg-amber-600/25 border-amber-400/80 text-amber-200 shadow-sm shadow-amber-500/20'
                : 'bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-amber-400'
            }`}
            title="مشغل الترانيم والألحان الكنسية"
            aria-label="مشغل الترانيم"
          >
            <Headphones className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden xl:inline text-xs font-bold mr-1">
              {isPlaying ? 'الترانيم تعمل ♫' : 'ترانيم'}
            </span>
            {isPlaying && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-stone-950"></span>
              </span>
            )}
          </button>

          {/* Sound Toggle - Desktop only */}
          <button
            onClick={toggleSound}
            className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs ${
              isMuted
                ? 'bg-stone-900/70 hover:bg-stone-800 border-stone-800/80 text-stone-500'
                : 'bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-amber-400'
            }`}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
            aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Reading / Night Mode Toggle - Desktop only */}
          <button
            onClick={toggleNightMode}
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-amber-400 transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs"
            title={isNightMode ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="تبديل وضع القراءة"
          >
            {isNightMode ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Language Toggle Button - Desktop only */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-800 text-amber-300 font-bold text-xs transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs"
            title="تبديل اللغة (العربية / English)"
            aria-label="تبديل اللغة"
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Silent Retreat Button - Desktop only */}
          {onOpenSilentRetreat && (
            <button
              onClick={onOpenSilentRetreat}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs text-sm"
              title="خلوة الصمت السكونية"
              aria-label="خلوة الصمت"
            >
              🕯️
            </button>
          )}

          {/* Share App Button */}
          <button
            onClick={() => window.dispatchEvent(new Event('show-share-modal'))}
            className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:h-10 sm:px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs text-xs font-bold"
            title="مشاركة التطبيق مع الآخرين"
            aria-label="مشاركة التطبيق"
          >
            <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">مشاركة</span>
          </button>

          {/* Install App Button */}
          <button
            onClick={() => window.dispatchEvent(new Event('show-install-prompt'))}
            className="hidden md:flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs text-xs font-bold"
            title="تثبيت التطبيق على جهازك"
            aria-label="تثبيت التطبيق"
          >
            <Download className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تثبيت التطبيق</span>
          </button>

          {/* User Profile / Login Button */}
          <button
            onClick={onOpenLogin}
            className="relative flex items-center justify-center sm:justify-start gap-1.5 w-9 h-9 sm:w-auto sm:px-3 sm:h-10 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0 touch-manipulation active:scale-95 border border-amber-500/30"
            title={currentUser ? `حساب: ${currentUser.name}` : 'تسجيل الدخول'}
            aria-label="حساب المستخدم"
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline truncate max-w-[80px] md:max-w-[120px]">
              {currentUser ? currentUser.name.split(' ')[0] : 'تسجيل'}
            </span>
            {currentUser && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-950" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs ${
              isMobileMenuOpen
                ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                : 'bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-amber-400'
            }`}
            aria-label="القائمة الجانبية"
            title="القائمة الجانبية"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-amber-300" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay & Full Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col justify-end">
          <div
            className="bg-stone-950 border-t border-amber-500/40 rounded-t-3xl p-4 sm:p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 text-right"
            style={{ paddingBottom: 'max(5.5rem, env(safe-area-inset-bottom, 5.5rem))' }}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <span className="font-spiritual text-base font-bold text-amber-200">
                  لوحة الخدمات والأقسام
                </span>
              </div>
              <button
                onClick={closeMobileMenu}
                className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
                aria-label="إغلاق القائمة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Mobile Utility Controls Row */}
            <div className="grid grid-cols-4 gap-2 bg-stone-900/90 p-2 rounded-2xl border border-stone-800 text-center">
              <button
                onClick={toggleNightMode}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800/80 text-amber-300 transition cursor-pointer"
                title="الوضع النهاري / الليلي"
              >
                {isNightMode ? <Sun className="w-4 h-4 mb-1 text-amber-300" /> : <Moon className="w-4 h-4 mb-1 text-amber-400" />}
                <span className="text-[10px] font-bold">{isNightMode ? 'نهاري' : 'ليلي'}</span>
              </button>

              <button
                onClick={toggleSound}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800/80 text-amber-400 transition cursor-pointer"
                title="المؤثرات الصوتية"
              >
                {isMuted ? <VolumeX className="w-4 h-4 mb-1 text-stone-500" /> : <Volume2 className="w-4 h-4 mb-1 text-emerald-400" />}
                <span className="text-[10px] font-bold">{isMuted ? 'صامت' : 'مسموع'}</span>
              </button>

              <button
                onClick={toggleLanguage}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-stone-800/80 text-amber-300 transition cursor-pointer font-bold"
                title="تبديل اللغة"
              >
                <span className="text-xs font-mono mb-1 font-bold">{language === 'ar' ? 'EN' : 'AR'}</span>
                <span className="text-[10px] font-bold">{language === 'ar' ? 'English' : 'عربي'}</span>
              </button>

              <button
                onClick={() => window.dispatchEvent(new Event('show-install-prompt'))}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition cursor-pointer font-bold"
                title="تثبيت التطبيق"
              >
                <Download className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-[10px] font-bold">تثبيت</span>
              </button>
            </div>

            {/* Prominent Install & Share Mobile Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  window.dispatchEvent(new Event('show-install-prompt'));
                  closeMobileMenu();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-stone-950" />
                <span>تثبيت التطبيق 📱</span>
              </button>

              <button
                onClick={() => {
                  window.dispatchEvent(new Event('show-share-modal'));
                  closeMobileMenu();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-700/60 to-emerald-600/70 hover:from-emerald-600 text-emerald-100 font-bold text-xs border border-emerald-500/40 shadow-md transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-emerald-300" />
                <span>مشاركة التطبيق 💌</span>
              </button>
            </div>

            {/* User Quick Info in Drawer */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950/40 border border-amber-600/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <UserIcon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs block truncate">
                    {currentUser ? currentUser.name : 'مرحباً بك معنا'}
                  </span>
                  <span className="text-[10px] text-amber-400/80 block">
                    {currentUser ? `${currentUser.totalScore || 0} نقطة روحية` : 'سجّل الآن لتثبيت نقاطك ورتبتك'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenLogin();
                  closeMobileMenu();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
              >
                {currentUser ? 'بياناتي' : 'تسجيل'}
              </button>
            </div>

            {/* Quick Interactive Features Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  onNavigate('prayer_fortress');
                  closeMobileMenu();
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/80 to-stone-900 border border-amber-600/40 text-right flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span className="text-xl">🛡️</span>
                <div>
                  <strong className="text-amber-200 block text-xs">حصن الصلاة</strong>
                  <span className="text-[10px] text-stone-400">مزمور ومنبه</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenHeavenlyMessage?.();
                  closeMobileMenu();
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/80 to-stone-900 border border-amber-600/40 text-right flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span className="text-xl">💌</span>
                <div>
                  <strong className="text-amber-200 block text-xs">رسالة أبيك السماوي</strong>
                  <span className="text-[10px] text-stone-400">اسحب رسالتك</span>
                </div>
              </button>

              {onOpenSaintsStickers && (
                <button
                  onClick={() => {
                    onOpenSaintsStickers();
                    closeMobileMenu();
                  }}
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/80 to-stone-900 border border-amber-600/40 text-right flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="text-xl">🌟</span>
                  <div>
                    <strong className="text-amber-200 block text-xs">استكر قديس اليوم</strong>
                    <span className="text-[10px] text-stone-400">الفضائل اليومية</span>
                  </div>
                </button>
              )}

              <button
                onClick={() => {
                  onOpenSpiritualGuide();
                  closeMobileMenu();
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-sky-950/70 to-stone-900 border border-sky-600/40 text-right flex items-center gap-2.5 transition active:scale-95 cursor-pointer shadow-xs"
              >
                <span className="text-xl">🛡️</span>
                <div>
                  <strong className="text-sky-200 block text-xs">المرشد الروحي</strong>
                  <span className="text-[10px] text-stone-400">توجيه وحلول</span>
                </div>
              </button>
            </div>

            {/* Rules & Audio Quick Bar */}
            <div className="flex flex-col gap-2">
              {onOpenWelcomeGarden && (
                <button
                  onClick={() => {
                    onOpenWelcomeGarden();
                    closeMobileMenu();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 hover:from-amber-900 border border-amber-600/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>🌿 حديقتك مع الله (رسالة الترحيب الروحية)</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    openPlayerModal();
                    closeMobileMenu();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span>مشغل الترانيم والألحان</span>
                </button>

                <button
                  onClick={() => {
                    onOpenRules();
                    closeMobileMenu();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>دليل المسابقة</span>
                </button>
              </div>
            </div>

            {/* Complete Navigation Sections */}
            <div>
              <span className="text-[11px] font-bold text-amber-400/80 block mb-2 px-1">
                جميع الأقسام التفاعلية
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {navLinks.map((l) => {
                  const Icon = l.icon;
                  const isActive = currentView === l.view;

                  return (
                    <button
                      key={l.view}
                      onClick={() => {
                        onNavigate(l.view);
                        closeMobileMenu();
                      }}
                      onMouseEnter={() => prefetchView(l.view)}
                      onTouchStart={() => prefetchView(l.view)}
                      className={`p-3 rounded-xl text-xs font-bold text-right transition flex items-center justify-between cursor-pointer min-h-[44px] touch-manipulation ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-900/90 text-stone-200 hover:bg-stone-800 border border-stone-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                        <span>{l.label}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-amber-700/60 text-amber-100' : 'text-stone-400'
                      }`}>
                        {l.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = 'Header';
