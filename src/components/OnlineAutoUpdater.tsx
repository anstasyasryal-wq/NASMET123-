import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const OnlineAutoUpdater: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('تم الاتصال بالإنترنت - جاري تحديث المحتوى تلقائياً بالبركة ✝️');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage('✝️ تم استعادة الاتصال بالإنترنت - تم تحديث المحتوى والرسائل الروحية تلقائياً');
      setShowToast(true);

      // Trigger automatic content refresh / sync event
      window.dispatchEvent(new CustomEvent('app-auto-sync', { detail: { timestamp: Date.now() } }));

      // Auto-hide toast after 4 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage('⚠️ أنت تعمل حالياً في وضع غير متصل بالإنترنت - المحفوظات المحلية جاهزة');
      setShowToast(true);

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check for Service Worker updates if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available! Auto refresh silently
                  setToastMessage('✨ توفر إصدار جديد - جاري التحديث التلقائي للبركة...');
                  setShowToast(true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                }
              }
            };
          }
        };
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
          dir="rtl"
        >
          <div className={`shadow-2xl rounded-2xl p-4 flex items-center justify-between border backdrop-blur-md ${
            isOnline 
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-900/40' 
              : 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">
                {isOnline ? '🕊️' : '📶'}
              </span>
              <div>
                <p className="text-xs font-bold font-spiritual">{toastMessage}</p>
                <p className="text-[10px] opacity-80">
                  {isOnline ? 'مزامنة فورية للبيانات والرسائل والمسابقات' : 'يعمل بسلاسة بدون انترنت'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              إخفاء
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnlineAutoUpdater;
