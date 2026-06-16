const CACHE_NAME = 'b2b-hub-cache-v1';
const API_BASE = '/api';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(API_BASE + '/properties') && event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  if (event.request.url.includes(API_BASE + '/sync') && event.request.method === 'POST') {
    if (!navigator.onLine) {
      event.respondWith(new Response(JSON.stringify({ status: 'queued_offline' }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
    return;
  }
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'TRIGGER_SYNC') {
    triggerSync();
  }
});

async function triggerSync() {
  const request = indexedDB.open('b2b-hub-offline', 1);

  request.onsuccess = async () => {
    const db = request.result;
    const tx = db.transaction('pending-sync', 'readonly');
    const store = tx.objectStore('pending-sync');
    const entries = await new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
    });

    if (!Array.isArray(entries) || entries.length === 0) return;

    try {
      const response = await fetch(API_BASE + '/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries: entries.map((e) => ({
            client_id: e.client_id,
            amount: e.amount,
            currency: e.currency,
            description: e.description,
            client_created_at: e.client_created_at,
          })),
        }),
      });

      if (response.ok) {
        const clearTx = db.transaction('pending-sync', 'readwrite');
        clearTx.objectStore('pending-sync').clear();
        const result = await response.json();
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ type: 'SYNC_COMPLETE', count: result.count });
          });
        });
      }
    } catch (err) {
      console.error('Sync failed from SW:', err);
    }
  };
}
