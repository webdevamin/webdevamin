/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
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
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/nl',
        destination: '/nl/',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
