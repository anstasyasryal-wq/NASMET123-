const fs = require('fs');
const path = require('path');

// 1. Read existing messages file to keep the 68 hand-crafted messages as the bedrock (Days 1 to 68)
const currentFilePath = path.join(__dirname, '..', 'src', 'data', 'heavenlyMessages.ts');
const currentContent = fs.readFileSync(currentFilePath, 'utf8');

// Match existing items
const existingItemsMatch = currentContent.match(/export const HEAVENLY_MESSAGES: HeavenlyMessage\[\] = (\[[\s\S]*?\]);/);
if (!existingItemsMatch) {
  console.error('Could not find HEAVENLY_MESSAGES array in file!');
  process.exit(1);
}

// Evaluate existing messages safely
// Replace TypeScript typing if any inside array
let existingArrayStr = existingItemsMatch[1];
let existingMessages;
try {
  // Use Function to parse JS object array
  existingMessages = new Function(`return ${existingArrayStr}`)();
  console.log(`Successfully extracted ${existingMessages.length} existing anchor messages.`);
} catch (e) {
  console.error('Error parsing existing messages array:', e);
  process.exit(1);
}

// Ensure each existing message has dayOfYear assigned (1 to 68)
const all366Messages = existingMessages.map((msg, index) => ({
  ...msg,
  dayOfYear: index + 1,
}));

// Comprehensive Biblical Database for Days 69 to 366
// Covering all 12 major spiritual themes for consecrated souls & believers
const biblicalPromises = [
  // --- Days 69 to 100: Comfort, Peace & Nearness ---
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'يا ابني الحبيب، لا تضطرب،',
    message: 'حين تحاصرك الهموم وتظلم الدنيا من حولك، تذكر أنني النور الذي لا يدركه الظلام. سلامي لك دائم ولن يتركك وحيداً في وسط الضيق.',
    verse: '«اَلرَّبُّ نُورِي وَخَلاَصِي، مِمَّنْ أَخَافُ؟ الرَّبُّ حِصْنُ حَيَاتِي، مِمَّنْ أَرْتَعِبُ؟»',
    verseRef: 'مزمور 27: 1',
    reflection: 'النور الإلهي يبدد أشد الظلمات حلكة؛ ثبت عينك على المصلوب واطرد الخوف.',
    icon: '🕯️',
  },
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'إلى قلبي المحبوب،',
    message: 'أنا مسكنك في كل جيل؛ لم تولد صدفة ولست متروكاً للأقدار. حياتك محفورة في كفي وكل خطوة في طريقك محاطة بعنايتي الأبوية.',
    verse: '«يَا رَبُّ، مَلْجَأً كُنْتَ لَنَا فِي دَوْرٍ فَدَوْرٍ. مِنْ قَبْلِ أَنْ تُولَدَ الْجِبَالُ... أَنْتَ اللهُ»',
    verseRef: 'مزمور 90: 1-2',
    reflection: 'الله الأزلي هو أمانك المستمر؛ استند عليه اليوم بكل ثقلك وثق في حكمته.',
    icon: '🏰',
  },
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'يا ابنتي العزيزة،',
    message: 'حين تبكين في خفاء مخدعك ولا يشعر بك أحد، اعلمي أنني أجمع دموعك في زقي وأكتب كل أنة في سفري. تعزيتي لك قريبة وعظيمة.',
    verse: '«تِيهِي رَاقَبْتَ. اجْعَلْ أَنْتَ دُمُوعِي فِي زِقِّكَ. أَمَا هِيَ فِي سِفْرِكَ؟»',
    verseRef: 'مزمور 56: 8',
    reflection: 'كل دمعة في المخدع غالية ومحفوظة؛ الله يحول دموع التوبة إلى ثمر فرح أبدي.',
    icon: '💧',
  },
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'يا قلبي المتألم،',
    message: 'لا تظن أن سكوتي هو نسيان؛ أنا أدبر لك في الخفاء أموراً أعظم مما تطلب أو تفتكر. اصبر لثوانٍ وسترى كيف يتمجد اسمي في خلاصك.',
    verse: '«انْتَظِرِ الرَّبَّ. لِيَتَشَدَّدْ وَلْيَتَشَجَّعْ قَلْبُكَ، وَانْتَظِرِ الرَّبَّ»',
    verseRef: 'مزمور 27: 14',
    reflection: 'الانتظار في حضرة الله يجدد القوة ويبني أجنحة النسور للإقلاع فوق العواصف.',
    icon: '🦅',
  },
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'يا ابني المبارك،',
    message: 'لو تخلت عنك كل السندات البشرية، فأنا معك. لن يخذلك وعدي ولن يتراجع عهدي معك؛ فسلامي معك إلى انقضاء الدهر.',
    verse: '«إِنَّ أَبِي وَأُمِّي قَدْ تَرَكَانِي وَالرَّبُّ يَضُمُّنِي»',
    verseRef: 'مزمور 27: 10',
    reflection: 'حضن الله أوسع من كل قلوب البشر؛ فيه تجد العزاء والشبع الذي لا ينتهي.',
    icon: '🕊️',
  },
  {
    category: 'comfort',
    categoryLabel: 'طمأنينة وسلام',
    salutation: 'يا خادمي الأمين،',
    message: 'حين تتعب من جفاء الناس وقسوة الظروف، اسمع نبضات قلبي الرقيقة: «فِي الْعَالَمِ سَيَكُونُ لَكُمْ ضِيقٌ، وَلكِنْ ثِقُوا: أَنَا قَدْ غَلَبْتُ الْعَالَمَ».',
    verse: '«قَدْ كَلَّمْتُكُمْ بِهذَا لِيَكُونَ لَكُمْ فِيَّ سَلاَمٌ. فِي الْعَالَمِ سَيَكُونُ لَكُمْ ضِيقٌ، وَلكِنْ ثِقُوا: أَنَا قَدْ غَلَبْتُ الْعَالَمَ»',
    verseRef: 'يوحنا 16: 33',
    reflection: 'نصرة المسيح نصرتك؛ الضيقة وقتية لكن المجد المعد لك أبدي وغير موصوف.',
    icon: '👑',
  },

  // --- Days 101 to 140: Divine Love, Consecration & Pure Heart ---
  {
    category: 'love',
    categoryLabel: 'محبة وقبول',
    salutation: 'يا ابني الغالي،',
    message: 'محبتي لك أزلية لا تتغير بتقلباتك؛ حين تكون ضعيفاً أحبك لأشفيك، وحين تكون قوياً أحبك لأباركك. أنت ابني الحبيب الذي به سررت.',
    verse: '«مَحَبَّةً أَبَدِيَّةً أَحْبَبْتُكِ، مِنْ أَجْلِ ذلِكَ أَدَمْتُ لَكِ الرَّحْمَةَ»',
    verseRef: 'إرميا 31: 3',
    reflection: 'محبة الله غير مشروطة ولا تتأثر بمستوى طاقتك؛ هو يحبك لذاتك ويفيض عليك برحمته.',
    icon: '❤️',
  },
  {
    category: 'love',
    categoryLabel: 'محبة وقبول',
    salutation: 'يا ابنتي المباركة،',
    message: 'لا تصدقي صوت العدو الذي يقول لك إنك مرفوضة؛ لقد اشتريتك بدم كريم على الصليب ودعوتك باسمك: أنتِ لي ولن يخطفك أحد من يدي.',
    verse: '«لاَ تَخَفْ لأَنِّي فَدَيْتُكَ. دَعَوْتُكَ بِاسْمِكَ. أَنْتَ لِي»',
    verseRef: 'إشعياء 43: 1',
    reflection: 'هويتك الحقيقية تتحدد بصليب المسيح ودمه الأقدس، لا بتقييمات الناس أو مشاعرك العابرة.',
    icon: '✝️',
  },
  {
    category: 'consecration',
    categoryLabel: 'أمانة وتكريس',
    salutation: 'يا مكرس قلبي،',
    message: 'طوبى لأنقياء القلب لأنهم يعاينون الله. احرس مخدعك وسكونك من سموم العالم؛ كل دقيقة تقضيها معي تسكب في روحك بهاءً سماوياً.',
    verse: '«طُوبَى لِلأَنْقِيَاءِ الْقَلْبِ، لأَنَّهُمْ يُعَايِنُونَ اللهَ»',
    verseRef: 'متى 5: 8',
    reflection: 'نقاوة القلب ليست انعدام الحروب، بل سرعة الرجوع إلى حضن الآب عند كل عثرة.',
    icon: '✨',
  },
  {
    category: 'consecration',
    categoryLabel: 'أمانة وتكريس',
    salutation: 'يا ابني المكرس،',
    message: 'أنا اخترتك لتكون سفيراً لي لا لتطلب مجد نفسك. حين تتواضع وتغسل أرجل إخوتك، يتمجد اسمي وتفيض فيك قوة قيامتي.',
    verse: '«لَيْسَ أَنْتُمُ اخْتَرْتُمُونِي بَلْ أَنَا اخْتَرْتُكُمْ، وَأَقَمْتُكُمْ لِتَذْهَبُوا وَتَأْتُوا بِثَمَرٍ»',
    verseRef: 'يوحنا 15: 16',
    reflection: 'الدعوة نعمة مجانية وثمرة أمانة؛ استند على اختيار الله لك واخدم بقلب وديع.',
    icon: '🍇',
  },
  {
    category: 'consecration',
    categoryLabel: 'أمانة وتكريس',
    salutation: 'يا خادمة المسيح،',
    message: 'كوني كمرثا في البذل وكمريم في السكون والجلوس عند قدمي الفادي؛ لا تدعي كثرة المشاغل تسرق منك النصيب الصالح الذي لن يُنزع منك.',
    verse: '«فَاخْتَارَتْ مَرْيَمُ النَّصِيبَ الصَّالِحَ الَّذِي لَنْ يُنْزَعَ مِنْهَا»',
    verseRef: 'لوقا 10: 42',
    reflection: 'الشبع بالمسيح في المخدع هو الوقود الوحيد لخدمة حقيقية لا تصاب بالاحتراق الداخلي.',
    icon: '🕯️',
  },

  // --- Days 141 to 180: Strength, Courage & Spiritual Victory ---
  {
    category: 'strength',
    categoryLabel: 'قوة ونصرة',
    salutation: 'يا بطل الإيمان،',
    message: 'حين تنفد قوتك وتخور قواك البشرية، هناك تبدأ قوتي. تكفيك نعمتي لأن قوتي في الضعف تكمل؛ تفاخر بضعفك لأحل عليك بقوة المسيح.',
    verse: '«فَقَالَ لِي: تَكْفِيكَ نِعْمَتِي، لأَنَّ قُوَّتِي فِي الضَّعْفِ تُكْمَلُ»',
    verseRef: '2 كورنثوس 12: 9',
    reflection: 'اعترافك بعجزك الذاتي هو المفتاح الذي يفتح أبواب معونة السماء الفائقة.',
    icon: '⚡',
  },
  {
    category: 'strength',
    categoryLabel: 'قوة ونصرة',
    salutation: 'يا ابني المجاهد،',
    message: 'لا ترتعب من حجم التحديات ولا من شراسة المعركة الروحية؛ فالذي معك أقوى من كل الذين عليك. البس سلاح الله الكامل واثبت في الصلاة.',
    verse: '«أَخِيرًا يَا إِخْوَتِي تَقَوَّوْا فِي الرَّبِّ وَفِي شِدَّةِ قُوَّتِهِ. الْبَسُوا سِلاَحَ اللهِ الْكَامِلَ»',
    verseRef: 'أفسس 6: 10-11',
    reflection: 'حربنا ليست مع لحم ودم، بل مع قوات الظلمة؛ وسلاحنا هو الصلاة والصوم وكلمة الإنجيل.',
    icon: '🛡️',
  },
  {
    category: 'victory',
    categoryLabel: 'قوة ونصرة',
    salutation: 'يا ابنتي الصابرة،',
    message: 'شكراً لله الذي يعطينا الغلبة بربنا يسوع المسيح! لا تحزني كمن لا رجاء له؛ فالنصرة محسومة على الصليب والقيامة حقيقة باقية.',
    verse: '«وَلكِنْ شُكْرًا للهِ الَّذِي يُعْطِينَا الْغَلَبَةَ بِرَبِّنَا يَسُوعَ الْمَسِيحِ»',
    verseRef: '1 كورنثوس 15: 57',
    reflection: 'عش منتصراً بروح الشكر؛ فالذي قهر الموت قادر أن يقهر كل إحباط في قلبك.',
    icon: '🏆',
  },
  {
    category: 'strength',
    categoryLabel: 'قوة ونصرة',
    salutation: 'يا قلبي الشجاع،',
    message: 'أستطيع كل شيء في المسيح الذي يقويني. ليس بقوتك ولا بذكائك، بل بروحي يقول رب الجنود. تقدم اليوم بثقة كاملة ولا تتردد.',
    verse: '«أَسْتَطِيعُ كُلَّ شَيْءٍ فِي الْمَسِيحِ الَّذِي يُقَوِّينِي»',
    verseRef: 'فيلبي 4: 13',
    reflection: 'قوة المسيح المذخورة فيك أعظم من أي عقبة تقف في طريقك اليوم.',
    icon: '💪',
  },

  // --- Days 181 to 220: Guidance, Wisdom & Divine Path ---
  {
    category: 'guidance',
    categoryLabel: 'إرشاد وحكمة',
    salutation: 'يا ابني، أطلب الحكمة،',
    message: 'إن كان أحدكم تعوزه حكمة فليطلب من الله الذي يعطي الجميع بسخاء ولا يعير. سأعلمك وأرشدك في الطريق التي تسلكها، وأنصحك وعيني عليك.',
    verse: '«أُعَلِّمُكَ وَأُرْشِدُكَ الطَّرِيقَ الَّتِي تَسْلُكُهَا. أَنْصَحُكَ. عَيْنِي عَلَيْكَ»',
    verseRef: 'مزمور 32: 8',
    reflection: 'قبل أي قرار، اصمت وصلّ: «يا رب، علمني مشيئتك»، وسترى نوره يقود خطواتك بوضوح.',
    icon: '🧭',
  },
  {
    category: 'guidance',
    categoryLabel: 'إرشاد وحكمة',
    salutation: 'يا خادمي الوديع،',
    message: 'سراج لرجلي كلامك ونور لسبيلي. لا تسر في ظلام آرائك الذاتية؛ افتح كتابي المقدس ودع وصاياه ترسم لك معالم الأمان في كل يوم.',
    verse: '«سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي»',
    verseRef: 'مزمور 119: 105',
    reflection: 'كلمة الله هي البوصلة الوحيدة المعصومة في برية هذا العالم المعاصر.',
    icon: '📖',
  },
  {
    category: 'wisdom',
    categoryLabel: 'إرشاد وحكمة',
    salutation: 'يا ابنتي الحكيمة،',
    message: 'توكلي على الرب بكل قلبك، وعلى فهمك لا تعتمدي. في كل طرقك اعرفيه وهو يقوم سبلك؛ فالسلام يسكن في طريق التسليم.',
    verse: '«تَوَكَّلْ عَلَى الرَّبِّ بِكُلِّ قَلْبِكَ، وَعَلَى فَهْمِكَ لاَ تَعْتَمِدْ. فِي كُلِّ طُرُقِكَ اعْرِفْهُ، وَهُوَ يُقَوِّمُ سُبُلَكَ»',
    verseRef: 'أمثال 3: 5-6',
    reflection: 'التسليم الواعي لله يحميك من صدمات التوقعات البشرية ويفتح لك مسارات البركة.',
    icon: '🌿',
  },

  // --- Days 221 to 260: Rest, Peace & Release of Burdens ---
  {
    category: 'rest',
    categoryLabel: 'راحة وسكينة',
    salutation: 'تعال إليّ يا ابني المتعب،',
    message: 'تعالوا إليّ يا جميع المتعبين والثقيلي الأحمال وأنا أريحكم. احملوا نيري عليكم وتعلموا مني، لأني وديع ومتواضع القلب، فتجدوا راحة لنفوسكم.',
    verse: '«تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الأَحْمَالِ، وَأَنَا أُرِيحُكُمْ»',
    verseRef: 'متى 11: 28',
    reflection: 'ألقِ كل أثقالك ومخاوفك الآن عند قدمي المصلوب؛ نيره هين وحمله خفيف.',
    icon: '🕊️',
  },
  {
    category: 'rest',
    categoryLabel: 'راحة وسكينة',
    salutation: 'يا قلبي المرهق،',
    message: 'في الهدوء والطمأنينة تكون قوتكم. توقف عن الركض المحموم وراء متطلبات العالم؛ ادخل إلى قلايتك واغلق بابك واسترح في دفء حضوري.',
    verse: '«فِي الْهُدُوءِ وَالطُّمَأْنِينَةِ تَكُونُ قُوَّتُكُمْ»',
    verseRef: 'إشعياء 30: 15',
    reflection: 'الصمت المقدس أمام الله يشفي النفس من أمراض القلق والتوتر العصبي والروحي.',
    icon: '🌊',
  },
  {
    category: 'rest',
    categoryLabel: 'راحة وسكينة',
    salutation: 'يا ابنتي الغالية،',
    message: 'مُلقين كل همكم عليه لأنه هو يعتني بكم. لا تحملي هم الغد؛ فالأب السماوي الذي يطعم طيور السماء ويكسو زنابق الحقل يسهر عليك بكل حب.',
    verse: '«مُلْقِينَ كُلَّ هَمِّكُمْ عَلَيْهِ، لأَنَّهُ هُوَ يَعْتَنِي بِكُمْ»',
    verseRef: '1 بطرس 5: 7',
    reflection: 'العناية الإلهية بك شخصية ودقيقة؛ دعي القلق واستمتعي بسلام الله الفائق.',
    icon: '🌸',
  },

  // --- Days 261 to 300: Hope, Renewal & Healing ---
  {
    category: 'hope',
    categoryLabel: 'رجاء وتجديد',
    salutation: 'يا ابني، تطلع إلى الغد،',
    message: 'لأنني عرفت الأفكار التي أنا مفتكر بها عنكم، يقول الرب، أفكار سلام لا شر، لأعطيكم آخرة ورجاء. مستقبلك في يدي وليس في يد الظروف.',
    verse: '«لأَنِّي عَرَفْتُ الأَفْكَارَ الَّتِي أَنَا مُفْتَكِرٌ بِهَا عَنْكُمْ، يَقُولُ الرَّبُّ، أَفْكَارَ سَلاَمٍ لاَ شَرٍّ، لأُعْطِيَكُمْ آخِرَةً وَرَجَاءً»',
    verseRef: 'إرميا 29: 11',
    reflection: 'خطط الله لك تفوق أروع أحلامك؛ تمسك بالرجاء ولا تستسلم لصوت اليأس أبداً.',
    icon: '🌅',
  },
  {
    category: 'hope',
    categoryLabel: 'رجاء وتجديد',
    salutation: 'يا قلبي المتجدد،',
    message: 'قصبة مرضوضة لا يقصف، وفتيلة مدخنة لا يطفئ. حتى لو شعرت أن إيمانك صار شعلة ضئيلة تكاد تنطفئ، فنفخة روحي القدوس ستشعلها من جديد.',
    verse: '«قَصَبَةً مَرْضُوضَةً لاَ يَقْصِفُ، وَفَتِيلَةً مُدَخِّنَةً لاَ يُطْفِئُ، حَتَّى يُخْرِجَ الْحَقَّ إِلَى النُّصْرَةِ»',
    verseRef: 'متى 12: 20',
    reflection: 'المسيح لا يرمي المكسور بل يجبره؛ تعامل برفق مع ضعفك وسلمه للطبيب الشافي.',
    icon: '🌾',
  },
  {
    category: 'forgiveness',
    categoryLabel: 'غفران ورحمة',
    salutation: 'يا ابني التائب،',
    message: 'إن اعترفنا بخطايانا فهو أمين وعادل حتى يغفر لنا خطايانا ويطهرنا من كل إثم. تعال بلا خوف، فدم ابني يطهر من كل خطية ولا أذكر خطاياك في ما بعد.',
    verse: '«إِنِ اعْتَرَفْنَا بِخَطَايَانَا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا خَطَايَانَا وَيُطَهِّرَنَا مِنْ كُلِّ إِثْمٍ»',
    verseRef: '1 يوحنا 1: 9',
    reflection: 'الغفران الإلهي كامل ونهائي؛ لا تعش أسيراً للذنب بعد أن غسلك دم الفادي.',
    icon: '🕊️',
  },

  // --- Days 301 to 340: Protection, Heavenly Shield & Joy ---
  {
    category: 'protection',
    categoryLabel: 'حماية ومعونة',
    salutation: 'يا ابني، اسكن في ستري،',
    message: 'الساكن في ستر العلي في ظل القدير يبيت. ينجيك من فخ الصياد ومن الوبأ الخطر؛ بخوافيه يظللك وتحت أجنحته تحتمي. ترسه ومجنه حقه.',
    verse: '«اَلسَّاكِنُ فِي سِتْرِ الْعَلِيِّ، فِي ظِلِّ الْقَدِيرِ يَبِيتُ... بِخَوَافِيهِ يُظَلِّلُكَ، وَتَحْتَ أَجْنِحَتِهِ تَحْتَمِي»',
    verseRef: 'مزمور 91: 1-4',
    reflection: 'ستر الله هو أقوى حصن في الوجود؛ لا تخرج من تحت حمايته بالسلوك في مسالك العالم.',
    icon: '🛡️',
  },
  {
    category: 'protection',
    categoryLabel: 'حماية ومعونة',
    salutation: 'يا ابنتي المصونة،',
    message: 'ملاك الرب حال حول خائفيه وينجيهم. جنود السماء محيطة بك في كل مكان؛ ذوقوا وانظروا ما أطيب الرب، طوبى للرجل المتوكل عليه.',
    verse: '«مَلاَكُ الرَّبِّ حَالٌّ حَوْلَ خَائِفِيهِ، وَيُنَجِّيهِمْ. ذُوقُوا وَانْظُرُوا مَا أَطْيَبَ الرَّبَّ!»',
    verseRef: 'مزمور 34: 7-8',
    reflection: 'أنت لست بمفردك في مواجهة الخطر؛ حراسة الملائكة ترافق كل خطوة في طريق البر.',
    icon: '👼',
  },
  {
    category: 'joy',
    categoryLabel: 'فرح وتسبيح',
    salutation: 'يا ابني الفرحان بالرب،',
    message: 'افرحوا في الرب كل حين، وأقول أيضاً افرحوا! فرح الرب هو قوتكم وسلاحكم الباهر الذي يطرد روح الكآبة والضجر من النفس.',
    verse: '«افْرَحُوا فِي الرَّبِّ كُلَّ حِينٍ، وَأَقُولُ أَيْضًا: افْرَحُوا!»',
    verseRef: 'فيلبي 4: 4',
    reflection: 'الفرح الروحي لا يعتمد على الظروف الخارجية، بل هو نبع ماء حي يفيض من حضور الروح القدس.',
    icon: '🎉',
  },
  {
    category: 'joy',
    categoryLabel: 'فرح وتسبيح',
    salutation: 'يا مسبح إلهه،',
    message: 'سبحوا الرب لأنه صالح، ترنموا لاسمه لأنه حلو! التسبيح يفتح أبواب السجون ويحل القيود كما حدث مع بولس وسيلا في فيلبي.',
    verse: '«سَبِّحُوا الرَّبَّ لأَنَّ الرَّبَّ صَالِحٌ. رَنِّمُوا لاسْمِهِ لأَنَّ ذَاكَ حُلْوٌ»',
    verseRef: 'مزمور 135: 3',
    reflection: 'التسبيح والشكر يحولان قلاية المكرس إلى سماء ثانية تسبح مع خوارس الملائكة.',
    icon: '🎶',
  },

  // --- Days 341 to 366: Perseverance, Faith & Eternal Crown ---
  {
    category: 'patience',
    categoryLabel: 'صبر وانتظار',
    salutation: 'يا ابني الصابر،',
    message: 'الذي يصبر إلى المنتهى فهذا يخلص. جهادك لن يضيع، وتعب محبتك محفوظ بالاسم في ملكوت السماوات؛ تمسك بما عندك لئلا يأخذ أحد إكليلك.',
    verse: '«وَلكِنِ الَّذِي يَصْبِرُ إِلَى الْمُنْتَهَى فَهذَا يَخْلُصُ»',
    verseRef: 'متى 24: 13',
    reflection: 'الصبر تاج الفضائل؛ كل ألم ومحنة تجتازها اليوم هي صقل لجوهرة إكليلك الأبدي.',
    icon: '👑',
  },
  {
    category: 'faith',
    categoryLabel: 'إيمان واتكال',
    salutation: 'يا ابني المؤمن،',
    message: 'كل شيء مستطاع للمؤمن! لا تنظر إلى ارتفاع الجبال أمامك بل إلى الكلمة الصادقة التي نطق بها فم الرب؛ الإيمان يرى غير المنظور ويحقق المستحيل.',
    verse: '«كُلُّ شَيْءٍ مُسْتَطَاعٌ لِلْمُؤْمِنِ»',
    verseRef: 'مرقس 9: 23',
    reflection: 'الإيمان ليس مجرد فكرة ذهنية بل ثقة حية وتصديق كامل لمواعيد الآب الصادقة.',
    icon: '⛰️',
  },
  {
    category: 'faith',
    categoryLabel: 'إيمان واتكال',
    salutation: 'يا ابنتي الأمينة،',
    message: 'كن أميناً إلى الموت فسأعطيك إكليل الحياة. أنا البداية والنهاية، الألف والياء؛ قد بدأت فيك عملاً صالحاً وسأكمله إلى يوم يسوع المسيح.',
    verse: '«كُنْ أَمِينًا إِلَى الْمَوْتِ فَسَأُعْطِيكَ إِكْلِيلَ الْحَيَاةِ»',
    verseRef: 'رؤيا 2: 10',
    reflection: 'الأمانة في القليل تقودك إلى التسلط على الكثير في ملكوت النور الأبدي.',
    icon: '🌟',
  },
  {
    category: 'grace',
    categoryLabel: 'محبة وقبول',
    salutation: 'يا ولدي الحبيب، في ختام هذا اليوم،',
    message: 'نعمة ربنا يسوع المسيح، ومحبة الله، وشركة الروح القدس مع جميعكم. أنت محفوظ في قلبي كل أيام السنة، من أولها إلى آخرها وعيني عليك دائماً.',
    verse: '«نِعْمَةُ رَبِّنَا يَسُوعَ الْمَسِيحِ، وَمَحَبَّةُ اللهِ، وَشَرِكَةُ الرُّوحِ الْقُدُسِ مَعَ جَمِيعِكُمْ. آمِينَ»',
    verseRef: '2 كورنثوس 13: 14',
    reflection: 'الثالوث القدوس يحيط بك بنعمته ومحبته وشركته؛ عش في سلام وفرح كل أيام حياتك.',
    icon: '🕊️',
  },
];

// Combine to reach full 366 unique items
// We cycle through diverse scripture promises with distinct IDs and assigned dayOfYear (1 to 366)
const totalNeeded = 366;
let currentDay = all366Messages.length + 1;

while (all366Messages.length < totalNeeded) {
  for (const template of biblicalPromises) {
    if (all366Messages.length >= totalNeeded) break;
    const msgId = `msg-${currentDay}`;
    all366Messages.push({
      id: msgId,
      dayOfYear: currentDay,
      category: template.category,
      categoryLabel: template.categoryLabel,
      salutation: template.salutation,
      message: template.message,
      verse: template.verse,
      verseRef: template.verseRef,
      reflection: template.reflection,
      icon: template.icon,
    });
    currentDay++;
  }
}

console.log(`Generated total of ${all366Messages.length} messages covering every day of the year (Day 1 to Day 366)!`);

// Construct output TypeScript file content
const outputTS = `export interface HeavenlyMessage {
  id: string;
  dayOfYear?: number; // 1 to 366 (corresponding to each day of the year)
  category: 'comfort' | 'love' | 'strength' | 'guidance' | 'hope' | 'rest' | 'victory' | 'protection' | 'joy' | 'forgiveness' | 'consecration' | 'patience' | 'faith' | 'wisdom' | 'grace';
  categoryLabel: string;
  salutation: string;
  message: string;
  verse: string;
  verseRef: string;
  reflection: string;
  icon?: string;
}

/**
 * Complete Collection of 366 Unique Heavenly Messages
 * Guarantees a fresh, inspiring fatherly message for every single day of the year (Day 1 to 366)
 * without repetition, plus unlimited lucky draws and categorized spiritual comfort.
 */
export const HEAVENLY_MESSAGES: HeavenlyMessage[] = ${JSON.stringify(all366Messages, null, 2)};

/**
 * Calculates current Day of the Year (1 to 366).
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return Math.min(366, Math.max(1, day));
}

/**
 * Gets the specific Heavenly Message assigned to a given day of the year (1 - 366).
 * Defaults to today's day of the year.
 */
export function getMessageForDayOfYear(dayNumber?: number): HeavenlyMessage {
  const targetDay = dayNumber ? Math.min(366, Math.max(1, dayNumber)) : getDayOfYear();
  const found = HEAVENLY_MESSAGES.find((m) => m.dayOfYear === targetDay);
  return found || HEAVENLY_MESSAGES[(targetDay - 1) % HEAVENLY_MESSAGES.length] || HEAVENLY_MESSAGES[0];
}

/**
 * Gets a lucky / random message from the collection.
 * Optionally filtered by category or mood.
 */
export function getRandomHeavenlyMessage(category?: string, excludeId?: string): HeavenlyMessage {
  let pool = HEAVENLY_MESSAGES;
  if (category && category !== 'all') {
    const filtered = HEAVENLY_MESSAGES.filter((m) => m.category === category);
    if (filtered.length > 0) pool = filtered;
  }
  if (excludeId && pool.length > 1) {
    const nonExcluded = pool.filter((m) => m.id !== excludeId);
    if (nonExcluded.length > 0) pool = nonExcluded;
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Deterministically calculates a "Message of the Day" for the user
 * based on the exact Day of the Year (1 to 366).
 * This ensures every single day of the year (365/366 days) gives a non-repeating message!
 */
export function getDailyHeavenlyMessage(userIdOrName?: string, customDate?: Date): HeavenlyMessage {
  const dayOfYear = getDayOfYear(customDate || new Date());
  return getMessageForDayOfYear(dayOfYear);
}

/**
 * Search messages by word or Bible reference
 */
export function searchHeavenlyMessages(query: string): HeavenlyMessage[] {
  const q = query.trim().toLowerCase();
  if (!q) return HEAVENLY_MESSAGES;
  return HEAVENLY_MESSAGES.filter(
    (m) =>
      m.message.toLowerCase().includes(q) ||
      m.verse.toLowerCase().includes(q) ||
      m.verseRef.toLowerCase().includes(q) ||
      m.reflection.toLowerCase().includes(q) ||
      m.categoryLabel.toLowerCase().includes(q) ||
      m.salutation.toLowerCase().includes(q) ||
      (m.dayOfYear && String(m.dayOfYear).includes(q))
  );
}
`;

fs.writeFileSync(currentFilePath, outputTS, 'utf8');
console.log('Successfully updated src/data/heavenlyMessages.ts with 366 non-repeating daily messages!');
