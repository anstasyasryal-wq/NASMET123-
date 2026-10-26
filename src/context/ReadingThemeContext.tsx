import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'night' | 'auto';
export type EyeComfortFont = 'cairo' | 'ibm-plex' | 'tajawal' | 'amiri' | 'system-sans';

export interface FontConfig {
  id: EyeComfortFont;
  name: string;
  badge: string;
  description: string;
  fontFamily: string;
  sample: string;
}

export const EYE_COMFORT_FONTS: FontConfig[] = [
  {
    id: 'cairo',
    name: 'كايرو العصري (Cairo Sans)',
    badge: 'الافتراضي المتوازن',
    description: 'خط عربي حديث وواضح ذو هندسة بصرية مريحة للعين في القراءة اليومية والتصفح السريع.',
    fontFamily: "'Cairo', system-ui, -apple-system, sans-serif",
    sample: '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ»',
  },
  {
    id: 'ibm-plex',
    name: 'آي بي إم المريح (IBM Plex)',
    badge: 'أعلى وضوح ومسافات متسعة',
    description: 'خط مدروس علمياً لتقليل إجهاد القرنية والشاشات الرقمية بفضل الفتحات المتسعة والتوازن الطباعي.',
    fontFamily: "'IBM Plex Sans Arabic', 'Cairo', system-ui, sans-serif",
    sample: '«كَلِمَتُكَ مِصْبَاحٌ لِرِجْلِي وَنُورٌ لِسَبِيلِي»',
  },
  {
    id: 'tajawal',
    name: 'تجوال الانسيابي (Tajawal)',
    badge: 'انحناءات ناعمة مهدئة للعين',
    description: 'خط ناعم الانحناءات يسهل حركة العين بين الكلمات والجمل في الدراسات والمراجع الطويلة.',
    fontFamily: "'Tajawal', 'Cairo', system-ui, sans-serif",
    sample: '«طُوبَى لِلأَنْقِيَاءِ الْقَلْبِ، لأَنَّهُمْ يُعَايِنُونَ اللهَ»',
  },
  {
    id: 'amiri',
    name: 'أميري الآبائي (Amiri Naskh)',
    badge: 'كلاسيكي نسخي أصيل',
    description: 'خط النسخ الكنسي والآبائي الأصيل لقراءة النصوص اللاهوتية والتفاسير والمزامير بوقار.',
    fontFamily: "'Amiri', serif",
    sample: '«اَللهُ مَحَبَّةٌ، وَمَنْ يَثْبُتْ فِي الْمَحَبَّةِ، يَثْبُتْ فِي اللهِ»',
  },
  {
    id: 'system-sans',
    name: 'خط النظام المباشر (System Sans)',
    badge: 'أقصى خفة ونقاء',
    description: 'يعتمد على خط الشاشة الأصلي لجهازك النقال أو الحاسوب لأسرع تحميل ونقاء تام.',
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sample: '«أَنَا هُوَ نُورُ الْعَالَمِ. مَنْ يَتْبَعْنِي فَلاَ يَمْشِي فِي الظُّلْمَةِ»',
  },
];

interface ReadingThemeContextType {
  isNightMode: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleNightMode: () => void;
  readingFont: EyeComfortFont;
  setReadingFont: (font: EyeComfortFont) => void;
  availableFonts: FontConfig[];
  currentFontConfig: FontConfig;
  isFontModalOpen: boolean;
  openFontModal: () => void;
  closeFontModal: () => void;
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
  readingFont: 'cairo',
  setReadingFont: () => {},
  availableFonts: EYE_COMFORT_FONTS,
  currentFontConfig: EYE_COMFORT_FONTS[0],
  isFontModalOpen: false,
  openFontModal: () => {},
  closeFontModal: () => {},
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
        const nightStored = localStorage.getItem('mokarasa_night_mode');
        if (nightStored === 'true') return 'night';
      } catch {}
    }
    return 'auto'; // Default to intelligent Auto-Eye-Comfort mode
  });

  const [readingFont, setReadingFontState] = useState<EyeComfortFont>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mokarasa_reading_font') as EyeComfortFont;
        if (EYE_COMFORT_FONTS.some((f) => f.id === saved)) return saved;
      } catch {}
    }
    return 'cairo';
  });

  const [isFontModalOpen, setIsFontModalOpen] = useState<boolean>(false);

  const [isSystemDark, setIsSystemDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [isAmbientDim, setIsAmbientDim] = useState<boolean>(false);

  // Apply readingFont to entire document CSS variables and body
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fontConfig = EYE_COMFORT_FONTS.find((f) => f.id === readingFont) || EYE_COMFORT_FONTS[0];
    document.documentElement.style.setProperty('--app-font-family', fontConfig.fontFamily);
    document.body.style.fontFamily = fontConfig.fontFamily;
    try {
      localStorage.setItem('mokarasa_reading_font', readingFont);
    } catch {}
  }, [readingFont]);

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

  // Ambient light lux / time-of-day check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SensorClass = (window as unknown as { AmbientLightSensor?: new () => { illuminating: number; onreading: () => void; start: () => void; stop: () => void } }).AmbientLightSensor;
    if (SensorClass) {
      try {
        const sensor = new SensorClass();
        sensor.onreading = () => {
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
      } catch {}
    }

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
        localStorage.setItem(
          'mokarasa_night_mode',
          String(mode === 'night' || (mode === 'auto' && (isSystemDark || isAmbientDim)))
        );
      } catch {}
    }
  };

  const toggleNightMode = () => {
    const next: ThemeMode = themeMode === 'light' ? 'night' : themeMode === 'night' ? 'auto' : 'light';
    setThemeMode(next);
  };

  const setReadingFont = (font: EyeComfortFont) => {
    setReadingFontState(font);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mokarasa_reading_font', font);
      } catch {}
    }
  };

  const currentFontConfig =
    EYE_COMFORT_FONTS.find((f) => f.id === readingFont) || EYE_COMFORT_FONTS[0];

  const isNightMode =
    themeMode === 'night' || (themeMode === 'auto' && (isSystemDark || isAmbientDim));

  const getContainerClass = () => {
    if (isNightMode) {
      return 'bg-[#181614] text-[#e0d8cb]';
    }
    return 'bg-stone-900 text-stone-100';
  };

  const getCardClass = () => {
    if (isNightMode) {
      return 'bg-[#221f1b] border-[#383229] text-[#e0d8cb] shadow-lg';
    }
    return 'bg-stone-900/90 border-amber-600/30 text-stone-100 shadow-xl';
  };

  const getReadingContainerClass = () => {
    if (isNightMode) {
      return 'bg-[#201c18] border-[#3d332a] text-[#f2ebd9] shadow-2xl';
    }
    return 'bg-[#1a1715] border-amber-600/40 text-stone-100 shadow-2xl';
  };

  const getReadingTextClass = () => {
    if (isNightMode) {
      return 'text-[#f5eedc] leading-relaxed';
    }
    return 'text-stone-200 leading-relaxed';
  };

  return (
    <ReadingThemeContext.Provider
      value={{
        isNightMode,
        themeMode,
        setThemeMode,
        toggleNightMode,
        readingFont,
        setReadingFont,
        availableFonts: EYE_COMFORT_FONTS,
        currentFontConfig,
        isFontModalOpen,
        openFontModal: () => setIsFontModalOpen(true),
        closeFontModal: () => setIsFontModalOpen(false),
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
