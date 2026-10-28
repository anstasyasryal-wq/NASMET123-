import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLanguage } from '../context/LanguageContext';
import {
  getPublicShareUrl,
  copyPublicShareLink,
  openWhatsAppShare,
  openTelegramShare,
  openFacebookShare,
  shareNatively,
} from '../utils/shareHelper';
import {
  Download,
  RefreshCw,
  Share2,
  X,
  CheckCircle2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

const UPDATE_CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes
const INSTALL_DISMISSED_KEY = 'pwa-install-dismissed-at';
const INSTALL_DISMISS_DAYS = 5;

export const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
};

export const isIos = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
};

const wasRecentlyDismissed = (): boolean => {
  try {
    const dismissedAt = Number(localStorage.getItem(INSTALL_DISMISSED_KEY) || 0);
    return Date.now() - dismissedAt < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

export default function AppInstallManager() {
  const { t, language, dir, isRTL } = useLanguage();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showOfflineToast, setShowOfflineToast] = useState<boolean>(false);

  // Auto-Update registration using VitePWA workbox-window hook
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return;
      const checkForUpdate = async () => {
        if (registration.installing || !navigator.onLine) return;
        try {
          const response = await fetch(swUrl, {
            cache: 'no-store',
            headers: { 'cache-control': 'no-cache' },
          });
          if (response?.status === 200) {
            await registration.update();
          }
        } catch {
          // Ignore network check errors
        }
      };

      // Periodic check
      const intervalId = setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);

      // Visibility change trigger (throttled to avoid mobile flickering or network flooding)
      let lastCheck = Date.now();
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && Date.now() - lastCheck > 10 * 60 * 1000) {
          lastCheck = Date.now();
          checkForUpdate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(intervalId);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    },
    onRegisterError(error) {
      // Quiet fail in restricted preview iframes
      console.debug('[PWA] SW register notice:', error);
    },
  });

  useEffect(() => {
    // Detect device platform for default tab
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
        installEvent
          .prompt()
          .then(() => installEvent.userChoice)
          .then((choice) => {
            if (choice.outcome === 'accepted') {
              setInstallEvent(null);
            }
          })
          .catch(() => {
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

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(true);
      const timer = setTimeout(() => setShowOfflineToast(false), 4500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setShowOfflineToast(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline ready auto-dismiss
  useEffect(() => {
    if (!offlineReady) return;
    const timer = setTimeout(() => setOfflineReady(false), 4500);
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
    try {
      await updateServiceWorker(true);
    } catch {
      window.location.reload();
    }
  };

  const publicShareUrl = getPublicShareUrl();

  const shareData = {
    title: t('appTitle'),
    text: `${t('appTitle')} - ${t('appSubtitle')}`,
    url: publicShareUrl,
  };

  const handleNativeShare = async () => {
    const success = await shareNatively(language === 'en' ? 'en' : 'ar');
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyPublicShareLink(language === 'en' ? 'en' : 'ar');
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const shareViaWhatsApp = () => {
    openWhatsAppShare(language === 'en' ? 'en' : 'ar');
  };

  const shareViaTelegram = () => {
    openTelegramShare(language === 'en' ? 'en' : 'ar');
  };

  const shareViaFacebook = () => {
    openFacebookShare(language === 'en' ? 'en' : 'ar');
  };

  // 1. Auto-Update Notification Banner (New Version Available)
  if (needRefresh) {
    return (
      <Banner dir={dir}>
        <div className="flex items-start gap-3">
          <IconBadge>
            <RefreshCw className={`h-5 w-5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </IconBadge>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="font-bold text-amber-100 text-sm">{t('updateAvailable')}</p>
            <p className="mt-1 text-xs leading-relaxed text-stone-300">{t('updateDesc')}</p>
          </div>
          <CloseButton onClick={() => setNeedRefresh(false)} label={t('dismiss')} />
        </div>
        <div className="mt-3 flex gap-2">
          <PrimaryButton onClick={handleUpdate} disabled={isUpdating}>
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isUpdating ? t('updating') : t('updateNow')}
          </PrimaryButton>
          <SecondaryButton onClick={() => setNeedRefresh(false)}>{t('installLater')}</SecondaryButton>
        </div>
      </Banner>
    );
  }

  // 2. Offline Ready Banner
  if (offlineReady) {
    return (
      <Banner dir={dir}>
        <div className="flex items-center gap-3">
          <IconBadge>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </IconBadge>
          <p className={`flex-1 text-xs sm:text-sm font-semibold text-amber-100 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('offlineReadyNotice')}
          </p>
          <CloseButton onClick={() => setOfflineReady(false)} label={t('close')} />
        </div>
      </Banner>
    );
  }

  const showAmbientBanner = !installDismissed && !isStandalone();

  return (
    <>
      {/* 3. Ambient Install Banner for mobile / new visitors */}
      {showAmbientBanner && (
        <Banner dir={dir}>
          <div className="flex items-start gap-3">
            <img
              src="/icons/icon-192.png"
              alt="شعار حسب قلب الله"
              className="h-11 w-11 shrink-0 rounded-xl border border-amber-500/40 shadow-sm"
              onError={(e) => {
                // Fallback to svg if png fails
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-100 text-sm">{t('appTitle')}</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                  {t('installFree')}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-stone-300">
                {t('installAppDesc')}
              </p>
            </div>
            <CloseButton onClick={dismissBanner} label={t('close')} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <PrimaryButton onClick={handleNativeInstall}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('installNow')}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-stone-800 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{t('share')}</span>
            </button>
            <SecondaryButton onClick={dismissBanner}>{t('installLater')}</SecondaryButton>
          </div>
        </Banner>
      )}

      {/* 4. Complete Step-by-Step Install Modal (Platform Adaptive) */}
      {showInstallModal && (
        <div
          role="dialog"
          aria-modal="true"
          dir={dir}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className={`w-full max-w-lg rounded-3xl border border-amber-500/40 bg-stone-950 p-5 sm:p-6 text-stone-100 shadow-2xl space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100">{t('installAppTitle')}</h3>
                  <p className="text-[11px] text-amber-400/80">{t('installAppDesc')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition cursor-pointer"
                aria-label={t('close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Direct Native Install Button if browser event is available */}
            {installEvent && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 flex items-center justify-between gap-3">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-xs font-bold text-emerald-300">{t('installSupportedDirect')}</p>
                  <p className="text-[11px] text-stone-300">{t('installDirectHint')}</p>
                </div>
                <button
                  type="button"
                  onClick={handleNativeInstall}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white transition shrink-0 shadow-xs cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  {t('installNow')}
                </button>
              </div>
            )}

            {/* Platform Selector Tabs */}
            <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'android' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t('installTabAndroid')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'ios' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t('installTabIOS')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'desktop' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t('installTabDesktop')}
              </button>
            </div>

            {/* Step-by-Step Instructions based on Selected Platform */}
            <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4 space-y-3">
              {activeTab === 'android' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>{t('androidStep1')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>{t('androidStep2')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>{t('androidStep3')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">4</span>
                    <p>{t('androidStep4')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>{t('iosStep1')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>{t('iosStep2')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>{t('iosStep3')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">4</span>
                    <p>{t('iosStep4')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'desktop' && (
                <div className="space-y-2.5 text-xs text-stone-200">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">1</span>
                    <p>{t('desktopStep1')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">2</span>
                    <p>{t('desktopStep2')}</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-stone-950">3</span>
                    <p>{t('desktopStep3')}</p>
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
                <span>{t('shareApp')}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-stone-700 bg-stone-900 py-2.5 px-4 text-xs font-bold text-stone-200 hover:bg-stone-800 transition cursor-pointer"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copiedLink ? t('copiedLink') : t('copyLink')}</span>
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
          dir={dir}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in"
        >
          <div className={`w-full max-w-md rounded-3xl border border-amber-500/40 bg-stone-950 p-5 sm:p-6 text-stone-100 shadow-2xl space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-md">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-100">{t('shareTitle')}</h3>
                  <p className="text-[11px] text-amber-400/80">{t('shareSubtitle')}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition cursor-pointer"
                aria-label={t('close')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Share Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-600/40 bg-emerald-950/40 hover:bg-emerald-900/50 p-3 text-emerald-200 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="h-5 w-5 text-emerald-400" />
                <span>{t('shareWhatsApp')}</span>
              </button>

              <button
                type="button"
                onClick={shareViaTelegram}
                className="flex items-center justify-center gap-2 rounded-2xl border border-sky-600/40 bg-sky-950/40 hover:bg-sky-900/50 p-3 text-sky-200 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <Send className="h-5 w-5 text-sky-400" />
                <span>{t('shareTelegram')}</span>
              </button>
            </div>

            {/* Facebook Share Button */}
            <button
              type="button"
              onClick={shareViaFacebook}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-blue-600/40 bg-blue-950/40 hover:bg-blue-900/50 p-2.5 text-blue-200 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <ExternalLink className="h-4 w-4 text-blue-400" />
              <span>{language === 'ar' ? 'مشاركة على فيسبوك (Facebook)' : 'Share on Facebook'}</span>
            </button>

            {/* Native Mobile Share Button */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 p-3 text-stone-950 text-xs font-bold transition shadow-md cursor-pointer active:scale-95"
            >
              <Smartphone className="h-4 w-4" />
              <span>{t('shareMobileNative')}</span>
            </button>

            {/* Open Protection & Direct Public Link Bar */}
            <div className="rounded-2xl border border-amber-500/40 bg-stone-900/90 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{t('appDirectLink')}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{language === 'ar' ? 'حماية مفتوحة للجميع' : 'Public & Open'}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-stone-950 rounded-xl p-1.5 border border-stone-800">
                <input
                  type="text"
                  readOnly
                  value={shareData.url}
                  className="flex-1 bg-transparent px-2 text-xs text-stone-300 font-mono outline-hidden select-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shrink-0 cursor-pointer ${
                    copiedLink ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  }`}
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? t('copiedLink') : t('copy')}</span>
                </button>
              </div>
              <p className="text-[10px] text-stone-400">
                {language === 'ar'
                  ? 'هذا الرابط المباشر يعمل على جميع الهواتف والمتصفحات ولا يتطلب أي إذن مسبق أو حساب مطور.'
                  : 'This direct link works on all mobile phones and browsers with no login barriers.'}
              </p>
            </div>

            <div className="text-center pt-1">
              <p className="text-[11px] text-stone-400 italic">
                {t('shareVerse')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offline / Online Status Toast Notification */}
      {showOfflineToast && (
        <div
          role="status"
          aria-live="polite"
          dir={dir}
          className="fixed inset-x-3 bottom-3 z-[125] mx-auto max-w-md rounded-2xl border border-amber-600/40 bg-stone-950/95 p-3.5 sm:p-4 text-stone-100 shadow-2xl shadow-black/60 backdrop-blur-md animate-fade-in sm:bottom-6"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-stone-950 font-bold ${
              isOnline ? 'bg-emerald-400' : 'bg-amber-500'
            }`}>
              {isOnline ? '🌐' : '📶'}
            </div>
            <div className={`flex-1 space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="font-bold text-amber-100 text-xs sm:text-sm">
                {isOnline ? t('onlineRestored') : t('offlineRunningNotice')}
              </p>
              <p className="text-[11px] leading-relaxed text-stone-300">
                {isOnline ? t('onlineSynced') : t('offlineFeaturesNotice')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOfflineToast(false)}
              className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition cursor-pointer"
              aria-label={t('close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Banner({ children, dir }: { children: React.ReactNode; dir?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      dir={dir || 'rtl'}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-md rounded-2xl border border-amber-600/30 bg-stone-950/95 p-3.5 sm:p-4 text-stone-100 shadow-2xl shadow-black/50 backdrop-blur-md sm:bottom-6 animate-fade-in"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {children}
    </div>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 shadow-xs">
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
      className="rounded-lg p-1 text-stone-400 transition hover:bg-stone-800 hover:text-stone-100 cursor-pointer"
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
      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 transition hover:bg-amber-400 disabled:opacity-60 cursor-pointer shadow-xs active:scale-95"
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
      className="rounded-xl border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 transition hover:bg-stone-800 cursor-pointer active:scale-95"
    >
      {children}
    </button>
  );
}
