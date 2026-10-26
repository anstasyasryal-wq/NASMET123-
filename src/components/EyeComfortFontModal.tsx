import React from 'react';
import { useReadingTheme, EyeComfortFont } from '../context/ReadingThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../utils/audio';
import { X, Type, Check, Sparkles, Eye, ShieldCheck, Sun, Moon } from 'lucide-react';

export const EyeComfortFontModal: React.FC = () => {
  const {
    isFontModalOpen,
    closeFontModal,
    readingFont,
    setReadingFont,
    availableFonts,
    themeMode,
    setThemeMode,
    isNightMode,
  } = useReadingTheme();

  const { language, t, dir, isRTL } = useLanguage();

  if (!isFontModalOpen) return null;

  const handleSelectFont = (fontId: EyeComfortFont) => {
    soundManager.playTick();
    setReadingFont(fontId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={dir}
      className={`fixed inset-0 z-[140] flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-md animate-fade-in ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      <div className="w-full max-w-xl rounded-3xl border border-amber-500/40 bg-stone-950 p-5 sm:p-6 text-stone-100 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md">
              <Type className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-amber-100">
                  {t('eyeComfortModalTitle')}
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                  {t('eyeComfortInstant')}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {t('eyeComfortDesc')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeFontModal}
            aria-label={t('close')}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Eye Comfort & Contrast Mode Toggle */}
        <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-amber-200 block">{t('readingLightMode')}</span>
              <span className="text-[11px] text-stone-400">
                {themeMode === 'auto'
                  ? (language === 'ar' ? 'مضبوط تلقائياً بحسب إضاءة الغرفة ونظام الهاتف' : 'Auto-adjusted based on ambient light & system theme')
                  : isNightMode
                  ? (language === 'ar' ? 'مفعل باللون الدافئ الداكن المريح' : 'Warm dark mode enabled for night comfort')
                  : (language === 'ar' ? 'مفعل بالوضع النهاري عالي الوضوح' : 'Clear high-contrast day mode enabled')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 shrink-0">
            <button
              onClick={() => {
                soundManager.playTick();
                setThemeMode('light');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                themeMode === 'light' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ☀️ {t('day')}
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                setThemeMode('night');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                themeMode === 'night' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🌙 {t('night')}
            </button>
            <button
              onClick={() => {
                soundManager.playTick();
                setThemeMode('auto');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                themeMode === 'auto' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>👁️</span>
              <span>{t('autoMode')}</span>
            </button>
          </div>
        </div>

        {/* Font List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-amber-300 block px-1">
            {t('selectPreferredFont')}
          </span>

          <div className="space-y-2.5">
            {availableFonts.map((font) => {
              const isSelected = readingFont === font.id;
              return (
                <div
                  key={font.id}
                  onClick={() => handleSelectFont(font.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-stone-900/70 border-stone-800 hover:bg-stone-900 hover:border-stone-700'
                  }`}
                  style={{ fontFamily: font.fontFamily }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 shadow-xs'
                            : 'border border-stone-700 text-stone-500'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-amber-100">
                        {font.name}
                      </h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      {font.badge}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {font.description}
                  </p>

                  {/* Real-time Scripture Sample */}
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 text-amber-200 text-xs sm:text-sm font-medium leading-relaxed">
                    {font.sample}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{language === 'ar' ? 'يتم حفظ خيارك تلقائياً لجميع الزيارات القادمة' : 'Your choice is saved across all visits'}</span>
          </div>

          <button
            type="button"
            onClick={closeFontModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {language === 'ar' ? 'تأكيد الخط والعودة ✓' : 'Confirm & Apply ✓'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EyeComfortFontModal;
