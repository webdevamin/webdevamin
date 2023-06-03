import Header from '../../components/Layouts/Header'
import { getData } from '../../graphql/api';
import { GET_PAGE, GET_PROJECTS } from '../../graphql/queries';
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent
} from '../../utils/app';
import Seo from '../../components/Seo';
import PageLayout from '../../components/Layouts/PageLayout';
import Heading from '../../components/Heading';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import CardTwo from '../../components/Cards/CardTwo';
import HeroOne from '../../components/Heroes/HeroOne';

const Projects = ({ pageData, projectsData }) => {
    const router = useRouter();

    const { globalData } = pageData;
    const page = destructureCollectionTypeObject(pageData.data.pages, true);

    const { blogs, pages, services, socials,
        regions, contactblock } = globalData;

    const { seo, blocks, alternates, localepages } = page;
    const projects = destructureCollectionType(projectsData.projects);

    const { slug, subtitle, title } = blocks[1];
    
    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pages} localepages={localepages} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socialsRaw={socials} ctaLink={`#${slug}`} />
            <PageLayout>
                <section id={slug} className={`block_container`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`overflow-x-auto overscroll-x-contain gap-6 
                    pb-6 md:pb-0 md:pr-0 md:w-full md:grid 
                    md:grid-cols-2 xl:grid-cols-3 md:gap-10 md:mt-7 lg:mt-14 
                    ${projects.length >= 2 && `pr-[20%] w-screen flex`}`}>
                        {
                            projects.map((project, index) => {
                                const { title, img, slug, description } =
                                    destructureCollectionTypeObject(project);
                                const { url, alt } = destructureImageComponent(img);
                                const text = router.locale === `en` ? `Read more` : `Verder lezen`;

                                return (
                                    <Link href={`/projects/${slug}`}
                                        key={index} >
                                        <a className={`min-w-[75vw] sm:min-w-[53vw] md:min-w-0`}>
                                            <CardTwo imgUrl={url} title={title} text={text}
                                                subtitle={description} slug={slug} alt={alt} />
                                        </a>
                                    </Link>
                                )

                            })
                        }
                    </div>
                </section>
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs}
                    socialsRaw={socials} regionsRaw={regions} pagesRaw={pages}/>
            </PageLayout>
        </>
    )
}

export default Projects

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_PAGE, { "slug": "projects", "locale": [locale] });
    const projectsData = await getData(GET_PROJECTS, { locale: [locale] }, false);

    return {
        props: { pageData, projectsData },
    }
}