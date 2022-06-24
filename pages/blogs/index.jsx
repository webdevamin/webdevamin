import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Hero from '../../components/Hero';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { GET_BLOGS_BY_LANG } from "../../config/queries";

const Blogs = ({ blogs, t, g }) => {
    if (blogs.length) {
        return (
            <section className="cards">
                {
                    blogs.map((blog, index) => {
                        const { title, image, slug } = blog;
                        const { alt, img } = image;

                        return (
                            <article key={index} className="card">
                                <div className='image_container'>
                                    <Image src={img.url} alt={alt}
                                        layout="fill" objectFit='cover'
                                        className='radius-md' priority/>
                                </div>
                                <div className='card_footer'>
                                    <h3>{title}</h3>
                                    <Link href={`/blogs/${slug}`}>
                                        <a className='link'>
                                            <span>{g('readMore')}</span>
                                            <FontAwesomeIcon icon={faArrowRightLong} size={'xs'} />
                                        </a>
                                    </Link>
                                </div>
                            </article>
                        )
                    })
                }
            </section>
        )
    }

    return <p>{t('noBlogs')}</p>
}

const Index = ({ data }) => {
    const { blogs } = data;

    const t = useTranslations('blogs');
    const g = useTranslations('general');

    return (
        <>
            <Seo title={t('title')} description={t('description')} />
            <Header />
            <Hero title={t('title')} titleTwo={t('title_two')} />
            <main className='mb-lg'>
                <section>
                    <p className='text content'>
                        {t('description')}
                    </p>
                </section>
                <Blogs blogs={blogs} t={t} g={g} />
            </main>
        </>
    )
}

export default Index;

export async function getStaticProps({ locale }) {
    const client = new GraphQLClient(process.env.API_URL);

    return {
        props: {
            data: await client.request(GET_BLOGS_BY_LANG, { locale: [locale] }),
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}