import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReadingThemeContextType {
  isNightMode: boolean;
  toggleNightMode: () => void;
  getContainerClass: () => string;
  getCardClass: () => string;
}

const ReadingThemeContext = createContext<ReadingThemeContextType>({
  isNightMode: false,
  toggleNightMode: () => {},
  getContainerClass: () => '',
  getCardClass: () => '',
});

export const ReadingThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('mokarasa_night_mode') === 'true';
      } catch {}
    }
    return false;
  });

  const toggleNightMode = () => {
    setIsNightMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mokarasa_night_mode', String(next));
        } catch {}
      }
      return next;
    });
  };

  const getContainerClass = () => {
    return isNightMode
      ? 'bg-[#181614] text-[#e0d8cb]'
      : 'bg-stone-900 text-stone-100';
  };

  const getCardClass = () => {
    return isNightMode
      ? 'bg-[#221f1b] border-[#383229] text-[#e0d8cb]'
      : 'bg-stone-900/90 border-amber-600/30 text-stone-100';
  };

  return (
    <ReadingThemeContext.Provider
      value={{
        isNightMode,
        toggleNightMode,
        getContainerClass,
        getCardClass,
      }}
    >
      {children}
    </ReadingThemeContext.Provider>
  );
};

export const useReadingTheme = () => useContext(ReadingThemeContext);
