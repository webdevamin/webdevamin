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
import { GET_BLOGS } from "../../config/queries";

const Blogs = ({ blogs, t, g }) => {
    if (blogs.length) {
        return blogs.map((blog, index) => {
            const { title, tags, image, slug } = blog;
            const { alt, img } = image;

            return (
                <article key={index} className="card">
                    <div className='left'>
                        <Image src={img.url} alt={alt}
                            width={150} height={150} className='radius-md' />
                    </div>
                    <div className="right">
                        <div className='tags'>
                            {
                                tags.map((tag, index) => {
                                    return (
                                        <span key={index} className='tag'>{tag.name}</span>
                                    )
                                })
                            }
                        </div>
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
            <main>
                <section className='mt-3'>
                    <Blogs blogs={blogs} t={t} g={g} />
                </section>
            </main>
        </>
    )
}

export default Index;

export async function getStaticProps({ locale }) {
    const client = new GraphQLClient(process.env.API_URL);

    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            data: await client.request(GET_BLOGS, { locale: [locale] }),
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}