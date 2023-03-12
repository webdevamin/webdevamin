import Header from '../../components/Layouts/Header'
import { getData } from '../../graphql/api';
import { GET_PROJECTS, GET_PROJECTSPAGE } from '../../graphql/queries';
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent, destructureSingleType
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

    const { data, globalData } = pageData;
    const { blogs, socials, contactblock, navigation, services: servicesGlobal, regions } = globalData;
    const { projectspage } = data;
    const { seo, alternates, localepages, hero, top, all } = destructureSingleType(projectspage);

    const projects = destructureCollectionType(projectsData.projects);

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header nav={navigation} localepages={localepages} />
            <HeroOne content={hero} socialsRaw={socials}
                ctaLink={all.slug} />
            <PageLayout>
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
                    socialsRaw={socials} regionsRaw={regions} />
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