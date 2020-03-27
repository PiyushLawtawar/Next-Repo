importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
const WEEK = 60 * 60 * 24 * 7;


// Cleanup outdated caches
workbox.precaching.cleanupOutdatedCaches();

// Keep empty for build process to populated runtime caches
workbox.precaching.precacheAndRoute([]);

// Precaching static assets
workbox.precaching.precacheAndRoute([
  'https://assetspwasit.liverpool.com.mx/static/css/owl.css',
  'https://assetspwasit.liverpool.com.mx/static/css/bootstrap.css',
  'https://assetspwasit.liverpool.com.mx/static/css/material-components-web.min.css',
  'https://assetspwasit.liverpool.com.mx/static/js/lazyload.min.js',
  'https://assetspwasit.liverpool.com.mx/static/js/babel-polyfill.min.js',
  '/tienda/paginas/offline'
]);


//Cache Footer ajax all, Departments Menu, Home page Carosuel
workbox.routing.registerRoute(
  new RegExp('(?:getFooter\??(?:&?[^=&]*=[^=&]*)*|getCarouselHome\??(?:&?[^=&]*=[^=&]*)*|getDepartments\??(?:&?[^=&]*=[^=&]*)*|getCarouselContent\??(?:&?[^=&]*=[^=&]*)*)|getheader\??(?:&?[^=&]*=[^=&]*)*'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pageAssets',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: WEEK
      })
    ]
  })
);

// Cache buildJS
workbox.routing.registerRoute(
  new RegExp('chunks/commons([^\)]+?\.(js)[^"]*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'buildJS',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: WEEK,
        maxEntries: 30,
      })
    ]
  })
);
// Cache font files
workbox.routing.registerRoute(
  new RegExp('([^\)]+?\.(woff|eot|woff2|ttf|svg)[^"]*)'),
  new workbox.strategies.CacheFirst({
    cacheName: 'fontsAsset',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: WEEK,
        maxEntries: 30,
      })
    ]
  })
);

//Login to handle offline response. Register required URLs for network only
workbox.routing.registerRoute(
  new RegExp('(\/tienda\/home)|(\/tienda\/pdp\/)|(\/tienda\/hp\/)|(\/tienda\/.+\/cat)|(\/tienda\/group\/)|(\/tienda(.*)s=)'),
  new workbox.strategies.NetworkOnly()
 );

// If network call fails catch handler returns offline page to browser
workbox.routing.setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      return caches.match(workbox.precaching.getCacheKeyForURL('/tienda/paginas/offline'));
    break;

    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});
