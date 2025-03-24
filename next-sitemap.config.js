/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_URL || 'https://webdevamin.com',
    generateRobotsTxt: true, // (optional)
    exclude: [
        '/404',
        '/nl/404',
        '/500',
        '/nl/500'
    ],
    // ...other options
  }