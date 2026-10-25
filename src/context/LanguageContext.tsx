import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ar: {
    appTitle: 'حسب قلب الله',
    appSubtitle: 'بوابة التكريس والعلوم الكنسية والتقييم الروحي',
    home: 'الرئيسية (العجلة)',
    competitions: 'المسابقات والمراحل',
    prayerFortress: 'حصن الصلاة',
    library: 'المكتبة والآباء',
    spiritualLife: 'الحياة الروحية',
    leaderboard: 'لوحة الشرف',
    installApp: 'تثبيت التطبيق',
    login: 'تسجيل',
    myAccount: 'بياناتي',
    nightMode: 'الوضع الليلي',
    dayMode: 'الوضع النهاري',
    more: 'المزيد',
    searchPlaceholder: 'ابحث بالاسم أو الإيبارشية...',
    competitionsHub: 'المسابقات والمراحل الكنسية',
    prayerFortressTitle: 'حصن الصلاة اليومي',
    virtueJar: 'حصالة الفضائل',
    consecratedManual: 'مرجع المكرس',
    spiritualFather: 'أبوي الروحي وإعداد الاعتراف',
    monasticOasis: 'دستور التكريس',
    collectiveChallenges: 'التحديات الجماعية',
    spiritualCalendar: 'التقويم الكنسي',
    loading: 'جاري فتح القسم بالبركة...',
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    startStage: 'ابدأ المرحلة',
    myRank: 'ترتيبي ونقاطي',
    rules: 'دليل المسابقة',
  },
  en: {
    appTitle: 'According to God\'s Heart',
    appSubtitle: 'Consecration, Coptic Studies & Spiritual Assessment Portal',
    home: 'Home (Wheel)',
    competitions: 'Competitions & Stages',
    prayerFortress: 'Prayer Fortress',
    library: 'Library & Church Fathers',
    spiritualLife: 'Spiritual Life',
    leaderboard: 'Leaderboard',
    installApp: 'Install App',
    login: 'Sign In',
    myAccount: 'My Account',
    nightMode: 'Night Mode',
    dayMode: 'Day Mode',
    more: 'More',
    searchPlaceholder: 'Search by name or diocese...',
    competitionsHub: 'Competitions & Coptic Stages',
    prayerFortressTitle: 'Daily Prayer Fortress',
    virtueJar: 'Virtue Jar',
    consecratedManual: 'Consecrated Manual',
    spiritualFather: 'Spiritual Father & Confession',
    monasticOasis: 'Monastic Oasis',
    collectiveChallenges: 'Collective Challenges',
    spiritualCalendar: 'Spiritual Calendar',
    loading: 'Opening section with blessing...',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    startStage: 'Start Stage',
    myRank: 'My Rank & Points',
    rules: 'Competition Rules',
  },
};

interface LanguageContextType {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['ar']) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  t: (key) => translations.ar[key] || key,
  dir: 'rtl',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mokarasa_lang');
        if (saved === 'en' || saved === 'ar') return saved;
      } catch {}
    }
    return 'ar';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mokarasa_lang', language);
      } catch {}
      try {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      } catch {}
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: keyof typeof translations['ar']) => {
    return translations[language][key] || translations.ar[key] || key;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, dir }}>
      <div dir={dir} className={dir === 'ltr' ? 'font-sans' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
