export interface SaintSticker {
  id: string;
  dayIndex?: number;
  name: string;
  epithet: string;
  tradition: 'east' | 'west' | 'celtic' | 'syrian_armenian' | 'ethiopian' | 'universal';
  traditionLabel: string;
  virtue: string;
  virtueCategory: 'humility' | 'prayer' | 'love' | 'detachment' | 'patience' | 'peace' | 'discernment' | 'faith' | 'purity' | 'joy';
  dailyMessage: string;
  quote: string;
  quoteRef: string;
  practicalExercise: string;
  stickerColor: string;
  accentBg: string;
  badgeIcon: string;
  century: string;
  feastDay: string;
}

export const SAINTS_STICKERS_DATA: SaintSticker[] = [
  {
    id: 'antony_great',
    name: 'القديس أنطونيوس الكبير',
    epithet: 'أب جميع الرهبان وكوكب البرية',
    tradition: 'east',
    traditionLabel: 'الشرق القبطي وبرية مصر',
    virtue: 'الاتضاع الحقيقي وانسحاق القلب',
    virtueCategory: 'humility',
    dailyMessage: '«يا ابني المبارك، اجعل الاتضاع رداءك الدائم الذي لا تخلعه في ليل أو نهار. اعلم يقيناً أن كل حيل الشرير وفخاخه المبثوثة في العالم تعجز عن اصطياد النفس التي تعتبر نفسها تراباً وتلجأ لحضن المخلص الصالح».',
    quote: '«رأيت فخاخ العدو مبثوثة على الأرض كلها، فقلت متنهداً: يا رب، من ينجو منها؟ فسمعت صوتاً يقول لي: المتواضعون ينجون منها!».',
    quoteRef: 'بستان الرهبان — الفردوس',
    practicalExercise: 'إذا شعرت اليوم بأي رغبة في لفت الأنظار أو التبرير، الزم الصمت فوراً وقل سراً: «يارب اغفر لي ضعفي، أنا تراب ورماد».',
    stickerColor: 'from-amber-600 via-amber-700 to-amber-900 border-amber-400',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '🏔️',
    century: 'القرن الرابع الميلادي (251 - 356 م)',
    feastDay: '٢٢ طوبة (٣٠ يناير)',
  },
  {
    id: 'augustine_hippo',
    name: 'القديس أغسطينوس الهيبوني',
    epithet: 'معلم النعمة وفيلسوف المحبة الإلهية',
    tradition: 'west',
    traditionLabel: 'الغرب اللاتيني وشمال إفريقيا',
    virtue: 'الاشتياق النقي والشبع بالمسيح',
    virtueCategory: 'love',
    dailyMessage: '«قلبك خُلق لله وحده، ولن يهدأ ولن يستريح أبداً في أي غرض أرضي مهما تجمّل. لا ترضَ بأن تقتات على فتات العالم الزائل، في حين أن مائدة الفادي وعشقه الأبدي مفتوحان لك كل صباح ومساء».',
    quote: '«لقد أحببتك متأخراً أيها الجمال القديم الجديد! وها أنت كنت في داخلي وأنا أطلبك في الخارج بين مخلوقاتك! لقد خلقتنا لأجلك، وقلوبنا لن تستريح إلا فيك!».',
    quoteRef: 'كتاب الاعترافات (Confessiones)',
    practicalExercise: 'توقف في منتصف النهار لمدة خمس دقائق عن كافة المهام، وضع يدك على قلبك وقل: «أنت وحدك كفايتي يا ربي يسوع، فيك يستريح قلبي».',
    stickerColor: 'from-orange-600 via-rose-700 to-stone-900 border-orange-400',
    accentBg: 'bg-orange-950/40 text-orange-200 border-orange-600/40',
    badgeIcon: '🔥',
    century: 'القرن الخامس الميلادي (354 - 430 م)',
    feastDay: '٢٨ أغسطس',
  },
  {
    id: 'francis_assisi',
    name: 'القديس فرنسيس الأسيزي',
    epithet: 'أب الفقراء وسفير السلام الإنجيلي',
    tradition: 'west',
    traditionLabel: 'الغرب الإيطالي والتجرد الكامل',
    virtue: 'صنع السلام والتجرد من القنية',
    virtueCategory: 'peace',
    dailyMessage: '«كن اليوم سفيراً للمحبة الإلهية الباذلة؛ لا تنتظر أن يقدم لك الناس الاحترام أو الشكر، بل بادر أنت بغسل أرجل المتعبين وزرع بذار الصفح في كل مجلس تدخله، لتكون بحق ابناً لله صانعاً للسلام».',
    quote: '«يا رب، استعملني لأجل سلامك: حيث يكون البغض فدعني أزرع المحبة، وحيث تكون الإساءة فدعني أزرع الصفح، وحيث يكون الشك فدعني أزرع الإيمان!».',
    quoteRef: 'صلاة السلام الشهيرة',
    practicalExercise: 'تخلَّ اليوم عن غرض فائض لديك وقدمه لمحتاج أو خادم بمحبة وسرور دون أن تخبر أحداً.',
    stickerColor: 'from-emerald-600 via-teal-700 to-stone-900 border-emerald-400',
    accentBg: 'bg-emerald-950/40 text-emerald-200 border-emerald-600/40',
    badgeIcon: '🕊️',
    century: 'القرن الثالث عشر (1181 - 1226 م)',
    feastDay: '٤ أكتوبر',
  },
  {
    id: 'john_chrysostom',
    name: 'القديس يوحنا ذهبي الفم',
    epithet: 'لسان العطر وبطريرك القسطنطينية',
    tradition: 'east',
    traditionLabel: 'الشرق البيزنطي والأنطاكي',
    virtue: 'الرحمة بالفقراء وحراسة اللسان',
    virtueCategory: 'love',
    dailyMessage: '«يا خادم المسيح، لا تحسب أن عبادتك مقبولة إذا كان لسانك يجرح إخوتك أو إذا غضضت طرفك عن أنين الجائعين. اجعل من فمك مبخرة تنطق بالبركة، واعتبر خدمة المتألمين مذبحاً سرياً تقدم عليه ذبيحة حبك».',
    quote: '«هل تريد أن تكرم جسد المسيح حقاً؟ لا تهمله حين تراه عرياناً في شوارع مدينتك، ولا تكرمه هنا في الهيكل بأقمشة الحرير بينما تتركه خارجاً يموت برداً!».',
    quoteRef: 'عظات على إنجيل متى (Homiliae in Matthaeum)',
    practicalExercise: 'احفظ لسانك اليوم من توجيه أي لوم أو انتقاد لأي شخص، وقدم صدقة خفية بنية التوبة.',
    stickerColor: 'from-yellow-600 via-amber-700 to-stone-900 border-yellow-400',
    accentBg: 'bg-yellow-950/40 text-yellow-200 border-yellow-600/40',
    badgeIcon: '📜',
    century: 'القرن الرابع الميلادي (349 - 407 م)',
    feastDay: '١٢ بشنس / ١٣ نوفمبر',
  },
  {
    id: 'teresa_avila',
    name: 'القديسة تريزا الأفيلية',
    epithet: 'معلمة الكنيسة وأم التصوف الروحي',
    tradition: 'west',
    traditionLabel: 'الغرب الإسباني والكرملي',
    virtue: 'الثبات في صلاة المخدع والسكينة',
    virtueCategory: 'prayer',
    dailyMessage: '«لا تدع تقلبات الحياة وأمواج الخدمة تهز استقرارك الداخلي. ثق أن الله لا يترك من يثبت في مخدعه؛ فالصلاة ليست كثرة كلام بل صداقة حميمة دائمة مع من نعلم يقيناً أنه يحبنا بلا حدود».',
    quote: '«لا يزعجنك شيء، لا يرهبنك شيء؛ فكل شيء زائل، والله وحده لا يتغير! الصبر ينال كل شيء، ومن يملك الله لا يعوزه شيء، الله وحده يكفي!».',
    quoteRef: 'قصيدة السكينة الإلهية (Nada te turbe)',
    practicalExercise: 'خصص ٢٠ دقيقة الليلة في خلوة صامتة مع إغلاق الهاتف، وكرر في داخلك: «الله وحده يكفي».',
    stickerColor: 'from-rose-600 via-pink-700 to-stone-900 border-rose-400',
    accentBg: 'bg-rose-950/40 text-rose-200 border-rose-600/40',
    badgeIcon: '🏰',
    century: 'القرن السادس عشر (1515 - 1582 م)',
    feastDay: '١٥ أكتوبر',
  },
  {
    id: 'patrick_ireland',
    name: 'القديس باتريك رسول إيرلندا',
    epithet: 'صاحب درع الثالوث القدوس',
    tradition: 'celtic',
    traditionLabel: 'التراث السلتي والإيرلندي',
    virtue: 'الدرع الروحي والحصانة بالثالوث',
    virtueCategory: 'faith',
    dailyMessage: '«حين تخرج إلى ساحة الخدمة، تسربل باسم الثالوث الأقدس كدرع حصين يحيط بك من كل جانب. لا تخف من مؤامرات الأشرار أو هجمات الشياطين، فالمسيح يحيطك من أمام ومن خلف، وفي قلب كل من يلتقي بك».',
    quote: '«المسيح معي، المسيح أمامي، المسيح خلفي، المسيح في داخلي، المسيح عن يميني، المسيح عن يساري، المسيح في فم كل من يتحدث معي، المسيح في عين كل من يراني!».',
    quoteRef: 'درع القديس باتريك (Lorica Patricii)',
    practicalExercise: 'ردد صلاة درع باتريك في بداية يومك ثلاث مرات وأنت ترشم ذاتك بعلامة الصليب المقدس.',
    stickerColor: 'from-emerald-700 via-green-800 to-stone-900 border-emerald-400',
    accentBg: 'bg-emerald-950/40 text-emerald-200 border-emerald-600/40',
    badgeIcon: '☘️',
    century: 'القرن الخامس الميلادي (385 - 461 م)',
    feastDay: '١٧ مارس',
  },
  {
    id: 'isaac_syrian',
    name: 'مار إسحق السرياني',
    epithet: 'مغرد البرية ومعلم الهيزيكيا والسكينة',
    tradition: 'syrian_armenian',
    traditionLabel: 'الشرق السرياني والنينوي',
    virtue: 'الصمت المقدس والرحمة الشاملة',
    virtueCategory: 'discernment',
    dailyMessage: '«أيها المكرس الحبيب، أحبب الصمت أكثر من الكلام، لأن الصمت يجمع قوى عقلك المشتتة ليلتقي بالله في سكون الروح. وليكن قلبك ممتلئاً حناناً يفيض بالدموع والشفقة حتى على أعدائك ومضايقيك».',
    quote: '«ما هو القلب الرحيم؟ هو احتراق القلب بنار المحبة لأجل الخليقة كلها: لأجل الناس، والطيور، والحيوانات، وحتى لأجل الشياطين وكل كائن موجود!».',
    quoteRef: 'المقالات النسكية (De Perfectione Religiosa)',
    practicalExercise: 'امتنع اليوم عن المشاركة في أي نقاش أو جدال لا فائدة منه، واستبدله بتلاوة صلاة يسوع في قلبك.',
    stickerColor: 'from-cyan-700 via-sky-800 to-stone-900 border-cyan-400',
    accentBg: 'bg-cyan-950/40 text-cyan-200 border-cyan-600/40',
    badgeIcon: '💧',
    century: 'القرن السابع الميلادي (613 - 700 م)',
    feastDay: '٢٨ يناير / ٢٨ سبتمبر',
  },
  {
    id: 'benedict_nursia',
    name: 'القديس بندكتوس النيرسي',
    epithet: 'أب الرهبنة الغربية وواضع القانون النسكى',
    tradition: 'west',
    traditionLabel: 'الغرب اللاتيني الإيطالي',
    virtue: 'العمل والصلوات وتنظيم الوقت',
    virtueCategory: 'patience',
    dailyMessage: '«اجعل حياتك متوازنة بين العمل اليدوي أو الخدمي وبين الصلاة والترنيم؛ فالنفس الكسلانة هي حقل مباح لكل فكر رديء، أما اليد العاملة والقلب المصلي فيصنعان بستاناً مثمراً للرب».',
    quote: '«صلي واعمل! لئلا يجد إبليس وقتًا ليدخل إلى قلبك أفكار الكسل والتراخي».',
    quoteRef: 'قانون القديس بندكتوس (Regula Benedicti)',
    practicalExercise: 'نظم جدول يومك بدقة بحيث لا تغلب الخدمة على وقت مخدعك، ولا يغلب الكسل على اجتهادك.',
    stickerColor: 'from-slate-700 via-zinc-800 to-stone-950 border-slate-400',
    accentBg: 'bg-slate-950/40 text-slate-200 border-slate-600/40',
    badgeIcon: '⚖️',
    century: 'القرن السادس الميلادي (480 - 547 م)',
    feastDay: '١١ يوليو',
  },
  {
    id: 'athanasius_apostolic',
    name: 'البابا أثناسيوس الرسولي',
    epithet: 'حامي الإيمان وعمود الدين وبطل الكنيسة الجامعة',
    tradition: 'east',
    traditionLabel: 'الشرق الإسكندري القبطي',
    virtue: 'الثبات على الحق الإنجيلي وعدم المهادنة',
    virtueCategory: 'faith',
    dailyMessage: '«العالم ضدي؟ فأنا ضد العالم! قف يا ابني بثبات صلب أمام تيارات العصر المخالفة للإنجيل. لا تبحث عن رضا الجماهير على حساب الحق الإلهي؛ فالله يزكي الثابتين حتى لو بقي مؤمن واحد على الأرض».',
    quote: '«إن حاول الجميع تدمير الإيمان الأرثوذكسي، فابقَ أنت وحدك مع الكلمة الحية غير منحرف يميناً أو يساراً».',
    quoteRef: 'رسائل القديس أثناسيوس الدفاعية',
    practicalExercise: 'دافع اليوم عن الحق بمحبة وحكمة، ولا تجامل أحداً على حساب وصايا الإنجيل والتقاليد المقدسة.',
    stickerColor: 'from-amber-700 via-yellow-800 to-stone-950 border-amber-400',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '🏛️',
    century: 'القرن الرابع الميلادي (298 - 373 م)',
    feastDay: '٧ بشنس (١٥ مايو)',
  },
  {
    id: 'silouan_athonite',
    name: 'القديس سلوان الآثوسي',
    epithet: 'حبيب الجحيم من أجل البشرية والمتواضع بدموع',
    tradition: 'east',
    traditionLabel: 'الشرق الروسي والآثوسي',
    virtue: 'حفظ الفكر في الجحيم والاتضاع العميق',
    virtueCategory: 'humility',
    dailyMessage: '«أراد الرب أن يعلمني درساً لا يُنسى فقال لي: احفظ عقلك في الجحيم ولا تيأس! أيها المكرس، متى رأيت ضعفاتك وضعفات إخوتك، فلا تحكم على أحد بل اسجد ببكاء طالبًا رحمة الله للجميع».',
    quote: '«الروح القدس يعلم النفس محبة الأعداء والصلاة من أجل العالم كله كأنهم جزء من كيانها».',
    quoteRef: 'كتاب الأب سوفروني عن القديس سلوان',
    practicalExercise: 'صلِّ اليوم بحرارة من أجل شخص تحس أن التعامل معه شاق، واطلب له ولنفسك مغفرة الخطايا.',
    stickerColor: 'from-stone-800 via-zinc-900 to-black border-stone-500',
    accentBg: 'bg-stone-900 text-stone-200 border-stone-700',
    badgeIcon: '💧',
    century: 'القرن العشرين (1866 - 1938 م)',
    feastDay: '٢٤ سبتمبر',
  },
  {
    id: 'therese_lisieux',
    name: 'القديسة تريزا الطفل يسوع',
    epithet: 'زهرة الكرمل الصغيرة وطريقة الطفولة الروحية',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي والكرملي',
    virtue: 'طريق الطفولة الروحية والأعمال الصغيرة',
    virtueCategory: 'purity',
    dailyMessage: '«لا تقلق لأن أعمالك تبدو صغيرة وبسيطة؛ فالله لا ينظر إلى عظمة الفعل بل إلى مقدار الحب الذي نبذله فيه. ابتسم في وجه من يسيء إليك، وقدم كل كأس مياه بفرح، فهذه هي طريق السماء المبسطة».',
    quote: '«إذا كانت رغبتي أن أكون قديسة كبرى، إلا أنني أعلم أنني ضعيفة وعاجزة؛ لذلك جعلت من يسوع مصعدي الخاص الذي يرفعني إلى حضن الآب».',
    quoteRef: 'قصة نفس (Histoire d\'une âme)',
    practicalExercise: 'قم اليوم بعمل صغير جداً ومهمش (مثل ترتيب مكتب غيرك أو غسل الأطباق) بمحبة خفية وفرح.',
    stickerColor: 'from-pink-600 via-rose-700 to-stone-950 border-pink-400',
    accentBg: 'bg-pink-950/40 text-pink-200 border-pink-600/40',
    badgeIcon: '🌹',
    century: 'القرن التاسع عشر (1873 - 1897 م)',
    feastDay: '١ أكتوبر',
  },
  {
    id: 'moses_black',
    name: 'القديس موسى الأسود',
    epithet: 'قاطع الطرق الذي صار كوكباً في التوبة',
    tradition: 'east',
    traditionLabel: 'البرية القبطية وسقراط الإسكندري',
    virtue: 'التوبة الصادقة والتحول الجذري',
    virtueCategory: 'faith',
    dailyMessage: '«مهما كانت خطاياك السابقة أو ثقل ماضيكم، فلا تستمع لليأس الذي يلقيه إبليس في روعك. بدموع التوبة الصادقة يستطيع الخطاة أن يصيروا أبراجاً مشعة في ملكوت السموات».',
    quote: '«الدموع تغسل الخطايا كالمطر الذي يغسل الغبار عن أوراق الأشجار؛ فلا تيأس مهما اشتدت الحرب».',
    quoteRef: 'بستان الرهبان — سيرة الأب موسى',
    practicalExercise: 'جدد توبتك اليوم أمام الصليب، واطلب من الرب أن يمحو كل آثار الماضي بفيض نعمته.',
    stickerColor: 'from-zinc-900 via-stone-900 to-amber-950 border-amber-600',
    accentBg: 'bg-stone-900 text-amber-200 border-stone-700',
    badgeIcon: '🌿',
    century: 'القرن الرابع الميلادي (330 - 405 م)',
    feastDay: '٢٤ بؤونة (١ يوليو)',
  },
  {
    id: 'catherine_alexandria',
    name: 'القديسة كاترين الشهيدة',
    epithet: 'عروس المسيح الحكيمة وفيلسوفة الإسكندرية',
    tradition: 'east',
    traditionLabel: 'الإسكندرية القبطية واليونانية',
    virtue: 'الحكمة الإلهية والثبات العقيدي',
    virtueCategory: 'discernment',
    dailyMessage: '«استخدم العقل والعلوم التي وهبك الله إياها لمجد اسمه القدوس لا للكبرياء البشري. كن مستعداً للإجابة لكل من يسألك عن سبب الرجاء الذي فيك بوداعة وخوف إلهي».',
    quote: '«إن عقلي وروحي هما وديعة مقدسة للمسيح فاديّ، ولن أنحني لأي باطل أرضي مهما هددني بالسيف أو الموت».',
    quoteRef: 'سنكسار الكنيسة القبطية الأرثوذكسية',
    practicalExercise: 'اقرأ اليوم صفحة من كتاب روحي أو عقيدي لتنير ذهنك وتثبت قدميك في الحق.',
    stickerColor: 'from-violet-700 via-purple-900 to-stone-950 border-violet-400',
    accentBg: 'bg-violet-950/40 text-violet-200 border-violet-600/40',
    badgeIcon: '👑',
    century: 'القرن الرابع الميلادي (287 - 305 م)',
    feastDay: '٢٤ هاتور (٣ ديسمبر)',
  },
  {
    id: 'vincent_depaul',
    name: 'القديس فنسنت دي بول',
    epithet: 'أب المعوزين وشفيع المؤسسات الخيرية',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي والخدمة الاجتماعية',
    virtue: 'الخدمة العملية المنظّمة للمحتاجين',
    virtueCategory: 'love',
    dailyMessage: '«المحبة ليست مجرد عواطف تذرفها عيناك في المخدع، بل هي أيادٍ عاملة وخدمة ملموسة تُقدم لمن يحتاج. افتقد اليوم مريضا، أطعم جائعاً، أو اخدم متعباً بعيداً عن الأضواء».',
    quote: '«ستجدون أن المحبة ثقيلة جداً ومحملة بالدموع، ولكنه التكليف الوحيد الذي لا يستطيع قلب الخادم أن يرفضه».',
    quoteRef: 'توجيهات القديس منصور دي بول للخدام',
    practicalExercise: 'نظم اليوم خدمة أو خطة افتقاد لأحد المتعبين الذين لم يسأل عنهم أحد منذ فترة.',
    stickerColor: 'from-blue-800 via-indigo-900 to-stone-950 border-blue-400',
    accentBg: 'bg-blue-950/40 text-blue-200 border-blue-600/40',
    badgeIcon: '🤲',
    century: 'القرن السابع عشر (1581 - 1660 م)',
    feastDay: '٢٧ سبتمبر',
  },
  {
    id: 'john_vianney',
    name: 'القديس يوحنا ماري فياني (خادم آرس)',
    epithet: 'شفيع الكهنة والرعاة وساهر كرسي الاعتراف',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي والكهنوت المتجرد',
    virtue: 'الأمانة في سر التوبة والرعاية المتفانية',
    virtueCategory: 'prayer',
    dailyMessage: '«يا راعي النفوس، إن الكهنوت هو محبة قلب يسوع المسكوبة للبشر. اقضِ ساعات مخدعك باكياً من أجل توبة مخدوميك؛ فالصلاة والدموع تفعل في القلوب ما تعجز عنه آلاف الخطب الرنانة».',
    quote: '«إن الكهنوت هو محبة قلب يسوع! إذا سلبتم الناس سر الكهنوت، فبعد عشرين عاماً سيعبد الناس الحيوانات!».',
    quoteRef: 'مواعظ خادم آرس (Curé d\'Ars)',
    practicalExercise: 'صلِّ اليوم من أجل الكهنة والآباء الروحيين وخدام كنيستك أن يثبتهم الله في الأمانة والقداسة.',
    stickerColor: 'from-purple-800 via-stone-900 to-stone-950 border-purple-400',
    accentBg: 'bg-purple-950/40 text-purple-200 border-purple-600/40',
    badgeIcon: '⛪',
    century: 'القرن التاسع عشر (1786 - 1859 م)',
    feastDay: '٤ أغسطس',
  },
  {
    id: 'paisios_athonite',
    name: 'القديس باييسيوس الآثوسي',
    epithet: 'عزاء المتعبين وطبيب القلوب المعاصر',
    tradition: 'east',
    traditionLabel: 'الشرق اليوناني وجبل آثوس المعاصر',
    virtue: 'الفكر الصالح والتفسير بالمحبة (فكر النحلة)',
    virtueCategory: 'discernment',
    dailyMessage: '«كن كالنحلة التي تبحث عن الزهور وتتجاهل القاذورات؛ لا تكن كالذبابة التي تبحث عن العيوب والسقطات في الآخرين لتتغذى عليها. التمس ألف عذر لأخيك واحتفظ دائماً بفكر نقي وصالح».',
    quote: '«الفكر الصالح هو أساس كل بناء روحي؛ حين تزرع في عقلك أفكار المحبة والتماس الأعذار، يسكن في قلبك سلام المسيح الفائق».',
    quoteRef: 'رسائل القديس باييسيوس الآثوسي',
    practicalExercise: 'إذا راودك فكر سوء ظن تجاه تصرف أي إنسان اليوم، حوّله فوراً إلى فكر صالح والتمس له عذراً.',
    stickerColor: 'from-amber-600 via-stone-800 to-stone-950 border-amber-300',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '🐝',
    century: 'القرن العشرين (1924 - 1994 م)',
    feastDay: '١٢ يوليو',
  },
  {
    id: 'charbel_makhlouf',
    name: 'القديس شربل مخلوف',
    epithet: 'ناسك عنايا وقديس الصمت والمعجزات',
    tradition: 'syrian_armenian',
    traditionLabel: 'الشرق الماروني وجبال لبنان',
    virtue: 'الصمت التام والمناجاة في السكونية',
    virtueCategory: 'prayer',
    dailyMessage: '«احفظ صمتك الداخلي، ففي سكون المحبوسين عن ضجيج العالم تنفتح آذان الروح لسماع همس المسيح الحبيب. لا تنشغل بأخبار الزائلات، بل اجعل كل نبضة في قلبك صرخة تطلب خلاص العالم».',
    quote: '«الصمت هو لغة العالم الآتي؛ من يصمت لسانه وفكره هنا على الأرض يترنم مع الملائكة بألحان السماء الأبدية».',
    quoteRef: 'تراث محبسة القديس بطرس وبولس في عنايا',
    practicalExercise: 'اقضِ نصف ساعة الليلة في صمت مطبق دون أن تنطق بكلمة واحدة، واكتفِ بمناجاة يسوع في سر قلبك.',
    stickerColor: 'from-stone-700 via-neutral-800 to-stone-950 border-amber-400',
    accentBg: 'bg-stone-900 text-stone-200 border-stone-700',
    badgeIcon: '🕯️',
    century: 'القرن التاسع عشر (1828 - 1898 م)',
    feastDay: 'الأحد الثالث من يوليو / ٢٤ ديسمبر',
  },
  {
    id: 'ephrem_syrian',
    name: 'مار أفرام السرياني',
    epithet: 'قيثارة الروح القيثاري ومعلم التوبة',
    tradition: 'syrian_armenian',
    traditionLabel: 'الشرق السرياني والأنطاكي',
    virtue: 'التخشع وطلب المغفرة بدموع',
    virtueCategory: 'prayer',
    dailyMessage: '«يا رب، هبني أن أرى خطاياي لئلا أنشغل بإدانة أخي. امنحني روح المنسحقين وقلباً تائباً يغتسل كل صباح بدموع الرحمة الإلهية».',
    quote: '«طوبى لمن عرف ضعفه فهو لا يتكبر أبداً على الساقطين، بل يصلي لأجلهم بقلب مكسور».',
    quoteRef: 'ميامر مار أفرام السرياني',
    practicalExercise: 'صلّ صلاة مار أفرام الشهيرة: «يا ربي وإلهي، هبني روح الحزن والتوبة».',
    stickerColor: 'from-amber-800 via-stone-900 to-stone-950 border-amber-400',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '🎻',
    century: 'القرن الرابع الميلادي (306 - 373 م)',
    feastDay: '١٥ أبيب / ٩ يونيو',
  },
  {
    id: 'martin_tours',
    name: 'القديس مارتن التوروسي',
    epithet: 'شفيع الرحمة ومقسم الرداء مع الفقير',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي واللاتيني',
    virtue: 'المحبة العملية ومشاركة القنية',
    virtueCategory: 'love',
    dailyMessage: '«حين تقسم رداءك مع المحتاج، فاعلم أنك تلبس المسيح نفسه في الشخص الضعيف. لا تحبس عطاياك، فالمحبة الحقيقية هي التي تتألم مع المعوز وتشارك الضعيف لقمته».',
    quote: '«بهذا الرداء الممزق كسانني مارتن أمام الملائكة، لأنه كسا يسوع العريان في شخص الفقير البردَان!».',
    quoteRef: 'سيرة القديس مارتن بقلم سوبلبيوس سفيروس',
    practicalExercise: 'قدم عطية مادية أو طعاماً لمحتاج اليوم باسم المسيح المحب.',
    stickerColor: 'from-blue-700 via-slate-800 to-stone-950 border-blue-400',
    accentBg: 'bg-blue-950/40 text-blue-200 border-blue-600/40',
    badgeIcon: '🧥',
    century: 'القرن الرابع الميلادي (316 - 397 م)',
    feastDay: '١١ نوفمبر',
  },
  {
    id: 'mary_egypt',
    name: 'القديسة مريم المصرية',
    epithet: 'سائحة البرية والتوبة المعجزة',
    tradition: 'east',
    traditionLabel: 'البرية القبطية والأردن',
    virtue: 'الجهاد النسكى البالغ والتوبة الصارخة',
    virtueCategory: 'detachment',
    dailyMessage: '«قوتي كانت نعمة الله الفائقة حين عبرت الأردن إلى البرية لأمحو آثار الماضي الخطير. لا تستصعب أي جهاد روحي مهما بدا قاسياً، فنعمة المسيح تكفيك وتمنحك أجنحة جديدة للتحليق في الطهارة».',
    quote: '«حين منعتني قوة خفية من دخول الهيكل، أدركت نجاسة حياتي فصرخت للسيدة العذراء بدموع، ومن يومها تغيرت حياتي إلى الأبد!».',
    quoteRef: 'سيرة القديسة مريم المصرية بقلم الأنبا سوفرونيوس',
    practicalExercise: 'قدم اليوم صلاة توبة حارة واطلب شفاعة القديسة مريم المصرية لتثبيتك في النقاوة.',
    stickerColor: 'from-purple-700 via-rose-900 to-stone-950 border-purple-400',
    accentBg: 'bg-purple-950/40 text-purple-200 border-purple-600/40',
    badgeIcon: '🏜️',
    century: 'القرن الخامس الميلادي (344 - 421 م)',
    feastDay: 'الأحد الخامس من الصوم الكبير / ١ فراموطة',
  },
];

// Helper to calculate deterministic day of year (1-365)
export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Full 365 Non-Repeating Engine
export function getDailySaintSticker(forceRefresh = false): {
  sticker: SaintSticker;
  timeRemainingMs: number;
  dayOfYear: number;
  isDailyAssigned: boolean;
} {
  const STORAGE_KEY = 'mokarasa_daily_saint_sticker_v3';
  const SEEN_HISTORY_KEY = 'mokarasa_saints_seen_history_v3';
  const now = Date.now();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  const dayOfYear = getDayOfYear();

  // If not forcing refresh, check active 24h record
  if (!forceRefresh) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const elapsed = now - parsed.timestamp;
        if (elapsed < TWENTY_FOUR_HOURS_MS) {
          const found = SAINTS_STICKERS_DATA.find((s) => s.id === parsed.saintId);
          if (found) {
            return {
              sticker: found,
              timeRemainingMs: TWENTY_FOUR_HOURS_MS - elapsed,
              dayOfYear,
              isDailyAssigned: true,
            };
          }
        }
      }
    } catch {}
  }

  // Retrieve seen history to avoid repetition
  let seenIds: string[] = [];
  try {
    const rawSeen = localStorage.getItem(SEEN_HISTORY_KEY);
    if (rawSeen) seenIds = JSON.parse(rawSeen);
  } catch {}

  let candidate: SaintSticker;

  if (forceRefresh) {
    // Pick an unseen saint if possible
    const unseenPool = SAINTS_STICKERS_DATA.filter((s) => !seenIds.includes(s.id));
    const pool = unseenPool.length > 0 ? unseenPool : SAINTS_STICKERS_DATA;
    const randomIndex = Math.floor(Math.random() * pool.length);
    candidate = pool[randomIndex];
  } else {
    // Canonical day mapping for the annual cycle across the expanded saints list
    const canonicalIndex = dayOfYear % SAINTS_STICKERS_DATA.length;
    candidate = SAINTS_STICKERS_DATA[canonicalIndex];
  }

  // Update seen history
  try {
    const nextSeen = Array.from(new Set([...seenIds, candidate.id]));
    if (nextSeen.length >= SAINTS_STICKERS_DATA.length) {
      localStorage.setItem(SEEN_HISTORY_KEY, JSON.stringify([candidate.id]));
    } else {
      localStorage.setItem(SEEN_HISTORY_KEY, JSON.stringify(nextSeen));
    }
  } catch {}

  // Save current active sticker for 24h
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        saintId: candidate.id,
        timestamp: now,
      })
    );
  } catch {}

  return {
    sticker: candidate,
    timeRemainingMs: TWENTY_FOUR_HOURS_MS,
    dayOfYear,
    isDailyAssigned: !forceRefresh,
  };
}
