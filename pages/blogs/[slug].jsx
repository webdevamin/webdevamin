import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
import { getData } from '../../graphql/api';
import { GET_BLOG, GET_BLOGS } from '../../graphql/queries';
import { destructureCollectionType, destructureCollectionTypeObject, destructureImageComponent } from '../../utils/app';
import { useRouter } from 'next/router';
import PageLayout from '../../components/Layouts/PageLayout';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import HeroTwo from '../../components/Heroes/HeroTwo';
import Image from 'next/image';

const Blog = ({ data }) => {
    const router = useRouter();
    const { data: blogData, globalData } = data;
    const blog = destructureCollectionTypeObject(destructureCollectionType(blogData.blogs)[0]);
    const { title, description, seo, alternates, slug, img, date, text } = blog;
    const { blogs, contactblock, services, socials } = globalData;
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
            <Header interpol={{
                pathname: `/blogs/[slug]`,
                query: { slug: router.query.slug }
            }} />
            <HeroTwo content={heroContent} socialsRaw={socials} />
            <PageLayout>
                <section id={slug} className={`block_container xl:w-10/12 
                lg:max-w-6xl lg:mx-auto`}>
                    <div className={`relative h-[calc(100vw/2)] xl:h-[calc(100vw/2.7)] 
                    2xl:h-[calc(100vw/3.2)] mb-7 lg:mb-14`}>
                        <Image src={url} alt={alt} layout={`fill`}
                            objectFit={`cover`}
                            className={`rounded-lg xl:rounded-2xl`} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                </section>
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs} socialsRaw={socials} />
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