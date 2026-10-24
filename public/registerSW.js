if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Check for updates periodically
        setInterval(() => {
          if (registration && !registration.installing && navigator.onLine) {
            registration.update().catch(() => {});
          }
        }, 60 * 60 * 1000);
      })
      .catch(() => {
        // Ignore registration failures in unsupported/restricted environments
      });
  });
}
