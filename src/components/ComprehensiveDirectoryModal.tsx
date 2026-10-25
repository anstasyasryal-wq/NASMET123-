import React, { useState, useMemo } from 'react';
import { AppView, User } from '../types';
import { soundManager } from '../utils/audio';
import { AUTHENTIC_COPTIC_BOOKS, BookItem } from '../data/authenticCopticBooks';
import {
  Search,
  X,
  BookOpen,
  Heart,
  Trophy,
  Gamepad2,
  GraduationCap,
  Sparkles,
  Calendar,
  Shield,
  ShieldCheck,
  Compass,
  ScrollText,
  Coins,
  Brain,
  HelpCircle,
  Users,
  Feather,
  Layers,
  ChevronLeft,
  Flame,
  Bookmark,
} from 'lucide-react';

export interface DirectoryCategoryItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'library' | 'spiritual' | 'competitions' | 'games' | 'training' | 'liturgical';
  categoryLabel: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  view?: AppView;
  action?: () => void;
  keywords: string[];
  badge?: string;
}

interface ComprehensiveDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onOpenSpiritualGuide: () => void;
  onOpenEmergencyModal?: (situation: 'distress' | 'boredom' | 'lukewarmness' | 'anger') => void;
  onOpenSilentRetreat?: () => void;
  onOpenSaintsStickers?: () => void;
  onOpenHeavenlyMessage?: () => void;
  onOpenSpiritualJournal?: () => void;
  onOpenIconGallery?: () => void;
  onOpenSaintsGallery?: () => void;
  onOpenBookReader?: (book: BookItem) => void;
  currentUser: User | null;
}

export const ComprehensiveDirectoryModal: React.FC<ComprehensiveDirectoryModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSpiritualGuide,
  onOpenEmergencyModal,
  onOpenSilentRetreat,
  onOpenSaintsStickers,
  onOpenHeavenlyMessage,
  onOpenSpiritualJournal,
  onOpenIconGallery,
  onOpenSaintsGallery,
  onOpenBookReader,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const directoryItems: DirectoryCategoryItem[] = useMemo(
    () => [
      // المكتبة والمراجع
      {
        id: 'dir-library',
        title: 'المكتبة الكنسية وأقوال الآباء',
        subtitle: 'الموسوعة الشاملة: 36 كتاباً كاملاً، بحوث آبائية، وقارئ إلكتروني مدمج مع حفظ تقدم القراءة.',
        category: 'library',
        categoryLabel: 'المكتبة والمراجع',
        icon: BookOpen,
        iconBg: 'bg-amber-900/40 text-amber-300 border-amber-600/30',
        view: 'library',
        badge: '36 كتاباً كاملاً',
        keywords: ['كتب', 'مكتبة', 'آباء', 'أثناسيوس', 'إغناطيوس', 'بوليكاربوس', 'ديداخي', 'شنودة', 'دراسة'],
      },
      {
        id: 'dir-biblical-study',
        title: 'الدراسة الكتابية وتفاسير الآباء',
        subtitle: 'شروحات لاهوتية وكتابية رصينة تربط أسفار العهدين بأقوال الآباء وتفاسير الكنيسة.',
        category: 'library',
        categoryLabel: 'المكتبة والمراجع',
        icon: ScrollText,
        iconBg: 'bg-blue-900/40 text-blue-300 border-blue-600/30',
        view: 'biblical_study',
        badge: 'تفاسير معتمدة',
        keywords: ['كتاب مقدس', 'دراسة', 'تفسير', 'إنجيل', 'عهد جديد', 'عهد قديم'],
      },
      {
        id: 'dir-consecrated-manual',
        title: 'دستور المكرس والمرجع الكنسي',
        subtitle: 'الأسس التوثيقية والتشريعات الكنسية والقوانين الرهبانية والتكريسية في التقليد القبطي.',
        category: 'library',
        categoryLabel: 'المكتبة والمراجع',
        icon: Compass,
        iconBg: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/30',
        view: 'consecrated_manual',
        badge: 'وثائقي',
        keywords: ['دستور', 'مكرس', 'تكريس', 'قوانين', 'مرجع', 'رهبنة'],
      },
      {
        id: 'dir-monastic-oasis',
        title: 'واحة السكون الروحي والرهباني',
        subtitle: 'الركائز السبع، ميزان فحص الضمير النومي، ميثاق تجديد النذر، وتأملات الصمت المقدس.',
        category: 'library',
        categoryLabel: 'المكتبة والمراجع',
        icon: Feather,
        iconBg: 'bg-stone-800 text-amber-200 border-stone-700',
        view: 'monastic_oasis',
        badge: 'نسكي',
        keywords: ['هدوء', 'سكون', 'فحص ضمير', 'نذر', 'نسك', 'تأمل'],
      },
      {
        id: 'dir-icons',
        title: 'معرض الأيقونات القبطية وسير القديسين',
        subtitle: 'معرض غني بالأيقونات التراثية المشروحة وسير قديسي الشرق والغرب مع تأملاتهم.',
        category: 'library',
        categoryLabel: 'المكتبة والمراجع',
        icon: Sparkles,
        iconBg: 'bg-purple-900/40 text-purple-300 border-purple-600/30',
        action: () => {
          onClose();
          onOpenIconGallery?.();
        },
        badge: 'تراث بصري',
        keywords: ['أيقونات', 'قديسين', 'معرض', 'صور', 'تأمل'],
      },

      // الصلاة والمخدع ورحلتي الروحية
      {
        id: 'dir-spiritual-life',
        title: 'صلاة المخدع وخطة النمو الروحي',
        subtitle: 'خطة القراءة السنوية (365 يوماً)، مخدع الصلاة الهادئ، ومسبحة صلاة يسوع.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: Heart,
        iconBg: 'bg-rose-900/40 text-rose-300 border-rose-600/30',
        view: 'spiritual_life',
        badge: 'يومي',
        keywords: ['صلاة', 'مخدع', 'حياة روحية', 'يسوع', 'مسبحة', 'خطة سنوية'],
      },
      {
        id: 'dir-prayer-fortress',
        title: 'حصن الصلاة اليومي والمزامير',
        subtitle: 'مزامير الأجبية الساعية، سلاح الصلاة الموجه، ومنبه الأوقات لمواجهة التشتت.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: Shield,
        iconBg: 'bg-emerald-950 text-emerald-400 border-emerald-600/40',
        view: 'prayer_fortress',
        badge: 'حصن روحي',
        keywords: ['حصن', 'أجبية', 'مزامير', 'صلاة السواعي', 'تنبيه'],
      },
      {
        id: 'dir-spiritual-guide',
        title: 'المرشد الروحي والتأمل الآبائي',
        subtitle: 'حوار هادئ وتأملات آبائية مخصصة تجيب على تساؤلات النفس وتضيء ظلمة الحيرة.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: HelpCircle,
        iconBg: 'bg-cyan-900/40 text-cyan-300 border-cyan-600/30',
        action: () => {
          onClose();
          onOpenSpiritualGuide();
        },
        badge: 'إرشاد',
        keywords: ['مرشد', 'سؤال', 'إرشاد', 'حيرة', 'تأمل', 'آباء'],
      },
      {
        id: 'dir-spiritual-father',
        title: 'أبوي الروحي وإعداد جلسة الاعتراف',
        subtitle: 'سجل نقاط جلسة الاعتراف القادمة، نصائح أب الاعتراف المحفوظة، ومراجعة التوبة بسلام.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: ShieldCheck,
        iconBg: 'bg-indigo-900/40 text-indigo-300 border-indigo-600/30',
        view: 'spiritual_father',
        badge: 'إعداد الاعتراف',
        keywords: ['اعتراف', 'أب اعتراف', 'توبة', 'جلسة', 'إرشاد'],
      },
      {
        id: 'dir-personal-space',
        title: 'المساحة الشخصية والمجلة الروحية',
        subtitle: 'مذكراتك الخاصة، صندوق رسائل أبيك السماوي (68+ رسالة)، ومناجاة الروح.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: Bookmark,
        iconBg: 'bg-amber-900/30 text-amber-200 border-amber-600/30',
        view: 'personal_space',
        badge: 'مساحة خاصة',
        keywords: ['مذكرات', 'مجلة', 'رسائل السماء', 'شخصي', 'تأمل'],
      },
      {
        id: 'dir-virtue-jar',
        title: 'حصالة الفضائل والتثبيت الروحي',
        subtitle: 'جمع وتثبيت الفضائل المسيحية اليومية كبذور حية تثمر سلاماً ونقاوة قلب.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: Coins,
        iconBg: 'bg-yellow-900/40 text-yellow-300 border-yellow-600/30',
        view: 'virtue_jar',
        badge: 'تفاعلي',
        keywords: ['فضائل', 'حصالة', 'نمو', 'شكر', 'تواضع', 'محبة'],
      },
      {
        id: 'dir-retreat',
        title: 'الخلوة والرياضة الروحية الصامتة',
        subtitle: 'أجواء صمت وتأمل مهدئة تفصلك عن ضجيج العالم وتدخلك في محضر الله.',
        category: 'spiritual',
        categoryLabel: 'الصلاة والمخدع',
        icon: Flame,
        iconBg: 'bg-stone-800 text-amber-300 border-stone-600',
        action: () => {
          onClose();
          onOpenSilentRetreat?.();
        },
        badge: 'سكون مقدس',
        keywords: ['خلوة', 'صمت', 'رياضة روحية', 'سكون', 'هدوء'],
      },

      // المسابقات والتقييم
      {
        id: 'dir-competitions',
        title: 'المسابقات الرسمية والمراحل الست',
        subtitle: 'المسابقة الكبرى بست مراحل متدرجة وبنك أسئلة مركزي وتصنيف لحظي وتتويج شرفي.',
        category: 'competitions',
        categoryLabel: 'المسابقات والتقييم',
        icon: Trophy,
        iconBg: 'bg-amber-600/30 text-amber-400 border-amber-500/40',
        view: 'competitions_hub',
        badge: 'المسابقة الكبرى',
        keywords: ['مسابقات', 'مراحل', 'اختبار', 'تقييم', 'أسئلة', 'كأس'],
      },
      {
        id: 'dir-leaderboard',
        title: 'لوحة الشرف والصدارة والإيبارشيات',
        subtitle: 'متابعة ترتيب الأفراد والإيبارشيات في المسابقات وحفل التتويج الشرفي.',
        category: 'competitions',
        categoryLabel: 'المسابقات والتقييم',
        icon: Users,
        iconBg: 'bg-blue-900/40 text-blue-300 border-blue-600/30',
        view: 'leaderboard',
        badge: 'ترتيب لحظي',
        keywords: ['صدارة', 'إيبارشيات', 'شرف', 'مشاركون', 'ترتيب'],
      },
      {
        id: 'dir-collective-challenges',
        title: 'التحديات الروحية الجماعية',
        subtitle: 'تحديات جماعية أسبوعية وشهرية تنمي روح المحبة والتنافس المقدس بين المكرسين.',
        category: 'competitions',
        categoryLabel: 'المسابقات والتقييم',
        icon: Layers,
        iconBg: 'bg-teal-900/40 text-teal-300 border-teal-600/30',
        view: 'collective_challenges',
        badge: 'جماعي',
        keywords: ['تحديات', 'مجموعات', 'تكاتف', 'محبة', 'جهاد مشترك'],
      },

      // الألعاب والأنشطة الترفيهية الهادفة
      {
        id: 'dir-games-hub',
        title: 'واحة الألعاب الروحية وتحديات البرية',
        subtitle: 'رحلة الراهب في البرية، رنين الدف، فوازير بستان الرهبان، وبازل الأيقونات.',
        category: 'games',
        categoryLabel: 'الألعاب والتسلية الروحية',
        icon: Gamepad2,
        iconBg: 'bg-purple-900/40 text-purple-300 border-purple-600/30',
        view: 'spiritual_games',
        badge: 'تسلية هادفة',
        keywords: ['ألعاب', 'بازل', 'فوازير', 'دف', 'برية', 'تحدي'],
      },
      {
        id: 'dir-monastic-puzzle',
        title: 'بازل الصعود الرهباني والتنسك',
        subtitle: 'لعبة البازل التفاعلية: باب التخلي، بازل السكون، وهرم النمو الروحي ومفتاح الروح.',
        category: 'games',
        categoryLabel: 'الألعاب والتسلية الروحية',
        icon: Brain,
        iconBg: 'bg-amber-700/40 text-amber-300 border-amber-600/40',
        view: 'monastic_puzzle',
        badge: 'جديد ومميز',
        keywords: ['بازل', 'صعود', 'رهبنة', 'تنسك', 'تفكير', 'لعبة'],
      },
      {
        id: 'dir-saints-stickers',
        title: 'ملصقات وتطويبات القديسين اليومية',
        subtitle: 'اجمع ملصقات الآباء القديسين وتعرف على فضائلهم اليومية مع كل مرحلة تنجزها.',
        category: 'games',
        categoryLabel: 'الألعاب والتسلية الروحية',
        icon: Sparkles,
        iconBg: 'bg-pink-900/40 text-pink-300 border-pink-600/30',
        action: () => {
          onClose();
          onOpenSaintsStickers?.();
        },
        badge: 'مجموعات وبطاقات',
        keywords: ['ملصقات', 'ستيكرز', 'قديسين', 'بطاقات', 'مكافأة'],
      },

      // التدريب والبحث والإبداع
      {
        id: 'dir-workshops',
        title: 'ورش العمل والتدريب والتأهيل الكنسي',
        subtitle: '10 ورش عمل عملية متكاملة: إعداد العظات، فن الافتقاد، الرعاية، والقيادة الروحية.',
        category: 'training',
        categoryLabel: 'التدريب والتطوير',
        icon: GraduationCap,
        iconBg: 'bg-indigo-900/40 text-indigo-300 border-indigo-600/30',
        view: 'workshops',
        badge: '10 ورش عمل',
        keywords: ['ورش', 'تدريب', 'عظات', 'افتقاد', 'خدمة', 'رعاية'],
      },
      {
        id: 'dir-creative-lab',
        title: 'مختبر الإبداع ومسودات العظات',
        subtitle: 'مساحة منظمة لإعداد وتدوين مسودات العظات، الخواطر، والترانيم الروحية وحفظها.',
        category: 'training',
        categoryLabel: 'التدريب والتطوير',
        icon: Sparkles,
        iconBg: 'bg-rose-900/40 text-rose-300 border-rose-600/30',
        view: 'creative_lab',
        badge: 'إبداع روحي',
        keywords: ['مختبر', 'إبداع', 'عظات', 'مسودات', 'خواطر', 'ترانيم'],
      },
      {
        id: 'dir-study-tools',
        title: 'أدوات البحث والاختبار الفردي والشهادات',
        subtitle: 'أدوات اختبار سريعة، تحدي السرعة الروحية، وبنك الأسئلة مع شهادات تقدير فورية.',
        category: 'training',
        categoryLabel: 'التدريب والتطوير',
        icon: Search,
        iconBg: 'bg-teal-900/40 text-teal-300 border-teal-600/30',
        view: 'study_tools',
        badge: 'شهادات فورية',
        keywords: ['بحث', 'أدوات', 'اختبار فردي', 'شهادة', 'سرعة'],
      },

      // الطقس والدعم والإسعاف الروحي
      {
        id: 'dir-calendar',
        title: 'التقويم الكنسي والأصوام والأعياد',
        subtitle: 'دليل يومي شامل لمتابعة أصوام الكنيسة، الأعياد السيدية، وقراءات السنكسار.',
        category: 'liturgical',
        categoryLabel: 'الطقس والإسعاف الروحي',
        icon: Calendar,
        iconBg: 'bg-amber-900/40 text-amber-300 border-amber-600/30',
        view: 'spiritual_calendar',
        badge: 'سنكسار وطقس',
        keywords: ['تقويم', 'أصوام', 'أعياد', 'سنكسار', 'تاريخ كنسي'],
      },
      {
        id: 'dir-emergency',
        title: 'خطط التدخل والإسعاف الروحي السريع',
        subtitle: 'خطط مساندة وشواهد تعزية في أوقات الضيقة، الفتور الروحي، وحروب التجربة.',
        category: 'liturgical',
        categoryLabel: 'الطقس والإسعاف الروحي',
        icon: Shield,
        iconBg: 'bg-red-950 text-red-400 border-red-600/40',
        action: () => {
          onClose();
          onOpenEmergencyModal?.('distress');
        },
        badge: 'إسعاف فوري',
        keywords: ['طوارئ', 'إسعاف', 'ضيقة', 'فتور', 'حرب', 'تعزية'],
      },
    ],
    [
      onClose,
      onOpenSpiritualGuide,
      onOpenEmergencyModal,
      onOpenSilentRetreat,
      onOpenSaintsStickers,
      onOpenIconGallery,
    ]
  );

  // Filtered Directory Sections
  const filteredSections = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    return directoryItems.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const inTitle = item.title.toLowerCase().includes(q);
      const inSubtitle = item.subtitle.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return inTitle || inSubtitle || inKeywords;
    });
  }, [directoryItems, searchTerm, selectedCategory]);

  // Matching Books from the 36 Full Library Collection
  const matchingBooks = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q || q.length < 2) return [];

    return AUTHENTIC_COPTIC_BOOKS.filter((b) => {
      const title = (b.title || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      const cat = (b.category || '').toLowerCase();
      const desc = (b.description || '').toLowerCase();
      return title.includes(q) || author.includes(q) || cat.includes(q) || desc.includes(q);
    }).slice(0, 6);
  }, [searchTerm]);

  if (!isOpen) return null;

  const categoriesTab = [
    { id: 'all', label: 'الكل' },
    { id: 'library', label: 'المكتبة والمراجع' },
    { id: 'spiritual', label: 'الصلاة والمخدع' },
    { id: 'competitions', label: 'المسابقات والتقييم' },
    { id: 'games', label: 'الألعاب والتسلية' },
    { id: 'training', label: 'التدريب والإبداع' },
    { id: 'liturgical', label: 'الطقس والإسعاف' },
  ];

  const handleSelect = (item: DirectoryCategoryItem) => {
    soundManager.playTick();
    onClose();
    if (item.action) {
      item.action();
    } else if (item.view) {
      onNavigate(item.view);
    }
  };

  const handleSelectBook = (book: BookItem) => {
    soundManager.playTick();
    onClose();
    if (onOpenBookReader) {
      onOpenBookReader(book);
    } else {
      onNavigate('library');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      dir="rtl"
    >
      <div className="bg-stone-900 border-2 border-amber-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-right">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-amber-600/30 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
              🧭
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-spiritual text-lg sm:text-xl font-black text-amber-100">
                  الدليل الشامل والبحث الموحد
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  24+ قسماً ومرجعاً
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                تصفح جميع محاور التطبيق أو ابحث بالكلمات المفتاحية للوصول المباشر للمحتوى المطلوب
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
            title="إغلاق الدليل"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-stone-950/70 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن قسم، كتاب، موضوع، صلاة، لعبة، تدريب، أو أب اعتراف..."
              className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-stone-900 border border-amber-600/30 focus:border-amber-400 text-sm text-stone-100 placeholder-stone-500 outline-none transition"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs px-2 py-1 rounded-lg bg-stone-800"
              >
                مسح
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categoriesTab.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundManager.playTick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-md font-bold'
                    : 'bg-stone-800/70 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Matching Books Section if searching */}
          {matchingBooks.length > 0 && (
            <div className="space-y-3 p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>كتب ومراجع مطابقة في المكتبة الكنسية ({matchingBooks.length}):</span>
                </span>
                <span className="text-[11px] text-stone-400">انقر للفتح بالقارئ مباشرة</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingBooks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBook(b)}
                    className="p-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-600/30 hover:border-amber-400 transition cursor-pointer flex items-center justify-between gap-2 group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-bold text-amber-100 group-hover:text-amber-300 truncate">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 truncate">
                        {b.author} • {b.category}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-amber-600/20 text-amber-300 text-[10px] font-bold shrink-0">
                      فتح 📖
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Directory Sections Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredSections.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-4 rounded-2xl bg-stone-950/80 hover:bg-stone-800/90 border border-stone-800 hover:border-amber-500/60 transition shadow-md hover:shadow-lg flex flex-col justify-between gap-3 cursor-pointer group text-right"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.iconBg} group-hover:scale-105 transition`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900 border border-stone-700 text-stone-300 font-mono">
                        {item.badge || item.categoryLabel}
                      </span>
                    </div>

                    <h3 className="font-spiritual text-sm font-bold text-amber-100 group-hover:text-amber-300 transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-amber-400/90 group-hover:text-amber-300 font-bold">
                    <span>دخول القسم</span>
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSections.length === 0 && matchingBooks.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="text-base font-bold text-amber-200">لم يتم العثور على نتائج</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                جرب البحث بكلمة مختلفة مثل: صلاة، كتب، أثناسيوس، مسابقات، أو تصفح الأقسام عبر الفئات أعلاه.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-800 bg-stone-950/90 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span className="flex items-center gap-1.5">
            <span>💡</span>
            <span>كل محتويات التطبيق والكتب والألعاب محفوظة ومتاحة مباشرة</span>
          </span>
          <button
            onClick={() => {
              soundManager.playTick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
