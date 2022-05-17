import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { gql, GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Hero from '../../components/Hero';

const Blogs = ({ blogs, t }) => {
    if (blogs.length) {
        return (
            <p>Blogs available</p>
        )
    }
    
    return <p>{t('noBlogs')}</p>
}

const Index = ({ data }) => {
    const { blogs } = data;
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
                        <Blogs blogs={blogs} t={t} />
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
                url
            }
            slug
            summary
            tags
            title
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