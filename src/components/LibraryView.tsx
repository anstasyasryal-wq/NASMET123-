import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  BookOpen,
  Search,
  ChevronLeft,
  Bookmark,
  CheckCircle2,
  Sparkles,
  X,
  Type,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useVirtualGrid } from '../hooks/useVirtualList';

interface BookChapter {
  chapterNumber: number;
  chapterTitle: string;
  excerpt: string;
}

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  description: string;
  chapters: BookChapter[];
}

interface LibraryViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
  onOpenIconGallery?: () => void;
  onOpenSaintsGallery?: () => void;
}

const BOOKS_DATA: BookItem[] = [
  {
    id: 'book-1',
    title: 'تجسد الكلمة (De Incarnatione)',
    author: 'القديس أثناسيوس الرسولي',
    category: 'اللاهوت العقيدي',
    pages: 180,
    description: 'المرجع الآبائي الأول عالمياً في شرح علة تجسد الله وفداء البشرية وتجديد الخلقة.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الفصل الأول: خلقة الإنسان وسقوطه في الفساد',
        excerpt:
          'خلق الله الإنسان على صورته ومثاله، ومنحه نعمة العقل والخلود بشرط الثبات في معرفة الصانع. فلما انقاد الإنسان لغواية الحية، دخل الموت إلى العالم وصار الفساد متسلطاً على الطبيعة البشرية، فكان لا بد من تدخل الصانع ذاته لتجديد ما قد فسد.',
      },
      {
        chapterNumber: 2,
        chapterTitle: 'الفصل الثاني: لماذا كان التجسد حتمياً للخلاص؟',
        excerpt:
          'لم يكن ممكناً أن يُترك الإنسان للفناء، لأن ذلك لا يليق بصلاح الله. ولم يكن التوبة وحدها كافية لرفع حكم الموت وتجديد الطبيعة الفاسدة؛ بل كان يلزم أن يأتي كلمة الله ذاته الذي أوجد الكل من العدم ليتخذ جسداً قابلاً للموت فيبيد الموت بموته.',
      },
      {
        chapterNumber: 3,
        chapterTitle: 'الفصل الثالث: القيامة وإبطال سلطان الهاوية',
        excerpt:
          'بقيامة الكلمة المتجسد من بين الأموات، أضحى الموت مستهاناً به، حتى صار الشهداء والأطفال والبتوليون يستهينون بالموت ويسخرون من الشياطين كمن قد غلبوا بقوة الصليب المحيي.',
      },
    ],
  },
  {
    id: 'book-2',
    title: 'بستان الرهبان وأقوال شيوخ البرية',
    author: 'آباء براري مصر وشيهيت',
    category: 'التراث الرهباني والنسكي',
    pages: 340,
    description: 'حكم ودروس عملية في الاتضاع والصمت والوداعة ومحاربة الأفكار من برية مصر العريقة.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الباب الأول: في الصمت وحراسة اللسان',
        excerpt:
          'سأل أخ الأب أرسانيوس قائلاً: "كيف أخلص؟" فقال له الشيخ: "اهرب من الناس، واصمت، واسكن؛ فهذه هي أصول عدم الخطية". وقال الأنبا أغاثون: "إن الإنسان المتكلم بلا ضبط يشبه مدينة بلا أسوار يدخلها كل عابر سبيل".',
      },
      {
        chapterNumber: 2,
        chapterTitle: 'الباب الثاني: في التواضع وانسحاق الفكر',
        excerpt:
          'قال القديس أنطونيوس: "رأيت فخاخ العدو مبثوثة على الأرض كلها، فقلت متأوهاً: يا ترى من ينجو منها؟ فسمعت صوتاً يقول لي: المتواضعون ينجون منها ولا تقترب منهم البتة".',
      },
    ],
  },
  {
    id: 'book-3',
    title: 'الرسائل الفصحية وتحديد الأسفار المقدسة',
    author: 'البابا أثناسيوس الرسولي',
    category: 'التاريخ الكنسي والرسائل',
    pages: 210,
    description: 'تحديد أسفار العهد الجديد وتوجيهات الصوم الكبير والفصح المجيد عبر الأجيال.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الرسالة 39: أسفار العهد الجديد المعترف بها',
        excerpt:
          'هذه هي ينابيع الخلاص؛ فمن كان عطشاناً فليستقِ من الكلمات الإلهية الواردة فيها. فيها وحدها يُعلن التعليم الإلهي ولا يجوز لأحد أن يزيد عليها شيئاً أو ينقص منها شيئاً.',
      },
    ],
  },
  {
    id: 'book-4',
    title: 'الخلق والتصميم الإلهي في ميزان العلم والوراثة',
    author: 'دراسات كنسية وأكاديمية موثقة',
    category: 'العلم والإيمان والوراثة',
    pages: 290,
    description: 'بحث رصين حول علم الجينات، البصمة الوراثية، والتوافق الباهر بين العلم المعاصر والوحي الإلهي.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الفصل الأول: الشفرة الوراثية وأبجدية الحياة',
        excerpt:
          'يتكون شريط الـ DNA من 3 مليارات زوج من القواعد النيتروجينية المرتبة بدقة متناهية. هذا التسلسل المعقد يحمل توجيهات تشغيل الخلية الحية بأدق من أضخم البرمجيات البشرية، مما يقود العلماء المنصفين للاعتراف بوجود عقل مصمم فائق الحكمة.',
      },
    ],
  },
  {
    id: 'book-5',
    title: 'السلم إلى الله (سلم الفضائل)',
    author: 'القديس يوحنا الدرجي',
    category: 'التراث الرهباني والنسكي',
    pages: 310,
    description: 'ثلاثون درجة روحية تصعد بالنفس من التوبة ونبذ المقتنيات إلى محبة الله والاتحاد به.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الدرجة الأولى: في التخلي عن العالم الزائل',
        excerpt:
          'الراهب والمكرس الحقيقي هو من رغب في السماويات وحسب كل أرضيات نفاية لكي يربح المسيح ويوجد فيه بالبر الحقيقي.',
      },
    ],
  },
  {
    id: 'book-6',
    title: 'شرح قانون الإيمان والمجامع المسكونية',
    author: 'الآباء الأرثوذكس والباحثون الكنسيون',
    category: 'اللاهوت العقيدي',
    pages: 260,
    description: 'تحليل تاريخي ولاهوتي دقيق لمجمعي نيقية والقسطنطينية وصياغة الإيمان الأرثوذكسي القويم.',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'الفصل الأول: نيقية وصيغة مساوٍ للآب في الجوهر',
        excerpt:
          'أقر الآباء الثلاثمائة وثمانية عشر اصطلاح (هومو أوسيوس) رداً على آريوس، مؤكدين أزلية الكلمة ومساواته التامة للآب بلا انفصال ولا امتزاج.',
      },
    ],
  },
];

const READ_STORAGE_KEY = 'mokarasa_library_read_books_v1';

// Memoized Book Card Component to eliminate unnecessary re-renders
interface BookCardProps {
  book: BookItem;
  isRead: boolean;
  onOpenReader: (b: BookItem) => void;
  onToggleRead: (id: string) => void;
}

const BookCard = memo<BookCardProps>(({ book, isRead, onOpenReader, onToggleRead }) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition space-y-3 shadow-md flex flex-col justify-between h-full ${
        isRead
          ? 'bg-stone-900/95 border-emerald-500/60 ring-1 ring-emerald-500/30'
          : 'bg-stone-900 border-amber-600/30 hover:border-amber-400'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/40 inline-block">
            {book.category}
          </span>
          {isRead && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              <span>تمت القراءة</span>
            </span>
          )}
        </div>

        <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
          {book.title}
        </h3>
        <p className="text-xs text-amber-300/80 font-semibold">
          بقلم: {book.author} • {book.pages} صفحة
        </p>
        <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
          {book.description}
        </p>
      </div>

      <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => onOpenReader(book)}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>فتح القارئ الإلكتروني</span>
        </button>

        <button
          onClick={() => onToggleRead(book.id)}
          className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isRead
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
              : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
          }`}
          title={isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export const LibraryView: React.FC<LibraryViewProps> = ({
  currentUser,
  onOpenLogin,
  onBackToHome,
  onOpenIconGallery,
  onOpenSaintsGallery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive columns (1 on mobile, 2 on md: >= 768px)
  const [columns, setColumns] = useState<number>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;
  });

  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth >= 768 ? 2 : 1);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [readBooks, setReadBooks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookRead = useCallback((id: string) => {
    soundManager.playTick();
    setReadBooks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      try {
        localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleOpenBookReader = useCallback((b: BookItem) => {
    soundManager.playTick();
    setReadingBook(b);
    setActiveChapterIdx(0);
  }, []);

  const categories = useMemo(() => {
    const set = new Set(BOOKS_DATA.map((b) => b.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return BOOKS_DATA.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Virtualized Grid for books list (Approx row height: 230px + 16px gap = 246px)
  const BOOK_ROW_HEIGHT = 246;
  const {
    virtualRows,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
  } = useVirtualGrid({
    items: filtered,
    columns,
    rowHeight: BOOK_ROW_HEIGHT,
    overscan: 2,
    containerRef,
    useWindowScroll: true,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-800/50 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>المستودع المعرفي والوثائقي للمكرسين</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📚 مكتبة الكتب والمراجع والآباء
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مكتبة رقمية شاملة لكتب التراث الكنسي الكلاسيكي، أبحاث الوراثة والعلوم، مع قارئ فصول مدمج، بتقنية القائمة الافتراضية لخفة فائقة على الموبايل.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالعنوان أو الكاتب أو التصنيف..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer text-xs ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                }`}
              >
                {cat === 'all' ? 'جميع التصنيفات' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Saints Gallery Interactive Banner (East & West) */}
      {onOpenSaintsGallery && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📜</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                سير الآباء والقديسين (آباء الشرق والغرب)
              </h4>
              <p className="text-xs text-stone-300">
                مرجع شامل يضم سير وتراث وعِبر عمالقة الإيمان في الكنيسة الجامعة شرقاً وغرباً.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSaintsGallery}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>استعرض سير الآباء</span>
          </button>
        </div>
      )}

      {/* Icon Gallery Interactive Banner */}
      {onOpenIconGallery && (
        <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border border-amber-500/50 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🖼️</span>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                معرض الأيقونات الكنسية التفاعلي والشرح الروحي
              </h4>
              <p className="text-xs text-stone-300">
                تأمل في دلالات الأيقونات القبطية والتقليدية والعمق اللاهوتي والتاريخي لكل أيقونة.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenIconGallery}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>استعرض معرض الأيقونات</span>
          </button>
        </div>
      )}

      {/* Virtualized Books Grid */}
      <div ref={containerRef} className="relative min-h-[120px]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 text-xs">
            لا توجد كتب أو مراجع تطابق معايير البحث الحالية.
          </div>
        ) : (
          <div style={{ minHeight: totalHeight }}>
            {/* Top Spacer for virtual window */}
            {topSpacerHeight > 0 && (
              <div style={{ height: topSpacerHeight }} aria-hidden="true" />
            )}

            {/* Virtualized Rows */}
            <div className="space-y-4">
              {virtualRows.map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  className={`grid gap-4 ${
                    columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                  style={{ minHeight: BOOK_ROW_HEIGHT - 16 }}
                >
                  {virtualRow.item.map((b) => (
                    <BookCard
                      key={b.id}
                      book={b}
                      isRead={readBooks.includes(b.id)}
                      onOpenReader={handleOpenBookReader}
                      onToggleRead={toggleBookRead}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom Spacer for virtual window */}
            {bottomSpacerHeight > 0 && (
              <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />
            )}
          </div>
        )}
      </div>

      {/* INTERACTIVE BOOK READER MODAL */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-right">
            {/* Reader Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-400 font-bold block">
                    {readingBook.author} • {readingBook.category}
                  </span>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                    {readingBook.title}
                  </h3>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-xl border border-stone-800">
                  <Type className="w-3 h-3 text-stone-400" />
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'normal' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                  >
                    عادي
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'large' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                  >
                    كبير
                  </button>
                  <button
                    onClick={() => setFontSize('huge')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'huge' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
                  >
                    أكبر
                  </button>
                </div>

                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chapters Tabs */}
            <div className="p-3 bg-stone-900/60 border-b border-stone-800 flex items-center gap-2 overflow-x-auto shrink-0">
              {readingBook.chapters.map((chap, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => {
                    soundManager.playTick();
                    setActiveChapterIdx(cIdx);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    activeChapterIdx === cIdx
                      ? 'bg-amber-600 text-white shadow'
                      : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {chap.chapterTitle.split(':')[0]}
                </button>
              ))}
            </div>

            {/* Chapter Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-stone-950">
              <div className="space-y-3">
                <h4 className="font-spiritual text-lg sm:text-xl font-bold text-amber-200 border-b border-amber-900/40 pb-2">
                  {readingBook.chapters[activeChapterIdx].chapterTitle}
                </h4>
                <div
                  className={`text-stone-200 leading-relaxed font-spiritual bg-stone-900/60 p-6 rounded-2xl border border-stone-800/80 shadow-inner ${
                    fontSize === 'huge'
                      ? 'text-lg sm:text-xl leading-loose'
                      : fontSize === 'large'
                        ? 'text-base sm:text-lg leading-loose'
                        : 'text-sm sm:text-base leading-relaxed'
                  }`}
                >
                  {readingBook.chapters[activeChapterIdx].excerpt}
                </div>
              </div>

              {/* Reader Footer Actions */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => toggleBookRead(readingBook.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    readBooks.includes(readingBook.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {readBooks.includes(readingBook.id)
                      ? 'تم تسجيل قراءة هذا الكتاب'
                      : 'تحديد ككتاب تمت قراءته'}
                  </span>
                </button>

                {activeChapterIdx < readingBook.chapters.length - 1 && (
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setActiveChapterIdx((prev) => prev + 1);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>الفصل التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
