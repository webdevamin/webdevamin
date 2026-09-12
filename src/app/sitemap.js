import blogsEn from '../../messages/en/blogs.json';
import blogsNl from '../../messages/nl/blogs.json';
import brugge from '../../messages/nl/pages/brugge.json';
import taxi from '../../messages/nl/industries/taxi.json';
import kapper from '../../messages/nl/industries/kapper.json';
import restaurant from '../../messages/nl/industries/restaurant.json';

const baseUrl = 'https://webdevamin.com';

const staticPaths = [
  '',
  '/contact',
  '/projects',
  '/policy',
  '/blogs',
  '/nl',
  '/nl/contact',
  '/nl/projects',
  '/nl/policy',
  '/nl/blogs',
];

export default function sitemap() {
  const urls = [
    ...staticPaths.map((path) => `${baseUrl}${path}`),
    ...blogsEn.map((blog) => blog.seo.canonical),
    ...blogsNl.map((blog) => blog.seo.canonical),
    brugge.seo.canonical,
    taxi.seo.canonical,
    kapper.seo.canonical,
    restaurant.seo.canonical,
  ];

  return urls.map((url) => ({ url }));
}
