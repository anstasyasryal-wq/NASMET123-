import React, { useState, useMemo, useCallback, useRef, useEffect, memo } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Search,
  ChevronLeft,
  Bookmark,
  CheckCircle2,
  Sparkles,
  X,
  Type,
  FileText,
  Brain,
  Award,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useVirtualGrid } from '../hooks/useVirtualList';
import { AUTHENTIC_COPTIC_BOOKS, BookItem } from '../data/authenticCopticBooks';

interface DeepArticle {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  introduction: string;
  biblicalReferences: string[];
  patristicQuotes: { quote: string; source: string }[];
  analysisBody: string;
  reflectionQuestions: string[];
  practicalExercise: string;
  references: string[];
}

interface AnalyticalQuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  scriptureReference: string;
}

interface LibraryViewProps {
  currentUser: User | null;
  onOpenLogin: () => void;
  onBackToHome: () => void;
  onOpenIconGallery?: () => void;
  onOpenSaintsGallery?: () => void;
}

const DEEP_ARTICLES_DATA: DeepArticle[] = [
  {
    id: 'art-1',
    title: 'لاهوت الألم والصليب في الفكر الآبائي الأرثوذكسي',
    author: 'لجنة الدراسات اللاهوتية والأيقونية',
    category: 'دراسات متعمقة',
    date: 'أكتوبر 2026',
    introduction:
      'لا يُنظر إلى الألم في المسيحية الأرثوذكسية باعتباره مجرد عقوبة عبثية، بل هو ميدان للجهاد الروحي وشركة في آلام الفادي الأقدس لكي نتمتع بقوة قيامته المجيدة.',
    biblicalReferences: ['رسالة بولس الرسول إلى أهل فيلبي 3: 10', 'رسالة بطرس الرسول الأولى 4: 12-13'],
    patristicQuotes: [
      {
        quote: '«الصليب هو ميزان الحب الإلهي، وبه نعرف كم أحب الله هذا العالم حتى بذل ابنه الوحيد لكي لا يهلك كل من يؤمن به».',
        source: 'القديس باذليوس الكبير',
      },
    ],
    analysisBody:
      'يعلمنا الآباء أن الصليب ليس مجرد خشبة وُضع عليها المخلص، بل هو رمز لحياة البذل الكامل والتسليم لإرادة الآب. حينما يجتاز المؤمن تجارب الضيق والفتور، فإن الثبات في الشكر والالتصاق بالمخدع يحول الضيق إلى شركة مجيدة في المجد الأبدي.',
    reflectionQuestions: [
      'كيف تتعامل مع التجارب المفاجئة وهل تلجأ للمخدع أولاً أم للشكوى؟',
      'ما هي المفاهيم الخاطئة عن الألم وكيف يصححها الصليب؟',
    ],
    practicalExercise: 'خصص 15 دقيقة كل مساء لتأمل مزمور 23 وسط الضيق دون تذمر.',
    references: ['كتاب تجسد الكلمة - القديس أثناسيوس', 'عظات حول الصليب - يوحنا ذهبي الفم'],
  },
  {
    id: 'art-2',
    title: 'أهمية صلاة الأجبية والصلوات الساعية في حياة المكرس',
    author: 'القمص متى المسكين (مستوحى من تراث الآباء)',
    category: 'الصلاة والفضائل',
    date: 'سبتمبر 2026',
    introduction:
      'صلاة السواعي (الأجبية) هي نبض الكنيسة اليومي، ترتب فكر الإنسان وتربطه بالسماء طوال ساعات النهار والليل.',
    biblicalReferences: ['سفر المزامير 119: 164', 'سفر أعمال الرسل 3: 1'],
    patristicQuotes: [
      {
        quote: '«المزامير هي مرآة للنفس، فيها ترى خطاياها وتجد فيها الدواء والشفاء لكل جرح روحي».',
        source: 'البابا أثناسيوس الرسولي',
      },
    ],
    analysisBody:
      'حين يصلي المؤمن صلاة الساعة الثالثة، يتذكر حلول الروح القدس على التلاميذ. وحين يصلي السادسة، يتذكر صلب رب المجد. هذا الترتيب اليومي يعصم الفكر عن الانجراف في تفاهات العالم.',
    reflectionQuestions: [
      'هل تلتزم بقراءة ساعات الأجبية بانتظام وخشوع أم تؤديها كواجب شكلي؟',
      'كيف تؤثر كلمات المزامير على حديثك الداخلي مع الله؟',
    ],
    practicalExercise: 'صلِّ صلاة الغروب ببطء مع التأمل في كل كلمة من مزاميرها.',
    references: ['مقدمة كتاب الأجبية المقدسة', 'تفسير بستان الرهبان'],
  },
];

const ANALYTICAL_QUIZZES_DATA: AnalyticalQuizQuestion[] = [
  {
    id: 'q-1',
    category: 'اللاهوت العقيدي',
    question: 'في كتاب "تجسد الكلمة" للقديس أثناسيوس، لماذا أكد القديس أن التوبة وحدها لم تكن كافية لرفع حكم الموت عن البشرية؟',
    options: [
      'لأن التوبة لا تلغي عقوبة الموت الفاسد التي دخلت بالطبيعة، وكان لزاماً أن يأتي الخالق ليجدد الطبيعة بنفسه',
      'لأن الله كان مصراً على إفناء البشر دون استثناء',
      'لأن التوبة ليس لها أي قيمة أمام الله',
      'لأن البشر لم تكن لديهم القدرة على تقديم التوبة مطلقاً',
    ],
    correctAnswer: 0,
    explanation:
      'يوضح القديس أثناسيوس أن التوبة تُرجع الإنسان عن خطيئته لكنها لا تعيد خلق الطبيعة الفاسدة التي فسدت بالموت، فكان لا بد لكلمة الله أن يتجسد ليعطينا حياته غير المائتة.',
    scriptureReference: 'رسالة بولس الرسول إلى أهل رومية 5: 12-17',
  },
  {
    id: 'q-2',
    category: 'التراث الرهباني',
    question: 'ما هو المفهوم الحقيقي للصمت وحراسة اللسان بحسب أقوال الآباء في بستان الرهبان؟',
    options: [
      'الامتناع عن الكلام تماماً طوال العمر وعدم خدمة الآخرين',
      'حراسة الفكر والقلب وضبط الكلمات لكي لا تصبح النفس كمدينة بلا أسوار',
      'التكبر على الناس وعدم الرد على السلام',
      'الهروب من المسؤوليات الروحية والكنسية',
    ],
    correctAnswer: 1,
    explanation:
      'يشبه الآباء الإنسان المتكلم بلا ضبط بمدينة مهدمة الأسوار يدخلها العدو متى شاء؛ فالصمت هو سياج يحمي النقاوة الداخلية.',
    scriptureReference: 'سفر الأمثال 18: 21 • رسالة يعقوب 3: 2',
  },
  {
    id: 'q-3',
    category: 'دراسات كتابية',
    question: 'ما هي الغاية الأساسية من دراسة الأسفار المقدسة في التقليد الأرثوذكسي؟',
    options: [
      'جمع معلومات تاريخية وجغرافية فقط للتفاخر المعرفي',
      'الوصول إلى معاينة المسيح الفادي والاتحاد به ككلمة الحياة المعلن في الكتب',
      'إثبات التفوق الفكري على الآخرين',
      'استخدام الآيات للجدل الباطل والخصومات',
    ],
    correctAnswer: 1,
    explanation:
      'الكتاب المقدس ليس مجرد كتاب تاريخي بل هو شهادة حية عن السيد المسيح، وغاية قراءته هي نيل الحياة الأبدية والشركة الإلهية.',
    scriptureReference: 'إنجيل يوحنا 5: 39-40',
  },
];

const READ_STORAGE_KEY = 'mokarasa_library_read_books_v2';

export interface BookProgress {
  chapterIdx: number;
  scrollTop: number;
  lastReadAt: string;
}

const getInitialStorageData = (): { readIds: string[]; progress: Record<string, BookProgress> } => {
  try {
    const saved = localStorage.getItem(READ_STORAGE_KEY);
    if (!saved) return { readIds: [], progress: {} };
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return { readIds: parsed, progress: {} };
    }
    if (typeof parsed === 'object' && parsed !== null) {
      const readIds = Array.isArray(parsed.readIds)
        ? parsed.readIds
        : Array.isArray(parsed.completed)
        ? parsed.completed
        : [];
      const progress = parsed.progress && typeof parsed.progress === 'object' ? parsed.progress : {};
      return { readIds, progress };
    }
  } catch (err) {
    console.error('Failed to load library read books storage:', err);
  }
  return { readIds: [], progress: {} };
};

const saveStorageData = (readIds: string[], progress: Record<string, BookProgress>) => {
  try {
    const payload = { readIds, progress };
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save library read books storage:', err);
  }
};

// Memoized Book Card Component
interface BookCardProps {
  book: BookItem;
  isRead: boolean;
  progress?: BookProgress;
  onOpenReader: (b: BookItem) => void;
  onToggleRead: (id: string) => void;
}

const BookCard = memo<BookCardProps>(({ book, isRead, progress, onOpenReader, onToggleRead }) => {
  const chaptersCount = book?.chapters?.length || 0;
  const hasProgress = Boolean(progress && progress.chapterIdx !== undefined && chaptersCount > 0);
  const currentChapNumber = hasProgress ? Math.min((progress?.chapterIdx ?? 0) + 1, chaptersCount) : 1;
  const progressPercent = (hasProgress && chaptersCount > 0) ? Math.round((currentChapNumber / chaptersCount) * 100) : 0;

  return (
    <div
      className={`p-5 rounded-3xl border transition space-y-4 shadow-xl flex flex-col justify-between h-full text-right ${
        isRead
          ? 'bg-stone-900/95 border-emerald-500/60 ring-1 ring-emerald-500/30'
          : 'bg-stone-900 border-amber-600/30 hover:border-amber-400'
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-700/40 inline-block">
            {book?.category || 'عام'}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {book?.completenessStatus && (
              <span className="text-[10px] text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-600/40 font-semibold">
                {book.completenessStatus}
              </span>
            )}
            {book?.licenseStatus && (
              <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-600/40 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{book.licenseStatus}</span>
              </span>
            )}
          </div>
        </div>

        <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 leading-snug">
          {book?.title || 'بدون عنوان'}
        </h3>
        {book?.originalTitle && (
          <p className="text-[11px] text-stone-400 font-mono italic">{book.originalTitle}</p>
        )}
        <p className="text-xs text-amber-300/90 font-semibold">
          بقلم: {book?.author || 'غير محدد'}
          {book?.translator && <span className="text-stone-400 block text-[11px] mt-0.5">ترجمة: {book.translator}</span>}
        </p>

        {/* Saved Reading Progress Pill */}
        {hasProgress && (
          <div className="p-2.5 rounded-2xl bg-amber-950/50 border border-amber-600/30 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-200">
              <span className="flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                <span>موقفك في القراءة: الفصل {currentChapNumber} من {chaptersCount}</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden border border-amber-900/40">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
          {book?.description || 'لا يوجد وصف متوفر.'}
        </p>

        {(book?.publisher || book?.year) && (
          <div className="text-[10px] text-stone-400 bg-stone-950 p-2 rounded-xl border border-stone-800/80 flex items-center justify-between">
            <span>{book?.publisher || 'طبعة معتمدة'}</span>
            <span>{book?.year || ''}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => onOpenReader(book)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{hasProgress ? 'استئناف القراءة 📖' : 'فتح القارئ المدمج'}</span>
        </button>

        {book?.sourceUrl && (
          <a
            href={book.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 hover:text-white transition flex items-center justify-center cursor-pointer"
            title="فتح المصدر الكنسي الخارجي المعتمد"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={() => book?.id && onToggleRead(book.id)}
          className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isRead
              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
              : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
          }`}
          title={isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء'}
        >
          <Bookmark className="w-4 h-4" />
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
  const [activeTab, setActiveTab] = useState<'books' | 'articles' | 'quizzes'>('books');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readingBook, setReadingBook] = useState<BookItem | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  const [readingArticle, setReadingArticle] = useState<DeepArticle | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pendingScrollTop = useRef<number>(0);
  const isInitialScrollRestore = useRef<boolean>(true);
  const scrollSaveTimeoutRef = useRef<any>(null);

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

  const [readBooks, setReadBooks] = useState<string[]>(() => getInitialStorageData().readIds);
  const [readingProgress, setReadingProgress] = useState<Record<string, BookProgress>>(() => getInitialStorageData().progress);

  const updateBookProgress = useCallback((bookId: string, chapterIdx: number, scrollTop: number) => {
    if (!bookId) return;
    setReadingProgress((prevProgress) => {
      const updatedProgress = {
        ...prevProgress,
        [bookId]: {
          chapterIdx,
          scrollTop: Math.max(0, Math.round(scrollTop)),
          lastReadAt: new Date().toISOString(),
        },
      };
      setReadBooks((currentReadIds) => {
        saveStorageData(currentReadIds, updatedProgress);
        return currentReadIds;
      });
      return updatedProgress;
    });
  }, []);

  const toggleBookRead = useCallback((id: string) => {
    if (!id) return;
    soundManager.playTick();
    setReadBooks((prevReadIds) => {
      const nextReadIds = prevReadIds.includes(id)
        ? prevReadIds.filter((b) => b !== id)
        : [...prevReadIds, id];
      saveStorageData(nextReadIds, readingProgress);
      return nextReadIds;
    });
  }, [readingProgress]);

  const handleOpenBookReader = useCallback((b: BookItem) => {
    if (!b) return;
    soundManager.playTick();
    const chaptersCount = b.chapters?.length || 0;
    const savedProgress = readingProgress[b.id];
    const initialChapter = savedProgress
      ? Math.min(Math.max(0, savedProgress.chapterIdx), Math.max(0, chaptersCount - 1))
      : 0;
    const initialScroll = savedProgress ? savedProgress.scrollTop : 0;

    setReadingBook(b);
    setActiveChapterIdx(initialChapter);
    pendingScrollTop.current = initialScroll;
    isInitialScrollRestore.current = true;
  }, [readingProgress]);

  const handleChapterChange = useCallback((newChapterIdx: number, resetScroll: boolean = true) => {
    soundManager.playTick();
    setActiveChapterIdx(newChapterIdx);
    if (resetScroll) {
      pendingScrollTop.current = 0;
      isInitialScrollRestore.current = true;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
    if (readingBook) {
      updateBookProgress(readingBook.id, newChapterIdx, resetScroll ? 0 : (scrollContainerRef.current?.scrollTop || 0));
    }
  }, [readingBook, updateBookProgress]);

  useEffect(() => {
    if (!readingBook || !scrollContainerRef.current) return;

    if (isInitialScrollRestore.current) {
      const targetScroll = pendingScrollTop.current;
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = targetScroll;
          isInitialScrollRestore.current = false;
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [readingBook, activeChapterIdx]);

  const handleReaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!readingBook || isInitialScrollRestore.current) return;
    const currentScrollTop = e.currentTarget.scrollTop;

    if (scrollSaveTimeoutRef.current) {
      clearTimeout(scrollSaveTimeoutRef.current);
    }
    scrollSaveTimeoutRef.current = setTimeout(() => {
      updateBookProgress(readingBook.id, activeChapterIdx, currentScrollTop);
    }, 250);
  };

  const categories = useMemo(() => {
    const books = AUTHENTIC_COPTIC_BOOKS || [];
    const set = new Set(books.map((b) => b?.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, []);

  const filteredBooks = useMemo(() => {
    const books = AUTHENTIC_COPTIC_BOOKS || [];
    const query = (searchTerm || '').toLowerCase();
    return books.filter((b) => {
      if (!b) return false;
      const title = (b.title || '').toLowerCase();
      const author = (b.author || '').toLowerCase();
      const description = (b.description || '').toLowerCase();
      const matchesSearch =
        title.includes(query) ||
        author.includes(query) ||
        description.includes(query);
      const matchesCategory =
        selectedCategory === 'all' || b.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const lastActiveBook = useMemo(() => {
    let bestBook: { book: BookItem; progress: BookProgress } | null = null;
    let latestTime = 0;
    const books = AUTHENTIC_COPTIC_BOOKS || [];

    for (const book of books) {
      if (!book) continue;
      const prog = readingProgress[book.id];
      if (prog && prog.lastReadAt) {
        const time = new Date(prog.lastReadAt).getTime();
        if (time > latestTime) {
          latestTime = time;
          bestBook = { book, progress: prog };
        }
      }
    }
    return bestBook;
  }, [readingProgress]);

  const BOOK_ROW_HEIGHT = 320;
  const {
    virtualRows,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
  } = useVirtualGrid({
    items: filteredBooks,
    columns,
    rowHeight: BOOK_ROW_HEIGHT,
    overscan: 2,
    containerRef,
    useWindowScroll: true,
  });

  const handleAnswerQuiz = (qId: string, optIdx: number) => {
    soundManager.playTick();
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = (qId: string, correctIdx: number) => {
    soundManager.playCorrect();
    setQuizSubmitted((prev) => ({ ...prev, [qId]: true }));
    const chosen = quizAnswers[qId];
    if (chosen === correctIdx) {
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in text-right" dir="rtl">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-800/50 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>المستودع الرقمي والوثائقي للكتب المسيحية الموثوقة</span>
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          📚 مكتبة الكتب والمراجع الآبائية والأرثوذكسية الكاملة
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
          مكتبة مسيحية موثقة تضم أمهات الكتب الآبائية واللاهوتية والنسكية والطقسية بالنصوص الكاملة المتاحة تحت رخص الملك العام والبحث العلمي.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-800 overflow-x-auto">
          {[
            { id: 'books', label: '📚 الكتب والمراجع الكاملة', icon: BookOpen },
            { id: 'articles', label: '📜 الدراسات والمقالات المتعمقة', icon: FileText },
            { id: 'quizzes', label: '🧠 الاختبارات التقييمية المتقدمة', icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playTick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-md border border-amber-400'
                    : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: BOOKS & REFERENCES */}
      {activeTab === 'books' && (
        <div className="space-y-6 animate-fade-in">
          {/* Quick Resume Active Reading Banner */}
          {lastActiveBook && lastActiveBook.book && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border border-amber-600/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-700/50 inline-block">
                  📖 واصل قراءة آخر كتاب فتحته
                </span>
                <h3 className="font-spiritual text-sm sm:text-base font-bold text-amber-100">
                  {lastActiveBook.book.title || 'بدون عنوان'} — الفصل {(lastActiveBook.progress?.chapterIdx ?? 0) + 1}: {lastActiveBook.book.chapters?.[lastActiveBook.progress?.chapterIdx ?? 0]?.chapterTitle || ''}
                </h3>
                <p className="text-[11px] text-stone-300">بقلم: {lastActiveBook.book.author || 'غير محدد'}</p>
              </div>

              <button
                onClick={() => handleOpenBookReader(lastActiveBook.book)}
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-2 shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>متابعة القراءة من موضعك</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في عناوين الكتب والمؤلفين والموضوعات..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none"
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

          <div ref={containerRef} className="relative min-h-[120px]">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 text-xs">
                لا توجد كتب أو مراجع تطابق معايير البحث الحالية.
              </div>
            ) : (
              <div style={{ minHeight: totalHeight }}>
                {topSpacerHeight > 0 && <div style={{ height: topSpacerHeight }} aria-hidden="true" />}
                <div className="space-y-4">
                  {virtualRows.map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      className={`grid gap-4 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
                      style={{ minHeight: BOOK_ROW_HEIGHT - 16 }}
                    >
                      {virtualRow.item.map((b) => (
                        <BookCard
                          key={b.id}
                          book={b}
                          isRead={readBooks.includes(b.id)}
                          progress={readingProgress[b.id]}
                          onOpenReader={handleOpenBookReader}
                          onToggleRead={toggleBookRead}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                {bottomSpacerHeight > 0 && <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DEEP ARTICLES & STUDIES */}
      {activeTab === 'articles' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(DEEP_ARTICLES_DATA || []).map((art) => (
              <div
                key={art.id}
                className="p-6 rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-500/60 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-700/40">
                      {art.category || 'دراسة'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">{art.date || ''}</span>
                  </div>
                  <h3 className="font-spiritual text-lg font-bold text-amber-100">{art.title || ''}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">{art.introduction || ''}</p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">كاتب المقال: {art.author || 'غير محدد'}</span>
                  <button
                    onClick={() => {
                      soundManager.playTick();
                      setReadingArticle(art);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>قراءة الدراسة كاملة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADVANCED ANALYTICAL QUIZZES */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-5 rounded-3xl bg-amber-950/40 border border-amber-600/40 text-amber-200 text-xs leading-relaxed">
            🧠 <strong>اختبارات الفهم والتحليل الروحي:</strong> تهدف هذه الاختبارات إلى قياس الفهم العميق والتحليل الآبائي والكتابي، وليست مجرد حفظ سطحي. بعد اختيار الإجابة، ستظهر لك الإجابة الصحيحة مع التفسير والمرجع الدقيق.
          </div>

          <div className="space-y-6">
            {(ANALYTICAL_QUIZZES_DATA || []).map((q) => {
              const isSubmitted = quizSubmitted[q.id];
              const userChoice = quizAnswers[q.id];
              return (
                <div key={q.id} className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-700/40">
                      {q.category || 'عام'}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">مرجع: {q.scriptureReference || ''}</span>
                  </div>

                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                    {q.question || ''}
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {(q.options || []).map((opt, oIdx) => {
                      const isSelected = userChoice === oIdx;
                      const isCorrect = oIdx === q.correctAnswer;
                      let btnStyle = 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500';
                      if (isSubmitted) {
                        if (isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-100 font-bold';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-950 border-amber-500 text-amber-200';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isSubmitted}
                          onClick={() => handleAnswerQuiz(q.id, oIdx)}
                          className={`p-3.5 rounded-2xl border text-xs font-bold transition text-right flex items-center justify-between ${btnStyle} ${
                            !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="w-5 h-5 rounded-full border border-stone-700 flex items-center justify-center text-[10px]">
                            {String.fromCharCode(1575 + oIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!isSubmitted ? (
                    <div className="pt-2">
                      <button
                        disabled={userChoice === undefined}
                        onClick={() => handleSubmitQuiz(q.id, q.correctAnswer)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs transition ${
                          userChoice !== undefined
                            ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-md'
                            : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        تحقق من الإجابة
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
                      <p className="text-amber-300 font-bold">💡 التفسير الروحي والعقيدي:</p>
                      <p className="text-stone-300 leading-relaxed">{q.explanation || ''}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ARTICLE READER MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-3xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-right">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] text-amber-400 font-bold block">{readingArticle.category || 'دراسة'} • {readingArticle.date || ''}</span>
                <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">{readingArticle.title || 'بدون عنوان'}</h3>
              </div>
              <button onClick={() => setReadingArticle(null)} className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-stone-200 text-xs sm:text-sm leading-relaxed bg-stone-950 font-spiritual">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/40 text-amber-200">
                <strong>مقدمة الدراسة:</strong> {readingArticle.introduction || ''}
              </div>

              <div>
                <h4 className="font-bold text-amber-300 mb-2">التحليل والشرح المتعمق:</h4>
                <p className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 text-stone-300 leading-loose">
                  {readingArticle.analysisBody || ''}
                </p>
              </div>

              {(readingArticle.patristicQuotes || []).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-300">أقوال الآباء ذات الصلة:</h4>
                  {readingArticle.patristicQuotes.map((pq, pIdx) => (
                    <blockquote key={pIdx} className="p-4 rounded-2xl bg-stone-900 border-r-4 border-amber-500 text-amber-100 italic">
                      {pq.quote}
                      <span className="block text-[11px] text-amber-400 font-bold mt-1">— {pq.source}</span>
                    </blockquote>
                  ))}
                </div>
              )}

              {(readingArticle.reflectionQuestions || []).length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                  <h4 className="font-bold text-amber-300">أسئلة للتأمل والمناقشة:</h4>
                  <ul className="list-disc list-inside space-y-1 text-stone-300">
                    {readingArticle.reflectionQuestions.map((rq, rIdx) => (
                      <li key={rIdx}>{rq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {readingArticle.practicalExercise && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-200">
                  <strong>تمرين عملي:</strong> {readingArticle.practicalExercise}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL AUTHENTIC BOOK READER MODAL WITH PERSISTED PROGRESS & MULTI-CHAPTER NAVIGATION */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-4xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[94vh] text-right">
            {/* Header Toolbar */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950/80 to-stone-900 border-b border-amber-600/30 flex items-center justify-between shrink-0 gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-amber-400 font-bold">
                      {readingBook.author || 'غير محدد'} • {readingBook.category || 'عام'}
                    </span>
                    {readingBook.licenseStatus && (
                      <span className="text-[9px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-600">
                        {readingBook.licenseStatus}
                      </span>
                    )}
                  </div>
                  <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100 truncate">
                    {readingBook.title || 'بدون عنوان'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Font Size Controls */}
                <div className="hidden sm:flex items-center gap-1 bg-stone-900 px-2 py-1 rounded-xl border border-stone-800">
                  <Type className="w-3 h-3 text-stone-400" />
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'normal' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    عادي
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'large' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    كبير
                  </button>
                  <button
                    onClick={() => setFontSize('huge')}
                    className={`px-1.5 py-0.5 text-[10px] rounded cursor-pointer ${fontSize === 'huge' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400'}`}
                  >
                    أكبر
                  </button>
                </div>

                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer border border-stone-800"
                  title="إغلاق القارئ"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Multi-Chapter Bar & Progress Meter */}
            <div className="bg-stone-900/90 border-b border-stone-800 px-4 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1">
                <span className="text-[11px] font-bold text-amber-400 shrink-0">الفصول:</span>
                {(readingBook.chapters || []).map((chap, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleChapterChange(cIdx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      activeChapterIdx === cIdx
                        ? 'bg-amber-600 text-white shadow-md border border-amber-400'
                        : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 opacity-70" />
                    <span>فصل {cIdx + 1}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                <div className="text-[11px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-700/50">
                  الفصل {activeChapterIdx + 1} من {readingBook.chapters?.length || 1} ({readingBook.chapters?.length ? Math.round(((activeChapterIdx + 1) / readingBook.chapters.length) * 100) : 0}%)
                </div>
              </div>
            </div>

            {/* Scrollable Book Chapter Content */}
            <div
              ref={scrollContainerRef}
              onScroll={handleReaderScroll}
              className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-stone-950 scroll-smooth"
            >
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <h4 className="font-spiritual text-lg sm:text-2xl font-bold text-amber-200">
                    {readingBook.chapters?.[activeChapterIdx]?.chapterTitle || `فصل ${activeChapterIdx + 1}`}
                  </h4>
                </div>

                <div
                  className={`text-stone-200 leading-relaxed font-spiritual bg-stone-900/60 p-6 sm:p-8 rounded-3xl border border-stone-800/80 shadow-inner whitespace-pre-line ${
                    fontSize === 'huge'
                      ? 'text-lg sm:text-xl leading-loose'
                      : fontSize === 'large'
                        ? 'text-base sm:text-lg leading-loose'
                        : 'text-sm sm:text-base leading-relaxed'
                  }`}
                >
                  {readingBook.chapters?.[activeChapterIdx]?.excerpt || 'جارٍ تحميل الفصل...'}
                </div>
              </div>

              {/* Verified Source Metadata Footer */}
              <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-amber-300 font-bold gap-2 flex-wrap">
                  <span>معلومات المرجع والترخيص الفعلي:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {readingBook.completenessStatus && (
                      <span className="text-[10px] text-amber-200 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/60 font-semibold">
                        {readingBook.completenessStatus}
                      </span>
                    )}
                    {readingBook.licenseStatus && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600">
                        {readingBook.licenseStatus}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-stone-400 leading-normal">
                  {readingBook.publisher && <span>الناشر: {readingBook.publisher} • </span>}
                  {readingBook.year && <span>تاريخ الطبعة: {readingBook.year} • </span>}
                  {readingBook.translator && <span>الترجمة: {readingBook.translator}</span>}
                </p>
                {readingBook.sourceUrl && (
                  <a
                    href={readingBook.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline font-mono text-[11px]"
                  >
                    <span>رابط المصدر المعتمد للبحث والتأكيد</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Multi-Chapter Navigation Bottom Controls */}
              <div className="max-w-3xl mx-auto pt-4 border-t border-stone-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {activeChapterIdx > 0 && (
                    <button
                      onClick={() => handleChapterChange(activeChapterIdx - 1)}
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-stone-700"
                    >
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                      <span>الفصل السابق</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => toggleBookRead(readingBook.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    readBooks.includes(readingBook.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {readBooks.includes(readingBook.id)
                      ? 'تم تسجيل قراءة هذا الكتاب'
                      : 'تحديد ككتاب تمت قراءته'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {activeChapterIdx < (readingBook.chapters?.length || 0) - 1 && (
                    <button
                      onClick={() => handleChapterChange(activeChapterIdx + 1)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>الفصل التالي</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;

