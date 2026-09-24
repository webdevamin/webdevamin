import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';
import { fitSocialImageTitle, truncateSocialImageText, SOCIAL_IMAGE_SIZE } from '../utils/social-image-data.mjs';

let fonts;
function getFonts() {
    fonts ||= Promise.all([
        readFile(join(process.cwd(), 'public/fonts/social-cards/Mohave-Bold.ttf')),
        readFile(join(process.cwd(), 'public/fonts/social-cards/Quicksand-SemiBold.ttf')),
    ]).then(([mohave, quicksand]) => [
        { name: 'Mohave', data: mohave, weight: 700, style: 'normal' },
        { name: 'Quicksand', data: quicksand, weight: 600, style: 'normal' },
    ]);
    return fonts;
}

export async function renderSocialImage(entry) {
    const [background, cardFonts] = await Promise.all([
        readFile(join(process.cwd(), `public/images/social-cards/${entry.illustrationKey}.jpg`)).catch(error => {
            if (error.code !== 'ENOENT') throw error;
            return readFile(join(process.cwd(), 'public/images/social-card-template.jpg'));
        }),
        getFonts(),
    ]);
    const { fontSize, lines } = fitSocialImageTitle(entry.title);
    const description = truncateSocialImageText(entry.description, lines.length === 3 ? 125 : 145);
    const block = (style, ...children) => h('div', { style: { display: 'flex', ...style } }, ...children);

    return new ImageResponse(
        block({ width: '100%', height: '100%', position: 'relative', background: '#faf7f6', color: '#1e1d20', fontFamily: 'Quicksand', fontWeight: 600 },
            h('img', { src: `data:image/jpeg;base64,${background.toString('base64')}`, alt: '', ...SOCIAL_IMAGE_SIZE, style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } }),
            block({ position: 'absolute', left: 48, top: 90, color: '#e91122', fontSize: 17, letterSpacing: 1 }, entry.label),
            block({ position: 'absolute', left: 48, top: 126, width: 470, flexDirection: 'column' },
                block({ flexDirection: 'column', fontFamily: 'Mohave', fontWeight: 700, fontSize, lineHeight: 1.04, letterSpacing: -0.6 },
                    ...lines.map((line, index) => h('div', { key: index, style: { display: 'flex', height: fontSize * 1.04, lineHeight: 1.04, whiteSpace: 'nowrap', color: index === 0 ? '#1e1d20' : '#e91122' } }, line))),
                block({ width: 48, height: 4, background: '#e91122', marginTop: 17, marginBottom: 15 }),
                block({ width: 445, fontSize: 20, lineHeight: 1.35 }, description),
                block({ alignSelf: 'flex-start', alignItems: 'center', background: '#e91122', color: '#fff', borderRadius: 30, fontSize: 17, padding: '12px 20px', marginTop: 22 }, entry.actionLabel, block({ marginLeft: 14, fontSize: 23, lineHeight: 1 }, '→')),
            ),
            block({ position: 'absolute', right: 660, top: 39, fontSize: 15, letterSpacing: 0.5 }, 'webdevamin.com'),
        ),
        { ...SOCIAL_IMAGE_SIZE, fonts: cardFonts },
    );
}
