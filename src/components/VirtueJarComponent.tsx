import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronLeft,
  Plus,
  Trash2,
  Heart,
  Award,
  Coins,
  CheckCircle2,
  Calendar,
  Flame,
  Star,
  BookOpen,
  Download,
  Upload,
  AlertTriangle,
  FileText,
  X,
} from 'lucide-react';

export interface LoggedVirtue {
  id: string;
  title: string;
  category: 'humility' | 'prayer' | 'love' | 'patience' | 'purity' | 'service';
  categoryLabel: string;
  coinValue: number;
  note: string;
  dateStr: string; // ISO date string YYYY-MM-DD
  timestamp: number;
}

const QUICK_VIRTUES = [
  { title: 'الصمت وحراسة اللسان', category: 'patience', coin: 15, icon: '🤐' },
  { title: 'غفران إساءة بلا عتاب', category: 'love', coin: 20, icon: '🕊️' },
  { title: 'خدمة خفية بلا مديح', category: 'service', coin: 25, icon: '🤲' },
  { title: 'انسحاق وتوبة في المخدع', category: 'prayer', coin: 20, icon: '🕯️' },
  { title: 'احتمال ضيقة بشكر', category: 'patience', coin: 20, icon: '✨' },
  { title: 'صدقة خفية لمحتاج', category: 'love', coin: 15, icon: '🌿' },
  { title: 'التلصص على فكر صالح', category: 'humility', coin: 15, icon: '🐝' },
];

const STORAGE_KEY = 'mokarasa_virtue_jar_records_v1';

interface VirtueJarComponentProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

export const VirtueJarComponent: React.FC<VirtueJarComponentProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [records, setRecords] = useState<LoggedVirtue[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const key = `${STORAGE_KEY}_${currentUser?.id || 'guest'}`;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'v-init-1',
        title: 'الغفران والصبر في وجه الإساءة',
        category: 'love',
        categoryLabel: 'المحبة والغفران',
        coinValue: 20,
        note: 'ساعدني الرب على احتمال كلمة صعبة بشكر وسلام.',
        dateStr: new Date().toISOString().slice(0, 10),
        timestamp: Date.now() - 3600000 * 5,
      },
      {
        id: 'v-init-2',
        title: 'صلاة مخدع هادئة بفجر اليوم',
        category: 'prayer',
        categoryLabel: 'الصلاة والمخدع',
        coinValue: 15,
        note: 'تلاوة مزمور 63 بانسحاق كامل.',
        dateStr: new Date().toISOString().slice(0, 10),
        timestamp: Date.now() - 3600000 * 12,
      },
    ];
  });

  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<LoggedVirtue['category']>('love');
  const [customNote, setCustomNote] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(15);
  const [successMsg, setSuccessMsg] = useState(false);

  // Save to storage
  const saveRecords = (updated: LoggedVirtue[]) => {
    setRecords(updated);
    if (typeof window === 'undefined') return;
    try {
      const key = `${STORAGE_KEY}_${currentUser?.id || 'guest'}`;
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  };

  const handleAddVirtue = (title: string, category: LoggedVirtue['category'], coin: number, note = '') => {
    soundManager.playVictory();
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.6 } });

    const catLabels: Record<LoggedVirtue['category'], string> = {
      humility: 'الاتضاع والوداعة',
      prayer: 'الصلاة والمخدع',
      love: 'المحبة والغفران',
      patience: 'الاحتمال والصبر',
      purity: 'النقاوة وحراسة الفكر',
      service: 'الخدمة والبذل',
    };

    const newRecord: LoggedVirtue = {
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      category,
      categoryLabel: catLabels[category] || 'فضيلة عامة',
      coinValue: coin,
      note,
      dateStr: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
    };

    saveRecords([newRecord, ...records]);
    setCustomTitle('');
    setCustomNote('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const handleDeleteRecord = (id: string) => {
    soundManager.playTick();
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  // Backup / Restore state
  const [importModalData, setImportModalData] = useState<{
    version: number;
    userId: string;
    exportDate: string;
    records: LoggedVirtue[];
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleExportBackup = () => {
    try {
      const backupPayload = {
        version: 1,
        exportDate: new Date().toISOString(),
        userId: currentUser?.id || 'guest',
        recordsCount: records.length,
        records: records,
      };
      const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `virtue_jar_backup_${currentUser?.id || 'guest'}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setImportError('تعذّر تصدير ملف النسخة الاحتياطية.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json || typeof json !== 'object' || !Array.isArray(json.records)) {
          throw new Error('صيغة الملف غير صالحة أو تالفة.');
        }
        if (json.version !== 1) {
          throw new Error('إصدار مخطط النسخة الاحتياطية غير مدعوم.');
        }
        for (const r of json.records) {
          if (!r.id || !r.title || typeof r.coinValue !== 'number') {
            throw new Error('بيانات السجلات داخل الملف غير مطابقة للمعايير المطلوبة.');
          }
        }
        setImportModalData({
          version: json.version,
          userId: json.userId || 'unknown',
          exportDate: json.exportDate || new Date().toISOString(),
          records: json.records,
        });
      } catch (err: any) {
        setImportError(err.message || 'فشل قراءة الملف. تأكد من أنه ملف JSON صالح.');
      }
      if (e.target) e.target.value = '';
    };
    reader.onerror = () => {
      setImportError('حدث خطأ أثناء قراءة الملف.');
    };
    reader.readAsText(file);
  };

  const executeImport = (mode: 'merge' | 'replace') => {
    if (!importModalData) return;
    try {
      const autoBackupKey = `${STORAGE_KEY}_${currentUser?.id || 'guest'}_autobackup_${Date.now()}`;
      localStorage.setItem(autoBackupKey, JSON.stringify(records));

      if (mode === 'replace') {
        saveRecords(importModalData.records);
      } else {
        const existingIds = new Set(records.map((r) => r.id));
        const newRecords = importModalData.records.filter((r) => !existingIds.has(r.id));
        const merged = [...newRecords, ...records].sort((a, b) => b.timestamp - a.timestamp);
        saveRecords(merged);
      }

      setImportModalData(null);
      setImportSuccessMsg(`تم استعادة واستيراد ${importModalData.records.length} سجل بنجاح مبارك!`);
      setTimeout(() => setImportSuccessMsg(null), 3000);
    } catch {
      setImportError('حدث خطأ أثناء تطبيق البيانات المستوردة.');
    }
  };

  const totalCoins = records.reduce((sum, r) => sum + r.coinValue, 0);
  const jarLevel = Math.min(100, Math.round((totalCoins / 300) * 100)); // 300 coins fills jar

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-fade-in text-right" dir="rtl">
      {/* Navigation Return & Backup/Restore Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للرئيسية والعجلة</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition cursor-pointer shadow-sm"
            title="تصدير نسخة احتياطية محلية لبيانات الحصالة"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>تصدير نسخة احتياطية</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-xs transition cursor-pointer shadow-sm"
            title="استيراد نسخة احتياطية سابقة"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>استيراد نسخة</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Import Confirmation Modal */}
      {importModalData && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-lg w-full space-y-4 text-right shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <h3 className="font-spiritual text-lg font-bold text-amber-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>تأكيد استيراد النسخة الاحتياطية</span>
              </h3>
              <button
                onClick={() => setImportModalData(null)}
                className="p-1 rounded-xl hover:bg-stone-800 text-stone-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 space-y-1">
                <div>📁 عدد السجلات في الملف: <span className="font-mono font-bold">{importModalData.records.length} سجل</span></div>
                <div>📅 تاريخ التصدير: <span className="font-mono">{new Date(importModalData.exportDate).toLocaleString()}</span></div>
                <div>👤 مُعرف المستخدم المرتبط: <span className="font-mono">{importModalData.userId}</span></div>
                {importModalData.userId !== (currentUser?.id || 'guest') && (
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold pt-1">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>تنبيه: مُعرف المستخدم في الملف يختلف عن المستخدم الحالي!</span>
                  </div>
                )}
              </div>

              <p className="text-stone-300">
                سيتم الاحتفاظ بنسخة احتياطية تلقائية لبياناتك الحالية قبل عملية الاستيراد. كيف تريد التعامل مع البيانات المستوردة؟
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-800">
              <button
                onClick={() => executeImport('merge')}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition cursor-pointer text-center"
              >
                دمج آمن (إضافة السجلات الجديدة دون تكرار)
              </button>
              <button
                onClick={() => executeImport('replace')}
                className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 font-bold text-xs transition cursor-pointer text-center"
              >
                استبدال كامل (حذف الحالي ووضع المستورد)
              </button>
              <button
                onClick={() => setImportModalData(null)}
                className="py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 text-xs transition cursor-pointer text-center"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error / Success Banners for Import */}
      {importError && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{importError}</span>
        </div>
      )}

      {importSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{importSuccessMsg}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-stone-950 via-[#1c140d] to-stone-950 border-2 border-amber-500/60 p-6 sm:p-8 shadow-2xl overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>حصالة الفضائل الروحية والكنز السماوي</span>
            </div>
            <h1 className="font-spiritual text-2xl sm:text-4xl font-extrabold text-amber-100">
              🏺 حَصَالَةُ الفَضَائِلِ اليَوْمِيَّةِ
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              دون كل فضيلة مارستها اليوم في خلوتك أو خدمتك، واجمع العملات الروحية لتملأ حصالتك بكنوز لا تفنى أمام عرش النعمة.
            </p>
          </div>

          {/* Digital Coin Jar Counter Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-400/70 shadow-2xl text-center flex flex-col items-center justify-center min-w-[200px] shrink-0 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-pulse">
              🪙
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-200">
                {totalCoins} <span className="text-xs font-normal text-amber-400">عملة روحية</span>
              </div>
              <div className="text-[11px] text-amber-300/80 mt-0.5">
                مستوى امتلاء الحصالة: {jarLevel}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden border border-amber-500/40">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-700 rounded-full"
                style={{ width: `${jarLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>هنيئاً لك! تم إيداع الفضيلة والعملات الروحية في حصالتك بنجاح مبارك.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Logging Form & Quick Presets) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Preset Virtues */}
          <div className="rounded-3xl bg-stone-950 border border-amber-600/40 p-5 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>فضائل مقترحة للتدوين السريع:</span>
            </div>

            <div className="space-y-2">
              {QUICK_VIRTUES.map((qv, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    handleAddVirtue(
                      qv.title,
                      qv.category as LoggedVirtue['category'],
                      qv.coin,
                      'تدريب مكرس يومي'
                    )
                  }
                  className="w-full text-right p-3 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/50 transition flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{qv.icon}</span>
                    <span className="text-xs font-bold text-stone-200 group-hover:text-amber-200 transition">
                      {qv.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-600/30 shrink-0">
                    +{qv.coin} عملة
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Virtue Input Card */}
          <div className="rounded-3xl bg-stone-950 border border-amber-600/40 p-5 space-y-4 shadow-lg">
            <h3 className="font-spiritual text-base font-bold text-amber-200 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>تدوين فضيلة مخصصة</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">اسم الفضيلة أو العمل الروحي:</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="مثال: ابتسامة في وجه متعب، أمانة في الخدمة..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">محور الفضيلة:</label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as LoggedVirtue['category'])}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="love">المحبة والغفران</option>
                  <option value="prayer">الصلاة والمخدع</option>
                  <option value="humility">الاتضاع والوداعة</option>
                  <option value="patience">الاحتمال والصبر</option>
                  <option value="purity">النقاوة وحراسة الفكر</option>
                  <option value="service">الخدمة والبذل</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">قيمة العملات الروحية:</label>
                <div className="flex gap-2">
                  {[10, 15, 20, 25, 30].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCoin(c)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                        selectedCoin === c
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                      }`}
                    >
                      +{c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">ملاحظة أو تأمل شخصي (اختياري):</label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="كيف شعرت بعمل النعمة معك اليوم؟"
                  rows={2}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => {
                  if (!customTitle.trim()) return;
                  handleAddVirtue(customTitle.trim(), customCategory, selectedCoin, customNote.trim());
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إيداع في الحصالة الروحية</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (Logged Records History & Jar Visualizer) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jar Visualizer Card */}
          <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border border-amber-600/40 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                🏺 نبضات الحصالة اليومية
              </span>
              <h3 className="font-spiritual text-xl font-bold text-amber-100">
                «كنوزكم في السماء حيث لا سوس ولا صدأ»
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                كل فضيلة صغيرة تصنعها في الخفاء تسجل في سفر الحياة وتملأ حصالتك بسلام لا ينزع منكم قط.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/40 text-center shrink-0 min-w-[140px]">
              <div className="text-2xl font-black font-mono text-amber-300">{records.length}</div>
              <div className="text-[11px] text-stone-400">فضيلة مسجلة</div>
            </div>
          </div>

          {/* Records Log */}
          <div className="space-y-3">
            <h3 className="font-spiritual text-lg font-bold text-amber-100 flex items-center gap-2 px-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span>سجل الفضائل والعملات المودعة ({records.length})</span>
            </h3>

            {records.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-stone-950 border border-stone-800 text-stone-400 space-y-2">
                <p className="text-sm">لم تقم بتدوين أي فضيلة بعد اليوم.</p>
                <p className="text-xs text-amber-400">اختر إحدى الفضائل المقترحة أو أضف فضيلتك الخاصة الآن!</p>
              </div>
            ) : (
              records.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl bg-stone-950 border border-amber-600/40 hover:border-amber-400 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-300 flex items-center justify-center text-lg border border-amber-500/40 shrink-0">
                      🪙
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm text-stone-100 font-spiritual">{r.title}</strong>
                        <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-600/40 px-2 py-0.5 rounded-full font-bold">
                          {r.categoryLabel}
                        </span>
                      </div>
                      {r.note && <p className="text-xs text-stone-300 italic">{r.note}</p>}
                      <div className="text-[10px] text-stone-500 font-mono">
                        {r.dateStr} • {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                      +{r.coinValue} عملة
                    </span>
                    <button
                      onClick={() => handleDeleteRecord(r.id)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-red-400 border border-stone-800 transition cursor-pointer"
                      title="حذف السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
