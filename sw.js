/* =====================================================================
   Straight Drive Terminal — service worker
   - Keeps a copy of the app so it opens instantly and works offline.
   - Never updates by itself: the page asks for an update ("Update now"),
     then this worker downloads the new files and the page reloads.
   ===================================================================== */
'use strict';

const CACHE = 'sd-terminal-app';
const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

/* Download every app file fresh from GitHub (skip browser and CDN caches). */
async function downloadAppFiles() {
  const stamp = Date.now();
  const responses = await Promise.all(APP_FILES.map(async (file) => {
    const url = new URL(file, self.registration.scope);
    url.searchParams.set('v', stamp);
    const response = await fetch(url, { cache: 'reload' });
    if (!response.ok) throw new Error(file + ' → HTTP ' + response.status);
    return [file, response];
  }));
  /* Store only after ALL files arrived, so the app is never half-updated. */
  const cache = await caches.open(CACHE);
  await Promise.all(responses.map(([file, response]) => cache.put(new URL(file, self.registration.scope).href, response)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(downloadAppFiles().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;           /* Fonts etc.: normal browser handling. */
  if (url.pathname.endsWith('/version.json')) return;         /* Update check always asks GitHub. */

  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true }) ||
      (request.mode === 'navigate' ? await caches.match(new URL('./index.html', self.registration.scope).href) : undefined);
    if (cached) return cached;
    try {
      return await fetch(request);
    } catch (e) {
      const fallback = await caches.match(new URL('./index.html', self.registration.scope).href);
      if (fallback && request.mode === 'navigate') return fallback;
      throw e;
    }
  })());
});

/* The page sends { type: 'UPDATE_APP' } when the user clicks "Update now". */
self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'UPDATE_APP') return;
  const reply = (message) => { if (event.ports[0]) event.ports[0].postMessage(message); };
  event.waitUntil(downloadAppFiles().then(() => reply({ ok: true }), (e) => reply({ ok: false, error: String(e && e.message || e) })));
});
