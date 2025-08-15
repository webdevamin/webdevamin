import Header from '../../../../components/Layouts/Header';
import PageLayout from '../../../../components/Layouts/PageLayout';
import Heading from '../../../../components/Heading';
import Footer from '../../../../components/Layouts/Footer';
import HeroOne from '../../../../components/Heroes/HeroOne';

async function getData(locale) {
    const localesData = (await import(`../../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../../messages/${locale}/socials.json`)).default;
    const blogsData = (await import(`../../../../messages/${locale}/blogs.json`)).default;
    const pagesData = (await import(`../../../../messages/${locale}/pages.json`)).default;
    const pageData = (await import(`../../../../messages/${locale}/pages/policy.json`)).default;

    return {
        localesData,
        socialsData,
        blogsData,
        pagesData,
        pageData,
    };
}

export async function generateMetadata({ params: { locale } }) {
    const { pageData } = await getData(locale);
    const { seo, alternates } = pageData;
    const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

    return {
        title: title,
        description: description,
        keywords: keywords,
        canonical: canonical,
        alternates: {
            canonical: canonical,
            languages: alternates.reduce((acc, alt) => {
                acc[alt.hreflang] = alt.href;
                return acc;
            }, {}),
        },
        openGraph: {
            title: ogTitle || title,
            description: ogDescription || description,
            url: canonical,
            siteName: 'Webdevamin',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle || title,
            description: ogDescription || description,
            creator: '@Webdevamin',
            images: [image],
        },
    };
}

const Policy = async ({ params: { locale } }) => {
    const { localesData, socialsData, blogsData, pagesData, pageData } = await getData(locale);
    const { alternateLangs, blocks } = pageData;
    const { title, subtitle, slug, text } = blocks[1];

    return (
        <>
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} />
            <PageLayout>
                <div id={slug} className={`block_container`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`mt-3 sm:mt-8 md:mt-12 lg:w-10/12`}>
                        <div dangerouslySetInnerHTML={{ __html: text }} className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                    </div>
                </div>
                <Footer blogs={blogsData} socials={socialsData} pages={pagesData} />
            </PageLayout>
        </>
    );
}

export default Policy;
