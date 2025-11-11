import Header from '../../../../components/Layouts/Header';
import PageLayout from '../../../../components/Layouts/PageLayout';
import Heading from '../../../../components/Heading';
import { Link } from '../../../../src/i18n/navigation';
import Contact from '../../../../components/Contact';
import Footer from '../../../../components/Layouts/Footer';
import CardTwo from '../../../../components/Cards/CardTwo';
import HeroOne from '../../../../components/Heroes/HeroOne';

async function getData(locale) {
    const localesData = (await import(`../../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../../messages/${locale}/socials.json`)).default;
    const blogsData = (await import(`../../../../messages/${locale}/blogs.json`)).default;
    const pagesData = (await import(`../../../../messages/${locale}/pages.json`)).default;
    const contactBlockData = (await import(`../../../../messages/${locale}/contactBlock.json`)).default;
    const pageData = (await import(`../../../../messages/${locale}/pages/blogs.json`)).default;

    return {
        localesData,
        socialsData,
        blogsData,
        pagesData,
        contactBlockData,
        pageData,
    };
}

export async function generateMetadata({ params: { locale } }) {
    const { pageData } = await getData(locale);
    const { seo, alternates } = pageData;
    const { title, description, canonical, image, ogTitle, ogDescription, keywords } = seo;

    return {
        title: `${title} | Webdevamin`,
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
            title: `${ogTitle || title} | Webdevamin`,
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
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            creator: '@Webdevamin',
            images: [image],
        },
    };
}

const Blogs = async ({ params: { locale } }) => {
    const { localesData, socialsData, blogsData, pagesData, contactBlockData, pageData } = await getData(locale);
    const { alternateLangs, blocks } = pageData;
    const { title: titleHeading, slug: slugHeading, subtitle: subtitleHeading, text: textHeading } = blocks[1];

    return (
        <>
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)} socials={socialsData} ctaLink={`#${slugHeading}`} />
            <PageLayout>
                <div id={slugHeading} className={`block_container`}>
                    <Heading title={titleHeading} subtitle={subtitleHeading} />
                    <div dangerouslySetInnerHTML={{ __html: textHeading }} className={`${textHeading ? `pb-6` : `hidden`}`} />
                    <div className={`overflow-x-auto overscroll-x-contain gap-6 pb-6 md:pb-0 md:pr-0 md:w-full md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-10 md:mt-7 lg:mt-14 ${blogsData.length >= 2 && `pr-[20%] w-screen flex`}`}>
                        {
                            blogsData.map((blog, index) => {
                                const { title, img, slug, description, dev, border } = blog;
                                const { src, alt } = img;
                                const text = locale === `nl` ? `Lees verder` : `Read more`;

                                return (
                                    <Link href={`/blogs/${slug}`} key={index} className={`min-w-[75vw] sm:min-w-[53vw] md:min-w-0`}>
                                        <CardTwo imgUrl={src} title={title} text={text}
                                            subtitle={description} slug={slug} alt={alt}
                                            badge={dev && { bText: `dev` }} border={border} type={`blog`} />
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData} pages={pagesData} socials={socialsData} followExternalLinks />
            </PageLayout>
        </>
    );
}

export default Blogs;
