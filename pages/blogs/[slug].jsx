import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { GET_BLOG_SLUGS, GET_BLOG_BY_SLUG } from "../../config/queries";

const Blog = ({ data, links }) => {
    const { localizations } = links.blogs[0];
    const blog = data.blogs[0];

    const { title, summary, tags, image, content, date } = blog;
    const { img, alt } = image;

    const b = useTranslations('blog');

    return (
        <div className='blog'>
            <Seo title={title} description={summary} />
            <Header linksLocales={localizations} />
            <main className='mb-lg'>
                <article>
                    <div className='blog_heading'>
                        <h1 className="grand_title theme_color title_underline">{title}</h1>
                        <p className='mb-2'>{summary}</p>
                    </div>
                    <div className='image_container'>
                        <Image src={img.url} alt={alt}
                            layout="fill" objectFit='cover'
                            className='radius-md' priority />
                    </div>
                    <div className='blog_content'>
                        <div className='blog_info'>
                            <div className="tags">
                                {
                                    tags.map((tag, index) => {
                                        return <span className='tag' key={index}>{tag.name}</span>
                                    })
                                }
                            </div>
                            <small className='info_right text_with_icon'>
                                <FontAwesomeIcon icon="fa-solid fa-calendar-day" size='lg' />
                                <span>{date}</span>
                            </small>
                        </div>
                        <div className='blog_text'>
                            <div className='text mb-2' dangerouslySetInnerHTML={{ __html: content.html }} />
                            <div>
                                <Link href={'/blogs'}>
                                    <a className='button button_primary button_with_icon'>
                                        <FontAwesomeIcon icon="fa-solid fa-arrow-left-long" role={"button"} />
                                        <span className='font_bold'>{b('back')}</span>
                                    </a>
                                </Link>
                            </div>
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
            locale: localization.locale.toString(),
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
    const links = await client.request(GET_BLOG_SLUGS);

    return {
        props: {
            links,
            data,
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}