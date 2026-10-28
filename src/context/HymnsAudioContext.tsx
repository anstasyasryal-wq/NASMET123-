import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { startAmbientMusic, type AmbientMusicHandle } from '../utils/ambientMusic';
import { playHymnFile } from '../utils/hymnFile';

const MUSIC_LEVEL = 1.2;

export interface HymnTrack {
  id: string;
  title: string;
  subtitle: string;
  durationSec: number;
  frequencies: number[]; // chord frequencies for ambient Web Audio synth
  waveform?: OscillatorType;
  filterFreq?: number;
  lyrics: string[];
  meditation: string;
  patristicQuote: string;
  patristicSaint: string;
  bibleVerse: string;
  bibleRef: string;
}

export interface SpiritualOccasion {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badge: string;
  description: string;
  tracks: HymnTrack[];
}

export const SPIRITUAL_OCCASIONS: SpiritualOccasion[] = [
  {
    id: 'closet_vigil',
    name: 'خلوة المخدع والسكون الليلي',
    shortName: 'سكون المخدع',
    icon: '🕯️',
    color: '#b45309',
    badge: 'سكون وهدوء',
    description: 'نغمات تأملية هادئة لصلوات المخدع وحراسة الحواس ومناجاة القلب باسم يسوع في هدوء الليل.',
    tracks: [
      {
        id: 'closet-1',
        title: 'في هدوء الليل وفي سكون المخدع',
        subtitle: 'مناجاة قلبية وترنيم هادئ للقاء الفادي في الخفاء',
        durationSec: 240,
        frequencies: [220, 277.18, 329.63, 440], // A Major contemplative
        waveform: 'sine',
        filterFreq: 480,
        lyrics: [
          'في هدوء الليل وفي سكون المخدع.. قلبي يناجيك يا فادي الوجود',
          'أغلق الباب عن ضجيج العالم.. وأفتح عينيّ على نورك المشهود',
          'يا ربي يسوع، املأ الفراغ بسلامك.. ولتكن صلاتي بخوراً صاعداً للأبد',
        ],
        meditation: '«حين يغلق المكرس باب مخدعه بإحكام، تتفتح أمامه أبواب أورشليم السمائية، ويتحول قلبه إلى هيكل مقدس يفيض بالسكينة».',
        patristicQuote: '«الصلاة في سكون الليل تزن أضعاف الصلوات النهارية، لأن النفس فيها تتجرد من هموم النهار وتنفرد بالحبيب وحده».',
        patristicSaint: 'مار إسحق السرياني',
        bibleVerse: '«وَأَمَّا أَنْتَ فَمَتَى صَلَّيْتَ فَادْخُلْ إِلَى مِخْدَعِكَ وَأَغْلِقْ بَابَكَ، وَصَلِّ إِلَى أَبِيكَ الَّذِي فِي الْخَفَاءِ».',
        bibleRef: 'متى 6: 6',
      },
      {
        id: 'closet-2',
        title: 'أنتِ هي سور خلاصنا يا والدة الإله',
        subtitle: 'لحن التضرع وحفظ الحواس ضد سهام العدو وتشتت الفكر',
        durationSec: 270,
        frequencies: [196, 246.94, 293.66, 392], // G Major serene
        waveform: 'triangle',
        filterFreq: 520,
        lyrics: [
          'أنتِ هي سور خلاصنا الحصين.. وميناء النجاة لكل حائر مسكين',
          'بددي عن عقولنا غيوم التشتت.. وثبتي قلوبنا في محبة ابنك الأمين',
        ],
        meditation: '«شفاعة العذراء وسيرتها العطرة في الصمت والهدوء هي النموذج الأسمى لكل نفس نذرت ذاتها لخدمة الملك».',
        patristicQuote: '«صمت مريم وتأملها في كلام الرب في قلبها هو برهان القداسة والامتلاء من الروح القدس».',
        patristicSaint: 'القديس أثناسيوس الرسولي',
        bibleVerse: '«وَأَمَّا مَرْيَمُ فَكَانَتْ تَحْفَظُ جَمِيعَ هذَا الْكَلاَمِ مُتَفَكِّرَةً بِهِ فِي قَلْبِهَا».',
        bibleRef: 'لوقا 2: 19',
      },
      {
        id: 'closet-3',
        title: 'مزمور 63: يا الله إلهي إليك أبكر',
        subtitle: 'ترتيل داوودي هادئ لاشتياق النفس وشبعها في حضن النعمة',
        durationSec: 210,
        frequencies: [261.63, 329.63, 392, 523.25], // C Major pure
        waveform: 'sine',
        filterFreq: 600,
        lyrics: [
          'يا الله إلهي إليك أبكر.. عطشت إليك نفسي كأرض قاحلة',
          'شبعت نفسي كما من شحم ودسم.. وبشفاه الابتهاج يسبحك لساني',
        ],
        meditation: '«المزامير هي مرآة النفس؛ فيها تبكي التوبة، وفيها يترنم الرجاء، وفيها يستقر القلب في حضن الله».',
        patristicQuote: '«ترتيل المزامير يهدئ هياج الأفكار، وينعش الروح بالتعزيات الإلهية التي لا تزول».',
        patristicSaint: 'القديس باسيليوس الكبير',
        bibleVerse: '«إِذَا ذَكَرْتُكَ عَلَى فِرَاشِي، فِي السُّهُدِ أَلْهَجُ بِكَ».',
        bibleRef: 'مزمور 63: 6',
      },
      {
        id: 'closet-4',
        title: 'أنغام صلاة يسوع الدائمة (كيرياليسون الهادئة)',
        subtitle: 'ترديد الاسم القدوس مع خفقات القلب وسكون النفس',
        durationSec: 300,
        frequencies: [174.61, 220, 261.63, 349.23], // F Major deep
        waveform: 'sine',
        filterFreq: 400,
        lyrics: [
          'يا ربي يسوع المسيح، ابن الله الحي.. ارحمني أنا الخاطئ',
          'اسمك دهن مهراق.. نور في الظلمات.. ومحيي القلوب المنسحقة',
        ],
        meditation: '«اسم يسوع هو السلاح الذي لا يقهر؛ ردد الاسم القدوس بوعي واتضاع حتى يدخل من لسانك إلى عقلك، ومن عقلك إلى قلبك».',
        patristicQuote: '«اضرب الأعداء غير المنظورين باسم يسوع، فليس في السماء ولا على الأرض سلاح أمضى منه».',
        patristicSaint: 'القديس يوحنا الدرجي',
        bibleVerse: '«لِكَيْ تَجْثُوَ بِاسْمِ يَسُوعَ كُلُّ رُكْبَةٍ مِمَّنْ فِي السَّمَاءِ وَمَنْ عَلَى الأَرْضِ».',
        bibleRef: 'فيلبي 2: 10',
      },
    ],
  },
  {
    id: 'great_lent',
    name: 'الصوم الكبير ومطانيات التوبة',
    shortName: 'الصوم والتوبة',
    icon: '🌾',
    color: '#7f1d1d',
    badge: 'خشوع وانسحاق',
    description: 'ألحان خاشعة ومطانيات تذلل وانسحاق القلب أمام الصليب لاستعادة حرارة المحبة الأولى ونقاوة القصد.',
    tracks: [
      {
        id: 'lent-1',
        title: 'يا نفسي توبي وارجعي قبل انقضاء الأيام',
        subtitle: 'ترنيمة انسحاق وتأمل في انقضاء الزمان وسرعة مرور العمر',
        durationSec: 250,
        frequencies: [146.83, 174.61, 220, 293.66], // D Minor Phrygian
        waveform: 'triangle',
        filterFreq: 380,
        lyrics: [
          'يا نفسي توبي وارجعي.. قبل فوات الأوان',
          'المسيح واقف يقرع الباب.. يطلب قلباً وديعاً مليان حنان',
          'لا تقولي غداً أتوب.. فالغد ليس بيدك بل في يد الديان',
        ],
        meditation: '«التوبة ليست يوماً في العام، بل هي نبض حياة المكرس المستمر وتنفس الروح التي تطلب وجه الله دائماً».',
        patristicQuote: '«دموع التوبة الصامتة في المخدع تغسل صدأ السنين، وتعيد للنفس بهاء الثوب الأبيض الذي نالته في المعمودية».',
        patristicSaint: 'القديس يوحنا ذهبي الفم',
        bibleVerse: '«ارْجِعُوا إِلَيَّ بِكُلِّ قُلُوبِكُمْ، وَبِالصَّوْمِ وَالْبُكَاءِ وَالنَّوْحِ».',
        bibleRef: 'يوئيل 2: 12',
      },
      {
        id: 'lent-2',
        title: 'مزمور 50: ارحمني يا الله كعظيم رحمتك',
        subtitle: 'ترتيل توبة داود النبي بانسحاق ودموع الرجاء المعزي',
        durationSec: 280,
        frequencies: [164.81, 196, 246.94, 329.63], // E Minor solemn
        waveform: 'sine',
        filterFreq: 420,
        lyrics: [
          'قلباً نقياً اخلق فيّ يا الله.. وروحاً مستقيماً جدد في داخلي',
          'لا تطرحني من قدام وجهك.. وروحك القدوس لا تنزعه مني',
          'ذبيحة الله هي روح منكسرة.. القلب المنكسر والمنسحق لا يرذله الله',
        ],
        meditation: '«القلب المنكسر ليس قلباً محطماً باليأس، بل هو قلب انكسر كبرياؤه ليدخل إليه نور النعمة الشافي».',
        patristicQuote: '«حيث يوجد التواضع والانسحاق، هناك يفيض ينبوع الرحمة والغفران».',
        patristicSaint: 'القديس أنطونيوس الكبير',
        bibleVerse: '«الْقَلْبُ الْمُنْكَسِرُ وَالْمُنْسَحِقُ يَا اَللهُ لاَ تَحْتَقِرُهُ».',
        bibleRef: 'مزمور 51: 17',
      },
      {
        id: 'lent-3',
        title: 'لحن ني ساووف الحزايني (أرباع الصوم المقدس)',
        subtitle: 'ألحان الصوم الكبير الكنسية العريقة للتأمل والسكينة',
        durationSec: 320,
        frequencies: [130.81, 164.81, 196, 261.63], // C Minor depth
        waveform: 'triangle',
        filterFreq: 350,
        lyrics: [
          'طوبى للرحماء على المساكين.. فإن الرحمة تحل عليهم',
          'صوموا صوماً حقيقياً.. صوموا عن الشر والخصام والبغضاء',
        ],
        meditation: '«الصوم الحقيقي هو صوم اللسان عن الإدانة، وصوم العين عن الفضول، وصوم الفكر عن الكبرياء».',
        patristicQuote: '«لا تجعل صومك مجرد حرمان من الطعام، بل حرر نفسك من ثقل الخطية والتعلق بالأرضيات».',
        patristicSaint: 'مار إفرام السرياني',
        bibleVerse: '«أَلَيْسَ هذَا صَوْمًا أَخْتَارُهُ: حَلَّ قُيُودِ الشَّرِّ. فَكَّ عُقَدِ النِّيرِ، وَإِطْلاَقَ الْمَنْسَحِقِينَ أَحْرَارًا؟».',
        bibleRef: 'إشعياء 58: 6',
      },
    ],
  },
  {
    id: 'resurrection',
    name: 'أفراح القيامة والخماسين المقدسة',
    shortName: 'القيامة والفرح',
    icon: '🕊️',
    color: '#047857',
    badge: 'انتصار ونور',
    description: 'أناشيد الفرح الفصحي والانتصار على الموت وسلطان الهاوية، وتبديد ظلمة اليأس بنور القبر الفارغ.',
    tracks: [
      {
        id: 'res-1',
        title: 'لحن إخرستوس آنيستي (المسيح قام بالحقيقة قام)',
        subtitle: 'اللحن الخالد لنصرة الحياة على الموت وابتلاع الهلاك',
        durationSec: 230,
        frequencies: [261.63, 329.63, 392, 523.25], // C Major bright
        waveform: 'sine',
        filterFreq: 750,
        lyrics: [
          'المسيح قام من بين الأموات.. ووطئ الموت بالموت',
          'ووهب الحياة للذين في القبور.. هللويا هللويا',
        ],
        meditation: '«قيامة المسيح ليست حدثاً تاريخياً ماضياً، بل هي قوة حاضرة في قلب المكرس تخرجه من كل يأس وفتور إلى نصرة لا تغلب».',
        patristicQuote: '«أين شوكتك يا موت؟ أين غلبتك يا هاوية؟ قام المسيح وسقطت الشياطين، قام المسيح والحياة تسود».',
        patristicSaint: 'القديس يوحنا ذهبي الفم',
        bibleVerse: '«أَيْنَ شَوْكَتُكَ يَا مَوْتُ؟ أَيْنَ غَلَبَتُكِ يَا هَاوِيَةُ؟ وَلكِنْ شُكْرًا للهِ الَّذِي يُعْطِينَا الْغَلَبَةَ بِرَبِّنَا يَسُوعَ الْمَسِيحِ».',
        bibleRef: '1 كورنثوس 15: 55-57',
      },
      {
        id: 'res-2',
        title: 'ترنيمة قام المسيح هازماً الظلام',
        subtitle: 'ترتيل بهيج يملأ القلب بنور الفرح الأبدي والرجاء الحي',
        durationSec: 260,
        frequencies: [293.66, 369.99, 440, 587.33], // D Major joyful
        waveform: 'triangle',
        filterFreq: 800,
        lyrics: [
          'قام المسيح ونور الفجر أشرق.. أضاء ظلمات قلوبنا وبدد الشكوك',
          'يا نفوس الباكين افرحوا وابتهجوا.. ففادينا حي جالس عن يمين الآب',
        ],
        meditation: '«من اختبر قوة القيامة في مخدعه، لا تقدر أثقال الأرض ولا آلام التجارب أن تسلبه سلامه الداخلي».',
        patristicQuote: '«فرح القيامة هو خمر العرس السماوي، الذي يسكر به القديسون في جهادهم على الأرض».',
        patristicSaint: 'القديس كيرلس الكبير',
        bibleVerse: '«مُبَارَكٌ اللهُ أَبُو رَبِّنَا يَسُوعَ الْمَسِيحِ، الَّذِي حَسَبَ رَحْمَتِهِ الْكَثِيرَةِ وَلَدَنَا ثَانِيَةً لِرَجَاءٍ حَيٍّ، بِقِيَامَةِ يَسُوعَ الْمَسِيحِ مِنَ الأَمْوَاتِ».',
        bibleRef: '1 بطرس 1: 3',
      },
      {
        id: 'res-3',
        title: 'لحن يا كل الصفوف السمائيين رتلوا بابتهاج',
        subtitle: 'تسبحة الخماسين وابتهاج الطغمات الملائكية بفداء البشرية',
        durationSec: 290,
        frequencies: [220, 277.18, 329.63, 440], // A Major celestial
        waveform: 'sine',
        filterFreq: 850,
        lyrics: [
          'يا كل الصفوف السمائيين رتلوا لإلهنا بنغمات التسبيح.. وابتهجوا معنا اليوم بفرح القيامة المجيدة',
        ],
        meditation: '«في التسبيح الكنسي تتحد كنيسة الأرض المجاهدة بكنيسة السماء المنتصرة في كورال واحد لا ينقطع».',
        patristicQuote: '«التسبيح هو عمل الملائكة، ومن يسبح الله بفرح نقي يشترك معهم في طبيعة خدمتهم السماوية».',
        patristicSaint: 'القديس غريغوريوس الثيؤلوغوس',
        bibleVerse: '«سَبِّحُوا الرَّبَّ مِنَ السَّمَاوَاتِ. سَبِّحُوهُ فِي الأَعَالِي. سَبِّحُوهُ يَا جَمِيعَ مَلاَئِكَتِهِ».',
        bibleRef: 'مزمور 148: 1-2',
      },
    ],
  },
  {
    id: 'consecration',
    name: 'مناسبة التكريس ونذر ال��لب',
    shortName: 'عهد التكريس',
    icon: '✝️',
    color: '#be185d',
    badge: 'ذبيحة حب',
    description: 'ترانيم تكريس الإرادة وبذل الذات والتجرد الإنجيلي ليكون قلب المكرس ملكاً خالصاً لله ومقدساً لاسمه.',
    tracks: [
      {
        id: 'cons-1',
        title: 'مع المسيح صلبت فأحيا لا أنا',
        subtitle: 'شعار ودستور حياة التكريس الإنجيلي الحي والموت عن العالم',
        durationSec: 260,
        frequencies: [220, 261.63, 329.63, 440], // A Minor / Doric
        waveform: 'triangle',
        filterFreq: 500,
        lyrics: [
          'م�� المسيح صلبت فأحيا.. لا أنا بل المسيح يحيا فيّ',
          'ما عشت في الجسد أعيشه بالإيمان.. إيمان ابن الله الذي أحبني وأسلم نفسه لأجلي',
          'يا ربي خذ عمري.. واجعله نذراً مكرساً لمجد اسمك القدوس',
        ],
        meditation: '«التكريس ليس وظيفة ولا رتبة شرفية؛ التكريس هو ذبح الأنانية اليومي ليحيا المسيح في كل فكرة وكلمة وعمل».',
        patristicQuote: '«المكرس الحقيقي هو قربان حي موضوع على المذبح؛ لا يملك من أمره شيئاً، لأن سيده هو كل شيء بالنسبة له».',
        patristicSaint: 'القديس أغسطينوس الهيبوني',
        bibleVerse: '«مَعَ الْمَسِيحِ صُلِبْتُ، فَأَحْيَا لاَ أَنَا، بَلِ الْمَسِيحُ يَحْيَا فِيَّ».',
        bibleRef: 'غلاطية 2: 20',
      },
      {
        id: 'cons-2',
        title: 'كرست عمري لك ربي فخذه ذبيحة حب',
        subtitle: 'ترنيمة تسليم الإرادة والتنازل عن رغبات النفس لأجل راحة الفادي',
        durationSec: 280,
        frequencies: [196, 246.94, 293.66, 392], // G Major warm
        waveform: 'sine',
        filterFreq: 550,
        lyrics: [
          'كرست عمري لك ربي.. فخذه برضاك ذبيحة حب طاهرة',
          'يدي لك.. عيني لك.. فكري لك.. لا تترك فيّ موضعاً لغير حبك',
        ],
        meditation: '«حين تقدم لله حياتك بالكامل، يملأها بنعمته ويفيض منها أنهار ماء حي تروي النفوس العطشى من حولك».',
        patristicQuote: '«الذي يعطي الله كل شيء، يجد أن الله نفسه قد وهب له كل شيء وزيادة».',
        patristicSaint: 'مار إسحق السرياني',
        bibleVerse: '«أَنْ تُقَدِّمُوا أَجْسَادَكُمْ ذَبِيحَةً حَيَّةً مُقَدَّسَةً مَرْضِيَّةً عِنْدَ اللهِ، عِبَادَتَكُمُ الْعَقْلِيَّةَ».',
        bibleRef: 'رومية 12: 1',
      },
      {
        id: 'cons-3',
        title: 'يا صاحب الحنان يا ملجأ المكرسين',
        subtitle: 'مناجاة تسليم الضعف البشري للأذرع الإلهية القادرة على الحفظ',
        durationSec: 250,
        frequencies: [174.61, 220, 261.63, 349.23], // F Major tender
        waveform: 'sine',
        filterFreq: 480,
        lyrics: [
          'يا صاحب الحنان.. يا ملجأ الضعفاء والمكرسين',
          'إن تعبت أقدامنا في الطريق.. فاحملنا على منكبيك الحنونين',
        ],
        meditation: '«ليس المكرس من لا يسقط أبداً، بل هو من متى تعثر يقوم سريعاً متكئاً على صدر الحبيب».',
        patristicQuote: '«لا تخف من ضعفك ما دمت تسير ممسكاً بيد المسيح؛ فالنعمة تكمل في الضعف».',
        patristicSaint: 'القديس مقاريوس الكبير',
        bibleVerse: '«تَكْفِيكَ نِعْمَتِي، لأَنَّ قُوَّتِي فِي الضَّعْفِ تُكْمَلُ».',
        bibleRef: '2 كورنثوس 12: 9',
      },
    ],
  },
  {
    id: 'kiahk_praises',
    name: 'تسابيح كيهك والسيدة العذراء',
    shortName: 'تسابيح كيهك',
    icon: '👑',
    color: '#4338ca',
    badge: 'سماويات ومريميات',
    description: 'مدائح التجسد الإلهي ورموز خيمة الاجتماع وفضائل والدة الإله في التراث الكنسي الآبائي الأصيل.',
    tracks: [
      {
        id: 'kiahk-1',
        title: 'لحن تين أوأوشت إمفيوت (نسجد للآب والابن)',
        subtitle: 'افتتاحية التسبحة الكيهكية العذبة وانسكاب العبادة الثالوثية',
        durationSec: 270,
        frequencies: [220, 277.18, 329.63, 440], // A Major majestic
        waveform: 'sine',
        filterFreq: 680,
        lyrics: [
          'نسجد للآب والابن والروح القدس الثالوث القدوس المساوي.. السلام للكنيسة بيت الملائكة',
        ],
        meditation: '«في ليالي كيهك الباردة تلتهب القلوب بنار المحبة الإلهية، متأملة في سر الإخلاء والتجسد العجيب».',
        patristicQuote: '«التجسد هو سر محبة الله الفائقة؛ فقد انحنت السماء لتلثم الأرض، وتنازل الخالق ليخلص المخلوق».',
        patristicSaint: 'القديس كيرلس الإسكندري',
        bibleVerse: '«وَالْكَلِمَةُ صَارَ جَسَدًا وَحَلَّ بَيْنَنَا، وَرَأَيْنَا مَجْدَهُ».',
        bibleRef: 'يوحنا 1: 14',
      },
      {
        id: 'kiahk-2',
        title: 'ترنيمة يا مريم البكر فقت الشمس والقمرا',
        subtitle: 'مدائح مريمية رقيقة تتغنى باتضاع أم النور وعلو قامتها',
        durationSec: 290,
        frequencies: [261.63, 329.63, 392, 523.25], // C Major serene
        waveform: 'triangle',
        filterFreq: 700,
        lyrics: [
          'يا مريم البكر فقت الشمس والقمرا.. وكل كواكب السماء حارت في بهاك',
          'طوباك يا فخر جنسنا ويا رجاءنا.. صلي لأجلنا أمام عرش فاديك وابنك',
        ],
        meditation: '«عظمة العذراء لم تكن في المظاهر، بل في عمق اتضاعها وقبولها لمشيئة الله: هوذا أنا أمة الرب».',
        patristicQuote: '«العذراء مريم هي سماء ثانية على الأرض، حملت في أحشائها من لا تسعه السماوات».',
        patristicSaint: 'القديس يعقوب السروجي',
        bibleVerse: '«هُوَذَا مُنْذُ الآنَ جَمِيعُ الأَجْيَالِ تُطَوِّبُنِي».',
        bibleRef: 'لوقا 1: 48',
      },
    ],
  },
  {
    id: 'consolation',
    name: 'الشكر والتعزية في أوقات الضيقة',
    shortName: 'التعزية والرجاء',
    icon: '🛡️',
    color: '#0f766e',
    badge: 'سلام وطمأنينة',
    description: 'طمأنينة السلام الفائق وحصن النفس في وسط عواصف التجارب، والاتكال التام على ذراع الفادي القدير.',
    tracks: [
      {
        id: 'cons-ref-1',
        title: 'ترنيمة لا تخف لأني معك لا تتلفت',
        subtitle: 'صوت الوعد الإلهي بالمعونة والحفظ وسط الضيقات والحروب',
        durationSec: 250,
        frequencies: [196, 246.94, 293.66, 392], // G Major comforting
        waveform: 'sine',
        filterFreq: 500,
        lyrics: [
          'لا تخف لأني معك.. لا تتلفت لأني إلهك',
          'قد أيدتك وأعنتك.. وعضدتك بيمين بري الأمين',
          'مهما تلاطمت الأمواج وعلت الرياح.. فسفينتك في يدي لا تغرق أبداً',
        ],
        meditation: '«في قارب التجربة قد يبدو المسيح نائماً في مؤخرة السفينة، لكنه بسلطانه يأمر الريح فتهدأ ويسود هدوء عظيم».',
        patristicQuote: '«لا تجعل الضيقة تبعدك عن المصلوب، بل اجعلها الحبل الذي يوثقك بصليبه المحيي».',
        patristicSaint: 'القديس يوحنا الدرجي',
        bibleVerse: '«لاَ تَخَفْ لأَنِّي مَعَكَ. لاَ تَتَلَفَّتْ لأَنِّي إِلهُكَ. قَدْ أَيَّدْتُكَ وَأَعَنْتُكَ وَعَضَدْتُكَ بِيَمِينِ بِرِّي».',
        bibleRef: 'إشعياء 41: 10',
      },
      {
        id: 'cons-ref-2',
        title: 'ترنيمة سلامي أترك لكم سلامي أعطيكم',
        subtitle: 'سكيب السلام الإلهي الذي يفوق كل عقل بشري في هدوء القلب',
        durationSec: 270,
        frequencies: [174.61, 220, 261.63, 349.23], // F Major tranquil
        waveform: 'sine',
        filterFreq: 450,
        lyrics: [
          'سلامي أترك لكم.. سلامي أعطيكم.. ليس كما يعطي العالم أعطيكم أنا',
          'لا تضطرب قلوبكم ولا ترهب.. أنا غلبت العالم وأنتم غالبون بي',
        ],
        meditation: '«السلام ليس غياب المشاكل، بل هو حضور الله في وسط المشاكل كشمس تدفئ برد النفس».',
        patristicQuote: '«اقتنِ السلام في قلبك، تجد أن آلافاً من حولك يخلصون بسلامك الداخلي».',
        patristicSaint: 'القديس سيرافيم ساروفسكي',
        bibleVerse: '«وَسَلاَمُ اللهِ الَّذِي يَفُوقُ كُلَّ ��َقْل، يَحْفَظُ قُلُوبَكُمْ وَأَفْكَارَكُمْ فِي الْمَسِيحِ يَسُوعَ».',
        bibleRef: 'فيلبي 4: 7',
      },
    ],
  },
];

interface HymnsAudioContextType {
  currentOccasion: SpiritualOccasion;
  currentTrack: HymnTrack;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isPlayerModalOpen: boolean;
  isDockMinimized: boolean;
  showLyrics: boolean;
  setOccasionById: (id: string) => void;
  playTrack: (track: HymnTrack) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  seek: (seconds: number) => void;
  openPlayerModal: () => void;
  closePlayerModal: () => void;
  toggleDockMinimized: () => void;
  toggleShowLyrics: () => void;
}

const HymnsAudioContext = createContext<HymnsAudioContextType | undefined>(undefined);

export const HymnsAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOccasionIndex, setCurrentOccasionIndex] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.35);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState<boolean>(false);
  const [isDockMinimized, setIsDockMinimized] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : true;
  });
  const [showLyrics, setShowLyrics] = useState<boolean>(false);

  // Audio Context & nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<AmbientMusicHandle | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const nextTrackRef = useRef<() => void>(() => {});
  const [usingFile, setUsingFile] = useState<boolean>(false);
  const [fileDuration, setFileDuration] = useState<number | null>(null);

  const currentOccasion = SPIRITUAL_OCCASIONS[currentOccasionIndex] || SPIRITUAL_OCCASIONS[0];
  const currentTrack = currentOccasion.tracks[currentTrackIndex] || currentOccasion.tracks[0];
  const duration = fileDuration ?? currentTrack.durationSec;

  const stopAudio = () => {
    musicRef.current?.stop();
    musicRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.removeAttribute('src');
      audioElRef.current.load();
      audioElRef.current = null;
    }
  };

  const startAudio = (track: HymnTrack, vol: number) => {
    stopAudio();
    setUsingFile(false);
    setFileDuration(null);

    const el = playHymnFile(track.id, isMuted ? 0 : vol, {
      onDuration: (s) => audioElRef.current === el && setFileDuration(s),
      onTime: (s) => audioElRef.current === el && setCurrentTime(s),
      onEnded: () => audioElRef.current === el && nextTrackRef.current(),
      onPlaying: () => audioElRef.current === el && setUsingFile(true),
      onBlocked: () => {
        if (audioElRef.current !== el) return;
        audioElRef.current = null;
        setIsPlaying(false);
      },
      onMissing: () => {
        if (audioElRef.current !== el) return;
        audioElRef.current = null;
        startSynthFallback(track, vol);
      },
    });
    audioElRef.current = el;
  };

  const startSynthFallback = (track: HymnTrack, vol: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (!gainNodeRef.current) {
        gainNodeRef.current = ctx.createGain();
        gainNodeRef.current.connect(ctx.destination);
      }
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : vol * MUSIC_LEVEL, ctx.currentTime);

      musicRef.current?.stop();
      musicRef.current = startAmbientMusic(ctx, gainNodeRef.current, {
        frequencies: track.frequencies,
        filterFreq: track.filterFreq,
        waveform: track.waveform,
        seed: track.id,
      });
    } catch (e) {
      console.warn('Audio start error:', e);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopAudio();
    } else {
      setIsPlaying(true);
      startAudio(currentTrack, volume);
    }
  };

  const playTrack = (track: HymnTrack) => {
    const idx = currentOccasion.tracks.findIndex((t) => t.id === track.id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
    setCurrentTime(0);
    setIsPlaying(true);
    startAudio(track, volume);
  };

  const setOccasionById = (occId: string) => {
    const idx = SPIRITUAL_OCCASIONS.findIndex((o) => o.id === occId);
    if (idx !== -1) {
      setCurrentOccasionIndex(idx);
      setCurrentTrackIndex(0);
      setCurrentTime(0);
      const nextOcc = SPIRITUAL_OCCASIONS[idx];
      if (isPlaying && nextOcc.tracks[0]) {
        startAudio(nextOcc.tracks[0], volume);
      }
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % currentOccasion.tracks.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentTime(0);
    const nextT = currentOccasion.tracks[nextIdx];
    if (isPlaying) {
      startAudio(nextT, volume);
    }
  };

  const prevTrack = () => {
    const prevIdx =
      (currentTrackIndex - 1 + currentOccasion.tracks.length) % currentOccasion.tracks.length;
    setCurrentTrackIndex(prevIdx);
    setCurrentTime(0);
    const prevT = currentOccasion.tracks[prevIdx];
    if (isPlaying) {
      startAudio(prevT, volume);
    }
  };

  nextTrackRef.current = nextTrack;

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (audioElRef.current) audioElRef.current.volume = isMuted ? 0 : v;
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : v * MUSIC_LEVEL,
        audioCtxRef.current.currentTime
      );
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioElRef.current) audioElRef.current.volume = next ? 0 : volume;
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          next ? 0 : volume * MUSIC_LEVEL,
          audioCtxRef.current.currentTime
        );
      }
      return next;
    });
  };

  const seek = (seconds: number) => {
    const target = Math.min(duration, Math.max(0, seconds));
    if (audioElRef.current) audioElRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Progress ticker (recorded files report their own time)
  useEffect(() => {
    if (isPlaying && !usingFile) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            nextTrackRef.current();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, usingFile, duration]);

  // MediaSession API integration for mobile lock screen & notification controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    try {
      if (currentTrack) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: `حسب قلب الله • ${currentOccasion.name}`,
          album: 'ألحان وترانيم وتأملات كنسية',
          artwork: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        });
      }

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      navigator.mediaSession.setActionHandler('play', () => {
        if (!isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        if (isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevTrack();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextTrack();
      });
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          seek(details.seekTime);
        }
      });
    } catch {
      // Quiet fail if browser restricts MediaSession
    }
  }, [currentTrack, currentOccasion, isPlaying]);

  // Clean on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <HymnsAudioContext.Provider
      value={{
        currentOccasion,
        currentTrack,
        isPlaying,
        volume,
        isMuted,
        currentTime,
        duration,
        isPlayerModalOpen,
        isDockMinimized,
        showLyrics,
        setOccasionById,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        toggleMute,
        seek,
        openPlayerModal: () => setIsPlayerModalOpen(true),
        closePlayerModal: () => setIsPlayerModalOpen(false),
        toggleDockMinimized: () => setIsDockMinimized((prev) => !prev),
        toggleShowLyrics: () => setShowLyrics((prev) => !prev),
      }}
    >
      {children}
    </HymnsAudioContext.Provider>
  );
};

export const useHymnsAudio = () => {
  const context = useContext(HymnsAudioContext);
  if (!context) {
    throw new Error('useHymnsAudio must be used within a HymnsAudioProvider');
  }
  return context;
};
