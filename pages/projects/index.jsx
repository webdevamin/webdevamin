import Header from '../../components/Layouts/Header'
import { getData } from '../../graphql/api';
import { GET_PROJECTS, GET_PROJECTSPAGE } from '../../graphql/queries';
import { destructureCollectionType, destructureCollectionTypeObject, destructureImageComponent, destructureSingleType } from '../../utils/app';
import Seo from '../../components/Seo';
import PageLayout from '../../components/Layouts/PageLayout';
import { Carousel } from 'flowbite-react';
import Heading from '../../components/Heading';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import CardTwo from '../../components/Cards/CardTwo';
import HeroOne from '../../components/Heroes/HeroOne';

const Projects = ({ pageData, projectsData }) => {
    const router = useRouter();
    const { data, globalData } = pageData;
    const { blogs, socials, contactblock, services: servicesGlobal } = globalData;
    const { projectspage } = data;
    const { seo, alternates, hero, top, all } = destructureSingleType(projectspage);

    const projects = destructureCollectionType(projectsData.projects);
    const topProjects = projects.filter((project) => {
        return project.attributes.showcase
    });

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header />
            <HeroOne content={hero} socialsRaw={socials}
                ctaLink={projects.length < 5 ? `#${all.slug}` : `#${top.slug}`} />
            <PageLayout>
                <section id={top.slug} className={`flex flex-col md:flex-row-reverse 
                md:items-center md:gap-10 block_container ${projects.length < 5 && `hidden`}`}>
                    <div className={`md:text-center md:basis-3/12`}>
                        <Heading title={top.title} subtitle={top.subtitle} />
                    </div>
                    <div className={`md:basis-9/12`}>
                        <Carousel indicators={false}>
                            {
                                topProjects.map((topProject, index) => {
                                    const { img, slug } = destructureCollectionTypeObject(topProject);
                                    const { url, alt } = destructureImageComponent(img);

                                    return (
                                        <Link href={`/projects/${slug}`} key={index}>
                                            <a>
                                                <article key={index} className={`relative`}>
                                                    <div className={`relative h-[calc(100vw/1.75)] 
                                                    sm:h-[calc(100vw/1.75)] md:h-[calc(100vw/2.4)] 
                                                    lg:h-[calc(100vw/2.6)] xl:h-[calc(100vw/2.8)] 
                                                    2xl:h-[calc(100vw/3)] max-h-[600px]`}>
                                                        <Image src={url} layout={`fill`}
                                                            alt={alt} className={`rounded-xl`}
                                                            objectFit={`cover`} />
                                                    </div>
                                                </article>
                                            </a>
                                        </Link>
                                    )
                                })
                            }
                        </Carousel>
                    </div>
                </section>
                <section id={all.slug} className={`block_container`}>
                    <Heading title={all.title} subtitle={all.subtitle} />
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
                <Footer servicesRaw={servicesGlobal} blogsRaw={blogs}
                    socialsRaw={socials} />
            </PageLayout>
        </>
    )
}

export default Projects

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_PROJECTSPAGE, { locale: [locale] });
    const projectsData = await getData(GET_PROJECTS, { locale: [locale] }, false);

    return {
        props: { pageData, projectsData },
    }
}