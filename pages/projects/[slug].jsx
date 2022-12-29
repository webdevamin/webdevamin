import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
import { getData } from '../../graphql/api';
import { GET_PROJECT, GET_PROJECTS } from '../../graphql/queries';
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent,
} from '../../utils/app';
import { useRouter } from 'next/router';
import PageLayout from '../../components/Layouts/PageLayout';
import BlockLayoutTwo from '../../components/Layouts/BlockLayoutTwo';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import Heading from '../../components/Heading';
import Image from 'next/image';
import HeroOne from '../../components/Heroes/HeroOne';
import tabsImage from '../../public/images/tabs.svg';

const renderButtonText = (loc, link) => {
    if (loc === `en`) {
        return link ? `Visit project` : `Read more`;
    }

    return link ? `Bezoek project` : `Lees meer`;
}

const Project = ({ data }) => {
    const router = useRouter();
    const { locale } = router;
    const { data: projectData, globalData } = data;

    const projectForCurrentLang = destructureCollectionTypeObject(
        destructureCollectionType(projectData.projects).find(
            (project) => project.attributes.locale === locale));

    const { title, description, seo, slug,
        link, alt, imgTwo, technologies, descriptionText,
        technologiesText, alternates, localepages } = projectForCurrentLang;
    const { blogs, contactblock, services, socials, navigation, regions } = globalData;
    const button = [];

    button.push({
        href: link || `#${slug}`,
        text: renderButtonText(locale, link)
    });

    const heroContent = {
        title, text: description, button, img: imgTwo, alt
    }

    const longDescriptionTitle = locale === `en` ? `Description` : `Beschrijving`;
    const longDescriptionSubtitle = locale === `en` ? `In details` : `In details`;

    const technologiesTitle = locale === `en` ? `Technologies` : `Technologieën`;
    const technologiesSubtitle = locale === `en` ? `For tech savvy` : `For tech savvy`;

    return (
        <>
            <Seo seo={{ title, description: description, canonical: seo.canonical }}
                alternates={alternates} />
            <Header nav={navigation} localepages={localepages} />
            <HeroOne content={heroContent} socialsRaw={socials}
                externalLink={link ? true : false} disableImgSpace />
            <PageLayout>
                <BlockLayoutTwo title={longDescriptionTitle} slug={slug}>
                    <div className={`md:basis-5/12`}>
                        <Heading title={longDescriptionTitle}
                            subtitle={longDescriptionSubtitle} />
                        <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
                    </div>
                    <div className={`mt-10 md:mt-0 md:basis-6/12 hidden md:block`}>
                        <Image src={tabsImage} width={456} height={408}
                            objectFit={`cover`} alt={router.locale === `en` ?
                                `Tabs with information about individuals.` :
                                `Tabs met informatie over individuen.`} />
                    </div>
                </BlockLayoutTwo>
                <BlockLayoutTwo title={technologiesTitle} position={`right`}>
                    <div className={`md:basis-5/12`}>
                        <Heading title={technologiesTitle} subtitle={technologiesSubtitle} />
                        <div dangerouslySetInnerHTML={{ __html: technologiesText }} />
                    </div>
                    <div className={`grid grid-cols-3 sm:grid-cols-4 text-center md:flex 
                    gap-10 sm:gap-12 xl:gap-16 flex-wrap justify-center mt-16 
                    md:mt-0 md:basis-6/12`}>
                        {
                            technologies.map((tech, i) => {
                                const { url, width, height, objectFit, alt } =
                                    destructureImageComponent(tech.image);

                                return (
                                    <div key={i} className={`flex items-center justify-center`}>
                                        <Image src={url} width={width} height={height}
                                            alt={alt} objectFit={objectFit} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </BlockLayoutTwo>
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs} socialsRaw={socials} regionsRaw={regions} />
            </PageLayout>
        </>
    )
}

export default Project

export async function getStaticPaths() {
    const projects =
        destructureCollectionType((await getData(
            GET_PROJECTS, { locale: "all" }, false)).projects);

    const paths = projects.map((projectRaw) => {
        const { locale, slug } = destructureCollectionTypeObject(projectRaw);

        return {
            params: { slug }, locale
        }
    });

    return {
        paths,
        fallback: false,
    };
};

export async function getStaticProps({ locale, params }) {
    params.locale = [locale];
    const data = await getData(GET_PROJECT, params);

    return {
        props: { data },
    }
}