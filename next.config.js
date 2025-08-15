/** @type {import('next').NextConfig} */
// const { setupDevPlatform } = require('@cloudflare/next-on-pages/next-dev');
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: isDev,
    loader: 'custom',
    loaderFile: './imageLoader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bucket.webdevamin.com',
      },
    ],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ["en", "nl"],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: "en",
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

// // IIFE to support top-level await
// (async () => {
//   if (process.env.NODE_ENV === 'development') {
//     await setupDevPlatform();
//   }
// })();

module.exports = nextConfig;