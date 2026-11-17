// Cauldron PWA Service Worker
const CACHE_NAME = 'cauldron-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Push notification event for web push
self.addEventListener('push', (event) => {
  let data = {
    title: '🫙 Cauldron',
    body: 'Your spiritual insight is ready.',
    url: '/cauldron/',
  };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/cauldron/icon-192.png',
    badge: '/cauldron/icon-192.png',
    vibrate: [100, 200, 100, 200],
    data: {
      url: data.url || '/cauldron/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🫙 Cauldron', options)
  );
});

// Click event for web notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/cauldron/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/cauldron') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
