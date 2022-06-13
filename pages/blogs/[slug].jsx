import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { GraphQLClient } from 'graphql-request';
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { GET_BLOG_SLUGS, GET_BLOG_BY_SLUG } from "../../config/queries";

const Blog = ({ data }) => {
    const blog = data.blogs[0];

    const { title, summary, tags, image, content, date } = blog;
    const { img, alt, caption } = image;

    return (
        <div className='blog'>
            <Seo title={title} description={summary} />
            <Header />
            <main className='mb-lg'>
                <div className='titles'>
                    <h1 className="grand_title">Blog</h1>
                    <h2 className='large_title theme_color mt-0_5 title_underline'>{title}</h2>
                </div>
                <article>
                    <div className='heading'>
                        <div className="tags">
                            {
                                tags.map((tag, index) => {
                                    return <span className='tag' key={index}>{tag.name}</span>
                                })
                            }
                        </div>
                        <small className='heading_right'>{date}</small>
                    </div>
                    <figure className='image_container'>
                        <Image src={img.url} alt={alt}
                            layout="fill" objectFit='cover'
                            className='radius-md' priority />
                        <figcaption>{caption}</figcaption>
                    </figure>
                    <div className='blog_footer'>
                        <div className='text' dangerouslySetInnerHTML={{ __html: content.html }} />
                        <div>
                            <Link href={'/blogs'}>
                                <a className='button button_primary button_with_icon'>
                                    <FontAwesomeIcon icon="fa-solid fa-arrow-left-long" role={"button"} />
                                    <span className='font_bold'>Back to blogs</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    )
}

export default Blog;

export async function getStaticPaths() {
    const client = new GraphQLClient(process.env.API_URL);
    const data = await client.request(GET_BLOG_SLUGS);
    const { localizations } = data.blogs[0];

    const paths = localizations.map((localization) => {
        return {
            params: {
                slug: localization.slug.toString(),
            },
        };
    });

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps({ locale, params }) {
    const client = new GraphQLClient(process.env.API_URL);
    const data = await client.request(GET_BLOG_BY_SLUG, { locale: [locale], slug: params.slug });

    return {
        props: {
            data,
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}