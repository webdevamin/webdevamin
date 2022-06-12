import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { gql, GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Hero from '../../components/Hero';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { GET_BLOGS } from "../../config/queries";

const Blog = ({ data }) => {
    const { blogs } = data;

    const t = useTranslations('blogs');
    const g = useTranslations('general');

    return (
        <>
            <Seo title={t('title')} description={t('description')} />
            <Header />
            <Hero title={t('title')} titleTwo={t('title_two')} />
            <main>

            </main>
        </>
    )
}

export default Blog;

export async function getStaticPaths({ locale }) {
    const client = new GraphQLClient(process.env.API_URL);
    const blogs = await client.request(GET_BLOGS, { locale: [locale] });

    const paths = blogs.map((blog) => {
        return {
            params: {
                slug: blog.slug.toString(),
            },
        };
    });

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps(context) {
    const client = new GraphQLClient(process.env.API_URL);
    const query = GET_BLOGS;

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

// export const getStaticProps: GetStaticProps = async (context) => {
//     const { id } = context.params as IParams;
  
//     const { data } = await client.query({
//       query: GET_ITEM,
//       variables: {
//         itemId: id,
//       },
//     });
  
//     return {
//       props: {
//         item: data.item.data,
//       },
//     };
//   };