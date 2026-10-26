if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Clean up any stale/broken service workers from previous iframe loads
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          if (registration.active && !registration.active.scriptURL.includes('/sw.js')) {
            registration.unregister().catch(() => {});
          }
        }
      }).catch(() => {});

      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          setInterval(() => {
            if (registration && !registration.installing && navigator.onLine) {
              registration.update().catch(() => {});
            }
          }, 60 * 60 * 1000);
        })
        .catch(() => {
          // Ignore registration failures in restricted iframe environments
        });
    } catch (e) {
      // Ignore security errors in restricted iframe
    }
  });
}
