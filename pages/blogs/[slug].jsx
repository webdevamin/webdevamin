import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
import { useRouter } from 'next/router';
import PageLayout from '../../components/Layouts/PageLayout';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import HeroTwo from '../../components/Heroes/HeroTwo';
import Image from 'next/image';
import SocialShares from '../../components/SocialShares';
import styles from '../../styles/BlogPage.module.scss';

const Blog = ({ localesData, socialsData, blogsData, regionsData, pagesData, contactBlockData, blogData }) => {
    const router = useRouter();

    const { seo, alternates, alternateLangs, title,
        description, slug, text, img, border } = blogData;

    const { src, alt } = img;

    const button = [];

    button.push({
        href: `#${slug}`,
        text: router.locale === `en` ? `Read` : `Lees`
    });

    const heroContent = {
        title, text: description, button, image: img, alt
    }

    return (
        <div>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroTwo content={heroContent} socials={socialsData} />
            <PageLayout>
                <div id={slug} className={styles.blogContainer}>
                    <div className={`mb-4 md:mb-7 lg:mb-12`}>
                        <div className={`relative aspect-[1.7/1] mb-3 md:mb-5 lg:mb-6`}>
                            <Image
                                src={src} fill={true} alt={alt} 
                                className={`${styles.blogImage} ${border && `border shadow lg:shadow-xl`}`}
                                style={{ objectFit: `cover` }} priority={true}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                        </div>
                        <div className={styles.socialSharesContainer}>
                            <SocialShares url={seo.canonical} title={`Blog - ${title}`}
                                description={description} imageUrl={src} />
                        </div>
                    </div>
                    <div className={styles.blogContent}>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </div>
                </div>
                <Contact content={contactBlockData} />
                <Footer blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </div>
    )
}

export default Blog

export async function getStaticPaths() {
    const blogsDataNl = (await import(`../../lang/nl/blogs.json`)).default;
    const blogsDataEn = (await import(`../../lang/en/blogs.json`)).default;

    const blogsAllLocales = blogsDataNl.concat(blogsDataEn);

    const paths = blogsAllLocales.map((blogRaw) => {
        const { locale, slug } = blogRaw;

        return {
            params: { slug }, locale
        }
    });

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps({ locale, params }) {
    params.locale = [locale];
    const blogsData = (await import(`../../lang/${locale}/blogs.json`)).default;

    const blogData = blogsData.find((p) => {
        return p.slug === params.slug;
    });

    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            blogData
        }
    }
}