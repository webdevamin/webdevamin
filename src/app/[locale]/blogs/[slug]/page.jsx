import Header from '../../../../../components/Layouts/Header';
import PageLayout from '../../../../../components/Layouts/PageLayout';
import Contact from '../../../../../components/Contact';
import Footer from '../../../../../components/Layouts/Footer';
import HeroTwo from '../../../../../components/Heroes/HeroTwo';
import Image from 'next/image';
import SocialShares from '../../../../../components/SocialShares';
import styles from '../../../../../styles/BlogPage.module.scss';
import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params: { locale, slug } }) {
    const data = await getData(locale, slug);
    if (data.notFound || !data.blogData) return notFound();

    const { blogData } = data;
    const { seo, alternates, title } = blogData;
    const { description, canonical, image, ogTitle, ogDescription, keywords } = seo;

    return {
        title: `${title} | Webdevamin`,
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
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: locale,
            type: 'article',
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

const Blog = async ({ params: { locale, slug } }) => {
    const data = await getData(locale, slug);

    if (data.notFound || !data.blogData) {
        return notFound();
    }

    const { localesData, socialsData, blogsData, pagesData, contactBlockData, blogData } = data;

    const { alternateLangs, title, description, text, img, border } = blogData;
    const { src, alt } = img;

    const button = [{
        href: `#${slug}`,
        text: locale === `nl` ? `Lees verder` : `Read more`
    }];

    const heroContent = {
        title, text: description, button, image: img, alt
    };

    return (
        <div>
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroTwo content={heroContent} socials={socialsData} />
            <PageLayout>
                <div id={slug} className={styles.blogContainer}>
                    <div className={`mb-4 md:mb-7 lg:mb-12`}>
                        <div className={`relative w-full mb-3 md:mb-5 lg:mb-6`}>
                            <Image
                                width={1152}
                                height={400}
                                src={src}
                                alt={alt}
                                className={`${styles.blogImage} ${border && `border shadow lg:shadow-xl`} w-full h-auto`}
                                style={{ objectFit: `cover` }} priority={true}
                                sizes="100vw" />
                        </div>
                        <div className={styles.socialSharesContainer}>
                            <SocialShares url={blogData.seo.canonical} title={`Blog - ${title}`}
                                description={description} imageUrl={src} />
                        </div>
                    </div>
                    <div className={styles.blogContent}>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                </div>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData} socials={socialsData} pages={pagesData} />
            </PageLayout>
        </div>
    );
}

export default Blog;
