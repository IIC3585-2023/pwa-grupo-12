self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  const precacheResources = ['/', '/index.html', '/app.js', '/style/cards.css', '/style/navbar.css'];
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
      return fetch(event.request.url).then((response) => {
        cache.put(event.request, response.clone());
        return response;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request);
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

