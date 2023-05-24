self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  const precacheResources = ['/', '/index.html', '/app.js', '/style/cards.css', '/style/navbar.css', '/icons-grey/manifest-icon-512.maskable.png'];
  event.waitUntil(
    caches.open('pinterest-cache')
    .then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    // Open the cache
    caches.open('pinterest-cache').then((cache) => {
      // Go to the network first
      return fetch(event.request.url, { mode: "cors", cache: "default" }).then((response) => {
        cache.put(event.request, response.clone());
        return response;
      }).catch(() => {
        // If the network is unavailable, get
        return caches.match(event.request).then((response) => {
          if (!response && event.request.destination === 'image') {
            return caches.match('icons-grey/manifest-icon-192.maskable.png')
          }
          return response;
        });
      });
    })
  );
});

// Receive a Push event
self.addEventListener('push', (event) => {
  console.log('Received a push event', event.data.json())
  const data =  event.data.json()
  console.log(data);
  const promiseChain = self.registration.showNotification(data.title, data)
  event.waitUntil(promiseChain)
})

