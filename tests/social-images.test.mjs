import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { createSocialImageEntry, fitSocialImageTitle, getSocialImageKey, getSocialImageUrl, truncateSocialImageText } from '../utils/social-image-data.mjs';
import { applyTaxiPricing } from '../utils/taxi-page.mjs';
import { renderSocialImage } from '../components/social-image-card.mjs';

const json = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

test('translated articles reuse artwork while retaining their own copy and URL', async () => {
    const en = (await json('messages/en/blogs.json'))[0];
    const nl = (await json('messages/nl/blogs.json')).find(blog => blog.slug === 'hoe-webdesigner-inhuren');
    const english = createSocialImageEntry(en, { locale: 'en', type: 'article' });
    const dutch = createSocialImageEntry(nl, { locale: 'nl', type: 'article' });
    assert.equal(english.illustrationKey, dutch.illustrationKey);
    assert.notEqual(english.key, dutch.key);
    assert.equal(dutch.title, nl.seo.ogTitle);
    assert.equal(dutch.actionLabel, 'Lees de gids');
    assert.equal(getSocialImageKey('/'), 'home');
    assert.equal(getSocialImageKey('/nl/blogs/example/'), 'nl--blogs--example');
});

test('copy, artwork and design changes invalidate the social URL', async () => {
    const entry = createSocialImageEntry(await json('messages/nl/pages/home.json'), { locale: 'nl', type: 'home', illustrationKey: 'home' });
    const url = getSocialImageUrl(entry);
    assert.equal(url, getSocialImageUrl({ ...entry }));
    for (const field of ['title', 'description', 'label', 'actionLabel', 'illustrationKey', 'artworkVersion']) {
        assert.notEqual(url, getSocialImageUrl({ ...entry, [field]: `${entry[field]}-updated` }));
    }
    assert.notEqual(url, getSocialImageUrl(entry, 'new-design'));
    assert.match(url, /^https:\/\/webdevamin\.com\/social-cards\/nl\/opengraph-image\?v=/);
});

test('card overrides do not change SEO copy and invalid artwork keys are rejected', async () => {
    const data = await json('messages/en/pages/home.json');
    const originalTitle = data.seo.title;
    data.seo.socialImage = { title: 'A shorter title', description: 'A short description', illustrationKey: 'projects' };
    const entry = createSocialImageEntry(data, { locale: 'en', type: 'home' });
    assert.equal(entry.title, 'A shorter title');
    assert.equal(entry.description, 'A short description');
    assert.equal(entry.illustrationKey, 'projects');
    assert.equal(data.seo.title, originalTitle);
    data.seo.socialImage.illustrationKey = '../outside';
    assert.throws(() => createSocialImageEntry(data, { locale: 'en', type: 'home' }), /Invalid social image/);
    delete data.seo.socialImage;
    delete data.seo.ogTitle;
    assert.equal(createSocialImageEntry(data, { locale: 'en', type: 'home' }).title, originalTitle);
});

test('taxi cards use transformed pricing copy', async () => {
    const data = applyTaxiPricing(await json('messages/nl/industries/taxi.json'));
    const entry = createSocialImageEntry(data, { locale: 'nl', type: 'industry', illustrationKey: 'taxi' });
    assert.match(entry.description, /€\s*49/);
    assert.match(entry.description, /€\s*89/);
    assert.doesNotMatch(entry.description, /\{\{/);
});

test('long titles keep all words and prices; descriptions shorten at word boundaries', () => {
    const title = 'Website Laten Maken Brugge | Vanaf €49/maand All-In-One';
    const fitted = fitSocialImageTitle(title);
    assert.equal(fitted.lines.join(' '), title);
    assert.ok(fitted.lines.length <= 3);
    assert.ok(fitted.fontSize < fitSocialImageTitle('Privacybeleid').fontSize);
    assert.equal(truncateSocialImageText('België & cafés', 30), 'België & cafés');
    assert.equal(truncateSocialImageText('A description with many more words', 20), 'A description with…');
    assert.throws(() => fitSocialImageTitle('An excessively long title '.repeat(20)), /seo.socialImage.title/);
});

test('renderer produces a 1200 by 630 PNG with local fonts and accented copy', async () => {
    const entry = createSocialImageEntry(await json('messages/nl/pages/home.json'), { locale: 'nl', type: 'home', illustrationKey: 'home' });
    entry.title = 'Websites voor cafés in België';
    const response = await renderSocialImage(entry);
    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    assert.equal(response.headers.get('content-type'), 'image/png');
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
    assert.equal(metadata.format, 'png');
});

test('a new content page without dedicated artwork renders using the master template', async () => {
    const entry = createSocialImageEntry({ seo: {
        title: 'Een nieuwe dienst',
        description: 'Een nieuwe pagina met eigen inhoud.',
        canonical: 'https://webdevamin.com/nl/new-service-test',
    } }, { locale: 'nl', type: 'page', illustrationKey: 'missing-artwork' });
    assert.equal(entry.key, 'nl--new-service-test');
    assert.equal(entry.title, 'Een nieuwe dienst');
    assert.equal(entry.label, 'Webdevamin');
    const response = await renderSocialImage(entry);
    const buffer = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    assert.equal(metadata.width, 1200);
    assert.equal(metadata.height, 630);
    assert.equal(metadata.format, 'png');
});

test('built metadata, sitemap and Cloudflare assets cover the same public pages', { skip: process.env.VERIFY_SOCIAL_IMAGE_BUILD !== '1' }, async () => {
    const require = createRequire(import.meta.url);
    const sitemap = require('../.next/server/app/sitemap.xml/route.js');
    const response = await sitemap.routeModule.userland.GET(undefined, { params: {} });
    const urls = [...(await response.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    const manifest = await json('.next/prerender-manifest.json');
    const appPaths = await json('.next/server/app-paths-manifest.json');
    const buildId = (await readFile(new URL('../.next/BUILD_ID', import.meta.url), 'utf8')).trim();
    const middleware = await json('.next/server/middleware-manifest.json');
    const matcher = new RegExp(middleware.middleware['/'].matchers[0].regexp);
    const actualImagePaths = Object.keys(manifest.routes).filter(path => path.startsWith('/social-cards/'));
    const expectedImagePaths = urls.map(url => `/social-cards/${getSocialImageKey(new URL(url).pathname)}/opengraph-image`);
    assert.deepEqual(actualImagePaths.sort(), expectedImagePaths.sort());
    assert.equal(manifest.dynamicRoutes['/social-cards/[key]/opengraph-image'].fallback, false);
    assert.ok(matcher.test('/nl/blogs'));
    assert.ok(!actualImagePaths.some(path => /\/social-cards\/industry/.test(path)), 'Dutch-only industries must not have English cards');

    for (const url of urls) {
        const pathname = new URL(url).pathname;
        const internalPath = pathname === '/nl' || pathname.startsWith('/nl/') ? pathname : `/en${pathname === '/' ? '' : pathname}`;
        let page;
        let params;
        for (const [route, modulePath] of Object.entries(appPaths)) {
            if (!route.endsWith('/page') || !route.startsWith('/[locale]')) continue;
            const pattern = route.slice(0, -5).replace(/\[([^\]]+)\]/g, '(?<$1>[^/]+)');
            const match = internalPath.match(new RegExp(`^${pattern}$`));
            if (!match) continue;
            let tree = require(`../.next/server/${modulePath}`).tree;
            while (tree[1].children) tree = tree[1].children;
            page = await tree[2].page[0]();
            params = match.groups;
            break;
        }
        assert.ok(page, `No page module for ${url}`);
        const metadata = await page.generateMetadata({ params });
        const image = metadata.openGraph.images[0];
        assert.deepEqual(metadata.twitter.images, [image.url]);
        assert.equal(image.width, 1200);
        assert.equal(image.height, 630);
        assert.ok(image.alt.startsWith('Webdevamin: '));
        assert.equal(metadata.alternates.canonical, url);
        const imagePath = new URL(image.url).pathname;
        assert.equal(imagePath, `/social-cards/${getSocialImageKey(pathname)}/opengraph-image`);
        assert.ok(!matcher.test(imagePath), `Language middleware matches ${imagePath}`);
        assert.equal(manifest.routes[imagePath].initialRevalidateSeconds, false);
        const png = await readFile(new URL(`../.next/server/app${imagePath}.body`, import.meta.url));
        const dimensions = await sharp(png).metadata();
        assert.equal(dimensions.format, 'png');
        assert.equal(dimensions.width, 1200);
        assert.equal(dimensions.height, 630);
        const cache = await json(`.open-next/assets/cdn-cgi/_next_cache/${buildId}${imagePath}.cache`);
        assert.equal(cache.meta.status, 200);
        assert.equal(cache.meta.headers['content-type'], 'image/png');
        assert.deepEqual(Buffer.from(cache.body, 'base64'), png);
    }
});
