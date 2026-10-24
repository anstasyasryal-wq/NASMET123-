import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import {
  Download,
  RefreshCw,
  Share2,
  X,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed-at';
const INSTALL_DISMISS_DAYS = 7;

export const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

export const isIos = () => {
  if (typeof window === 'undefined') return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
};

const wasRecentlyDismissed = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_KEY) || 0);
    return Date.now() - dismissedAt < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

export default function AppInstallManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      const checkForUpdate = async () => {
        if (registration.installing || !navigator.onLine) return;
        const response = await fetch(swUrl, {
          cache: 'no-store',
          headers: { 'cache-control': 'no-cache' },
        }).catch(() => null);
        if (response?.status === 200) await registration.update();
      };
      setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    },
  });

  useEffect(() => {
    // Determine platform
    if (isIos()) {
      setActiveTab('ios');
    } else if (isAndroid()) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }

    if (isStandalone()) {
      setInstallDismissed(true);
      return;
    }

    setInstallDismissed(wasRecentlyDismissed());

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstallEvent(null);
      setShowInstallModal(false);
    };

    const handleOpenInstallPrompt = () => {
      if (installEvent) {
        installEvent.prompt().then(() => {
          return installEvent.userChoice;
        }).then((choice) => {
          if (choice.outcome === 'accepted') {
            setInstallEvent(null);
          }
        }).catch(() => {
          setShowInstallModal(true);
        });
      } else {
        setShowInstallModal(true);
      }
    };

    const handleOpenShareModal = () => {
      setShowShareModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('show-install-prompt', handleOpenInstallPrompt);
    window.addEventListener('show-share-modal', handleOpenShareModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('show-install-prompt', handleOpenInstallPrompt);
      window.removeEventListener('show-share-modal', handleOpenShareModal);
    };
  }, [installEvent]);

  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  const handleNativeInstall = async () => {
    if (!installEvent) {
      setShowInstallModal(true);
      return;
    }
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallEvent(null);
        setShowInstallModal(false);
      }
    } catch {
      setShowInstallModal(true);
    }
  };

  const dismissBanner = () => {
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    } catch {}
    setInstallDismissed(true);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateServiceWorker(true);
  };

  const shareData = {
    title: 'تطبيق حسب قلب الله',
    text: 'تطبيق «حسب قلب الله» - المنصة القبطية الأرثوذكسية الشاملة للتكريس والعلوم الكنسية والتقييم الروحي',
    url: typeof window !== 'undefined' ? window.location.origin : '',
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setShowShareModal(false);
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    // Fallback: Copy link
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback input copy
      const input = document.createElement('input');
      input.value = shareData.url || window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = encodeURIComponent(shareData.text);
    const url = encodeURIComponent(shareData.url);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  // 1. Update Notification Banner
  if (needRefresh) {
    return (
      <Banner>
        <div className="flex items-start gap-3">
          <IconBadge>
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </IconBadge>
          <div className="flex-1 text-right">
            <p className="font-bold text-amber-100">يتوفر تحديث جديد للتطبيق</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-300">حدِّث الآن للحصول على أحدث الميزات والمحتوى الروحي المحفوظ.</p>
          </div>
          <CloseButton onClick={() => setNeedRefresh(false)} label="تأجيل التحديث" />
        </div>
        <div className="mt-3 flex gap-2">
          <PrimaryButton onClick={handleUpdate} disabled={isUpdating}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {isUpdating ? 'جارٍ التحديث...' : 'تحديث الآن'}
          </PrimaryButton>
          <SecondaryButton onClick={() => setNeedRefresh(false)}>لاحقًا</SecondaryButton>
        </div>
      </Banner>
    );
  }

  // 2. Offline Ready Banner
  if (offlineReady) {
    return (
      <Banner>
        <div className="flex items-center gap-3">
          <IconBadge>
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </IconBadge>
          <p className="flex-1 text-sm font-semibold text-amber-100 text-right">
            التطبيق جاهز للعمل بدون إنترنت (Offline Mode)
          </p>
          <CloseButton onClick={() => setOfflineReady(false)} label="إغلاق" />
        </div>
      </Banner>
    );
  }

  const showAmbientBanner = !installDismissed && !isStandalone();

  return (
    <>
      {/* 3. Ambient Install Banner for mobile / new visitors */}
      {showAmbientBanner && (
        <Banner>
          <div className="flex items-start gap-3">
            <img
              src="/icons/icon-192.png"
              alt="شعار حسب قلب الله"
              className="h-11 w-11 shrink-0 rounded-xl border border-amber-500/40 shadow-sm"
            />
            <div className="flex-1 text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-100 text-sm">تثبيت تطبيق حسب قلب الله</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">مجاني</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-stone-300">
                ثبّت التطبيق على شاشتك لفتحه فورًا كتطبيق مستقل وسريع وبدون إنترنت.
              </p>
            </div>
            <CloseButton onClick={dismissBanner} label="إغلاق اقتراح التثبيت" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <PrimaryButton onClick={handleNativeInstall}>
              <Download className="h-4 w-4" aria-hidden="true" />
              تثبيت الآن
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-stone-800"
            >
              <Share2 className="h-3.5 w-3.5" />
              مشاركة
            </button>
            <SecondaryButton onClick={dismissBanner}>لاحقًا</SecondaryButton>
          </div>
        </Banner>
      )}

      {/* 4. Complete Step-by-Step Install Modal (Platform Adaptive) */}
      {showInstallModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in text-right"
        >
          <div className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-stone-950 p-5 sm:p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100">تثبيت التطبيق على جهازك</h3>
                  <p className="text-[11px] text-amber-400/80">يعمل كأي تطبيق أصلي على أندرويد والآيفون والكمبيوتر</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Direct Native Install Button if event is available */}
            {installEvent && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-300">متصفحك يدعم التثبيت المباشر بنقرة واحدة</p>
                  <p className="text-[11px] text-stone-300">اضغط الزر لتثبيته فورًا على شاشتك الرئيسية</p>
                </div>
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition shrink-0 shadow-xs"
                >
                  <Download className="h-4 w-4" />
                  تثبيت الآن
                </button>
              </div>
            )}

            {/* Platform Selector Tabs */}
            <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeTab === 'android' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                📱 أندرويد (Android)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeTab === 'ios' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                🍎 آيفون وآيباد (iOS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  activeTab === 'desktop' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                💻 كمبيوتر / ماك
              </button>
            </div>

            {/* Step-by-Step Instructions based on Platform */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 space-y-3">
              {activeTab === 'android' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>افتح الرابط في متصفح <strong>Google Chrome</strong> على هاتفك.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>اضغط على قائمة الخيارات <strong>(الثلاث نقاط ⋮)</strong> بأعلى أو أسفل الشاشة.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>اختر <strong>«تثبيت التطبيق» (Install App)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">4</span>
                    <p>سيظهر التطبيق كأيقونة مستقلة كاملة الشاشة مع كل بياناتك الروحية بدون إنترنت.</p>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>افتح الرابط في متصفح <strong>Safari</strong> على الآيفون أو الآيباد.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>اضغط على زر المشاركة بالأسفل <strong>(مربع به سهم لأعلى ⬆️)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>مرر للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen ➕)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">4</span>
                    <p>اضغط <strong>«إضافة» (Add)</strong> بأعلى اليمين، وسيصبح التطبيق موجوداً على هاتفك.</p>
                  </div>
                </div>
              )}

              {activeTab === 'desktop' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>في متصفح Chrome أو Edge، انظر إلى شريط العنوان في الأعلى جهة اليسار/اليمين.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>اضغط على أيقونة التثبيت <strong>(شاشة بها سهم 💻 أو علامة ⊕)</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>اختر <strong>«تثبيت»</strong> وسيفتح التطبيق في نافذة مستقلة وسريعة كأي برنامج على جهازك.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions at Bottom of Modal */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setShowInstallModal(false);
                  setShowShareModal(true);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 py-2.5 px-3 text-xs font-bold text-stone-950 transition cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                مشاركة رابط التطبيق للآخرين
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900 py-2.5 px-4 text-xs font-bold text-stone-200 hover:bg-stone-800 transition"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Share App Modal */}
      {showShareModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in text-right"
        >
          <div className="w-full max-w-md rounded-3xl border border-amber-500/40 bg-stone-950 p-5 sm:p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100">مشاركة تطبيق «حسب قلب الله»</h3>
                  <p className="text-[11px] text-amber-400/80">شاركه مع آباء الكهنة والمكرسين والمخدومين</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Share Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/40 bg-emerald-950/40 hover:bg-emerald-900/50 p-3 text-emerald-200 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                <span>واتساب (WhatsApp)</span>
              </button>

              <button
                type="button"
                onClick={shareViaTelegram}
                className="flex items-center justify-center gap-2 rounded-2xl border border-sky-600/40 bg-sky-950/40 hover:bg-sky-900/50 p-3 text-sky-200 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Send className="h-5 w-5 text-sky-400" />
                <span>تيليجرام (Telegram)</span>
              </button>
            </div>

            {/* Native Mobile Share Button */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-500 p-3 text-stone-950 text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Smartphone className="h-4 w-4" />
              <span>مشاركة عبر قائمة الهاتف (فيسبوك، ماسنجر، بريد...)</span>
            </button>

            {/* Copy Link Input Bar */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-3 space-y-2">
              <span className="text-[11px] font-bold text-amber-400/80 block">رابط التطبيق المباشر:</span>
              <div className="flex items-center gap-2 bg-stone-950 rounded-xl p-1.5 border border-stone-800">
                <input
                  type="text"
                  readOnly
                  value={shareData.url || (typeof window !== 'undefined' ? window.location.href : '')}
                  className="flex-1 bg-transparent px-2 text-xs text-stone-300 font-mono outline-hidden select-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shrink-0 ${
                    copiedLink ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  }`}
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedLink ? 'تم النسخ!' : 'نسخ'}
                </button>
              </div>
            </div>

            <div className="text-center pt-1">
              <p className="text-[11px] text-stone-400">
                «كُونُوا مُشْتَرِكِينَ فِي احْتِيَاجَاتِ الْقِدِّيسِينَ» (رو 12: 13)
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      dir="rtl"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-md rounded-2xl border border-amber-600/30 bg-stone-950/95 p-3.5 sm:p-4 text-stone-100 shadow-2xl shadow-black/50 backdrop-blur-md sm:bottom-6"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950">
      {children}
    </div>
  );
}

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-lg p-1 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100"
    >
      <X className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60 cursor-pointer"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 transition hover:bg-stone-800 cursor-pointer"
    >
      {children}
    </button>
  );
}
