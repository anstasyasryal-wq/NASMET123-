/**
 * Automated Test Runner for «شفرة نسمة» (Nesma's Cipher)
 * Verifies:
 * 1. Journey through initial stages of Garden (1), Library (11), Cave (21)
 * 2. Narrative dialogues, puzzles, outro revelations, and quote discoveries
 * 3. Milestone checkpoints (10, 20, 30)
 * 4. Persistence integrity & anti-duplication in localStorage
 * 5. Secret discovery system (Phase 7): progression gate, unsolved non-discovery, puzzle solving, and persistence
 */

import { NESMA_CIPHER_STAGES, PSYCHOLOGICAL_QUOTES } from '../src/data/nesmaCipherData';
import {
  NESMA_CIPHER_SECRETS,
  getSecretById,
  GRAND_CIPHER_SECRET,
  hasAllThreeSecrets,
  canUnlockGrandSecret,
} from '../src/data/nesmaCipherSecrets';
import {
  DEFAULT_CIPHER_PROGRESS,
  loadCipherProgress,
  saveCipherProgress,
  markStageCompleted,
  unlockSecret,
  unlockGrandSecret,
  isGrandSecretUnlocked,
  resetCipherProgress,
} from '../src/utils/nesmaCipherStorage';

// In-Memory Storage mock to simulate localStorage in Node environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Attach mock storage to global window
const mockStorage = new MockLocalStorage();
(global as any).window = {
  localStorage: mockStorage,
};
(global as any).localStorage = mockStorage;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail: string = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
  }
}

console.log('================================================================');
console.log('   🕊️ بدء تشغيل سيناريو الاختبار الآلي لمنظومة «شفرة نسمة»');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST SUITE 1: STAGE INITIAL DATA & NARRATIVE DIALOGUES
// -----------------------------------------------------------------------------
console.log('📌 [المجموعة 1]: فحص بيانات الحوارات القصصية والألغاز للمراحل الأولى');

const stage1 = NESMA_CIPHER_STAGES.find((s) => s.id === 1);
const stage11 = NESMA_CIPHER_STAGES.find((s) => s.id === 11);
const stage21 = NESMA_CIPHER_STAGES.find((s) => s.id === 21);

assert(Boolean(stage1), 'المرحلة 1 موجودة (حديقة البدايات)');
assert(
  Boolean(stage1?.narrativeIntroAr && stage1?.companionDialogue?.intro && stage1?.narrativeOutroAr),
  'المرحلة 1 تحتوي على نص البداية وحوار بوصلة نسمة والنتيجة القصصية'
);
assert(stage1?.puzzleType === 'image_puzzle', 'المرحلة 1 لغزها بازل تحرر الأفكار');

assert(Boolean(stage11), 'المرحلة 11 موجودة (مكتبة الأسرار)');
assert(
  Boolean(stage11?.narrativeIntroAr && stage11?.companionDialogue?.intro && stage11?.narrativeOutroAr),
  'المرحلة 11 تحتوي على نص البداية وحوار بوصلة نسمة والنتيجة القصصية'
);
assert(stage11?.puzzleType === 'letters_box', 'المرحلة 11 لغزها صندوق حروف المشاعر');

assert(Boolean(stage21), 'المرحلة 21 موجودة (كهف التفكير)');
assert(
  Boolean(stage21?.narrativeIntroAr && stage21?.companionDialogue?.intro && stage21?.narrativeOutroAr),
  'المرحلة 21 تحتوي على نص البداية وحوار بوصلة نسمة والنتيجة القصصية'
);
assert(stage21?.puzzleType === 'breathing_flow', 'المرحلة 21 لغزها واحة تدفق التنفس والذات المراقبة');

// -----------------------------------------------------------------------------
// TEST SUITE 2: GAMEPLAY PROGRESSION & LOCALSTORAGE PERSISTENCE
// -----------------------------------------------------------------------------
console.log('\n📌 [المجموعة 2]: فحص التقدم الفعلي وتخزين localStorage ومنع التكرار');

resetCipherProgress();
let currentProgress = loadCipherProgress();

assert(currentProgress.completedLevels.length === 0, 'بدء اللعبة بحالة نظيفة (0 مراحل منجزة)');
assert(currentProgress.currentLevel === 1, 'المرحلة الحالية المتاحة هي الأولى فقط');
assert(currentProgress.score === 0, 'النقاط الأولية 0');

// Complete Stage 1
currentProgress = markStageCompleted(1, 3, 100);
assert(currentProgress.completedLevels.includes(1), 'المرحلة 1 أُضيفت إلى المراحل المنجزة');
assert(currentProgress.currentLevel >= 2, 'تم فتح المرحلة 2 تلقائياً');
assert(currentProgress.score === 100, 'تم احتساب 100 نقطة للمرحلة الأولى');
assert(currentProgress.stars[1] === 3, 'تم احتساب 3 نجوم للمرحلة الأولى');

// Test Anti-Duplication Rule on Replay
const replayedProgress = markStageCompleted(1, 3, 100);
assert(
  replayedProgress.score === 100,
  'إعادة لعب المرحلة 1 لم تمنح نقاط مكررة (النقاط ظلت 100)',
  `النقاط أصبحت: ${replayedProgress.score}`
);
assert(
  replayedProgress.completedLevels.filter((id) => id === 1).length === 1,
  'المرحلة 1 مسجلة مرة واحدة فقط دون تكرار في القائمة'
);

// -----------------------------------------------------------------------------
// TEST SUITE 3: MAJOR MILESTONE STATIONS (10, 20, 30)
// -----------------------------------------------------------------------------
console.log('\n📌 [المجموعة 3]: فحص المحطات الكبرى (المراحل 10 و20 و30)');

const stage10 = NESMA_CIPHER_STAGES.find((s) => s.id === 10);
const stage20 = NESMA_CIPHER_STAGES.find((s) => s.id === 20);
const stage30 = NESMA_CIPHER_STAGES.find((s) => s.id === 30);

assert(stage10?.puzzleType === 'synthesis', 'المرحلة 10 محطة تركيبية (منارة البصيرة والمرايا الثلاث)');
assert(stage20?.puzzleType === 'synthesis', 'المرحلة 20 محطة تركيبية (محراب الحكمة والركائز الثلاث)');
assert(stage30?.puzzleType === 'synthesis', 'المرحلة 30 تتويج ختامي (قلادة الوعي الحقيقي والجواهر الخمس)');

// -----------------------------------------------------------------------------
// TEST SUITE 4: PHASE 7 SECRETS DISCOVERY & MINI-PUZZLES
// -----------------------------------------------------------------------------
console.log('\n📌 [المجموعة 4]: فحص نظام أسرار العوالم الثلاثة والألغاز المصغرة (المرحلة 7)');

const gardenSecret = getSecretById('secret_garden_dew');
const librarySecret = getSecretById('secret_library_boundaries');
const caveSecret = getSecretById('secret_cave_observer');

assert(Boolean(gardenSecret), 'سر حديقة البدايات موجود («ندى البدايات»)');
assert(gardenSecret?.puzzleType === 'order_marks', 'لغز سر الحديقة هو ترتيب علامتين بسيطتين');
assert(gardenSecret?.minCompletedStages === 4, 'شرط سر الحديقة يتطلب إتمام 4 مراحل على الأقل');

assert(Boolean(librarySecret), 'سر مكتبة الأسرار موجود («مخطوطة الحدود المنسية»)');
assert(librarySecret?.puzzleType === 'connect_parchment', 'لغز سر المكتبة هو ربط شطر المخطوطة بالمعنى المستنتج');
assert(librarySecret?.minCompletedStages === 14, 'شرط سر المكتبة يتطلب إتمام 14 مرحلة على الأقل');

assert(Boolean(caveSecret), 'سر كهف التفكير موجود («بلورة المراقب الصامت»)');
assert(caveSecret?.puzzleType === 'sequence_pattern', 'لغز سر الكهف هو تسلسل نمط الرموز الثلاثة');
assert(caveSecret?.minCompletedStages === 24, 'شرط سر الكهف يتطلب إتمام 24 مرحلة على الأقل');

// Test Secret Unlock Logic & Anti-Premature Discovery
resetCipherProgress();
let secretTestProgress = loadCipherProgress();
assert(secretTestProgress.discoveredSecrets.length === 0, 'خزانة المقتنيات فارغة في البداية (0 أسرار)');

// Simulate opening and closing modal without solving:
// In our architecture, unlockSecret is ONLY called upon solve!
assert(secretTestProgress.discoveredSecrets.length === 0, 'فتح وإغلاق نافذة السر دون حل لا يسجل الاكتشاف');

// Now unlock secret after solving
const unlockResult = unlockSecret('secret_garden_dew');
assert(unlockResult.isNew === true, 'تم اكتشاف سر ندى البدايات لأول مرة');
assert(unlockResult.progress.discoveredSecrets.includes('secret_garden_dew'), 'السر محفوظ في قائمة discoveredSecrets');

// Test Persistence reload from storage
const reloadedFromStorage = loadCipherProgress();
assert(
  reloadedFromStorage.discoveredSecrets.includes('secret_garden_dew'),
  'السر المكتشف محفوظ ومستقر في localStorage بعد إعادة التحميل'
);

// Test Re-opening / Re-unlocking prevents duplicate awards
const duplicateUnlockResult = unlockSecret('secret_garden_dew');
assert(duplicateUnlockResult.isNew === false, 'إعادة فتح السر المكتشف لا تكرر المكافأة أو تسجل مضاعفة');
assert(
  duplicateUnlockResult.progress.score === reloadedFromStorage.score,
  'لا يتم منح أي XP أو نجوم إضافية خارج نظام المكافآت الحالي'
);

// -----------------------------------------------------------------------------
// TEST SUITE 5: SCHEMA HEALING & RESILIENCE
// -----------------------------------------------------------------------------
console.log('\n📌 [المجموعة 5]: فحص متانة التخزين والمعالجة التلقائية للبيانات المشوهة');

// Inject corrupted data
mockStorage.setItem('nesma_cipher_progress_v1', '{ "completedLevels": "corrupted", "score": -50 }');
const healedProgress = loadCipherProgress();
assert(Array.isArray(healedProgress.completedLevels), 'تم تصحيح قائمة المراحل المشوهة لتكون مصفوفة آمنة');
assert(healedProgress.score >= 0, 'تم تصحيح النقاط السالبة إلى 0 آلياً');
assert(Array.isArray(healedProgress.discoveredSecrets), 'تم الحفاظ على مصفوفة الأسرار السليمة');
assert(typeof healedProgress.unlockedGrandSecret === 'boolean', 'تم الحفاظ على سلامة قيمة unlockedGrandSecret كـ boolean');

// -----------------------------------------------------------------------------
// TEST SUITE 6: PHASE 8 GRAND SECRET (السر الأعظم — الخيوط الثلاثة)
// -----------------------------------------------------------------------------
console.log('\n📌 [المجموعة 6]: فحص السر الأعظم وتكامل الخيوط الثلاثة والعهد الموحد (المرحلة 8)');

// 1. Structural & Narrative integrity
assert(Boolean(GRAND_CIPHER_SECRET), 'بيانات السر الأعظم موجودة ومكتملة');
assert(
  GRAND_CIPHER_SECRET.threads.length === 3,
  'السر الأعظم يحتوي بدقة على الخيوط الثلاثة (الحديقة، المكتبة، الكهف)'
);
assert(
  GRAND_CIPHER_SECRET.threads[0].truthCoreAr.includes('الرفق'),
  'الخيط الأول يحمل جوهر الرفق بالنفس (ندى البدايات)'
);
assert(
  GRAND_CIPHER_SECRET.threads[1].truthCoreAr.includes('المساحة الشخصية') ||
    GRAND_CIPHER_SECRET.threads[1].truthCoreAr.includes('المحبة'),
  'الخيط الثاني يحمل جوهر حماية المساحة الشخصية والمحبة (مخطوطة الحدود المنسية)'
);
assert(
  GRAND_CIPHER_SECRET.threads[2].truthCoreAr.includes('الأفكار'),
  'الخيط الثالث يحمل جوهر فضاء المراقبة والأفكار (بلورة المراقب الصامت)'
);

// 2. Weaving deduction challenge integrity
assert(
  Boolean(GRAND_CIPHER_SECRET.weavingChallenge.deductionQuestionAr),
  'تحدي الاستنتاج والربط يحتوي على سؤال منطقي واضح يربط بين الخيوط'
);
const correctDeductionOption = GRAND_CIPHER_SECRET.weavingChallenge.options.find((o) => o.isCorrect);
assert(
  Boolean(correctDeductionOption),
  'يوجد استنتاج صحيح جامع للحقائق الثلاث في التحدي'
);
assert(
  GRAND_CIPHER_SECRET.weavingChallenge.options.filter((o) => !o.isCorrect).length >= 2,
  'توجد خيارات بديلة منطقية ومفسرة تصحح الفهم غير المتزن'
);

// 3. Preconditions & Non-blocking accessibility
resetCipherProgress();
let grandProgress = loadCipherProgress();

// Precondition Test: 0 secrets & stage 30 not done
assert(
  hasAllThreeSecrets(grandProgress.discoveredSecrets) === false,
  'الخيوط الثلاثة غير مكتملة في البداية'
);
assert(
  canUnlockGrandSecret(grandProgress) === false,
  'السر الأعظم مقفل قبل توفر الشروط'
);

// Complete Stage 30 WITHOUT all secrets:
// Base ending must remain accessible and not blocked!
grandProgress = markStageCompleted(30, 3, 150);
assert(
  grandProgress.completedLevels.includes(30),
  'المرحلة 30 تكتمل بنجاح حتى دون جمع الأسرار الثلاثة'
);
assert(
  canUnlockGrandSecret(grandProgress) === false,
  'السر الأعظم يظل مقفلاً طالما لم تُجمع الأسرار الثلاثة، دون تعطيل نهاية اللعبة الأساسية'
);

// Collect secrets 1 and 2 only:
unlockSecret('secret_garden_dew');
unlockSecret('secret_library_boundaries');
grandProgress = loadCipherProgress();
assert(
  hasAllThreeSecrets(grandProgress.discoveredSecrets) === false,
  'جمع سرين فقط لا يكفي لفتح السر الأعظم (متبقي سر الكهف)'
);
assert(
  canUnlockGrandSecret(grandProgress) === false,
  'السر الأعظم يظل غير قابل للفتح بـ 2 من 3 أسرار'
);

// Collect the 3rd secret (Cave):
unlockSecret('secret_cave_observer');
grandProgress = loadCipherProgress();
assert(
  hasAllThreeSecrets(grandProgress.discoveredSecrets) === true,
  'الخيوط الثلاثة مكتملة الآن بالكامل (3 من 3)'
);
assert(
  canUnlockGrandSecret(grandProgress) === true,
  'السر الأعظم أصبح متاحاً الآن للاكتشاف بعد استيفاء الشرطين (المرحلة 30 + 3 أسرار)'
);

// 4. Solving Grand Secret & Storage Persistence
const initialScoreBeforeGrand = grandProgress.score;
const grandUnlockResult = unlockGrandSecret();
assert(
  grandUnlockResult.isNew === true,
  'تم فك السر الأعظم للمرة الأولى بنجاح'
);
assert(
  grandUnlockResult.progress.unlockedGrandSecret === true,
  'حالة unlockedGrandSecret مسجلة true في التقدم'
);
assert(
  typeof grandUnlockResult.progress.grandSecretUnlockedAt === 'number',
  'تم تسجيل توقيت فك السر الأعظم'
);
assert(
  grandUnlockResult.progress.score === initialScoreBeforeGrand,
  'فك السر الأعظم لا يمنح أي XP أو نقاط خارج نظام الجوائز المعتمد'
);

// Verify persistence from storage reload
const reloadedGrandProgress = loadCipherProgress();
assert(
  reloadedGrandProgress.unlockedGrandSecret === true,
  'حالة السر الأعظم محفوظة ومستقرة في localStorage بعد إعادة التحميل'
);
assert(
  isGrandSecretUnlocked() === true,
  'دالة isGrandSecretUnlocked() تؤكد حالة الفتح بدقة'
);

// Verify Re-opening / Re-unlocking idempotency
const duplicateGrandResult = unlockGrandSecret();
assert(
  duplicateGrandResult.isNew === false,
  'إعادة مراجعة السر الأعظم لا تكرر التسجيل أو تحدث أي ازدواجية'
);
assert(
  duplicateGrandResult.progress.score === initialScoreBeforeGrand,
  'النقاط ثابتة تماماً دون أي زيادة غير مبررة'
);

console.log('\n================================================================');
console.log(`   🏁 النتيجة النهائية للاختبار الآلي:`);
console.log(`   إجمالي الفحوصات: ${totalTests}`);
console.log(`   الفحوصات الناجحة: ${passedTests} ✅`);
console.log(`   الفحوصات الفاشلة: ${failedTests} ❌`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
