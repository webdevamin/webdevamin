import { renderSocialImage } from '../../../../components/social-image-card.mjs';
import { getSocialImageByKey, getSocialImages } from '../../../../utils/social-images';

export const dynamic = 'force-static';
export const dynamicParams = false;
export const revalidate = false;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Webdevamin';

export async function generateStaticParams() {
    return (await getSocialImages()).map(entry => ({ key: entry.key }));
}

export default async function SocialImage({ params }) {
    const entry = await getSocialImageByKey(params.key);
    if (!entry) throw new Error(`Unknown social image: ${params.key}`);
    return renderSocialImage(entry);
}
