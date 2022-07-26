import Seo from '../../components/Seo'
import Header from "../../components/Header";
import { GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from 'next/image';
import { GET_PROJECT_SLUGS, GET_PROJECT_BY_SLUG } from "../../config/queries";
import { useRouter } from 'next/router';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

const Project = ({ data, links }) => {
    const router = useRouter();
    const { projects } = links;
    const project = data.projects[0];

    const { title, summary, tags, image, content, date, link } = project;
    const { img, alt } = image;
    let projectOtherLang;

    projects.forEach((_project) => {
        const { localizations } = _project;

        const foundProject = localizations.find((localization) => {
            const { id, locale } = localization;
            return id === project.id && locale !== router.locale;
        });

        if (foundProject) projectOtherLang = foundProject;
    });

    const p = useTranslations('project');

    return (
        <div className='blog'>
            <Seo title={title} description={summary} />
            <Header otherLang={projectOtherLang} />
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
                            <div className='blog_text_row'>
                                <div>
                                    <Link href={'/projects'}>
                                        <a className='button button_primary button_with_icon'>
                                            <FontAwesomeIcon icon="fa-solid fa-arrow-left-long" role={"button"} />
                                            <span className='font_bold'>{p('back')}</span>
                                        </a>
                                    </Link>
                                </div>
                                {
                                    link && (
                                        <div>
                                            <a href={link} rel="noreferrer" target='_blank'
                                                className='button button_primary button_with_icon'>
                                                <FontAwesomeIcon icon={faArrowRightLong} role={"button"} />
                                                <span className='font_bold'>{p('link')}</span>
                                            </a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    )
}

export default Project;

export async function getStaticPaths() {
    const client = new GraphQLClient(process.env.API_URL);
    const data = await client.request(GET_PROJECT_SLUGS);
    const { projects } = data;

    const paths = projects.map((project) => {
        const { localizations } = project;

        return localizations.map((localization) => {
            return {
                params: {
                    slug: localization.slug.toString(),
                },
                locale: localization.locale.toString(),
            };
        })
    }).flat();

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps({ locale, params }) {
    const client = new GraphQLClient(process.env.API_URL);
    const data = await client.request(GET_PROJECT_BY_SLUG, { locale: [locale], slug: params.slug });
    const links = await client.request(GET_PROJECT_SLUGS);

    return {
        props: {
            links,
            data,
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}