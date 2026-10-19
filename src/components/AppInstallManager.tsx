import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Download, RefreshCw, Share, SquarePlus, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed-at';
const INSTALL_DISMISS_DAYS = 7;

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const wasRecentlyDismissed = () => {
  const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_KEY) || 0);
  return Date.now() - dismissedAt < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
};

export default function AppInstallManager() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      const checkForUpdate = async () => {
        if (registration.installing || !navigator.onLine) return;
        const response = await fetch(swUrl, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } }).catch(
          () => null,
        );
        if (response?.status === 200) await registration.update();
      };
      setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate();
      });
    },
  });

  useEffect(() => {
    if (isStandalone()) return;
    setInstallDismissed(wasRecentlyDismissed());
    if (isIos()) setShowIosHint(true);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setShowIosHint(false);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4000);
    return () => clearTimeout(timer);
  }, [offlineReady, setOfflineReady]);

  const handleInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  const dismissInstall = () => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    setInstallDismissed(true);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    await updateServiceWorker(true);
  };

  const canShowInstall = !installDismissed && (installEvent !== null || showIosHint);

  if (needRefresh) {
    return (
      <Banner>
        <div className="flex items-start gap-3">
          <IconBadge>
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </IconBadge>
          <div className="flex-1">
            <p className="font-bold text-amber-100">يتوفر تحديث جديد للتطبيق</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-300">حدِّث الآن للحصول على أحدث الميزات والتحسينات.</p>
          </div>
          <CloseButton onClick={() => setNeedRefresh(false)} label="تأجيل التحديث" />
        </div>
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={handleUpdate} disabled={isUpdating}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {isUpdating ? 'جارٍ التحديث...' : 'تحديث الآن'}
          </PrimaryButton>
          <SecondaryButton onClick={() => setNeedRefresh(false)}>لاحقًا</SecondaryButton>
        </div>
      </Banner>
    );
  }

  if (offlineReady) {
    return (
      <Banner>
        <div className="flex items-center gap-3">
          <IconBadge>
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </IconBadge>
          <p className="flex-1 text-sm font-semibold text-amber-100">التطبيق جاهز للعمل بدون إنترنت</p>
          <CloseButton onClick={() => setOfflineReady(false)} label="إغلاق" />
        </div>
      </Banner>
    );
  }

  if (!canShowInstall) return null;

  return (
    <Banner>
      <div className="flex items-start gap-3">
        <img src="/icons/icon-192.png" alt="" className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="flex-1">
          <p className="font-bold text-amber-100">ثبّت تطبيق حسب قلب الله</p>
          {installEvent ? (
            <p className="mt-1 text-sm leading-relaxed text-stone-300">
              أضِفه إلى شاشتك الرئيسية لفتحه بسرعة كتطبيق مستقل، مع تحديثات تلقائية.
            </p>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-stone-300">
              {'اضغط على زر المشاركة '}
              <Share className="inline h-4 w-4 align-text-bottom text-amber-400" aria-label="مشاركة" />
              {' ثم اختر "إضافة إلى الشاشة الرئيسية" '}
              <SquarePlus className="inline h-4 w-4 align-text-bottom text-amber-400" aria-hidden="true" />
            </p>
          )}
        </div>
        <CloseButton onClick={dismissInstall} label="إغلاق اقتراح التثبيت" />
      </div>
      {installEvent && (
        <div className="mt-4 flex gap-2">
          <PrimaryButton onClick={handleInstall}>
            <Download className="h-4 w-4" aria-hidden="true" />
            تثبيت التطبيق
          </PrimaryButton>
          <SecondaryButton onClick={dismissInstall}>ليس الآن</SecondaryButton>
        </div>
      )}
    </Banner>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      dir="rtl"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-md rounded-2xl border border-amber-600/30 bg-stone-950/95 p-4 text-stone-100 shadow-2xl shadow-black/50 backdrop-blur-md sm:bottom-6"
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
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60"
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
      className="rounded-xl border border-stone-700 px-4 py-2.5 text-sm font-semibold text-stone-300 transition hover:bg-stone-800"
    >
      {children}
    </button>
  );
}
