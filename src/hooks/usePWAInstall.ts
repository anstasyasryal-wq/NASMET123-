import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  );
}

export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /android/.test(window.navigator.userAgent.toLowerCase());
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => isStandaloneMode());
  const [isIOS, setIsIOS] = useState<boolean>(() => isIosDevice());
  const [isAndroid, setIsAndroid] = useState<boolean>(() => isAndroidDevice());
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  useEffect(() => {
    setIsInstalled(isStandaloneMode());
    setIsIOS(isIosDevice());
    setIsAndroid(isAndroidDevice());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
    };

    const handleOpenInstallPrompt = () => {
      if (deferredPrompt) {
        deferredPrompt
          .prompt()
          .then(() => deferredPrompt.userChoice)
          .then((choice) => {
            if (choice.outcome === 'accepted') {
              setIsInstalled(true);
              setDeferredPrompt(null);
            }
          })
          .catch(() => {
            setShowInstallModal(true);
          });
      } else {
        setShowInstallModal(true);
      }
    };

    const handleOpenShare = () => {
      setShowShareModal(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('show-install-prompt', handleOpenInstallPrompt);
    window.addEventListener('show-share-modal', handleOpenShare);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('show-install-prompt', handleOpenInstallPrompt);
      window.removeEventListener('show-share-modal', handleOpenShare);
    };
  }, [deferredPrompt]);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      setShowInstallModal(true);
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        setShowInstallModal(false);
        return true;
      }
    } catch {
      setShowInstallModal(true);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    deferredPrompt,
    showInstallModal,
    setShowInstallModal,
    showShareModal,
    setShowShareModal,
    install,
  };
}
