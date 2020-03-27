module.exports = {
  "globDirectory": "build",
  "globPatterns": [ '**/*.css' ],
  "globIgnores": [
    "**/server/**/*",
    "**/static/**/*",
    "*"
   ],
  "swDest": "build/service-worker.js",
  "swSrc": "static/workbox-sit.js",
  modifyURLPrefix: {
     'client/styles': '/_next/client/styles'
  }
};
