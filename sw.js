self.addEventListener('install', function(event) {
    console.log('ServiceWorker installed');
});

self.addEventListener('activate', function(event) {
    console.log('ServiceWorker activated');
});