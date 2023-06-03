import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
import { getData } from '../../graphql/api';
import { GET_BLOG, GET_BLOGS } from '../../graphql/queries';
import { destructureCollectionType, destructureCollectionTypeObject, 
    destructureImageComponent } from '../../utils/app';
import { useRouter } from 'next/router';
import PageLayout from '../../components/Layouts/PageLayout';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import HeroTwo from '../../components/Heroes/HeroTwo';
import Image from 'next/image';
import SocialShares from '../../components/SocialShares';

const Blog = ({ data }) => {
    const router = useRouter();
    const { data: blogData, globalData } = data;
    const blog = destructureCollectionTypeObject(blogData.blogs, true);

    const { title, description, localepages, seo, alternates, 
        slug, img, date, text } = blog;

    const { blogs, contactblock, pages, services, 
        socials, regions } = globalData;
        
    const button = [];

    button.push({
        href: `#${slug}`,
        text: router.locale === `en` ? `Read` : `Lees`
    });

    const heroContent = {
        title, text: description, button,
        image: destructureImageComponent(img, 'thumbnail'), date
    }

    const { url, alt } = destructureImageComponent(img);

    return (
        <div>
            <Seo seo={{ title, description: description, canonical: seo.canonical }}
                alternates={alternates} />
            <Header pages={pages} localepages={localepages} />
            <HeroTwo content={heroContent} socialsRaw={socials} />
            <PageLayout>
                <section id={slug} className={`mb-16 sm:mb-20 md:mb-28 xl:mb-52 
                xl:w-10/12 lg:max-w-6xl lg:mx-auto mt-6 md:mt-24 xl:mt-32`}>
                    <div className={`mb-4 md:mb-7 lg:mb-12`}>
                        <div className={`relative h-[calc(100vw/2)] xl:h-[calc(100vw/2.7)] 
                    2xl:h-[calc(100vw/2.8)] mb-3 md:mb-5 lg:mb-6`}>
                            <Image src={url} alt={alt} layout={`fill`} priority
                                objectFit={`cover`} className={`rounded-xl`} />
                        </div>
                        <SocialShares url={seo.canonical} title={`Blog - ${title}`}
                            description={description} imageUrl={url} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: text }} className={`blog_content`} />
                </section>
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs} 
                socialsRaw={socials} regionsRaw={regions} pagesRaw={pages}/>
            </PageLayout>
        </div>
    )
}

export default Blog

export async function getStaticPaths() {
    const blogs =
        destructureCollectionType((await getData(GET_BLOGS, { locale: "all" }, false)).blogs);

    const paths = blogs.map((blogRaw) => {
        const { locale, slug } = destructureCollectionTypeObject(blogRaw);

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
    const data = await getData(GET_BLOG, params);

    return {
        props: { data },
    }
}