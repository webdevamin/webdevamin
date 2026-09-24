import { slugToFileMap } from './industries';
import { applyTaxiPricing } from './taxi-page.mjs';
import { createSocialImageEntry, getSocialImageUrl, SOCIAL_IMAGE_SIZE } from './social-image-data.mjs';

// Webpack discovers new localized page content during each build.
const pageContent = require.context('../messages', true, /^\.\/(en|nl)\/pages\/[^/]+\.json$/);
const pageTypes = { home: 'home', blogs: 'blogs', contact: 'contact', projects: 'projects', policy: 'policy', brugge: 'local', industries: 'industry' };

let images;

async function loadSocialImages() {
    const entries = [];
    for (const path of pageContent.keys().sort()) {
        const [, locale, , filename] = path.split('/');
        const file = filename.replace(/\.json$/, '');
        if (file === '404' || file === '500') continue;
        const data = pageContent(path);
        entries.push(createSocialImageEntry(data, { locale, type: pageTypes[file] || 'page', illustrationKey: file }));
    }
    for (const locale of ['en', 'nl']) {
        const blogs = (await import(`../messages/${locale}/blogs.json`)).default;
        entries.push(...blogs.map(blog => createSocialImageEntry(blog, { locale, type: 'article' })));
        for (const file of Object.values(slugToFileMap[locale] || {})) {
            const source = (await import(`../messages/${locale}/industries/${file}.json`)).default;
            const data = file === 'taxi' ? applyTaxiPricing(source) : source;
            entries.push(createSocialImageEntry(data, { locale, type: 'industry', illustrationKey: file }));
        }
    }
    if (new Set(entries.map(entry => entry.key)).size !== entries.length) {
        throw new Error('Duplicate social image route keys');
    }
    return entries;
}

export function getSocialImages() {
    images ||= loadSocialImages();
    return images;
}

export async function getSocialImageByKey(key) {
    return (await getSocialImages()).find(entry => entry.key === key);
}

export async function getSocialImageMetadata(canonical) {
    const pathname = new URL(canonical).pathname.replace(/\/$/, '') || '/';
    const entry = (await getSocialImages()).find(image => image.pathname === pathname);
    if (!entry) throw new Error(`Missing social image registration: ${pathname}`);
    return { url: getSocialImageUrl(entry), ...SOCIAL_IMAGE_SIZE, alt: `Webdevamin: ${entry.title}` };
}
