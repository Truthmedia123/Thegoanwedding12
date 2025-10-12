module.exports = {
  globDirectory: "dist/public",
  globPatterns: [
    "**/*.{html,js,css,png,jpg,jpeg,svg,ico,json,woff,woff2,ttf,eot}"
  ],
  swDest: "dist/public/service-worker.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.algolia(net\.com|\.net)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'algolia',
        expiration: {
          maxEntries: 30,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
};