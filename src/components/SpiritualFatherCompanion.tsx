import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import {
  Heart,
  ChevronLeft,
  Plus,
  Trash2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Shield,
  Send,
  Lock,
  Calendar,
  Settings,
  Clock,
  UserCheck,
  Award,
  Bell,
  Phone,
  MapPin,
  CheckSquare,
  Square,
  Camera,
  MessageCircle,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConfessionNote {
  id: string;
  date: string;
  title: string;
  content: string;
  isDiscussed: boolean;
}

interface SpiritualAdvice {
  id: string;
  date: string;
  fatherName: string;
  adviceText: string;
}

interface SpiritualFatherSettings {
  fatherName: string;
  churchName: string;
  phone: string;
  frequency: string;
  nextAppointment: string;
  notes: string;
}

interface ConscienceCheckItem {
  id: string;
  category: string;
  question: string;
  checked: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'father';
  text: string;
  timestamp: string;
}

interface SpiritualFatherCompanionProps {
  currentUser?: User | null;
  onBackToHome: () => void;
}

const NOTES_STORAGE_KEY = 'mokarasa_confession_notes_v2';
const ADVICE_STORAGE_KEY = 'mokarasa_spiritual_father_advice_v2';
const SETTINGS_STORAGE_KEY = 'mokarasa_spiritual_father_settings_v2';
const CONSCIENCE_STORAGE_KEY = 'mokarasa_conscience_checklist_v2';
const AVATAR_STORAGE_KEY = 'mokarasa_spiritual_father_avatar_v2';
const CHAT_STORAGE_KEY = 'mokarasa_spiritual_father_chat_v2';

export const SpiritualFatherCompanion: React.FC<SpiritualFatherCompanionProps> = ({
  currentUser,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'chat' | 'notes' | 'advice' | 'conscience' | 'prep_guide'>('settings');

  // Father Settings state
  const [fatherSettings, setFatherSettings] = useState<SpiritualFatherSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : {
            fatherName: 'أبونا القمص كيرلس الأنطوني',
            churchName: 'كنيسة السيدة العذراء والأنبا بيشوي',
            phone: '01220000000',
            frequency: 'كل ثلاثة أسابيع',
            nextAppointment: '2026-11-01T17:00',
            notes: 'الموعد عادةً بعد صلاة عشية الجمعة أو الأحد صباحاً.',
          };
    } catch {
      return {
        fatherName: 'أبونا القمص كيرلس الأنطوني',
        churchName: 'كنيسة السيدة العذراء والأنبا بيشوي',
        phone: '01220000000',
        frequency: 'كل ثلاثة أسابيع',
        nextAppointment: '2026-11-01T17:00',
        notes: 'الموعد عادةً بعد صلاة عشية الجمعة أو الأحد صباحاً.',
      };
    }
  });

  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<SpiritualFatherSettings>(fatherSettings);

  // Father Avatar image state
  const [fatherAvatar, setFatherAvatar] = useState<string>(() => {
    return localStorage.getItem(AVATAR_STORAGE_KEY) || '';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat state with Spiritual Father / Guide
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'm-1',
              sender: 'father',
              text: 'سلام الرب يكون معك يا ابني/روحي العزيز. أنا هنا دائماً لمرافقتك روحياً وسماع قلبك في نور الإنجيل.',
              timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            },
          ];
    } catch {
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');

  // Notes state
  const [notes, setNotes] = useState<ConfessionNote[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'note-1',
              date: '15 أكتوبر 2026',
              title: 'نقاط أود مناقشتها في الاعتراف القادم',
              content: 'الشعور بالتقصير في وقت الصلاة الصباحية، وكيفية التعامل مع حروب التشتت أثناء الأجبية.',
              isDiscussed: false,
            },
          ];
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Advice state
  const [adviceList, setAdviceList] = useState<SpiritualAdvice[]>(() => {
    try {
      const saved = localStorage.getItem(ADVICE_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'adv-1',
              date: '1 أكتوبر 2026',
              fatherName: 'أبونا القمص كيرلس',
              adviceText: 'الجهاد في حفظ الهدوء الداخلي، وقراءة مزمور 23 ببطء كل مساء قبل النوم.',
            },
          ];
    } catch {
      return [];
    }
  });

  const [newAdviceText, setNewAdviceText] = useState('');

  // Conscience Checklist state
  const [conscienceItems, setConscienceItems] = useState<ConscienceCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(CONSCIENCE_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'c1', category: 'محبة الله والمخدع', question: 'هل حافظت على وقت مخدع يومي خالٍ من المشتتات والإنترنت؟', checked: false },
            { id: 'c2', category: 'محبة الله والمخدع', question: 'هل صليت صلاة الأجبية بخشوع واهتمام بالمعاني الروحية؟', checked: false },
            { id: 'c3', category: 'محبة القريب', question: 'هل حفظت لساني عن الإدانة والنميمة والشكوى؟', checked: false },
            { id: 'c4', category: 'محبة القريب', question: 'هل بادرت بالمصالحة وصنع السلام مع من أخطأ في حقي أو أخطأت في حقه؟', checked: false },
            { id: 'c5', category: 'نقاوة القلب والتواضع', question: 'هل جاهدت ضد أفكار الكبرياء ومحبة المديح الباطل؟', checked: false },
            { id: 'c6', category: 'نقاوة القلب والتواضع', question: 'هل حافظت على حواس عيني وفكري طاهرة ونقية؟', checked: false },
          ];
    } catch {
      return [];
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFatherAvatar(result);
        localStorage.setItem(AVATAR_STORAGE_KEY, result);
        soundManager.playCorrect();
        confetti({ particleCount: 30, spread: 60 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFatherAvatar('');
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    soundManager.playTick();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    soundManager.playTick();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = [...chatMessages, userMsg];
    setChatMessages(updatedChat);
    setInputMessage('');

    // Patristic / Father simulated response after a short delay
    setTimeout(() => {
      soundManager.playCorrect();
      let replyText = '«الرب قريب لكل من يدعوه بالحق. اصبر على نفسك يا ابني وثق أن نعمة الله تكفيك في كل ضيق.»';
      const lower = userMsg.text.toLowerCase();
      if (lower.includes('صلاة') || lower.includes('تشتت')) {
        replyText = '«التشتت أثناء الصلاة حرب شائعة، وعلاجها هو إعادة الذهن برفق وبلا تذمر إلى كلمات المزمور أو الصلاة كمن يقف أمام ملك الملوك خشوعاً.»';
      } else if (lower.includes('غضب') || lower.includes('عصبية')) {
        replyText = '«حين يثور الغضب، الزم الصمت ولا تجب بكلمة واحدة، واطلب من الروح القدس أن يسكب سلاماً إلهياً في قلبك.»';
      } else if (lower.includes('خوف') || lower.includes('قلق')) {
        replyText = '«لا تهتم للغد لأن الغد يهتم بما لنفسه. سلّم أمورك لمن يبيّض السناابك ويعول الطيور.»';
      }

      const fatherMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'father',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      const finalChat = [...updatedChat, fatherMsg];
      setChatMessages(finalChat);
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(finalChat));
      } catch {}
    }, 800);
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();
    setFatherSettings(tempSettings);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(tempSettings));
    } catch {}
    setIsEditingSettings(false);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    soundManager.playCorrect();
    const item: ConfessionNote = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      title: newTitle.trim(),
      content: newContent.trim(),
      isDiscussed: false,
    };

    const updated = [item, ...notes];
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setNewTitle('');
    setNewContent('');
  };

  const handleDeleteNote = (id: string) => {
    soundManager.playTick();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleToggleDiscussed = (id: string) => {
    soundManager.playTick();
    const updated = notes.map((n) => (n.id === id ? { ...n, isDiscussed: !n.isDiscussed } : n));
    setNotes(updated);
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleAddAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdviceText.trim()) return;

    soundManager.playCorrect();
    const item: SpiritualAdvice = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }),
      fatherName: fatherSettings.fatherName,
      adviceText: newAdviceText.trim(),
    };

    const updated = [item, ...adviceList];
    setAdviceList(updated);
    try {
      localStorage.setItem(ADVICE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    setNewAdviceText('');
  };

  const handleDeleteAdvice = (id: string) => {
    soundManager.playTick();
    const updated = adviceList.filter((a) => a.id !== id);
    setAdviceList(updated);
    try {
      localStorage.setItem(ADVICE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleToggleConscience = (id: string) => {
    soundManager.playTick();
    const updated = conscienceItems.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c));
    setConscienceItems(updated);
    try {
      localStorage.setItem(CONSCIENCE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950 border border-amber-600/30 shadow-2xl text-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10 text-right">
          {/* Father Avatar with upload / delete support */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-900/40 border-2 border-amber-500/60 overflow-hidden flex items-center justify-center shadow-xl">
              {fatherAvatar ? (
                <img src={fatherAvatar} alt="صورة الأب الروحي" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">🧔🏻‍♂️</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md hover:bg-amber-500 transition cursor-pointer"
              title="تغيير صورة الأب الروحي"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                أبويا الروحي — رفيقي الدائم
              </span>
            </div>
            <h1 className="font-spiritual text-xl sm:text-2xl font-bold text-amber-200">
              {fatherSettings.fatherName}
            </h1>
            <p className="text-xs text-stone-300 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{fatherSettings.churchName}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2 z-10">
          <button
            onClick={onBackToHome}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
          {fatherAvatar && (
            <button
              onClick={handleRemoveAvatar}
              className="text-[11px] text-stone-400 hover:text-rose-400 underline cursor-pointer"
            >
              حذف الصورة المخصصة
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'settings', label: 'إعدادات وبيانات الأب', icon: Settings },
          { id: 'chat', label: 'الحوار الروحي الشخصي', icon: MessageCircle },
          { id: 'notes', label: 'نقاط الاعتراف القادم', icon: Plus },
          { id: 'advice', label: 'سجل التوجيهات', icon: BookOpen },
          { id: 'conscience', label: 'ميزان فحص الضمير', icon: Shield },
          { id: 'prep_guide', label: 'خطوات التحضير لسر التوبة', icon: Sparkles },
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
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md border border-amber-400'
                  : 'bg-stone-900 text-stone-300 border border-stone-800 hover:bg-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="flex items-center justify-between border-b border-amber-800/40 pb-4">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-100">
                بيانات وإعدادات الأب الروحي
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                قم بتحديث اسم أبيك الروحي، موعد الاعتراف الدوري، وكنيسته.
              </p>
            </div>
            {!isEditingSettings && (
              <button
                onClick={() => {
                  setTempSettings(fatherSettings);
                  setIsEditingSettings(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/40 font-bold text-xs hover:bg-amber-600/30 transition cursor-pointer"
              >
                تعديل البيانات
              </button>
            )}
          </div>

          {!isEditingSettings ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400">اسم الأب الروحي:</span>
                <p className="text-sm font-bold text-amber-200">{fatherSettings.fatherName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400">اسم الكنيسة:</span>
                <p className="text-sm font-bold text-stone-100">{fatherSettings.churchName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400">رقم الهاتف للتواصل:</span>
                <p className="text-sm font-bold text-stone-100 font-mono">{fatherSettings.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-[11px] text-stone-400">دورية الاعتراف:</span>
                <p className="text-sm font-bold text-amber-300">{fatherSettings.frequency}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1 sm:col-span-2">
                <span className="text-[11px] text-stone-400">موعد الجلسة القادمة:</span>
                <p className="text-sm font-bold text-emerald-300 font-mono">
                  {fatherSettings.nextAppointment ? new Date(fatherSettings.nextAppointment).toLocaleString('ar-EG') : 'غير محدد'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1 sm:col-span-2">
                <span className="text-[11px] text-stone-400">ملاحظات ومواعيد التواجد في الكنيسة:</span>
                <p className="text-xs text-stone-300 leading-relaxed">{fatherSettings.notes}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={saveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-stone-300 font-bold">اسم الأب الروحي:</label>
                  <input
                    type="text"
                    value={tempSettings.fatherName}
                    onChange={(e) => setTempSettings({ ...tempSettings, fatherName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-300 font-bold">اسم الكنيسة:</label>
                  <input
                    type="text"
                    value={tempSettings.churchName}
                    onChange={(e) => setTempSettings({ ...tempSettings, churchName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-300 font-bold">رقم الهاتف:</label>
                  <input
                    type="text"
                    value={tempSettings.phone}
                    onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-stone-300 font-bold">دورية الاعتراف:</label>
                  <input
                    type="text"
                    value={tempSettings.frequency}
                    onChange={(e) => setTempSettings({ ...tempSettings, frequency: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs text-stone-300 font-bold">موعد الجلسة القادمة:</label>
                  <input
                    type="datetime-local"
                    value={tempSettings.nextAppointment}
                    onChange={(e) => setTempSettings({ ...tempSettings, nextAppointment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-300 font-bold">ملاحظات ومواعيد التواجد في الكنيسة:</label>
                <textarea
                  rows={2}
                  value={tempSettings.notes}
                  onChange={(e) => setTempSettings({ ...tempSettings, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSettings(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-950 text-stone-300 text-xs font-bold hover:bg-stone-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: SPIRITUAL CHAT COMPANION */}
      {activeTab === 'chat' && (
        <div className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-4 animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-spiritual text-lg font-bold text-amber-100">
                💬 الحوار الروحي والإرشاد الشخصي
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                تحدث مع مرشدك الروحي واستقبل إرشاداً أبوياً حكيماً ومستنداً إلى أقوال الآباء.
              </p>
            </div>
            <button
              onClick={() => {
                setChatMessages([
                  {
                    id: 'm-1',
                    sender: 'father',
                    text: 'سلام الرب يكون معك يا ابني/روحي العزيز. أنا هنا دائماً لمرافقتك روحياً وسماع قلبك في نور الإنجيل.',
                    timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
                localStorage.removeItem(CHAT_STORAGE_KEY);
              }}
              className="text-[11px] text-stone-400 hover:text-rose-400 underline cursor-pointer"
            >
              مسح المحادثة
            </button>
          </div>

          <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-stone-950 border border-stone-800">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-950/70 border border-amber-600/40 text-amber-100 rounded-br-none'
                      : 'bg-stone-900 border border-stone-800 text-stone-200 rounded-bl-none font-spiritual'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75 font-mono">
                    <span>{msg.sender === 'user' ? 'أنت' : fatherSettings.fatherName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب سؤالك الروحي أو طلب الإرشاد هنا..."
              className="flex-1 px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-[11px] text-stone-400 self-center">أسئلة مقترحة:</span>
            {[
              'كيف أعالج التشتت في الصلاة؟',
              'كيف أنتصر على الغضب؟',
              'كيف أجد السلام الداخلي؟',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputMessage(q)}
                className="px-3 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-amber-300 text-[11px] border border-stone-800 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONFESSION NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fade-in">
          <form onSubmit={handleAddNote} className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-xl">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              ✍️ تدوين نقطة جديدة لمناقشتها مع أبيك الروحي:
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="عنوان أو موضوع النقاش (مثال: محاربة الغضب، ترتيب وقت المخدع)..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none"
              />
              <textarea
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="التفاصيل أو الأسئلة التي تود عرضها في جلسة الاعتراف..."
                required
                className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ الملاحظة سراً</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="font-spiritual text-base font-bold text-stone-200">
              ملاحظاتك المسجلة ({notes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-2xl border transition space-y-3 flex flex-col justify-between ${
                    n.isDiscussed
                      ? 'bg-stone-950/60 border-emerald-500/50 opacity-75'
                      : 'bg-stone-900 border-stone-800 shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                      <span className="text-amber-400 font-bold">{n.date}</span>
                      <button
                        onClick={() => handleToggleDiscussed(n.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                          n.isDiscussed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                        }`}
                      >
                        {n.isDiscussed ? '✓ تم مناقشتها مع الأب' : 'قيد الانتظار'}
                      </button>
                    </div>

                    <h4 className="font-spiritual text-base font-bold text-amber-100">
                      {n.title}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                      {n.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADVICE */}
      {activeTab === 'advice' && (
        <div className="space-y-6 animate-fade-in">
          <form onSubmit={handleAddAdvice} className="p-6 rounded-3xl bg-stone-900 border border-amber-600/30 space-y-4 shadow-xl">
            <h3 className="font-spiritual text-base font-bold text-amber-200">
              🌿 تسجيل توجيه أو قانون من أبيك الروحي:
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-400">الأب المرشد:</label>
              <input
                type="text"
                value={fatherSettings.fatherName}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 text-xs font-bold"
              />
            </div>

            <textarea
              rows={3}
              value={newAdviceText}
              onChange={(e) => setNewAdviceText(e.target.value)}
              placeholder="اكتب التوجيه، النصيحة، أو القانون الروحي الذي حدده لك أبونا في جلسة التوبة..."
              required
              className="w-full p-4 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ التوجيه الإرشادي</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            <h3 className="font-spiritual text-base font-bold text-stone-200">
              سجل التوجيهات والقوانين الروحية ({adviceList.length})
            </h3>
            <div className="space-y-3">
              {adviceList.map((a) => (
                <div
                  key={a.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-amber-500/30 space-y-2 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono">
                      <span className="font-bold">🌿 إرشاد من: {a.fatherName}</span>
                      <span className="text-stone-400">{a.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-spiritual bg-stone-950 p-4 rounded-xl border border-stone-800">
                      «{a.adviceText}»
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteAdvice(a.id)}
                      className="text-stone-500 hover:text-rose-400 text-xs transition cursor-pointer"
                    >
                      حذف التوجيه
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONSCIENCE CHECKLIST */}
      {activeTab === 'conscience' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              ⚖️ ميزان فحص الضمير قبل الاعتراف
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              أسئلة هادية لفحص القلب ومراجعة النفس أمام الله بصدق واستعداد لسر التوبة.
            </p>
          </div>

          <div className="space-y-3">
            {conscienceItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleConscience(item.id)}
                className={`p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                  item.checked
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-stone-200'
                    : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-300'
                }`}
              >
                <button type="button" className="mt-0.5 text-amber-400 shrink-0">
                  {item.checked ? <CheckSquare className="w-5 h-5 text-emerald-400" /> : <Square className="w-5 h-5 text-stone-600" />}
                </button>
                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded-full font-bold inline-block">
                    {item.category}
                  </span>
                  <p className={`text-xs sm:text-sm leading-relaxed ${item.checked ? 'line-through opacity-75' : ''}`}>
                    {item.question}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: PREP GUIDE */}
      {activeTab === 'prep_guide' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-600/30 shadow-xl space-y-6 text-right animate-fade-in">
          <div className="border-b border-amber-800/40 pb-3">
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              📖 خطوات التحضير لسر التوبة والاعتراف المقدس
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              إرشادات آبائية لجلوس مثمر ومقدس أمام الأب الكاهن في سر الاعتراف.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">1. الصلاة وطلب الاستنارة قبل الذهاب</h4>
              <p>
                اقضِ وقتاً هادئاً في مخدعك قبل الاعتراف، واطلب من الروح القدس أن يكشف لك خطاياك وضعفاتك الخفية بروح التواضع لا بروح اليأس.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">2. الصراحة والوضوح بلا تبرير</h4>
              <p>
                اذكر خطاياك بوضوح وصراحة دون تجميل أو إلقاء اللوم على الظروف أو الآخرين، فالتبرير يمنع نوال قوة الغفران الشافي.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
              <h4 className="font-bold text-amber-300 font-spiritual text-base">3. قبول الإرشاد والقانون بروح الشكر</h4>
              <p>
                استمع لإرشاد أبيك الروحي وقلبه الأبوي كمن يتقبل دواءً شافياً لنفسك، ونفذ القانون أو التدريب المحدد بفرح.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
