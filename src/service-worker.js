importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

if (workbox) {
  workbox.routing.registerRoute(
    // Cache CSS files.
    /\.css$/,
    // Use cache but update in the background.
    new workbox.strategies.StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'css-cache',
    })
  )
  workbox.routing.registerRoute(
    // Cache CSS files.
    /\.js$/,
    // Use cache but update in the background.
    new workbox.strategies.StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'js-cache',
    })
  )
  workbox.routing.registerRoute(
    // Cache CSS files.
    /\.html$/,
    // Use cache but update in the background.
    new workbox.strategies.StaleWhileRevalidate({
      // Use a custom cache name.
      cacheName: 'html-cache',
    })
  )
  workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
      // Use a custom cache name.
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images.
          maxEntries: 20,
          // Cache for a maximum of a week.
          maxAgeSeconds: 7 * 24 * 60 * 60,
        })
      ],
    })
  )
  workbox.precaching.precacheAndRoute([])
} else {
  console.log('Boo! Workbox didn\'t load 😬');
}