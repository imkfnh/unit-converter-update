const cacheName = "unit-converter-v2";

// Must exist, or install fails
const coreFiles = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./header.jpeg"
];

// Nice to have: a missing one won't break install
const categoryIcons = [
  "volume", "temperature", "weight", "speed",
  "timezone", "length", "currency", "area"
].map(name => `./icons/${name}.png`);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(async cache => {
      await cache.addAll(coreFiles);
      await Promise.allSettled(categoryIcons.map(url => cache.add(url)));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
