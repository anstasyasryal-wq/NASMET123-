import { WorldSecret, GrandSecretData, CipherProgress } from '../types/nesmaCipher';

// ... (existing content preserved)

export const NESMA_CIPHER_SECRETS: WorldSecret[] = [
  // =========================================================================
  // SECRET 1: ندى البدايات — حديقة البدايات
  // =========================================================================
  {
    id: 'secret_garden_dew',
    worldId: 'garden_of_beginnings',
    worldNameAr: 'حديقة البدايات',
    titleAr: 'سر ندى البدايات',
    icon: '💧',
    badgeSymbol: '💧🌿',
    discoveryConditionAr: 'انقشاع ضباب الحديقة بنسبة 40% (إتمام 4 مراحل على الأقل) وملاحظة بريق الندى عند ضفة الجدول.',
    minCompletedStages: 4,
    clueHintAr: 'على ضفة جدول الماء بعد انقشاع ضباب الصباح، تلمع إشارة رقيقة تعلوها قطرة ندى متلألئة تنتظر الترتيب.',
    puzzleType: 'order_marks',
    interactiveChallenge: {
      promptAr: 'رتّبي العلامتين الطبيعيتين بالترتيب السليم لاكتمال سر ندى البدايات:',
      descriptionAr: 'تأمّلي كيف تبدأ الحياة في الحديقة: ابدئي بقطرة الندى الصافية ثم البرعم الذي يرتوي منها برفق:',
      hintAr: 'تذكّري أن الارتواء يبدأ من قطرة الندى الصافية أولاً، ثم يتفتح البرعم في اللحظة التالية.',
      marksToOrder: [
        { id: 'mark_dew', labelAr: 'قطرة ندى الفجر الصافي', symbol: '💧' },
        { id: 'mark_sprout', labelAr: 'برعم السكينة المستيقظ', symbol: '🌿' },
      ],
      correctOrderIds: ['mark_dew', 'mark_sprout'],
      correctExplanationAr: 'أحسنتِ! قطرة الندى تمنح الحياة للبرعم بهدوء، كخطوة صغيرة واعية كافية للبداية دون استعجال.',
    },
    relicNameAr: 'قطرة ندى البدايات الصافية',
    relicIcon: '💧✨',
    narrativeRevelationAr:
      'كشف حديقة الفجر: قطرة الندى لا تتسرع في السقوط، بل تستقر بهدوء على طرف الغصن حتى تكتمل خفتها. تذكري دوماً: الخطوة الواحدة المتأنية تروي الروح وتبدد الضباب أكثر من الركض اللاهث في المجهول.',
    practicalWisdomAr:
      'التفكير الكلي والاستعجال يفرضان ثقلاً وهمياً؛ خطوة صغيرة واعية كقطرة ندى كافية لتفتيت أثقل الأحمال.',
  },

  // =========================================================================
  // SECRET 2: مخطوطة الحدود المنسية — مكتبة الأسرار
  // =========================================================================
  {
    id: 'secret_library_boundaries',
    worldId: 'library_of_secrets',
    worldNameAr: 'مكتبة الأسرار',
    titleAr: 'سر مخطوطة الحدود المنسية',
    icon: '📜',
    badgeSymbol: '📜🛡️',
    discoveryConditionAr: 'إضاءة أروقة المكتبة بنسبة 40% (إتمام 14 مرحلة إجمالاً) وملاحظة شطر المخطوطة في الرف الأوسط.',
    minCompletedStages: 14,
    clueHintAr: 'في الرف الأوسط تحت ضوء الفوانيس الذهبية، يبرز شطر من مخطوطة قديمة ممزقة يحتاج إلى وصله بتكملته الصحيحة.',
    puzzleType: 'connect_parchment',
    interactiveChallenge: {
      promptAr: 'صِلي شطر المخطوطة بما يكمله منطقياً ليكتمل عهد الأمان النفسي:',
      descriptionAr: 'اقرئي بداية المخطوطة واستنتجي الشطر المتمم لمعنى الحدود السليمة:',
      hintAr: 'الحدود الصحية لا تعني الانعزال والقطيعة، بل تعني استدامة العطاء الصادق دون استنزاف.',
      parchmentLeadAr: '«من صانَ سياجَ طاقتِهِ بالرّفقِ...»',
      fragmentsToConnect: [
        {
          id: 'frag_sustain',
          textAr: '«...استدامَ صفاءُ نبعِهِ، وبَقِيَ عطاؤُهُ نقيّاً بلا احتراق»',
          symbol: '📜🕊️',
          isCorrect: true,
        },
        {
          id: 'frag_isolate',
          textAr: '«...أغلقَ كافّة الأبوابِ وقاطعَ الجميعَ في جفاءٍ دائم»',
          symbol: '🔒🚫',
          isCorrect: false,
        },
        {
          id: 'frag_dissolve',
          textAr: '«...تلاشى في رغباتِ الآخرين ونسيَ رعايةَ نفسِهِ»',
          symbol: '🥀⚡',
          isCorrect: false,
        },
      ],
      correctExplanationAr: 'صحيح تماماً! الحدود الآمنة هي التي تصون نبع العطاء ليبقى متدفقاً بصدق وكرامة.',
    },
    relicNameAr: 'رقّ مخطوطة الحدود المنسية',
    relicIcon: '📜🛡️',
    narrativeRevelationAr:
      'كشف أروقة الحكمة: المخطوطة المكتملة تنص على: «الحدود ليست جدراناً للخصام، بل هي المسافة المقدسة التي تسمح للحب بأن يتنفس دون اختناق، وللعطاء بأن يظل خياراً حراً ينبع من الامتلاء لا من الخوف».',
    practicalWisdomAr:
      'قول «لا» بحزم رفيق لما يستنزفك هو في حقيقته حماية لقول «نعم» الصادقة لما تؤمنين به وتعتنين به.',
  },

  // =========================================================================
  // SECRET 3: بلورة المراقب الصامت — كهف التفكير
  // =========================================================================
  {
    id: 'secret_cave_observer',
    worldId: 'cave_of_reflection',
    worldNameAr: 'كهف التفكير',
    titleAr: 'سر بلورة المراقب الصامت',
    icon: '🔮',
    badgeSymbol: '💎✨',
    discoveryConditionAr: 'توهج بلورات الكهف بنسبة 40% (إتمام 24 مرحلة إجمالاً) وملاحظة النمط المتسلسل على الجدار.',
    minCompletedStages: 24,
    clueHintAr: 'في تجويف بلوري أرجواني، تتوهج ثلاثة رموز محفورة في الصخر تمثل خلاصة مسار الرحلة وتنتظر ترتيب تسلسلها.',
    puzzleType: 'sequence_pattern',
    interactiveChallenge: {
      promptAr: 'اختاري تسلسل رموز الرحلة الصحيح (من البداية إلى عمق الوعي) لتجلي بلورة المراقب:',
      descriptionAr: 'تتبعي نمط النمو: من ندى الحديقة، مروراً بمخطوطة المكتبة، وصولاً إلى بلورة الكهف الراسخة:',
      hintAr: 'التسلسل يتطابق مع ترتيب العوالم التي اجتزتِها: ندى الحديقة أولاً، ثم مخطوطة المكتبة، ثم بلورة الكهف.',
      patternSymbols: [
        { id: 'sym_dew', nameAr: 'ندى البدايات (الحضور الهادئ)', symbol: '💧', originWorldAr: 'حديقة البدايات' },
        { id: 'sym_parchment', nameAr: 'مخطوطة الحدود (الوعي والأمان)', symbol: '📜', originWorldAr: 'مكتبة الأسرار' },
        { id: 'sym_observer', nameAr: 'بلورة المراقب (فضاء الذات الواسع)', symbol: '💎', originWorldAr: 'كهف التفكير' },
      ],
      correctSequenceIds: ['sym_dew', 'sym_parchment', 'sym_observer'],
      correctExplanationAr: 'رائع! لقد تتبعتِ مسار الوعي بدقة: سكون اللحظة، حكمة الحدود، ثم استقرار الذات المراقبة.',
    },
    relicNameAr: 'بلورة المراقب الصامت الأرجوانية',
    relicIcon: '🔮💎',
    narrativeRevelationAr:
      'كشف عمق الكهف: تضيء البلورة بنور بنفسجي مطمئن، ويهمس الكهف: «أنتِ لستِ الأفكار العاصفة ولا المشاعر المتلاطمة؛ أنتِ الفضاء الفسيح الذي تمر فيه الأفكار كالسحب دون أن تترك ندبة على صفاء سمائكِ».',
    practicalWisdomAr:
      'الذات كفضاء للسياق (Self-as-Context) تمنحك القدرة على مراقبة أفكارك بلطف واطمئنان دون الحاجة إلى التماهي معها أو التصارع المرهق معها.',
  },
];

// Helper functions with alias support for backward compatibility
export function getSecretById(id: string): WorldSecret | undefined {
  if (id === 'secret_garden_compass' || id === 'secret_garden_dew') {
    return NESMA_CIPHER_SECRETS[0];
  }
  if (id === 'secret_library_scroll' || id === 'secret_library_boundaries') {
    return NESMA_CIPHER_SECRETS[1];
  }
  if (id === 'secret_cave_geode' || id === 'secret_cave_observer') {
    return NESMA_CIPHER_SECRETS[2];
  }
  return NESMA_CIPHER_SECRETS.find((s) => s.id === id);
}

export function getSecretByWorld(worldId: string): WorldSecret | undefined {
  return NESMA_CIPHER_SECRETS.find((s) => s.worldId === worldId);
}

// =========================================================================
// GRAND SECRET: السر الأعظم — ما الذي يجمع الخيوط الثلاثة؟
// =========================================================================
export const GRAND_CIPHER_SECRET: GrandSecretData = {
  id: 'grand_cipher_secret',
  titleAr: 'السر الأعظم: نول الوعي الموحّد',
  subtitleAr: 'ما الذي يجمع خيوط الحديقة والمكتبة والكهف في روح واحدة؟',
  icon: '✨',
  badgeSymbol: '🕊️💧📜💎',
  threads: [
    {
      id: 'thread_garden',
      secretId: 'secret_garden_dew',
      worldNameAr: 'حديقة البدايات',
      relicNameAr: 'ندى البدايات الصافية',
      symbol: '💧',
      truthCoreAr: 'الرفق بالنفس وسط التشتت',
      revelationAr: 'البداية لا تتطلب عاصفة، بل خطوة واحدة رفيقة تكفي لارتواء الروح وانقشاع الضباب.',
    },
    {
      id: 'thread_library',
      secretId: 'secret_library_boundaries',
      worldNameAr: 'مكتبة الأسرار',
      relicNameAr: 'مخطوطة الحدود المنسية',
      symbol: '📜',
      truthCoreAr: 'حماية المساحة الشخصية دون فقدان القدرة على المحبة',
      revelationAr: 'الحدود سياج آمن يصون نبع العطاء ليبقى متدفقاً بكرامة، دون تآكل أو احتراق.',
    },
    {
      id: 'thread_cave',
      secretId: 'secret_cave_observer',
      worldNameAr: 'كهف التفكير',
      relicNameAr: 'بلورة المراقب الصامت',
      symbol: '💎',
      truthCoreAr: 'ملاحظة الأفكار دون اعتبارها حقائق مطلقة',
      revelationAr: 'أنتِ لستِ عاصفة المشاعر والأفكار، بل الفضاء الفسيح الذي يستوعبها بهدوء ويمضي.',
    },
  ],
  weavingChallenge: {
    promptAr: 'تأمّلي خيوط الأسرار الثلاثة واستنتجي الرابط الأعمق الذي يصنع السلام الداخلي الكامل:',
    descriptionAr:
      'إذا كان الرفق (💧) هو موضع قدميكِ، والحدود الصادقة (📜) هي سياج مساحتكِ، والمراقبة الواعية (💎) هي اتساع نظرتكِ... فما هو العهد الجامع لهذه الخيوط؟',
    deductionQuestionAr:
      'بناءً على الاستنتاج المنطقي من الأسرار الثلاثة: كيف تتكامل هذه البصائر لتكوين الذات المتزنة؟',
    options: [
      {
        id: 'opt_sanctuary_truth',
        textAr:
          '«أن تكوني لنفسكِ وطناً آمناً: تسكنين اللحظة برفق، وتصونين مساحتكِ بحب، وترقبين عواصف العقل كزائر لا يملك استقراركِ.»',
        isCorrect: true,
        feedbackAr:
          'استنتاج سليم ومبهر! الرفق يحميكِ من القسوة، والحدود تحميكِ من الاستنزاف، والمراقبة تحميكِ من الوهم؛ فيكتمل وطنكِ الداخلي.',
      },
      {
        id: 'opt_isolation',
        textAr:
          '«أن تنعزلي تماماً عن العالم وتتجاهلي مشاعركِ لتتجنبي أي ألم أو نزاع خارجي.»',
        isCorrect: false,
        feedbackAr:
          'هذا انسحاب وجفاء؛ مخطوطة الحدود علمتنا أن الحدود صُوت لحماية الحب والتواصل، لا لقطع الصلة بالحياة.',
      },
      {
        id: 'opt_submission',
        textAr:
          '«أن تسلّمي قياد أمركِ لما تقوله أفكاركِ اللحظية وتضحي براحتكِ لإرضاء الجميع أولاً.»',
        isCorrect: false,
        feedbackAr:
          'هذا تماهٍ مجهد مع الأفكار وإهدار للحدود، ويتناقض مع بصيرة بلورة المراقب ومخطوطة الحدود.',
      },
    ],
  },
  unifiedRevelationAr:
    'حين تتآلف الخيوط الثلاثة، يتلاشى الشتات. الرفقُ بالذات هو التربة، وحكمةُ الحدود هي الحصن، وصفاءُ المراقبة هو الأفق اللانهائي. لم تكن الرحلة هروباً من العالم، بل عودة واعية إلى نفسكِ: حاضرة، آمنة، وحرّة.',
  grandCovenantAr:
    '«أنا الفضاء الذي تتنفس فيه الحياة؛ أبدأ برفق، وأصون طاقتي بصدق، وأشهد أفكاري بسلام دون أن أنكسر.»',
  relicNameAr: 'قلادة خيوط الوعي الموحّد — خاتم شفرة نسمة',
  relicIcon: '🕊️✨',
};

export function hasAllThreeSecrets(discoveredSecretIds: string[]): boolean {
  const req1 = discoveredSecretIds.includes('secret_garden_dew') || discoveredSecretIds.includes('secret_garden_compass');
  const req2 = discoveredSecretIds.includes('secret_library_boundaries') || discoveredSecretIds.includes('secret_library_scroll');
  const req3 = discoveredSecretIds.includes('secret_cave_observer') || discoveredSecretIds.includes('secret_cave_geode');
  return req1 && req2 && req3;
}

export function canUnlockGrandSecret(progress: CipherProgress): boolean {
  const isStage30Completed = progress.completedLevels.includes(30);
  const hasSecrets = hasAllThreeSecrets(progress.discoveredSecrets || []);
  return isStage30Completed && hasSecrets;
}
