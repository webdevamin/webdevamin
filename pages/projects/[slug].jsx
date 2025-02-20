import React from 'react'
import Header from '../../components/Layouts/Header';
import Seo from '../../components/Seo';
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

const Project = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, contactBlockData, projectData }) => {
    const router = useRouter();
    const { locale } = router;

    const { title, description, seo, slug,
        link, alt, imgTwo, imgThree, technologies, descriptionText,
        technologiesText, alternates, alternateLangs } = projectData;

    const button = [];

    button.push({
        href: link || `#${slug}`,
        text: renderButtonText(locale, link)
    });

    const heroContent = {
        title, text: description, button, image: imgTwo, alt
    }

    const { image, alt: altImgThree, width, height, objectFit } = imgThree || {};

    const longDescriptionTitle = locale === `en` ? `Description` : `Beschrijving`;
    const longDescriptionSubtitle = locale === `en` ? `In details` : `In details`;

    const technologiesTitle = locale === `en` ? `Technologies` : `Technologieën`;
    const technologiesSubtitle = locale === `en` ? `For tech savvy` : `For tech savvy`;

    return (
        <>
            <Seo seo={seo} alternates={alternates} includeCompanyName />
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroOne content={heroContent} socials={socialsData}
                externalLink={link ? true : false} disableImgSpace />
            <PageLayout>
                <BlockLayoutTwo title={longDescriptionTitle} slug={slug} noPadding={true}>
                    <div className={`md:basis-5/12`}>
                        <Heading title={longDescriptionTitle}
                            subtitle={longDescriptionSubtitle} />
                        <div dangerouslySetInnerHTML={{ __html: descriptionText }} />
                    </div>
                    <div className={`mt-10 md:mt-0 md:basis-6/12`}>
                        {
                            (imgThree && imgThree.image) ? (
                                <Image
                                    src={image.data.attributes.url} width={width} height={height} alt={altImgThree} style={{ objectFit: objectFit }} className={`h-[28rem] sm:h-[34rem] lg:h-auto`} />
                            ) : (
                                <Image
                                    src={tabsImage} width={456} height={408}
                                    alt={router.locale === `en` ?
                                        `Tabs with information about individuals.` :
                                        `Tabs met informatie over individuen.`}
                                    style={{ objectFit: `cover` }} />
                            )
                        }
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
                                const { src, width, height, objectFit, alt } = tech.image;

                                return (
                                    <div key={i} className={`flex items-center justify-center`}>
                                        <Image
                                            src={src} width={width} height={height}
                                            alt={alt} style={{ objectFit: objectFit }} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </BlockLayoutTwo>
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </>
    )
}

export default Project

export async function getStaticPaths() {
    const projectsDataNl = (await import(`../../lang/nl/projects.json`)).default;
    const projectsDataEn = (await import(`../../lang/en/projects.json`)).default;

    const projectsAllLocales = projectsDataNl.concat(projectsDataEn);

    const paths = projectsAllLocales.map((projectRaw) => {
        const { locale, slug } = projectRaw;

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
    const projectsData = (await import(`../../lang/${locale}/projects.json`)).default;

    const projectData = projectsData.find((p) => {
        return p.slug === params.slug;
    });

    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../../lang/${locale}/services.json`)).default,
            regionsData: (await import(`../../lang/${locale}/regions.json`)).default,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            projectData
        },
    }
}