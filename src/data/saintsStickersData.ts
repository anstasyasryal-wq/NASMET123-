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
    epithet: 'أب الرهبنة الغربية ومنظم القوانين الكنسية',
    tradition: 'west',
    traditionLabel: 'الغرب اللاتيني والرهبنة البندكتية',
    virtue: '«صلّ واعمل» (Ora et Labora) والانضباط',
    virtueCategory: 'patience',
    dailyMessage: '«اجعل حياتك مسبوكة بنظام إلهي دقيق؛ لا تفصل بين وقت الصلاة ووقت العمل والخدمة، بل قدّس يدك بالعمل المتواضع النافع، وقدّس فكرك بالتسبيح، فلا يجد العدو باباً للكسل والتواني».',
    quote: '«صلّ واعمل (Ora et Labora)؛ ولا تفضل أي شيء على الإطلاق على محبة المسيح وتسبيحه المقدس».',
    quoteRef: 'قانون القديس بندكتوس (Regula Benedicti)',
    practicalExercise: 'رتب اليوم مواعيدك وساعات مخدعك بدقة متناهية، والتزم بها دون تأجيل أو تهاون.',
    stickerColor: 'from-slate-700 via-stone-800 to-stone-950 border-amber-400',
    accentBg: 'bg-stone-900 text-stone-200 border-stone-700',
    badgeIcon: '⚖️',
    century: 'القرن السادس الميلادي (480 - 548 م)',
    feastDay: '١١ يوليو',
  },
  {
    id: 'silouan_athonite',
    name: 'القديس سلوان الأثوسي',
    epithet: 'ناسك جبل آثوس ورسول المحبة للجميع',
    tradition: 'east',
    traditionLabel: 'الشرق الأرثوذكسي وجبل آثوس',
    virtue: 'المحبة للأعداء ورفض اليأس',
    virtueCategory: 'love',
    dailyMessage: '«الذي لا يحب أعداءه لم يتعرف بعد على حلاوة الروح القدس. احفظ عقلك في التواضع ولا تيأس مهما كانت سقطاتك؛ انظر إلى رحمات المسيح التي تفوق كل ذنوب العالم كقطرة ماء في محيط واسع».',
    quote: '«احفظ عقلك في الجحيم ولا تيأس! من يصلي من أجل أعدائه تفيض في قلبه نعمة السلام الإلهي».',
    quoteRef: 'كتابات القديس سلوان ومذكراته النسكية',
    practicalExercise: 'صلّ اليوم بحرارة وباسم خاص من أجل شخص يزعجك أو يحارب خدمتك، واطلب له البركة من كل قلبك.',
    stickerColor: 'from-indigo-700 via-violet-800 to-stone-900 border-indigo-400',
    accentBg: 'bg-indigo-950/40 text-indigo-200 border-indigo-600/40',
    badgeIcon: '🕯️',
    century: 'القرن العشرين (1866 - 1938 م)',
    feastDay: '٢٤ سبتمبر',
  },
  {
    id: 'therese_lisieux',
    name: 'القديسة تريزا دي ليزيو',
    epithet: 'زهرة الصليب ورائدة الطريق الصغير',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي والكرملي',
    virtue: 'الأمانة في أصغر الأعمال والطفولة الروحية',
    virtueCategory: 'humility',
    dailyMessage: '«لا تبحث عن أعمال بطولية باهرة لتثبت تكريسك؛ فالرب يسوع يفرح حين تلتقط دبوساً عن الأرض بمحبة خالصة له. اجعل كل تصرف صغير في يومك نابعاً من حب متواضع، وسترى كيف يصير الطريق الصغير سلماً للسماء».',
    quote: '«رسالتي في السماء ستكون أن أمطر على الأرض زخات من الورود والرحمة! أريد أن أحب يسوع كما لم يُحب من قبل!».',
    quoteRef: 'قصة نفس (Histoire d\'une âme)',
    practicalExercise: 'قم بعمل بسيط ومجهول تماماً في بيتك أو كنيستك (تنظيف، ترتيب، خدمة صامتة) بنية إهداء وردة حب للمسيح.',
    stickerColor: 'from-rose-500 via-red-600 to-amber-900 border-rose-300',
    accentBg: 'bg-rose-950/30 text-rose-200 border-rose-500/40',
    badgeIcon: '🌹',
    century: 'القرن التاسع عشر (1873 - 1897 م)',
    feastDay: '١ أكتوبر',
  },
  {
    id: 'brother_lawrence',
    name: 'الأخ لورنس القيامة',
    epithet: 'ممارس الحضور الإلهي في أبسط الأعمال',
    tradition: 'universal',
    traditionLabel: 'التراث الروحي الجامع والكرملي',
    virtue: 'ممارسة حضور الله الدائم',
    virtueCategory: 'prayer',
    dailyMessage: '«لا تفصل بين أوقات العبادة وأوقات العمل والطبخ والخدمة؛ إن وقت العمل عندي لا يختلف عن وقت الصلاة، ففي ضجة المطبخ أملك ربي بنفس الهدوء والسلام كما لو كنت ساجداً أمام القربان المقدس في قدس الأقداس».',
    quote: '«إن أقدس وألزم عمل في الحياة الروحية هو أن نعتاد على ممارسة حضور الله في كل لحظة، نتحدث معه بوداعة وتواضع في كل خطوة».',
    quoteRef: 'ممارسة حضور الله (The Practice of the Presence of God)',
    practicalExercise: 'أثناء قيامك بأي عمل روتيني اليوم (مشي، غسيل، كتابة)، تحدث مع المسيح كصديق جالس بجوارك تماماً.',
    stickerColor: 'from-amber-600 via-stone-700 to-stone-900 border-amber-300',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-500/40',
    badgeIcon: '🍳',
    century: 'القرن السابع عشر (1614 - 1691 م)',
    feastDay: '١٢ فبراير',
  },
  {
    id: 'john_cross',
    name: 'القديس يوحنا الصليب',
    epithet: 'طبيب النفوس وشاعر الليل المظلم',
    tradition: 'west',
    traditionLabel: 'الغرب الإسباني واللاهوت الصوفي',
    virtue: 'الإيمان النقي واحتضان الصليب بلا عواطف',
    virtueCategory: 'faith',
    dailyMessage: '«حين تجف منابع التعزية العاطفية في صلاتك وتشعر وكأنك في ليل مظلم موحش، لا تهرب ولا تظن أن الله قد تخلى عنك؛ إنه ينقيك من محبة العطايا لتتعلق برب العطايا وحده بلا شوائب».',
    quote: '«حيث لا تجد محبة، ازرع أنت محبة، وستحصد محبة! في مساء هذه الحياة، سنُدان ونُقاس على المحبة وحدها!».',
    quoteRef: 'صعود جبل الكرمل والليلة المظلمة',
    practicalExercise: 'إذا شعرت بجفاف في صلاتك اليوم، لا تقصر وقتها بل اثبت في مكانك رافعاً يديك بالصمت والشكر.',
    stickerColor: 'from-purple-800 via-slate-800 to-stone-950 border-purple-400',
    accentBg: 'bg-purple-950/40 text-purple-200 border-purple-600/40',
    badgeIcon: '✝️',
    century: 'القرن السادس عشر (1542 - 1591 م)',
    feastDay: '١٤ ديسمبر',
  },
  {
    id: 'columba_iona',
    name: 'القديس كولومبا الإيوني',
    epithet: 'رسول اسكتلندا وشعلة البرية السلتية',
    tradition: 'celtic',
    traditionLabel: 'التراث السلتي والاسكتلندي',
    virtue: 'الشجاعة والجهاد الكنسي البسيط',
    virtueCategory: 'patience',
    dailyMessage: '«امخر عباب البحر بلا خوف في سفينة الإيمان؛ لا تبالِ بالعواصف التي تعترض خدمتك، فالمسيح هو ربانك والمحيط كله في قبضة يده. ليكن صومك مقدساً وعملك اليدوي أمانة للمحتاجين».',
    quote: '«أيها المخلص، كن سراجاً لخطواتي، ونوراً لدروبي، وقائداً لسفينتي في بحر هذا العالم المتلاطم الأمواج حتى أصل لميناء الأبدية!».',
    quoteRef: 'أناشيد كولومبا في جزيرة إيونا',
    practicalExercise: 'اقرأ مزمور 107 (حمد للرب فادي التائهين في البحار) بتأمل عميق واطلب معونة الله في مشاكلك.',
    stickerColor: 'from-blue-700 via-teal-800 to-stone-900 border-blue-400',
    accentBg: 'bg-blue-950/40 text-blue-200 border-blue-600/40',
    badgeIcon: '⛵',
    century: 'القرن السادس الميلادي (521 - 597 م)',
    feastDay: '٩ يونيو',
  },
  {
    id: 'gregory_narek',
    name: 'القديس غريغوريوس الناريكي',
    epithet: 'شاعر المراحم الإلهية ومعلم الكنيسة الجامعة',
    tradition: 'syrian_armenian',
    traditionLabel: 'التراث الأرمني والشرق العريق',
    virtue: 'الانسحاق وطلب الرحمة بدموع التوبة',
    virtueCategory: 'humility',
    dailyMessage: '«لا تخجل من أن تكشف جراحات نفسك المخزية أمام الطبيب السماوي؛ فالدموع الصادقة التي تسكبها في مخدعك تغسل أعتى الخطايا وتستنزل مراحم الله التي لا تنتهي».',
    quote: '«يا رب، من أعماق قلبي المنكسر أصرخ إليك: اقبل صلاتي لا كقاضٍ يدين، بل كطبيب يضمد وأب يغفر ويستر!».',
    quoteRef: 'كتاب المراثي والصلوات (Book of Lamentations)',
    practicalExercise: 'اسجد سجدة توبة في مخدعك واطلب رحمة الله بدموع الرجاء لنفسك وللعالم أجمع.',
    stickerColor: 'from-red-800 via-amber-900 to-stone-900 border-amber-400',
    accentBg: 'bg-red-950/40 text-red-200 border-red-600/40',
    badgeIcon: '📖',
    century: 'القرن العاشر الميلادي (951 - 1003 م)',
    feastDay: '٢٧ فبراير',
  },
  {
    id: 'thomas_kempis',
    name: 'توما الكمبيسي',
    epithet: 'صاحب كتاب الاقتداء بالمسيح والمرشد الروحي',
    tradition: 'universal',
    traditionLabel: 'التراث الروحي الأوروبي والجامع',
    virtue: 'الاقتداء بوداعة الفادي وإنكار الذات',
    virtueCategory: 'humility',
    dailyMessage: '«ما فائدة أن تناقش أعمق المسائل اللاهوتية بذكاء لسانك، وأنت تفتقر إلى التواضع الذي يرضي الثالوث القدوس؟ دع عنك محبة الظهور وتفاهات العالم، واجتهد في أن تقتدي بالسيد المسيح في وداعته وصمته وحمله للصليب».',
    quote: '«خير للإنسان أن يشعر بندامة حقيقية في قلبه، من أن يعرف تعريف الندامة الفلسفي ويظل قلبه قاسياً! من يتبعني لا يمشي في الظلمة».',
    quoteRef: 'الاقتداء بالمسيح (De Imitatione Christi)',
    practicalExercise: 'اختر اليوم ألا تتحدث عن نفسك أو إنجازاتك في أي محادثة، واجعل كلامك كله للاستماع للآخرين وتشجيعهم.',
    stickerColor: 'from-stone-700 via-amber-800 to-stone-900 border-amber-400',
    accentBg: 'bg-stone-950 text-amber-200 border-stone-700',
    badgeIcon: '🌾',
    century: 'القرن الخامس عشر (1380 - 1471 م)',
    feastDay: '٢٥ يوليو',
  },
  {
    id: 'cyril_sixth',
    name: 'القديس البابا كيرلس السادس',
    epithet: 'رجل الصلاة والمذبح وأب المعجزات المعاصر',
    tradition: 'east',
    traditionLabel: 'الشرق القبطي المعاصر وطاحونة مصر القديمة',
    virtue: 'الاتكال المطلق على قوة القداس والمذبح',
    virtueCategory: 'faith',
    dailyMessage: '«كن مطمئناً جداً جداً ولا تفكر في الأمر كثيراً، بل دع الأمر لمن بيده الأمر. ارفع قلبك إلى الله في كل ضيقة؛ فالمذبح هو الحصن الذي تتكسر عليه كل سهام العدو والشدائد».',
    quote: '«كن مطمئناً جداً جداً ولا تفكر في الأمر كثيراً، بل دع الأمر لمن بيده الأمر! الصلاة تصنع المعجزات وتفتح الأبواب المغلقة!».',
    quoteRef: 'رسائل وتوجيهات البابا كيرلس السادس',
    practicalExercise: 'ألقِ كل هم أو مشكلة تقلقك اليوم أمام صورة القديس أو على المذبح، وقل بثقة: «أنا واثق فيك يا رب، دبر أنت حياتي».',
    stickerColor: 'from-amber-600 via-yellow-700 to-stone-900 border-amber-300',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '✝️',
    century: 'القرن العشرين (1902 - 1971 م)',
    feastDay: '٣٠ أمشير (٩ مارس)',
  },
  {
    id: 'clare_assisi',
    name: 'القديسة كلارا الأسيزية',
    epithet: 'شعلة الفقر الاختياري وعاشقة الإفخارستيا',
    tradition: 'west',
    traditionLabel: 'الغرب الإيطالي وراهبات الفقيرات',
    virtue: 'الشجاعة الإيمانية وعشق القربان الأقدس',
    virtueCategory: 'faith',
    dailyMessage: '«تأملي كل يوم في مرآة الأبدية: يسوع المسيح؛ انظري إلى اتضاعه في المذود وفقره على الصليب، ودعي جماله الإلهي يطبع ملامحه على قلبك لتكوني صورة حية لمحبة السماء».',
    quote: '«ضع عقلك أمام مرآة الأبدية، ضع نفسك في بهاء المجد الإلهي، وحوّل قلبك كله بالحب إلى من أحبك حتى الموت!».',
    quoteRef: 'رسائل القديسة كلارا إلى القديسة أغنيس البوهيمية',
    practicalExercise: 'اقضِ وقتاً إضافياً بعد صلواتك في شكر الرب على نعمة التناول والشركة المقدسة.',
    stickerColor: 'from-yellow-700 via-amber-800 to-stone-900 border-yellow-300',
    accentBg: 'bg-yellow-950/30 text-yellow-200 border-yellow-600/40',
    badgeIcon: '☀️',
    century: 'القرن الثالث عشر (1194 - 1253 م)',
    feastDay: '١١ أغسطس',
  },
  {
    id: 'seraphim_sarov',
    name: 'القديس سيرافيم ساروف',
    epithet: 'شعلة الفرح بالروح القدس ورسول القيامة',
    tradition: 'east',
    traditionLabel: 'الشرق الروسي والأرثوذكسي',
    virtue: 'الفرح الروحي واقتناء الروح القدس',
    virtueCategory: 'joy',
    dailyMessage: '«يا فرحي، المسيح قام! اقتنِ سلام الروح القدس في قلبك، وسيخلص الآلاف من حولك! لا تدع روح الكآبة والعبوس تتسلل إلى خدمتك، فالمسيح غلب الموت ومنحنا الفرح الذي لا يُنزع».',
    quote: '«اقتنِ سلام الروح القدس في قلبك، وسيجد آلاف الناس خلاصهم من حولك! يا فرحي، المسيح قام من بين الأموات!».',
    quoteRef: 'حوار القديس سيرافيم مع موتوفيلوف عن الروح القدس',
    practicalExercise: 'ابتسم في وجه كل من يقابلك اليوم وبادرهم بالسلام والفرح والتشجيع كرسول للقيامة.',
    stickerColor: 'from-amber-500 via-orange-600 to-stone-900 border-amber-300',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-400/40',
    badgeIcon: '🌟',
    century: 'القرن التاسع عشر (1754 - 1833 م)',
    feastDay: '١٥ يناير / ١ أغسطس',
  },
  {
    id: 'athanasius_apostolic',
    name: 'القديس أثناسيوس الرسولي',
    epithet: 'حامي الإيمان القويم وعمود الكنيسة الجامعة',
    tradition: 'east',
    traditionLabel: 'الشرق القبطي والمسكوني',
    virtue: 'الشجاعة والثبات على الحق الإلهي',
    virtueCategory: 'faith',
    dailyMessage: '«حتى لو بدا لك أن العالم كله يقف ضد إيمانك ووداعتك، فاثبت كالصخرة في المسيح. الحق لا يتغير بكثرة المعارضين، والنعمة تحفظ من يتمسك بها دون مساومة».',
    quote: '«لو كان العالم كله ضدي، فأنا أثناسيوس ضد العالم! لأن كلمة الله الحي باقية إلى الأبد».',
    quoteRef: 'تاريخ الأريوسيين',
    practicalExercise: 'دافع اليوم بلطف وحكمة عن شخص مظلوم أو غائب يُساء إليه في مجلس.',
    stickerColor: 'from-amber-700 via-yellow-800 to-stone-950 border-amber-400',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-500/40',
    badgeIcon: '👑',
    century: 'القرن الرابع الميلادي (296 - 373 م)',
    feastDay: '٧ بشنس (١٥ مايو)',
  },
  {
    id: 'padre_pio',
    name: 'القديس بادري بيو البيترلتشيني',
    epithet: 'رجل الصليب والاعتراف وجراحات الفادي',
    tradition: 'west',
    traditionLabel: 'الغرب الإيطالي والكبوشي',
    virtue: 'الصلاة بلا قلق والرجاء المطلق',
    virtueCategory: 'prayer',
    dailyMessage: '«صلِّ، وضع رجاءك في الله، ولا تقلق! فالقلق عديم الفائدة، والله إله رحيم يسمع أنين صلاتك حتى قبل أن تنطق بها شفتاك».',
    quote: '«الصلاة هي أفضل سلاح نملكه؛ إنها المفتاح الذي يفتح قلب الله الحنون!».',
    quoteRef: 'رسائل وإرشادات القديس بادري بيو',
    practicalExercise: 'ردد في كل ضيقة تعترضك اليوم: «يا ربي يسوع، أثق بك وبمراحمك وأترك كل شيء لتدبيرك».',
    stickerColor: 'from-stone-700 via-amber-900 to-stone-950 border-amber-400',
    accentBg: 'bg-stone-900 text-stone-200 border-stone-700',
    badgeIcon: '🕊️',
    century: 'القرن العشرين (1887 - 1968 م)',
    feastDay: '٢٣ سبتمبر',
  },
  {
    id: 'moses_black',
    name: 'القديس الأنبا موسى الأسود',
    epithet: 'قوي البرية وأمير التوبة والغفران',
    tradition: 'east',
    traditionLabel: 'الشرق القبطي وبرية شيهيت',
    virtue: 'عدم الإدانة والستر الجذري على الإخوة',
    virtueCategory: 'humility',
    dailyMessage: '«من نظر إلى خطاياه وجراحاته الخاصة بدموع التوبة، لم يجد في قلبه أو وقته متسعاً ليتفرس في سقطات الآخرين. استر على أخيك فيستر الله عليك في يوم الدينونة الرهيب».',
    quote: '«خطاياي تجري ورائي وأنا لا أراها، وأنا اليوم آتٍ لأدين غيري على خطاياه!».',
    quoteRef: 'بستان الرهبان — قصة كيس الرمل المثقوب',
    practicalExercise: 'إذا تذكرت خطأ لأحد الإخوة أو المخدومين اليوم، استغفر له سراً واصمت تماماً دون إخبار أحد.',
    stickerColor: 'from-stone-800 via-neutral-900 to-stone-950 border-amber-500',
    accentBg: 'bg-stone-950 text-amber-200 border-stone-800',
    badgeIcon: '⏳',
    century: 'القرن الرابع الميلادي (330 - 405 م)',
    feastDay: '٢٤ بؤونة (١ يوليو)',
  },
  {
    id: 'mother_teresa',
    name: 'القديسة تريزا الكلكتية',
    epithet: 'أم المحبة وبلسم المنبوذين في كلكتا',
    tradition: 'universal',
    traditionLabel: 'التراث الجامع وراهبات المحبة',
    virtue: 'المحبة العملية في خدمة أفقر الفقراء',
    virtueCategory: 'love',
    dailyMessage: '«ليس المهم كم نعطي أو كم نعمل، بل كم من الحب نضعه في عطائنا وعملنا اليومي. ابحث عن المسيح المتألم في وجه المتروكين في أطراف مدينتك وبيتك».',
    quote: '«السلام يبدأ بابتسامة صادقة! لا يمكننا جميعاً أن نقوم بأعمال عظيمة، لكن يمكننا أن نقوم بأعمال صغيرة بمحبة عظيمة جداً».',
    quoteRef: 'كلمات وتأملات الأم تريزا',
    practicalExercise: 'قدم اليوم مساعدة أو كلمة تشجيع دافئة لشخص منسي أو عامل نظافة أو مريض متألم.',
    stickerColor: 'from-sky-700 via-blue-800 to-stone-900 border-sky-300',
    accentBg: 'bg-sky-950/40 text-sky-200 border-sky-600/40',
    badgeIcon: '🤝',
    century: 'القرن العشرين (1910 - 1997 م)',
    feastDay: '٥ سبتمبر',
  },
  {
    id: 'aidan_lindisfarne',
    name: 'القديس إيدان من ليندسفارن',
    epithet: 'رسول نورثمبريا وينبوع الوداعة السلتية',
    tradition: 'celtic',
    traditionLabel: 'التراث السلتي والإنجليزي العريق',
    virtue: 'الوداعة في التبشير وعشق المشي على الأقدام',
    virtueCategory: 'peace',
    dailyMessage: '«امشِ على أقدامك بين الناس ولا تتكبر بركوب الخيل أو الظهور بمظاهر الرؤساء؛ فالإنجيل يدخل القلوب حين يرى الناس وداعتك وتواضعك يسبقان كلامك».',
    quote: '«الوداعة الصامتة واليد الممدودة بالخبز للمحتاجين هي التي فتحت قلاع القلوب القاسية لنور الإيمان».',
    quoteRef: 'تاريخ بيدا الكنسي',
    practicalExercise: 'امشِ اليوم بتمهل وتواضع في طريق خدمتك، وادعُ بالبركة لكل إنسان تقع عيناك عليه.',
    stickerColor: 'from-teal-700 via-emerald-800 to-stone-900 border-teal-300',
    accentBg: 'bg-teal-950/40 text-teal-200 border-teal-600/40',
    badgeIcon: '🚶',
    century: 'القرن السابع الميلادي (توفي 651 م)',
    feastDay: '٣١ أغسطس',
  },
  {
    id: 'jacob_serugh',
    name: 'مار يعقوب السروجي',
    epithet: 'قيثارة الروح القدس والشاعر السرياني الإلهي',
    tradition: 'syrian_armenian',
    traditionLabel: 'الشرق السرياني والأنطاكي',
    virtue: 'التأمل الشعري في أسرار الصليب والتجسد',
    virtueCategory: 'prayer',
    dailyMessage: '«اجعل لسانك قيثارة يلمس أوتارها الروح القدس؛ ترنم بأمجاد الصليب ولا تمل من التغني بذاك الذي انحنى حتى التراب ليرفعنا إلى سماء مجده».',
    quote: '«المجد لذاك العلي الذي نزل واحتضن ضعفنا، لكي يلبس الترابيين ثوب النور الأبدي!».',
    quoteRef: 'ميامر مار يعقوب السروجي السريانية',
    practicalExercise: 'اقرأ ترنيمة أو مزموراً تسبيحياً اليوم بصوت خافت بخشوع وتأمل في كلمات النعمة.',
    stickerColor: 'from-violet-700 via-purple-900 to-stone-950 border-violet-400',
    accentBg: 'bg-violet-950/40 text-violet-200 border-violet-600/40',
    badgeIcon: '🎵',
    century: 'القرن الخامس والسادس (451 - 521 م)',
    feastDay: '٢٩ تشرين الثاني (نوفمبر)',
  },
  {
    id: 'frumentius_axum',
    name: 'القديس فرومنتيوس (أنبا سلامة)',
    epithet: 'كاشف النور ورسول إثيوبيا ومملكة أكسوم',
    tradition: 'ethiopian',
    traditionLabel: 'التراث الإثيوبي والأكسومي الإفريقي',
    virtue: 'الأمانة في الغربة وتحويل المحنة لخدمة',
    virtueCategory: 'faith',
    dailyMessage: '«إذا وجدت نفسك في مكان غريب أو ظروف معاكسة لم تخترها، فاعلم أن يد الله أرسلتك لتكون نوراً ورسول سلام هناك؛ الأمانة في المحنة تثمر حصاداً كنسياً يفرح الأجيال».',
    quote: '«لم يمنعنا الأسر من أن نرفع أيدينا بالصلاة، فصارت أرض الغربة هيكلاً مقدساً ينبض بنور الإنجيل».',
    quoteRef: 'سيرة كاشف النور فرومنتيوس',
    practicalExercise: 'اشكر الله على الظرف الصعب الذي تمر به اليوم، واطلب منه أن يستخدمك لخلاص المتعبين حولك.',
    stickerColor: 'from-amber-600 via-yellow-700 to-stone-900 border-yellow-400',
    accentBg: 'bg-amber-950/40 text-amber-200 border-amber-600/40',
    badgeIcon: '☀️',
    century: 'القرن الرابع الميلادي (توفي 383 م)',
    feastDay: '٢٦ أبيب (٢ أغسطس)',
  },
  {
    id: 'tekle_haymanot',
    name: 'القديس تكلا هيمانوت الحبشي',
    epithet: 'عمود الصلاة والبرية الإفريقية وصاحب الأجنحة',
    tradition: 'ethiopian',
    traditionLabel: 'التراث الإثيوبي الإفريقي والرهباني',
    virtue: 'الصبر الخارق في الصلاة والسهر الروحي',
    virtueCategory: 'patience',
    dailyMessage: '«اثبت في مخدعك كجندي أمين لا يبرح موقعه؛ حتى لو وهنت قدماك وكلّ جسدك، فارفع قلبك بأجنحة الشوق نحو الفادي، فالصبر في الوقوف أمام الله يفتح لك أبواب السماء».',
    quote: '«صبر المجاهدين في الصلوات هو البخور العطر الذي يبهج طغمات الملائكة ويسكب النعمة على الأرض كلها».',
    quoteRef: 'سيرة القديس تكلا هيمانوت الحبشي',
    practicalExercise: 'قف للصلاة الليلة ٥ دقائق إضافية بكل خشوع دون حركة أو استناد.',
    stickerColor: 'from-yellow-600 via-amber-800 to-stone-950 border-amber-400',
    accentBg: 'bg-yellow-950/40 text-yellow-200 border-yellow-600/40',
    badgeIcon: '🦅',
    century: 'القرن الثالث عشر (1215 - 1313 م)',
    feastDay: '٢٤ مسرى (٣٠ أغسطس)',
  },
  {
    id: 'vincent_paul',
    name: 'القديس منصور دي بول (Vincent de Paul)',
    epithet: 'رسول المحبة المنظمة وخادم البؤساء',
    tradition: 'west',
    traditionLabel: 'الغرب الفرنسي ورعاية الأيتام والمشردين',
    virtue: 'الخدمة الفعالة المنظمة بحب واحترام للمحتاج',
    virtueCategory: 'love',
    dailyMessage: '«حين تخدم الفقير، لا تفعل ذلك بتعالٍ أو كأنك تتفضل عليه، بل اخدمه باحترام ورقة كمن يخدم سيده؛ فالفقراء هم شفعاؤنا وأسيادنا الذين يفتحون لنا أبواب الملكوت».',
    quote: '«المحبة ليست مشاعر في القلب فقط، بل هي أعمال تبذل، وأيدي تمسح الدموع، وأقدام تسعى لتفقد المتروكين».',
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
  const STORAGE_KEY = 'mokarasa_daily_saint_sticker_v2';
  const SEEN_HISTORY_KEY = 'mokarasa_saints_seen_history_v2';
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
    // Canonical day mapping for the 365-day annual cycle
    const canonicalIndex = dayOfYear % SAINTS_STICKERS_DATA.length;
    candidate = SAINTS_STICKERS_DATA[canonicalIndex];
  }

  // Update seen history
  try {
    const nextSeen = Array.from(new Set([...seenIds, candidate.id]));
    if (nextSeen.length >= SAINTS_STICKERS_DATA.length) {
      // Reset cycle when all are seen
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
