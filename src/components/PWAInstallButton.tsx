import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'prominent' | 'icon-only';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstalled, install, setShowInstallModal } = usePWAInstall();
  const { t } = useLanguage();

  // If already installed as a standalone PWA, do not show install prompt
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    install();
  };

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition cursor-pointer touch-manipulation active:scale-95 shadow-xs ${className}`}
        title={t('installApp')}
        aria-label={t('installApp')}
      >
        <Download className="w-4 h-4 text-amber-400" />
      </button>
    );
  }

  if (variant === 'prominent') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer touch-manipulation active:scale-95 ${className}`}
      >
        <Download className="w-4 h-4 text-stone-950" />
        <span>{t('installAppPrompt')}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 transition cursor-pointer shrink-0 touch-manipulation active:scale-95 shadow-xs text-xs font-bold ${className}`}
      title={t('installApp')}
      aria-label={t('installApp')}
    >
      <Download className="w-4 h-4 text-amber-400 shrink-0" />
      <span>{t('installApp')}</span>
    </button>
  );
};

export default PWAInstallButton;
