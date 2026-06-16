export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New SW version available');
              }
            });
          }
        });
      },
      (err) => console.error('SW registration failed:', err)
    );

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SYNC_COMPLETE') {
        console.log('Background sync completed:', event.data.count, 'entries');
        window.dispatchEvent(new CustomEvent('sync-complete', { detail: event.data }));
      }
    });

    window.addEventListener('online', () => {
      console.log('Back online, triggering sync...');
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_SYNC' });
      }
    });
  }
}
