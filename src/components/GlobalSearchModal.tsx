import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { soundManager } from '../utils/audio';
import { SAINTS_STICKERS_DATA, SaintSticker } from '../data/saintsStickersData';
import { AUTHENTIC_COPTIC_BOOKS, BookItem } from '../data/authenticCopticBooks';
import { useHymnsAudio, SPIRITUAL_OCCASIONS, HymnTrack, SpiritualOccasion } from '../context/HymnsAudioContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  X,
  BookOpen,
  Heart,
  Trophy,
  Shield,
  ShieldCheck,
  Compass,
  ScrollText,
  Coins,
  Calendar,
  Headphones,
  Users,
  Sparkles,
  Play,
  ArrowRight,
  ChevronLeft,
  Star,
  Quote,
  Flame,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

export type SearchCategoryFilter = 'all' | 'saints' | 'hymns' | 'books' | 'topics';

export interface SearchResultItem {
  id: string;
  type: 'saint' | 'hymn' | 'book' | 'topic';
  categoryLabel: string;
  categoryBg: string;
  title: string;
  subtitle: string;
  snippet?: string;
  badge?: string;
  icon: string | React.FC<{ className?: string }>;
  action: () => void;
  actionText: string;
  itemData?: SaintSticker | HymnTrack | BookItem | AppView;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onOpenSaintsStickers?: () => void;
  onOpenSaintsGallery?: () => void;
  onOpenBookReader?: (book: BookItem) => void;
  onOpenSpiritualGuide?: () => void;
  onOpenHeavenlyMessage?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenSaintsStickers,
  onOpenSaintsGallery,
  onOpenBookReader,
  onOpenSpiritualGuide,
  onOpenHeavenlyMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<SearchCategoryFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const { playTrack, openPlayerModal } = useHymnsAudio();
  const { language, t, isRTL } = useLanguage();

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable index of topics
  const staticTopics = useMemo(() => [
    {
      id: 'topic-prayer-fortress',
      title: 'حصن الصلاة اليومي والأجبية',
      subtitle: 'صلوات الساعات، المزامير، وتتبع صلوات المخدع',
      view: 'prayer_fortress' as AppView,
      categoryLabel: 'صلوات',
      categoryBg: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
      icon: Shield,
      keywords: ['صلاة', 'أجبية', 'مزامير', 'مخدع', 'حصن', 'باكر', 'غروب', 'نوم', 'ستار', 'تسبحة'],
    },
    {
      id: 'topic-virtue-jar',
      title: 'حصالة الفضائل والغراس الروحية',
      subtitle: 'تجميع الفضائل اليومية وتدريب القلب والاتضاع',
      view: 'virtue_jar' as AppView,
      categoryLabel: 'فضائل',
      categoryBg: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
      icon: Coins,
      keywords: ['فضيلة', 'فضائل', 'حصالة', 'اتضاع', 'محبة', 'طهارة', 'صمت', 'خدمة', 'سلام'],
    },
    {
      id: 'topic-monastic-oasis',
      title: 'دستور التكريس والرهبنة (واحة النسك)',
      subtitle: 'أقوال وتداريب الآباء، رياضات الصمت، وشجرة الفضائل',
      view: 'monastic_oasis' as AppView,
      categoryLabel: 'نسك وتكريس',
      categoryBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
      icon: Compass,
      keywords: ['رهبنة', 'دستور', 'مكرس', 'مكرسة', 'نسك', 'صمت', 'خلوة', 'حراسة', 'إفراز'],
    },
    {
      id: 'topic-consecrated-manual',
      title: 'مرجع المكرس والخدمة الكنسية',
      subtitle: 'أصول الخدمة، التكريس البتولي والروحي، والإعداد',
      view: 'consecrated_manual' as AppView,
      categoryLabel: 'خدمة وتكريس',
      categoryBg: 'bg-purple-950/80 text-purple-300 border-purple-600/40',
      icon: ScrollText,
      keywords: ['مرجع', 'دليل', 'خدمة', 'بتولية', 'تكرس', 'خادم', 'رسامة', 'أصول'],
    },
    {
      id: 'topic-spiritual-father',
      title: 'أبوي الروحي وإعداد جلسة الاعتراف',
      subtitle: 'فحص الضمير، تتبع النمو الروحي، وإعداد الاعتراف',
      view: 'spiritual_father' as AppView,
      categoryLabel: 'إرشاد واعتراف',
      categoryBg: 'bg-blue-950/80 text-blue-300 border-blue-600/40',
      icon: ShieldCheck,
      keywords: ['اعتراف', 'أب اعتراف', 'ضمير', 'توبة', 'إرشاد', 'تلمذة', 'تداريب'],
    },
    {
      id: 'topic-biblical-study',
      title: 'الدراسة الكتابية المعمقة والتفاسير الآبائية',
      subtitle: 'شروحات الآباء للأسفار، النبووات، والتصميم الخالق',
      view: 'biblical_study' as AppView,
      categoryLabel: 'دراسة كتابية',
      categoryBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-600/40',
      icon: BookOpen,
      keywords: ['كتاب', 'إنجيل', 'تفسير', 'آباء', 'نبووة', 'جينات', 'تصميم', 'أسفار'],
    },
    {
      id: 'topic-competitions-hub',
      title: 'بنك الأسئلة والمراحل الكنسية',
      subtitle: 'مسابقات عقيدية، طقسية، تاريخية، وثقافية',
      view: 'competitions_hub' as AppView,
      categoryLabel: 'مسابقات',
      categoryBg: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
      icon: Trophy,
      keywords: ['أسئلة', 'مسابقة', 'اختبار', 'مراحل', 'نقاط', 'ترتيب', 'تقييم'],
    },
    {
      id: 'topic-spiritual-calendar',
      title: 'السنكسار والتقويم القبطي الكنسي',
      subtitle: 'أعياد وأصوام وتذكارات القديسين يومياً',
      view: 'spiritual_calendar' as AppView,
      categoryLabel: 'تقويم وطقس',
      categoryBg: 'bg-stone-800 text-stone-200 border-stone-600/40',
      icon: Calendar,
      keywords: ['سنكسار', 'تقويم', 'قبطي', 'أعياد', 'أصوام', 'تذكار', 'شهداء'],
    },
  ], []);

  // Compute search results across all domains
  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // If query is empty, provide top recommended suggestions
    const isSearching = q.length > 0;

    // 1. Search Saints & Fathers
    SAINTS_STICKERS_DATA.forEach((s) => {
      const matchName = s.name.toLowerCase().includes(q);
      const matchEpithet = s.epithet.toLowerCase().includes(q);
      const matchVirtue = s.virtue.toLowerCase().includes(q);
      const matchQuote = s.quote.toLowerCase().includes(q);
      const matchTradition = s.traditionLabel.toLowerCase().includes(q);

      if (!isSearching || matchName || matchEpithet || matchVirtue || matchQuote || matchTradition) {
        items.push({
          id: `saint-${s.id}`,
          type: 'saint',
          categoryLabel: 'القديسون والآباء',
          categoryBg: 'bg-amber-950/80 text-amber-300 border-amber-600/40',
          title: s.name,
          subtitle: `${s.epithet} • ${s.traditionLabel}`,
          snippet: s.quote ? `«${s.quote.slice(0, 110)}...»` : s.dailyMessage.slice(0, 110),
          badge: s.virtue,
          icon: s.badgeIcon || '🏔️',
          action: () => {
            soundManager.playCorrect();
            onClose();
            if (onOpenSaintsStickers) {
              onOpenSaintsStickers();
            } else if (onOpenSaintsGallery) {
              onOpenSaintsGallery();
            } else {
              onNavigate('spiritual_calendar');
            }
          },
          actionText: 'عرض سيرة القديس والملصق 📜',
          itemData: s,
        });
      }
    });

    // 2. Search Hymns & Audio
    SPIRITUAL_OCCASIONS.forEach((occ: SpiritualOccasion) => {
      occ.tracks.forEach((track: HymnTrack) => {
        const matchTitle = track.title.toLowerCase().includes(q);
        const matchSubtitle = track.subtitle.toLowerCase().includes(q);
        const matchLyrics = track.lyrics.some((l) => l.toLowerCase().includes(q));
        const matchOccasion = occ.name.toLowerCase().includes(q) || occ.shortName.toLowerCase().includes(q);
        const matchSaint = track.patristicSaint.toLowerCase().includes(q);

        if (!isSearching || matchTitle || matchSubtitle || matchLyrics || matchOccasion || matchSaint) {
          items.push({
            id: `hymn-${track.id}`,
            type: 'hymn',
            categoryLabel: 'الترانيم والألحان',
            categoryBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40',
            title: track.title,
            subtitle: `${track.subtitle} • (${occ.shortName})`,
            snippet: track.lyrics[0] ? `«${track.lyrics[0]}»` : track.meditation.slice(0, 110),
            badge: `${Math.floor(track.durationSec / 60)} دقيقة`,
            icon: Headphones,
            action: () => {
              soundManager.playCorrect();
              playTrack(track);
              openPlayerModal();
              onClose();
            },
            actionText: 'تشغيل واستماع للكلمات 🎵',
            itemData: track,
          });
        }
      });
    });

    // 3. Search Authentic Coptic Books
    AUTHENTIC_COPTIC_BOOKS.forEach((book: BookItem) => {
      const matchTitle = book.title.toLowerCase().includes(q);
      const matchAuthor = book.author.toLowerCase().includes(q);
      const matchCategory = book.category.toLowerCase().includes(q);
      const matchDesc = book.description.toLowerCase().includes(q);

      if (!isSearching || matchTitle || matchAuthor || matchCategory || matchDesc) {
        items.push({
          id: `book-${book.id}`,
          type: 'book',
          categoryLabel: 'المكتبة والكتب الكنسية',
          categoryBg: 'bg-purple-950/80 text-purple-300 border-purple-600/40',
          title: book.title,
          subtitle: `${book.author} • ${book.category}`,
          snippet: book.description.slice(0, 110) + '...',
          badge: `${book.pages} صفحة`,
          icon: BookOpen,
          action: () => {
            soundManager.playCorrect();
            onClose();
            if (onOpenBookReader) {
              onOpenBookReader(book);
            } else {
              onNavigate('library');
            }
          },
          actionText: 'قراءة الكتاب بالمكتبة 📚',
          itemData: book,
        });
      }
    });

    // 4. Search Topics & Features
    staticTopics.forEach((top) => {
      const matchTitle = top.title.toLowerCase().includes(q);
      const matchSubtitle = top.subtitle.toLowerCase().includes(q);
      const matchKeywords = top.keywords.some((kw) => kw.toLowerCase().includes(q));

      if (!isSearching || matchTitle || matchSubtitle || matchKeywords) {
        items.push({
          id: top.id,
          type: 'topic',
          categoryLabel: top.categoryLabel,
          categoryBg: top.categoryBg,
          title: top.title,
          subtitle: top.subtitle,
          icon: top.icon,
          action: () => {
            soundManager.playCorrect();
            onClose();
            onNavigate(top.view);
          },
          actionText: 'فتح القسم الروحي 🧭',
          itemData: top.view,
        });
      }
    });

    // Apply active filter
    if (activeFilter === 'all') return items;
    return items.filter((item) => {
      if (activeFilter === 'saints') return item.type === 'saint';
      if (activeFilter === 'hymns') return item.type === 'hymn';
      if (activeFilter === 'books') return item.type === 'book';
      if (activeFilter === 'topics') return item.type === 'topic';
      return true;
    });
  }, [
    searchQuery,
    activeFilter,
    staticTopics,
    onClose,
    onNavigate,
    onOpenSaintsStickers,
    onOpenSaintsGallery,
    onOpenBookReader,
    playTrack,
    openPlayerModal,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 animate-fade-in"
      dir="rtl"
    >
      <div className="relative w-full max-w-3xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh] mt-4 sm:mt-10">
        {/* Header Search Bar */}
        <div className="p-4 sm:p-5 bg-stone-900/90 border-b border-stone-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-amber-400 absolute right-3 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن اسم قديس، ترنيمة، كتاب، صلاة، أو موضوع كنسي..."
                className="w-full pl-10 pr-11 py-3 bg-stone-950 border border-amber-500/30 focus:border-amber-400 rounded-2xl text-amber-100 text-sm font-medium outline-hidden transition placeholder:text-stone-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 p-1 text-stone-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="مسح البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer shrink-0 border border-stone-700"
              title="إغلاق البحث"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-xs'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-amber-200'
              }`}
            >
              جميع النتائج ({results.length})
            </button>
            <button
              onClick={() => setActiveFilter('saints')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'saints'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-xs'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-amber-200'
              }`}
            >
              <span>🏔️</span>
              <span>القديسون والآباء</span>
            </button>
            <button
              onClick={() => setActiveFilter('hymns')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'hymns'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-emerald-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>الترانيم والألحان</span>
            </button>
            <button
              onClick={() => setActiveFilter('books')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'books'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-xs'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-purple-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>المكتبة والكتب</span>
            </button>
            <button
              onClick={() => setActiveFilter('topics')}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeFilter === 'topics'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-xs'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-blue-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>الموضوعات والأقسام</span>
            </button>
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 divide-y divide-stone-900">
          {results.length > 0 ? (
            results.map((res) => {
              const IconComp = typeof res.icon === 'string' ? null : res.icon;
              return (
                <div
                  key={res.id}
                  onClick={res.action}
                  className="pt-3 first:pt-0 group cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl hover:bg-stone-900/80 transition border border-transparent hover:border-amber-500/30"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Icon / Avatar Badge */}
                    <div className="w-10 h-10 rounded-2xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center shrink-0 text-xl shadow-md text-amber-300">
                      {typeof res.icon === 'string' ? (
                        <span>{res.icon}</span>
                      ) : IconComp ? (
                        <IconComp className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${res.categoryBg}`}>
                          {res.categoryLabel}
                        </span>
                        {res.badge && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-800 text-amber-300/80 border border-stone-700">
                            {res.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="font-spiritual font-bold text-sm sm:text-base text-amber-100 group-hover:text-amber-300 transition truncate">
                        {res.title}
                      </h4>

                      <p className="text-xs text-stone-400 truncate">
                        {res.subtitle}
                      </p>

                      {res.snippet && (
                        <p className="text-[11px] text-stone-300 italic line-clamp-2 leading-relaxed pt-1 bg-stone-950/50 p-2 rounded-xl border border-stone-800/80">
                          {res.snippet}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    <button className="px-3 py-1.5 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-300 group-hover:text-stone-950 font-bold text-xs transition border border-amber-500/30 flex items-center gap-1.5 shadow-xs">
                      <span>{res.actionText}</span>
                      <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center space-y-3 text-stone-400">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center mx-auto text-2xl">
                🔎
              </div>
              <h3 className="font-spiritual text-base font-bold text-amber-200">
                لم نجد نتائج مطابقة لـ «{searchQuery}»
              </h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                جرب البحث باستخدام كلمات أخرى مثل: «أنطونيوس»، «أغسطينوس»، «أجبية»، «البصخة»، «ثوك با تي جوم»، أو «العذراء».
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Notice */}
        <div className="px-5 py-3 bg-stone-950 border-t border-stone-900 text-stone-500 text-[11px] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 font-mono text-[10px]">
              ESC
            </span>
            <span>للإغلاق</span>
          </div>
          <span>منصة «حسب قلب الله» للبحث الشامل ✝️</span>
        </div>
      </div>
    </div>
  );
};
