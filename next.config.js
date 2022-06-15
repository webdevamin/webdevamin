/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "nl"],
    defaultLocale: "en",
  },
  images: {
    domains: ["media.graphassets.com"],
  },
};

module.exports = nextConfig;
