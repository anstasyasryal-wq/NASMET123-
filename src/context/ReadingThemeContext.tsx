import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'night' | 'auto';

interface ReadingThemeContextType {
  isNightMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleNightMode: () => void;
  getContainerClass: () => string;
  getCardClass: () => string;
  getReadingContainerClass: () => string;
  getReadingTextClass: () => string;
}

const ReadingThemeContext = createContext<ReadingThemeContextType>({
  isNightMode: false,
  themeMode: 'light',
  setThemeMode: () => {},
  toggleNightMode: () => {},
  getContainerClass: () => '',
  getCardClass: () => '',
  getReadingContainerClass: () => '',
  getReadingTextClass: () => '',
});

export const ReadingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mokarasa_theme_mode') as ThemeMode;
        if (saved === 'light' || saved === 'night' || saved === 'auto') return saved;
        // Legacy fallback
        const nightStored = localStorage.getItem('mokarasa_night_mode');
        if (nightStored === 'true') return 'night';
      } catch {}
    }
    return 'auto'; // Default to intelligent Auto-Eye-Comfort mode
  });

  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isAmbientDim, setIsAmbientDim] = useState<boolean>(false);

  // Listen to system prefers-color-scheme
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      mediaQuery.addListener(handler);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Optional Ambient Light Sensor support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SensorClass = (window as unknown as { AmbientLightSensor?: new () => { illuminating: number; onreading: () => void; start: () => void; stop: () => void } }).AmbientLightSensor;
    if (SensorClass) {
      try {
        const sensor = new SensorClass();
        sensor.onreading = () => {
          // If ambient light lux is very low (< 25 lux), consider it dim environment
          if (sensor.illuminating < 25) {
            setIsAmbientDim(true);
          } else {
            setIsAmbientDim(false);
          }
        };
        sensor.start();
        return () => {
          try {
            sensor.stop();
          } catch {}
        };
      } catch {
        // Sensor not permitted or unavailable
      }
    }

    // Fallback time-of-day check (auto night comfort between 7 PM and 6 AM)
    const hour = new Date().getHours();
    if (hour >= 19 || hour < 6) {
      setIsAmbientDim(true);
    }
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mokarasa_theme_mode', mode);
        localStorage.setItem('mokarasa_night_mode', String(mode === 'night' || (mode === 'auto' && (isSystemDark || isAmbientDim))));
      } catch {}
    }
  };

  const toggleNightMode = () => {
    const next: ThemeMode = themeMode === 'light' ? 'night' : themeMode === 'night' ? 'auto' : 'light';
    setThemeMode(next);
  };

  // Effective isNightMode determination
  const isNightMode =
    themeMode === 'night' || (themeMode === 'auto' && (isSystemDark || isAmbientDim));

  const getContainerClass = () => {
    if (isNightMode) {
      return 'bg-[#181614] text-[#e0d8cb]'; // Warm dark sepia eye comfort
    }
    return 'bg-stone-900 text-stone-100';
  };

  const getCardClass = () => {
    if (isNightMode) {
      return 'bg-[#221f1b] border-[#383229] text-[#e0d8cb] shadow-lg';
    }
    return 'bg-stone-900/90 border-amber-600/30 text-stone-100 shadow-xl';
  };

  // Specialized reader classes for BiblicalStudyView and LibraryView (Warm Sepia & Auto contrast)
  const getReadingContainerClass = () => {
    if (isNightMode) {
      return 'bg-[#201c18] border-[#3d332a] text-[#f2ebd9] shadow-2xl'; // Warm parchment reading paper tone
    }
    return 'bg-[#1a1715] border-amber-600/40 text-stone-100 shadow-2xl';
  };

  const getReadingTextClass = () => {
    if (isNightMode) {
      return 'text-[#f5eedc] font-spiritual leading-relaxed';
    }
    return 'text-stone-200 font-spiritual leading-relaxed';
  };

  return (
    <ReadingThemeContext.Provider
      value={{
        isNightMode,
        themeMode,
        setThemeMode,
        toggleNightMode,
        getContainerClass,
        getCardClass,
        getReadingContainerClass,
        getReadingTextClass,
      }}
    >
      {children}
    </ReadingThemeContext.Provider>
  );
};

export const useReadingTheme = () => useContext(ReadingThemeContext);
