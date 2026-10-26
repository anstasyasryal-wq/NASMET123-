import React, { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  ar: {
    // Brand & Top Header
    appTitle: 'حسب قلب الله',
    appSubtitle: 'بوابة التكريس والعلوم الكنسية والتقييم الروحي',
    welcomeGreeting: 'سلام لك ونعمة في المسيح يسوع',
    userGreetingPrefix: 'سلام ونعمة يا',
    blessedOne: 'مبارك',
    home: 'الرئيسية',
    homeWheel: 'الرئيسية (العجلة)',
    competitions: 'المسابقات والمراحل',
    prayerFortress: 'حصن الصلاة',
    prayerFortressTitle: 'حصن الصلاة اليومي',
    prayerFortressDesc: 'صلوات الأجبية، المزامير، وتتبع الصلوات اليومية',
    library: 'المكتبة والآباء',
    libraryNav: 'المكتبة والكتب',
    libraryDesc: 'المستودع الرقمي للكتب والوثائق الكنسية الموثوقة',
    spiritualLife: 'الحياة الروحية',
    mySpiritualJourney: 'رحلتي الروحية',
    myCloset: 'مخدعي 🕊️',
    leaderboard: 'لوحة الشرف',
    installApp: 'تثبيت التطبيق',
    installAppPrompt: 'تثبيت التطبيق 📱',
    shareApp: 'مشاركة التطبيق 💌',
    login: 'تسجيل',
    loginTitle: 'تسجيل الدخول',
    myAccount: 'بياناتي',
    nightMode: 'الوضع الليلي',
    dayMode: 'الوضع النهاري',
    autoMode: 'تلقائي',
    more: 'المزيد',
    searchPlaceholder: 'ابحث بالاسم أو الإيبارشية أو الموضوع...',
    competitionsHub: 'المسابقات والمراحل الكنسية',
    competitionsHubDesc: 'مسابقات دراسية، أسئلة وألحان، وتقييم روحي شامل',
    virtueJar: 'حصالة الفضائل',
    virtueJarDesc: 'اجمع الفضائل اليومية واغرس بذار النعمة',
    consecratedManual: 'مرجع المكرس',
    consecratedManualDesc: 'أصول الخدمة والتكريس البتولي والروحي',
    spiritualFather: 'أبوي الروحي وإعداد الاعتراف',
    spiritualFatherDesc: 'فحص الضمير وإعداد جلسة الاعتراف والنمو',
    monasticOasis: 'دستور التكريس والرهبنة',
    monasticOasisDesc: 'أقوال وتداريب الآباء ورياضات الصمت',
    collectiveChallenges: 'التحديات الروحية الجماعية',
    collectiveChallengesDesc: 'صلوات وتسابيح وصوم مشترك مع الكنيسة',
    spiritualCalendar: 'التقويم والسنكسار الكنسي',
    spiritualCalendarDesc: 'أعياد وأصوام وقديسو الكنيسة القبطية يومياً',
    studyTools: 'أدوات الدراسة الكنسية',
    monasticAscent: 'سلم الصعود الروحي',
    spiritualGames: 'واحة الألعاب الروحية',
    creativeLab: 'المختبر الإبداعي',
    workshops: 'ورش العمل الكنسية',
    biblicalStudy: 'الدراسة الكتابية المعمقة',
    personalSpace: 'مساحتي الخاصة',
    supervisorDashboard: 'لوحة تحكم الخادم والمشرف',
    finalCeremony: 'حفل الختام والتكريم',
    participantsList: 'قائمة المتسابقين والمشاركين',

    // Modals & Panels
    heavenlyMessageCard: 'رسالة من أبوك السماوي',
    spiritualTreeCard: 'شجرة النمو الروحي',
    consecratedConstitutionCard: 'دستور حياة المكرس',
    saintsStickers: 'ملصقات القديسين',
    spiritualJournal: 'المفكرة الروحية',
    iconGallery: 'معرض الأيقونات',
    saintsGallery: 'سير القديسين والآباء',
    silentRetreat: 'خلوة الصمت السكونية',
    rules: 'دليل وشروط المسابقة',
    directory: 'الدليل الشامل',
    directoryNav: 'الدليل والبحث 🧭',
    spiritualGuide: 'المرشد الروحي',
    hymnsPlayer: 'مشغل الترانيم',
    hymns: 'ترانيم',
    hymnsPlaying: 'الترانيم تعمل ♫',
    soundEffects: 'المؤثرات الصوتية',
    soundOn: 'تشغيل الصوت',
    soundOff: 'كتم الصوت',
    night: 'ليلي',
    day: 'نهاري',
    offlineStatus: 'وضع عدم الاتصال',
    offlineNotice: 'وضع عدم الاتصال: جميع الميزات والكتب والمراحل المحفوظة تعمل بالكامل بدون إنترنت.',
    servicesAndGains: 'الخدمات الروحية والمكتسبات',
    mobileMenuTitle: 'لوحة الخدمات والأقسام',

    // Bottom Navigation (Mobile)
    navHome: 'الرئيسية',
    navLibrary: 'المكتبة 📚',
    navSpiritualLife: 'مخدعي 🕊️',
    navGuide: 'المرشد 🛡️',
    navDirectory: 'الدليل 🧭',

    // Common Action Buttons & Labels
    loading: 'جاري التحميل بالبركة...',
    close: 'إغلاق',
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    start: 'ابدأ',
    startStage: 'ابدأ المرحلة',
    continueReading: 'متابعة القراءة',
    resumeStage: 'استئناف المرحلة',
    myRank: 'ترتيبي ونقاطي',
    share: 'مشاركة',
    back: 'رجوع',
    backToHome: 'العودة للشاشة الرئيسية والعجلة',
    next: 'التالي',
    previous: 'السابق',
    retry: 'إعادة المحاولة',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    read: 'مقروء',
    unread: 'غير مقروء',
    markAsRead: 'تحديد كمقروء',
    markAsUnread: 'تحديد كغير مقروء',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    details: 'التفاصيل',
    readMore: 'اقرأ بالتفصيل',
    listen: 'استماع للدرس 🎧',
    stop: 'إيقاف',
    openSection: 'فتح القسم',
    points: 'نقطة',
    stage: 'المرحلة',
    question: 'سؤال',
    level: 'المستوى',
    rank: 'الترتيب',
    success: 'نجاح!',
    error: 'تنبيه',

    // Eye Comfort & Fonts
    eyeComfortFonts: 'خطوط مريحة للعين',
    eyeComfortModalTitle: 'خطوط مريحة للعين (Eye-Comfort Fonts)',
    eyeComfortInstant: 'تطبيق فوري',
    eyeComfortDesc: 'اختر الخط الأنسب لراحتك البصرية وسيتم تطبيقه على كامل واجهة التطبيق',
    readingLightMode: 'وضع الإضاءة والراحة البصرية',
    readingModeTitle: 'وضع القراءة:',
    selectPreferredFont: 'اختر الخط المفضل للقراءة والمطالعة:',
    fontAppliedSuccess: 'تم تطبيق الخط بنجاح على كامل التطبيق',
    fontTajawal: 'خط تجوال (Tajawal Modern)',
    fontIbmPlex: 'آي بي إم بلكس (IBM Plex Sans)',
    fontCairo: 'خط القاهرة الكلاسيكي (Cairo)',
    fontAmiri: 'خط أميري المكتبي (Amiri)',
    fontSystemSans: 'خط النظام المريح (System Sans)',

    // Home Section Subtitles
    homeHeroSubtitle: 'مساحتك الروحية اليومية الهادئة: قراءات الآباء، صلاة المخدع، التقييم الروحي، ومسابقات التكريس في ضوء كلمة الله.',
    dailyWhisper: 'همسة اليوم الروحية',
    meditateWithGuide: 'تأمل مع المرشد الروحي',
    consecrationTreeDesc: 'تتبع صلواتك وقراءاتك ونموك الروحي اليومي خطوة بخطوة في محضر الله.',
    fortuneWheelTitle: 'عجلة التكريس والتنقل الروحي',
    fortuneWheelDesc: 'دوّر العجلة واستكشف الأقسام الأربعة المركزية للحياة الروحية والمسابقات.',

    // Competition Hub & Questions
    questionBank: 'بنك الأسئلة المركزي',
    stagesTab: 'المراحل الرسمية',
    subjectReligion: 'العلوم والطقوس الكنسية',
    subjectGenetics: 'علم الجينات والتصميم الخالق',
    subjectCulture: 'الثقافة والتاريخ القبطي',
    unlocked: 'مفتوحة',
    locked: 'مغلقة حتى إتمام المرحلة السابقة',
    currentStageBadge: 'مرحلتك الحالية',
    stageCompletedBadge: 'مكتملة بنجاح ⭐',

    // Language Toggle
    currentLanguageName: 'العربية',
    switchLanguagePrompt: 'Switch to English',
  },
  en: {
    // Brand & Top Header
    appTitle: 'According to God\'s Heart',
    appSubtitle: 'Consecration, Coptic Studies & Spiritual Assessment Portal',
    welcomeGreeting: 'Grace and Peace to you in Christ Jesus',
    userGreetingPrefix: 'Grace and Peace,',
    blessedOne: 'Blessed',
    home: 'Home',
    homeWheel: 'Home (Wheel)',
    competitions: 'Competitions & Stages',
    prayerFortress: 'Prayer Fortress',
    prayerFortressTitle: 'Daily Prayer Fortress',
    prayerFortressDesc: 'Agpeya hours, Psalms, and daily prayer tracking',
    library: 'Library & Church Fathers',
    libraryNav: 'Library & Books',
    libraryDesc: 'Authentic digital repository of Coptic books and patristic documents',
    spiritualLife: 'Spiritual Life',
    mySpiritualJourney: 'My Spiritual Journey',
    myCloset: 'My Closet 🕊️',
    leaderboard: 'Leaderboard',
    installApp: 'Install App',
    installAppPrompt: 'Install App 📱',
    shareApp: 'Share App 💌',
    login: 'Sign In',
    loginTitle: 'Sign In / Register',
    myAccount: 'My Account',
    nightMode: 'Night Mode',
    dayMode: 'Day Mode',
    autoMode: 'Auto',
    more: 'More',
    searchPlaceholder: 'Search by name, diocese, or topic...',
    competitionsHub: 'Competitions & Coptic Stages',
    competitionsHubDesc: 'Study competitions, quizzes, hymns, and holistic spiritual assessment',
    virtueJar: 'Virtue Jar',
    virtueJarDesc: 'Collect daily virtues and sow seeds of heavenly grace',
    consecratedManual: 'Consecrated Manual',
    consecratedManualDesc: 'Foundations of celibacy, service, and consecrated spiritual life',
    spiritualFather: 'Spiritual Father & Confession Prep',
    spiritualFatherDesc: 'Conscience examination and preparing confession sessions',
    monasticOasis: 'Monastic Oasis & Constitution',
    monasticOasisDesc: 'Sayings and exercises of Desert Fathers and silent retreats',
    collectiveChallenges: 'Collective Spiritual Challenges',
    collectiveChallengesDesc: 'Shared prayers, praises, and fasts together with the Church',
    spiritualCalendar: 'Coptic Calendar & Synaxarium',
    spiritualCalendarDesc: 'Daily Coptic feasts, fasts, and commemorations of saints',
    studyTools: 'Church Study Tools',
    monasticAscent: 'Ladder of Divine Ascent',
    spiritualGames: 'Spiritual Games & Trivia',
    creativeLab: 'Creative Lab',
    workshops: 'Church Workshops',
    biblicalStudy: 'Deep Biblical Study',
    personalSpace: 'My Personal Space',
    supervisorDashboard: 'Supervisor Dashboard',
    finalCeremony: 'Final Ceremony & Awards',
    participantsList: 'Participants & Contestants',

    // Modals & Panels
    heavenlyMessageCard: 'Message from Heavenly Father',
    spiritualTreeCard: 'Spiritual Growth Tree',
    consecratedConstitutionCard: 'Consecrated Life Constitution',
    saintsStickers: 'Saints Stickers',
    spiritualJournal: 'Spiritual Journal',
    iconGallery: 'Coptic Icon Gallery',
    saintsGallery: 'Fathers & Saints Biographies',
    silentRetreat: 'Virtual Silent Retreat',
    rules: 'Competition Rules & Guide',
    directory: 'Comprehensive Directory',
    directoryNav: 'Directory & Search 🧭',
    spiritualGuide: 'Spiritual Guide',
    hymnsPlayer: 'Hymns & Audio Player',
    hymns: 'Hymns',
    hymnsPlaying: 'Playing Hymns ♫',
    soundEffects: 'Sound Effects',
    soundOn: 'Unmute',
    soundOff: 'Mute',
    night: 'Night',
    day: 'Day',
    offlineStatus: 'Offline Mode',
    offlineNotice: 'Offline Mode: All cached features, books, and stages are fully available without internet.',
    servicesAndGains: 'Spiritual Services & Features',
    mobileMenuTitle: 'Services & Sections Panel',

    // Bottom Navigation (Mobile)
    navHome: 'Home',
    navLibrary: 'Library 📚',
    navSpiritualLife: 'My Closet 🕊️',
    navGuide: 'Guide 🛡️',
    navDirectory: 'Directory 🧭',

    // Common Action Buttons & Labels
    loading: 'Loading with blessing...',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    start: 'Start',
    startStage: 'Start Stage',
    continueReading: 'Continue Reading',
    resumeStage: 'Resume Stage',
    myRank: 'My Rank & Points',
    share: 'Share',
    back: 'Back',
    backToHome: 'Back to Home & Wheel',
    next: 'Next',
    previous: 'Previous',
    retry: 'Retry',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    read: 'Read',
    unread: 'Unread',
    markAsRead: 'Mark as Read',
    markAsUnread: 'Mark as Unread',
    copy: 'Copy',
    copied: 'Copied!',
    details: 'Details',
    readMore: 'Read in Detail',
    listen: 'Listen to Lesson 🎧',
    stop: 'Stop',
    openSection: 'Open Section',
    points: 'Points',
    stage: 'Stage',
    question: 'Question',
    level: 'Level',
    rank: 'Rank',
    success: 'Success!',
    error: 'Notice',

    // Eye Comfort & Fonts
    eyeComfortFonts: 'Eye-Comfort Fonts',
    eyeComfortModalTitle: 'Eye-Comfort Fonts & Reader Style',
    eyeComfortInstant: 'Instant Apply',
    eyeComfortDesc: 'Select the most comfortable font for your eyes. It applies dynamically across the entire app.',
    readingLightMode: 'Lighting & Eye-Comfort Mode',
    readingModeTitle: 'Reading Mode:',
    selectPreferredFont: 'Choose your preferred font for reading:',
    fontAppliedSuccess: 'Font successfully applied to the entire interface',
    fontTajawal: 'Tajawal Modern Sans',
    fontIbmPlex: 'IBM Plex Sans Arabic',
    fontCairo: 'Classic Cairo',
    fontAmiri: 'Amiri Book Serif',
    fontSystemSans: 'System Sans-Serif',

    // Home Section Subtitles
    homeHeroSubtitle: 'Your tranquil daily spiritual space: Patristic readings, quiet closet prayer, spiritual assessment, and consecration quizzes in the light of God\'s Word.',
    dailyWhisper: 'Daily Spiritual Whisper',
    meditateWithGuide: 'Meditate with Spiritual Guide',
    consecrationTreeDesc: 'Track your daily prayers, readings, and spiritual growth step by step before God.',
    fortuneWheelTitle: 'Consecration Wheel & Navigation',
    fortuneWheelDesc: 'Spin the wheel to explore the four central pillars of spiritual life and study.',

    // Competition Hub & Questions
    questionBank: 'Central Question Bank',
    stagesTab: 'Official Stages',
    subjectReligion: 'Church Sciences & Rites',
    subjectGenetics: 'Genetics & Intelligent Design',
    subjectCulture: 'Coptic Culture & History',
    unlocked: 'Unlocked',
    locked: 'Locked until previous stage completion',
    currentStageBadge: 'Your Current Stage',
    stageCompletedBadge: 'Completed ⭐',

    // Language Toggle
    currentLanguageName: 'English',
    switchLanguagePrompt: 'التحويل إلى العربية',
  },
} as const;

export type TranslationKey = keyof typeof translations.ar;

interface LanguageContextType {
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key, fallback) => (translations.ar as any)[key] || fallback || String(key),
  dir: 'rtl',
  isRTL: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
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
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey | string, fallback?: string): string => {
    const dict = translations[language] as Record<string, string>;
    const arDict = translations.ar as Record<string, string>;
    if (dict && dict[key]) return dict[key];
    if (arDict && arDict[key]) return arDict[key];
    return fallback || String(key);
  };

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage,
        t,
        dir,
        isRTL,
      }}
    >
      <div dir={dir} className={dir === 'ltr' ? 'text-left font-sans' : 'text-right'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
