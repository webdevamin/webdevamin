export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };
export const SOCIAL_IMAGE_DESIGN_VERSION = '2026-09-24-b';

const labels = {
    en: { home: 'Web design in Belgium', blogs: 'Insights & guides', article: 'Practical guide', contact: 'Let’s talk', projects: 'Selected work', policy: 'Privacy', industry: 'Business websites', local: 'Local web design', page: 'Webdevamin' },
    nl: { home: 'Webdesign in België', blogs: 'Inzichten & gidsen', article: 'Praktische gids', contact: 'Even kennismaken', projects: 'Geselecteerd werk', policy: 'Privacy', industry: 'Zakelijke websites', local: 'Webdesign in Brugge', page: 'Webdevamin' },
};

const actions = {
    en: { home: 'Discover Webdevamin', blogs: 'Explore the blog', article: 'Read the guide', contact: 'Get in touch', projects: 'View projects', policy: 'Read the policy', industry: 'Explore websites', local: 'Discover more', page: 'Discover more' },
    nl: { home: 'Ontdek Webdevamin', blogs: 'Bekijk de blogs', article: 'Lees de gids', contact: 'Neem contact op', projects: 'Bekijk projecten', policy: 'Lees het beleid', industry: 'Bekijk de mogelijkheden', local: 'Ontdek meer', page: 'Ontdek meer' },
};

export function getSocialImageKey(pathname) {
    return pathname.replace(/^\/+|\/+$/g, '').replaceAll('/', '--') || 'home';
}

export function createSocialImageEntry(data, { locale, type, illustrationKey }) {
    const seo = data.seo;
    const overrides = seo.socialImage || {};
    const pathname = new URL(seo.canonical).pathname.replace(/\/$/, '') || '/';
    const englishPage = data.alternates?.find(alt => alt.hreflang === 'en');
    const artworkPath = englishPage ? new URL(englishPage.href).pathname : pathname;
    const entry = {
        pathname,
        key: getSocialImageKey(pathname),
        locale,
        title: overrides.title || seo.ogTitle || data.title || seo.title,
        description: overrides.description || seo.ogDescription || seo.description || '',
        label: labels[locale][type],
        actionLabel: actions[locale][type],
        illustrationKey: overrides.illustrationKey || illustrationKey || getSocialImageKey(artworkPath),
        artworkVersion: overrides.artworkVersion || '1',
    };
    if (!entry.title || !entry.label || !entry.actionLabel || !/^[a-z0-9-]+$/.test(entry.illustrationKey)) {
        throw new Error(`Invalid social image entry: ${pathname}`);
    }
    return entry;
}

export function getSocialImageUrl(entry, designVersion = SOCIAL_IMAGE_DESIGN_VERSION) {
    const content = JSON.stringify([designVersion, entry.title, entry.description, entry.label, entry.actionLabel, entry.illustrationKey, entry.artworkVersion]);
    let hash = 2166136261;
    for (let index = 0; index < content.length; index += 1) {
        hash = Math.imul(hash ^ content.charCodeAt(index), 16777619);
    }
    return `https://webdevamin.com/social-cards/${entry.key}/opengraph-image?v=${(hash >>> 0).toString(36)}`;
}

export function truncateSocialImageText(text, limit) {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= limit) return clean;
    const shortened = clean.slice(0, limit - 1);
    const space = shortened.lastIndexOf(' ');
    return `${shortened.slice(0, space > 0 ? space : shortened.length).trim()}…`;
}

// Conservative widths keep the narrow Mohave headings inside the left text area.
function titleWidth(text, size) {
    return [...text].reduce((width, letter) => width + (
        /[MW@%]/.test(letter) ? 0.85 : /[ilIjt .,:;'|!]/.test(letter) ? 0.3 : /[A-Z0-9€]/.test(letter) ? 0.62 : 0.52
    ) * size, 0);
}

export function fitSocialImageTitle(title) {
    const words = title.replace(/\s+/g, ' ').trim().split(' ');
    for (const fontSize of [64, 60, 56, 52, 48, 44, 40]) {
        const lines = [];
        let line = '';
        for (const word of words) {
            if (titleWidth(word, fontSize) > 460) {
                line = '';
                lines.length = 5;
                break;
            }
            const combined = line ? `${line} ${word}` : word;
            if (line && titleWidth(combined, fontSize) > 460) {
                lines.push(line);
                line = word;
            } else {
                line = combined;
            }
        }
        if (line) lines.push(line);
        if (lines.length <= 3) return { fontSize, lines };
    }
    throw new Error(`Social image title is too long; set seo.socialImage.title: ${title}`);
}
