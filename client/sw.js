self.addEventListener('install', (event) => {
    //...
});

self.addEventListener('activate', (event) => {
    //...
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) { //entry found in cache
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

self.addEventListener('push', (event) => {
  console.log('Received a push event', event)
  const options = {
    title: 'I got a message for you!',
    body: 'Here is the body of the message',
    icon: '/img/icon-192x192.png',
    tag: 'tag-for-this-notification',
  }
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})
