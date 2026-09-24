import { getSocialImageMetadata } from '../../../../../utils/social-images';
import Header from '../../../../../components/Layouts/Header';
import PageLayout from '../../../../../components/Layouts/PageLayout';
import Contact from '../../../../../components/Contact';
import Footer from '../../../../../components/Layouts/Footer';
import HeroTwo from '../../../../../components/Heroes/HeroTwo';
import Image from 'next/image';
import SocialShares from '../../../../../components/SocialShares';
import BorderedSection from '../../../../../components/Layouts/BorderedSection';
import styles from '../../../../../styles/BlogPage.module.scss';
import { notFound } from 'next/navigation';
import cloudflareLoader from '../../../../../imageLoader';
import JsonLd from '../../../../../components/SEO/JsonLd';
import { FaqAccordion } from '../../../../../components/Blocks/BlockAccordion';

const optimizeEmbeddedImages = (html) => html
    .replaceAll(
        "src='/images/map.png'",
        `src='${cloudflareLoader({ src: '/images/map.png', width: 1200, quality: 85 })}' width='2758' height='1540' loading='lazy' decoding='async'`
    )
    .replaceAll(
        "src='/images/dashboard.png'",
        `src='${cloudflareLoader({ src: '/images/dashboard.png', width: 1000, quality: 85 })}' width='2946' height='1460' loading='lazy' decoding='async'`
    );

async function getData(locale, slug) {
    const allBlogs = (await import(`../../../../../messages/${locale}/blogs.json`)).default;
    const blogData = allBlogs.find((p) => p.slug === slug);

    if (!blogData) {
        // In a real app, you'd want to handle this case, maybe by returning a 404
        return { notFound: true };
    }

    const localesData = (await import(`../../../../../messages/${locale}/locales.json`)).default;
    const socialsData = (await import(`../../../../../messages/${locale}/socials.json`)).default;
    const pagesData = (await import(`../../../../../messages/${locale}/pages.json`)).default;
    const contactBlockData = (await import(`../../../../../messages/${locale}/contactBlock.json`)).default;

    return {
        localesData,
        socialsData,
        blogsData: allBlogs,
        pagesData,
        contactBlockData,
        blogData,
    };
}

export async function generateStaticParams() {
    const blogsDataNl = (await import(`../../../../../messages/nl/blogs.json`)).default;
    const blogsDataEn = (await import(`../../../../../messages/en/blogs.json`)).default;

    const pathsNl = blogsDataNl.map(blog => ({ locale: 'nl', slug: blog.slug }));
    const pathsEn = blogsDataEn.map(blog => ({ locale: 'en', slug: blog.slug }));

    return [...pathsNl, ...pathsEn];
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
    const data = await getData(locale, slug);
    if (data.notFound || !data.blogData) return notFound();

    const { blogData } = data;
    const { seo, alternates, title } = blogData;
    const { title: seoTitle, description, canonical, ogTitle, ogDescription, keywords } = seo;

    const socialImage = await getSocialImageMetadata(canonical);

    return {
        title: `${seoTitle || title} | Webdevamin`,
        description: description,
        keywords: keywords,
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
            images: [socialImage],
            locale: locale,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${ogTitle || title} | Webdevamin`,
            description: ogDescription || description,
            creator: '@Webdevamin',
            images: [socialImage.url],
        },
    };
}

const Blog = async ({ params }) => {
  const { locale, slug } = await params;
    const data = await getData(locale, slug);

    if (data.notFound || !data.blogData) {
        return notFound();
    }

    const { localesData, socialsData, blogsData, pagesData, contactBlockData, blogData } = data;

    const { alternateLangs, title, description, text, faq, textAfterFaq, img } = blogData;
    const { src, alt, width, height } = img;

    const button = [{
        href: `#${slug}`,
        text: locale === `nl` ? `Lees verder` : `Read more`
    }];

    const heroContent = {
        title, text: description, button, image: img, alt
    };

    return (
        <div>
            <JsonLd data={blogData.jsonLd} />
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroTwo
                content={heroContent}
                socials={socialsData}
                breadcrumbItems={[
                    { label: 'Home', href: locale === 'nl' ? '/nl' : '/' },
                    { label: 'Blogs', href: locale === 'nl' ? '/nl/blogs' : '/blogs' },
                    { label: title },
                ]}
                breadcrumbLocale={locale}
            />
            <PageLayout>
                <BorderedSection>
                    <div id={slug} className={styles.blogContainer}>
                        <div className={`mb-4 md:mb-7 lg:mb-12`}>
                            <div className={`relative w-full mb-3 md:mb-5 lg:mb-6`}>
                                <Image
                                    width={width}
                                    height={height}
                                    src={src}
                                    alt={alt}
                                    className={`${styles.blogImage} border border-dark/10 shadow lg:shadow-xl w-full h-auto`}
                                    style={{ objectFit: `cover` }} priority={true}
                                    sizes="100vw" />
                            </div>
                            <div className={styles.socialSharesContainer}>
                                <SocialShares url={blogData.seo.canonical} title={`Blog - ${title}`}
                                    description={description} imageUrl={src} />
                            </div>
                        </div>
                        <div className={styles.blogContent}>
                            <div dangerouslySetInnerHTML={{ __html: optimizeEmbeddedImages(text) }} />
                        </div>
                        {faq?.items?.length > 0 && (
                            <section aria-labelledby="blog-faq-title">
                                <div className={styles.blogContent}>
                                    <h2 id="blog-faq-title">{faq.title}</h2>
                                </div>
                                <FaqAccordion items={faq.items} />
                            </section>
                        )}
                        {textAfterFaq && (
                            <div className={styles.blogContent}
                                dangerouslySetInnerHTML={{ __html: optimizeEmbeddedImages(textAfterFaq) }} />
                        )}
                    </div>
                </BorderedSection>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData} socials={socialsData} pages={pagesData} />
            </PageLayout>
        </div>
    );
}

export default Blog;
