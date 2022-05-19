import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { gql, GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Hero from '../../components/Hero';
import Link from 'next/link';

const Blogs = ({ blogs, t }) => {
    if (blogs.length) {
        return blogs.map((blog) => {
            const { id, slug, summary, title, tags } = blog;

            return (
                <article key={id} className="card">
                    <div className='top'>
                        <h3>{title}</h3>
                        <p>{summary}</p>
                    </div>
                    <div className='bot'>
                        <Link href={'#'}>
                            <a>Read more</a>
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
    console.log(blogs);
    const t = useTranslations('blogs');

    return (
        <>
            <Seo title={t('title')} description={t('description')} />
            <Header />
            <Hero />
            <main>
                <section>
                    <div className='content'>
                        <h2>{t('title')}</h2>
                        <section className='cards'>
                            <Blogs blogs={blogs} t={t} />
                        </section>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Index;

export async function getStaticProps({ locale }) {
    const client = new GraphQLClient(process.env.API_URL);

    const query = gql`
    query MyQuery($locale: [Locale!]!) {
        blogs(locales: $locale) {
            image {
              id
              alt
              image {
                fileName
                width
                url
              }
            }
            slug
            summary
            tags(locales: $locale) {
              id
              name
              slug
            }
            title
            content {
              html
            }
          }
        }
        `

    return {
        props: {
            // You can get the messages from anywhere you like. The recommended
            // pattern is to put them in JSON files separated by language and read
            // the desired one based on the `locale` received from Next.js.
            data: await client.request(query, { locale: [locale] }),
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}