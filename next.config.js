/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
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
};

module.exports = nextConfig;
