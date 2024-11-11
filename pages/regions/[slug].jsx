import React from 'react'
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

const Region = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, contactBlockData, serviceDetailsData, serviceDetailsBlockData, regionData }) => {
    const { seo, alternates, alternateLangs, hero, contents } = regionData;
    const { title, subtitle, description } = serviceDetailsBlockData;

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header pages={pagesData} locales={localesData} alternateLangs={alternateLangs} />
            <HeroOne content={hero} socials={socialsData} smallerTitle />
            <PageLayout>
                {
                    contents.map((content, i) => {
                        const { title, slug, summary, text, subtitle,
                            position, img, button } = content;

                        const { src, objectFit, width, height, alt } = img;
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
                                        <Image
                                            src={src} width={width} height={height}
                                            alt={alt} style={{ objectFit: objectFit }} />
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
                                serviceDetailsData.map((serviceDetail, i) => {
                                    const { title, description } = serviceDetail;

                                    return (
                                        <Accordion.Panel key={i}>
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
                <Contact content={contactBlockData} />
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </>
    )
}

export default Region

export async function getStaticPaths() {
    const regionsDataNl = (await import(`../../lang/nl/regions.json`)).default;
    const regionsDataEn = (await import(`../../lang/en/regions.json`)).default;

    const regionsAllLocales = regionsDataNl.concat(regionsDataEn);

    const paths = regionsAllLocales.map((regionRaw) => {
        const { locale, slug } = regionRaw;

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
    const regionsData = (await import(`../../lang/${locale}/regions.json`)).default;

    const regionData = regionsData.find((p) => {
        return p.slug === params.slug;
    });

    return {
        props: {
            // Global data
            localesData: (await import(`../../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../../lang/${locale}/services.json`)).default,
            regionsData,
            pagesData: (await import(`../../lang/${locale}/pages.json`)).default,
            contactBlockData: (await import(`../../lang/${locale}/contactBlock.json`)).default,
            // End global data

            serviceDetailsData: (await import(`../../lang/${locale}/serviceDetails.json`)).default,
            serviceDetailsBlockData: (await import(`../../lang/${locale}/serviceDetailsBlock.json`)).default,
            regionData,
        },
    }
}