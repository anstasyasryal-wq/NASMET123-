import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  X,
  Sparkles,
  BookOpen,
  Shield,
  Heart,
  Search,
  Award,
  Globe,
  Compass,
} from 'lucide-react';

export interface ChurchSaintItem {
  id: string;
  name: string;
  tradition: 'east' | 'west' | 'universal';
  traditionLabel: string;
  century: string;
  title: string;
  biography: string;
  keyTeaching: string;
  famousQuote: string;
  quoteSource: string;
  emoji: string;
}

export const CHURCH_SAINTS_DATA: ChurchSaintItem[] = [
  {
    id: 'athanasius',
    name: 'القديس أثناسيوس الرسولي (حامي الإيمان)',
    tradition: 'east',
    traditionLabel: 'الشرق الأرثوذكسي والجامع',
    century: 'القرن الرابع الميلادي (296 - 373 م)',
    title: 'بابا الإسكندرية وعمود الدين',
    biography: 'دافع بشجاعة نادرة عن ألوهية المسيح ضد بدعة الأريوسية في مجمع نيقية. تحمّل النفي خمس مرات لكنه بقي ثابتاً كالصخرة معلناً: "أثناسيوس ضد العالم".',
    keyTeaching: 'تجسد الكلمة الإلهي هو أساس خلاصنا وتألهنا؛ فلو لم يكن الله هو نفسه من تجسد لما أمكنه أن يجدد طبيعتنا الساقطة.',
    famousQuote: '«صار الله انسان لكي يصير الإنسان إلهاً بالنعمة».',
    quoteSource: 'تجسد الكلمة',
    emoji: '👑',
  },
  {
    id: 'augustine',
    name: 'القديس أغسطينوس الهيبوني (معلم النعمة)',
    tradition: 'west',
    traditionLabel: 'الغرب اللاتيني والجامع',
    century: 'القرن الخامس الميلادي (354 - 430 م)',
    title: 'أسقف هيبو وفيلسوف المحبة الإلهية',
    biography: 'عاش حياة بحث عميق واضطراب قبل أن يختبر نعمة التوبة العميقة إثر صلاة والدته القديسة مونيكا. صار أحد أعظم عقول الكنيسة الجامعة في لاهوت النعمة والزمن والمحبة.',
    keyTeaching: 'قلوبنا غير ساكنة حتى تستريح فيك يا الله. المحبة الحقيقية هي أن تريد الخير للآخر بحسب إرادة الله.',
    famousQuote: '«لقد أحببتك متأخراً، أيها الجمال القديم الجديد، لقد أحببتك متأخراً! وها أنت كنت في داخلي وأنا في الخارج».',
    quoteSource: 'الاعترافات',
    emoji: '🔥',
  },
  {
    id: 'chrysostom',
    name: 'القديس يوحنا ذهبي الفم',
    tradition: 'east',
    traditionLabel: 'الشرق البيزنطي والأنطاكي',
    century: 'القرن الرابع الميلادي (349 - 407 م)',
    title: 'بطريرك القسطنطينية وعذب الأقوال',
    biography: 'عُرف ببلاغته الاستثنائية التي تقطر عسلاً، وبدفاعه المستميت عن حقوق الفقراء والمحتاجين، ووضع القداس الإلهي الشهير المعمول به في الشرق.',
    keyTeaching: 'المذبح الحقيقي للمسيح ليس فقط المصنوع من الحجارة في الهيكل، بل هو وجه الفقير والمحتاج الجالس أمامنا.',
    famousQuote: '«صلوات المخدع هي الحصن الذي لا يقهر، واللجج التي لا تفرغ، وميناء السلام الذي لا يعرف العواصف».',
    quoteSource: 'شرح رسائل بولس الرسول',
    emoji: '📜',
  },
  {
    id: 'francis',
    name: 'القديس فرنسيس الأسيزي',
    tradition: 'west',
    traditionLabel: 'الغرب والرهبنة الفرنسيسكانية',
    century: 'القرن الثالث عشر (1181 - 1226 م)',
    title: 'أب الفقراء وعاشق الطبيعة الإلهية',
    biography: 'ترك ثروة عائلته ليعيش فقراً اختيارياً كاملاً متقምًا سيرة المسيح في التجرد الكامل والسلام، مسبحاً الله مع المخلوقات والشمس والأخوة.',
    keyTeaching: 'التجرد من مقتنيات العالم يحرر القلب ليمتلئ بمحبة الفادي ويسمع أنغام ملكوت السموات في كل شجرة وعصفور.',
    famousQuote: '«يا رب، استعملني لأجل سلامك: حيث يكون البغض فازرع المحبة، وحيث تكون الإساءة فازرع الصفح».',
    quoteSource: 'صلاة السلام',
    emoji: '🕊️',
  },
  {
    id: 'antony',
    name: 'القديس أنطونيوس الكبير (أب الرهبان)',
    tradition: 'east',
    traditionLabel: 'الشرق القبطي والبرية',
    century: 'القرن الثالث والرابع (251 - 356 م)',
    title: 'كوكب البرية ومعلم النساك',
    biography: 'بائع أملاكه بعد سماع وصية الإنجيل، انطلق للصحراء المصرية ليؤسس بصلاته وجهاده مدرسة الرهبنة التي أثرت في الشرق والغرب على السواء.',
    keyTeaching: 'من يعرف الله يحتقر كل مجد العالم وزواله، لأن الس30 دقيقة في المخدع تزن أعماراً من المجد الباطل.',
    famousQuote: '«رأيت فخاخ الشرير مبثوثة على الأرض، فقلت متنهداً: من ينجو منها؟ فسمعت صوتاً يقول: المتواضعون».',
    quoteSource: 'بستان الرهبان',
    emoji: '🏔️',
  },
  {
    id: 'aquinas',
    name: 'القديس توما الأكويني (المعلم الملائكي)',
    tradition: 'west',
    traditionLabel: 'الغرب اللاتيني واللاهوت المدرسي',
    century: 'القرن الثالث عشر (1225 - 1274 م)',
    title: 'فيلسوف اللاهوت الكاثوليكي',
    biography: 'دمج بحكمة فائقة بين فلسفة أرسطو والوحي الإلهي، وكتب "الخلاصة اللاهوتية" وألف ترانيم القربان المقدس العميقة.',
    keyTeaching: 'العقل والإيمان لا يتناقضان أبداً؛ بل العقل يمهد طريق الإيمان، والإيمان يرفع العقل ليعاين أسرار الله غير المنظورة.',
    famousQuote: '«أمام سر الإفخارستيا العظيم، ليحني العقل البشري هامته، وليؤمن القلب بما يعجز اللسان عن وصفه».',
    quoteSource: 'الخلاصة اللاهوتية',
    emoji: '📚',
  },
  {
    id: 'gregory',
    name: 'القديس غريغوريوس الكبير (بابا روما)',
    tradition: 'west',
    traditionLabel: 'الغرب والشرق (قديس جامع)',
    century: 'القرن السادس (540 - 604 م)',
    title: 'خادم خدام الله',
    biography: 'عُرف باتضاعه الشديد ورعايته للفقراء وإصلاحاته الكنسية العميقة، وله الفضل في تدوين الألحان الجريجورية ونشر الإيمان في إنجلترا.',
    keyTeaching: 'أعظم رتبة في الكنيسة هي خدمة المحبة والتواضع على مثال المعلم الإلهي الذي غسل أقدام تلاميذه.',
    famousQuote: '«من يريد أن يكون عظيماً حقاً في ملكوت السماوات، فليكن خادماً حقيقياً لكل من حوله بلا تمييز».',
    quoteSource: 'الرسائل الرعوية',
    emoji: '🌿',
  },
  {
    id: 'cricius-isaac',
    name: 'مار إسحق السرياني (أسقف نينوى)',
    tradition: 'east',
    traditionLabel: 'الشرق السرياني والنسكي',
    century: 'القرن السابع الميلادي (توفي نحو 700 م)',
    title: 'حكيم الصمت والدموع الإلهية',
    biography: 'ناسك وعالم جليل ترهب في جبال نينوى وترك خلفه كتابات روحية عميقة تذيب القلوب وتفيض بالرجاء الفائق في رحمة الله غير المحدودة.',
    keyTeaching: 'ما هي القلب المنسحق؟ إنه قلب يشتعل بمحبة الخليقة كلها، حتى عن الحيوانات والشياطين من شدة فيضان محبة الله فيه.',
    famousQuote: '«لا تقل إن الله عادل، فلو عاملنا بعدله لهلكنا أجمعين؛ بل قل إنه رحوم ومحب للبشر، وهذا ما أعلنه الصليب».',
    quoteSource: 'المقالات الروحية',
    emoji: '💧',
  },
  {
    id: 'teresa',
    name: 'القديسة تيريز الأبيلية (معلمة الكنيسة)',
    tradition: 'west',
    traditionLabel: 'الغرب والرهبنة الكرملية',
    century: 'القرن السادس عشر (1515 - 1582 م)',
    title: 'مصلحة رهبنة الكرمل وعاشقة الصلاة الداخلية',
    biography: 'اختبرت مستويات عميقة من الصلاة الداخلية وكتبت روائع التصوف المسيحي مثل "القلعة الداخلية" و"طريق الكمال".',
    keyTeaching: 'النفس البشرية تشبه قلعة من ماس صافٍ تضم مساكن عديدة، وأعلاها هو الموضع الذي يسكن فيه الملك الإلهي.',
    famousQuote: '«لا يزعجك شيء، لا يخيفك شيء، كل شيء يزول، الله لا يتغير أبداً، والصبر ينال كل شيء».',
    quoteSource: 'القلعة الداخلية',
    emoji: '🏰',
  },
];

interface ChurchFathersAndSaintsGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
}

const SaintListItem = React.memo<{
  saint: ChurchSaintItem;
  isSelected: boolean;
  onSelect: (s: ChurchSaintItem) => void;
}>(({ saint, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(saint)}
      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
        isSelected
          ? 'bg-amber-950/60 border-amber-500/80 shadow-md'
          : 'bg-stone-900 border-stone-800 hover:border-amber-600/40'
      }`}
    >
      <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-amber-500/20 shrink-0">
        {saint.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
          {saint.title}
        </span>
        <h4 className="font-spiritual text-xs font-bold text-stone-100 truncate">
          {saint.name}
        </h4>
        <span className="text-[10px] text-stone-400 truncate block">
          {saint.century}
        </span>
      </div>
    </div>
  );
});

SaintListItem.displayName = 'SaintListItem';

export const ChurchFathersAndSaintsGallery: React.FC<ChurchFathersAndSaintsGalleryProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedSaint, setSelectedSaint] = useState<ChurchSaintItem>(CHURCH_SAINTS_DATA[0]);
  const [traditionFilter, setTraditionFilter] = useState<'all' | 'east' | 'west'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSelectSaint = React.useCallback((saint: ChurchSaintItem) => {
    soundManager.playTick();
    setSelectedSaint(saint);
  }, []);

  const filteredSaints = React.useMemo(() => {
    return CHURCH_SAINTS_DATA.filter((item) => {
      const matchTradition =
        traditionFilter === 'all' || item.tradition === traditionFilter;
      const matchSearch =
        item.name.includes(searchTerm) ||
        item.biography.includes(searchTerm) ||
        item.keyTeaching.includes(searchTerm) ||
        item.title.includes(searchTerm);
      return matchTradition && matchSearch;
    });
  }, [traditionFilter, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-stone-950 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-900 via-amber-950/70 to-stone-900 border-b border-amber-600/30 flex items-center justify-between text-right shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-spiritual text-xl font-bold text-amber-100">
                📜 سير الآباء والقديسين (الشرق والغرب)
              </h2>
              <p className="text-xs text-stone-300">
                مرجع جامع لسير وتعاليم وعِبر عمالقة الإيمان في الكنيسة الجامعة عبر العصور.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="lg:col-span-5 p-4 border-l border-stone-800 bg-stone-900/50 overflow-y-auto space-y-3 text-right">
            {/* Filter & Search */}
            <div className="space-y-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'east', label: '✝️ آباء الشرق' },
                  { id: 'west', label: '🕊️ قديسو الغرب' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundManager.playTick();
                      setTraditionFilter(f.id as 'all' | 'east' | 'west');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                      traditionFilter === f.id
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث باسم الأب أو القديس..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredSaints.map((saint) => (
                <SaintListItem
                  key={saint.id}
                  saint={saint}
                  isSelected={selectedSaint.id === saint.id}
                  onSelect={handleSelectSaint}
                />
              ))}
            </div>
          </div>

          {/* Details Pane */}
          <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6 text-right bg-stone-950">
            <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-[#1c1712] to-amber-950/70 border border-amber-600/40 p-6 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 border-b border-amber-600/30 pb-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-950 border-2 border-amber-400/60 flex items-center justify-center text-4xl shadow-inner">
                  {selectedSaint.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-[10px] font-bold">
                      {selectedSaint.traditionLabel}
                    </span>
                    <span className="text-[10px] text-stone-400">{selectedSaint.century}</span>
                  </div>
                  <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                    {selectedSaint.name}
                  </h3>
                  <p className="text-xs text-amber-400/90 font-semibold mt-0.5">
                    {selectedSaint.title}
                  </p>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>السيرة الذاتية والتاريخية</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
                  {selectedSaint.biography}
                </p>
              </div>

              {/* Key Teaching */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>الجوهر اللاهوتي والروحي</span>
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
                  {selectedSaint.keyTeaching}
                </p>
              </div>

              {/* Famous Quote */}
              <div className="space-y-2">
                <h4 className="font-spiritual text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>أشهر أقواله المؤثرة</span>
                </h4>
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                  <p className="text-xs sm:text-sm text-amber-200 font-spiritual italic leading-relaxed">
                    {selectedSaint.famousQuote}
                  </p>
                  <span className="text-[11px] text-amber-400 block font-semibold text-left">
                    — {selectedSaint.quoteSource}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
