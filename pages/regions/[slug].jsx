import React from 'react'
import { getData } from '../../graphql/api';
import { GET_REGIONS, GET_REGION, GET_SERVICE_DETAILS, GET_SERVICE_DETAILS_BLOCK } from '../../graphql/queries';
import {
    destructureCollectionType, destructureCollectionTypeObject,
    destructureImageComponent,
    destructureSingleType
} from '../../utils/app';
import { useRouter } from 'next/router';
import Seo from '../../components/Seo';
import Header from '../../components/Layouts/Header';
import HeroOne from '../../components/Heroes/HeroOne';
import PageLayout from '../../components/Layouts/PageLayout';
import BlockLayoutTwo from '../../components/Layouts/BlockLayoutTwo';
import Heading from '../../components/Heading';
import Image from 'next/image';
import ButtonOne from '../../components/Buttons/ButtonOne';
import Contact from '../../components/Contact';
import Footer from '../../components/Layouts/Footer';
import BlockLayoutOne from '../../components/Layouts/BlockLayoutOne';
import { Accordion } from 'flowbite-react';

const Region = ({ data, serviceDetailsData, serviceDetailsBlockData }) => {
    const router = useRouter();
    const { locale } = router;
    const { data: regionData, globalData } = data;
    const { title, subtitle, description } = destructureSingleType(serviceDetailsBlockData.serviceDetailsBlock);
    const serviceDetails = destructureCollectionType(serviceDetailsData.serviceDetails);
    const regionForCurrentLang = destructureCollectionTypeObject(
        destructureCollectionType(regionData.regions).find(
            (region) => region.attributes.locale === locale));

    const { seo, hero, alternates, contents, localepages } = regionForCurrentLang;
    const { blogs, pages, services, socials, regions, contactblock } = globalData;

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pages} localepages={localepages} />
            <HeroOne content={hero} socialsRaw={socials} smallerTitle />
            <PageLayout>
                {
                    contents.map((content, i) => {
                        const { title, slug, summary, text, subtitle,
                            position, img, button } = content;

                        const { url, objectFit, width, height, alt }
                            = destructureImageComponent(img);
                        const { href, text: buttonText } = button[0] || {};

                        return (
                            position === `none` ? (
                                <section className={`xl:mx-28 xl:text-center 
                                block_container`} key={i}>
                                    <Heading title={title} subtitle={subtitle} />
                                    <div dangerouslySetInnerHTML={{ __html: text }} />
                                </section>
                            ) : (
                                <BlockLayoutTwo key={i} position={position}
                                    title={title} slug={slug}>
                                    <div className={`mb-8 md:mb-0 md:basis-10/12 xl:mr-8`}>
                                        <div className={`mb-7 md:mb-4 xl:mb-8 md:hidden`}>
                                            <Heading title={title} />
                                        </div>
                                        <Image src={url}
                                            objectFit={objectFit} alt={alt}
                                            width={width} height={height} />
                                    </div>
                                    <div className={`md:w-full 
                                    ${position === `right` ? `xl:ml-8` : `xl:mr-8`}`}>
                                        <div className={`hidden md:block`}>
                                            <Heading title={title} />
                                        </div>
                                        <h3 className={`text-base sm:text-lg md:mb-4 
                                        md:mt-6 xl:text-xl 2xl:text-2xl 2xl:mb-6`}>
                                            {summary}
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ __html: text }} />
                                        {
                                            button && (
                                                <ButtonOne href={href}
                                                    text={buttonText} wFit />
                                            )
                                        }
                                    </div>
                                </BlockLayoutTwo>
                            )
                        )
                    })
                }
                <BlockLayoutOne title={title}>
                    <div>
                        <Heading title={title} subtitle={subtitle} />
                        <div dangerouslySetInnerHTML={{ __html: description }}
                            className={`p`} />
                    </div>
                    <div id={`accordion`} className={`w-full mt-10 
                    lg:mt-12 xl:mt-0`}>
                        <Accordion>
                            {
                                serviceDetails.map((serviceDetail, index) => {
                                    const { title, description } = serviceDetail.attributes;

                                    return (
                                        <Accordion.Panel key={index}>
                                            <Accordion.Title>
                                                {title}
                                            </Accordion.Title>
                                            <Accordion.Content>
                                                <div className={`text-left text-sm lg:text-base`}>
                                                    {description}
                                                </div>
                                            </Accordion.Content>
                                        </Accordion.Panel>
                                    )
                                })
                            }
                        </Accordion>
                    </div>
                </BlockLayoutOne>
                <Contact content={contactblock} />
                <Footer servicesRaw={services} blogsRaw={blogs}
                    socialsRaw={socials} regionsRaw={regions} pagesRaw={pages}/>
            </PageLayout>
        </>
    )
}

export default Region

export async function getStaticPaths() {
    const regions =
        destructureCollectionType((await getData(
            GET_REGIONS, { locale: "all" }, false)).regions);

    const paths = regions.map((regionRaw) => {
        const { locale, slug } = destructureCollectionTypeObject(regionRaw);

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
    const data = await getData(GET_REGION, params);
    const serviceDetailsData = await getData(GET_SERVICE_DETAILS, { locale: [locale] }, false);
    const serviceDetailsBlockData = await getData(GET_SERVICE_DETAILS_BLOCK, { locale: [locale] }, false);

    return {
        props: { data, serviceDetailsData, serviceDetailsBlockData },
    }
}